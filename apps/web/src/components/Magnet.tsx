'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Magnet — wraps its children and nudges them toward the cursor once the pointer
 * enters a padding zone around the element, easing back to rest when it leaves.
 * Ported to TypeScript from reactbits.dev/animations/magnet.
 *
 * `disabled` should be driven by `prefers-reduced-motion` at the call site so the
 * effect is fully inert (children stay centered) for motion-sensitive users.
 */
interface MagnetProps {
  children: ReactNode;
  /** Distance in px beyond the element edges where the magnet starts pulling. */
  padding?: number;
  disabled?: boolean;
  /** Higher = weaker pull (offset is divided by this). */
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

export function Magnet({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
}: MagnetProps): React.ReactElement {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) {
      setIsActive(false);
      setPosition({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const node = magnetRef.current;
      if (!node) return;

      const { left, top, width, height } = node.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true);
        setPosition({
          x: (e.clientX - centerX) / magnetStrength,
          y: (e.clientY - centerY) / magnetStrength,
        });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, disabled, magnetStrength]);

  const innerStyle: CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: isActive ? activeTransition : inactiveTransition,
    willChange: 'transform',
  };

  return (
    <div ref={magnetRef} className={wrapperClassName} style={{ position: 'relative', display: 'inline-block' }}>
      <div className={innerClassName} style={innerStyle}>
        {children}
      </div>
    </div>
  );
}
