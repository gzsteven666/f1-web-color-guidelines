---
name: f1-web-color-guidelines
description: F1 team web color and styling guide for designing, restyling, reviewing, or implementing web pages, dashboards, landing pages, admin panels, design systems, and data visualization UIs in Aston Martin, Mercedes-AMG PETRONAS, McLaren, Ferrari, or Cadillac Formula 1 aesthetics. Make sure to use this skill whenever the user mentions F1 风格、车队配色、赛车视觉、车队官网、赛车 dashboard、Aston Martin 风格、梅奔风格、McLaren 风格、Ferrari 风格、Cadillac 风格、网页配色、Tailwind 配色、design token、CSS variables、提示词、视觉审查，哪怕用户没有明确说“skill”或“配色指引”，只要核心问题是在把网页做成某支 F1 车队的视觉语言，就应该触发。
---

# F1 Web Color Guidelines

将 F1 车队配色指引转成网页可执行规范：颜色 token、占比、组件映射、材质隐喻、渐变逻辑、提示词和反模式校验。默认覆盖 5 支车队：Aston Martin、Mercedes-AMG PETRONAS、McLaren、Ferrari、Cadillac。参考内容已按 2026-03-09 能确认到的官方 2026 发布资料校对，来源见 `references/official-2026-sources.md`。

## 工作流

### 1. 先确定车队和任务形态

优先识别用户要的是哪一类输出：

- 完整长文版网页设计指引
- 配色方案或风格说明
- 现有页面改造建议
- CSS variables / Tailwind theme / design token
- AI 提示词
- 设计审查或纠偏

如果用户没有明确车队：

- 用户只说“F1 风格”时，先读取 `references/cross-team-methodology.md`，给出几支车队的差异摘要，再请用户选队。
- 用户已经给了明显车队线索时，直接进入对应参考文件。
- 这个 skill 目前只覆盖 Aston Martin、Mercedes、McLaren、Ferrari、Cadillac。若用户要 Red Bull、Alpine 等未收录车队，要明确说明这是超出当前 skill 的部分。
- 对未收录车队，不要硬套现有五队模板，不要伪装成“完整指引”；只能说明覆盖边界，并在用户接受的前提下提供通用 F1 网页方法论或扩展建议。

### 2. 只读取最小必要参考

按车队读取单个参考文件，不要把全部车队一起载入：

- Aston Martin: `references/aston-martin.md`
- Mercedes-AMG PETRONAS: `references/mercedes.md`
- McLaren: `references/mclaren.md`
- Ferrari: `references/ferrari.md`
- Cadillac: `references/cadillac.md`

遇到以下场景时，再额外读取 `references/cross-team-methodology.md`：

- 用户只说“做成 F1 味道”，但未指定车队
- 需要解释不同车队为什么不能共用一套模板换色
- 需要评审现有页面是不是“跑偏成通用深色后台”

遇到以下场景时，再读取 `references/official-2026-sources.md`：

- 用户质疑某队的 2026 风格依据
- 需要说明为什么 2026 版本和旧赛季指引不同
- 需要继续把 skill 扩展到更多车队或更新到 2027

## 输出模式

### 模式 A：完整长文指引

以下情况优先复用 reference 文件的完整章节结构，不要先压缩成摘要：

- 用户说“按这个格式写一份完整 guideline / 设计指引”
- 用户要保留原文层级、段落密度和文案节奏
- 用户要 markdown 文档、提案稿、交付稿、品牌规范稿

此时应尽量沿用参考文件里的完整结构输出：

1. 设计目标
2. 整体气质关键词
3. 核心配色方案
4. 网页配色占比
5. 元素级配色规范
6. 网页渐变
7. 最容易做错的地方
8. 给 AI 的风格指令模板
9. 最终落地判断标准

如果只是做轻微定制，应在原结构上改写，而不是把长文打散成执行摘要。
如果用户同时要长文指引和代码实现，先输出完整长文正文，再单独追加“实现附录”；不要用 token 骨架替代正文。

### 模式 B：执行摘要 / 实现输出

以下情况优先输出压缩后的执行结果：

