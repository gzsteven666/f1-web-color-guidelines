import React, { useEffect, useRef, useState } from 'react';
import { mountSurfacePage } from '@surface/surface-page.js';
import { useTeam } from '@/context/TeamContext';

/**
 * ==================================================================
 * SurfaceBackground.tsx —— 连续车身 PBR 与贯穿涂装线 React 背景层
 * ==================================================================
 * 将原生 WebGL MeshPhysicalMaterial 车漆渲染层和 SVG RacingLine 编排接入 React 生命周期。
 * 随页面滚动自动触发：
 *   1. 车身曲面法线微扰动与 HDR 柔光箱反射流动
 *   2. 贯穿赛道级贝塞尔涂装线绘制（从页顶至页底）
 *   3. 阶段性车漆色相平滑过渡
 * 并在用户切换车队时即时重构柔光环境与着色器参数。
 * 具备双层物理受光 CSS 渐变降级保障（Fallback）。
 */

interface SurfaceBackgroundProps {
  /** 子元素（页面主要内容） */
  children?: React.ReactNode;
}

export const SurfaceBackground: React.FC<SurfaceBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { currentTeam, registerPageInstance } = useTeam();
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    if (!canvas || !svg) return;

    // 同步 CSS fallback 渐变变量给整页
    if (currentTeam.preset.fallback) {
      document.documentElement.style.setProperty('--surface-fallback', currentTeam.preset.fallback);
    }

    // 获取页面中所有的涂装缝合/过渡元素 [data-seam]
    const seams = Array.from(document.querySelectorAll('[data-seam]'));

    // 挂载共享核心 surface-page
    const pageInstance = mountSurfacePage({
      canvas,
      svg,
      preset: currentTeam.preset,
      seams,
      smooth: true,
      onFallback: () => {
        setIsFallback(true);
        document.documentElement.classList.add('no-webgl');
      },
    });

    // 注册给 TeamContext 供动态切换车队使用
    registerPageInstance(pageInstance);

    // 页面完全就绪后重新测量一次锚点与尺寸
    const timer = setTimeout(() => {
      pageInstance.measure();
    }, 200);

    return () => {
      clearTimeout(timer);
      registerPageInstance(null);
      pageInstance.destroy();
    };
  }, [registerPageInstance]);

  // 当当前车队切换时，动态同步更新 CSS 降级渐变
  useEffect(() => {
    if (currentTeam.preset.fallback) {
      document.documentElement.style.setProperty('--surface-fallback', currentTeam.preset.fallback);
    }
  }, [currentTeam]);

  return (
    <div
      className="relative min-h-screen w-full text-[#C8CCCE] transition-colors duration-700"
      style={{
        background: currentTeam.preset.fallback,
        backgroundColor: currentTeam.preset.studio?.ground || '#050607',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* 3D WebGL PBR 车漆渲染 Canvas */}
      <canvas
        ref={canvasRef}
        id="surface-canvas"
        className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${isFallback ? 'hidden' : ''}`}
      />

      {/* 贯穿全页的 SVG 赛道描线层 */}
      <svg
        ref={svgRef}
        id="racing-line-svg"
        className="absolute top-0 left-0 w-full pointer-events-none z-10 overflow-visible"
      />

      {/* 页面前台内容层 */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export default SurfaceBackground;
