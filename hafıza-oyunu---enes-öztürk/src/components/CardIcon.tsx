import React from 'react';
import {
  Atom,
  Layers,
  FileCode2,
  Code2,
  Palette,
  Server,
  Zap,
  GitBranch,
  Database,
  Terminal,
  Cloud,
  ShieldCheck,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface CardIconProps {
  iconName: string;
  className?: string;
  color?: string;
}

export const CardIcon: React.FC<CardIconProps> = ({ iconName, className = 'w-7 h-7 sm:w-8 sm:h-8', color }) => {
  const iconProps = {
    className,
    style: color ? { color } : undefined,
  };

  switch (iconName) {
    case 'Atom':
      return <Atom {...iconProps} />;
    case 'Layers':
      return <Layers {...iconProps} />;
    case 'FileCode2':
      return <FileCode2 {...iconProps} />;
    case 'Code2':
      return <Code2 {...iconProps} />;
    case 'Palette':
      return <Palette {...iconProps} />;
    case 'Server':
      return <Server {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'GitBranch':
      return <GitBranch {...iconProps} />;
    case 'Database':
      return <Database {...iconProps} />;
    case 'Terminal':
      return <Terminal {...iconProps} />;
    case 'Cloud':
      return <Cloud {...iconProps} />;
    case 'ShieldCheck':
      return <ShieldCheck {...iconProps} />;
    case 'Sparkles':
      return <Sparkles {...iconProps} />;
    default:
      return <HelpCircle {...iconProps} />;
  }
};
