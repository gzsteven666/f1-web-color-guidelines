import React, { useEffect, useState, useRef, useCallback } from 'react';

/**
 * ==================================================================
 * DecryptedText.tsx —— React Bits 矩阵解密文字动效组件
 * ==================================================================
 * 灵感源自 React Bits (https://reactbits.dev/text-animations/decrypted-text)
 * 适用于 F1 遥测数据、工程代码与赛道代号的科技感动态解密呈现。
 */

export interface DecryptedTextProps {
  /** 目标文本内容 */
  text: string;
  /** 单次字符跃迁间隔（毫秒），越小越快 */
  speed?: number;
  /** 每个字符在锁定前的最大随机搅乱次数 */
  maxIterations?: number;
  /** 解密展开方向：从头到尾、从尾到头、或从中心向两侧 */
  revealDirection?: 'start' | 'end' | 'center';
  /** 触发解密的时机：进入视口触发、悬停触发、或两者兼具 */
  animateOn?: 'view' | 'hover' | 'both';
  /** 字符搅乱字符集 */
  characters?: string;
  /** 外层容器类名 */
  parentClassName?: string;
  /** 已解密稳定字符的样式类名 */
  className?: string;
  /** 处于未解密扰动状态字符的样式类名（例如高亮荧光青绿） */
  encryptedClassName?: string;
}

const DEFAULT_CHARS = '0123456789ABCDEF!<>-_\\/[]{}—=+*^?#PETRONAS';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 14,
  revealDirection = 'start',
  animateOn = 'both',
  characters = DEFAULT_CHARS,
  parentClassName = '',
  className = '',
  encryptedClassName = 'text-[#00A19B] font-mono',
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isDecrypted, setIsDecrypted] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const iterationRef = useRef<number>(0);

  /**
   * 触发执行解密字符动画
   */
  const triggerDecrypt = useCallback(() => {
    iterationRef.current = 0;
    setIsDecrypted(false);

    if (animationFrameRef.current) {
      clearInterval(animationFrameRef.current);
    }

    const intervalId = window.setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            // 空格保持原样
            if (char === ' ') return ' ';

            // 计算当前字符是否应当锁定显示最终目标字
            let isResolved = false;
            const progress = iterationRef.current / maxIterations;

            if (revealDirection === 'start') {
              isResolved = index < progress * text.length;
            } else if (revealDirection === 'end') {
              isResolved = index >= (1 - progress) * text.length;
            } else {
              // center
              const mid = text.length / 2;
              const distFromMid = Math.abs(index - mid);
              isResolved = distFromMid <= (progress * text.length) / 2;
            }

            if (isResolved) {
              return char;
            }

            // 仍在随机扰动中，从字符集抽取随机字符
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });

      iterationRef.current += 1;

      // 超过最大迭代轮数，完全还原文本并结束动画
      if (iterationRef.current >= maxIterations + Math.ceil(text.length * 0.4)) {
        clearInterval(intervalId);
        setDisplayText(text);
        setIsDecrypted(true);
      }
    }, speed);

    animationFrameRef.current = intervalId;
  }, [text, speed, maxIterations, revealDirection, characters]);

  // 处理视口进入监听 (IntersectionObserver)
  useEffect(() => {
    if (animateOn === 'hover') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerDecrypt();
          }
        });
      },
      { threshold: 0.15 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      if (animationFrameRef.current) clearInterval(animationFrameRef.current);
    };
  }, [triggerDecrypt, animateOn]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover' || animateOn === 'both') {
      triggerDecrypt();
    }
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`inline-block select-none cursor-default ${parentClassName}`}
      aria-label={text}
    >
      <span aria-hidden="true" className={isDecrypted ? className : encryptedClassName}>
        {displayText}
      </span>
      {/* 辅助功能：确保屏幕阅读器能读到正确完整的原始文本 */}
      <span className="sr-only">{text}</span>
    </span>
  );
};

export default DecryptedText;
