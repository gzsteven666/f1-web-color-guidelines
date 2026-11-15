/**
 * ==================================================================
 * paint-surface.js —— 连续车漆表面（共享核心，原生 HTML 与 React 通用）
 * ==================================================================
 *
 * 为什么需要它：
 *   旧模板把车漆做成一块块 CSS 渐变色带，交界处硬切，看起来像"贴了色卡"。
 *   这里把整页当成一块车身：一个 position: fixed 的全屏 canvas 垫在所有内容下面，
 *   内容区块全部透明，金属质感和颜色因此贯穿整页。
 *
 * 金属感从哪里来（都是 three.js 自带的成熟能力，不手写光照公式）：
 *   1. MeshPhysicalMaterial 的 clearcoat（清漆层）→ 锐利的柔光箱反射，车漆"亮"的来源
 *   2. metalness + 金属颗粒法线贴图 → 底漆里细碎的金属闪点
 *   3. 自定义"摄影棚"：几条发光长条经 PMREMGenerator 预滤波成环境贴图，
 *      反射顺着曲面流动 —— 汽车摄影里最典型的车漆观感
 *   唯一的自定义着色器代码是"车身曲面法线"：几组低频正弦 + 腰线台阶，
 *   逐像素算出法线，让一块平面看起来像起伏的车身板件。
 *
 * 两种观感（由预设决定，参数缺省时保持旧观感）：
 *   - 流动丝绸：多组正弦交叉 + 彩色灯条 → 反射是 S 形流光（旧预设）
 *   - 影棚效果图：surface.panel 把车身切成一块块绷紧的凸面板件，板件之间是带圆角的折线；
 *     studio.strips 用中性白光、带 edge 渐变边的柔光箱 → 反射是又长又顺、边缘利落的光带，
 *     接近车队发布会和影棚效果图里的车漆。
 *
 * 影棚空间（studio.backdrop + surface.silhouette，可选）：
 *   车身不再铺满整页，而是一辆"摆在影棚里的车"。页顶是车身上沿的轮廓，轮廓之上是无缝背景幕墙，
 *   轮廓线上有一道边缘光；页底是车身下沿，下面是带倒影的地面。轮廓跟着页面内容一起滚动，
 *   所以读者是从车顶一路看到车底：hero 看到车停在幕墙前，中段是满屏车漆，页脚落到地面上。
 *
 * 滚动时发生什么：
 *   - 曲面以视差速度向上滑移 → 反射带在屏幕上移动
 *   - 灯光（环境贴图）绕水平轴缓慢旋转 → 光带从上往下扫过
 *   - tone 在相邻涂装阶段之间插值（Mercedes：前段冷银 → 后段碳黑）
 *
 * 用法：
 *   const surface = PaintSurface.create(canvas, MERCEDES, { reducedMotion });
 *   if (!surface) { ...切换 CSS 回退背景... }
 *   surface.setScroll(scrollY, innerHeight, maxScroll); // 每次滚动调用
 *   surface.setTone(0 ~ livery.length - 1);             // 涂装阶段
 *   surface.setSeams([过渡区中线的文档纵坐标]);         // 涂装分色线的位置（预设有 surface.split 时生效）
 *   surface.setPointer(x, y);                           // 鼠标位置，-1 ~ 1
 *   surface.dispose();                                  // 销毁后 canvas 不能再复用
 *
 * 降级策略：
 *   - 不支持 WebGL2 / 初始化失败 → create() 返回 null，由调用方切换 CSS 渐变
 *   - reducedMotion → 冻结起伏漂移、视差和鼠标响应，只在涂装变化时重绘
 *   - 像素比封顶（默认 1.5），标签页隐藏时不渲染
 */
import * as THREE from 'three';

// 涂装分色：着色器里涂装阶段、分色线、分色线上的饰条各自的数组长度
const MAX_STOPS = 4;
const MAX_SEAMS = 3;
const MAX_STRIPES = 2;
// 进场扫光：页面打开时灯光从偏转位置回到静止位置所用的时间（秒）
const INTRO_SWEEP_SECONDS = 2.4;

// 着色器里正弦波 uniform 数组的长度（预设里最多写这么多组）
const MAX_WAVES = 6;

// 相机：视场角 35°、距离 10 → 画面可见高度约 6.31 个世界单位。
// 曲面图案用世界单位定义，所以无论屏幕多大，起伏相对屏幕高度的比例都一样。
const CAMERA_FOV = 35;
const CAMERA_DISTANCE = 10;
const VISIBLE_HEIGHT = 2 * CAMERA_DISTANCE * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2));

/* ------------------------------------------------------------------
 * 着色器注入片段
 * MeshPhysicalMaterial 的着色器由 three.js 内置代码块拼成，
 * 这里通过 onBeforeCompile 在固定位置插入几行，其余光照计算全部沿用 three.js。
 * ------------------------------------------------------------------ */

// 顶点着色器：把每个顶点的世界坐标传给片元着色器
const BODY_PARS_VERTEX = /* glsl */ `
varying vec2 vBodyPos;
`;
const BODY_POS_VERTEX = /* glsl */ `
vBodyPos = ( modelMatrix * vec4( transformed, 1.0 ) ).xy;
`;

