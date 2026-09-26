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
      // 轮毂罩 Google Chrome 液态高光与微反射（Chrome Wheel Rim Specular #E2E8F0）
      { azimuth: -58, elevation: 16, w: 1.2, h: 14, color: '#E2E8F0', intensity: 10 },
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
    'radial-gradient(60% 40% at 88% 22%, rgba(226, 232, 240, 0.12) 0%, transparent 50%),' +
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
// 6. Atlassian Williams F1 Team (2026 FW48)
// ------------------------------------------------------------------
// 官方 2026 FW48 涂装语义：
//   - 纯正的 Vibrant Gloss Blue（高光泽鲜蓝车头与主识别）
//   - 车身侧壁向尾部收束的 Flowing Carbon Black（空气动力学流动碳黑）
//   - 侧箱切口、前翼端板的纯白结构面（Wing White）
//   - 蓝黑交界处极其克制的红白双轨冠军描边（Championship Heritage Keyline）
//   - 整体传递牛津郡 Grove 研发中心的尖端复合材料工程感与 9 届世界冠军的从容自信
export const WILLIAMS = {
  id: 'williams',
  name: 'Atlassian Williams F1 Team',
  chassis: 'FW48',

  // —— 涂装阶段：2026 FW48 从鲜蓝车头向车尾流动碳黑的平滑过渡 ——
  livery: [
    {
      // 阶段 0：FW48 高光泽鲜蓝主漆（Vibrant Gloss Blue #0858C9）
      color: '#0858C9',
      metalness: 0.12,          // 低金属度高饱和底漆，呈现纯正深邃的英国赛车蓝
      roughness: 0.18,          // 底漆平整细腻
      clearcoat: 1.0,           // 满级双层高透明度镜面清漆（Gloss Paint 传承）
      clearcoatRoughness: 0.03, // 极平整的清漆表面，在摄影棚柔光条下反射出锐利高光
      envIntensity: 1.25,       // 饱满的环境光感
    },
    {
      // 阶段 1：后部空气动力学流动碳黑（Flowing Carbon Black #0A1220）
      color: '#0A1220',
      metalness: 0.18,          // 微带金属反光的碳纤维编织基底
      roughness: 0.32,          // 较粗糙的下洗气流复合材料表面
      clearcoat: 0.95,
      clearcoatRoughness: 0.06, // 略微柔和的高光
      envIntensity: 1.05,
    },
  ],

  // —— 虚拟摄影棚：牛津郡 Grove 试车场清冷天穹与白色长条柔光箱 ——
  studio: {
    sky: '#1E2D4A',             // 清冷英伦夜蓝天穹
    horizon: '#0E1726',         // 地平线收束色
    ground: '#050B14',          // 深邃吸光地表（营造底盘悬浮感）
    strips: [
      // 顶部超宽纯白主柔光箱（模拟主展厅穹顶天幕反射，勾勒车脊轮廓）
      { azimuth: 0, elevation: 34, w: 22, h: 1.4, color: '#F4F7FA', intensity: 16 },
      // 侧向 58° 结构高光切线（刻画侧箱进气道导流折角）
      { azimuth: 58, elevation: 14, w: 1.5, h: 18, color: '#FFFFFF', intensity: 12 },
      // 低位蓝光漫射带（模拟地表受光反射，增强鲜蓝层次）
      { azimuth: -24, elevation: -18, w: 20, h: 0.4, color: '#4089E5', intensity: 7 },
    ],
  },

  // —— 车身空气动力学微起伏：Grove 风洞低风阻导流槽与 Forward W 动量线 ——
  surface: {
    waves: [
      [0, 0.94, 0.33, 0.05],
      [0.55, 0.38, 0.25, -0.04],
      [-0.8, 0.60, 0.12, 0.06],
    ],
    crease: {
      dir: [0.38, 0.93],        // 侧向导流折痕方向
      period: 8.2,
      sharpness: 4.8,           // 锐利的侧箱起伏
      height: 0.12,
    },
    parallax: 0.45,
    sweep: [-0.12, 0.55],
    pointer: [0.1, 0.05],
  },

  // —— 赛道贯穿线：结构羽白纯线，以冠军历史红（Heritage Red #D6293E）为笔尖端点 ——
  line: {
    color: '#F4F7FA',           // 主线条：结构羽白
    tipColor: '#D6293E',        // 笔尖高光：致敬 9 次世界冠军的传统红
    width: 2,
    ghostOpacity: 0.15,
  },

  render: {
    toneMapping: 'neutral',
    exposure: 1.05,
    maxDpr: 1.5,
  },

  // —— 不支持 WebGL 时的纯 CSS 双层方向性受光物理回退 ——
  fallback:
    'radial-gradient(110% 70% at 24% 10%, rgba(64,137,229,0.35) 0%, transparent 58%),' +
    'linear-gradient(142deg, #0858C9 0%, #06449D 38%, #0A1220 72%, #050B14 100%)',
};

