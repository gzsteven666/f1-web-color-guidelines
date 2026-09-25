/**
 * ==================================================================
 * teams.js —— 车队预设（共享核心，原生 HTML 与 React 通用）
 * ==================================================================
 *
 * 一个预设 = 一支车队"车身"的全部参数：
 *   id       车队唯一标识符
 *   name     车队官方名称
 *   chassis  2026 规则底盘工程代号
 *   livery   涂装阶段。页面滚动时 tone 从 0 走到 livery.length - 1，
 *            车漆在相邻两个阶段之间插值（颜色、金属度、粗糙度……）
 *   studio   摄影棚：几条长条柔光箱，决定反射带长什么样、在哪里
 *   surface  车身曲面：几组低频起伏 + 腰线，决定反射带怎么弯、怎么流动
 *   line     贯穿全页的涂装线（颜色、笔尖高光色、线宽）
 *   render   渲染参数（色调映射、曝光、像素比上限）
 *   fallback 不支持 WebGL 时的纯 CSS 双层方向性受光回退渐变
 *
 * 颜色值严格与 references/<team>.md 保持一致；
 * 遵循 cross-team-methodology.md：区分金属车漆、清漆高光、碳纤维骨架与速度线角色。
 */

// ------------------------------------------------------------------
// 1. Mercedes-AMG PETRONAS (梅赛德斯-奔驰)
// ------------------------------------------------------------------
export const MERCEDES = {
  id: 'mercedes',
  name: 'Mercedes-AMG PETRONAS',
  chassis: 'W17 E-PERFORMANCE',

  // —— 涂装阶段：2026 W17 的"前银后黑"——
  livery: [
    {
      // 阶段 0：冷银金属漆（Silver #C8CCCE）
      color: '#C8CCCE',
      metalness: 1.0,          // 纯金属底漆：反射带着银色本身的冷色调
      roughness: 0.26,         // 底漆光滑细腻 → 大面积柔润的冷银流动高光
      clearcoat: 1.0,          // 清漆层满强度
      clearcoatRoughness: 0.08,// 清漆光滑 → 柔光箱留下清晰亮带
      envIntensity: 1.05,
    },
    {
      // 阶段 1：碳黑高光泽清漆（Chassis Carbon Black #090A0B）
      color: '#090A0B',
      metalness: 0.15,         // 近似非金属的黑漆：底色吸光，只剩清漆镜面反射
      roughness: 0.32,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,// 钢琴黑观感，反射锐利
      envIntensity: 1.15,
    },
  ],

  studio: {
    sky: '#6E787C',            // 冷灰棚顶：银漆的"银"主要来自这里
    horizon: '#262D30',
    ground: '#0A0C0E',
    strips: [
      { azimuth: 0, elevation: 32, w: 20, h: 1.4, color: '#FFFFFF', intensity: 14 },
      { azimuth: 0, elevation: 13, w: 24, h: 0.3, color: '#FFFFFF', intensity: 10 },
      { azimuth: 62, elevation: 6, w: 0.9, h: 16, color: '#DFE6EA', intensity: 5 },
      // 低位 PETRONAS 青绿灯条（官方语义：PETRONAS green flow line 低位扫过车身）
      { azimuth: -8, elevation: -28, w: 20, h: 0.22, color: '#00A19B', intensity: 11 },
    ],
  },

  surface: {
    waves: [
      [0.0, 0.92, 0.34, 0.05],
      [0.52, 0.34, 0.28, -0.04],
      [-0.78, 0.58, 0.11, 0.06],
      [1.6, 1.15, 0.025, -0.08],
    ],
    crease: { dir: [0.32, 1.0], period: 8.5, sharpness: 4.2, height: 0.11 },
    parallax: 0.45,
    sweep: [-0.12, 0.55],
    pointer: [0.1, 0.05],
  },

  line: {
    color: '#00A19B',          // PETRONAS 青绿
    tipColor: '#27F4D2',       // 脉冲青绿高亮笔尖
    width: 2,
    ghostOpacity: 0.14,
  },

  render: {
    toneMapping: 'neutral',
    exposure: 1.0,
    maxDpr: 1.5,
  },

  fallback:
    'radial-gradient(120% 70% at 28% 0%, rgba(200, 204, 206, 0.22) 0%, transparent 55%),' +
    'linear-gradient(180deg, #3E464B 0%, #101315 32%, #060708 60%, #050607 100%)',
};