// 片元着色器：uniform 声明 + 车身曲面法线函数
const BODY_PARS_FRAGMENT = /* glsl */ `
uniform vec4 uWaves[ ${MAX_WAVES} ]; // 每组正弦起伏：(kx, ky, 振幅, 漂移速度)
uniform int uWaveCount;              // 实际使用的组数
uniform vec4 uCrease;                // 腰线：(方向 x, 方向 y, 间距, 锐度)
uniform float uCreaseHeight;         // 腰线台阶高差
uniform float uScrollY;              // 曲面滑移量（世界单位）
uniform float uTime;                 // 秒，驱动极慢的起伏漂移
uniform vec4 uPanel;                 // 板件：(方向 x, 方向 y, 板件宽度, 边缘最大倾斜)；倾斜为 0 时不启用
uniform float uPanelFillet;          // 折线圆角占板件半宽的比例（0 ~ 1）
varying vec2 vBodyPos;               // 片元在平面上的世界坐标

// —— 影棚空间 ——
uniform float uStage;                // 1 = 启用轮廓、幕墙与地面；0 = 旧的满屏车漆
uniform float uPageY;                // 页面已滚动的距离（世界单位，与内容同步，不带惯性）
uniform float uPageLen;              // 页面最大可滚动距离（世界单位）
uniform float uHalfW;                // 画面半宽（世界单位），轮廓形状按它归一化，手机和桌面比例一致
uniform float uPx;                   // 一个屏幕像素对应的世界单位，用来给轮廓边缘抗锯齿
uniform vec4 uSil;                   // 车身上沿：(基准高度, 斜率, 隆起高度, 隆起位置)，位置按半宽归一化
uniform vec2 uSilShape;              // (隆起宽度, 车身下沿在页底时的高度)
uniform vec3 uBackTop;               // 幕墙上部（线性色）
uniform vec3 uBackBottom;            // 幕墙靠近车身的下部
uniform vec3 uFloor;                 // 地面
uniform vec3 uRim;                   // 边缘光颜色 × 强度

// —— 涂装分色 ——
// 旧做法是整屏在两个涂装阶段之间渐变（像调色，不像车）。分色启用后，每个过渡区变成一条
// 固定在页面上的斜切分色线：线上方是前一阶段的漆，下方是后一阶段的漆，和真车的色块分割一样。
uniform float uSplit;                          // 1 = 启用逐像素分色；0 = 旧的整屏渐变
uniform int uStopCount;
uniform vec3 uStopColor[ ${MAX_STOPS} ];       // 各阶段底色（线性色）
uniform vec4 uStopMat[ ${MAX_STOPS} ];         // (金属度, 粗糙度, 清漆强度, 清漆粗糙度)
uniform float uStopWeave[ ${MAX_STOPS} ];      // 碳纤维编织纹强度（0 = 普通漆面）
uniform int uSeamCount;
uniform float uSeamY[ ${MAX_SEAMS} ];          // 分色线在页面坐标里的高度（世界单位）
uniform vec3 uSeamShape;                       // (斜切 rake, 弧度 bend, V 形 chevron)：画面边缘处的纵向偏移，世界单位
uniform int uStripeCount;
uniform vec4 uStripe[ ${MAX_STRIPES} ];        // 饰条：(离分色线的偏移, 宽度, 0, 0)，世界单位
uniform vec3 uStripeColor[ ${MAX_STRIPES} ];

// 当前像素的漆面参数，由 bodyLivery() 在 main 开头算一次，后面几处注入点共用
vec3 lvColor;
vec4 lvMat;
float lvWeave;

// 2×2 斜纹碳布：返回 (明暗, 纱束走向)。纱束宽度只有几个像素，太小时由调用方淡出，避免摩尔纹
vec2 carbonTwill( vec2 p ) {
  vec2 c = p / 0.05;
  vec2 cell = floor( c );
  vec2 f = fract( c ) - 0.5;
  float warp = step( 2.0, mod( cell.x + cell.y, 4.0 ) ); // 1 = 经纱在上（沿 y 走），0 = 纬纱在上
  float across = mix( f.y, f.x, warp );                  // 纱束截面方向上的位置
  return vec2( 1.0 - 2.6 * across * across, warp );
}

void bodyLivery( vec2 q ) {
  float xn = q.x / uHalfW;
  float py = q.y - uPageY; // 页面坐标：和页面内容一起滚动
  float tone = 0.0;
  float stripe = 0.0;
  vec3 stripeColor = vec3( 0.0 );
  for ( int i = 0; i < ${MAX_SEAMS}; i ++ ) {
    if ( i >= uSeamCount ) break;
    // f > 0 在分色线上方（前一阶段），< 0 在下方（后一阶段）
    float f = py - uSeamY[ i ] - uSeamShape.x * xn - uSeamShape.y * xn * xn - uSeamShape.z * abs( xn );
    tone += smoothstep( uPx, - uPx, f );
    for ( int k = 0; k < ${MAX_STRIPES}; k ++ ) {
      if ( k >= uStripeCount ) break;
      float a = uStripe[ k ].x;
      float b = a + uStripe[ k ].y;
      float m = smoothstep( a - uPx, a + uPx, f ) * smoothstep( b + uPx, b - uPx, f );
      stripeColor = mix( stripeColor, uStripeColor[ k ], m );
      stripe = max( stripe, m );
    }
  }
  float last = float( uStopCount - 1 );
  tone = clamp( tone, 0.0, last );
  int i0 = int( floor( min( tone, last - 0.001 ) ) );
  float t = tone - float( i0 );
  vec3 c0 = vec3( 0.0 ); vec3 c1 = vec3( 0.0 );
  vec4 m0 = vec4( 0.0 ); vec4 m1 = vec4( 0.0 );
  float w0 = 0.0; float w1 = 0.0;
  // 用循环 + 比较代替变量下标：部分移动端驱动对变量下标取 uniform 数组支持不好
  for ( int j = 0; j < ${MAX_STOPS}; j ++ ) {
    if ( j == i0 ) { c0 = uStopColor[ j ]; m0 = uStopMat[ j ]; w0 = uStopWeave[ j ]; }
    if ( j == i0 + 1 ) { c1 = uStopColor[ j ]; m1 = uStopMat[ j ]; w1 = uStopWeave[ j ]; }
  }
  lvColor = mix( c0, c1, t );
  lvMat = mix( m0, m1, t );
  lvWeave = mix( w0, w1, t );
  // 饰条：实色高光漆，盖在分色线旁边
  lvColor = mix( lvColor, stripeColor, stripe );
  lvMat = mix( lvMat, vec4( 0.0, 0.3, 1.0, 0.05 ), stripe );
  lvWeave *= 1.0 - stripe;
  // 裸碳是半哑光：粗糙度抬高、清漆减弱，和旁边的高光漆形成"哑光对亮面"
  lvMat = mix( lvMat, vec4( lvMat.x, 0.5, 0.3, 0.35 ), lvWeave );
  // 纱束小于约 4 个像素时淡出编织纹，只留哑光
  lvWeave *= smoothstep( 2.5, 5.0, 0.05 / uPx );
}

// 车身上沿在世界坐标里的高度：一条略微上扬的车身线，加一个像引擎盖 / 侧箱的平缓隆起
float bodyTopEdge( float x ) {
  float xn = x / uHalfW;
  float d = ( xn - uSil.w ) / uSilShape.x;
  return uSil.x + uSil.y * xn + uSil.z * exp( - d * d ) + uPageY;
}

// tanh 的导数 sech²：tanh 台阶的"坡度"。腰线正中坡度最大，反射偏折最强，形成一道亮线
float bodySech2( float x ) {
  float t = tanh( x );
  return 1.0 - t * t;
}

// 车身高度场 h(x, y) 的梯度 → 世界空间法线 (-∂h/∂x, -∂h/∂y, 1)
vec3 bodyNormal( vec2 p ) {
  p.y += uScrollY;
  vec2 grad = vec2( 0.0 );
  for ( int i = 0; i < ${MAX_WAVES}; i ++ ) {
    if ( i >= uWaveCount ) break;
    vec4 w = uWaves[ i ];
    // h += a·sin(k·p + ω·t)  ⇒  ∇h += a·k·cos(k·p + ω·t)
    grad += w.z * w.xy * cos( dot( w.xy, p ) + w.w * uTime );
  }
  // 腰线：沿 dir 方向每隔 period 一道平滑台阶（h += H·tanh(s·d)），模拟车身折线
  vec2 dir = normalize( uCrease.xy );
  float along = dot( dir, p );
  float d = ( fract( along / uCrease.z + 0.5 ) - 0.5 ) * uCrease.z; // 到最近一道腰线的距离
  grad += uCreaseHeight * uCrease.w * bodySech2( uCrease.w * d ) * dir;
  // 板件：沿 panelDir 每隔 period 一块凸面（h = -c·d²，坡度随离板件中心的距离线性增大），
  // 相邻板件在交界处坡度方向相反 → 一道折线。fillet 让坡度在交界附近平滑归零，相当于折线的圆角，
  // 避免硬边锯齿。凸面上不同高度的法线朝向不同 → 顶灯落在板件上半部，地面落在下半部，
  // 形成影棚车身"上亮下暗、中间一道锐利光带"的经典观感。
  if ( uPanel.w > 0.0 ) {
    vec2 panelDir = normalize( uPanel.xy );
    float t = ( fract( dot( panelDir, p ) / uPanel.z + 0.5 ) - 0.5 ) * 2.0; // 板件内位置：-1 ~ 1
    float fillet = smoothstep( 1.0, 1.0 - uPanelFillet, abs( t ) );
    grad -= uPanel.w * t * fillet * panelDir;
  }
  if ( uSplit > 0.5 && lvWeave > 0.0 ) {
    vec2 wp = vec2( vBodyPos.x, vBodyPos.y - uPageY );
    vec2 f = fract( wp / 0.05 ) - 0.5;
    float warp = carbonTwill( wp ).y;
    grad += lvWeave * 0.9 * mix( vec2( 0.0, f.y ), vec2( f.x, 0.0 ), warp );
  }
  return normalize( vec3( - grad, 1.0 ) );
}
`;

