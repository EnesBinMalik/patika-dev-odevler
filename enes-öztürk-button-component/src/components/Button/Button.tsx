import React, { forwardRef, useState } from 'react';
import { ButtonProps, ButtonType, ButtonSize, ButtonShape } from './Button.types';

/**
 * Modern, accessible Button component created by Enes Öztürk.
 * Fully supports Ant Design inspired types: primary, default, dashed, text, link.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    type = 'default',
    size = 'middle',
    shape = 'default',
    loading = false,
    danger = false,
    ghost = false,
    block = false,
    disabled = false,
    htmlType = 'button',
    icon,
    iconPosition = 'start',
    rippleEffect = true,
    children,
    className = '',
    onClick,
    ...rest
  },
  ref
) {
  const [isWaving, setIsWaving] = useState(false);

  // Normalize size names
  const normalizedSize: 'small' | 'middle' | 'large' =
    size === 'small' || size === 'sm'
      ? 'small'
      : size === 'large' || size === 'lg'
      ? 'large'
      : 'middle';

  // Sizing definitions
  const sizeClasses: Record<'small' | 'middle' | 'large', string> = {
    small: shape === 'circle' ? 'w-7 h-7 text-xs' : 'h-7 px-2.5 text-xs gap-1.5',
    middle: shape === 'circle' ? 'w-9 h-9 text-sm' : 'h-9 px-4 text-sm gap-2',
    large: shape === 'circle' ? 'w-11 h-11 text-base' : 'h-11 px-5 text-base gap-2.5',
  };

  // Shape definitions
  const shapeClasses: Record<ButtonShape, string> = {
    default: 'rounded-md',
    round: 'rounded-full',
    circle: 'rounded-full flex items-center justify-center p-0',
  };

  // Type & Danger styling matrix
  const getTypeClasses = (t: ButtonType, isDanger: boolean, isGhost: boolean): string => {
    if (disabled || loading) {
      if (t === 'primary') {
        return 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none';
      }
      if (t === 'dashed') {
        return 'bg-slate-50 text-slate-300 border border-dashed border-slate-200 cursor-not-allowed';
      }
      if (t === 'text' || t === 'link') {
        return 'bg-transparent text-slate-300 border-none cursor-not-allowed';
      }
      return 'bg-slate-50 text-slate-300 border border-slate-200 cursor-not-allowed';
    }

    // Ghost variants (for colored/dark backgrounds)
    if (isGhost) {
      if (t === 'primary') {
        return isDanger
          ? 'bg-transparent text-red-500 border border-red-500 hover:text-red-400 hover:border-red-400 active:text-red-600 active:border-red-600'
          : 'bg-transparent text-blue-500 border border-blue-500 hover:text-blue-400 hover:border-blue-400 active:text-blue-600 active:border-blue-600';
      }
      if (t === 'dashed') {
        return isDanger
          ? 'bg-transparent text-red-500 border border-dashed border-red-500 hover:text-red-400 hover:border-red-400 active:text-red-600'
          : 'bg-transparent text-blue-500 border border-dashed border-blue-500 hover:text-blue-400 hover:border-blue-400 active:text-blue-600';
      }
      if (t === 'text' || t === 'link') {
        return isDanger
          ? 'bg-transparent text-red-500 border-none hover:text-red-400 active:text-red-600'
          : 'bg-transparent text-white border-none hover:text-blue-400 active:text-blue-600';
      }
      return isDanger
        ? 'bg-transparent text-red-500 border border-red-400 hover:text-red-400 hover:border-red-300 active:text-red-600'
        : 'bg-transparent text-white border border-white/70 hover:text-blue-400 hover:border-blue-400 active:text-blue-600 active:border-blue-600';
    }

    // Standard type variants
    switch (t) {
      case 'primary':
        if (isDanger) {
          return 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white border border-transparent shadow-sm hover:shadow active:shadow-inner';
        }
        return 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border border-transparent shadow-sm hover:shadow active:shadow-inner';

      case 'dashed':
        if (isDanger) {
          return 'bg-white hover:bg-red-50/50 active:bg-red-100/50 text-red-600 hover:text-red-700 border border-dashed border-red-300 hover:border-red-500 active:border-red-600';
        }
        return 'bg-white hover:bg-blue-50/40 active:bg-blue-100/50 text-slate-800 hover:text-blue-600 active:text-blue-700 border border-dashed border-slate-300 hover:border-blue-500 active:border-blue-600 shadow-sm';

      case 'text':
        if (isDanger) {
          return 'bg-transparent hover:bg-red-50 active:bg-red-100 text-red-600 hover:text-red-700 border border-transparent';
        }
        return 'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 hover:text-slate-900 border border-transparent';

      case 'link':
        if (isDanger) {
          return 'bg-transparent text-red-600 hover:text-red-500 active:text-red-700 hover:underline underline-offset-4 border border-transparent p-0 h-auto font-normal';
        }
        return 'bg-transparent text-blue-600 hover:text-blue-500 active:text-blue-700 hover:underline underline-offset-4 border border-transparent p-0 h-auto font-normal';

      case 'default':
      default:
        if (isDanger) {
          return 'bg-white hover:bg-red-50/40 active:bg-red-100/50 text-red-600 hover:text-red-700 border border-red-300 hover:border-red-500 active:border-red-600 shadow-sm';
        }
        return 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 hover:text-blue-600 active:text-blue-700 border border-slate-300 hover:border-blue-500 active:border-blue-600 shadow-sm';
    }
  };

  // Click wave animation trigger
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    if (rippleEffect && type !== 'link' && type !== 'text') {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 400);
    }

    onClick?.(e);
  };

  const isInteractive = !disabled && !loading;

  return (
    <button
      ref={ref}
      type={htmlType}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center font-medium
        transition-all duration-150 ease-out select-none outline-none
        ${isInteractive ? 'cursor-pointer active:scale-[0.98]' : 'cursor-not-allowed'}
        ${block ? 'w-full' : ''}
        ${sizeClasses[normalizedSize]}
        ${shapeClasses[shape]}
        ${getTypeClasses(type, danger, ghost)}
        focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500/50
        ${className}
      `}
      {...rest}
    >
      {/* Wave click ring effect */}
      {isWaving && (
        <span
          className={`
            absolute -inset-[3px] rounded-[inherit] pointer-events-none
            animate-ping opacity-30
            ${danger ? 'bg-red-500' : type === 'primary' ? 'bg-blue-600' : 'bg-blue-400'}
          `}
          style={{ animationDuration: '400ms', animationIterationCount: '1' }}
          aria-hidden="true"
        />
      )}

      {/* Loading Spinner */}
      {loading && (
        <svg
          className="animate-spin -ml-0.5 shrink-0"
          style={{ width: normalizedSize === 'small' ? '0.85rem' : normalizedSize === 'large' ? '1.15rem' : '1rem', height: normalizedSize === 'small' ? '0.85rem' : normalizedSize === 'large' ? '1.15rem' : '1rem' }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Icon Start */}
      {!loading && icon && iconPosition === 'start' && (
        <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>
      )}

      {/* Button Text / Content */}
      {children && (
        <span className={`inline-flex items-center leading-none ${loading ? 'opacity-85' : ''}`}>
          {children}
        </span>
      )}

      {/* Icon End */}
      {!loading && icon && iconPosition === 'end' && (
        <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>
      )}
    </button>
  );
});

Button.displayName = 'EnesOzturkButton';

export default Button;
