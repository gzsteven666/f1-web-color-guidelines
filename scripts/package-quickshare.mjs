import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const SHOWCASE_DIR = path.resolve(ROOT_DIR, 'showcase');
const TEMPLATES_DIR = path.resolve(ROOT_DIR, 'assets/templates');
const SHOWCASE_PUBLIC_TEMPLATES = path.resolve(SHOWCASE_DIR, 'public/templates');
const DIST_DIR = path.resolve(SHOWCASE_DIR, 'dist');
const OUTPUT_ZIP = path.resolve(ROOT_DIR, 'f1-surface-quickshare.zip');

console.log('🏎️ [QuickShare Packager] 开始制作 QuickShare 专用静态部署包...\n');

// 1. 确保模板同步到 showcase/public/templates
console.log('📦 步骤 1/4: 同步最新单文件 HTML 模板...');
if (!fs.existsSync(SHOWCASE_PUBLIC_TEMPLATES)) {
  fs.mkdirSync(SHOWCASE_PUBLIC_TEMPLATES, { recursive: true });
}

const templateFiles = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.html'));
for (const file of templateFiles) {
  const src = path.join(TEMPLATES_DIR, file);
  const dest = path.join(SHOWCASE_PUBLIC_TEMPLATES, file);
  fs.copyFileSync(src, dest);
}
console.log(`   ✓ 已同步 ${templateFiles.length} 份独立 HTML 模板到 showcase/public/templates/`);

// 2. 构建 Showcase 应用 (带有 base: './' 相对路径)
console.log('\n⚙️ 步骤 2/5: 执行 Showcase 生产构建 (Vite base: "./")...');
execSync('npm --prefix showcase run build', { stdio: 'inherit', cwd: ROOT_DIR });
console.log('   ✓ Showcase 构建完成，资源已转换为相对寻址');

// 3. 将 CSS 与 JS 内联到 index.html (彻底解决 QuickShare CSP sandbox: allow-scripts 下 Origin: null 导致的 CORS 拦截)
console.log('\n💉 步骤 3/5: 将 CSS 和 JS 内联到 index.html (免疫 QuickShare CSP sandbox 跨域限制)...');
const indexPath = path.join(DIST_DIR, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// 内联 CSS
const cssMatch = html.match(/<link rel="stylesheet"[^>]*href="\.?\/assets\/([^"]+)"[^>]*>/);
if (cssMatch) {
  const cssFile = path.join(DIST_DIR, 'assets', cssMatch[1]);
  if (fs.existsSync(cssFile)) {
    const cssContent = fs.readFileSync(cssFile, 'utf-8');
    html = html.replace(cssMatch[0], () => `<style>\n${cssContent}\n</style>`);
    console.log(`   ✓ 已内联样式表: ${cssMatch[1]}`);
  }
}

// 移除原有的外部 script 并将完整 JS 脚本以 IIFE 方式内联到 </body> 之前
const jsMatch = html.match(/<script type="module"[^>]*src="\.?\/assets\/([^"]+)"[^>]*><\/script>/);
if (jsMatch) {
  const jsFile = path.join(DIST_DIR, 'assets', jsMatch[1]);
  if (fs.existsSync(jsFile)) {
    let jsContent = fs.readFileSync(jsFile, 'utf-8');
    // 防止 HTML 解析器误触闭合标签
    jsContent = jsContent.replace(/<\/script/gi, '<\\/script');
    html = html.replace(jsMatch[0], '');
    const bodyCloseIdx = html.indexOf('</body>');
    if (bodyCloseIdx !== -1) {
      html = html.slice(0, bodyCloseIdx) + `  <script>\n(function(){\n${jsContent}\n})();\n  </script>\n` + html.slice(bodyCloseIdx);
    }
    console.log(`   ✓ 已完整内联 JS 逻辑: ${jsMatch[1]} (精确拼装无特殊字符丢失，置于 </body> 前)`);
  }
}

fs.writeFileSync(indexPath, html, 'utf-8');

// 4. 在 dist 中生成部署说明文档
console.log('\n📝 步骤 4/5: 写入 QuickShare 部署说明文档...');
const deployReadme = `========================================================================
🏁 F1 2026 连续车身 PBR 材质与 5 大车队 React Bits 动态展厅
========================================================================

本压缩包已配置绝对兼容的相对路径 (base: './')，专门为 QuickShare
(https://github.com/gzsteven666/quickshare) 以及各类静态托管环境制作。

【目录内容】
  - index.html                      React Bits + 3D PBR 交互式工程总览主入口
  - assets/                         JS / CSS 静态资源包 (相对寻址)
  - templates/                      5 大车队纯原生单文件模板 (零依赖)
      ├─ mercedes-surface.html      梅赛德斯 W17 连续车身 3D 模板
      ├─ ferrari-surface.html       法拉利 SF-26 连续车身 3D 模板
      ├─ mclaren-surface.html       迈凯伦 MCL39 连续车身 3D 模板
      ├─ aston-martin-surface.html  阿斯顿马丁 AMR26 连续车身 3D 模板
      └─ cadillac-surface.html      凯迪拉克 MAC-01 连续车身 3D 模板
  - favicon.svg / icons.svg         矢量图标

------------------------------------------------------------------------
【部署至 QuickShare (gzsteven666/quickshare)】
------------------------------------------------------------------------
方式 A (推荐：作为子应用部署，保持原有的多分享功能)：
  1. 打开你的 QuickShare 根目录，进入 public/ 文件夹
  2. 在 public/ 下新建 f1-surface 文件夹：public/f1-surface/
  3. 将本压缩包内的所有文件解压到 public/f1-surface/
  4. 启动 QuickShare (npm start 或 node index.js)
  5. 浏览器访问：http://<服务器IP或域名>:<端口>/f1-surface/

方式 B (作为 QuickShare 根目录默认首页)：
  1. 将本压缩包直接解压到 QuickShare 的 public/ 根目录
  2. 启动服务，直接访问：http://<服务器IP或域名>:<端口>/

方式 C (直接上传分享)：
  1. 在 QuickShare 网页中直接上传 f1-surface-quickshare.zip
  2. 接收方下载后在本地使用任一静态服务器 (如 npx serve .) 即可 1 秒启动预览！
========================================================================
`;

fs.writeFileSync(path.join(DIST_DIR, 'QUICKSHARE_DEPLOY.txt'), deployReadme, 'utf-8');
console.log('   ✓ QUICKSHARE_DEPLOY.txt 写入完成');

// 5. 打包为 ZIP 压缩包 (调用 Python zipfile 标准库，无需额外 npm 依赖)
console.log('\n🗜️ 步骤 5/5: 打包为 ZIP 压缩包...');
const pythonCode = `
import os, sys, zipfile

source_dir = sys.argv[1]
output_zip = sys.argv[2]

if os.path.exists(output_zip):
    os.remove(output_zip)

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, source_dir)
            zf.write(full_path, rel_path)

file_size_kb = os.path.getsize(output_zip) / 1024
print(f"   [OK] Zip created: {output_zip} ({file_size_kb:.2f} KB)")
`;

const res = spawnSync('python', ['-c', pythonCode, DIST_DIR, OUTPUT_ZIP], {
  encoding: 'utf-8',
  stdio: 'inherit',
  env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
});

if (res.error) {
  throw res.error;
}

console.log('\n🎉 QuickShare 专用部署包打包完成！');
