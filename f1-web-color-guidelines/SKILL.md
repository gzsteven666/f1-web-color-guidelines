---
name: f1-web-color-guidelines
description: F1 team web color and styling guide for designing or restyling web pages, dashboards, landing pages, and data visualization UIs in Aston Martin, Mercedes-AMG PETRONAS, McLaren, Ferrari, or Cadillac Formula 1 aesthetics. Use when Codex needs team-specific color tokens, usage ratios, gradient logic, material cues, CSS variables, Tailwind theme mappings, prompt templates, or anti-pattern checks for HTML/CSS/React/Tailwind work.
---

# F1 Web Color Guidelines

将 F1 车队配色指引转成网页可执行规范：颜色 token、占比、组件映射、材质隐喻、渐变逻辑、提示词和反模式校验。默认覆盖 5 支车队：Aston Martin、Mercedes-AMG PETRONAS、McLaren、Ferrari、Cadillac。参考内容已按 2026-03-09 能确认到的官方 2026 发布资料校对，来源见 `references/official-2026-sources.md`。

## 工作流

### 1. 先确定车队和任务形态

优先识别用户要的是哪一类输出：

- 配色方案或风格说明
- 现有页面改造建议
- CSS variables / Tailwind theme / design token
- AI 提示词
- 设计审查或纠偏

如果用户没有明确车队：

- 用户只说“F1 风格”时，先读取 `references/cross-team-methodology.md`，给出几支车队的差异摘要，再请用户选队。
- 用户已经给了明显车队线索时，直接进入对应参考文件。
- 这个 skill 目前只覆盖 Aston Martin、Mercedes、McLaren、Ferrari、Cadillac。若用户要 Red Bull、Alpine 等未收录车队，要明确说明这是超出当前 skill 的部分。

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

### 3. 产出时保持固定结构

默认按下面顺序输出，除非用户明确只要其中一部分：

1. 一句话视觉结论
2. 核心颜色 token
3. 页面颜色占比
4. 组件级映射
5. 材质与渐变逻辑
6. 明确禁止项

如果用户要实现代码，再把上述内容翻译成：

- CSS variables
- Tailwind `theme.extend.colors`
- Design token JSON
- React/HTML/CSS 中的具体组件色彩映射

如果用户要提示词，最后补一段可直接给 AI 设计工具使用的 prompt，且必须包含硬限制，不要只写气质词。

### 4. 把“颜色”翻译成“网页行为”

不要只列色号，要把色号变成页面中的角色分工：

- 背景色负责体积和重心
- 品牌主色负责身份识别
- 高亮色负责焦点、交互、速度线或图表主数据
- 点缀色只负责节奏，不负责大面积铺底

默认规则：

- dashboard 场景优先使用参考文件里的 dashboard 占比
- landing page / hero 场景可以用代表性渐变，但必须保持方向性受光，而不是平均铺开的装饰渐变
- 图表系统必须服从车队主色关系，不能为了区分数据引入无关高饱和彩色

### 5. 审核和纠偏

审查页面时，优先抓这几类问题：

- 是不是变成通用 SaaS 深色后台
- 是不是变成电竞 / 赛博 / 霓虹风
- 高亮色是不是被误用成主背景
- 材质逻辑是不是丢了，只剩“像一点颜色”
- 去掉 logo 后还能不能一眼猜出车队

如果发现偏差，先指出是“气质错位”还是“颜色错位”，再给替代方案。

## 输出模板

当用户要一份完整的网页配色指导时，优先输出这个骨架：

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
