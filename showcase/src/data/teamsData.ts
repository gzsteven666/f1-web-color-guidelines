import { MERCEDES, FERRARI, MCLAREN, ASTON_MARTIN, CADILLAC } from '@surface/teams.js';
import type { TeamPreset } from '@/types/surface';

/**
 * ==================================================================
 * teamsData.ts —— 5 大车队 Showcase 前端语义数据与设计令牌
 * ==================================================================
 * 严格遵照 references/ 规范，每个车队具备独立的品牌调性、遥测指标与设计令牌。
 */

export interface TeamToken {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  usage: string;
  pbrProps: string;
  bgStyle: string;
  borderClass: string;
  textClass: string;
}

export interface TeamTelemetry {
  pitStop: { value: number; label: string; note: string; status: string };
  power: { value: number; label: string; note: string; status: string };
  topSpeed: { value: number; label: string; note: string; status: string };
  titles: { value: number; label: string; note: string; status: string };
  ersStatus: { soc: string; harvest: string; thermal: string; progress: string };
}

export interface TeamViewData {
  id: string;
  name: string;
  shortCode: string;
  chassis: string;
  regulations: string;
  preset: TeamPreset;
  brandAccent: string;
  brandBright: string;
  brandTextGlow: string;
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  liveryStage0Desc: string;
  liveryStage1Desc: string;
  seamTitle: string;
  seamDescription: string;
  telemetry: TeamTelemetry;
  tokens: TeamToken[];
  engineeringNotes: {
    normalsTitle: string;
    normalsDesc: string;
    normalsMath: string;
    studioTitle: string;
    studioDesc: string;
    studioSpec: string;
    filterTitle: string;
    filterDesc: string;
  };
}