// ------------------------------------------------------------------
// 2. Scuderia Ferrari HP (法拉利)
// ------------------------------------------------------------------
export const FERRARI = {
  id: 'ferrari',
  name: 'Scuderia Ferrari HP',
  chassis: 'SF-26 (Project 678)',

  // —— 涂装阶段：2026 官方语义更亮、更强烈的 Rosso Scuderia 与高光泽烤漆回归 ——
  // 前段高能见度主红，后段过渡到深酒红暗影与底盘碳黑；白色承担车身结构切线角色。
  livery: [
    {
      // 阶段 0：Rosso Scuderia Base 极高光泽烤漆（#D3141C）
      color: '#D3141C',
      metalness: 0.08,         // 非金属纯色烤漆：底色极其饱满热烈
      roughness: 0.18,         // 意式镜面清漆：反射极为透亮
      clearcoat: 1.0,          // 顶级 Gloss Paint 清漆层
      clearcoatRoughness: 0.03,// 极低粗糙度，反射边缘锋利
      envIntensity: 1.25,
    },
    {
      // 阶段 1：Rosso Deep / Shadow 深红暗部（#6D0F13）
      color: '#6D0F13',
      metalness: 0.15,
      roughness: 0.28,
      clearcoat: 0.95,
      clearcoatRoughness: 0.06,
      envIntensity: 1.10,
    },
  ],

  studio: {
    sky: '#380B0E',            // 深红暗调天穹，衬托红色烤漆的色纯度
    horizon: '#1A0708',
    ground: '#0A0304',
    strips: [
      { azimuth: 0, elevation: 34, w: 20, h: 1.3, color: '#FFFFFF', intensity: 15 },
      // 2026 结构白切光：模拟座舱与引擎盖侧翼的结构白切面
      { azimuth: 52, elevation: 14, w: 22, h: 0.35, color: '#F4F2EE', intensity: 12 },
      // 跃马黄点缀光（极少量血统微光）
      { azimuth: -45, elevation: -22, w: 18, h: 0.2, color: '#F7D117', intensity: 4 },
    ],
  },

  surface: {
    // 激进高张力的雕塑肌肉曲线，更紧凑起伏
    waves: [
      [0.0, 1.05, 0.38, 0.04],
      [0.58, 0.42, 0.24, -0.03],
      [-0.82, 0.62, 0.14, 0.05],
    ],
    crease: { dir: [0.28, 1.0], period: 7.8, sharpness: 5.2, height: 0.14 },
    parallax: 0.45,
    sweep: [-0.10, 0.60],
    pointer: [0.1, 0.05],
  },

  line: {
    color: '#F4F2EE',          // 2026 白色结构线（Ferrari White）
    tipColor: '#F7D117',       // 跃马黄色点睛笔尖
    width: 2,
    ghostOpacity: 0.16,
  },

  render: {
    toneMapping: 'neutral',
    exposure: 1.05,
    maxDpr: 1.5,
  },

  fallback:
    'radial-gradient(120% 70% at 28% 0%, rgba(211, 20, 28, 0.28) 0%, transparent 55%),' +
    'linear-gradient(180deg, #2D0C0E 0%, #150809 35%, #080304 100%)',
};

