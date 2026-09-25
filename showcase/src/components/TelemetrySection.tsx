import React from 'react';
import { Gauge, Zap, Timer, Trophy, Cpu, Activity } from 'lucide-react';
import CountUp from './ui/CountUp';
import DecryptedText from './ui/DecryptedText';
import { useTeam } from '@/context/TeamContext';

/**
 * ==================================================================
 * TelemetrySection.tsx —— 实时遥测指标与极限性能数据板
 * ==================================================================
 * 随车队切换动态响应遥测数据、动力单元调校与主题色调。
 */

export const TelemetrySection: React.FC = () => {
  const { currentTeam } = useTeam();
  const telem = currentTeam.telemetry;

  return (
    <section
      id="telemetry"
      data-line="88,18 72,75"
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* 标题说明 */}
      <div className="flex flex-col mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Activity
            className="w-4 h-4 animate-pulse transition-colors duration-500"
            style={{ color: currentTeam.brandAccent }}
          />
          <span
            className="font-mono text-xs tracking-widest uppercase transition-colors duration-500"
            style={{ color: currentTeam.brandAccent }}
          >
            <DecryptedText
              key={`telemetry-${currentTeam.id}`}
              text={`${currentTeam.shortCode} LIVE PERFORMANCE TELEMETRY`}
              speed={40}
              animateOn="view"
            />
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
          赛道级遥测指标与数字呈现
        </h2>
        <p className="text-white/60 text-sm sm:text-base max-w-2xl mt-2 font-light">
          集成 React Bits CountUp 动态数值滚轮，配合真实 F1 比赛调校参数，展示 {currentTeam.name} 动力单元与车组极限数据。
        </p>
      </div>

      {/* 4 个核心遥测指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 卡片 1: 进站时间 */}
        <div className="relative group rounded-md p-6 bg-[#121518]/70 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <div
              className="p-2 rounded bg-white/5 border border-white/5 transition-colors duration-500"
              style={{ color: currentTeam.brandAccent }}
            >
              <Timer className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
              BENCHMARK
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
            <CountUp
              key={`pit-${currentTeam.id}`}
              to={telem.pitStop.value}
              decimals={2}
              duration={2.2}
              suffix="s"
            />
          </div>
          <div className="text-xs font-mono text-white/50 mt-2 uppercase tracking-wider">
            {telem.pitStop.label}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
            <span>{telem.pitStop.note}</span>
            <span
              className="font-semibold transition-colors duration-500"
              style={{ color: currentTeam.brandBright }}
            >
              {telem.pitStop.status}
            </span>
          </div>
        </div>

        {/* 卡片 2: 综合马力 */}
        <div className="relative group rounded-md p-6 bg-[#121518]/70 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <div
              className="p-2 rounded bg-white/5 border border-white/5 transition-colors duration-500"
              style={{ color: currentTeam.brandBright }}
            >
              <Zap className="w-5 h-5" />
            </div>
            <span
              className="text-[10px] font-mono tracking-widest uppercase transition-colors duration-500"
              style={{ color: currentTeam.brandBright }}
            >
              HYBRID PU
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
            <CountUp
              key={`power-${currentTeam.id}`}
              to={telem.power.value}
              duration={2.5}
              prefix="+"
              suffix=" BHP"
            />
          </div>
          <div className="text-xs font-mono text-white/50 mt-2 uppercase tracking-wider">
            {telem.power.label}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
            <span>{telem.power.note}</span>
            <span
              className="font-semibold transition-colors duration-500"
              style={{ color: currentTeam.brandBright }}
            >
              {telem.power.status}
            </span>
          </div>
        </div>

        {/* 卡片 3: 赛道极速 */}
        <div className="relative group rounded-md p-6 bg-[#121518]/70 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <div
              className="p-2 rounded bg-white/5 border border-white/5 transition-colors duration-500"
              style={{ color: currentTeam.brandAccent }}
            >
              <Gauge className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
              SPEED TRAP
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
            <CountUp
              key={`speed-${currentTeam.id}`}
              to={telem.topSpeed.value}
              duration={2.0}
              suffix=" km/h"
            />
          </div>
          <div className="text-xs font-mono text-white/50 mt-2 uppercase tracking-wider">
            {telem.topSpeed.label}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
            <span>{telem.topSpeed.note}</span>
            <span
              className="font-semibold transition-colors duration-500"
              style={{ color: currentTeam.brandAccent }}
            >
              {telem.topSpeed.status}
            </span>
          </div>
        </div>

        {/* 卡片 4: 冠军/荣誉 */}
        <div className="relative group rounded-md p-6 bg-[#121518]/70 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded bg-white/5 text-[#C8CCCE] border border-white/5">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
              ACHIEVEMENT
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
            <CountUp
              key={`titles-${currentTeam.id}`}
              to={telem.titles.value}
              duration={1.6}
              prefix={telem.titles.value < 10 ? '0' : ''}
              suffix="x"
            />
          </div>
          <div className="text-xs font-mono text-white/50 mt-2 uppercase tracking-wider">
            {telem.titles.label}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
            <span>{telem.titles.note}</span>
            <span className="text-[#C8CCCE] font-semibold">{telem.titles.status}</span>
          </div>
        </div>
      </div>

      {/* 动力系统动态监测条 */}
      <div className="mt-8 p-6 rounded-md bg-[#121518]/50 backdrop-blur-sm border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Cpu
              className="w-4 h-4 transition-colors duration-500"
              style={{ color: currentTeam.brandAccent }}
            />
            <span className="text-xs font-mono tracking-widest text-white uppercase font-medium">
              ERS BATTERY STATE & ACTIVE HARVESTING
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-white/50">
            <span>
              SOC: <strong className="text-white">{telem.ersStatus.soc}</strong>
            </span>
            <span>
              HARVEST:{' '}
              <strong
                className="transition-colors duration-500"
                style={{ color: currentTeam.brandBright }}
              >
                {telem.ersStatus.harvest}
              </strong>
            </span>
            <span>
              THERMAL:{' '}
              <strong
                className="transition-colors duration-500"
                style={{ color: currentTeam.brandAccent }}
              >
                {telem.ersStatus.thermal}
              </strong>
            </span>
          </div>
        </div>

        {/* 动态进度条 */}
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: telem.ersStatus.progress,
              background: `linear-gradient(to right, ${currentTeam.brandAccent}, ${currentTeam.brandBright}, #FFFFFF)`,
              boxShadow: `0 0 10px ${currentTeam.brandTextGlow}`,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default TelemetrySection;
