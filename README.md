# F1 Web Color Guidelines Skill

一个面向网页设计与前端实现的 Codex skill，用来把 F1 车队的视觉语言转成可执行的网页配色规范。

当前版本覆盖 5 支车队：

- Aston Martin
- Mercedes-AMG PETRONAS
- McLaren
- Ferrari
- Cadillac

这个 skill 适合以下任务：

- 设计或改造车队风格网页
- 生成网页配色方案和 design tokens
- 输出 CSS variables / Tailwind 颜色映射
- 生成给 AI 设计工具使用的提示词
- 审查现有页面是否“像这支车队”，而不是只是“换了个颜色”

## 仓库内容

```text
.
├─ F1车队配色设计指引V2.md
├─ README.md
├─ f1-web-color-guidelines.skill
└─ f1-web-color-guidelines/
   ├─ SKILL.md
   └─ references/
```

说明：

- `f1-web-color-guidelines/` 是 skill 源码目录
- `f1-web-color-guidelines.skill` 是已打包好的可分发文件
- `F1车队配色设计指引V2.md` 是整理 skill 时参考的原始总稿

## Skill 能做什么

这个 skill 不只是提供几个色号，而是把每支车队拆成一套网页设计规则：

- 核心颜色 token
- 页面配色占比
- 组件级映射
- 材质与渐变逻辑
- Prompt 模板
- 反模式与常见误区

它还会强调不同车队之间的根本差异，避免把所有页面都做成同一套“深色 F1 科技风”模板换色。

## 2026 资料校对

当前版本已按 2026-03-09 可核实到的官方 2026 发布资料校对。

已写入 skill 的官方来源索引见：

- [`f1-web-color-guidelines/references/official-2026-sources.md`](C:/Users/61364/Desktop/F1配色skills/f1-web-color-guidelines/references/official-2026-sources.md)

重点更新包括：

- Aston Martin：强调 `considered` / `deliberate` 的整体工程秩序
- Mercedes：强调前银后黑、PETRONAS 流线、AMG rhombus 纹理
- McLaren：强调冠军延续下的 papaya / anthracite / teal 关系
- Ferrari：更新为 2026 的更亮 Rosso Scuderia、白色结构角色、gloss paint
- Cadillac：强调 `fast standing still` 与 chevron 渐变逻辑

## 如何使用

如果你已经在 Codex / skills 环境中使用 skill：

1. 安装或加载 `f1-web-color-guidelines.skill`
2. 在请求里明确说出车队或场景
3. 让 agent 输出配色规范、tokens、实现代码或审查意见

示例请求：

- “把这个 dashboard 改成 2026 Mercedes 风格”
- “给我一套 Ferrari 2026 的 CSS variables”
- “做一个 McLaren 风格的数据可视化 landing page”
- “看看这个页面更像 Aston Martin 还是普通科技绿”

## 重新打包

如果你修改了 skill 源码目录，可以重新打包：

```powershell
python C:\Users\61364\.agents\skills\skill-creator\scripts\package_skill.py `
  C:\Users\61364\Desktop\F1配色skills\f1-web-color-guidelines `
  C:\Users\61364\Desktop\F1配色skills
```

打包成功后会生成：

```text
f1-web-color-guidelines.skill
```

## 上传到 GitHub 的建议

推荐把 `f1-web-color-guidelines/` 作为源码提交，把 `.skill` 文件放到 GitHub Release，而不是只上传打包产物。

推荐结构：

```text
repo-root/
├─ README.md
├─ .gitignore
└─ f1-web-color-guidelines/
   ├─ SKILL.md
   └─ references/
```

最小 `.gitignore`：

```gitignore
*.skill
__pycache__/
dist/
```

## 后续扩展

当前还没有覆盖完整 F1 赛季全部车队。如果继续扩展，推荐下一批补充：

- Red Bull Racing
- Alpine
- Williams
- Sauber / Audi
- Haas
- Visa Cash App RB

## 许可与说明

这个仓库当前主要包含 skill 源码、打包产物和设计指引整理文件。若你准备公开发布，建议再补一份明确的许可证说明。