// ------------------------------------------------------------------
// 7. Oracle Red Bull Racing (红牛车队 / 2026 RB22)
// ------------------------------------------------------------------
export const RED_BULL = {
  id: 'red-bull',
  name: 'Oracle Red Bull Racing',
  chassis: 'RB22 // FORD POWERTRAINS',

  // —— 涂装阶段：2026 RB22 标志性哑光暗夜蓝向外露碳黑底盘流动 ——
  livery: [
    {
      // 阶段 0：Matte Midnight Navy 哑光磨砂深蓝（#040D1A）
      color: '#040D1A',
      metalness: 0.10,          // 低金属度
      roughness: 0.42,          // 高粗糙度底漆：吸光不反光的经典红牛磨砂质感
      clearcoat: 0.20,          // 极低清漆层（Satin Matte finish）
      clearcoatRoughness: 0.50, // 漫射清漆，彻底消除刺眼高光亮斑
      envIntensity: 0.95,
    },
    {
      // 阶段 1：后部空气动力学裸碳黑（#020509）
      color: '#020509',
      metalness: 0.15,
      roughness: 0.38,
      clearcoat: 0.25,
      clearcoatRoughness: 0.45,
      envIntensity: 0.85,
    },
  ],

  // —— 虚拟摄影棚：米尔顿凯恩斯冠军工坊的暗夜冷调柔光 ——
  studio: {
    sky: '#0C182B',             // 暗夜冷海军蓝天幕
    horizon: '#060F1C',
    ground: '#020509',
    strips: [
      // 顶部主柔光箱（宽屏均匀柔和照射，呈现磨砂漆面弧度）
      { azimuth: 0, elevation: 34, w: 24, h: 1.6, color: '#F5F7FA', intensity: 13 },
      // 侧向公牛极速红光带（勾勒车侧肌肉线条）
      { azimuth: 60, elevation: 12, w: 1.2, h: 18, color: '#EA1D2D', intensity: 10 },
      // 低位能量荧光黄脉冲光晕（模拟 2026 电驱爆发指示）
      { azimuth: -18, elevation: -22, w: 20, h: 0.25, color: '#FFEB00', intensity: 9 },
    ],
  },

  // —— 侵略性风刀气动微起伏与向前俯冲刀锋切痕 ——
  surface: {
    waves: [
      [0.0, 0.90, 0.35, 0.05],
      [0.50, 0.32, 0.26, -0.04],
      [-0.75, 0.55, 0.10, 0.06],
    ],
    crease: { dir: [0.35, 0.95], period: 8.0, sharpness: 5.2, height: 0.13 },
    parallax: 0.44,
    sweep: [-0.14, 0.56],
    pointer: [0.11, 0.05],
  },

  // —— 贯穿赛道线：公牛极速红主线，配能量荧光黄（Electric Yellow）笔尖 ——
  line: {
    color: '#EA1D2D',           // 公牛极速红
    tipColor: '#FFEB00',        // 能量荧光黄笔尖
    width: 2.2,
    ghostOpacity: 0.18,
  },

  render: {
    toneMapping: 'neutral',
    exposure: 1.05,
    maxDpr: 1.5,
  },

  fallback:
    'radial-gradient(100% 60% at 20% 15%, rgba(24, 43, 69, 0.40) 0%, transparent 65%),' +
    'linear-gradient(155deg, #040D1A 0%, #061122 35%, #03070E 75%, #020509 100%)',
};

