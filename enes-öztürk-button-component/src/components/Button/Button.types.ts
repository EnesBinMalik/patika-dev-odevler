import React from 'react';

export type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';

export type ButtonSize = 'small' | 'middle' | 'large' | 'sm' | 'md' | 'lg';

export type ButtonShape = 'default' | 'circle' | 'round';

export type ButtonHTMLType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * The visual type/variant of the button.
   * Required by specification: 'primary' | 'default' | 'dashed' | 'text' | 'link'
   * @default 'default'
   */
  type?: ButtonType;

  /**
   * Size of the button.
   * @default 'middle'
   */
  size?: ButtonSize;

  /**
   * Shape of the button.
   * @default 'default'
   */
  shape?: ButtonShape;

  /**
   * Set the loading status of button with animated spinner.
   * @default false
   */
  loading?: boolean;

  /**
   * Set the danger status of button for destructive actions.
   * @default false
   */
  danger?: boolean;

  /**
   * Make button background transparent. Great for colored/dark backgrounds.
   * @default false
   */
  ghost?: boolean;

  /**
   * Fit button width to its parent container.
   * @default false
   */
  block?: boolean;

  /**
   * Set the original html type of button.
   * @default 'button'
   */
  htmlType?: ButtonHTMLType;

  /**
   * Custom icon element placed before or after content.
   */
  icon?: React.ReactNode;

  /**
   * Icon position relative to children.
   * @default 'start'
   */
  iconPosition?: 'start' | 'end';

  /**
   * Children content.
   */
  children?: React.ReactNode;

  /**
   * Additional custom CSS classes.
   */
  className?: string;

  /**
   * Enable or disable the Ant Design-like ripple click animation wave.
   * @default true
   */
  rippleEffect?: boolean;
}
