# 凯迪拉克车队风格的 HTML 设计指引

## 设计目标

做出 **冷峻、未来、雕塑感强、带有美国豪华品牌工业锋面** 的网页视觉。
整体应接近 Cadillac Formula 1 Team 当前公开视觉方向：**黑白双基调、黑到白的分割式渐变、单色徽标体系、几何 chevron 纹理、少量金属灰结构层**。Cadillac 官方在 2025 品牌发布中强调这是一个 **distinctly American team**，而 2026 正式涂装又进一步明确：赛车采用 **black-and-white dual-color livery**，并以 **Cadillac chevron** 组成渐变图案；F1 对这套涂装的解释则补充了更具体的语义——**黑色代表 bold attitude，白色对应 American racing colour，呈现 fresh、clean、optimistic 的一面**。如果按 Cadillac 官方自己的 2026 表述继续理解，这套设计还要被读成一种 `bold and modern`、`fast standing still` 的视觉逻辑：也就是页面不只是黑白极简，而要有明显的速度切面和雕塑推进感。

## 整体气质关键词

* monochrome luxury
* sculpted aggression
* black-white split identity
* chevron geometry
* premium industrial
* American performance luxury
* precision futurism
* fast standing still

---

## 一、核心配色方案

### 1) 品牌核心层

这层负责让页面一眼有 Cadillac F1 的味道。

* **主黑 / Black Base**：`#060606`
* **炭黑 / Carbon Surface**：`#111214`
* **深金属灰 / Dark Metal**：`#3D4247`
* **银灰 / Cadillac Silver**：`#A7ADB4`
* **亮银白 / Highlight Silver**：`#D9DDE1`
* **白色 / American Racing White**：`#F7F8F9`

这套颜色用于网页时，不是走传统 Cadillac 彩色盾徽路线，而是要更接近 Cadillac F1 已公开出来的 **单色化、金属化、雕塑切面化** 方向。官方 2025 标志发布和 2026 正式涂装都在强化同一个逻辑：品牌识别不靠多彩，而靠 **黑白对冲、切面结构、几何纹理和车身体积**。

### 2) 推荐可替代值

如果你希望网页更接近“概念车 + F1 工程团队”的感觉，可以在不偏离车队识别的前提下，用下面这组替代值：

* **更深背景黑**：`#040404`
* **冷黑结构层**：`#0D0F11`
* **深钛灰 / Dark Titanium**：`#2F3439`
* **技术银 / Technical Silver**：`#B4BAC1`
* **高亮银白 / Edge Highlight**：`#E4E7EA`
* **冷白 / Clean White**：`#FCFCFB`

这组值更适合做 dashboard、图表、hero 主视觉和大面积结构切面，也更容易做出 **Cadillac 那种黑白对切、金属表面和未来雕塑感**。

### 3) 页面结构层

* **主背景**：`#050506`
* **一级卡片底**：`#0D0F10`
* **二级卡片底**：`#15181B`
* **边框 / 分割线**：`#262B30`
* **主文字**：`#F4F6F7`
* **次文字**：`#B8BFC6`
* **弱文字**：`#7A838C`

### 4) 数据可视化层

这队不适合像阿斯顿或梅奔那样依赖鲜明色彩高亮，图表应更克制，主要靠 **明度层级 + 黑白结构关系** 建立区分。

* **Series 1**：`#F4F6F7`
* **Series 2**：`#A7ADB4`
* **Series 3**：`#6E767D`
* **Series 4**：`#3D4247`
* **Neutral**：`#8A9198`
* **Warning**：`#D7A64A`
* **Negative**：`#C85A5A`

---

## 二、网页配色占比

凯迪拉克 F1 这套最关键的是：
**用黑白制造身份，用灰银建立层次，用几何图案制造品牌感。**

### 推荐整页占比

* **黑 / 深黑背景体系：46%**
* **炭黑与深灰结构层：24%**
* **银灰结构层：14%**
* **白色文字与关键数值：12%**
* **高亮银白：4%**

这个比例和 Cadillac 当前公开品牌观感更一致：主色不是“彩色强调”，而是 **黑白作为身份对立面**，灰银负责把工业豪华感做出来。Cadillac 2026 正式涂装直接采用黑白双面逻辑，并把 chevron 图案融入渐变里；这意味着网页里也应该优先复现 **黑白分割与速度渐层**，而不是靠单一亮色建立记忆点。

### dashboard 页面推荐占比

* 页面底色：`#050506`，约 **64%**
* 卡片 / 面板：`#0D0F10` / `#15181B`，约 **20%**
* 银灰分区 / 标题骨架：`#A7ADB4`，约 **8%**
* 白色关键信息：约 **6%**
* 亮银高光：约 **2%**

### 强限制

* 不要大面积使用彩色强调
* 不要使用大面积纯白背景
* 银白高光不要超过 **8%**
* 页面必须保持“黑色是体积，白银是切面”的关系
* 不要把整体做成普通黑白科技风，必须保留豪华工业雕塑感
* 不要丢掉 **split black-and-white identity** 这个核心特征

---

## 三、元素级配色规范

### 背景

* `body`：`#050506`
* section 背景：`#0A0B0C`
* card 背景：`#0D0F10`
* modal / overlay：`#15181B`

背景必须接近 **黑色车身与暗部金属表面**，而不是偏灰的普通 SaaS 后台底色。

### 导航栏

* 背景：`rgba(5,5,6,0.94)`
* 当前激活项：白字 + 深灰底
* 顶部或底部细线：`#A7ADB4`
* logo 区可使用亮银白，但面积要小