// ------------------------------------------------------------------
// 8. Audi F1 Team (奥迪厂队 / 2026 AU26)
// ------------------------------------------------------------------
export const AUDI = {
  id: 'audi',
  name: 'Audi F1 Team',
  chassis: 'AU26 // VORSPRUNG 2026',

  // —— 涂装阶段：包豪斯工业理性，航空冰钛银与玄武岩碳黑双拼 ——
  livery: [
    {
      // 阶段 0：Titanium Ice Silver 冰钛冷银金属车漆（#D2D7DF）
      color: '#D2D7DF',
      metalness: 0.96,          // 纯粹航天钛金属底漆
      roughness: 0.18,          // 极其平整细腻，反光锐利清澈
      clearcoat: 1.0,           // 满级镜面清漆
      clearcoatRoughness: 0.04,
      envIntensity: 1.30,
    },
    {
      // 阶段 1：Basalt Carbon Black 玄武岩碳黑底盘（#0B0E12）
      color: '#0B0E12',
      metalness: 0.25,
      roughness: 0.28,
      clearcoat: 0.95,
      clearcoatRoughness: 0.06,
      envIntensity: 1.10,
    },
  ],

  // —— 虚拟摄影棚：因戈尔施塔特精密实验室的高亮冷白矩阵 ——
  studio: {
    sky: '#2A323D',             // 冷钛天顶
    horizon: '#14181F',
    ground: '#050608',
    strips: [
      // 顶部超高亮条纹（模拟风洞主天幕，反射出冷冽钛合金光刃）
      { azimuth: 0, elevation: 36, w: 22, h: 1.2, color: '#FFFFFF', intensity: 18 },
      // 侧向 55° 精密工业切光
      { azimuth: 55, elevation: 12, w: 1.4, h: 16, color: '#E5E9F0', intensity: 12 },
      // 低位奥迪运动高能猩红脉冲光（High-Voltage 350kW MGU-K 指示）
      { azimuth: -20, elevation: -24, w: 22, h: 0.25, color: '#F50537', intensity: 12 },
    ],
  },

  // —— 德意志精密模块化折痕与微米级公差导流面 ——
  surface: {
    waves: [
      [0.0, 0.85, 0.32, 0.04],
      [0.46, 0.34, 0.25, -0.03],
      [-0.70, 0.52, 0.11, 0.05],
    ],
    crease: { dir: [0.32, 0.98], period: 8.8, sharpness: 4.6, height: 0.11 },
    parallax: 0.45,
    sweep: [-0.12, 0.52],
    pointer: [0.09, 0.04],
  },

  // —— 贯穿赛道线：奥迪运动高能猩红（High-Voltage Red），纯白电弧笔尖 ——
  line: {
    color: '#F50537',           // 奥迪运动高能猩红
    tipColor: '#FFFFFF',        // 纯白电弧笔尖
    width: 2.2,
    ghostOpacity: 0.18,
  },

  render: {
    toneMapping: 'neutral',
    exposure: 1.08,
    maxDpr: 1.5,
  },

  fallback:
    'radial-gradient(110% 65% at 25% 10%, rgba(210, 215, 223, 0.28) 0%, transparent 60%),' +
    'linear-gradient(160deg, #1A1F26 0%, #0E1216 38%, #050608 100%)',
};

