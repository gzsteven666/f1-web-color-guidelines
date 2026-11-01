#!/usr/bin/env node
/**
 * ==================================================================
 * tokens.mjs —— 车队色板的单一来源：tokens/<team>.json
 * ==================================================================
 *
 * 为什么：同一个车队的色值曾经散落在三处——references/<team>.md（文档）、
 * assets/surface/teams.js（WebGL 车漆预设）、showcase/src/data/teamsData.ts（展示数据），
 * 改一处很容易漏掉另外两处，检查时发现过不一致（例如车漆 shader 用的碳黑和文档里的不同）。
 * 这里把"品牌色板"固定在 tokens/*.json，并让脚本去核对另外几处，而不是靠人记得同步。
 *
 * 每个 token 的 scope：
 *   web      网页用的色值，必须出现在对应的 references/<team>.md
 *   surface  为 WebGL 渲染调过的色值（车漆底色、笔尖光），必须出现在 assets/surface/teams.js
 * 所有 HEX 都是网页复现建议值，不是官方色号（officialHex: false）。
 *
 * 用法：
 *   node scripts/tokens.mjs           生成 tokens/tokens.css
 *   node scripts/tokens.mjs --check   核对 JSON、文档、预设、展示数据与 tokens.css 是否一致；不一致则退出码 1
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS_DIR = path.join(ROOT, 'tokens');
const CHECK = process.argv.includes('--check');

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const files = (await readdir(TOKENS_DIR)).filter((f) => f.endsWith('.json')).sort();
const teams = [];
for (const f of files) teams.push(JSON.parse(await readFile(path.join(TOKENS_DIR, f), 'utf8')));

/** 生成 tokens.css：每个车队一个 [data-f1-team] 作用域，可以直接复制到项目里 */
function buildCss() {
  const blocks = teams.map((t) => {
    const lines = t.tokens
      .filter((k) => k.scope === 'web')
      .map((k) => `  --f1-${slug(k.name)}: ${k.hex.toLowerCase()};  /* ${k.role} */`);
    return `/* ${t.team} · ${t.car} */\n[data-f1-team="${t.id}"] {\n${lines.join('\n')}\n}`;
  });
  return `/* 由 scripts/tokens.mjs 生成，请改 tokens/*.json 后重新生成。
   HEX 为网页复现建议值，不是官方色号；非官方、与各车队无关联。 */\n\n${blocks.join('\n\n')}\n`;
}

const cssPath = path.join(TOKENS_DIR, 'tokens.css');
const css = buildCss();

if (!CHECK) {
  await writeFile(cssPath, css);
  console.log(`已生成 tokens/tokens.css（${teams.length} 队）`);
  process.exit(0);
}

const errors = [];
const teamsJs = (await readFile(path.join(ROOT, 'assets/surface/teams.js'), 'utf8')).toUpperCase();
const teamsTs = (await readFile(path.join(ROOT, 'showcase/src/data/teamsData.ts'), 'utf8')).toUpperCase();

for (const t of teams) {
  const doc = (await readFile(path.join(ROOT, t.reference), 'utf8')).toUpperCase();
  if (t.officialHex !== false) errors.push(`${t.id}: officialHex 必须为 false（HEX 都是复现值）`);
  for (const k of t.tokens) {
    const hex = k.hex.toUpperCase();
    if (!/^#[0-9A-F]{6}$/.test(hex)) errors.push(`${t.id}/${k.name}: HEX 格式不对 ${k.hex}`);
    if (!['web', 'surface'].includes(k.scope)) errors.push(`${t.id}/${k.name}: scope 只能是 web 或 surface`);
    if (k.scope === 'web' && !doc.includes(hex)) errors.push(`${t.id}/${k.name}: ${hex} 没有出现在 ${t.reference}`);
    if (k.scope === 'surface' && !teamsJs.includes(hex)) errors.push(`${t.id}/${k.name}: ${hex} 没有出现在 assets/surface/teams.js`);
    if (!teamsTs.includes(hex)) errors.push(`${t.id}/${k.name}: ${hex} 没有出现在 showcase/src/data/teamsData.ts`);
  }
}

const onDisk = await readFile(cssPath, 'utf8').catch(() => '');
if (onDisk !== css) errors.push('tokens/tokens.css 与 tokens/*.json 不同步，请运行 npm run tokens');

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'));
  console.error(`\n${errors.length} 处不一致。`);
  process.exit(1);
}
console.log(`✓ ${teams.length} 队、${teams.reduce((n, t) => n + t.tokens.length, 0)} 个 token 与文档 / 预设 / 展示数据 / tokens.css 一致`);
