import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Build ESM module
await esbuild.build({
  entryPoints: [path.join(__dirname, '../../src/components/Button/index.ts')],
  outfile: path.join(distDir, 'index.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  external: ['react', 'react-dom'],
  sourcemap: true,
});

// 2. Build CJS module
await esbuild.build({
  entryPoints: [path.join(__dirname, '../../src/components/Button/index.ts')],
  outfile: path.join(distDir, 'index.cjs'),
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['es2020'],
  external: ['react', 'react-dom'],
  sourcemap: true,
});

// 3. Write index.d.ts declaration file
const dtsContent = `import React from 'react';

export type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';
export type ButtonSize = 'small' | 'middle' | 'large' | 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'circle' | 'round';
export type ButtonHTMLType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: ButtonType;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  danger?: boolean;
  ghost?: boolean;
  block?: boolean;
  htmlType?: ButtonHTMLType;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  children?: React.ReactNode;
  className?: string;
  rippleEffect?: boolean;
}

export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default Button;
`;

fs.writeFileSync(path.join(distDir, 'index.d.ts'), dtsContent);
console.log('✅ [enes-ozturk-button] Bundle built successfully into dist/');