// ------------------------------------------------------------------
// 9. BWT Alpine F1 Team (阿尔派车队 / 2026 A526)
// ------------------------------------------------------------------
export const ALPINE = {
  id: 'alpine',
  name: 'BWT Alpine F1 Team',
  chassis: 'A526 // ENSTONE AERO',

  // —— 涂装阶段：法式经典高光金属蓝与暗影裸碳的现代交织 ——
  livery: [
    {
      // 阶段 0：Alpine Metallic Blue 阿尔派高光金属蓝（#0078C1）
      color: '#0078C1',
      metalness: 0.85,          // 饱满金属漆
      roughness: 0.20,          // 细腻光润
      clearcoat: 1.0,           // 满级清漆，反射通透
      clearcoatRoughness: 0.05,
      envIntensity: 1.25,
    },
    {
      // 阶段 1：Shadow Carbon Black 侧箱暗影碳黑（#080C11）
      color: '#080C11',
      metalness: 0.20,
      roughness: 0.32,
      clearcoat: 0.90,
      clearcoatRoughness: 0.08,
      envIntensity: 1.05,
    },
  ],

  // —— 虚拟摄影棚：恩斯通风洞天幕，辅以 BWT 电气亮粉底光 ——
  studio: {
    sky: '#0C223A',             // 深邃阿尔派天顶
    horizon: '#061220',
    ground: '#04070A',
    strips: [
      // 顶部大柔光箱
      { azimuth: 0, elevation: 35, w: 22, h: 1.4, color: '#FFFFFF', intensity: 15 },
      // 侧向水蓝高光条
      { azimuth: 58, elevation: 10, w: 1.2, h: 18, color: '#2CE8FF', intensity: 10 },
      // 低位 BWT 电气亮粉光晕（标志性蓝粉碰撞）
      { azimuth: -12, elevation: -25, w: 22, h: 0.28, color: '#FD4BC7', intensity: 11 },
    ],
  },

  // —— 流线型气动起伏与侧箱下洗通道 ——
  surface: {
    waves: [
      [0.0, 0.88, 0.32, 0.04],
      [0.48, 0.32, 0.25, -0.04],
      [-0.72, 0.56, 0.11, 0.05],
    ],
    crease: { dir: [0.34, 0.96], period: 8.4, sharpness: 4.4, height: 0.12 },
    parallax: 0.46,
    sweep: [-0.12, 0.54],
    pointer: [0.10, 0.05],
  },

  // —— 贯穿赛道线：BWT 电气亮粉（Electric Pink），水蓝电弧笔尖 ——
  line: {
    color: '#FD4BC7',           // BWT 电气亮粉
    tipColor: '#2CE8FF',        // 水蓝电弧笔尖
    width: 2.2,
    ghostOpacity: 0.18,
  },

  render: {
    toneMapping: 'neutral',
    exposure: 1.06,
    maxDpr: 1.5,
  },

  fallback:
    'radial-gradient(110% 70% at 20% 12%, rgba(0, 120, 193, 0.35) 0%, transparent 62%),' +
    'linear-gradient(155deg, #004D7D 0%, #07192C 35%, #080C11 70%, #04070A 100%)',
};

// ------------------------------------------------------------------
// 10. Visa Cash App RB (极速公牛 / 2026 VCARB 03)
// ------------------------------------------------------------------
export const RACING_BULLS = {
  id: 'racing-bulls',
  name: 'Visa Cash App RB',
  chassis: 'VCARB 03 // FAENZA DYNAMICS',

  // —— 涂装阶段：高光泽电镀金属宝蓝与极速白条纹的鲜明对冲 ——
  livery: [
    {
      // 阶段 0：Electric Candy Royal Blue 电镀宝蓝（#1640D6）
      color: '#1640D6',
      metalness: 0.72,          // 金属漆与高透色漆层结合
      roughness: 0.15,          // 极度平整，带来全场最耀眼的高光
      clearcoat: 1.0,           // 满级 Candy 清漆
      clearcoatRoughness: 0.02, // 镜面无暇
      envIntensity: 1.35,
    },
    {
      // 阶段 1：Faenza Nero Chassis 暗夜底盘碳黑（#070B14）
      color: '#070B14',
      metalness: 0.20,
      roughness: 0.30,
      clearcoat: 0.95,
      clearcoatRoughness: 0.05,
      envIntensity: 1.10,
    },
  ],

  // —— 虚拟摄影棚：明快耀眼的纯白天幕与公牛火红点缀 ——
  studio: {
    sky: '#182C5E',             // 明亮夜空蓝天幕
    horizon: '#0C1632',
    ground: '#070B14',
    strips: [
      // 顶部超宽白光条（呈现电光宝蓝的流线镜面）
      { azimuth: 0, elevation: 34, w: 24, h: 1.5, color: '#FFFFFF', intensity: 17 },
      // 侧向电光蓝反光带
      { azimuth: 62, elevation: 12, w: 1.5, h: 18, color: '#4A7BFF', intensity: 13 },
      // 低位公牛活力红微光带
      { azimuth: -16, elevation: -20, w: 20, h: 0.25, color: '#E51937', intensity: 9 },
    ],
  },

  // —— 意式灵动敏捷的空气动力学导流微波 ——
  surface: {
    waves: [
      [0.0, 0.92, 0.34, 0.05],
      [0.52, 0.35, 0.26, -0.04],
      [-0.76, 0.58, 0.12, 0.06],
    ],
    crease: { dir: [0.36, 0.94], period: 8.2, sharpness: 4.8, height: 0.12 },
    parallax: 0.45,
    sweep: [-0.12, 0.55],
    pointer: [0.10, 0.05],
  },

  // —— 贯穿赛道线：极速纯白条带主线，公牛火红（Toros Red）笔尖 ——
  line: {
    color: '#FFFFFF',           // 纯白速度主线
    tipColor: '#E51937',        // 公牛火红点
    width: 2.5,
    ghostOpacity: 0.20,
  },

  render: {
    toneMapping: 'neutral',
    exposure: 1.10,
    maxDpr: 1.5,
  },

  fallback:
    'radial-gradient(110% 68% at 22% 10%, rgba(74, 123, 255, 0.42) 0%, transparent 60%),' +
    'linear-gradient(155deg, #1034B0 0%, #0A1C4D 38%, #070B14 100%)',
};

