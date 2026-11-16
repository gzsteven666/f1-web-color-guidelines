# 连续车身表面模式（WebGL 车漆背景）

把整个页面的背景做成一块实时渲染的赛车车身：金属漆、清漆高光、影棚灯带、金属漆闪点，随滚动滑移，并在指定位置切换到车队的第二种涂装。11 支车队各有一套预设。

这是一个**背景层**，不是组件库：页面内容照常用 HTML/CSS 写，叠在车身上面。

## 什么时候用

适合：

- 落地页、产品首页、发布页、作品集这类"首屏要有冲击力、正文不多"的页面
- 用户明确要"车身质感 / 车漆 / 金属漆闪点 / 粒子感 / 像演示页那样的背景"

不适合：

- 数据密集的 dashboard、后台、长表格、长文档 —— 背景会和内容抢注意力，用 `<team>-editorial.html` 或 `aston-martin.html` 的做法
- 必须离线运行、或不能接受额外加载 three.js 的页面
- 需要支持很旧的设备且没有时间做回退验证的项目

拿不准时先问用户，不要默认给每个页面都加上。

## 文件

| 文件 | 作用 |
| --- | --- |
| `assets/surface/paint-surface.js` | 车漆渲染（three.js） |
| `assets/surface/racing-line.js` | 贯穿全页的涂装线（SVG，可不用） |
| `assets/surface/surface-page.js` | 入口：把车漆、涂装线、滚动接到一起 |
| `assets/surface/teams.js` | 11 支车队的预设 |
| `assets/templates/<team>-surface.html` | 每队一个完整示例，单文件，双击可开 |

依赖只有两个，版本要锁定：`three@0.186.1`、`lenis@1.3.26`。车漆是通过改写 three.js 内置着色器实现的，**换 three.js 版本前必须重新验证画面**，不要顺手升级。

## 接入方式

### 方式一：直接改模板（最快）

复制 `assets/templates/<team>-surface.html`，替换文案和区块。渲染代码已经内联在文件里，不需要构建，也不需要另外拷贝 `assets/surface/`。

### 方式二：接进自己的页面

把 `assets/surface/` 整个目录拷进项目，然后做三件事。

**1. 结构**：车漆 canvas 固定铺满视口，内容在它上面。

```html
<html class="no-js">
<body>
  <canvas id="paint" aria-hidden="true"></canvas>
  <div class="paint-shade" aria-hidden="true"></div>
  <svg id="racing-line"></svg>          <!-- 不要涂装线就删掉这一行 -->

  <main>
    <section class="hero" data-line="4,20 96,88">…首屏…</section>
    <section class="seam" data-seam>…过渡区：文字少、留白多…</section>
    <section>…第二种涂装上的内容…</section>
  </main>
</body>
</html>
```

**2. 样式**：

```css
#paint {
  position: fixed; inset: 0; width: 100%; height: 100%;
  z-index: 0; opacity: 0; transition: opacity 900ms ease;
}
#paint[data-ready] { opacity: 1; }      /* 第一帧画完才淡入，避免闪一下 */
.no-webgl #paint { display: none; }     /* 回退时露出 body 上的 CSS 渐变 */

/* 压光层：文字所在的一侧压暗，高光留给另一侧。数值按版式自己调 */
.paint-shade {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(90deg, rgba(5,6,7,.74) 0%, rgba(5,6,7,.46) 46%, rgba(5,6,7,0) 78%);
}
#racing-line { position: absolute; top: 0; left: 0; z-index: 2; pointer-events: none; overflow: visible; }
main, nav, footer { position: relative; z-index: 3; }

.seam { min-height: 140vh; }            /* 过渡区要足够高，下部约 30% 留白给分色线 */
```

**3. 脚本**：

```html
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.min.js",
  "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.core.js": "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.core.min.js",
  "lenis": "https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.mjs"
} }
</script>
<script type="module">
  import { ASTON_MARTIN } from './surface/teams.js';
  import { mountSurfacePage } from './surface/surface-page.js';

  // 车漆层不可用时露出的 CSS 渐变（每个预设都自带一份）
  document.body.style.backgroundImage = ASTON_MARTIN.fallback;

  const page = mountSurfacePage({
    canvas: document.getElementById('paint'),
    svg: document.getElementById('racing-line'),   // 不要涂装线就传 null
    preset: ASTON_MARTIN,
    seams: [...document.querySelectorAll('[data-seam]')],
    onFallback: () => document.documentElement.classList.add('no-webgl'),
  });
</script>
```

注意：

- `type="module"` 的相对路径导入**必须通过 http 访问**，直接双击 HTML 会被浏览器拦下。本地用任意静态服务器；要双击可开的单文件，走方式一。
- 用打包工具（Vite / webpack 等）时不要 import map，改成 `npm i three@0.186.1 lenis@1.3.26`。
- 预设的导出名：`MERCEDES`、`FERRARI`、`MCLAREN`、`ASTON_MARTIN`、`CADILLAC`、`WILLIAMS`、`RED_BULL`、`AUDI`、`ALPINE`、`RACING_BULLS`、`HAAS`；也可以用 `TEAM_PRESETS[id]`。

