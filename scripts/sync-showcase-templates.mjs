#!/usr/bin/env node
/**
 * sync-showcase-templates.mjs —— 把单文件模板同步到 showcase/public/templates/
 *
 * 为什么：assets/templates/ 是模板的唯一来源。showcase 需要在构建/开发时能通过
 * /templates/*.html 访问它们，但没必要把同一批 1.5MB 文件在 git 里存两份，
 * 所以 showcase/public/templates/ 不入库，由 predev / prebuild 自动生成。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'assets/templates');
const DEST = path.join(ROOT, 'showcase/public/templates');

fs.mkdirSync(DEST, { recursive: true });
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.html'));
for (const f of files) fs.copyFileSync(path.join(SRC, f), path.join(DEST, f));
console.log(`已同步 ${files.length} 份模板到 showcase/public/templates/`);
