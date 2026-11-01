import { useState } from 'react';
import { Swords, Flame, Crown, ArrowRight, ShieldCheck, Coins, Heart, Sparkles } from 'lucide-react';
import { CHARACTERS } from '../data/gameData';
import { Character } from '../types/game';
import { sound } from '../utils/audio';

interface CharacterSelectProps {
  onSelectCharacter: (character: Character, playerName: string) => void;
}

export function CharacterSelect({ onSelectCharacter }: CharacterSelectProps) {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [playerName, setPlayerName] = useState<string>('Enes');

  const selectedChar = CHARACTERS.find((c) => c.id === selectedId) || CHARACTERS[0];

  const handleStart = () => {
    sound.playLootFanfare();
    const finalName = playerName.trim() || selectedChar.name;
    const charInstance: Character = {
      ...selectedChar,
      name: finalName,
      health: selectedChar.health,
      maxHealth: selectedChar.health,
    };
    onSelectCharacter(charInstance, finalName);
  };

  const getCharacterIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Swords className="w-8 h-8 text-amber-400" />;
      case 2:
        return <Flame className="w-8 h-8 text-orange-400" />;
      case 3:
        return <Crown className="w-8 h-8 text-blue-400" />;
      default:
        return <Swords className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Title & Introduction */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Java 102 Macera Oyunu · Enes Öztürk Özel Sürümü
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-amber-100 mb-2">
          Karakterini Seç & Maceraya Atıl
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Tehlikeli topraklarda hayatta kalabilmek için savaşçını belirle. Mağara, Orman ve Nehir'deki
          düşmanları alt ederek bölge ödüllerini topla, Maden'de ganimet avına çık!
        </p>
      </div>

      {/* Name Input */}
      <div className="max-w-md mx-auto mb-8 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
        <label htmlFor="adventurer-name" className="block text-xs font-medium text-slate-300 mb-1.5">
          Maceracı Adı
        </label>
        <input
          id="adventurer-name"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="İsminizi girin..."
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          maxLength={20}
        />
      </div>

      {/* Character Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {CHARACTERS.map((char) => {
          const isSelected = char.id === selectedId;
          return (
            <div
              key={char.id}
              onClick={() => {
                sound.playAttack();
                setSelectedId(char.id);
              }}
              className={`relative cursor-pointer rounded-xl p-5 border transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-900 border-amber-500/80 ring-2 ring-amber-500/20 shadow-xl shadow-amber-950/20 scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  {getCharacterIcon(char.id)}
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400">ID: {char.id}</span>
                  <div className="text-xs text-amber-400 font-medium">{char.title}</div>
                </div>
              </div>

              <h3 className="font-serif font-bold text-xl text-slate-100 mb-1">{char.name}</h3>
              <p className="text-xs text-slate-400 mb-4 min-h-[36px]">{char.description}</p>

              {/* Stats Box */}
              <div className="space-y-2 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5 text-orange-400" /> Hasar
                  </span>
                  <span className="font-mono font-bold text-slate-200">{char.damage}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-red-400" /> Sağlık
                  </span>
                  <span className="font-mono font-bold text-slate-200">{char.health} HP</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" /> Başlangıç Altını
                  </span>
                  <span className="font-mono font-bold text-amber-300">{char.money} Para</span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 flex items-center justify-center gap-1 text-xs text-amber-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Seçili Savaşçı
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button
          onClick={handleStart}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <span>{selectedChar.name} ile Maceraya Başla</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
