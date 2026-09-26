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
 *   surface.setPointer(x, y);                           // 鼠标位置，-1 ~ 1
 *   surface.dispose();                                  // 销毁后 canvas 不能再复用
 *
 * 降级策略：
 *   - 不支持 WebGL2 / 初始化失败 → create() 返回 null，由调用方切换 CSS 渐变
 *   - reducedMotion → 冻结起伏漂移、视差和鼠标响应，只在涂装变化时重绘
 *   - 像素比封顶（默认 1.5），标签页隐藏时不渲染
 */
import * as THREE from 'three';

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
varying vec2 vBodyPos;               // 片元在平面上的世界坐标

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
  return normalize( vec3( - grad, 1.0 ) );
}
`;

// 插在 three.js 的 normal_fragment_begin 之后：用车身曲面法线替换平面自身的法线
const BODY_NORMAL_FRAGMENT = /* glsl */ `
normal = normalize( ( viewMatrix * vec4( bodyNormal( vBodyPos ), 0.0 ) ).xyz ); // 世界空间 → 视图空间
nonPerturbedNormal = normal;
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
    const surface = this.preset.surface;
    for (let i = 0; i < MAX_WAVES; i++) {
      const w = surface.waves[i];
      if (w) this.uniforms.uWaves.value[i].set(w[0], w[1], w[2], w[3]);
      else this.uniforms.uWaves.value[i].set(0, 0, 0, 0);
    }
    this.uniforms.uWaveCount.value = Math.min(surface.waves.length, MAX_WAVES);
    const crease = surface.crease;
    this.uniforms.uCrease.value.set(crease.dir[0], crease.dir[1], crease.period, crease.sharpness);
    this.uniforms.uCreaseHeight.value = crease.height;

    this._applyLivery(this._state.tone);
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
    const radius = 12;
    for (const strip of studio.strips) {
      const azimuth = THREE.MathUtils.degToRad(strip.azimuth);
      const elevation = THREE.MathUtils.degToRad(strip.elevation);
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(strip.w, strip.h),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(strip.color).multiplyScalar(strip.intensity),
          side: THREE.DoubleSide,
        }),
      );
      panel.position.set(
        radius * Math.cos(elevation) * Math.sin(azimuth),
        radius * Math.sin(elevation),
        radius * Math.cos(elevation) * Math.cos(azimuth),
      );
      panel.lookAt(0, 0, 0);
      studioScene.add(panel);
    }

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTarget = pmrem.fromScene(studioScene, 0.04, 0.1, 100);
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
    const waves = Array.from({ length: MAX_WAVES }, (_, i) => {
      const w = surface.waves[i];
      return w ? new THREE.Vector4(w[0], w[1], w[2], w[3]) : new THREE.Vector4();
    });
    const crease = surface.crease;
    this.uniforms = {
      uWaves: { value: waves },
      uWaveCount: { value: Math.min(surface.waves.length, MAX_WAVES) },
      uCrease: { value: new THREE.Vector4(crease.dir[0], crease.dir[1], crease.period, crease.sharpness) },
      uCreaseHeight: { value: crease.height },
      uScrollY: { value: 0 },
      uTime: { value: 0 },
    };

    this.material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${BODY_PARS_VERTEX}`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>\n${BODY_POS_VERTEX}`);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${BODY_PARS_FRAGMENT}`)
        .replace('#include <normal_fragment_begin>', `#include <normal_fragment_begin>\n${BODY_NORMAL_FRAGMENT}`);
    };

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.material);
    this.scene.add(this.mesh);
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
    this.scene.environmentRotation.set(sweep + state.py * pointerY, state.px * pointerX, 0);

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