导航应体现 **锋利、稳定、未来豪华感**，不要做成发光赛博条。

### 卡片

* 背景：`#0D0F10`
* 边框：`1px solid #262B30`
* 标题：`#F4F6F7`
* 正文：`#B8BFC6`
* 辅助说明：`#7A838C`
* 局部可加入 `#D9DDE1` 的细线或小面积高光，模拟金属切边

如果要更像 Cadillac 车身，可以在大卡片背景里加入非常轻微的 **黑 → 深灰 → 银白** 方向性过渡，并叠一点 **几何 chevron 暗纹**，但不要把纹理做得太满。按 2026 官方语义更进一步去做时，应让整体更接近 **fast standing still** 的推进感，而不是平均铺开的灰阶渐变。

### 按钮

#### 主按钮

* 背景：`#F4F6F7`
* 文字：`#0A0B0C`
* Hover：`#D9DDE1`
* Active：`#BFC5CB`

主按钮应该像 **车身高光切面或金属铭牌**，而不是互联网产品的大色块 CTA。

#### 次按钮

* 背景：`#15181B`
* 边框：`1px solid #3D4247`
* 文字：`#E7EAED`
* Hover 背景：`rgba(217,221,225,0.08)`

### 数据图表

* 主线 / 主柱：`#F4F6F7`
* 第二序列：`#A7ADB4`
* 第三序列：`#6E767D`
* 中性背景序列：`#3D4247`
* 坐标文字：`#8A9198`
* 网格线：`rgba(255,255,255,0.08)`

图表核心应是 **克制、锋利、结构清楚**。不要为了“酷”去塞很多彩色。

### 文字

* 一级标题：`#F4F6F7`
* 二级标题：`#D8DDE1`
* 正文：`#B8BFC6`
* 弱化说明：`#7A838C`

---

## 四、最像“凯迪拉克车身”的网页渐变

Cadillac F1 网页里最该复现的不是普通黑白配色，而是 **black-to-white split identity + chevron 几何渐变**。官方 2026 涂装明确说赛车采用 **black-to-white gradient**，且这个渐变由 **Cadillac chevron pattern** 构成；F1 还补充了这套黑白分割背后的意义：黑更有态度，白代表 American racing colour。

### 方案 A：最像 2026 正式涂装的主视觉

```css
background: linear-gradient(
  135deg,
  #050506 0%,
  #111214 34%,
  #A7ADB4 72%,
  #F7F8F9 100%
);
```

这个版本适合首页 hero、品牌封面和大幅主视觉。重点是像 **一台黑白分面的 Cadillac F1 赛车在灯光下切过镜头**。

### 方案 B：更稳的 dashboard 版

```css
background: linear-gradient(
  135deg,
  #050506 0%,
  #0D0F10 44%,
  #3D4247 76%,
  #D9DDE1 100%
);
```

这个版本更适合数据后台和分析面板，保留黑白豪华感，但不会太像广告页。

### 方案 C：更强调“黑白双面雕塑”的版

```css
background: linear-gradient(
  120deg,
  #040404 0%,
  #111214 28%,
  #2F3439 52%,
  #B4BAC1 80%,
  #FCFCFB 100%
);
```

这个版本更适合强调 **概念车、未来豪华、雕塑切面** 的场景。

---

## 五、网页中最容易做错的地方

* 把 Cadillac 做成普通黑白科技公司官网
* 黑白对比太硬，失去豪华层次
* 灰银不够，页面像未完成线框稿
* 纹理太多，变得像潮牌视觉
* 过度发光，变成赛博风
* 做成简约冷淡风，却没有 **雕塑感、工业感、美国豪华性能感**
* 忽略黑白分割，只剩普通单色界面

---

## 六、给 AI 的风格指令模板

```text
请将页面设计为 Cadillac Formula 1 Team 风格的数据可视化网页。

视觉关键词：
monochrome luxury, sculpted aggression, black-white split identity, chevron geometry, premium industrial, American performance luxury, precision futurism, fast standing still

配色要求：
- 以黑色、炭黑、深金属灰作为主背景和结构层
- 使用银灰和冷白建立切面、标题、边框和金属高光
- 整体保持单色化、金属化、工业雕塑化，不使用大面积彩色
- 页面颜色关系应类似 Cadillac F1 的 split black-and-white identity，而不是普通黑白科技风
- 必须体现 black-to-white gradient 和豪华工业切面感

布局要求：
- 模块层级清晰，强调锋利切线、低重心和雕塑结构
- 使用细边框、轻微金属渐变、低对比阴影
- 可模拟 chevron 几何暗纹、概念车切面和未来豪华工业表面
- 图表以黑白灰层级为主，不要引入多余高饱和彩色

材质感要求：
- 模拟 gloss metal, satin metal, precision body panel, premium industrial finish
- 局部可有 chevron pattern 或 directional texture
- 不要赛博霓虹
- 不要玻璃拟态
- 不要做成普通极简 SaaS 黑白界面
- 不要缺少 American luxury performance 的力量感
```

---

## 七、最终落地判断标准

如果做对了，页面看起来应该像：

* **一台 Cadillac F1 赛车的黑白双面车身被切成锋利的工业雕塑**
* 不是普通黑白科技网站
* 不是潮流品牌 Lookbook
* 而是 **冷、硬、贵、未来、美国豪华性能，并且有明确的 Cadillac 几何识别**

如果做错了，最常见的观感会变成：

* 太像普通极简黑白网页
* 没有体积感
* 没有金属切面
* 没有黑白双面身份
* 更像设计博客，而不像 F1 车队视觉

---
