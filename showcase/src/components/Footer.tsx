import React from 'react';
import { ExternalLink } from 'lucide-react';
import DecryptedText from './ui/DecryptedText';
import { useTeam } from '@/context/TeamContext';

/**
 * ==================================================================
 * Footer.tsx —— 遥测收束与页脚底座
 * ==================================================================
 */

export const Footer: React.FC = () => {
  const { currentTeam } = useTeam();

  return (
    <footer
      data-line="30,20 50,70"
      className="relative z-20 py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#050607]/90 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm font-black tracking-widest text-white">
              VERTEX // F1 CONTINUOUS SURFACE
            </span>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono border transition-colors duration-500"
              style={{
                backgroundColor: `${currentTeam.brandAccent}20`,
                color: currentTeam.brandBright,
                borderColor: `${currentTeam.brandAccent}40`,
              }}
            >
              DUAL-STACK ENGINE
            </span>
          </div>
          <p className="text-xs text-white/50 max-w-md">
            以 2026 年 F1 规则为基准的品牌设计令牌与 WebGL 材质规范库。支持单文件零依赖 HTML 与 React + Tailwind 原生工程双栈呈现。
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end text-xs font-mono text-white/40 gap-2">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/gzsteven666/f1-web-color-guidelines"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="#hero"
              className="hover:text-white transition-colors"
            >
              Back to Top
            </a>
          </div>
          <div className="text-[11px] text-white/40">
            <DecryptedText
              key={`footer-${currentTeam.id}`}
              text={`REF: ${currentTeam.chassis} // ACTIVE LIVERY`}
              speed={50}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