// ------------------------------------------------------------------
// 3. McLaren Formula 1 Team (迈凯伦)
// ------------------------------------------------------------------
export const MCLAREN = {
  id: 'mclaren',
  name: 'McLaren Formula 1 Team',
  chassis: 'MCL39',

  // —— 涂装阶段：All-papaya front / All-anthracite back ——
  // 前段高能见度木瓜橙，后段烟煤深灰碳纤维骨架，并结合一丝冰感 Teal 速度反光。
  livery: [
    {
      // 阶段 0：Iconic Papaya 标志性高能见度橙（#FF8700）
      color: '#FF8700',
      metalness: 0.05,         // 纯正赛车亮橙，低金属度确保饱和度
      roughness: 0.20,         // 高平滑度
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envIntensity: 1.20,
    },
    {
      // 阶段 1：Striking Anthracite 烟煤深灰（#1E1F22）
      color: '#1E1F22',
      metalness: 0.35,         // 碳纤维增强复合材料的光泽感
      roughness: 0.38,
      clearcoat: 0.70,
      clearcoatRoughness: 0.12,
      envIntensity: 0.95,
    },
  ],

  studio: {
    sky: '#463E38',            // 带有轻微暖钛调的灰调天穹
    horizon: '#201D1A',
    ground: '#0C0C0E',
    strips: [
      { azimuth: 0, elevation: 30, w: 22, h: 1.5, color: '#FFFFFF', intensity: 14 },
      // 迈凯伦特有的一丝冰青蓝速度光晕（Teal Accent #4FD5D6）
      { azimuth: 65, elevation: 10, w: 1.4, h: 18, color: '#4FD5D6', intensity: 9 },
      // 下方暖橙受光补强
      { azimuth: -12, elevation: -26, w: 20, h: 0.25, color: '#FF9B2F', intensity: 8 },
    ],
  },

  surface: {
    // 现代空气动力学锋面起伏
    waves: [
      [0.0, 0.88, 0.32, 0.05],
      [0.48, 0.36, 0.26, -0.04],
      [-0.72, 0.54, 0.12, 0.06],
    ],
    crease: { dir: [0.35, 1.0], period: 8.2, sharpness: 4.6, height: 0.12 },
    parallax: 0.45,
    sweep: [-0.12, 0.52],
    pointer: [0.1, 0.05],
  },

  line: {
    color: '#4FD5D6',          // Teal 冰青蓝速度线
    tipColor: '#7EF0F1',       // 亮青高光笔尖
    width: 2,
    ghostOpacity: 0.18,
  },

  render: {
    toneMapping: 'neutral',
    exposure: 1.02,
    maxDpr: 1.5,
  },

  fallback:
    'radial-gradient(120% 70% at 28% 0%, rgba(255, 135, 0, 0.24) 0%, transparent 55%),' +
    'linear-gradient(180deg, #2B180C 0%, #161210 35%, #0B0B0C 100%)',
};

// ------------------------------------------------------------------
// 4. Aston Martin Aramco F1 Team (阿斯顿·马丁)
// ------------------------------------------------------------------
export const ASTON_MARTIN = {
  id: 'aston-martin',
  name: 'Aston Martin Aramco F1 Team',
  chassis: 'AMR26',

  // —— 涂装阶段：英伦深绿金属车漆与 Works-era 工程秩序 ——
  // 表面致密深邃，高金属度，受光处呈现通透的车漆高光绿，暗部厚重，点缀 Lime 荧光黄绿。
  livery: [
    {
      // 阶段 0：Aston Martin Racing Green 奢华深邃金属车漆（#002824）
      color: '#002824',
      metalness: 0.90,         // 高度金属漆：反射带有通透深绿
      roughness: 0.24,         // 奢华细腻，倒影修长
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envIntensity: 1.15,
    },
    {
      // 阶段 1：暗部碳黑绿（#070B0A）
      color: '#070B0A',
      metalness: 0.30,
      roughness: 0.35,
      clearcoat: 0.90,
      clearcoatRoughness: 0.08,
      envIntensity: 1.05,
    },
  ],

  studio: {
    sky: '#182C26',            // 墨绿冷调天穹
    horizon: '#0C1815',
    ground: '#050908',
    strips: [
      // 顶部修长高亮白条：拉出英伦 GT 与 F1 赛车极其优雅平滑的背脊光
      { azimuth: 0, elevation: 35, w: 24, h: 0.9, color: '#FFFFFF', intensity: 16 },
      // 侧向车漆反射高光绿
      { azimuth: 58, elevation: 8, w: 1.0, h: 18, color: '#037A68', intensity: 8 },
      // 低位 Lime 荧光黄绿速度光带（2026 Works 细节）
      { azimuth: -10, elevation: -26, w: 22, h: 0.20, color: '#A9D23E', intensity: 9 },
    ],
  },

  surface: {
    // 沉稳克制、流线型更修长的起伏
    waves: [
      [0.0, 0.78, 0.30, 0.03],
      [0.44, 0.30, 0.24, -0.03],
      [-0.64, 0.50, 0.10, 0.04],
    ],
    crease: { dir: [0.30, 1.0], period: 9.0, sharpness: 4.0, height: 0.10 },
    parallax: 0.42,
    sweep: [-0.10, 0.50],
    pointer: [0.08, 0.04],
  },

  line: {
    color: '#A9D23E',          // Lime 荧光黄绿
    tipColor: '#C6F54D',       // 亮荧光黄绿笔尖
    width: 2,
    ghostOpacity: 0.16,
  },

  render: {
    toneMapping: 'neutral',
    exposure: 1.06,
    maxDpr: 1.5,
  },

  fallback:
    'radial-gradient(120% 70% at 28% 0%, rgba(3, 122, 104, 0.25) 0%, transparent 55%),' +
    'linear-gradient(180deg, #02201C 0%, #06110F 35%, #030605 100%)',
};