// ------------------------------------------------------------------
// 11. MoneyGram Haas F1 Team (哈斯车队 / 2026 VF-26)
// ------------------------------------------------------------------
export const HAAS = {
  id: 'haas',
  name: 'MoneyGram Haas F1 Team',
  chassis: 'VF-26 // AMERICAN CNC',

  // —— 涂装阶段：轻量化机加工冷白与外露吸光裸碳黑的三元秩序 ——
  livery: [
    {
      // 阶段 0：CNC Lightweight White 半哑冷白（#F8F9FA）
      color: '#F8F9FA',
      metalness: 0.15,
      roughness: 0.28,          // 半哑光涂层，追求极致减重
      clearcoat: 0.85,
      clearcoatRoughness: 0.10,
      envIntensity: 1.20,
    },
    {
      // 阶段 1：Raw Chassis Carbon 外露裸碳黑（#0F1012）
      color: '#0F1012',
      metalness: 0.25,
      roughness: 0.36,
      clearcoat: 0.80,
      clearcoatRoughness: 0.12,
      envIntensity: 0.95,
    },
  ],

  // —— 虚拟摄影棚：北卡罗来纳坎纳波利斯工业车间的硬朗光感 ——
  studio: {
    sky: '#26292E',             // 冷灰机匣天顶
    horizon: '#14161A',
    ground: '#060708',
    strips: [
      // 顶部大功率白光天幕
      { azimuth: 0, elevation: 35, w: 22, h: 1.3, color: '#FFFFFF', intensity: 15 },
      // 侧向机加工合金冷光
      { azimuth: 56, elevation: 12, w: 1.2, h: 16, color: '#A4ABB6', intensity: 8 },
      // 低位 MoneyGram 速度红流光带
      { azimuth: -14, elevation: -24, w: 20, h: 0.22, color: '#DA291C', intensity: 10 },
    ],
  },

  // —— 美式机加工紧密公差切角与直角导流槽 ——
  surface: {
    waves: [
      [0.0, 0.82, 0.30, 0.04],
      [0.44, 0.30, 0.24, -0.03],
      [-0.68, 0.50, 0.10, 0.04],
    ],
    crease: { dir: [0.30, 1.0], period: 8.6, sharpness: 5.0, height: 0.11 },
    parallax: 0.42,
    sweep: [-0.10, 0.50],
    pointer: [0.08, 0.04],
  },

  // —— 贯穿赛道线：MoneyGram 速度红主线，纯白高亮笔尖 ——
  line: {
    color: '#DA291C',           // MoneyGram 速度红
    tipColor: '#FFFFFF',        // 纯白高光点
    width: 2.5,
    ghostOpacity: 0.16,
  },

  render: {
    toneMapping: 'neutral',
    exposure: 1.05,
    maxDpr: 1.5,
  },

  fallback:
    'radial-gradient(110% 65% at 20% 12%, rgba(248, 249, 250, 0.22) 0%, transparent 60%),' +
    'linear-gradient(160deg, #24272D 0%, #121417 38%, #060708 100%)',
};

// ------------------------------------------------------------------
// 车队预设注册表（支持 2026 全赛季 11 支车队，kebab-case 与 snake_case 查找）
// ------------------------------------------------------------------
export const TEAM_PRESETS = {
  mercedes: MERCEDES,
  ferrari: FERRARI,
  mclaren: MCLAREN,
  'aston-martin': ASTON_MARTIN,
  aston_martin: ASTON_MARTIN,
  cadillac: CADILLAC,
  williams: WILLIAMS,
  'red-bull': RED_BULL,
  red_bull: RED_BULL,
  audi: AUDI,
  alpine: ALPINE,
  'racing-bulls': RACING_BULLS,
  racing_bulls: RACING_BULLS,
  haas: HAAS,
};
