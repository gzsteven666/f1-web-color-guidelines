#!/usr/bin/env node
/**
 * ==================================================================
 * smoke-screenshots.mjs —— 模板截图冒烟检查
 * ==================================================================
 *
 * 为什么：Red Bull / Audi / Alpine / Racing Bulls / Haas 的 surface 页曾经"黑屏"
 * 进了主分支——挂载参数写错，正文因为没人加 .active 类而一直透明，
 * 构建、类型检查都通过，只有打开页面才看得到。这个脚本把"打开页面看一眼"自动化：
 * 对 assets/templates/ 下每个单文件模板，在桌面和手机两种视口各打开一次，检查
 *   1. 首屏大标题可见（不透明、在视口内、有尺寸）
 *   2. 没有横向滚动条（scrollWidth ≤ 视口宽度）
 *   3. 没有未捕获的 JS 异常
 *   4. 截图不是纯色（PNG 体积 > 阈值：纯黑 / 纯白帧压缩后只有几 KB）
 * 截图保存在 test-results/screenshots/，CI 里作为产物上传，方便人工复核。
 *
 * 工具选型见 README「开发与检查」：Playwright（Apache-2.0）。
 *
 * 环境变量：
 *   PW_CHANNEL   使用本机已安装的浏览器（例如 chrome），不设则用 Playwright 自带的 chromium
 *   ONLY         只检查文件名包含该子串的模板，例如 ONLY=red-bull
 *   TEMPLATES_DIR 检查别的目录里的模板（用来验证检查本身能抓到旧的黑屏版本）
 *
 * 用法：node scripts/smoke-screenshots.mjs        有失败则退出码 1
 */
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATES = process.env.TEMPLATES_DIR ? path.resolve(process.env.TEMPLATES_DIR) : path.join(ROOT, 'assets/templates');
const OUT = path.join(ROOT, 'test-results/screenshots');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, minBytes: 20_000 },
  { name: 'mobile', width: 390, height: 844, minBytes: 8_000 },
];
// 表面页的入场动效有 3 秒兜底（见 SKILL 里的 failsafe），等它跑完再看
const SETTLE_MS = 3800;
// 无显卡的 CI 上软件渲染很慢，入场过渡可能在 SETTLE_MS 时仍走到一半（opacity 0.8~0.9），
// 所以到点后再给一段轮询时间等标题完全不透明；真正卡在透明（黑屏 bug）的页面仍会超时失败
const OPACITY_WAIT_MS = 10_000;

const files = (await readdir(TEMPLATES))
  .filter((f) => f.endsWith('.html'))
  .filter((f) => !process.env.ONLY || f.includes(process.env.ONLY))
  .sort();
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  channel: process.env.PW_CHANNEL || undefined,
  // 无显卡的 CI 机器上用软件渲染跑 WebGL，车漆层才能出画面
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

let failures = 0;
for (const file of files) {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.name === 'mobile' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto(pathToFileURL(path.join(TEMPLATES, file)).href, { waitUntil: 'load', timeout: 45_000 });
    await page.waitForTimeout(SETTLE_MS);
    await page
      .waitForFunction(() => {
        const h = document.querySelector('h1, .hero-display, .hero-title');
        return !h || Number(getComputedStyle(h).opacity) >= 0.99;
      }, undefined, { timeout: OPACITY_WAIT_MS })
      .catch(() => {});

    const info = await page.evaluate(() => {
      const h = document.querySelector('h1, .hero-display, .hero-title');
      const r = h?.getBoundingClientRect();
      return {
        hasHeading: Boolean(h),
        opacity: h ? Number(getComputedStyle(h).opacity) : 0,
        inView: Boolean(r && r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0),
        overflowX: document.documentElement.scrollWidth - innerWidth,
        noWebgl: document.documentElement.classList.contains('no-webgl'),
      };
    });
    const shot = await page.screenshot({ path: path.join(OUT, `${file.replace('.html', '')}-${vp.name}.png`) });

    const problems = [];
    if (!info.hasHeading) problems.push('找不到首屏标题');
    else if (info.opacity < 0.99) problems.push(`标题仍是透明的 (opacity ${info.opacity})`);
    else if (!info.inView) problems.push('标题不在首屏内');
    if (info.overflowX > 1) problems.push(`横向溢出 ${info.overflowX}px`);
    if (errors.length) problems.push(`JS 异常：${errors[0].slice(0, 120)}`);
    if (shot.length < vp.minBytes) problems.push(`截图疑似空白（${shot.length} 字节）`);

    const note = info.noWebgl ? '（WebGL 回退）' : '';
    console.log(`${problems.length ? '✗' : '✓'} ${file.padEnd(34)} ${vp.name.padEnd(8)} ${problems.join('；')}${note}`);
    failures += problems.length ? 1 : 0;
    await context.close();
  }
}
await browser.close();

if (failures) {
  console.error(`\n${failures} 个页面检查失败，截图见 ${path.relative(ROOT, OUT)}/`);
  process.exit(1);
}
console.log(`\n全部通过，截图见 ${path.relative(ROOT, OUT)}/`);
