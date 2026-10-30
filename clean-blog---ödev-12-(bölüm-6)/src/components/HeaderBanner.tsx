import React from 'react';

interface HeaderBannerProps {
  title: string;
  subtitle: string;
  meta?: string;
  bgImageUrl: string;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  title,
  subtitle,
  meta,
  bgImageUrl
}) => {
  return (
    <div className="relative w-full overflow-hidden bg-slate-950 py-20 sm:py-28 lg:py-32 flex items-center justify-center">
      {/* Background Image with Fallback */}
      <img
        src={bgImageUrl}
        alt={title}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-700"
      />

      {/* Measured Scrim for WCAG AA readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
        <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight" style={{ textWrap: 'balance' }}>
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed mb-4" style={{ textWrap: 'balance' }}>
          {subtitle}
        </p>
        {meta && (
          <div className="text-xs sm:text-sm text-slate-300 font-sans tracking-wide">
            {meta}
          </div>
        )}
      </div>
    </div>
  );
};
