import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

/**
 * ==================================================================
 * BlurText.tsx —— React Bits 动态模糊进场文字组件
 * ==================================================================
 * 灵感源自 React Bits (https://reactbits.dev/text-animations/blur-text)
 * 文字单位（单字/词组）从虚化与位移状态平滑过渡到锐利可见，呈现电影感标题进场。
 */

export interface BlurTextProps {
  /** 文本内容 */
  text: string;
  /** 每个单元间的延迟间隔（秒），默认 0.06 */
  delay?: number;
  /** 自定义外层样式类名 */
  className?: string;
  /** 按词划分还是按字符划分 */
  animateBy?: 'words' | 'letters';
  /** 浮现位移方向：从上方落下（top）或从下方升起（bottom） */
  direction?: 'top' | 'bottom';
  /** 进入视口触发的阈值 */
  threshold?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 0.05,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(containerRef, { amount: threshold, once: true });

  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const yOffset = direction === 'top' ? -20 : 20;

  return (
    <p ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          initial={{
            filter: 'blur(10px)',
            opacity: 0,
            y: yOffset,
          }}
          animate={
            isInView
              ? {
                  filter: 'blur(0px)',
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.5,
            delay: index * delay,
            ease: [0.25, 0.1, 0.25, 1], // easeInOutQuad
          }}
          className="inline-block"
        >
          {segment}
          {animateBy === 'words' && index < elements.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;