// ------------------------------------------------------------------
// 5. Cadillac Formula 1 Team (凯迪拉克)
// ------------------------------------------------------------------
export const CADILLAC = {
  id: 'cadillac',
  name: 'Cadillac Formula 1 Team',
  chassis: 'MAC-01',

  // —— 涂装阶段：Black-and-White dual-color livery 黑白双面 ——
  // 阶段 0：American Racing White 冷峻纯白高光雕塑；阶段 1：Bold Attitude 纯粹黑碳面。
  livery: [
    {
      // 阶段 0：American Racing White 雕塑冷白（#F7F8F9）
      color: '#F7F8F9',
      metalness: 0.08,
      roughness: 0.18,         // 极光滑的冷白雕塑车漆
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envIntensity: 1.25,
    },
    {
      // 阶段 1：Bold Attitude 纯黑碳纤维表面（#060606）
      color: '#060606',
      metalness: 0.20,
      roughness: 0.30,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03, // 钢琴镜面黑
      envIntensity: 1.15,
    },
  ],

  studio: {
    sky: '#64686C',            // 纯粹单色灰白高对比天穹，无多余彩色杂光
    horizon: '#242628',
    ground: '#080809',
    strips: [
      { azimuth: 0, elevation: 32, w: 22, h: 1.6, color: '#FFFFFF', intensity: 16 },
      // 锐利工业几何切面银光（模拟 Cadillac Chevron 雕塑折面）
      { azimuth: 60, elevation: 12, w: 1.0, h: 20, color: '#D9DDE1', intensity: 12 },
      { azimuth: -8, elevation: -26, w: 22, h: 0.25, color: '#E4E7EA', intensity: 10 },
    ],
  },

  surface: {
    // 工业几何 Chevron 切面导向起伏
    waves: [
      [0.0, 0.95, 0.36, 0.04],
      [0.60, 0.40, 0.30, -0.04],
      [-0.80, 0.60, 0.12, 0.05],
    ],
    // 锐利的 Chevron 几何棱线
    crease: { dir: [0.50, 0.866], period: 7.2, sharpness: 5.8, height: 0.15 },
    parallax: 0.45,
    sweep: [-0.12, 0.55],
    pointer: [0.1, 0.05],
  },

  line: {
    color: '#E4E7EA',          // Technical Silver 工业银白线
    tipColor: '#FFFFFF',       // 纯白高亮笔尖
    width: 2,
    ghostOpacity: 0.15,
  },

  render: {
    toneMapping: 'neutral',
    exposure: 1.0,
    maxDpr: 1.5,
  },

  fallback:
    'radial-gradient(120% 70% at 28% 0%, rgba(247, 248, 249, 0.20) 0%, transparent 55%),' +
    'linear-gradient(180deg, #323538 0%, #121315 35%, #050506 100%)',
};

// ------------------------------------------------------------------
// 车队预设注册表（支持 kebab-case 与 snake_case 查找）
// ------------------------------------------------------------------
export const TEAM_PRESETS = {
  mercedes: MERCEDES,
  ferrari: FERRARI,
  mclaren: MCLAREN,
  'aston-martin': ASTON_MARTIN,
  aston_martin: ASTON_MARTIN,
  cadillac: CADILLAC,
};
