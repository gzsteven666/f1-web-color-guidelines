# 迈凯伦车队风格的 HTML 设计指引

## 设计目标

做出 **轻快、锐利、高能见度、带有现代科技与速度感** 的网页视觉。
整体应接近 McLaren Formula 1 Team 近年的公开视觉：**Papaya 橙为绝对主识别，Anthracite 深灰 / 黑色负责压重心，少量冷青蓝或 Teal 点缀用于速度感和技术感**。McLaren 官方对近两年的涂装描述很一致：2025 版写明延续 “iconic papaya colour palette”，并结合 anthracite 与一丝 teal；2026 也继续延续夺冠后的这条主逻辑，并把它扩展成更明确的冠军延续感：`iconic papaya colour palette`、`striking anthracite`、`small hints of teal`，以及类似 “all-papaya front / all-anthracite back” 的正反结构关系。([mclaren.com][1])

## 整体气质关键词

* papaya performance
* high-visibility speed
* modern motorsport energy
* anthracite contrast
* technical agility
* aerodynamic sharpness
* lightweight precision
* championship continuity

---

## 一、核心配色方案

### 1) 品牌核心层

这层负责让页面一眼有 McLaren F1 的味道。

* **主橙 / Papaya Base**：`#FF8700`
* **深橙 / Papaya Deep**：`#E66A00`
* **Anthracite / 主深灰**：`#1E1F22`
* **深碳黑 / Carbon Black**：`#0F1012`
* **冷青蓝点缀 / Teal Accent**：`#4FD5D6`
* **白色 / Signal White**：`#FFFFFF`

网页复现上，最重要的是抓住 **papaya + anthracite** 这组关系，而不是把页面做成单纯橙色科技风。官方 2026 说明仍然明确写到这套设计继续沿用 iconic papaya colour palette，并结合 striking anthracite 与 small hints of teal。([mclaren.com][1])

### 2) 推荐可替代值

如果你希望网页更接近“高性能现代赛车 + 轻量化工程感”，可以在不偏离车队识别的前提下，用下面这组替代值：

* **更亮主橙**：`#FF8000`
* **受光橙 / Highlight Papaya**：`#FF9B2F`
* **稳定深灰骨架**：`#20242A`
* **更深背景黑**：`#0B0C0E`
* **冷感 Teal 辅助**：`#55D6D2`
* **冷银灰**：`#C8CDD3`

这组值更适合做 dashboard、图表、卡片和 hover 层级，也更容易做出 **迈凯伦那种橙色高能见度 + 深灰骨架压住速度感** 的关系。

### 3) 页面结构层

* **主背景**：`#0C0D0F`
* **一级卡片底**：`#14161A`
* **二级卡片底**：`#1D2025`
* **边框 / 分割线**：`#2B2F36`
* **主文字**：`#F7F7F5`
* **次文字**：`#C9CDD2`
* **弱文字**：`#8F97A1`

### 4) 数据可视化层

迈凯伦适合用 **橙色主数据 + 深灰结构 + 少量冷色辅助** 的方式做图表，不适合引入过多杂色。

* **Series 1**：`#FF8700`
* **Series 2**：`#FF9B2F`
* **Series 3**：`#FFC067`
* **Series 4**：`#4FD5D6`
* **Neutral**：`#5D6670`
* **Warning**：`#FFD54A`
* **Negative**：`#E85C4A`

---

## 二、网页配色占比

迈凯伦这套最关键的是：
**用 Papaya 橙建立高识别，用 Anthracite 压住骨架和重心，用极少量冷色做速度与技术感辅助。**

### 推荐整页占比

* **深灰 / 黑色背景体系：48%**
* **Papaya 橙主识别：22%**
* **深灰结构层：16%**
* **白色文字与高对比信息：10%**
* **冷青蓝 / Teal 辅助高亮：4%**

这个比例更接近迈凯伦近年真实视觉重心：橙色是最强识别，但不是满屏海报式铺橙；深灰和黑色负责把页面压稳，避免变成廉价橙黑电竞风。McLaren 官方连续几季的表述也都强调 papaya 与 anthracite 的组合关系，而 teal 只是很轻的一层辅助。([mclaren.com][1])

### dashboard 页面推荐占比

* 页面底色：`#0C0D0F`，约 **62%**
* 卡片 / 面板：`#14161A` / `#1D2025`，约 **20%**
* Papaya 识别块 / 主图表：约 **10%**
* 白色文字与关键数值：约 **6%**
* 冷青蓝辅助激活：约 **2%**

### 强限制

* 不要把 Papaya 做成整页大面积底色
* 不要把页面做成廉价橙黑电竞风
* 冷青蓝 / Teal 总面积建议 **不超过 5%**
* 页面必须保持“橙色是识别、深灰是骨架、冷色是辅助”的关系
* 不要把迈凯伦做成普通互联网橙色品牌
* 不要让橙色失去赛车涂装那种高能见度和速度感

---

## 三、元素级配色规范

### 背景

* `body`：`#0C0D0F`
* section 背景：`#111316`
* card 背景：`#14161A`
* modal / overlay：`#1D2025`

背景必须足够深，像 **轻量化赛车结构件和碳纤维基底**，让 papaya 橙浮出来，而不是整页暖色调发亮。

### 导航栏

* 背景：`rgba(12, 13, 15, 0.90)`
* 边框下沿：`1px solid #22272D`
* Logo / 标题高亮：`#F7F7F5`
* 当前激活项：`#FF8700`
* 非激活项：`#A0A8B0`

导航应体现 **锐利、轻量、低重心**，不要做成太厚重的工业黑条。

