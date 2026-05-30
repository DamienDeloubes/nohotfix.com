'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';

/**
 * TextType — types a single line of text character-by-character, once, then
 * stops. Ported to TypeScript from reactbits.dev/text-animations/text-type and
 * trimmed to the single use this codebase needs (the Audit Trail §3 immutability
 * callouts).
 *
 * Mandatory behaviour per the brand motion philosophy ("sealed things don't
 * move"): it types ONCE and stops — it never loops and never deletes. The caret
 * blinks only while typing and is removed once the line is complete (no
 * persistent idle cursor).
 *
 * `disabled` must be driven by `prefers-reduced-motion` at the call site: when
 * disabled the final string renders immediately as static text and no timer or
 * observer is created. (The component does not itself read the media query, so
 * the reduced-motion guard lives in the wrapper, exactly like Magnet.tsx.)
 */
interface TextTypeProps {
  text: string;
  /** Render the full text immediately with no animation (reduced-motion guard). */
  disabled?: boolean;
  /** ms per character. */
  typingSpeed?: number;
  /** ms to wait after scroll-into-view before typing begins. */
  initialDelay?: number;
  /** Start typing only when scrolled into view (keeps it in sync with reveal). */
  startOnVisible?: boolean;
  className?: string;
  /** Caret colour while typing (Slate — Sentinel register, not orange). */
  caretColor?: string;
}

export function TextType({
  text,
  disabled = false,
  typingSpeed = 22,
  initialDelay = 0,
  startOnVisible = true,
  className = '',
  caretColor = 'var(--color-slate-400)',
}: TextTypeProps): ReactElement {
  const [count, setCount] = useState(disabled ? text.length : 0);
  const [started, setStarted] = useState(!startOnVisible);
  const ref = useRef<HTMLSpanElement>(null);

  // Begin only when visible (if requested).
  useEffect(() => {
    if (disabled || started) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [disabled, started]);

  // Type once, then stop.
  useEffect(() => {
    if (disabled || !started) return;
    let timer: ReturnType<typeof setTimeout>;
    const startTimer = setTimeout(function step(): void {
      setCount((c) => {
        if (c >= text.length) return c;
        timer = setTimeout(step, typingSpeed);
        return c + 1;
      });
    }, initialDelay);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [disabled, started, text.length, typingSpeed, initialDelay]);

  const done = count >= text.length;

  return (
    <span ref={ref} className={className}>
      {text.slice(0, count)}
      {/* Caret blinks while typing; removed once complete (no idle caret). */}
      {!disabled && !done ? (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block w-[1px] animate-pulse"
          style={{ background: caretColor, height: '1em', verticalAlign: 'text-bottom' }}
        />
      ) : null}
    </span>
  );
}
