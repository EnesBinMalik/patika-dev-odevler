import React from 'react';
import { WeatherIconType } from '../types/weather';

interface WeatherIconProps {
  type: WeatherIconType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-32 h-32',
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  type,
  size = 'md',
  className = '',
  animate = true,
}) => {
  const containerClass = `${sizeClasses[size]} ${className} relative flex items-center justify-center select-none`;

  switch (type) {
    case 'clear-day':
      return (
        <div className={containerClass} title="Güneşli / Açık">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Güneş Işınları */}
            <g
              className={animate ? 'origin-center animate-[spin_24s_linear_infinite]' : ''}
              stroke="url(#sunGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.85"
            >
              <line x1="50" y1="12" x2="50" y2="22" />
              <line x1="50" y1="78" x2="50" y2="88" />
              <line x1="12" y1="50" x2="22" y2="50" />
              <line x1="78" y1="50" x2="88" y2="50" />
              <line x1="23" y1="23" x2="30" y2="30" />
              <line x1="70" y1="70" x2="77" y2="77" />
              <line x1="23" y1="77" x2="30" y2="70" />
              <line x1="70" y1="30" x2="77" y2="23" />
            </g>
            {/* Güneş Çekirdeği */}
            <circle
              cx="50"
              cy="50"
              r="22"
              fill="url(#sunGrad)"
              filter="url(#sunGlow)"
              className={animate ? 'origin-center animate-[pulse_4s_ease-in-out_infinite]' : ''}
            />
          </svg>
        </div>
      );

    case 'clear-night':
      return (
        <div className={containerClass} title="Açık Gece">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="70%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
            </defs>
            {/* Ay */}
            <path
              d="M58 20 C40 20 28 34 28 52 C28 70 42 82 60 82 C68 82 75 79 80 75 C60 73 48 58 50 38 C51 30 55 24 58 20 Z"
              fill="url(#moonGrad)"
            />
            {/* Küçük Yıldızlar */}
            <circle cx="72" cy="26" r="2.5" fill="#FDE047" className={animate ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''} />
            <circle cx="82" cy="42" r="1.8" fill="#FDE047" className={animate ? 'animate-[pulse_3s_ease-in-out_infinite_500ms]' : ''} />
            <circle cx="26" cy="30" r="1.5" fill="#E2E8F0" />
          </svg>
        </div>
      );

    case 'partly-cloudy-day':
      return (
        <div className={containerClass} title="Parçalı Bulutlu">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="sunGradPart" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <linearGradient id="cloudGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="80%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
            </defs>
            {/* Arka Güneş */}
            <circle cx="42" cy="38" r="18" fill="url(#sunGradPart)" />
            {/* Ön Bulut */}
            <path
              d="M32 72 L72 72 A14 14 0 0 0 72 44 A18 18 0 0 0 38 40 A14 14 0 0 0 32 72 Z"
              fill="url(#cloudGradLight)"
              className={animate ? 'transition-transform duration-500 hover:scale-105' : ''}
            />
          </svg>
        </div>
      );

    case 'partly-cloudy-night':
      return (
        <div className={containerClass} title="Parçalı Bulutlu Gece">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="cloudGradNight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>
            {/* Hilal */}
            <path
              d="M52 24 C40 24 32 34 32 46 C32 58 42 66 54 66 C59 66 64 64 68 61 C55 59 47 48 48 35 C49 30 51 26 52 24 Z"
              fill="#E2E8F0"
            />
            {/* Bulut */}
            <path
              d="M30 74 L74 74 A14 14 0 0 0 74 46 A18 18 0 0 0 38 42 A14 14 0 0 0 30 74 Z"
              fill="url(#cloudGradNight)"
            />
          </svg>
        </div>
      );

    case 'cloudy':
    case 'overcast':
      return (
        <div className={containerClass} title="Çok Bulutlu / Kapalı">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="cloudBack" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
              <linearGradient id="cloudFront" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
            </defs>
            {/* Arka Bulut */}
            <path
              d="M44 56 L80 56 A12 12 0 0 0 80 32 A16 16 0 0 0 50 28 A12 12 0 0 0 44 56 Z"
              fill="url(#cloudBack)"
              opacity="0.8"
            />
            {/* Ön Bulut */}
            <path
              d="M26 72 L70 72 A14 14 0 0 0 70 44 A18 18 0 0 0 34 40 A14 14 0 0 0 26 72 Z"
              fill="url(#cloudFront)"
            />
          </svg>
        </div>
      );

    case 'drizzle':
      return (
        <div className={containerClass} title="Çisenti">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="cloudDrizzle" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
            </defs>
            <path
              d="M28 64 L72 64 A14 14 0 0 0 72 36 A18 18 0 0 0 36 32 A14 14 0 0 0 28 64 Z"
              fill="url(#cloudDrizzle)"
            />
            {/* İnce çisenti noktaları */}
            <circle cx="36" cy="74" r="2.2" fill="#38BDF8" opacity="0.8" />
            <circle cx="48" cy="80" r="2.2" fill="#38BDF8" opacity="0.9" />
            <circle cx="60" cy="74" r="2.2" fill="#38BDF8" opacity="0.8" />
          </svg>
        </div>
      );

    case 'rain':
      return (
        <div className={containerClass} title="Yağmurlu">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="cloudRain" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
              <linearGradient id="rainDrop" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
            </defs>
            <path
              d="M26 62 L74 62 A14 14 0 0 0 74 34 A18 18 0 0 0 34 30 A14 14 0 0 0 26 62 Z"
              fill="url(#cloudRain)"
            />
            {/* Yağmur Çizgileri */}
            <g stroke="url(#rainDrop)" strokeWidth="3" strokeLinecap="round" className={animate ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''}>
              <line x1="36" y1="70" x2="31" y2="84" />
              <line x1="50" y1="70" x2="45" y2="86" />
              <line x1="64" y1="70" x2="59" y2="84" />
            </g>
          </svg>
        </div>
      );

    case 'heavy-rain':
      return (
        <div className={containerClass} title="Kuvvetli Yağmurlu / Sağanak">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="cloudHeavy" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
            </defs>
            <path
              d="M24 60 L76 60 A14 14 0 0 0 76 32 A19 19 0 0 0 32 28 A14 14 0 0 0 24 60 Z"
              fill="url(#cloudHeavy)"
            />
            {/* Yoğun Yağmur Çizgileri */}
            <g stroke="#0284C7" strokeWidth="3.2" strokeLinecap="round">
              <line x1="32" y1="68" x2="26" y2="86" />
              <line x1="44" y1="68" x2="38" y2="89" />
              <line x1="56" y1="68" x2="50" y2="86" />
              <line x1="68" y1="68" x2="62" y2="88" />
            </g>
          </svg>
        </div>
      );

    case 'thunderstorm':
      return (
        <div className={containerClass} title="Gök Gürültülü Fırtına">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="cloudStorm" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
              <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            <path
              d="M24 58 L76 58 A14 14 0 0 0 76 30 A19 19 0 0 0 32 26 A14 14 0 0 0 24 58 Z"
              fill="url(#cloudStorm)"
            />
            {/* Şimşek / Yıldırım */}
            <polygon
              points="48,58 39,74 48,74 42,92 60,70 51,70 57,58"
              fill="url(#boltGrad)"
              className={animate ? 'animate-[pulse_1.2s_ease-in-out_infinite]' : ''}
              filter="drop-shadow(0 0 4px #FBBF24)"
            />
            {/* Yağmur */}
            <line x1="30" y1="66" x2="26" y2="80" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="70" y1="66" x2="66" y2="80" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'snow':
    case 'heavy-snow':
      return (
        <div className={containerClass} title="Karlı">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="cloudSnow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
            </defs>
            <path
              d="M26 62 L74 62 A14 14 0 0 0 74 34 A18 18 0 0 0 34 30 A14 14 0 0 0 26 62 Z"
              fill="url(#cloudSnow)"
            />
            {/* Kar Kristalleri */}
            <g fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round">
              {/* Kar 1 */}
              <g transform="translate(36, 75)">
                <line x1="-5" y1="0" x2="5" y2="0" />
                <line x1="0" y1="-5" x2="0" y2="5" />
                <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" />
                <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" />
              </g>
              {/* Kar 2 */}
              <g transform="translate(52, 82)">
                <line x1="-5" y1="0" x2="5" y2="0" />
                <line x1="0" y1="-5" x2="0" y2="5" />
                <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" />
                <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" />
              </g>
              {/* Kar 3 */}
              <g transform="translate(66, 74)">
                <line x1="-4" y1="0" x2="4" y2="0" />
                <line x1="0" y1="-4" x2="0" y2="4" />
              </g>
            </g>
          </svg>
        </div>
      );

    case 'fog':
      return (
        <div className={containerClass} title="Sisli">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <g stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" opacity="0.9">
              <line x1="22" y1="38" x2="78" y2="38" />
              <line x1="16" y1="52" x2="84" y2="52" strokeWidth="6" />
              <line x1="26" y1="66" x2="74" y2="66" />
              <line x1="34" y1="80" x2="66" y2="80" strokeWidth="4" />
            </g>
          </svg>
        </div>
      );

    case 'sleet':
    default:
      return (
        <div className={containerClass} title="Karla Karışık Yağmur">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="cloudSleet" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>
            <path
              d="M26 62 L74 62 A14 14 0 0 0 74 34 A18 18 0 0 0 34 30 A14 14 0 0 0 26 62 Z"
              fill="url(#cloudSleet)"
            />
            <line x1="34" y1="70" x2="30" y2="84" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="78" r="3" fill="#BAE6FD" />
            <line x1="66" y1="70" x2="62" y2="84" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );
  }
};
