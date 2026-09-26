# 红牛车队风格的 HTML 设计指引（Oracle Red Bull Racing / 2026 RB22）

## 设计目标

做出 **极度侵略性、极致哑光吸光质感、暗夜能量爆发且工程秩序严谨** 的顶级冠军网页视觉，彻底摆脱普通的“亮蓝色科技风”或廉价的“饮料罐贴纸风”。

整体严格遵循 Oracle Red Bull Racing 针对 2026 规则赛车 **RB22**（开启 Red Bull Ford 动力单元全新纪元）的官方设计语汇：**高吸光哑光深蓝（Matte Midnight Navy）作为绝对底盘与车体主色，从鼻锥贯穿至引擎盖的强劲公牛赛车红（Bull Racing Red）提供速度张力，标志性高能荧光黄（Electric Energy Yellow）作为点睛笔尖，以及大面积外露的空气动力学锻造碳黑（Matte Aero Carbon）**。

2026 年是红牛动力总成（Red Bull Ford Powertrains）的元年，设计语言融合了米尔顿凯恩斯（Milton Keynes）的冷酷冠军工程主义与极限运动的爆发动量。网页转译时必须保持这四者的结构秩序：**哑光深蓝是机体，外露碳纤是骨架，极速红是动能轨迹，荧光黄是能量爆点**。

---

## 整体气质关键词

* matte midnight navy (高级磨砂深蓝)
* satin non-reflective finish (吸光哑光微漫射)
* aggressive dynamic energy (侵略性动能)
* milton keynes championship engineering (冠军精密工程)
* navy / carbon-black / racing-red / energy-yellow hierarchy
* surgical contrast without neon slop (高反差但不低俗)
* aerodynamic forward cuts (向前俯冲的空气动力学切角)

---

## 一、核心配色方案

### 1) 品牌核心层（2026 网页复现基准值）

这层负责在 0.1 秒内建立 Red Bull Racing 的绝对霸权识别：

* **RB22 哑光暗夜蓝 / Matte Midnight Navy**：`#040D1A`
  * 赛车主体车漆。非亮光普通蓝，而是具备极高漫反射比、近乎吸收多余反光的深邃暗夜蓝磨砂面。
* **高位受光漫射蓝 / Satin Blue Specular**：`#182B45`
  * 3D 曲面受光处的柔和宽容度漫射光，无刺眼高光亮斑，呈现丝绸般哑光车漆质感。
* **终极虚空黑底 / Void Chassis Carbon**：`#020509`
  * 页面的终极画布底色，比纯黑更深沉的碳纤维底色。
* **公牛极速红 / Bull Racing Red**：`#EA1D2D`
  * 赛车鼻锥拉花、主 CTA 按钮与警示状态的核心动量红。
* **能量荧光黄 / Electric Energy Yellow**：`#FFEB00`
  * 鼻锥尖端、引擎罩公牛高能背脊线，以及贯穿赛道线的发光笔尖。
* **工程纯白 / Technical White**：`#F5F7FA`
  * 用于主要文字、高对比数据读数与赞助商切面。

### 2) 推荐扩展色阶

用于复杂的数据可视化、风洞压力分布与动力单元能量遥测面板：

* **深海次暗部 / Deep Navy Shrub**：`#081426`（一级容器背景）
* **控制台面板色 / Console Slate**：`#0E1E34`（二级卡片底色）
* **微细机械边框 / Machined Border**：`#1A2C46`（1px 结构导轨）
* **能量次亮红 / Bull Crimson Bright**：`#FF3B4B`（按钮 Hover、状态临界脉冲）
* **琥珀暖金 / Ford Powertrains Gold**：`#E5A93C`（2026 动力单元辅助指示）

### 3) 页面结构层（暗色基准）

* **主画布背景**：`#020509`
* **一级容器底色**：`#081426`
* **二级卡片底色**：`#0E1E34`
* **交互与弹出层**：`#14253E`
* **微细边框 / 导轨**：`#1A2C46`（或 `rgba(245, 247, 250, 0.10)`）
* **强化交互边框**：`rgba(234, 29, 45, 0.45)`
* **主阅读文字**：`#F5F7FA`（Contrast Ratio > 16:1）
* **次级工程文字**：`#A4B3C6`
* **弱化注记 / 遥测标签**：`#687B92`

