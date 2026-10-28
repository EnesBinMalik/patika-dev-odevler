import React from 'react';
import { Star } from 'lucide-react';

interface StarDividerProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export const StarDivider: React.FC<StarDividerProps> = ({ theme = 'dark', className = '' }) => {
  const isDark = theme === 'dark';
  const lineColor = isDark ? 'bg-[#2c3e50]' : 'bg-white';
  const starColor = isDark ? 'text-[#2c3e50]' : 'text-white';

  return (
    <div className={`flex items-center justify-center gap-4 my-4 ${className}`} aria-hidden="true">
      <div className={`h-1 w-20 sm:w-28 rounded-full ${lineColor}`} />
      <div className="relative">
        <Star className={`w-6 h-6 fill-current ${starColor}`} />
      </div>
      <div className={`h-1 w-20 sm:w-28 rounded-full ${lineColor}`} />
    </div>
  );
};
