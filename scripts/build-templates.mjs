#!/usr/bin/env node
/**
 * ==================================================================
 * build-templates.mjs —— 生成可双击打开的单文件模板
 * ==================================================================
 *
 * 为什么需要：
 *   浏览器通过 file:// 打开页面时，不允许 <script type="module"> 用相对路径加载本地文件
 *   （跨域限制）。而共享核心 assets/surface/*.js 需要被原生模板和 React 版共同使用。
 *   所以：源文件里正常写相对 import（通过 http 访问可以直接运行），
 *   构建时把这些相对 import 递归内联进同一个 <script type="module">，得到单文件。
 *
 * 规则：
 *   - 输入：assets/templates/src/*.html
 *   - 输出：assets/templates/<同名>.html（文件头会标注"由脚本生成，请改源文件"）
 *   - 只内联相对路径的 import（'./x.js'、'../x.js'）；'three'、'lenis' 这类裸模块名
 *     保留原样，由页面里的 import map 指向 CDN
 *   - 被内联文件里的相对 import 会先被递归内联（依赖在前），同一文件只内联一次
 *   - 各文件的顶层变量名不能重复（它们会落在同一个模块作用域里）
 *
 * 用法：
 *   node scripts/build-templates.mjs          生成
 *   node scripts/build-templates.mjs --check  只检查产物是否与源文件同步（CI 用），不同步则退出码 1
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'assets/templates/src');
const OUT_DIR = path.join(ROOT, 'assets/templates');
const CHECK_ONLY = process.argv.includes('--check');

// 匹配一条相对路径的静态 import 语句。[^;]*? 保证不会跨过分号吞掉上一条语句
const RELATIVE_IMPORT = /^[ \t]*import\s+[^;]*?\s+from\s+['"](\.{1,2}\/[^'"]+)['"][ \t]*;?[ \t]*\r?\n?/gm;
// 匹配 HTML 里的 <script type="module"> ... </script>
const MODULE_SCRIPT = /(<script\s+type="module">)([\s\S]*?)(<\/script>)/g;

/**
 * 递归内联一段模块代码里的相对 import。
 * @param {string} code 模块源码
 * @param {string} baseDir 这段代码所在目录（用于解析相对路径）
 * @param {Set<string>} seen 已内联过的文件（绝对路径）
 * @returns {Promise<string>} 依赖代码 + 去掉相对 import 后的原代码
 */
async function inlineImports(code, baseDir, seen) {
  const specifiers = [...code.matchAll(RELATIVE_IMPORT)].map((match) => match[1]);
  const body = code.replace(RELATIVE_IMPORT, '');
  let dependencies = '';
  for (const specifier of specifiers) {
    const file = path.resolve(baseDir, specifier);
    if (seen.has(file)) continue;
    seen.add(file);
    const source = await readFile(file, 'utf8');
    const inlined = await inlineImports(source, path.dirname(file), seen);
    const label = path.relative(ROOT, file).split(path.sep).join('/');
    dependencies += `\n// ===== 内联自 ${label} =====\n${inlined.trim()}\n// ===== ${label} 结束 =====\n`;
  }
  return dependencies + body;
}

async function buildTemplate(fileName) {
  const srcPath = path.join(SRC_DIR, fileName);
  const html = await readFile(srcPath, 'utf8');

  // 每个 module script 各自内联（互相之间不共享已内联集合）
  let output = '';
  let lastIndex = 0;
  for (const match of html.matchAll(MODULE_SCRIPT)) {
    const [whole, open, code, close] = match;
    const inlined = await inlineImports(code, SRC_DIR, new Set());
    output += html.slice(lastIndex, match.index) + open + inlined + close;
    lastIndex = match.index + whole.length;
  }
  output += html.slice(lastIndex);

  // 文件头标注：这是生成物
  const banner =
    `<!-- 此文件由 scripts/build-templates.mjs 从 assets/templates/src/${fileName} 生成，` +
    `请修改源文件后运行 npm run build:templates -->\n`;
  output = output.replace(/^(<!DOCTYPE html>\r?\n)/i, `$1${banner}`);
  // 源文件头部"本文件是源文件"的提示在产物里不再成立，换成产物说明
  output = output.replace(
    /  ⚠ 本文件是源文件：[\s\S]*?生成到 assets\/templates\/。\n/,
    '  ⚠ 本文件是生成物：共享核心已内联，可直接双击打开。\n',
  );

  const outPath = path.join(OUT_DIR, fileName);
  const label = path.relative(ROOT, outPath).split(path.sep).join('/');
  if (CHECK_ONLY) {
    const current = await readFile(outPath, 'utf8').catch(() => '');
    if (current !== output) {
      console.error(`✗ ${label} 与源文件不同步，请运行 npm run build:templates`);
      return false;
    }
    console.log(`✓ ${label}`);
    return true;
  }
  await writeFile(outPath, output);
  console.log(`built ${label}`);
  return true;
}

const files = (await readdir(SRC_DIR)).filter((name) => name.endsWith('.html'));
const results = await Promise.all(files.map(buildTemplate));
if (results.includes(false)) process.exit(1);
