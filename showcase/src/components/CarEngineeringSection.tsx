import React, { useState } from 'react';
import { Cpu, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import DecryptedText from './ui/DecryptedText';
import { useTeam } from '@/context/TeamContext';

/**
 * ==================================================================
 * CarEngineeringSection.tsx —— PBR 车漆与无走样反射渲染引擎剖析
 * ==================================================================
 * 展示当前车队专属的物理材质参数、解析曲面数学模型与天穹柔光排布。
 */

export const CarEngineeringSection: React.FC = () => {
  const { currentTeam } = useTeam();
  const [activeTab, setActiveTab] = useState<'pbr' | 'studio' | 'normals'>('pbr');
  const eng = currentTeam.engineeringNotes;
  const pbr0 = currentTeam.preset.livery[0];
  const pbr1 = currentTeam.preset.livery[1];

  return (
    <section
      id="engineering"
      data-line="75,20 30,80"
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Cpu
            className="w-4 h-4 transition-colors duration-500"
            style={{ color: currentTeam.brandAccent }}
          />
          <span
            className="font-mono text-xs tracking-widest uppercase transition-colors duration-500"
            style={{ color: currentTeam.brandAccent }}
          >
            <DecryptedText
              key={`eng-title-${currentTeam.id}`}
              text={`${currentTeam.shortCode} GRAPHICS ARCHITECTURE // WEBGL CORE`}
              speed={40}
            />
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
          连续车身渲染引擎原理
        </h2>
        <p className="text-white/60 text-sm sm:text-base max-w-2xl mt-2 font-light">
          三维汽车漆面由底漆层（Basecoat）与双层清漆（Clearcoat）构成。通过在 Three.js 编译期注入 GLSL，计算解析曲面法线，并以 PMREM 预过滤环境贴图提供无走样的柔光高光。
        </p>
      </div>

      {/* 3 个技术支柱卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* 卡片 1: 解析法线 */}
        <div className="p-6 rounded-lg bg-[#121518]/70 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all">
          <div
            className="w-10 h-10 rounded border flex items-center justify-center mb-4 transition-colors duration-500"
            style={{
              backgroundColor: `${currentTeam.brandAccent}15`,
              borderColor: `${currentTeam.brandAccent}40`,
              color: currentTeam.brandBright,
            }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{eng.normalsTitle}</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            {eng.normalsDesc}
          </p>
          <div
            className="mt-4 font-mono text-[11px] transition-colors duration-500"
            style={{ color: currentTeam.brandAccent }}
          >
            {eng.normalsMath}
          </div>
        </div>

        {/* 卡片 2: 柔光箱天穹 */}
        <div className="p-6 rounded-lg bg-[#121518]/70 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all">
          <div
            className="w-10 h-10 rounded border flex items-center justify-center mb-4 transition-colors duration-500"
            style={{
              backgroundColor: `${currentTeam.brandAccent}15`,
              borderColor: `${currentTeam.brandAccent}40`,
              color: currentTeam.brandBright,
            }}
          >
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{eng.studioTitle}</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            {eng.studioDesc}
          </p>
          <div
            className="mt-4 font-mono text-[11px] transition-colors duration-500"
            style={{ color: currentTeam.brandBright }}
          >
            {eng.studioSpec}
          </div>
        </div>

        {/* 卡片 3: 零走样高光 */}
        <div className="p-6 rounded-lg bg-[#121518]/70 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all">
          <div
            className="w-10 h-10 rounded border flex items-center justify-center mb-4 transition-colors duration-500"
            style={{
              backgroundColor: `${currentTeam.brandAccent}15`,
              borderColor: `${currentTeam.brandAccent}40`,
              color: currentTeam.brandBright,
            }}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{eng.filterTitle}</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            {eng.filterDesc}
          </p>
          <div className="mt-4 font-mono text-[11px] text-[#C8CCCE]">
            Clean Normal Filtering
          </div>
        </div>
      </div>

      {/* 实时着色器与材质配置卡片 */}
      <div className="rounded-lg bg-[#0d0f11] border border-white/10 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            <span className="ml-3 font-mono text-xs text-white/60">
              assets/surface/teams.js ➔ {currentTeam.id.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab('pbr')}
              className="px-3 py-1 rounded transition-all font-medium"
              style={
                activeTab === 'pbr'
                  ? {
                      backgroundColor: currentTeam.brandAccent,
                      color: currentTeam.id === 'cadillac' ? '#000000' : '#000000',
                      fontWeight: 600,
                    }
                  : { color: 'rgba(255,255,255,0.6)' }
              }
            >
              MeshPhysicalMaterial
            </button>
            <button
              onClick={() => setActiveTab('normals')}
              className="px-3 py-1 rounded transition-all font-medium"
              style={
                activeTab === 'normals'
                  ? {
                      backgroundColor: currentTeam.brandAccent,
                      color: currentTeam.id === 'cadillac' ? '#000000' : '#000000',
                      fontWeight: 600,
                    }
                  : { color: 'rgba(255,255,255,0.6)' }
              }
            >
              GLSL Normal
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className="px-3 py-1 rounded transition-all font-medium"
              style={
                activeTab === 'studio'
                  ? {
                      backgroundColor: currentTeam.brandAccent,
                      color: currentTeam.id === 'cadillac' ? '#000000' : '#000000',
                      fontWeight: 600,
                    }
                  : { color: 'rgba(255,255,255,0.6)' }
              }
            >
              PMREM Studio
            </button>
          </div>
        </div>

        <div className="p-6 font-mono text-xs sm:text-sm text-white/80 overflow-x-auto leading-relaxed bg-[#090A0B]/90">
          {activeTab === 'pbr' && (
            <pre>
              <code>{`// ${currentTeam.name} 物理车漆配置 (MeshPhysicalMaterial)
const liveryStage0 = {
  color: '${pbr0?.color ?? '#C8CCCE'}',       // 首段涂装：${currentTeam.liveryStage0Desc}
  metalness: ${pbr0?.metalness ?? 1.0},               // 金属度
  roughness: ${pbr0?.roughness ?? 0.26},               // 粗糙度
  clearcoat: ${pbr0?.clearcoat ?? 1.0},               // 汽车镜面清漆层
  clearcoatRoughness: ${pbr0?.clearcoatRoughness ?? 0.08},      // 清漆锐利度
  envMapIntensity: ${pbr0?.envIntensity ?? 1.05},          // 环境反射增益
};

const liveryStage1 = {
  color: '${pbr1?.color ?? '#090A0B'}',       // 后段涂装：${currentTeam.liveryStage1Desc}
  metalness: ${pbr1?.metalness ?? 0.15},
  roughness: ${pbr1?.roughness ?? 0.32},
  clearcoat: ${pbr1?.clearcoat ?? 0.95},
  clearcoatRoughness: ${pbr1?.clearcoatRoughness ?? 0.04},
  envMapIntensity: ${pbr1?.envIntensity ?? 1.0},
};`}</code>
            </pre>
          )}

          {activeTab === 'normals' && (
            <pre>
              <code>{`// GLSL 编译期法线注入（避免顶点位移，保持纯像素级高效采样）
const BODY_NORMAL_FRAGMENT = /* glsl */ \`
normal = normalize( ( viewMatrix * vec4( bodyNormal( vBodyPos ), 0.0 ) ).xyz );
nonPerturbedNormal = normal;
\`;

// ${currentTeam.name} 车身空气动力学波浪与双曲正切腰线
vec3 bodyNormal( vec3 pos ) {
  vec2 grad = vec2( 0.0 );
  // 累加四阶正弦导数与双曲正切折线 (tanh)
  grad += waveGrad( pos.xy, uWaves );
  grad += creaseGrad( pos.xy, uCrease );
  return normalize( vec3( -grad.x, -grad.y, 1.0 ) );
}`}</code>
            </pre>
          )}

          {activeTab === 'studio' && (
            <pre>
              <code>{`// ${currentTeam.name} 摄影棚柔光条天穹渲染与 PMREM 预过滤辐射度贴图
const pmrem = new THREE.PMREMGenerator( this.renderer );
pmrem.compileEquirectangularShader();

// 天穹基础环境梯度: sky='${currentTeam.preset.studio.sky}', horizon='${currentTeam.preset.studio.horizon}'
// 包含 ${currentTeam.preset.studio.strips.length} 条定制 HDR 柔光带 (sigma = 0.04 预滤波反锯齿)
${currentTeam.preset.studio.strips.map((s, idx) => `// Strip ${idx + 1}: color='${s.color}', intensity=${s.intensity}, az=${s.azimuth}°, el=${s.elevation}°`).join('\n')}

this.envMap = pmrem.fromScene( studioScene, 0.04, 0.1, 100 ).texture;
this.scene.environment = this.envMap;`}</code>
            </pre>
          )}
        </div>
      </div>
    </section>
  );
};

export default CarEngineeringSection;