- 用户要快速给设计师 / 前端看的摘要
- 用户要 CSS variables、Tailwind、token JSON
- 用户要审查意见、改造建议、反模式检查
- 用户明确说“简短一点”“只给我能落地的部分”

默认摘要顺序：

1. 一句话视觉结论
2. 核心颜色 token
3. 页面颜色占比
4. 组件级映射
5. 材质与渐变逻辑
6. 明确禁止项

如果任务是“审查 / 纠偏”，默认输出这 3 段：

1. 当前判断：更接近该车队，还是已经跑偏成通用 SaaS / 电竞 / 赛博风
2. 主要跑偏点：至少 3 条，并区分“气质错位”还是“颜色错位”
3. 替代方向：把每个跑偏点翻译成可执行改法，而不是只补几个色号

## 代码与实现映射

如果用户要实现代码，再把参考内容翻译成：

- CSS variables
- Tailwind `theme.extend.colors`
- Design token JSON
- React/HTML/CSS 中的具体组件色彩映射

如果用户要提示词，最后补一段可直接给 AI 设计工具使用的 prompt，且必须包含硬限制，不要只写气质词。

## 把“颜色”翻译成“网页行为”

不要只列色号，要把色号变成页面中的角色分工：

- 背景色负责体积和重心
- 品牌主色负责身份识别
- 高亮色负责焦点、交互、速度线或图表主数据
- 点缀色只负责节奏，不负责大面积铺底

默认规则：

- dashboard 场景优先使用参考文件里的 dashboard 占比
- landing page / hero 场景可以用代表性渐变，但必须保持方向性受光，而不是平均铺开的装饰渐变
- 图表系统必须服从车队主色关系，不能为了区分数据引入无关高饱和彩色

## 审核和纠偏

审查页面时，优先抓这几类问题：

- 是不是变成通用 SaaS 深色后台
- 是不是变成电竞 / 赛博 / 霓虹风
- 高亮色是不是被误用成主背景
- 材质逻辑是不是丢了，只剩“像一点颜色”
- 去掉 logo 后还能不能一眼猜出车队

如果发现偏差，先指出是“气质错位”还是“颜色错位”，再给替代方案。

## 未指定车队时的比较输出

如果用户明确要求“先别乱选”“先比较几队再建议”，先读取 `references/cross-team-methodology.md`，并优先按下面顺序输出：

1. 每支候选车队的一句话第一印象
2. 各自更适合的网页类型或品牌气质
3. 各自最容易跑偏的风险
4. 基于用户目标给出选择建议

不要跳过比较步骤直接替用户拍板。

## 未覆盖车队时的边界输出

如果用户点名了当前未覆盖的车队：

1. 先直接说明该车队不在当前 skill 覆盖范围内
2. 不要生成看似完整但实际无依据的专属 guideline
3. 可选地提供两种后续路径：
   - 给出通用 F1 网页风格方法论，明确不是该车队官方化身
   - 帮用户扩展这个 skill，并提示需要补官方来源与新的 reference 文件

## 模式 B 默认骨架

只有在模式 B 或用户明确要“简短、落地、给前端/设计师直接用”的时候，才优先输出这个骨架。模式 A 仍然应沿用对应 reference 文件的完整章节结构。

```text
视觉结论：

核心 token：
- brand / background / surface / text / accent / danger / warning

推荐占比：
- 背景
- 品牌识别
- 高亮
- 文字
- 点缀

组件映射：
- body / section / card / border / primary button / secondary button / chart / heading / body text

材质与渐变：
- 表面隐喻
- 方向性高光
- 示例渐变

禁止项：
- 3 到 6 条最容易跑偏的问题
```

如果用户要代码，优先附一个简短 token 结构，例如：

```css
:root {
  --bg: ...;
  --surface: ...;
  --brand: ...;
  --accent: ...;
  --text-strong: ...;
  --text-muted: ...;
}
```

## 风格底线

- 不要把 5 支车队做成同一个深色模板换色。
- 不要把渐变当成唯一高级感来源；先做明暗层级、材质、体积，再做渐变。
- 不要默认使用紫色、蓝紫赛博光或大面积发光描边。
- 不要把图表系统做成独立彩虹板。
- 不要为了“酷”牺牲车队身份的准确性。
