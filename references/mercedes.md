# 梅赛德斯奔驰车队风格的 HTML 设计指引

## 设计目标

做出 **冷峻、精密、高性能、带有工业科技与碳纤维质感** 的网页视觉。
整体应接近 Mercedes-AMG PETRONAS Formula One Team 近年的公开视觉：**黑色与深灰为主体，银灰作为结构层，PETRONAS 青绿色作为高亮识别色**。近年官方与 F1 的公开物料都持续呈现这条主线：梅奔近几个赛季的赛车涂装一直围绕 **黑 + 银 + PETRONAS 绿色点缀** 展开，2026 公开描述也明确提到 black、silver 与 PETRONAS green accents 的组合，并强调一条低位流动的 PETRONAS 绿色线条来强化速度与精密感。同时，2026 官方语义进一步强调了 **从 nose cone 到 upper sidepods 的 silver bodywork、延伸至 rear half 的 deep black，以及 AMG rhombuses 的纹理存在**，因此网页里也应该体现明显的前银后黑结构关系，而不只是黑底加一点青绿。([Formula 1® - The Official F1® Website][1])

## 整体气质关键词

* precision engineering
* carbon-fibre luxury
* black-silver contrast
* petronas teal highlight
* technical minimalism
* aerodynamic performance
* premium industrial motorsport
* silver nose to black rear

---

## 一、核心配色方案

### 1) 品牌核心层

这层负责让页面一眼有 Mercedes-AMG PETRONAS F1 的味道。

* **主黑 / Carbon Black**：`#000000`
* **结构银 / Silver**：`#C8CCCE`
* **深灰 / Gunmetal**：`#565F64`
* **PETRONAS 青绿 / Teal Accent**：`#00A19B`
* **辅助青绿 / Soft Teal**：`#53C5BF`
* **白色 / Signal White**：`#FFFFFF`

这组数值可作为网页里的工程化复现值：黑、银、深灰、PETRONAS 青绿，是根据你现有指引里的梅奔基准稿整理出的可落地方案。它不是官方网页 token 原文，而是基于梅奔近年公开视觉方向与常见数字配色归纳出的复现值。
在视觉理解上，这组颜色不是“黑底上随便点一点绿”，而是要形成一种 **黑色建立体积、银灰定义结构、PETRONAS 青绿提供信号与流线** 的关系。官方 2026 新车说明里提到，PETRONAS green flow line 会低位扫过车身，用来强调 speed and precision；这很适合转译成网页里的低重心高亮逻辑。([Mercedes-AMG PETRONAS F1 Team][2])

### 2) 推荐可替代值

如果你希望网页更接近“冷金属 + 精密工程”的感觉，可以在不偏离车队识别的前提下，用下面这组替代值：

* **更深背景黑**：`#050607`
* **稳定主结构黑灰**：`#101315`
* **深钛灰 / Dark Titanium**：`#3E464B`
* **金属银 / Technical Silver**：`#BFC5C8`
* **PETRONAS 主高亮**：`#00A7A0`
* **柔和发光青绿**：`#66D2CB`

这组值更适合做 dashboard、数据卡片、图表系统和 hover 状态，尤其适合把“**碳纤维底 + 银灰骨架 + PETRONAS 青绿信号线**”这套层次做清楚。

### 3) 页面结构层

* **主背景**：`#060708`
* **一级卡片底**：`#0E1011`
* **二级卡片底**：`#15181A`
* **边框 / 分割线**：`#23282B`
* **主文字**：`#F5F7F7`
* **次文字**：`#B8C0C2`
* **弱文字**：`#7C878B`

### 4) 数据可视化层

这队适合用 **黑底 + 青绿色主数据 + 银灰辅助序列** 来做图表，不适合做成多彩霓虹风。

* **Series 1**：`#00A19B`
* **Series 2**：`#53C5BF`
* **Series 3**：`#8DDBD7`
* **Series 4**：`#C8CCCE`
* **Neutral**：`#565F64`
* **Warning**：`#F2C94C`
* **Negative**：`#D95C5C`

---

## 二、网页配色占比

