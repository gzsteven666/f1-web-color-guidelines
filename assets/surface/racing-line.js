/**
 * ==================================================================
 * racing-line.js —— 贯穿全页的涂装线（共享核心，原生 HTML 与 React 通用）
 * ==================================================================
 *
 * 一条 SVG 路径从页顶走到页底，随滚动逐段描出，把所有内容串成一块车身。
 * 它和车漆层一起取代旧模板里"区块之间硬切"的分隔方式。
 *
 * 路线怎么声明：给区块加 data-line 属性，写若干个"盒子内百分比坐标"：
 *   <section data-line="4,20 96,88">   → 经过该区块左上 (4%, 20%) 和右下 (96%, 88%)
 * 所有锚点按 DOM 顺序连接，再用 Catmull-Rom 样条平滑成三次贝塞尔曲线（曲线穿过每个锚点）。
 * 锚点的 y 应该逐个往下走：笔尖只会单调向下推进。
 *
 * 用法：
 *   const line = new RacingLine(svgElement, { color: '#00A19B' });
 *   line.layout();                       // 布局变化（resize、字体加载）后重新调用
 *   line.update(scrollY, innerHeight);   // 每次滚动调用
 *   line.playIntro();                    // 首屏描线进场
 *   line.showAll();                      // 减少动态效果：直接显示整条线
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

export class RacingLine {
  /**
   * @param {SVGSVGElement} svg 绝对定位在文档左上角的 SVG，尺寸由 layout() 设置
   * @param {object} [options]
   */
  constructor(svg, options = {}) {
    this.svg = svg;
    this.options = {
      selector: '[data-line]', // 声明路线锚点的元素
      lead: 0.66, // 笔尖停在视口高度的哪个位置（0 = 顶部，1 = 底部）
      samples: 800, // 预采样点数：越多，笔尖定位越准
      color: '#00A19B',
      tipColor: '#66D2CB',
      width: 2,
      ghostOpacity: 0.14, // 整条路线的淡影
      introDuration: 1400, // 进场描线时长（毫秒）
      ...options,
    };

    this.svg.setAttribute('aria-hidden', 'true');
    this.svg.setAttribute('focusable', 'false');
    // 三层：淡影（整条路线）→ 实线（已描出的部分）→ 笔尖
    this.ghost = this._createNode('path', {
      fill: 'none',
      stroke: this.options.color,
      'stroke-width': 1,
      'stroke-opacity': this.options.ghostOpacity,
    });
    this.live = this._createNode('path', {
      fill: 'none',
      stroke: this.options.color,
      'stroke-width': this.options.width,
      'stroke-linecap': 'round',
    });
    this.tip = this._createNode('circle', { r: 3.5, fill: this.options.tipColor, opacity: 0 });

    this.length = 0; // 路径总长（px）
    this._samples = null; // 预采样：{ lens, xs, ys, reach }
    this._scroll = { y: 0, vh: 1 }; // 最近一次 update 的参数（进场动画需要）
    this._intro = null; // 进场动画进度 0 ~ 1；null 表示不在进场中
    this._static = false; // showAll() 之后不再跟随滚动
  }

  /** 读取锚点、生成路径并预采样。布局变化（resize、字体加载、内容变化）后调用 */
  layout() {
    const doc = document.documentElement;
    // 先把 SVG 高度清零，避免它把文档撑高、量到错误的页面高度
    this.svg.style.height = '0px';
    const width = doc.clientWidth;
    const height = doc.scrollHeight;
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;

    const points = this._collectPoints();
    if (points.length < 2) {
      this.length = 0;
      this.ghost.removeAttribute('d');
      this.live.removeAttribute('d');
      this.tip.setAttribute('opacity', 0);
      return;
    }

    const d = catmullRomToBezier(points);
    this.ghost.setAttribute('d', d);
    this.live.setAttribute('d', d);
    this.length = this.live.getTotalLength();
    this.live.style.strokeDasharray = `${this.length} ${this.length}`;

    // 预采样：记录每个采样点的弧长和坐标。reach = 截至该点的"最大 y"，
    // 保证笔尖单调向下推进 —— 路径局部的小回弯不会让线条倒退
    const n = this.options.samples;
    const lens = new Float32Array(n + 1);
    const xs = new Float32Array(n + 1);
    const ys = new Float32Array(n + 1);
    const reach = new Float32Array(n + 1);
    let maxY = -Infinity;
    for (let i = 0; i <= n; i++) {
      const len = (this.length * i) / n;
      const pt = this.live.getPointAtLength(len);
      lens[i] = len;
      xs[i] = pt.x;
      ys[i] = pt.y;
      maxY = Math.max(maxY, pt.y);
      reach[i] = maxY;
    }
    this._samples = { lens, xs, ys, reach };
    this._render();
  }

  /** 同步滚动：笔尖跟着视口往下走 */
  update(scrollY, viewportHeight) {
    this._scroll.y = scrollY;
    this._scroll.vh = viewportHeight;
    if (!this._static) this._render();
  }

  /** 首屏描线进场：线条从起点描到当前滚动位置 */
  playIntro() {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / this.options.introDuration);
      this._intro = 1 - Math.pow(1 - p, 3); // easeOutCubic：快出缓停
      this._render();
      if (p < 1) requestAnimationFrame(tick);
      else this._intro = null;
    };
    this._intro = 0;
    requestAnimationFrame(tick);
  }

  /** 减少动态效果：直接显示整条线，不再随滚动描线 */
  showAll() {
    this._static = true;
    this._intro = null;
    this.live.style.strokeDashoffset = '0';
    this.tip.setAttribute('opacity', 0);
  }

  /**
   * 运行时动态更新路线样式选项（例如车队颜色与笔尖高光切换）
   * @param {object} newOptions 新的路线参数对象（来自 teams.js 的 line）
   */
  updateOptions(newOptions = {}) {
    Object.assign(this.options, newOptions);
    this.ghost.setAttribute('stroke', this.options.color);
    this.ghost.setAttribute('stroke-opacity', this.options.ghostOpacity);
    this.live.setAttribute('stroke', this.options.color);
    if (this.options.width) this.live.setAttribute('stroke-width', this.options.width);
    this.tip.setAttribute('fill', this.options.tipColor);
    this._render();
  }

  dispose() {
    this.ghost.remove();
    this.live.remove();
    this.tip.remove();
  }

  /* ---------------- 内部 ---------------- */

  _createNode(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    this.svg.appendChild(node);
    return node;
  }

  /** 把所有 data-line 锚点换算成文档坐标（px） */
  _collectPoints() {
    const points = [];
    const sx = window.scrollX;
    const sy = window.scrollY;
    document.querySelectorAll(this.options.selector).forEach((el) => {
      const rect = el.getBoundingClientRect();
      const spec = (el.getAttribute('data-line') || '').trim();
      if (!spec) return;
      for (const pair of spec.split(/\s+/)) {
        const [px, py] = pair.split(',').map(Number);
        if (!Number.isFinite(px) || !Number.isFinite(py)) continue;
        points.push([rect.left + sx + (rect.width * px) / 100, rect.top + sy + (rect.height * py) / 100]);
      }
    });
    return points;
  }

  /** 按当前滚动位置（和进场进度）画出已描部分，并移动笔尖 */
  _render() {
    if (!this._samples || this._static) return;
    const targetY = this._scroll.y + this._scroll.vh * this.options.lead;
    let drawn = this._lengthAtY(targetY);
    if (this._intro !== null) drawn *= this._intro;
    this.live.style.strokeDashoffset = `${this.length - drawn}`;

    const tipVisible = drawn > 1 && drawn < this.length - 1;
    this.tip.setAttribute('opacity', tipVisible ? 1 : 0);
    if (tipVisible) {
      const [x, y] = this._pointAtLength(drawn);
      this.tip.setAttribute('cx', x.toFixed(1));
      this.tip.setAttribute('cy', y.toFixed(1));
    }
  }

  /** 二分查找：笔尖到达 targetY 时已经描出的弧长 */
  _lengthAtY(targetY) {
    const { lens, reach } = this._samples;
    const last = reach.length - 1;
    if (targetY <= reach[0]) return 0;
    if (targetY >= reach[last]) return this.length;
    let lo = 0;
    let hi = last;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (reach[mid] < targetY) lo = mid;
      else hi = mid;
    }
    const span = reach[hi] - reach[lo];
    const f = span > 0 ? (targetY - reach[lo]) / span : 1;
    return lens[lo] + (lens[hi] - lens[lo]) * f;
  }

  /** 用预采样数据插值出某个弧长处的坐标（比每帧调 getPointAtLength 便宜） */
  _pointAtLength(len) {
    const { xs, ys } = this._samples;
    const n = xs.length - 1;
    const pos = (len / this.length) * n;
    const i = Math.min(n - 1, Math.floor(pos));
    const f = pos - i;
    return [xs[i] + (xs[i + 1] - xs[i]) * f, ys[i] + (ys[i + 1] - ys[i]) * f];
  }
}

/**
 * Catmull-Rom 样条 → SVG 三次贝塞尔路径。
 * 每段 P1→P2 的两个控制点由前后相邻点推出，曲线平滑且穿过所有锚点。
 */
function catmullRomToBezier(points) {
  const fmt = (v) => v.toFixed(1);
  let d = `M ${fmt(points[0][0])} ${fmt(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${fmt(c1x)} ${fmt(c1y)}, ${fmt(c2x)} ${fmt(c2y)}, ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return d;
}
