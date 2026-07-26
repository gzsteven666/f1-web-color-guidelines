# Web Craft：字体、形状、材质与动效配方

颜色之外的美观度维度。各车队 reference 文件负责"用什么颜色"，本文件负责"怎么把颜色做出车队质感"。

## 适用场景

在下面场景读取本文件：

- 用户要代码实现（HTML / CSS / React / Tailwind）
- 用户要提升页面美观度，或抱怨"颜色对了但不好看"
- 审查页面时发现问题出在字体、圆角、材质、动效，而不是色号
- 需要材质（车漆 / 碳纤维 / 噪点）的具体 CSS 配方

只要颜色规范、token、占比，不需要读本文件。

## 1. 字体系统

F1 视觉辨识度一半来自字体。按角色分配，不要整页一种字重：

| 角色 | 规则 |
| --- | --- |
| Display / 大标题 | 重字重（600-800），全大写或首字母大写，字距收紧 `-0.01em ~ -0.02em` |
| 标签 / 导航 / 表头 | 小字号（12-13px），全大写，字距放宽 `0.08em ~ 0.14em`，用次级文字色 |
| 正文 | 常规字重，行高 1.6 左右，不要用 Display 字体排正文 |
| 数据 / 遥测数字 | 等宽字体，或 `font-variant-numeric: tabular-nums`；关键数值用大字号 + 轻字重 |

### 每队推荐开源字体

| 车队 | Display / 标题 | 数据数字 | 气质说明 |
| --- | --- | --- | --- |
| Aston Martin | Archivo / Instrument Sans | IBM Plex Mono | 优雅克制的工程感，不要过窄过挤 |
| Mercedes | Space Grotesk / IBM Plex Sans | IBM Plex Mono | 精密工业感，中性冷静 |
| McLaren | Barlow Semi Condensed / Archivo | JetBrains Mono | 窄体锐利，轻快高能见度 |
| Ferrari | Saira / Archivo | IBM Plex Mono | 略带意式张力，可用斜体强调速度 |
| Cadillac | Archivo（宽体设置）/ Anton | IBM Plex Mono | 宽体几何，雕塑感 |

### 字体禁止项

- 不要用圆润人文字体（Nunito、Quicksand、Comfortaa）——一秒变消费 App
- 不要用 Orbitron、Audiowide 这类"科幻字体"——一秒变电竞
- 不要给标题加发光 text-shadow
- 数据表格里的数字必须对齐（tabular-nums 或等宽），否则仪表感全无

## 2. 形状语言

### 圆角

圆角大小直接决定"工程感还是 SaaS 感"：

| 车队 | 推荐圆角 | 说明 |
| --- | --- | --- |
| Aston Martin | 4-6px | 克制的工程圆角 |
| Mercedes | 4px | 精密、统一 |
| McLaren | 2-4px | 最锐利 |
| Ferrari | 6-8px | 可以稍柔和，但不要药丸形卡片 |
| Cadillac | 0-2px | 直角切面，雕塑感 |

超过 10px 的大圆角是所有车队的共同反模式。药丸按钮（`border-radius: 999px`）只允许用在小型 tag / badge 上。

### 斜切与速度线

- 斜切角度全页统一一个值。McLaren 可用 `-12deg`（激进），Aston Martin / Mercedes 用 `-8deg`（收敛），Cadillac 用 chevron 折线而不是斜切。
- 实现方式二选一：

```css
/* 方式一：clip-path 切角，适合 hero 底边、色块、图片容器 */
.hero-panel {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 48px), 0 100%);
}

/* 方式二：skew 只斜切装饰条本体，文字保持水平 */
.speed-tag {
  transform: skewX(-8deg);
}
.speed-tag > span {
  display: inline-block;
  transform: skewX(8deg); /* 内层反向抵消，文字不倾斜 */
}
```

### 细节线与低重心

- 卡片顶部或左侧 2px 品牌色细线，是最便宜也最有效的"赛车高光边线"
- 边框统一 1px 低对比色，不要 2px 粗描边
- 页面重心要低：深色厚重的 footer、横向分割线、hero 光带从左上向右下扫

## 3. 材质配方

各队 reference 里的材质隐喻（gloss paint / carbon fibre / brushed metal）对应的 CSS 实现：

### 金属车漆（方向性受光）

核心是"一束主光扫过深色曲面"，不是平均渐变。用 radial-gradient 做受光区，叠在深色底上：

```css
.paint-surface {
  background:
    /* 受光层：光源固定在左上，亮部集中、边缘快速衰减 */
    radial-gradient(120% 80% at 28% 0%,
      rgba(41, 168, 146, 0.22) 0%,   /* 换成对应车队的高光色 */
      transparent 55%),
    /* 车漆底色层 */
    linear-gradient(135deg, #06100F 0%, #002420 48%, #04554A 100%);
}
```