梅赛德斯-AMG PETRONAS F1 这套最关键的是：
**用黑色建立体积，用银灰定义结构，用 PETRONAS 青绿色制造识别与速度感。**

### 推荐整页占比

* **黑 / 深黑灰背景体系：52%**
* **深灰结构层：20%**
* **银灰结构层：12%**
* **白色文字与关键数值：10%**
* **PETRONAS 青绿色高亮：6%**

这个比例很接近梅奔近年视觉的真实重心：黑色是主体身份，银色是历史血统与结构表达，PETRONAS 绿色是高识别高亮，而不是页面主底色。F1 对 2026 梅奔涂装的公开说明，以及车队官方对 W17 的描述，都延续了这种关系。([Formula 1® - The Official F1® Website][1])

### dashboard 页面推荐占比

* 页面底色：`#060708`，约 **68%**
* 卡片 / 面板：`#0E1011` / `#15181A`，约 **18%**
* 银灰分区 / 标题骨架：`#565F64` / `#C8CCCE`，约 **8%**
* PETRONAS 高亮 / 交互激活 / 主图表：约 **4%**
* 白色关键信息：约 **2%**

### 强限制

* 不要把 PETRONAS 青绿大面积铺满页面
* 不要把银灰做成大面积浅色背景
* PETRONAS 青绿色总面积建议 **不超过 8%**
* 页面必须保持“黑色是主体、银灰是骨架、青绿色是信号高亮”的关系
* 不要把页面做成普通赛博科技风
* 不要让高光绿变成电竞霓虹色

---

## 三、元素级配色规范

### 背景

* `body`：`#060708`
* section 背景：`#0B0D0E`
* card 背景：`#0E1011`
* modal / overlay：`#15181A`

背景必须足够深，接近 **黑色碳纤维底**，而不是泛灰的普通 SaaS 后台底色。

### 导航栏

* 背景：`rgba(6, 7, 8, 0.88)`
* 边框下沿：`1px solid #1F2427`
* Logo/标题高亮：`#F5F7F7`
* 当前激活项：`#00A19B`
* 非激活项：`#98A4A8`

导航最好呈现 **低重心、精密、安静** 的感觉，不要做成高反差大面积发光条。

### 卡片

* 背景：`#0E1011`
* 边框：`1px solid #23282B`
* 标题：`#F5F7F7`
* 正文：`#B8C0C2`
* 辅助说明：`#7C878B`
* 顶部或左侧可加 `2px` 的 `#00A19B` 细线作为状态高亮

如果要更像梅奔车身，可以在大卡片背景里加入非常轻微的 **黑 → 深灰 → 冷银灰** 过渡，再叠一点极淡的青绿反射，让它更像 **brushed metal + carbon fibre** 的混合材质。若需要进一步贴近 2026 官方语义，可把 `AMG rhombuses` 转译成极淡的几何暗纹，但不要做成抢眼大图案。

### 按钮

#### 主按钮

* 背景：`#00A19B`
* 文字：`#041010`
* Hover：`#13B5AE`
* Active：`#008882`

主按钮应该像 **仪表盘上的激活信号**，而不是大面积营销按钮。

#### 次按钮

* 背景：transparent
* 边框：`1px solid #3A4348`
* 文字：`#D6DDDF`
* Hover 背景：`rgba(0, 161, 155, 0.10)`

### 数据图表

* 主线 / 主柱：`#00A19B`
* 第二序列：`#53C5BF`
* 辅助数据：`#C8CCCE`
* 中性背景柱：`#565F64`
* 坐标文字：`#8D999D`
* 网格线：`rgba(255,255,255,0.08)`

图表的核心应该是 **清晰、冷静、精密**。青绿色负责主数据与当前焦点，银灰负责辅助对比，不能把整个图表系统做成花哨多色板。

### 文字

* 一级标题：`#F5F7F7`
* 二级标题：`#D8DEDF`
* 正文：`#B8C0C2`
* 弱化说明：`#7C878B`

文字系统整体偏冷，不要带暖灰，不要米白。

---

## 四、最像“梅赛德斯车身”的网页渐变