// 涂装分色的四处注入：底色 → 粗糙度 → 金属度 → 清漆。分别插在 three.js 对应代码块之后，
// 这样后面的光照计算（lights_physical_fragment）拿到的就是逐像素的漆面参数
const LIVERY_COLOR_FRAGMENT = /* glsl */ `
if ( uSplit > 0.5 ) {
  bodyLivery( vBodyPos );
  // 碳布：按纱束明暗调制底色。碳本身很黑，稍微提亮才看得出编织
  float twill = carbonTwill( vec2( vBodyPos.x, vBodyPos.y - uPageY ) ).x;
  diffuseColor.rgb = lvColor * ( 1.0 + lvWeave * 0.55 * ( twill - 0.6 ) ) + lvWeave * 0.012 * twill;
}
`;
const LIVERY_ROUGHNESS_FRAGMENT = /* glsl */ `
if ( uSplit > 0.5 ) roughnessFactor = lvMat.y;
`;
const LIVERY_METALNESS_FRAGMENT = /* glsl */ `
if ( uSplit > 0.5 ) metalnessFactor = lvMat.x;
`;
const LIVERY_CLEARCOAT_FRAGMENT = /* glsl */ `
#ifdef USE_CLEARCOAT
if ( uSplit > 0.5 ) {
  material.clearcoat = saturate( lvMat.z );
  material.clearcoatRoughness = min( max( lvMat.w, 0.0525 ) + geometryRoughness, 1.0 );
}
#endif
`;

