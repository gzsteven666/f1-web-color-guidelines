import React from 'react';
import { ArrowRight, Sliders } from 'lucide-react';
import BlurText from './ui/BlurText';
import DecryptedText from './ui/DecryptedText';
import { useTeam } from '@/context/TeamContext';

/**
 * ==================================================================
 * HeroSection.tsx —— 首屏车队全景与连续车身入口
 * ==================================================================
 */

export const HeroSection: React.FC = () => {
  const { currentTeam } = useTeam();

  return (
    <section
      id="hero"
      data-line="50,22 15,85"
      className="relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-24"
    >
      {/* 顶部技术标识 */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span
          className="px-2.5 py-0.5 rounded-sm text-[11px] font-mono tracking-widest uppercase transition-colors duration-500"
          style={{
            backgroundColor: `${currentTeam.brandAccent}20`,
            border: `1px solid ${currentTeam.brandAccent}60`,
            color: currentTeam.brandBright,
          }}
        >
          {currentTeam.regulations}
        </span>
        <span className="text-white/40 text-xs font-mono">//</span>
        <span className="text-white/60 text-xs font-mono tracking-wider">
          <DecryptedText
            key={currentTeam.chassis}
            text={currentTeam.chassis}
            speed={40}
            animateOn="view"
          />
        </span>
      </div>

      {/* 动态模糊进场主标题 */}
      <div className="max-w-4xl">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.08] mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
          <BlurText
            key={`title1-${currentTeam.id}`}
            text={currentTeam.heroTitle1}
            delay={0.06}
            animateBy="words"
            direction="top"
          />
          <span className="block mt-1 bg-gradient-to-r from-[#FFFFFF] via-[#E2E6E8] to-[#98A3A8] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            <BlurText
              key={`title2-${currentTeam.id}`}
              text={currentTeam.heroTitle2}
              delay={0.06}
              animateBy="words"
              direction="top"
            />
          </span>
        </h1>

        <div className="text-lg sm:text-xl text-[#E2E6E8] font-normal max-w-2xl mt-4 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          {currentTeam.heroDescription}
        </div>
      </div>

      {/* 交互按钮组与特性标签 */}
      <div className="flex flex-wrap items-center gap-4 mt-8">
        <a
          href="#tokens"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-sm text-[#050607] font-mono text-sm font-semibold tracking-wider transition-all duration-300"
          style={{
            backgroundColor: currentTeam.brandAccent,
            color: currentTeam.id === 'cadillac' ? '#000000' : '#050607',
            boxShadow: `0 0 25px ${currentTeam.brandTextGlow}`,
          }}
        >
          <span>车队色彩规范系统</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        <a
          href="#telemetry"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-mono text-sm tracking-wider transition-all"
        >
          <Sliders
            className="w-4 h-4 transition-colors duration-500"
            style={{ color: currentTeam.brandAccent }}
          />
          <span>实时遥测指标</span>
        </a>
      </div>

      {/* 底部参数小字 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/5 text-xs font-mono text-white/50">
        <div>
          <div className="text-white/30 uppercase tracking-widest text-[10px]">BASECOAT MATERIAL</div>
          <div className="text-[#C8CCCE] font-semibold mt-0.5">
            {currentTeam.tokens[0]?.name.toUpperCase() || 'METALLIC PBR'}
          </div>
        </div>
        <div>
          <div className="text-white/30 uppercase tracking-widest text-[10px]">CLEARCOAT LAYER</div>
          <div
            className="font-semibold mt-0.5 transition-colors duration-500"
            style={{ color: currentTeam.brandBright }}
          >
            1.0 HIGH-GLOSS PBR
          </div>
        </div>
        <div>
          <div className="text-white/30 uppercase tracking-widest text-[10px]">LIGHTING RIG</div>
          <div className="text-[#C8CCCE] font-semibold mt-0.5">
            {currentTeam.preset.studio.strips.length}x HDR STUDIO SOFTBOXES
          </div>
        </div>
        <div>
          <div className="text-white/30 uppercase tracking-widest text-[10px]">ALIASING ARTIFACTS</div>
          <div
            className="font-semibold mt-0.5 transition-colors duration-500"
            style={{ color: currentTeam.brandAccent }}
          >
            ZERO NOISE (PMREM FILTERED)
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