### 4) 数据可视化与遥测层

* **Series 1（内燃机功率/主输出）**：`#EA1D2D`（公牛红）
* **Series 2（350kW MGU-K 电机能量）**：`#FFEB00`（能量黄）
* **Series 3（空气动力学下压力）**：`#182B45`（漫射蓝）
* **基准线 / 坐标网格**：`#1A2C46`
* **Status Optimal（正常）**：`#00D26A`
* **Status Deploy（全负荷推进）**：`#FFEB00`
* **Status Limiter（超限/刹车重度回收）**：`#EA1D2D`

---

## 二、网页配色占比与面积法则

红牛涂装的核心魅力在于 **“大面积沉稳吸光的哑光暗夜蓝，由极度鲜烈的红黄双色切破空间”**。

### 1) 推荐整页占比（沉浸式 Surface 展示页）

* **哑光暗夜蓝与虚空碳黑体系（#020509 / #040D1A / #081426）**：约 **72%**（奠定绝对沉静与工程深邃感）
* **车漆高位漫射与次级暗面（#182B45 / #0E1E34）**：约 **15%**（塑造车身雕塑感）
* **工程白与高对比文字（#F5F7FA）**：约 **8%**（保证清晰可读）
* **公牛极速红（#EA1D2D）**：约 **3%**（主 CTA、核心指标与关键分割线）
* **能量荧光黄（#FFEB00）**：**严格限制在 1%~2%**（仅作为脉冲笔尖、高亮数据点、切面点睛）

### 2) 绝对禁止项（Anti-patterns）

* ❌ **禁止使用亮面高光车漆（High-Gloss Mirror）**：红牛车身的灵魂在于哑光磨砂清漆（Matte Satin Finish），粗糙度需维持在 0.38~0.45，清漆不能有锐利反光镜面！
* ❌ **禁止大面积铺设荧光黄背景**：黄色只要超过 2%，页面就会从“顶级 F1 赛车”瞬间变成“廉价施工安全标示”。
* ❌ **禁止柔和圆润的大圆角（border-radius: 16px）**：红牛设计哲学是刀锋切角（Sharp Chiseled Geometry），圆角控制在 0~4px，辅以 45° 倾斜徽标与斜向切片。
* ❌ **禁止滥用模糊泛光的蓝紫渐变**：坚守纯粹的暗夜深海蓝与红黄纯色，不搞赛博朋克花哨光效。

---

## 三、元素级组件设计规范

### 1) 背景与连续车身

* `body` 底色统一锚定 `#020509`，背景使用 PBR 哑光车身 Shader。
* WebGL 回退方案使用双层方向性磨砂受光渐变：
  ```css
  background:
    radial-gradient(100% 60% at 20% 15%, rgba(24, 43, 69, 0.40) 0%, transparent 65%),
    linear-gradient(155deg, #040D1A 0%, #061122 35%, #03070E 75%, #020509 100%);
  ```

### 2) 按钮与行动点（CTA）

* **主按钮（Bull Charge）**：
  * 背景：`#EA1D2D`
  * 文字：`#FFFFFF`（粗体无衬线，大写 Tracking）
  * 悬浮态：背景微亮 `#FF3B4B`，外发光 `box-shadow: 0 0 16px rgba(234, 29, 45, 0.4)`
* **次级按钮（Aero Hollow）**：
  * 背景：`rgba(255, 255, 255, 0.04)`
  * 边框：`1px solid #1A2C46`
  * 悬浮态：边框亮起 `border-color: #FFEB00`，文字变为 `#FFEB00`

### 3) 赛道贯穿线（Track Keyline）

* 颜色：`#EA1D2D`（公牛极速红）
* 笔尖发光点：`#FFEB00`（能量荧光黄脉冲点）
* 线宽：`2px`，结合 Catmull-Rom 贝塞尔平滑流线穿透页面各段落。
