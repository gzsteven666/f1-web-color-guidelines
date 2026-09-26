import React, { useRef, useEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import DecryptedText from './ui/DecryptedText';
import { useTeam } from '@/context/TeamContext';

/**
 * ==================================================================
 * Navbar.tsx —— 遥测 HUD 风格浮动导航栏（支持 11 支车队全平台顺畅交互与移动端响应式）
 * ==================================================================
 */

export const Navbar: React.FC = () => {
  const { currentTeam, setTeamId, allTeams } = useTeam();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);

  // 当切换车队时，自动平滑滚动让激活的车队居中可见
  useEffect(() => {
    if (activeBtnRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const btn = activeBtnRef.current;
      const targetScroll = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, [currentTeam.id]);

  // 将鼠标垂直滚轮事件转化为横向滚动，解决鼠标无法横向滚动导致最右侧车队选不到的问题
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  // 点击左右辅助微调箭头
  const scrollByAmount = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#050607]/90 border-b border-white/5 transition-all">
      {/* 桌面端与大屏主要栏 */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          {/* 左侧车队标识 */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm flex items-center justify-center font-mono font-black text-xs tracking-tighter shadow-lg transition-colors duration-500"
              style={{
                backgroundColor: currentTeam.brandAccent,
                boxShadow: `0 0 16px ${currentTeam.brandTextGlow}`,
                color: ['aston-martin', 'mclaren', 'cadillac'].includes(currentTeam.id) ? '#000000' : '#FFFFFF',
              }}
            >
              {currentTeam.shortCode}
            </div>
            <div className="flex flex-col">
              <span
                className="font-mono text-[11px] sm:text-xs tracking-widest font-semibold uppercase transition-colors duration-500 truncate max-w-[140px] sm:max-w-none"
                style={{ color: currentTeam.brandAccent }}
              >
                {currentTeam.name}
              </span>
              <span className="text-[11px] font-medium tracking-tight text-white/70 hidden sm:inline">
                F1 2026 Continuous Surface UI
              </span>
            </div>
          </div>

          {/* 桌面端中间车队切换选择器 (带滚轮横滑与辅助微调箭头) */}
          <div className="hidden md:flex items-center flex-1 min-w-0 max-w-2xl mx-2 relative group">
            {/* 左侧快速微调翻页按钮 */}
            <button
              onClick={() => scrollByAmount(-180)}
              className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all shrink-0 mr-1"
              title="向左滚动车队列表"
              aria-label="Previous teams"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* 滚动机体：开启滚轮横滑，保留合适右侧 padding 避免遮挡 */}
            <div
              ref={scrollContainerRef}
              onWheel={handleWheel}
              className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 overflow-x-auto w-full scroll-smooth select-none scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {allTeams.map((team) => {
                const isActive = team.id === currentTeam.id;
                return (
                  <button
                    key={team.id}
                    ref={isActive ? (el) => { activeBtnRef.current = el; } : null}
                    onClick={() => setTeamId(team.id)}
                    className={`relative px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-all duration-300 flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'text-white shadow-md scale-[1.02]'
                        : 'text-white/50 hover:text-white/90 hover:bg-white/5'
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: `${team.brandAccent}26`,
                            border: `1px solid ${team.brandAccent}`,
                            boxShadow: `0 0 12px ${team.brandTextGlow}`,
                          }
                        : { border: '1px solid transparent' }
                    }
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: team.brandAccent }}
                    />
                    <span>{team.shortCode}</span>
                  </button>
                );
              })}
            </div>

            {/* 右侧快速微调翻页按钮 */}
            <button
              onClick={() => scrollByAmount(180)}
              className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all shrink-0 ml-1"
              title="向右滚动车队列表"
              aria-label="Next teams"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 右侧遥测状态灯与 GitHub / 原生模板链接 */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono">
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
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 text-xs font-mono transition-all"
              title="在新标签页打开当前车队的独立单文件模板"
            >
              <span className="hidden xs:inline">原生模板</span>
              <span className="xs:hidden">模板</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70" />
            </a>

            <a
              href="https://github.com/gzsteven666/f1-web-color-guidelines"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono transition-all"
              title="GitHub 仓库"
            >
              <span className="hidden sm:inline">GitHub</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>
          </div>
        </div>

        {/* 移动端专属吸顶二级车队选择轨道 (支持左右原生平滑触控滑动) */}
        <div className="md:hidden py-2 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto w-full scroll-smooth select-none scrollbar-none px-1">
          {allTeams.map((team) => {
            const isActive = team.id === currentTeam.id;
            return (
              <button
                key={`mobile-${team.id}`}
                onClick={() => setTeamId(team.id)}
                className={`relative px-3 py-1 rounded-full text-xs font-mono font-medium transition-all duration-300 flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-white/50 hover:text-white/90 bg-white/[0.03]'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: `${team.brandAccent}26`,
                        border: `1px solid ${team.brandAccent}`,
                        boxShadow: `0 0 10px ${team.brandTextGlow}`,
                      }
                    : { border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: team.brandAccent }}
                />
                <span>{team.shortCode}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