规则：**全页光源方向统一**（推荐 135deg / 左上），亮部集中在一处，暗部保持厚重。

### 碳纤维编织纹

```css
.carbon-surface {
  background-color: #0C1110;
  background-image:
    /* 两组 45° 交叉细纹模拟编织，纹理必须很轻 */
    repeating-linear-gradient(45deg,
      rgba(255, 255, 255, 0.028) 0 2px, transparent 2px 4px),
    repeating-linear-gradient(-45deg,
      rgba(0, 0, 0, 0.35) 0 2px, transparent 2px 4px);
}
```

只用在局部（侧栏、footer、hero 暗部），不要整页铺碳纤维。

### 哑光噪点

消除大面积深色的"数字塑料感"，让底色更像喷漆：

```css
.matte-surface {
  position: relative;
}
.matte-surface::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.05; /* 噪点必须极轻，可见但说不出来 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

### 阴影

工程感的阴影是"低而硬"，不是"高而软"：

```css
/* 推荐：贴地、收紧 */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);

/* 反模式：飘浮、发光 */
/* box-shadow: 0 24px 64px rgba(x, x, x, 0.5); */
/* box-shadow: 0 0 24px var(--brand); */
```

## 4. 动效

- 过渡时长 150-250ms，缓动用快出缓入：`cubic-bezier(0.2, 0, 0, 1)`
- hover 推荐：横向位移 2px（速度感）、边框或细线亮起、背景加一层 `rgba(brand, 0.08)`
- 标志性动效（可选，每页最多一两处）：关键数字滚动进场、hero 光带缓慢平移、速度线 reveal
- 必须响应 `prefers-reduced-motion: reduce`，降级为无动画
- 禁止：弹跳缓动（bounce / spring 过冲）、发光脉冲、无限旋转装饰、整页视差

### 流光扫过（金属感的"动"）

一条窄光带缓慢扫过 hero 车漆表面，周期 8-10 秒，尾段停顿避免变成跑马灯：

```css
.hero::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(115deg,
    transparent 34%,
    rgba(255, 255, 255, 0.07) 46%,
    rgba(brand-highlight, 0.16) 52%,  /* 换成对应车队高光色 */
    transparent 64%);
  animation: sheen 9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes sheen {
  0%   { transform: translateX(-70%); }
  60%  { transform: translateX(70%); }
  100% { transform: translateX(70%); } /* 停顿再循环 */
}
```

### 金属感的静态配方补充

- **金属字面**：大标题用白 → 冷银的纵向渐变 `background-clip: text`，像抛光金属铭牌
- **顶部内高光**：卡片、按钮加 `box-shadow: inset 0 1px 0 rgba(255,255,255,0.05~0.18)`，模拟板件上缘受光
- **纵向漆面微渐变**：surface 类元素用上亮下暗的 3 段微渐变代替平涂（明度差控制在 3-5%）
- **柱状图生长**：`transform-origin: bottom` + `scaleY(0) → 1`，逐根错峰 60ms

## 5. 页面构图

比"点缀"更高一层的判断，决定页面是"样式陈列"还是"真实产品"：

- **不要做成样品陈列页**：token 一排、组件一排、材质一排的结构，上限只有"整齐"。追求美观时按真实产品页构图：不对称栅格（如 12 栏的 8+4 / 7+5）、有主次的视觉焦点、文档性内容压缩成一条带
- **hero 即场景**：hero 的车漆渐变本身就是"赛车画面"，HUD 面板、仪表组直接浮在上面，不需要另外垫舞台
- **集成仪表组优于并排卡片**：转播 halo 仪表是一整块集成面板（LED 灯组 + 双读数 + 读数框 + 弧形刻度表的纵向构图），做成一个 cluster 放在 hero 焦点位，比拆成三张并排卡片更有 HUD 感、更有构图重心
- **等高行留白处理**：栅格同行内高度不齐时，让图表类内容 `flex: 1` 纵向撑满，不要留大块卡内空白

## 6. 版式与细节点缀

页面"颜色对了但还是平"时，用这些手法建立节奏和构图（每页选 3-4 个，不要全上）：

- **Racing stripe**：页面最顶部 2px 品牌色 → 高亮色 → 透明的横向渐变条，车身拉花的网页化
- **巨型幽灵元素**：hero 留白侧放超大描边装饰——赛车主题页可用车号数字（`-webkit-text-stroke` + `color: transparent`），非赛车内容用抽象斜切面板群（描边 + 渐变各一两块，高低错落），透明度压到 0.3 以下，配全页统一的斜切角度。**注意：把车队配色用在普通产品页时，装饰必须抽象化，不要塞车号、赛车剪影等具象元素**
- **速度线**：2px 宽、上下渐隐的细线 2-3 根，高低错落 + 斜切变换，只放一组
- **章节标题工程线**：标题行尾接 `flex: 1` 的 1px 渐隐横线 + 标签前加斜切小色块，做出图纸标注感
- **色卡受光**：色块叠一层左上 radial 白色高光（opacity ≤ 0.14），从平涂矩形变成漆面色板
- **图表仪表化**：加 1px 基线 + 高亮色虚线目标线（dashed，opacity ≈ 0.3）
- **HUD 仪表**（参考 F1 转播 halo 仪表的视觉语言，数据内容可以完全通用）：
  - **先垫场景再谈透明**：转播 HUD 的透明感来自浮在赛车画面上；网页里必须先给 HUD 区垫一块金属漆面渐变当"场景"，半透明面板（填充 40-50% 透明度 + `backdrop-filter: blur` + 亮描边）浮在上面才成立。纯色底上做透明毫无意义
  - 弧形仪表：SVG 半圆弧 + `stroke-dasharray` 做进度，刻度用虚线弧，尾段用信号色标"红区"（告警区间）；注意进度初始值要写在 CSS 类里，写成内联 style 会压过进场动画的目标值
  - 分段 LED 量条：等宽小格 + 斜切变换，激活段才上品牌色渐变，进场逐格点亮（约 35ms/格）
  - 双描边读数框：外框 1px 品牌色半透明 + 内框 1px 品牌色低透明（inset 4px），低填充深底
  - HUD 面板是"浮"不是"压"：去掉厚重外阴影，只留 1px 顶部内高光；这是"深色 HUD 面板"，不是 glassmorphism 磨砂拟态
- **交替底色**：长页面隔段用上亮下暗的微渐变（明度差 3-5%）做深浅节奏
- **微交互**：主按钮箭头 hover 前窜 3px、卡片 hover 抬升 2px + 边线亮起
- **收尾三件套**：`::selection` 品牌绿底白字、`:focus-visible` 品牌色焦点环（不用默认蓝）、深色自定义滚动条（`scrollbar-color` + `::-webkit-scrollbar`，Windows 默认亮色滚动条会破坏深色整体感）
- **控件基准**：输入框比卡片再深一层（"凹进去"）、开关激活态才用品牌色、tabs 用 2px 品牌线与导航语言一致；焦点环用 `box-shadow 0 0 0 3px rgba(brand, 0.18)`，克制不发光
- **响应式降级顺序**：先收装饰（幽灵车号、速度线），再收列数，最后收字号；窄屏装饰整体退场，不要缩小硬塞

## 7. 非颜色反模式

颜色全对但页面仍然不像车队时，先查这几项：

- 圆角太大 → 变通用 SaaS
- 字体太圆润 / 用了科幻字体 → 变消费 App / 电竞
- 阴影太高太软 → 失去工程感和重量
- 表面全平涂、无受光无纹理 → "像一点颜色"但没有材质
- 留白节奏完全均匀 → 失去速度感，像文档不像驾驶舱
- 数字不对齐、非等宽 → 仪表感全无

### 编辑落地页的招牌动效（Steep 式，已在 aston-martin-editorial.html 实现）

参考站的动效我实际逆向过（`document.getAnimations` + 滚动前后 transform 对比），核心是四件：

1. **悬浮残片视差**（双通道）：
   - 滚动通道：每张残片一个不同速率，且**正负交错**（如 -0.28 / +0.12 / -0.45）——反向运动让相对速度翻倍，短 hero 里也能感知；太保守的同向小速率（-0.1 级别）用户基本感觉不到
   - 鼠标通道：光标在 hero 内的归一化位置（-0.5~0.5）× 各残片 depth（22~52px），配 600ms 缓动像有惯性；不滚动也有分层悬浮感，这是短 hero 的主要感知来源
   - 实现：JS 只写 `--plx/--mx/--my` 变量（rAF 节流滚动、mouseleave 归零），transform 合成留在 CSS；窄屏归零
2. **描线进场（sweep）**：SVG 手势线 `stroke-dasharray` 全隐 → `dashoffset: 0` 画满（约 1.2s），端点信号色圆点最后 300ms 亮起
3. **柔光漂移**：一团大半径 radial 光晕在色面上 12-15s `alternate` 极慢游移；车队化时光晕用品牌高光色，浮在车漆面上而不是浅色背景上
4. **fade-in-y 进场**：和深色版一致的上浮显现，但编辑风更轻（8-10px 位移、700ms）

注意：视差在窄屏（残片改为静态排列时）必须归零；所有动效照常受 `prefers-reduced-motion` 约束。

### 无盒版式（卡片布局的替代方案）

用户不喜欢"一切装进圆角卡片"时的三种替代结构（已在 aston-martin-editorial.html 实现）：

- **杂志目录式索引行**：功能列表用 等宽编号 + 标题 + 描述 + 箭头 的栅格行，行间只有发丝线；hover 时品牌色微光从左扫入、箭头前移 6px。替代"三张功能卡"
- **整幅色带（paint band）**：强调引用/口号直接放在一条通栏品牌色车漆面上（含受光 + 流光），不装卡片。品牌色以"车身涂装"的方式大面积出场，比水洗色卡片更有身份
- **无盒数据版面**：表格去掉容器、阴影和底色，表头压一条品牌深色线，行间发丝线，左侧配衬线导语。像杂志数据栏目而不是 dashboard 控件
- 无盒版式下 section 之间不要再加分割线——区块靠留白与色带交替分隔
- hero 的悬浮残片可以保留卡片形态：它是"漂浮物"不是布局容器，两者不冲突

### 尺度暴力（outstanding 的第一杠杆）

页面"哪都对但不出彩"时，第一个检查的就是字号尺度。安全的字号（80px 级 hero）只能做出"整齐"；编辑级的惊艳来自吓人的尺度和被故意打破的边界：

- **hero 巨字**：`clamp(64px, 15vw, 200px)` 量级的衬线 display，`white-space: nowrap` + 第二行 `padding-left: 8vw` 错位——尾部**故意撞破画布右缘被裁掉**，出血本身就是版面语言（配 `overflow: hidden`）
- **巨字与色块重叠要谨慎**：横向出血（撞破画布边缘被裁）是安全的；但巨字纵向压进深色色面时，同色系文字会糊在色块里不可读。深色面应锚定在 hero 底部、高度让开巨字区——重叠只发生在明度反差足够的元素之间（如白色残片压深色面）
- **巨型幽灵编号**：列表编号放大到 120px+ 衬线、品牌色 12-15% 透明度、绝对定位压在行文字后面；hover 时透明度升到 30% 并右移，编号从注脚变成图形元素
- **区块标题跟进**：section 标题拉到 72px 级、引用文字拉到 54px 级——巨字 hero 定下的尺度，下文必须接住，否则头重脚轻
- 尺度暴力与"克制"不冲突：字重仍是 400、颜色仍然极简，暴力只在**尺寸和边界**上发生
- 窄屏收敛：巨字恢复换行、错位归零、幽灵编号缩到 80px——出血是桌面端的奢侈品

## 8. 基准模板

`assets/templates/` 下有可直接双击打开的单文件 HTML 基准模板。模板是视觉与代码参考，不是必须照抄的固定骨架。

- 用途：实现代码时的视觉基准、审查纠偏时的对照物、材质配方的运行实例
- 选择模板前先判断页面气质，不要因为车队相同就固定使用同一种结构

### 模板清单

每队一个浅色 Editorial 模板（同一骨架：巨字出血 + 无盒版式 + 双通道视差 + 车漆横带），Aston Martin 另有深色版：

1. `aston-martin-editorial.html` — 绿墨纸面 + Racing Green 车漆场（Editorial 骨架的原型）
2. `mercedes-editorial.html` — 冷银纸面 + 黑碳车漆场 + 低位 PETRONAS 流线
3. `mclaren-editorial.html` — 冷灰纸面 + papaya/anthracite 正反结构横带
4. `ferrari-editorial.html` — 暖白纸面 + Rosso 车漆场 + 底缘白色结构切线
5. `cadillac-editorial.html` — 冷白纸面 + black-to-white split 横带 + chevron 暗纹（全页单色，形状收紧成直角切面）
6. `aston-martin.html` — 深色 Mission Control（dashboard、监控台、开发者工具场景）

同骨架不等于换色模板：每队的横带构图、点睛色用法、圆角语言、纹理都按各自规范差异化——审查时如果五队看起来只是换了主色，就是跑偏。

### 迁移原则

- 可以借鉴其他优秀设计系统的**构图、排版和层级方法**，不必被既有车队模板绑死。
- 迁移时替换的是色彩角色与材质语义，而不是简单把所有原色换成车队主色。
- 结构必须与内容形态匹配：编辑落地页不要硬套 HUD dashboard；数据监控台也不要为了杂志感牺牲信息密度。
- 同一页面只选择一套结构语言。深色工程模式与浅色编辑模式可以属于同一品牌系统，但不要在一个页面中混杂。
