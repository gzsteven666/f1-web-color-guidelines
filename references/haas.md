# 哈斯车队风格的 HTML 设计指引（MoneyGram Haas F1 Team / 2026 VF-26）

## 设计目标

做出 **极简实用主义、美式硬核工业机加工切削、大面积裸露碳纤维与高反差红白黑三元秩序** 的 F1 官方级网页视觉，彻底摆脱多余的花哨装饰，直击赛车机械减重与纯粹性能的本质。

整体严格遵循 MoneyGram Haas F1 Team 针对 2026 规则赛车 **VF-26**（北卡罗来纳坎纳波利斯与英国班伯里基地）的官方设计语汇：**纯粹吸光的工程机加工碳黑（Industrial Chassis Carbon）作为全车主骨架，大面积轻量化半哑光冷白（Lightweight CNC White）构建前翼与侧箱关键对比面，MoneyGram 标志性速度红（Speedway Racing Red）提供精准的性能指示与动量爆发，微细机械铝灰（Machined Alloy Gray）构筑严密的机加工公差导轨**。

2026 年是哈斯追求极限能效与底盘轻量化的全新里程碑。设计语言崇尚“Form Follows Function（形式服从功能）”的美式工业哲学。网页转译时必须保持这四者的结构秩序：**碳黑是机械结构，冷白是空气动力学外壳，速度红是关键指引，银灰是金属装配公差**。

---

## 整体气质关键词

* industrial cnc white (工业机加工冷白)
* raw chassis carbon black (外露裸碳黑)
* moneygram speedway racing red (MoneyGram 速度红)
* form follows function (形式服从功能的美式机械风)
* lightweight structural minimalism (轻量化结构极简)
* machined edges & tight tolerances (严密装配缝隙与公差)
* brutalist high-contrast utility (坚毅实用的红白黑对比)

---

## 一、核心配色方案

### 1) 品牌核心层（2026 网页复现基准值）

这层负责在 0.1 秒内建立 Haas 硬朗纯粹的工业辨识度：

* **VF-26 轻量半哑冷白 / CNC Lightweight White**：`#F8F9FA`
  * 赛车鼻锥前部、车号区域与主视口受光面。半哑光涂层（Roughness 0.28, Metalness 0.15），无多余浮夸反光。
* **冷白受光漫射 / Specular Diffuse Light**：`#FFFFFF`
  * 摄影棚天幕直射形成的清冷均匀受光。
* **外露工程裸碳黑 / Raw Chassis Carbon**：`#0F1012`
  * 侧箱下洗通道、底板、扩散器与后半段外壳。
* **深邃机房黑底 / Deep Pitlane Void**：`#060708`
  * 页面的最终深色底座。
* **MoneyGram 速度红 / Speedway Racing Red**：`#DA291C`
  * 速度装饰线、主行动点、刹车卡钳与警示遥测。
* **机加工合金灰 / Machined Alloy Gray**：`#2E3238`
  * 结构连接件、边框导轨与刻度标尺。

### 2) 推荐扩展色阶

用于悬挂受力分析、轮胎磨损阶梯与底盘气流模拟界面：

* **次级碳黑层 / Secondary Weave Carbon**：`#16181C`（一级卡片背景）
* **机匣深灰 / Housing Dark Slate**：`#1D2026`（悬浮面板）
* **工程紧固线 / Fastener Hairline**：`#323740`（1px 结构导轨）
* **速度红辉光 / Racing Red Flare**：`rgba(218, 41, 28, 0.40)`
* **工业警告黄 / Haas Hazard Amber**：`#F5A623`（次要预警指示）

### 3) 页面结构层（暗色基准）

* **主画布背景**：`#060708`
* **一级容器底色**：`#0F1012`
* **二级卡片底色**：`#16181C`
* **交互与弹出层**：`#1F2228`
* **微细结构导轨**：`#2E3238`（或 `rgba(248, 249, 250, 0.12)`）
* **强化交互边框**：`rgba(218, 41, 28, 0.50)`
* **主阅读文字**：`#F8F9FA`（Contrast Ratio > 16:1）
* **次级工程文字**：`#A4ABB6`
* **弱化注记 / 规格零件号**：`#6C7480`

### 4) 数据可视化与遥测层

* **Series 1（主遥测/速度曲线）**：`#DA291C`（速度红）
* **Series 2（工程对比基准）**：`#F8F9FA`（冷白）
* **Series 3（机械负荷）**：`#8C95A2`（合金灰）
* **基准对齐网格**：`#2E3238`
* **Status Nominal（标称状态）**：`#00D26A`
* **Status Critical（超限）**：`#DA291C`
* **Status Standby（就绪）**：`#F8F9FA`

---

## 二、网页配色占比与面积法则

哈斯的设计美学是 **“红白黑三元绝缘体”**，拒绝任何中间模棱两可的杂色。

### 1) 推荐整页占比（沉浸式 Surface 展示页）

* **外露碳黑与深邃黑底（#060708 / #0F1012 / #16181C）**：约 **68%**（构建坚固的机械减重骨骼）
* **机加工冷白与高对比文字（#F8F9FA / #A4ABB6）**：约 **26%**（清晰的数据与车身亮面）
* **MoneyGram 速度红（#DA291C）**：**严格控制在 4%~6%**（主 CTA、赛道贯穿线与关键标识）
* **机加工合金分割线（#2E3238）**：约 **2%**

### 2) 绝对禁止项（Anti-patterns）

* ❌ **禁止使用柔和渐变与花哨渐变**：哈斯的红白黑是对抗性、结构性的硬分割，禁止在白红之间做软绵绵的彩虹渐变。
* ❌ **禁止大圆角与拟物阴影**：全部采用锐利的直角（0px）或 2px 极小微倒角，严禁出现超过 6px 的圆角。
* ❌ **禁止任何非功能性多余色彩**：坚决排除紫色、粉色、青绿等杂色，保持纯粹的美式工业硬核质感。

---

## 三、元素级组件设计规范

### 1) 背景与连续车身

* `body` 底色统一锚定 `#060708`，背景使用 PBR 轻量工业冷白车身 Shader。
* WebGL 回退方案使用双层方向性机械受光渐变：
  ```css
  background:
    radial-gradient(110% 65% at 20% 12%, rgba(248, 249, 250, 0.22) 0%, transparent 60%),
    linear-gradient(160deg, #24272D 0%, #121417 38%, #060708 100%);
  ```

### 2) 按钮与行动点（CTA）

* **主按钮（Haas Racing Red）**：
  * 背景：`#DA291C`
  * 文字：`#FFFFFF`（DIN / Roboto Mono 粗体大写，紧凑工业字偶距）
  * 悬浮态：背景微亮 `#ED3B2E`，`box-shadow: 0 0 16px rgba(218, 41, 28, 0.45)`
* **次级按钮（Raw Carbon Outline）**：
  * 背景：`rgba(255, 255, 255, 0.04)`
  * 边框：`1px solid #2E3238`
  * 悬浮态：`border-color: #F8F9FA`, `color: #FFFFFF`

### 3) 赛道贯穿线（Track Keyline）

* 颜色：`#DA291C`（MoneyGram 速度红）
* 笔尖发光点：`#FFFFFF`（纯白高能光爆点）
* 线宽：`2.5px`，以纯直角折弯贯穿工业布局。