// 插在 three.js 的 normal_fragment_begin 之后：用车身曲面法线替换平面自身的法线
const BODY_NORMAL_FRAGMENT = /* glsl */ `
normal = normalize( ( viewMatrix * vec4( bodyNormal( vBodyPos ), 0.0 ) ).xyz ); // 世界空间 → 视图空间
nonPerturbedNormal = normal;
`;

// 影棚空间：在 three.js 算完车漆光照之后、色调映射之前，按轮廓把画面分成幕墙 / 车身 / 地面
const STAGE_FRAGMENT = /* glsl */ `
if ( uStage > 0.5 ) {
  vec2 q = vBodyPos;
  float xn = q.x / uHalfW;
  vec3 body = gl_FragColor.rgb;

  // 上沿：dTop > 0 在轮廓之上（幕墙），< 0 在车身里
  float dTop = q.y - bodyTopEdge( q.x );
  float inBody = 1.0 - smoothstep( - uPx, uPx, dTop );
  // 边缘光：车身上沿一条 1~2 像素的亮线（受光的车顶边），幕墙一侧带很淡的光晕
  float rimCore = exp( - max( - dTop, 0.0 ) / ( 2.0 * uPx ) ) * inBody;
  float rimGlow = exp( - max( dTop, 0.0 ) / 0.12 ) * ( 1.0 - inBody );
  body += uRim * rimCore;

  // 幕墙：靠近车身处最亮（无缝背景的弯角），往上变暗，左右两侧再压暗一点
  float up = clamp( dTop / 2.6, 0.0, 1.0 );
  vec3 back = mix( uBackBottom, uBackTop, smoothstep( 0.0, 1.0, up ) );
  back *= 1.0 - 0.22 * xn * xn;
  back += uRim * 0.06 * rimGlow;

  // 下沿：页面滚到底时停在 uSilShape.y 高度，下面是地面
  float bottom = uSilShape.y - uPageLen + uPageY + 0.06 * xn;
  float dBot = bottom - q.y;                       // > 0 在地面上
  float onFloor = smoothstep( - uPx, uPx, dBot );
  // 地面：车身的模糊倒影随距离衰减，紧贴车底有一道接触阴影
  float contact = smoothstep( 0.0, 0.05, dBot );
  // dBot 必须先截到 >= 0 再取指数：页面很长时（手机上常见，超过约 6 屏），页顶的 dBot 是很大的负数，
  // exp( -dBot / 0.45 ) 会溢出成 inf，再乘上 contact = 0 得到 NaN，整块画面被算成黑色。
  vec3 floorCol = uFloor * ( 0.55 + 0.45 * contact ) + body * 0.45 * exp( - max( dBot, 0.0 ) / 0.45 ) * contact;

  vec3 col = mix( back, body, inBody );
  col = mix( col, floorCol, onFloor );
  gl_FragColor.rgb = col;
}
`;

// 摄影棚背景球：上亮下暗的暗色渐变，给银漆一点"天光"
const STUDIO_SKY_VERTEX = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize( position );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const STUDIO_SKY_FRAGMENT = /* glsl */ `
uniform vec3 uSky;
uniform vec3 uHorizon;
uniform vec3 uGround;
varying vec3 vDir;
void main() {
  float y = vDir.y;
  vec3 color = y > 0.0
    ? mix( uHorizon, uSky, smoothstep( 0.0, 0.8, y ) )
    : mix( uHorizon, uGround, smoothstep( 0.0, 0.5, - y ) );
  gl_FragColor = vec4( color, 1.0 );
}
`;

