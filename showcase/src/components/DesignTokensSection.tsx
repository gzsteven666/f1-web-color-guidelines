import React, { useState } from 'react';
import { Palette, Copy, Check, Layers } from 'lucide-react';
import DecryptedText from './ui/DecryptedText';
import { useTeam } from '@/context/TeamContext';

/**
 * ==================================================================
 * DesignTokensSection.tsx —— 车队设计令牌与涂装过渡区
 * ==================================================================
 * 标记 data-seam="true"：视口滚动经过此处时，底层的 WebGL 车漆材质将
 * 自动从【阶段 0：主涂装底漆】平滑过渡至【阶段 1：车身后段暗影/清漆】。
 */

export const DesignTokensSection: React.FC = () => {
  const { currentTeam } = useTeam();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <section
      id="tokens"
      data-seam="true"
      data-line="28,25 50,75"
      className="relative py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* 过渡区提示横幅 */}
      <div
        className="flex items-center justify-between p-4 rounded bg-gradient-to-r from-white/5 to-transparent border border-white/10 mb-12 transition-all duration-500"
        style={{
          borderLeftColor: currentTeam.brandAccent,
          borderLeftWidth: '3px',
        }}
      >
        <div className="flex items-center gap-3">
          <Layers
            className="w-5 h-5 transition-colors duration-500"
            style={{ color: currentTeam.brandBright }}
          />
          <div>
            <div className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              <DecryptedText
                key={`seam-${currentTeam.id}`}
                text={currentTeam.seamTitle}
                speed={30}
              />
            </div>
            <div className="text-xs text-white/50 mt-0.5">
              {currentTeam.seamDescription}
            </div>
          </div>
        </div>
        <span
          className="hidden sm:inline-block px-3 py-1 rounded bg-black/40 text-[11px] font-mono border transition-colors duration-500"
          style={{
            color: currentTeam.brandAccent,
            borderColor: `${currentTeam.brandAccent}40`,
          }}
        >
          SEAM ACTIVE
        </span>
      </div>

      {/* 标题 */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Palette
            className="w-4 h-4 transition-colors duration-500"
            style={{ color: currentTeam.brandAccent }}
          />
          <span
            className="font-mono text-xs tracking-widest uppercase transition-colors duration-500"
            style={{ color: currentTeam.brandAccent }}
          >
            {currentTeam.name.toUpperCase()} COLOR SYSTEM
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
          官方 2026 设计令牌规范
        </h2>
        <p className="text-white/60 text-sm sm:text-base max-w-2xl mt-2 font-light">
          点击任意色卡快速复制 Hex 与语义定义，完美映射至 Tailwind CSS 与三维材质参数。
        </p>
      </div>

      {/* 令牌色卡网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentTeam.tokens.map((token) => (
          <div
            key={token.hex}
            onClick={() => handleCopy(token.hex)}
            className="group cursor-pointer rounded-lg p-6 bg-[#121518]/80 backdrop-blur-md border border-white/10 hover:border-white/40 transition-all duration-300 shadow-xl hover:-translate-y-1"
          >
            {/* 色块指示 */}
            <div className="relative w-full h-28 rounded-md overflow-hidden mb-5 border border-white/10 flex items-end p-3 shadow-inner">
              <div
                className="absolute inset-0"
                style={{ backgroundColor: token.bgStyle || token.hex }}
              />
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/60 text-white backdrop-blur-sm">
                  {token.hex}
                </span>
                <span className="p-1 rounded bg-black/60 text-white/80 hover:text-white backdrop-blur-sm">
                  {copiedHex === token.hex ? (
                    <Check
                      className="w-3.5 h-3.5 transition-colors duration-300"
                      style={{ color: currentTeam.brandBright }}
                    />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </span>
              </div>
            </div>

            {/* 描述信息 */}
            <h3
              className="text-lg font-bold text-white transition-colors"
              style={{
                color: copiedHex === token.hex ? currentTeam.brandBright : undefined,
              }}
            >
              {token.name}
            </h3>
            <div className="text-xs font-mono text-white/40 mt-0.5">{token.role}</div>

            <p className="text-xs text-white/60 mt-3 leading-relaxed">
              {token.usage}
            </p>

            {/* PBR 属性参数 */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block mb-1">
                PBR PHYSICAL SPEC
              </span>
              <span
                className="text-[11px] font-mono break-all block transition-colors duration-500"
                style={{ color: currentTeam.brandAccent }}
              >
                {token.pbrProps}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DesignTokensSection;
