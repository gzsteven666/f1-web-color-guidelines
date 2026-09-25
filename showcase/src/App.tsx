import React from 'react';
import { TeamProvider } from './context/TeamContext';
import SurfaceBackground from './components/SurfaceBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TelemetrySection from './components/TelemetrySection';
import DesignTokensSection from './components/DesignTokensSection';
import CarEngineeringSection from './components/CarEngineeringSection';
import Footer from './components/Footer';

/**
 * ==================================================================
 * App.tsx —— F1 2026 连续车身 Showcase 主应用
 * ==================================================================
 * 架构：
 *   1. TeamProvider: 集中管理 5 大车队状态与 3D/SVG 预设响应
 *   2. SurfaceBackground: 编排 WebGL MeshPhysicalMaterial 车漆背景与 Lenis 滚动驱动
 *   3. 赛道贝塞尔描线: 通过各区块上标注的 data-line="x%,y% ..." 锚点穿针引线
 *   4. 涂装过渡区: 在 data-seam 区块完成从车身首段到底盘暗影的平滑过渡
 *   5. React Bits 动效组件: DecryptedText, CountUp, BlurText
 */

export function App() {
  return (
    <TeamProvider>
      <SurfaceBackground>
        <Navbar />
        <main className="flex flex-col">
          <HeroSection />
          <TelemetrySection />
          <DesignTokensSection />
          <CarEngineeringSection />
        </main>
        <Footer />
      </SurfaceBackground>
    </TeamProvider>
  );
}

export default App;
