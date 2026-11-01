#!/usr/bin/env node
/**
 * ==================================================================
 * check-contrast.mjs —— 浅色 editorial 模板的 WCAG 对比度检查
 * ==================================================================
 *
 * 为什么：车队的品牌色常常是高饱和的亮色（Papaya、PETRONAS 青绿、Lava Red），
 * 直接拿来当文字色或"白字按钮"的底色，对比度会低于 WCAG AA。品牌色可以保留给
 * 色块和大面积识别，但落到文字上必须有一个更深的"文字版"。这个脚本把这条规则固定下来，
 * 以后新增车队或改色号时，不达标会直接失败，而不是靠肉眼发现。
 *
 * 检查项（对 assets/templates/*-editorial.html）：
 *   - 正文 --ink、辅助文字 --muted、说明文字 --ghost 在 --paper 与 --fog 上 ≥ 4.5
 *   - 主按钮 .pill-filled 的文字与背景 ≥ 4.5
 *   - 主色用作文字（--accent-text，缺省回退 --accent）在 --paper 上 ≥ 4.5
 *   - 首屏超大斜体字（hero em，视为"大字号"）≥ 3.0
 *
 * 用法：node scripts/check-contrast.mjs        不达标则退出码 1
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'assets/templates');

/** @param {string} hex #RRGGBB @returns {number} 相对亮度（WCAG 2.x） */
function luminance(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** @returns {number} 两个 #RRGGBB 颜色的对比度，范围 1~21 */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** 读取 :root 里的 `--name: #RRGGBB` */
function readTokens(css) {
  const root = css.match(/:root\s*\{([\s\S]*?)\n\s*\}/)?.[1] ?? '';
  const tokens = {};
  for (const m of root.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})\b/g)) tokens[m[1]] = m[2].toUpperCase();
  return tokens;
}

/** 把 `var(--x)` 或 `#RRGGBB` 解析成具体色值，无法解析返回 null */
function resolve(value, tokens) {
  const v = value?.trim();
  if (!v) return null;
  if (/^#[0-9A-Fa-f]{6}$/.test(v)) return v.toUpperCase();
  const m = v.match(/^var\(--([\w-]+)\)$/);
  return m ? tokens[m[1]] ?? null : null;
}

/** 取某条 CSS 规则里的属性值 */
function ruleProp(css, selector, prop) {
  const rule = css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`))?.[1];
  return rule?.match(new RegExp(`(?:^|[;\\s])${prop}:\\s*([^;]+)`))?.[1];
}

const files = (await readdir(DIR)).filter((f) => f.endsWith('-editorial.html')).sort();
let failures = 0;

for (const file of files) {
  const css = await readFile(path.join(DIR, file), 'utf8');
  const t = readTokens(css);
  const results = [];
  const check = (label, fg, bg, min) => {
    if (!fg || !bg) return;
    const ratio = contrast(fg, bg);
    results.push({ label, ratio, min, ok: ratio >= min });
  };

  for (const surface of ['paper', 'fog']) {
    check(`ink/${surface}`, t.ink, t[surface], 4.5);
    check(`muted/${surface}`, t.muted, t[surface], 4.5);
    check(`ghost/${surface}`, t.ghost, t[surface], 4.5);
  }

  const btnBg = resolve(ruleProp(css, '.pill-filled', 'background'), t);
  const btnFg = resolve(ruleProp(css, '.pill-filled', 'color'), t);
  check('按钮文字/按钮底', btnFg, btnBg, 4.5);

  const accentText = t["accent-text"] ?? t.accent;
  const heroText = t["accent-display"] ?? accentText;
  if (t.accent) {
    check('主色文字/paper', accentText, t.paper, 4.5);
    check("hero 大字/paper", heroText, t.paper, 3.0);
  }

  const bad = results.filter((r) => !r.ok);
  failures += bad.length;
  const summary = results.map((r) => `${r.ok ? '✓' : '✗'} ${r.label} ${r.ratio.toFixed(1)}`).join('  ');
  console.log(`${bad.length ? '✗' : '✓'} ${file}\n    ${summary}`);
}

if (failures) {
  console.error(`\n${failures} 项对比度不达标（WCAG AA：正文 4.5，大字 3.0）。`);
  process.exit(1);
}
console.log('\n全部达标。');