### React / Vue

在组件挂载后调用 `mountSurfacePage`，卸载时调用返回值的 `destroy()`，否则会泄漏 WebGL 上下文和滚动监听：

```jsx
useEffect(() => {
  const page = mountSurfacePage({ canvas: canvasRef.current, svg: null, preset, seams: [] });
  return () => page.destroy();
}, []);
```

运行中换车队用 `page.setPreset(newPreset)`（带约 0.9 秒的斜向扫掠过渡；传 `{ transition: false }` 关闭），不要销毁重建。

## 页面要配合的地方

- **文字放在暗部**：高光带很亮，正文压在上面读不清。用压光层把文字一侧压暗，或给文字加深色光晕（多层 `text-shadow`）。做完必须截图检查对比度，尤其是白色、黄色车身的车队。
- **过渡区（`data-seam`）**：视口中线走过它时车漆从第一种涂装换到第二种。里面只放一句标题，下部留白。手机上可以缩短到约 `112vh`。
- **文字颜色跟随涂装**：入口脚本会给过渡区的每个同级区块写入 `--surface-tone`（0 = 第一种涂装，1 = 第二种），根元素上的同名变量在分色线滑过导航栏时翻转。两种涂装明暗差别大的车队（Haas、Racing Bulls、Cadillac）需要据此切换文字色，写法见对应模板。
- **涂装线**：给区块加 `data-line="x1,y1 x2,y2 …"`（区块内的百分比坐标），线会依次穿过这些点。不想要就不放 `<svg>`。
- **减少动态效果**：系统开启"减少动态效果"时，平滑滚动、指针跟随和切换过渡会自动关闭，不需要另外处理。

## 调参

预设是普通对象，可以展开后覆盖。常用的几项：

| 参数 | 位置 | 含义 |
| --- | --- | --- |
| `flake` | `livery[i].flake`，0 ~ 1 | 金属漆闪点强度。0 关闭；金属漆 0.45 ~ 0.55，实色漆 0.2 ~ 0.25；哑光漆和碳纤维不要加 |
| `color` / `metalness` / `roughness` | `livery[i]` | 底漆颜色、金属度、粗糙度 |
| `clearcoat` / `clearcoatRoughness` | `livery[i]` | 清漆强度与光滑度，决定高光带有多锐 |
| `silhouette` | `surface.silhouette` | 车身上缘轮廓的高度、斜率、隆起 |
| `split` | `surface.split` | 两种涂装之间分色线的斜度、弧度、饰条 |
| `backdrop` | `studio.backdrop` | 影棚幕墙、地面、轮廓光的颜色 |
| `maxDpr` | `render.maxDpr` | 像素比上限，默认 1.5；调高更清晰也更耗性能 |

```js
const preset = structuredClone(ASTON_MARTIN);
preset.livery[0].flake = 0.3;      // 闪点弱一些
```

关于闪点（"粒子感"）要知道的三点：

1. 它只增亮、不变暗，所以只出现在高光边缘和渐变处，暗部是干净的 —— 想让整块车身都闪，要调的是灯光（`studio.strips`），不是把 `flake` 拉满。
2. 颗粒大小是着色器里的常量（`FLAKE_CELL`，约 1.7 个屏幕像素），按默认画面比例调好的。颗粒小于一个像素时会自动淡出，所以把车身缩得很小会看不到闪点。
3. 改颜色时注意：金属漆的 `color` 是它受光处的反射色，不是印象里的"深色"。Aston Martin 用 `#037A68` 而不是色卡上的 `#002824`，后者做底漆几乎是黑的。

车队色号仍以 `references/<team>.md` 为准；改预设颜色前先读对应文件。

## 回退与已知限制

- **不支持 WebGL / GPU 上下文丢失**：触发 `onFallback`，按上面的写法会隐藏 canvas、露出 `preset.fallback` 的 CSS 渐变。页面内容不受影响。务必保留这条路径。
- **CDN 不可达**：模块加载失败，脚本整体不执行。所以"进场前隐藏内容"之类的样式必须挂在 `html.js` 上，并在 `<head>` 里用一行内联脚本把 `no-js` 换成 `js`（见模板），保证脚本失败时内容仍然可见。对访问环境没把握时，把 three 和 lenis 放到自己的静态资源里。
- **验证范围**：目前只在桌面 Chrome 和 Chrome 模拟的手机视口下检查过。Safari、iPhone 真机、低端安卓未验证，也没有按设备性能分级降画质。交付前请在目标设备上实测，并如实告诉用户这一点。
- **性能**：每帧全屏着色。没有做过基准测试，不要对用户声称具体的帧率或耗电数字。
- **截图检查**：这类页面"构建通过"不代表画面正确（曾出现过整页黑屏而所有检查通过）。改完必须实际打开页面看首屏、过渡区和末屏。