梅奔网页里最该复现的不是单一色号，而是 **黑色碳纤维基底、银灰结构切面、PETRONAS 青绿低位流线高亮**。这和车队近年赛车涂装的逻辑非常一致：黑与银作为主结构，PETRONAS green accent 用来形成速度线与识别点。([Formula 1® - The Official F1® Website][1])

### 方案 A：最像 W16/W17 车身逻辑的主视觉

```css
background: linear-gradient(
  135deg,
  #050607 0%,
  #0E1011 34%,
  #3E464B 68%,
  #00A19B 100%
);
```

这个版本适合首页 hero、车队主题 banner 或封面大图区域。感觉应像 **黑色车身上银色结构过渡到 PETRONAS 流线高光**。

### 方案 B：更稳的 dashboard 版

```css
background: linear-gradient(
  135deg,
  #060708 0%,
  #101315 42%,
  #23282B 76%,
  #00A19B 100%
);
```

这个版本更适合数据后台、中控台、比赛数据页。整体更稳，更偏工程感。

### 方案 C：更像 brushed metal 的高级版

```css
background: linear-gradient(
  120deg,
  #070809 0%,
  #111416 28%,
  #565F64 62%,
  #BFC5C8 86%,
  #66D2CB 100%
);
```

这个版本银属感更强，适合需要强调 **Silver Arrows 血统** 和高端工业质感的页面。

---

## 五、网页中最容易做错的地方

* 把梅奔做成普通黑绿科技网站
* PETRONAS 青绿用太多，导致像能源公司官网
* 银灰太亮，导致页面发白、失去低重心
* 黑色不够深，失去碳纤维与机械体积感
* 做成赛博霓虹风，而不是精密工程风
* 高光像 UI 发光，而不是车身流线反射
* 忽略银色的结构作用，只剩黑色和一点青绿

---

## 六、给 AI 的风格指令模板

```text
请将页面设计为 Mercedes-AMG PETRONAS Formula One Team 风格的数据可视化网页。

视觉关键词：
precision engineering, carbon-fibre luxury, black-silver contrast, petronas teal highlight, technical minimalism, aerodynamic performance, premium industrial motorsport, silver nose to black rear

配色要求：
- 以黑色和深灰作为主背景
- 使用银灰作为结构层、边框、标题分区和金属感元素
- 使用 PETRONAS 青绿色作为少量高亮色，只用于按钮主态、选中态、图表主系列和关键状态提示
- 整体应呈现冷峻、精密、工业化、高性能的视觉气质
- 页面颜色关系应类似 Mercedes-AMG PETRONAS F1 的黑底、银灰骨架、青绿色高亮，而不是普通赛博科技风
- 青绿色主要用于信号高亮，不要大面积铺满

布局要求：
- 模块层级清晰，强调精密结构和低重心
- 使用细边框、低对比阴影、轻微金属渐变
- 可模拟碳纤维和 brushed metal 的材质感
- 图表以青绿色 + 银灰层级为主，不要引入多余高饱和彩色
- 高光应像低位流线扫过车身，而不是泛白发光

材质感要求：
- 模拟 carbon fibre、brushed metal、precision engineering finish
- 表面应有克制、真实、工业化的金属反射
- 局部可以有冷银高光和 PETRONAS 青绿反射边
- 不要赛博霓虹
- 不要玻璃拟态
- 不要花哨多彩装饰
- 不要把银灰做成大面积浅色背景
```

---

## 七、最终落地判断标准

如果做对了，页面看起来应该像：

* **黑色碳纤维车身上的银色结构与 PETRONAS 流线高亮**
* 不是普通科技后台
* 不是新能源官网
* 不是赛博电竞界面
* 而是 **冷、稳、精密、机械、快速，并且有 Mercedes 工程体系的高级工业感**

如果做错了，最常见的观感会变成：

* 青绿太多
* 银灰太亮
* 黑色不够深
* 失去 Silver Arrows 的结构感
* 更像互联网数据平台，而不像 F1 工程团队视觉

---

[1]: https://www.formula1.com/en/latest/article/new-rules-new-look-mercedes-unveil-the-w17-for-the-2026-f1-season.5JQ4iWv2R4i2F8w0yQ8m7K
[2]: https://www.mercedesamgf1.com/news/launching-a-new-era-of-the-silver-arrows
