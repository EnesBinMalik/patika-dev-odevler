import React from 'react';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
} from 'lucide-react';
import { WeatherCondition } from '../types/weather';

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className = '', size = 32 }) => {
  const iconProps = {
    size,
    className: `${className} transition-transform duration-300`,
  };

  switch (condition.iconName) {
    case 'sun':
      return <Sun {...iconProps} className={`${className} text-amber-500`} />;
    case 'cloud-sun':
      return <CloudSun {...iconProps} className={`${className} text-sky-500`} />;
    case 'cloud':
      return <Cloud {...iconProps} className={`${className} text-slate-400`} />;
    case 'cloud-fog':
      return <CloudFog {...iconProps} className={`${className} text-zinc-400`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle {...iconProps} className={`${className} text-blue-400`} />;
    case 'cloud-rain':
      return <CloudRain {...iconProps} className={`${className} text-blue-600`} />;
    case 'cloud-snow':
      return <CloudSnow {...iconProps} className={`${className} text-indigo-400`} />;
    case 'cloud-lightning':
      return <CloudLightning {...iconProps} className={`${className} text-violet-500`} />;
    default:
      return <CloudSun {...iconProps} className={`${className} text-sky-500`} />;
  }
};