// 柔光箱：中心亮、四边在 edge 宽度内渐暗，长度方向可再加一点中心加权（falloff）。
// 真实柔光箱的扩散布就是这样发光的，清漆上因此能看到"有轮廓、内部有渐变"的光带，而不是一块死白
const SOFTBOX_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const SOFTBOX_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform vec2 uEdge;     // 渐变边宽度占宽、高的比例
uniform float uFalloff; // 长度方向的中心加权（0 = 均匀）
varying vec2 vUv;
void main() {
  float fx = smoothstep( 0.0, uEdge.x, vUv.x ) * smoothstep( 0.0, uEdge.x, 1.0 - vUv.x );
  float fy = smoothstep( 0.0, uEdge.y, vUv.y ) * smoothstep( 0.0, uEdge.y, 1.0 - vUv.y );
  float along = abs( vUv.x - 0.5 ) * 2.0;
  float core = 1.0 - uFalloff * along * along;
  gl_FragColor = vec4( uColor * fx * fy * core, 1.0 );
}
`;

const TONE_MAPPINGS = {
  neutral: THREE.NeutralToneMapping,
  aces: THREE.ACESFilmicToneMapping,
  agx: THREE.AgXToneMapping,
  none: THREE.NoToneMapping,
};

export class PaintSurface {
  /** 浏览器能否创建 WebGL2 上下文（用完立即释放，不占上下文名额） */
  static isSupported() {
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return false;
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 创建车漆层。不支持 WebGL 或初始化失败时返回 null，调用方负责 CSS 回退。
   * @param {HTMLCanvasElement} canvas 由样式表铺满视口（position: fixed; inset: 0）
   * @param {object} preset 车队预设，结构见 teams.js
   * @param {object} [options]
   * @param {boolean} [options.reducedMotion] 用户开启"减少动态效果"时传 true
   * @param {number} [options.maxDpr] 像素比上限，默认取 preset.render.maxDpr 或 1.5
   * @param {number} [options.renderScale] 在像素比之上再缩放渲染分辨率，默认 1
   * @param {() => void} [options.onContextLost] GPU 上下文丢失时回调（用于切换 CSS 回退）
   */
  static create(canvas, preset, options = {}) {
    if (!PaintSurface.isSupported()) return null;
    try {
      return new PaintSurface(canvas, preset, options);
    } catch (error) {
      console.warn('[paint-surface] 初始化失败，回退到 CSS 背景：', error);
      return null;
    }
  }

  constructor(canvas, preset, options = {}) {
    this.canvas = canvas;
    this.preset = preset;
    this.options = {
      maxDpr: preset.render?.maxDpr ?? 1.5,
      renderScale: 1,
      reducedMotion: false,
      onContextLost: null,
      ...options,
    };

    // 目标值（由 setScroll / setTone / setPointer 写入）与当前值（每帧向目标阻尼靠近）
    this._target = { scroll: 0, progress: 0, tone: 0, px: 0, py: 0 };
    this._state = { ...this._target };
    this._dirty = true; // 是否需要重绘（减少动态效果模式下只在变化时渲染）
    this._lastTime = 0;
    this._raf = 0;
    this._seams = [];        // 分色线位置（文档 px），由 setSeams 写入
    this._sweepStart = null; // 进场扫光的起始时间戳

    this._initRenderer();
    this._initStudio();
    this._initBody();

    this._onResize = this._onResize.bind(this);
    this._onContextLost = this._onContextLost.bind(this);
    this._loop = this._loop.bind(this);
    window.addEventListener('resize', this._onResize);
    canvas.addEventListener('webglcontextlost', this._onContextLost, false);

    this._onResize();
    this.start();
  }

  /* ---------------- 对外接口 ---------------- */

  /**
   * 同步页面滚动。
   * @param {number} scrollY 当前滚动位置（px）
   * @param {number} viewportHeight 视口高度（px）
   * @param {number} maxScroll 最大可滚动距离（px），用于计算页面进度
   */
  setScroll(scrollY, viewportHeight, maxScroll) {
    const vh = Math.max(1, viewportHeight);
    // 页面每滚动一屏，曲面滑移 parallax 屏（换算成世界单位）
    this._target.scroll = (scrollY / vh) * VISIBLE_HEIGHT * this.preset.surface.parallax;
    this._target.progress = maxScroll > 0 ? clampRange(scrollY / maxScroll, 0, 1) : 0;
    // 轮廓要和页面内容严丝合缝地一起移动：直接写 uniform，不经过惯性阻尼
    this.uniforms.uPageY.value = (scrollY / vh) * VISIBLE_HEIGHT;
    this.uniforms.uPageLen.value = (Math.max(0, maxScroll) / vh) * VISIBLE_HEIGHT;
    // 文档纵坐标 → 页面坐标（世界单位）：滚动为 0 时视口中线是 0，往下为负
    for (let i = 0; i < Math.min(this._seams.length, MAX_SEAMS); i++) {
      this.uniforms.uSeamY.value[i] = (0.5 - this._seams[i] / vh) * VISIBLE_HEIGHT;
    }
    this._dirty = true;
  }

  /**
   * 分色线的位置：每个过渡区中线在文档里的纵坐标（px）。
   * 为什么传文档坐标：分色线要钉在页面内容上，随内容一起滚动；视口高度变化时由 setScroll 重新换算。
   * @param {number[]} centers 按页面顺序
   */
  setSeams(centers) {
    this._seams = centers.slice();
    this._syncSplit();
    this._dirty = true;
  }

  /** 逐像素分色是否生效。页面据此决定文字配色是按区块固定，还是跟着整屏渐变走 */
  get splitActive() {
    return this.uniforms.uSplit.value > 0.5;
  }

  /** 重放进场扫光（页面打开、切换车队时各放一次） */
  playSweep() {
    this._sweepStart = null; // 下一帧开始计时
    this._dirty = true;
  }

  /** 涂装阶段：0 ~ livery.length - 1，小数表示两个阶段之间的过渡 */
  setTone(tone) {
    this._target.tone = clampRange(tone, 0, this._livery.length - 1);
    this._dirty = true;
  }

  /** 鼠标位置：x、y 都是 -1 ~ 1（屏幕中心为 0） */
  setPointer(x, y) {
    if (this.options.reducedMotion) return;
    this._target.px = clampRange(x, -1, 1);
    this._target.py = clampRange(y, -1, 1);
  }

  /**
   * 运行时动态切换车队预设（无需重新创建 WebGL 上下文与 Canvas）
   * @param {object} newPreset 新的车队预设对象（来自 teams.js）
   */
  setPreset(newPreset) {
    this.preset = newPreset;
    const render = newPreset.render ?? {};
    this.renderer.toneMapping = TONE_MAPPINGS[render.toneMapping ?? 'neutral'] ?? THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = render.exposure ?? 1;

    // 重新烘焙摄影棚环境贴图
    if (this.envTarget) {
      this.envTarget.dispose();
    }
    this._initStudio();

    // 更新涂装阶段数据
    this._livery = this.preset.livery.map((stop) => ({ ...stop, color: new THREE.Color(stop.color) }));

    // 更新着色器 uniform 参数
    this._syncSurfaceUniforms();

    this._applyLivery(this._state.tone);
    this.playSweep();
    this._dirty = true;
  }

  start() {
    if (!this._raf) this._raf = requestAnimationFrame(this._loop);
  }

  stop() {
    cancelAnimationFrame(this._raf);
    this._raf = 0;
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('webglcontextlost', this._onContextLost);
    this.mesh.geometry?.dispose();
    this.material?.dispose();
    this.envTarget?.dispose();
    this.renderer?.dispose();
    // 提示：切勿调用 this.renderer.forceContextLoss()，否则在 React StrictMode 两次挂载或组件热重载时，
    // DOM 中的同一 canvas 元素的 WebGL 上下文会被永久置为失效，导致二次初始化崩溃。
  }

  /* ---------------- 初始化 ---------------- */

  _initRenderer() {
    const render = this.preset.render ?? {};
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false, // 整屏只有一块平面，没有几何边缘需要抗锯齿
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x050607, 1);
    this.renderer.toneMapping = TONE_MAPPINGS[render.toneMapping ?? 'neutral'] ?? THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = render.exposure ?? 1;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 50);
    this.camera.position.set(0, 0, CAMERA_DISTANCE);
    this.camera.lookAt(0, 0, 0);
  }

  /** 搭一个"摄影棚"场景，预滤波成环境贴图：车漆上看到的所有反射都来自这里 */
  _initStudio() {
    const studio = this.preset.studio;
    const studioScene = new THREE.Scene();

    // 背景球（半径 40，远小于 PMREM 相机的远裁剪面 100）
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(40, 48, 24),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uSky: { value: new THREE.Color(studio.sky) },
          uHorizon: { value: new THREE.Color(studio.horizon) },
          uGround: { value: new THREE.Color(studio.ground) },
        },
        vertexShader: STUDIO_SKY_VERTEX,
        fragmentShader: STUDIO_SKY_FRAGMENT,
      }),
    );
    studioScene.add(sky);

    // 柔光箱：发光长条，摆在半径 12 的球面上并面朝车身（原点）。
    // 颜色乘以 intensity 得到 HDR 亮度，PMREM 用半浮点纹理保存，不会被截断到 1。
    // strip.edge（世界单位）> 0 时用渐变边柔光箱，否则是旧的均匀发光长条。
    const radius = 12;
    for (const strip of studio.strips) {
      const azimuth = THREE.MathUtils.degToRad(strip.azimuth);
      const elevation = THREE.MathUtils.degToRad(strip.elevation);
      const color = new THREE.Color(strip.color).multiplyScalar(strip.intensity);
      const material = strip.edge
        ? new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
              uColor: { value: color },
              uEdge: { value: new THREE.Vector2(Math.min(0.5, strip.edge / strip.w), Math.min(0.5, strip.edge / strip.h)) },
              uFalloff: { value: strip.falloff ?? 0 },
            },
            vertexShader: SOFTBOX_VERTEX,
            fragmentShader: SOFTBOX_FRAGMENT,
          })
        : new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(strip.w, strip.h), material);
      panel.position.set(
        radius * Math.cos(elevation) * Math.sin(azimuth),
        radius * Math.sin(elevation),
        radius * Math.cos(elevation) * Math.cos(azimuth),
      );
      panel.lookAt(0, 0, 0);
      studioScene.add(panel);
    }

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    // blur：预滤波模糊。旧预设 0.04；影棚效果图要看清柔光箱轮廓，用更小的值
    this.envTarget = pmrem.fromScene(studioScene, studio.blur ?? 0.04, 0.1, 100);
    pmrem.dispose();
    studioScene.traverse((object) => {
      object.geometry?.dispose();
      object.material?.dispose();
    });

    this.scene.environment = this.envTarget.texture;
  }

  /** 车身：一块铺满画面的平面 + 物理材质，曲面起伏在片元着色器里逐像素计算 */
  _initBody() {
    const surface = this.preset.surface;
    this._livery = this.preset.livery.map((stop) => ({ ...stop, color: new THREE.Color(stop.color) }));

    const first = this._livery[0];
    this.material = new THREE.MeshPhysicalMaterial({
      color: first.color.clone(),
      metalness: first.metalness,
      roughness: first.roughness,
      clearcoat: first.clearcoat,
      clearcoatRoughness: first.clearcoatRoughness,
      envMapIntensity: first.envIntensity,
    });

    // 这些 uniform 对象会直接挂进着色器，之后改 .value 即可生效，无需重新编译
    this.uniforms = {
      uWaves: { value: Array.from({ length: MAX_WAVES }, () => new THREE.Vector4()) },
      uWaveCount: { value: 0 },
      uCrease: { value: new THREE.Vector4() },
      uCreaseHeight: { value: 0 },
      uPanel: { value: new THREE.Vector4() },
      uPanelFillet: { value: 0 },
      uScrollY: { value: 0 },
      uTime: { value: 0 },
      uStage: { value: 0 },
      uPageY: { value: 0 },
      uPageLen: { value: 0 },
      uHalfW: { value: 1 },
      uPx: { value: 0.01 },
      uSil: { value: new THREE.Vector4() },
      uSilShape: { value: new THREE.Vector2(1, 0) },
      uBackTop: { value: new THREE.Color() },
      uBackBottom: { value: new THREE.Color() },
      uFloor: { value: new THREE.Color() },
      uRim: { value: new THREE.Color() },
      uSplit: { value: 0 },
      uStopCount: { value: 1 },
      uStopColor: { value: Array.from({ length: MAX_STOPS }, () => new THREE.Color()) },
      uStopMat: { value: Array.from({ length: MAX_STOPS }, () => new THREE.Vector4()) },
      uStopWeave: { value: new Array(MAX_STOPS).fill(0) },
      uSeamCount: { value: 0 },
      uSeamY: { value: new Array(MAX_SEAMS).fill(0) },
      uSeamShape: { value: new THREE.Vector3() },
      uStripeCount: { value: 0 },
      uStripe: { value: Array.from({ length: MAX_STRIPES }, () => new THREE.Vector4()) },
      uStripeColor: { value: Array.from({ length: MAX_STRIPES }, () => new THREE.Color()) },
    };
    this._syncSurfaceUniforms();

    this.material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${BODY_PARS_VERTEX}`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>\n${BODY_POS_VERTEX}`);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${BODY_PARS_FRAGMENT}`)
        .replace('#include <color_fragment>', `#include <color_fragment>\n${LIVERY_COLOR_FRAGMENT}`)
        .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\n${LIVERY_ROUGHNESS_FRAGMENT}`)
        .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>\n${LIVERY_METALNESS_FRAGMENT}`)
        .replace('#include <lights_physical_fragment>', `#include <lights_physical_fragment>\n${LIVERY_CLEARCOAT_FRAGMENT}`)
        .replace('#include <normal_fragment_begin>', `#include <normal_fragment_begin>\n${BODY_NORMAL_FRAGMENT}`)
        .replace('#include <opaque_fragment>', `#include <opaque_fragment>\n${STAGE_FRAGMENT}`);
    };

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.material);
    this.scene.add(this.mesh);
  }

  /** 把 preset.surface 写进着色器 uniform（初始化和 setPreset 共用）；panel 缺省时倾斜为 0，即不启用 */
  _syncSurfaceUniforms() {
    const surface = this.preset.surface;
    const u = this.uniforms;
    for (let i = 0; i < MAX_WAVES; i++) {
      const w = surface.waves[i];
      if (w) u.uWaves.value[i].set(w[0], w[1], w[2], w[3]);
      else u.uWaves.value[i].set(0, 0, 0, 0);
    }
    u.uWaveCount.value = Math.min(surface.waves.length, MAX_WAVES);
    const crease = surface.crease;
    u.uCrease.value.set(crease.dir[0], crease.dir[1], crease.period, crease.sharpness);
    u.uCreaseHeight.value = crease.height;
    const panel = surface.panel;
    if (panel) u.uPanel.value.set(panel.dir[0], panel.dir[1], panel.period, panel.tilt);
    else u.uPanel.value.set(0, 1, 1, 0);
    u.uPanelFillet.value = panel?.fillet ?? 0;

    // 影棚空间：预设同时给了轮廓和幕墙才启用
    const sil = surface.silhouette;
    const backdrop = this.preset.studio.backdrop;
    u.uStage.value = sil && backdrop ? 1 : 0;
    if (sil && backdrop) {
      u.uSil.value.set(sil.top, sil.slope ?? 0, sil.bump ?? 0, sil.bumpX ?? 0);
      u.uSilShape.value.set(sil.bumpW ?? 0.5, sil.bottom ?? -1.3);
      u.uBackTop.value.set(backdrop.top);
      u.uBackBottom.value.set(backdrop.bottom);
      u.uFloor.value.set(backdrop.floor);
      u.uRim.value.set(backdrop.rim ?? '#FFFFFF').multiplyScalar(backdrop.rimIntensity ?? 2);
    }

    // 涂装分色：各阶段的漆面参数 + 分色线形状 + 饰条。预设没写 surface.split 时保持旧的整屏渐变
    const split = surface.split;
    const stops = this._livery.slice(0, MAX_STOPS);
    u.uStopCount.value = stops.length;
    stops.forEach((stop, i) => {
      u.uStopColor.value[i].copy(stop.color);
      u.uStopMat.value[i].set(stop.metalness, stop.roughness, stop.clearcoat, stop.clearcoatRoughness);
      u.uStopWeave.value[i] = stop.weave ?? 0;
    });
    u.uSeamShape.value.set(split?.rake ?? 0, split?.bend ?? 0, split?.chevron ?? 0);
    const stripes = (split?.stripes ?? []).slice(0, MAX_STRIPES);
    u.uStripeCount.value = stripes.length;
    stripes.forEach((stripe, i) => {
      u.uStripe.value[i].set(stripe.offset, stripe.width, 0, 0);
      u.uStripeColor.value[i].set(stripe.color);
    });
    this._syncSplit();
  }

  /** 分色只在"预设给了 split、页面给了分色线位置、阶段不止一个"时启用，否则退回整屏渐变 */
  _syncSplit() {
    const u = this.uniforms;
    const seams = this._seams.slice(0, MAX_SEAMS);
    u.uSeamCount.value = seams.length;
    u.uSplit.value = this.preset.surface.split && seams.length > 0 && this._livery.length > 1 ? 1 : 0;
  }

  /* ---------------- 每帧 ---------------- */

  _loop(now) {
    this._raf = requestAnimationFrame(this._loop);
    if (document.hidden) return; // 标签页不可见时不渲染

    const dt = this._lastTime ? Math.min(0.1, (now - this._lastTime) / 1000) : 0;
    this._lastTime = now;
    const reduced = this.options.reducedMotion;
    if (reduced && !this._dirty) return; // 减少动态效果：画面没变就不重绘

    // 帧率无关的阻尼：约 0.1 秒追上目标，给滚动一点惯性
    const follow = reduced ? 1 : 1 - Math.exp(-dt * 10);
    const state = this._state;
    for (const key of Object.keys(this._target)) {
      state[key] += (this._target[key] - state[key]) * follow;
    }

    const surface = this.preset.surface;
    // 减少动态效果：不滑移、不漂移、灯光固定在页顶位置，只保留涂装颜色变化
    this.uniforms.uScrollY.value = reduced ? 0 : state.scroll;
    this.uniforms.uTime.value = reduced ? 0 : now / 1000;
    const sweep = reduced ? surface.sweep[0] : lerpNumber(surface.sweep[0], surface.sweep[1], state.progress);
    const [pointerX, pointerY] = surface.pointer ?? [0, 0];
    // 进场扫光：灯光从偏转位置缓缓回正，反射带整体扫过车身一次，像发布会揭幕时的追光。
    // 只转环境贴图，不加额外光源，所以扫光的形状和强度与静止时的布光完全一致
    let intro = 0;
    if (!reduced) {
      if (this._sweepStart == null) this._sweepStart = now;
      const k = clampRange((now - this._sweepStart) / (INTRO_SWEEP_SECONDS * 1000), 0, 1);
      intro = (surface.introSweep ?? 0.9) * Math.pow(1 - k, 3); // easeOutCubic：起步快、收尾慢
    }
    this.scene.environmentRotation.set(sweep + intro + state.py * pointerY, state.px * pointerX, 0);

    this._applyLivery(state.tone);
    this.renderer.render(this.scene, this.camera);
    this._dirty = false;

    // 第一帧画完后打上标记：样式表据此把 canvas 淡入，避免加载时闪一下
    if (!this.canvas.hasAttribute('data-ready')) this.canvas.setAttribute('data-ready', '');
  }

  /** 在相邻两个涂装阶段之间插值材质参数 */
  _applyLivery(tone) {
    const stops = this._livery;
    const index = Math.min(Math.floor(tone), stops.length - 2);
    const a = stops[Math.max(0, index)];
    const b = stops[Math.min(stops.length - 1, index + 1)];
    const f = stops.length > 1 ? tone - Math.max(0, index) : 0;
    const m = this.material;
    m.color.copy(a.color).lerp(b.color, f); // 在线性色彩空间插值，过渡不发灰
    m.metalness = lerpNumber(a.metalness, b.metalness, f);
    m.roughness = lerpNumber(a.roughness, b.roughness, f);
    m.clearcoat = Math.max(0.01, lerpNumber(a.clearcoat, b.clearcoat, f)); // 保持 > 0，避免切换着色器变体
    m.clearcoatRoughness = lerpNumber(a.clearcoatRoughness, b.clearcoatRoughness, f);
    m.envMapIntensity = lerpNumber(a.envIntensity, b.envIntensity, f);
  }

  _onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.options.maxDpr) * this.options.renderScale;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false); // false：canvas 的 CSS 尺寸交给样式表
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // 平面刚好铺满画面（多留 2% 余量）
    const visibleWidth = VISIBLE_HEIGHT * this.camera.aspect;
    this.mesh.scale.set(visibleWidth * 1.02, VISIBLE_HEIGHT * 1.02, 1);
    this.uniforms.uHalfW.value = visibleWidth / 2;
    this.uniforms.uPx.value = VISIBLE_HEIGHT / Math.max(1, height);
    this._dirty = true;
  }

  _onContextLost(event) {
    event.preventDefault();
    this.stop();
    this.options.onContextLost?.();
  }
}

/* ------------------------------------------------------------------
 * 工具函数
 * ------------------------------------------------------------------ */

function clampRange(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerpNumber(a, b, t) {
  return a + (b - a) * t;
}
