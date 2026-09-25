import React from 'react';
import { ExternalLink } from 'lucide-react';
import DecryptedText from './ui/DecryptedText';
import { useTeam } from '@/context/TeamContext';

/**
 * ==================================================================
 * Navbar.tsx —— 遥测 HUD 风格浮动导航栏（带 5 大车队实时切换器）
 * ==================================================================
 */

export const Navbar: React.FC = () => {
  const { currentTeam, setTeamId, allTeams } = useTeam();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#050607]/85 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* 左侧车队标识 */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center font-mono font-black text-black text-xs tracking-tighter shadow-lg transition-colors duration-500"
            style={{
              backgroundColor: currentTeam.brandAccent,
              boxShadow: `0 0 16px ${currentTeam.brandTextGlow}`,
              color: currentTeam.id === 'cadillac' ? '#000000' : '#000000',
            }}
          >
            {currentTeam.shortCode}
          </div>
          <div className="flex flex-col">
            <span
              className="font-mono text-xs tracking-widest font-semibold uppercase transition-colors duration-500"
              style={{ color: currentTeam.brandAccent }}
            >
              {currentTeam.name}
            </span>
            <span className="text-[12px] font-medium tracking-tight text-white/80 hidden sm:inline">
              F1 2026 Continuous Surface UI
            </span>
          </div>
        </div>

        {/* 中间 5 大车队切换选择器 (Team HUD) */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 overflow-x-auto max-w-full">
          {allTeams.map((team) => {
            const isActive = team.id === currentTeam.id;
            return (
              <button
                key={team.id}
                onClick={() => setTeamId(team.id)}
                className={`relative px-3 py-1 rounded-full text-xs font-mono font-medium transition-all duration-300 flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-white/50 hover:text-white/90 hover:bg-white/5'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: `${team.brandAccent}26`, // 15% 透明度底色
                        border: `1px solid ${team.brandAccent}`,
                        boxShadow: `0 0 12px ${team.brandTextGlow}`,
                      }
                    : { border: '1px solid transparent' }
                }
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: team.brandAccent }}
                />
                <span>{team.shortCode}</span>
              </button>
            );
          })}
        </div>

        {/* 右侧遥测状态灯与 GitHub 链接 */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: currentTeam.brandBright }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: currentTeam.brandAccent }}
              />
            </span>
            <span className="text-white/80">
              <DecryptedText
                key={currentTeam.id}
                text="TELEMETRY ACTIVE"
                speed={60}
                maxIterations={8}
                animateOn="hover"
              />
            </span>
          </div>

          <a
            href={`./templates/${currentTeam.id}-surface.html`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 text-xs font-mono transition-all"
            title="在新标签页打开当前车队的独立单文件模板 (无框架/纯原生)"
          >
            <span>原生模板</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <a
            href="https://github.com/gzsteven666/f1-web-color-guidelines"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono transition-all"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
