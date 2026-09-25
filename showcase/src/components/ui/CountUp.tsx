import React, { useEffect, useState, useRef } from 'react';

/**
 * ==================================================================
 * CountUp.tsx —— React Bits 数字滚轮渐进动画组件
 * ==================================================================
 * 灵感源自 React Bits (https://reactbits.dev/text-animations/count-up)
 * 适用于 F1 圈速遥测、极速指标、引擎功率与冠军统计数字的丝滑滚动递增。
 */

export interface CountUpProps {
  /** 目标最终数值 */
  to: number;
  /** 起始数值，默认为 0 */
  from?: number;
  /** 动画持续总时长（秒），默认为 2.0 */
  duration?: number;
  /** 小数点保留位数，例如 1.80s 秒表需要 2 位小数 */
  decimals?: number;
  /** 千分位分隔符，例如 "," 或 "" */
  separator?: string;
  /** 前缀符号（例如 "+" 或 "№"） */
  prefix?: string;
  /** 后缀符号（例如 "s" 或 " BHP" 或 "km/h"） */
  suffix?: string;
  /** 自定义样式类名 */
  className?: string;
  /** 延迟触发时间（毫秒） */
  delay?: number;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 2.0,
  decimals = 0,
  separator = '',
  prefix = '',
  suffix = '',
  className = '',
  delay = 0,
}) => {
  const [value, setValue] = useState<number>(from);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number;
    let timerId: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;

            timerId = setTimeout(() => {
              const startTime = performance.now();
              const durationMs = duration * 1000;

              const animate = (now: number) => {
                const elapsed = now - startTime;
                const progress = Math.min(1, elapsed / durationMs);

                // easeOutExpo 缓动算法：高速冲刺并平稳刹车，模拟 F1 制动曲线
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = from + (to - from) * easeProgress;
                setValue(current);

                if (progress < 1) {
                  rafId = requestAnimationFrame(animate);
                } else {
                  setValue(to);
                }
              };

              rafId = requestAnimationFrame(animate);
            }, delay);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [to, from, duration, delay]);

  // 格式化输出字符串
  const formattedNumber = (() => {
    const fixed = value.toFixed(decimals);
    if (!separator) return fixed;

    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  })();

  return (
    <span ref={containerRef} className={`font-mono tracking-tight tabular-nums ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

export default CountUp;
