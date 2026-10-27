import React from 'react';

const REGIONS = [
  'Tümü',
  'Marmara',
  'İç Anadolu',
  'Ege',
  'Akdeniz',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
];

interface RegionsBarProps {
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const RegionsBar: React.FC<RegionsBarProps> = ({
  selectedRegion,
  onSelectRegion,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      <span className="text-xs font-medium text-slate-500 whitespace-nowrap mr-1">
        Bölgeler:
      </span>
      {REGIONS.map((region) => {
        const isActive = selectedRegion === region;
        return (
          <button
            key={region}
            type="button"
            onClick={() => onSelectRegion(region)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              isActive
                ? 'bg-sky-500 text-white font-semibold shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {region}
          </button>
        );
      })}
    </div>
  );
};