export const TEAMS_DATA: Record<string, TeamViewData> = {
  // 1. Mercedes-AMG PETRONAS
  mercedes: {
    id: 'mercedes',
    name: 'Mercedes-AMG PETRONAS',
    shortCode: 'W17',
    chassis: 'MERCEDES-AMG F1 W17 E-PERFORMANCE',
    regulations: 'FIA 2026 TECHNICAL REGULATIONS',
    preset: MERCEDES,
    brandAccent: '#00A19B',
    brandBright: '#27F4D2',
    brandTextGlow: 'rgba(0,161,155,0.4)',
    heroBadge: 'CHASSIS W17 // BRACKLEY HQ',
    heroTitle1: 'Continuous Surface',
    heroTitle2: 'Silver Arrows 2026',
    heroDescription:
      '不堆砌死板色块，让连续流动的真实金属车漆与摄影棚柔光带包裹页面。从首屏的冷银金属高光到后半段的高光泽碳黑清漆，PETRONAS 青绿线条贯穿全流程。',
    liveryStage0Desc: '冷银金属高光',
    liveryStage1Desc: '高光泽碳黑清漆',
    seamTitle: 'SURFACE SEAM: SILVER ➔ CARBON TRANSITION',
    seamDescription: '视口滚动经过此区域时，背景车身材质插值渐变，请观察背景车漆色相的流动转换',
    telemetry: {
      pitStop: { value: 1.8, label: 'Stationary Pit Stop Time', note: '4-Wheel Swap', status: 'OPTIMAL' },
      power: { value: 1050, label: 'Combined Power Output', note: '1.6L V6 Turbo + Dual MGU', status: 'MAX DEPLOY' },
      topSpeed: { value: 352, label: 'Monza Straight Velocity', note: 'DRS Activated', status: 'PEAK VELOCITY' },
      titles: { value: 8, label: 'Consecutive World Titles', note: '2014 — 2021 Era', status: 'DOMINANCE' },
      ersStatus: { soc: '98.4%', harvest: '4.0 MJ / LAP', thermal: '88°C NOMINAL', progress: '85%' },
    },
    tokens: [
      {
        name: 'PETRONAS Green',
        role: 'Primary Signature & Flow Line',
        hex: '#00A19B',
        rgb: '0, 161, 155',
        usage: '车身贯穿赛道线、交互主按钮、高光状态指示',
        pbrProps: 'HDR Softbox Strip (11.0 Intensity, Elevation -28°)',
        bgStyle: '#00A19B',
        borderClass: 'border-[#00A19B]/40 hover:border-[#00A19B]',
        textClass: 'text-[#00A19B]',
      },
      {
        name: 'Liquid Silver Arrows',
        role: 'Front Chassis Metallic Basecoat',
        hex: '#C8CCCE',
        rgb: '200, 204, 206',
        usage: '首屏主体、金属曲面、大面积柔润高光反射',
        pbrProps: 'Metalness: 1.0, Roughness: 0.26, Clearcoat: 1.0',
        bgStyle: '#C8CCCE',
        borderClass: 'border-white/20 hover:border-white/40',
        textClass: 'text-[#C8CCCE]',
      },
      {
        name: 'Chassis Carbon Black',
        role: 'Rear Engine Cover & Aero Weave',
        hex: '#090A0B',
        rgb: '9, 10, 11',
        usage: '后半段车身、高对比度暗区底色、钢琴黑清漆高光',
        pbrProps: 'Metalness: 0.15, Roughness: 0.32, ClearcoatRo: 0.04',
        bgStyle: '#090A0B',
        borderClass: 'border-white/10 hover:border-white/30',
        textClass: 'text-white/70',
      },
      {
        name: 'Electric Pulse Teal',
        role: 'Telemetry Glow & Active HUD',
        hex: '#27F4D2',
        rgb: '39, 244, 210',
        usage: '实时遥测峰值、赛道笔尖指示、高优先级报警',
        pbrProps: 'Tip Color for Racing Line SVG & Glow Pulse',
        bgStyle: '#27F4D2',
        borderClass: 'border-[#27F4D2]/40 hover:border-[#27F4D2]',
        textClass: 'text-[#27F4D2]',
      },
    ],
    engineeringNotes: {
      normalsTitle: '解析曲面法线微扰',
      normalsDesc:
        '单一平面 Mesh 上通过 GLSL 实时计算多组正弦重叠波浪与双曲正切腰线的解析梯度，重构世界空间法线。',
      normalsMath: '∇h = Σ Aᵢ kᵢ cos(kᵢ·x + ωᵢt)',
      studioTitle: '4 条 HDR 柔光条天穹',
      studioDesc:
        '金属漆的美感完全来自于反射环境。布置了 4 组长条形柔光箱（包括极具辨识度的 -28° PETRONAS 青绿底光）。',
      studioSpec: 'PMREMGenerator (sigma = 0.04)',
      filterTitle: '零高频闪烁与锯齿',
      filterDesc: '废除 NearestFilter 随机金属亮片贴图，杜绝高强高光在单像素尺度造成的强烈走样。',
    },
  },

  // 2. Scuderia Ferrari HP
  ferrari: {
    id: 'ferrari',
    name: 'Scuderia Ferrari HP',
    shortCode: 'SF-26',
    chassis: 'FERRARI SF-26 // PROJECT 678',
    regulations: 'MARANELLO MOTORSPORT TRADITION',
    preset: FERRARI,
    brandAccent: '#D3141C',
    brandBright: '#F04A4A',
    brandTextGlow: 'rgba(211,20,28,0.5)',
    heroBadge: 'SCUDERIA FERRARI // MARANELLO',
    heroTitle1: 'Gloss Paint Heritage',
    heroTitle2: 'Rosso Scuderia 2026',
    heroDescription:
      '意式赛车激情回归高光泽赛车烤漆。更亮、更强烈的 Rosso Scuderia 主识别色，配合白色结构切线与深酒红暗影，重塑极具攻击性的机械雕塑美学。',
    liveryStage0Desc: '亮红高光泽烤漆',
    liveryStage1Desc: '深酒红结构暗影',
    seamTitle: 'SURFACE SEAM: ROSSO SCUDERIA ➔ DEEP SHADOW',
    seamDescription: '视口滑动穿过座舱区，观察从高能见度主红向车尾深酒红与底盘碳黑的明暗递进',
    telemetry: {
      pitStop: { value: 1.82, label: 'Stationary Pit Stop Time', note: 'Giallo Wheel Nut Index', status: 'PRECISION' },
      power: { value: 1065, label: 'V6 Turbo 066/12 Hybrid', note: 'High Compression Ignition', status: 'MAX REV' },
      topSpeed: { value: 356, label: 'Monza Speed Trap', note: 'Low-Drag Aero Config', status: 'REDLINE' },
      titles: { value: 16, label: 'Constructors World Titles', note: 'Most Successful in F1 History', status: 'LEGACY' },
      ersStatus: { soc: '99.1%', harvest: '4.0 MJ / LAP', thermal: '92°C NOMINAL', progress: '90%' },
    },
    tokens: [
      {
        name: 'Rosso Scuderia Base',
        role: 'Primary Signature & High Gloss Basecoat',
        hex: '#D3141C',
        rgb: '211, 20, 28',
        usage: '主车身识别烤漆、高识别行动按钮、核心数据',
        pbrProps: 'Metalness: 0.08, Roughness: 0.18, Clearcoat: 1.0 (Gloss)',
        bgStyle: '#D3141C',
        borderClass: 'border-[#D3141C]/40 hover:border-[#D3141C]',
        textClass: 'text-[#D3141C]',
      },
      {
        name: 'Ferrari White',
        role: 'Structural Flow Line & Cockpit Contour',
        hex: '#F4F2EE',
        rgb: '244, 242, 238',
        usage: '贯穿全页的赛道线、结构切面、卡片外沿边界',
        pbrProps: 'Specular Softbox Strip (12.0 Intensity, Elevation 14°)',
        bgStyle: '#F4F2EE',
        borderClass: 'border-white/20 hover:border-white/40',
        textClass: 'text-[#F4F2EE]',
      },
      {
        name: 'Rosso Shadow',
        role: 'Chassis Underside & Aerodynamic Troughs',
        hex: '#6D0F13',
        rgb: '109, 15, 19',
        usage: '后段车身暗影、高对比卡片背景、深度过渡',
        pbrProps: 'Metalness: 0.15, Roughness: 0.28, Clearcoat: 0.95',
        bgStyle: '#6D0F13',
        borderClass: 'border-white/10 hover:border-white/30',
        textClass: 'text-[#D7CDCA]',
      },
      {
        name: 'Giallo Modena Accent',
        role: 'Heritage Tip & Warning Signals',
        hex: '#F7D117',
        rgb: '247, 209, 23',
        usage: '赛道笔尖指示、极限量血统点睛、峰值提示',
        pbrProps: 'Heritage Accent (< 2% Total Area, Tip Light: 4.0)',
        bgStyle: '#F7D117',
        borderClass: 'border-[#F7D117]/40 hover:border-[#F7D117]',
        textClass: 'text-[#F7D117]',
      },
    ],
    engineeringNotes: {
      normalsTitle: '高张力肌肉导流起伏',
      normalsDesc:
        '侧箱进气道采用更陡峭的双曲正切导流折线，模拟法拉利 2026 车体下压力通道与高张力外扩曲面。',
      normalsMath: 's = 5.2 (High Curvature Sharpness)',
      studioTitle: '马拉内罗摄影棚暖光布局',
      studioDesc:
        '深红暗调天穹烘托红色车漆纯度，侧方注入 2026 结构白切光条（Elevation 14°）并在低位辅以跃马黄微光。',
      studioSpec: '3x Tuned Strips (White/Red/Giallo)',
      filterTitle: 'Gloss Paint 极致镜面清漆',
      filterDesc: '清漆粗糙度降至 0.03，达到意大利传统工坊顶级高光泽清漆反光边缘。',
    },
  },

  // 3. McLaren Formula 1 Team
  mclaren: {
    id: 'mclaren',
    name: 'McLaren Formula 1 Team',
    shortCode: 'MCL39',
    chassis: 'MCLAREN MCL39 CHAMPIONSHIP CONTINUITY',
    regulations: 'WOKING LIGHTWEIGHT COMPOSITE DESIGN',
    preset: MCLAREN,
    brandAccent: '#FF8700',
    brandBright: '#FF9B2F',
    brandTextGlow: 'rgba(255,135,0,0.5)',
    heroBadge: 'MCLAREN RACING // WOKING MTC',
    heroTitle1: 'Papaya Performance',
    heroTitle2: 'Championship Speed',
    heroDescription:
      '以标志性 Papaya 橙为最高能见度主识别，搭配轻量化 Anthracite 烟煤深灰骨架。前后分明正反结构，辅以冰感 Teal 极速流线。',
    liveryStage0Desc: 'Iconic Papaya 亮橙',
    liveryStage1Desc: 'Anthracite 烟煤深灰',
    seamTitle: 'SURFACE SEAM: PAPAYA ➔ ANTHRACITE BACK',
    seamDescription: '体验 McLaren 前全橙、后全深灰碳纤的正反涂装结构，感受轻量化工程秩序',
    telemetry: {
      pitStop: { value: 1.8, label: 'Stationary Pit Stop Time', note: 'Championship Record', status: 'WORLD CLASS' },
      power: { value: 1055, label: 'Mercedes-AMG M15 Hybrid PU', note: 'High Velocity Aerodynamics', status: 'PEAK' },
      topSpeed: { value: 354, label: 'High-Downforce Straight Speed', note: 'Aero Efficiency 3.8', status: 'FAST LAP' },
      titles: { value: 9, label: 'Constructors Championships', note: 'Continuity & Renaissance', status: 'DEFENDING' },
      ersStatus: { soc: '98.8%', harvest: '4.0 MJ / LAP', thermal: '89°C OPTIMAL', progress: '88%' },
    },
    tokens: [
      {
        name: 'Iconic Papaya Base',
        role: 'Primary Signature & High-Visibility Front',
        hex: '#FF8700',
        rgb: '255, 135, 0',
        usage: '前段车身、主行动呼吁、品牌核心身份',
        pbrProps: 'Metalness: 0.05, Roughness: 0.20, Clearcoat: 1.0',
        bgStyle: '#FF8700',
        borderClass: 'border-[#FF8700]/40 hover:border-[#FF8700]',
        textClass: 'text-[#FF8700]',
      },
      {
        name: 'Teal Velocity Line',
        role: 'Speed Hint & Dynamic Track Indicator',
        hex: '#4FD5D6',
        rgb: '79, 213, 214',
        usage: '贯穿全页的极速描线、速度光晕、尖峰指示',
        pbrProps: 'Dynamic Racing Line & HDR Strip (9.0 Intensity)',
        bgStyle: '#4FD5D6',
        borderClass: 'border-[#4FD5D6]/40 hover:border-[#4FD5D6]',
        textClass: 'text-[#4FD5D6]',
      },
      {
        name: 'Striking Anthracite',
        role: 'Chassis Structure & Rear Engine Frame',
        hex: '#1E1F22',
        rgb: '30, 31, 34',
        usage: '后半段车身、结构骨架、高质感深灰卡片底色',
        pbrProps: 'Metalness: 0.35, Roughness: 0.38, Clearcoat: 0.70',
        bgStyle: '#1E1F22',
        borderClass: 'border-white/10 hover:border-white/30',
        textClass: 'text-[#C9CDD2]',
      },
      {
        name: 'Highlight Papaya',
        role: 'Active Hover & Energy Deploy Indicator',
        hex: '#FF9B2F',
        rgb: '255, 155, 47',
        usage: '受光层反射、按钮悬停、能量释放高亮',
        pbrProps: 'Secondary Studio Strip (Azimuth -12°, Elev -26°)',
        bgStyle: '#FF9B2F',
        borderClass: 'border-[#FF9B2F]/40 hover:border-[#FF9B2F]',
        textClass: 'text-[#FF9B2F]',
      },
    ],
    engineeringNotes: {
      normalsTitle: '轻量化低阻空气动力学',
      normalsDesc:
        '曲面起伏平顺宽广，通过平缓波长与腰线导流，展现 Woking 风洞精细校准的下压力平衡。',
      normalsMath: 'Period = 8.2 (Aerodynamic Sharpness)',
      studioTitle: '双色反差棚拍光影',
      studioDesc:
        '冷灰天穹下布置强白主光，并在右后方 65° 方位布置 Teal 冰青蓝竖向灯条，在深灰碳纤上拉出清冷反光。',
      studioSpec: 'Teal Rim Light (65° Azimuth, 9.0 Int)',
      filterTitle: '前后双段异质材质过渡',
      filterDesc: '从亮橙高饱和车漆平滑过渡至缎面深灰复合材料，粗糙度与清漆强度梯度精准匹配。',
    },
  },

  // 4. Aston Martin Aramco F1 Team
  'aston-martin': {
    id: 'aston-martin',
    name: 'Aston Martin Aramco F1 Team',
    shortCode: 'AMR26',
    chassis: 'ASTON MARTIN AMR26 WORKS-ERA',
    regulations: 'SILVERSTONE WORKS ENGINEERING',
    preset: ASTON_MARTIN,
    brandAccent: '#037A68',
    brandBright: '#A9D23E',
    brandTextGlow: 'rgba(3,122,104,0.5)',
    heroBadge: 'ASTON MARTIN ARAMCO // SILVERSTONE',
    heroTitle1: 'British Racing Luxury',
    heroTitle2: 'Racing Green Depth',
    heroDescription:
      '深邃、克制、致密而高层次的英伦深绿金属车漆。配合Works-era严谨工程秩序，受光处泛出通透高光绿，以极细 Lime 荧光黄绿穿针引线。',
    liveryStage0Desc: '深邃金属赛车绿',
    liveryStage1Desc: '暗部碳黑绿',
    seamTitle: 'SURFACE SEAM: RACING GREEN ➔ CARBON SHADOW',
    seamDescription: '视口滚动经过此区域，体验英国赛车绿金属粒子向深色碳纤维暗部的深层收束',
    telemetry: {
      pitStop: { value: 1.84, label: 'Stationary Pit Stop Time', note: 'Silverstone Precision Rig', status: 'CONSIDERED' },
      power: { value: 1060, label: 'Works Honda Hybrid Powertrain', note: 'Bespoke Factory Unit', status: 'BENCHMARK' },
      topSpeed: { value: 353, label: 'High Velocity Straight Run', note: 'Refined Aero Gloss', status: 'CRUISE' },
      titles: { value: 110, label: 'Years of Motorsport Heritage', note: '1913 — 2026 Aston Martin', status: 'CENTURY' },
      ersStatus: { soc: '98.6%', harvest: '4.0 MJ / LAP', thermal: '87°C OPTIMAL', progress: '86%' },
    },
    tokens: [
      {
        name: 'Racing Green Base',
        role: 'Primary Signature & Deep Metallic Basecoat',
        hex: '#002824',
        rgb: '0, 40, 36',
        usage: '主车身识别底色、金属漆深层质感、深邃暗面',
        pbrProps: 'Metalness: 0.90, Roughness: 0.24, Clearcoat: 1.0',
        bgStyle: '#002824',
        borderClass: 'border-[#037A68]/40 hover:border-[#037A68]',
        textClass: 'text-[#037A68]',
      },
      {
        name: 'Green Accent Highlight',
        role: 'Specular Surface & Lighting Reflection',
        hex: '#037A68',
        rgb: '3, 122, 104',
        usage: '车身受光高光、主卡片高亮、关键数据',
        pbrProps: 'Secondary Studio Strip (Azimuth 58°, 8.0 Intensity)',
        bgStyle: '#037A68',
        borderClass: 'border-[#037A68]/50 hover:border-[#037A68]',
        textClass: 'text-[#037A68]',
      },
      {
        name: 'Lime Accent Line',
        role: 'Signal Velocity Line & Indicator Tip',
        hex: '#A9D23E',
        rgb: '169, 210, 62',
        usage: '贯穿全页赛道流线、微量状态强调（< 3% 面积）',
        pbrProps: 'Racing Line Stroke & Tip Highlighter (#C6F54D)',
        bgStyle: '#A9D23E',
        borderClass: 'border-[#A9D23E]/40 hover:border-[#A9D23E]',
        textClass: 'text-[#A9D23E]',
      },
      {
        name: 'Carbon Matrix Black',
        role: 'Chassis Floor & Diffuser Shadow',
        hex: '#070B0A',
        rgb: '7, 11, 10',
        usage: '后半段压暗碳纤维底板、背景层次稳固',
        pbrProps: 'Metalness: 0.30, Roughness: 0.35, Clearcoat: 0.90',
        bgStyle: '#070B0A',
        borderClass: 'border-white/10 hover:border-white/30',
        textClass: 'text-white/60',
      },
    ],
    engineeringNotes: {
      normalsTitle: '沉稳修长的英伦导流起伏',
      normalsDesc: '起伏频率较低、振幅克制，拉出极长的纵向反光线，呈现英伦超跑与 GT 赛车特有的优雅姿态。',
      normalsMath: 'kx = 0.0, ky = 0.78 (Extended Longitudinal)',
      studioTitle: '双狭窄纵向柔光条',
      studioDesc:
        '采用 24 世界单位超长、仅 0.9 宽度的狭窄柔光灯条，在致密深绿金属底漆上打出一条如刀锋般锐利的背脊亮线。',
      studioSpec: '24m Razor Softbox Strip (16.0 Int)',
      filterTitle: '深邃高金属度底漆漫反射',
      filterDesc: 'Metalness 设为 0.90，使绿色不是平涂在外表，而是仿佛浸润在致密金属清漆内部。',
    },
  },

  // 5. Cadillac Formula 1 Team
  cadillac: {
    id: 'cadillac',
    name: 'Cadillac Formula 1 Team',
    shortCode: 'MAC-01',
    chassis: 'CADILLAC MAC-01 ANDRETTI FORMULA 1',
    regulations: 'AMERICAN INDUSTRIAL PERFORMANCE LUXURY',
    preset: CADILLAC,
    brandAccent: '#E4E7EA',
    brandBright: '#FFFFFF',
    brandTextGlow: 'rgba(228,231,234,0.4)',
    heroBadge: 'CADILLAC F1 // FISHERS & CHARLOTTE',
    heroTitle1: 'Sculpted Aggression',
    heroTitle2: 'Monochrome Luxury',
    heroDescription:
      '黑白双面美式工业雕塑。单色徽标、几何 Chevron 切面与冷峻黑白渐变。以 American Racing White 纯白为前半段，Bold Attitude 纯黑碳纤维为后段。',
    liveryStage0Desc: 'American Racing White 雕塑冷白',
    liveryStage1Desc: 'Bold Attitude 纯黑碳纤维',
    seamTitle: 'SURFACE SEAM: AMERICAN WHITE ➔ BOLD ATTITUDE BLACK',
    seamDescription: '视口滚动滑过黑白对冲过渡区，感受纯单色工业几何与 Chevron 切面的冷峻对撞',
    telemetry: {
      pitStop: { value: 1.83, label: 'Stationary Pit Stop Time', note: 'American Precision Crew', status: 'ENGINEERED' },
      power: { value: 1050, label: 'Cadillac Formula 1 Hybrid PU', note: 'Direct Injection Twin-MGU', status: 'CHARGED' },
      topSpeed: { value: 355, label: 'Fast Standing Still Top Velocity', note: 'Chevron Sculpted Aero', status: 'DYNAMIC' },
      titles: { value: 1, label: 'Inaugural Grid Campaign', note: '2026 Works Constructor', status: 'DEBUT' },
      ersStatus: { soc: '98.5%', harvest: '4.0 MJ / LAP', thermal: '88°C NOMINAL', progress: '85%' },
    },
    tokens: [
      {
        name: 'American Racing White',
        role: 'Primary Signature & Sculpted Basecoat',
        hex: '#F7F8F9',
        rgb: '247, 248, 249',
        usage: '首屏雕塑冷白、主文字、纯净高反差标识',
        pbrProps: 'Metalness: 0.08, Roughness: 0.18, Clearcoat: 1.0',
        bgStyle: '#F7F8F9',
        borderClass: 'border-white/30 hover:border-white/60',
        textClass: 'text-white',
      },
      {
        name: 'Technical Silver',
        role: 'Chevron Edge & Precision Flow Line',
        hex: '#E4E7EA',
        rgb: '228, 231, 234',
        usage: '贯穿全页银白赛道线、几何边缘切角、辅助边线',
        pbrProps: 'Racing Line Stroke (Width: 2, Ghost: 0.15)',
        bgStyle: '#E4E7EA',
        borderClass: 'border-[#E4E7EA]/40 hover:border-[#E4E7EA]',
        textClass: 'text-[#E4E7EA]',
      },
      {
        name: 'Bold Attitude Black',
        role: 'Rear Chassis & Dark Aerodynamic Frame',
        hex: '#060606',
        rgb: '6, 6, 6',
        usage: '后半段深色车身、钢琴黑清漆高光、极黑暗区',
        pbrProps: 'Metalness: 0.20, Roughness: 0.30, Clearcoat: 1.0',
        bgStyle: '#060606',
        borderClass: 'border-white/10 hover:border-white/30',
        textClass: 'text-white/70',
      },
      {
        name: 'Sculpted Titanium Gray',
        role: 'Mid-Tone Structural Facets',
        hex: '#3D4247',
        rgb: '61, 66, 71',
        usage: 'Chevron 几何过渡块、中性数据图表基线',
        pbrProps: 'Specular Geometric Strip (Azimuth 60°, 12.0 Int)',
        bgStyle: '#3D4247',
        borderClass: 'border-white/20 hover:border-white/40',
        textClass: 'text-[#A7ADB4]',
      },
    ],
    engineeringNotes: {
      normalsTitle: 'Chevron 几何切面法线',
      normalsDesc: '方向角设为 60° (dir: [0.5, 0.866])，模拟凯迪拉克标志性锋芒 Chevron 几何折线。',
      normalsMath: 'dir = [0.5, 0.866] (Chevron Angle)',
      studioTitle: '高反差无彩色工业棚光',
      studioDesc: '剔除所有彩色漫射，完全使用纯冷白与钛灰长条形柔光箱，刻画美式概念车雕塑光影。',
      studioSpec: 'High-Contrast Monochrome Rig (16.0 Int)',
      filterTitle: '纯白漆面与钢琴黑无缝渐变',
      filterDesc: '自白色向纯黑过渡时保持清漆层 1.0 满强度，重塑工业锋面反射质感。',
    },
  },
};

export const TEAMS_LIST = [
  TEAMS_DATA.mercedes,
  TEAMS_DATA.ferrari,
  TEAMS_DATA.mclaren,
  TEAMS_DATA['aston-martin'],
  TEAMS_DATA.cadillac,
];
