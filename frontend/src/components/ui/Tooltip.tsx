/**
 * Tooltip.tsx
 *
 * A reusable, accessible tooltip that shows on hover (and focus) of its trigger.
 * Built with pure React state — no third-party library.
 *
 * Props:
 *   content    – string | ReactNode  shown inside the tooltip bubble
 *   placement  – 'top' | 'bottom' | 'left' | 'right'  (default: 'top')
 *   delay      – ms before showing   (default: 200)
 *   maxWidth   – max-width of bubble (default: 220)
 *   children   – the trigger element (must forward ref or be a real DOM node)
 *   className  – extra class on the wrapper
 */

import {
  useState,
  useRef,
  useId,
  type ReactNode,
  type CSSProperties,
} from 'react';
import './Tooltip.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content:    ReactNode;
  placement?: TooltipPlacement;
  delay?:     number;
  maxWidth?:  number;
  children:   ReactNode;
  className?: string;
}

/** Arrow CSS transforms per placement */
const ARROW: Record<TooltipPlacement, CSSProperties> = {
  top:    { bottom: '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
  bottom: { top:    '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
  left:   { right:  '-5px', top:  '50%', transform: 'translateY(-50%) rotate(45deg)' },
  right:  { left:   '-5px', top:  '50%', transform: 'translateY(-50%) rotate(45deg)' },
};

export default function Tooltip({
  content,
  placement = 'top',
  delay     = 200,
  maxWidth  = 220,
  children,
  className = '',
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();

  const show = () => {
    timer.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timer.current);
    setVisible(false);
  };

  return (
    <span
      className={`tooltip-wrapper ${className}`.trim()}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {/* Trigger — clone to inject aria-describedby */}
      <span aria-describedby={visible ? id : undefined}>
        {children}
      </span>

      {/* Bubble */}
      {visible && (
        <span
          id={id}
          role="tooltip"
          className={`tooltip-bubble tooltip-bubble--${placement}`}
          style={{ maxWidth }}
        >
          {/* Arrow */}
          <span className="tooltip-arrow" style={ARROW[placement]} aria-hidden="true" />
          {content}
        </span>
      )}
    </span>
  );
}