### 卡片

* 背景：`#14161A`
* 边框：`1px solid #2B2F36`
* 标题：`#F7F7F5`
* 正文：`#C9CDD2`
* 辅助说明：`#8F97A1`
* 顶部或左侧可加 `2px` 的 `#FF8700` 细线作为状态高亮

如果要更像迈凯伦车身，可以在大卡片背景里加入非常轻微的 **深灰 → 炭黑 → 局部橙色受光** 过渡，但不要做成大面积饱和橙渐变海报。按 2026 官方语义去做时，还可以进一步强化“前亮后稳”的构图，而不要让橙色均匀铺满整页。

### 按钮

#### 主按钮

* 背景：`#FF8700`
* 文字：`#111111`
* Hover：`#FF9B2F`
* Active：`#E66A00`

主按钮应该像 **赛车涂装上的高能见度识别块**，醒目但不廉价。

#### 次按钮

* 背景：transparent
* 边框：`1px solid #3A4048`
* 文字：`#E2E6EA`
* Hover 背景：`rgba(255, 135, 0, 0.10)`

### 数据图表

* 主线 / 主柱：`#FF8700`
* 第二序列：`#FF9B2F`
* 辅助高亮：`#4FD5D6`
* 中性数据：`#7A828C`
* 坐标文字：`#98A1AA`
* 网格线：`rgba(255,255,255,0.08)`

图表的核心应是 **高能见度、清晰、轻快**。Papaya 负责主数据和速度感，Teal 只用于少量辅助焦点。

### 文字

* 一级标题：`#F7F7F5`
* 二级标题：`#DCE1E6`
* 正文：`#C9CDD2`
* 弱化说明：`#8F97A1`

---

## 四、最像“迈凯伦车身”的网页渐变

迈凯伦网页里最该复现的不是单一橙色，而是 **Papaya 高识别块 + Anthracite 结构面 + 极轻的冷色科技感**。官方这几年的叙述都说明，papaya 是主识别，anthracite 是基础结构，teal 只是轻微辅助。([mclaren.com][1])

### 方案 A：最像车队主视觉的主 Hero

```css
background: linear-gradient(
  135deg,
  #0B0C0E 0%,
  #1E1F22 34%,
  #FF8700 76%,
  #FFB457 100%
);
```

这个版本适合首页 hero、车队主题 banner 或首页封面区域。重点是像 **深灰车身切面中露出高能见度 Papaya 涂装**。

### 方案 B：更稳的 dashboard 版

```css
background: linear-gradient(
  135deg,
  #0C0D0F 0%,
  #14161A 42%,
  #2B2F36 72%,
  #FF8700 100%
);
```

这个版本更适合数据后台和控制台页面，整体更稳，不会太像营销页。

### 方案 C：更强调轻量化速度感的版

```css
background: linear-gradient(
  120deg,
  #0C0D0F 0%,
  #1A1D22 30%,
  #2A2F35 56%,
  #E66A00 82%,
  #4FD5D6 100%
);
```

这个版本更强调 **现代赛车、切风感、技术流线**，适合有更多动效或斜切布局的页面。

---

## 五、网页中最容易做错的地方

* 把迈凯伦做成普通橙色互联网品牌
* 橙色过多，变成海报式大面积暖色压脸
* 冷青蓝太多，破坏 papaya 主识别
* 深灰不够，失去结构感和低重心
* 做成廉价橙黑电竞风
* 高光太霓虹，失去现代赛车的精密感
* 只有“橙”，没有 **轻量化、锐利、空气动力学切面感**

---

## 六、给 AI 的风格指令模板

```text
请将页面设计为 McLaren Formula 1 Team 风格的数据可视化网页。

视觉关键词：
papaya performance, high-visibility speed, modern motorsport energy, anthracite contrast, technical agility, aerodynamic sharpness, lightweight precision, championship continuity

配色要求：
- 以 anthracite 深灰和碳黑作为主背景
- 使用 papaya orange 作为主品牌识别色
- 允许极少量 teal 或冷青蓝作为辅助高亮
- 整体应呈现轻快、锐利、高能见度、现代赛车化的视觉气质
- 页面颜色关系应类似 McLaren F1 的 papaya + anthracite，而不是普通橙色科技风
- papaya 应是识别色，不要大面积铺满整个页面

布局要求：
- 模块层级清晰，强调速度感、斜切感和轻量化结构
- 使用细边框、轻微渐变、低对比阴影
- 可模拟赛车涂装切线、空气动力学流线和轻量化工程感
- 图表以橙色层级为主，只用极少量冷色做辅助，不要引入多余高饱和彩色

材质感要求：
- 模拟 gloss paint、technical composite surface、modern motorsport finish
- 不要赛博霓虹
- 不要玻璃拟态
- 不要把橙色做成大面积底色海报
- 不要做成廉价橙黑电竞风
```

---

## 七、最终落地判断标准

如果做对了，页面看起来应该像：

* **高能见度 Papaya 赛车涂装切过深灰车身结构**
* 不是普通橙色官网
* 不是电竞战队页面
* 而是 **轻、快、锐、现代，并且非常像迈凯伦的空气动力学速度感**

如果做错了，最常见的观感会变成：

* 橙色太多
* 太像营销海报
* 深灰结构不够
* 冷色太抢
* 更像橙黑电竞 UI，而不像 F1 车队视觉

---

[1]: https://www.mclaren.com/racing/formula-1/2026/mclaren-racing-reveal-livery-for-the-mclaren-mastercard-formula-1-teams-2026-challenger/
