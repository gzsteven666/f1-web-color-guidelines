/**
 * ==================================================================
 * surface-page.js —— 把"连续车身"页面接起来（共享核心，原生 HTML 与 React 通用）
 * ==================================================================
 *
 * 一次调用完成整页的滚动编排：
 *   Lenis 平滑滚动 ─┬→ 车漆层：曲面滑移、光带扫过、涂装过渡
 *                   └→ 涂装线：随滚动描线
 *
 * 涂装过渡区（seams）：页面上标记为"过渡区"的元素。视口中线从它的上沿走到下沿时，
 * 车漆从第 i 个涂装阶段过渡到第 i+1 个（Mercedes 只有一个过渡区：前银 → 后黑）。
 * 过渡区里应该留白多、文字少 —— 两种涂装混合的中间态不适合承载大段正文。
 *
 * 用法：
 *   const page = mountSurfacePage({
 *     canvas, svg, preset: MERCEDES,
 *     seams: [document.querySelector('[data-seam]')],
 *     onFallback: () => document.documentElement.classList.add('no-webgl'),
 *   });
 *   page.destroy(); // React 卸载组件时调用
 */
import Lenis from 'lenis';
import { PaintSurface } from './paint-surface.js';
import { RacingLine } from './racing-line.js';

/**
 * @param {object} config
 * @param {HTMLCanvasElement | null} config.canvas 车漆层 canvas
 * @param {SVGSVGElement | null} config.svg 涂装线 SVG
 * @param {object} config.preset 车队预设（teams.js）
 * @param {Element[]} [config.seams] 涂装过渡区，按页面顺序
 * @param {boolean} [config.smooth] 是否启用 Lenis 平滑滚动，默认 true
 * @param {() => void} [config.onFallback] 车漆层不可用时回调（切换 CSS 回退背景）
 */
export function mountSurfacePage({ canvas, svg, preset, seams = [], smooth = true, onFallback = null }) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const surface = canvas
    ? PaintSurface.create(canvas, preset, { reducedMotion, onContextLost: onFallback })
    : null;
  if (canvas && !surface) onFallback?.();

  const line = svg ? new RacingLine(svg, preset.line) : null;

  let seamRects = []; // 过渡区在文档中的位置：{ top, height }

  /** 滚动时调用：把滚动位置分发给车漆层和涂装线 */
  function applyScroll(scrollY) {
    const vh = window.innerHeight;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
    // 每个过渡区贡献 0 ~ 1：视口中线从过渡区上沿走到下沿
    let tone = 0;
    const center = scrollY + vh * 0.5;
    for (const rect of seamRects) tone += smoothstepUnit((center - rect.top) / rect.height);
    if (surface) {
      surface.setScroll(scrollY, vh, maxScroll);
      surface.setTone(tone);
    }
    // 同步给 CSS：页面上想跟着涂装变化的元素可以读 var(--surface-tone)
    document.documentElement.style.setProperty('--surface-tone', tone.toFixed(3));
    line?.update(scrollY, vh);
  }

  /** 布局变化后重新测量过渡区和涂装线路线 */
  function measure() {
    seamRects = seams.filter(Boolean).map((el) => {
      const rect = el.getBoundingClientRect();
      return { top: rect.top + window.scrollY, height: Math.max(1, rect.height) };
    });
    line?.layout();
    applyScroll(window.scrollY);
  }

  // —— 平滑滚动：Lenis 接管滚轮，让整页滚动像一个连续的镜头 ——
  // 减少动态效果时不启用，保留浏览器原生滚动
  let lenis = null;
  const onNativeScroll = () => applyScroll(window.scrollY);
  if (smooth && !reducedMotion) {
    lenis = new Lenis({ autoRaf: true, anchors: true });
    lenis.on('scroll', (instance) => applyScroll(instance.scroll));
  } else {
    window.addEventListener('scroll', onNativeScroll, { passive: true });
  }

  // —— 鼠标：灯光随指针轻微偏转，反射带跟着手动 ——
  const onPointerMove = (event) => {
    surface?.setPointer((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
  };
  if (surface && !reducedMotion) window.addEventListener('pointermove', onPointerMove, { passive: true });

  // —— 布局变化：窗口尺寸、字体加载、内容高度变化都会移动锚点位置 ——
  let resizeTimer = 0;
  const scheduleMeasure = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 120);
  };
  window.addEventListener('resize', scheduleMeasure);
  const bodyObserver = new ResizeObserver(scheduleMeasure);
  bodyObserver.observe(document.body);
  document.fonts?.ready.then(measure);

  measure();
  if (line) {
    if (reducedMotion) line.showAll();
    else line.playIntro();
  }

  return {
    surface,
    line,
    lenis,
    measure,
    /**
     * 运行时动态切换车队预设
     * @param {object} newPreset 新的车队预设
     */
    setPreset(newPreset) {
      preset = newPreset;
      surface?.setPreset(newPreset);
      line?.updateOptions(newPreset.line);
      if (newPreset.fallback) {
        document.documentElement.style.setProperty('--surface-fallback', newPreset.fallback);
      }
      applyScroll(window.scrollY);
    },
    destroy() {
      clearTimeout(resizeTimer);
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', scheduleMeasure);
      bodyObserver.disconnect();
      lenis?.destroy();
      line?.dispose();
      surface?.dispose();
    },
  };
}

/** 0 ~ 1 之外截断，之内做 smoothstep 缓动：过渡两端平缓、中段快 */
function smoothstepUnit(x) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}
