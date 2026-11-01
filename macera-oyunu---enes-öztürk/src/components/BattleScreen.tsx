import { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Shield,
  Heart,
  Coins,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Trophy,
  Dices,
  CheckCircle2,
} from 'lucide-react';
import { LocationConfig } from '../data/gameData';
import { Character, Inventory, BattleLogEntry, Weapon, Armor } from '../types/game';
import { rollSnakeLoot, SnakeLootDrop } from '../utils/lootTable';
import { sound } from '../utils/audio';

interface BattleScreenProps {
  location: LocationConfig;
  player: Character;
  inventory: Inventory;
  onUpdatePlayer: (updated: Character) => void;
  onUpdateInventory: (updated: Inventory) => void;
  onVictoryClear: (locationId: LocationConfig['id']) => void;
  onFlee: () => void;
  onGameOver: () => void;
}

interface ActiveMonster {
  index: number;
  id: number;
  name: string;
  health: number;
  maxHealth: number;
  minDamage: number;
  maxDamage: number;
  money: number;
  isSnake: boolean;
}

export function BattleScreen({
  location,
  player,
  inventory,
  onUpdatePlayer,
  onUpdateInventory,
  onVictoryClear,
  onFlee,
  onGameOver,
}: BattleScreenProps) {
  // Number of monsters in this encounter
  const [totalMonstersCount] = useState<number>(() => {
    const min = location.minMonsters || 1;
    const max = location.maxMonsters || 3;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  });

  const [currentMonsterIndex, setCurrentMonsterIndex] = useState<number>(1);
  const [activeMonster, setActiveMonster] = useState<ActiveMonster | null>(null);

  // Combat states
  const [isRollingInitiative, setIsRollingInitiative] = useState<boolean>(true);
  const [initiativeWinner, setInitiativeWinner] = useState<'PLAYER' | 'MONSTER' | null>(null);
  const [isProcessingTurn, setIsProcessingTurn] = useState<boolean>(false);
  const [combatFinished, setCombatFinished] = useState<boolean>(false);
  const [locationCleared, setLocationCleared] = useState<boolean>(false);

  // Latest loot drop modal / announcement
  const [activeLootDrop, setActiveLootDrop] = useState<SnakeLootDrop | null>(null);
  const [lootHistory, setLootHistory] = useState<SnakeLootDrop[]>([]);

  // Battle logs
  const [logs, setLogs] = useState<BattleLogEntry[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (
    text: string,
    type: BattleLogEntry['type'] = 'info'
  ) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        text,
        type,
        timestamp: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Spawn monster helper
  const spawnMonster = (index: number) => {
    const cfg = location.monsterConfig;
    if (!cfg) return;

    const monster: ActiveMonster = {
      index,
      id: cfg.id,
      name: `${cfg.name} #${index}`,
      health: cfg.health,
      maxHealth: cfg.health,
      minDamage: cfg.minDamage,
      maxDamage: cfg.maxDamage,
      money: cfg.money,
      isSnake: !!cfg.isSnake,
    };

    setActiveMonster(monster);
    setIsRollingInitiative(true);
    setInitiativeWinner(null);

    addLog(
      `⚔️ ${location.name} bölgesinde ${monster.name} belirdi! Sağlık: ${monster.health} HP`,
      'info'
    );

    // Roll 50% initiative
    performInitiativeRoll(monster);
  };

  // Requirement 2: 50% chance for who strikes first
  const performInitiativeRoll = (monster: ActiveMonster) => {
    sound.playInitiative();
    setIsProcessingTurn(true);

    setTimeout(() => {
      const roll = Math.random();
      const playerFirst = roll < 0.5;
      const winner = playerFirst ? 'PLAYER' : 'MONSTER';
      setInitiativeWinner(winner);
      setIsRollingInitiative(false);

      if (playerFirst) {
        addLog(
          `🎲 İnisiyatif Zarı (%50 Şans): İlk vuruşu OYUNCU kazandı! (Zar: ${(roll * 100).toFixed(0)}%)`,
          'initiative'
        );
        setIsProcessingTurn(false);
      } else {
        addLog(
          `🎲 İnisiyatif Zarı (%50 Şans): İlk vuruşu CANAVAR (${monster.name}) kazandı! (Zar: ${(roll * 100).toFixed(0)}%)`,
          'initiative'
        );

        // Monster takes immediate first strike!
        setTimeout(() => {
          monsterStrike(monster, true);
        }, 800);
      }
    }, 700);
  };

  // Initialize first monster on mount
  useEffect(() => {
    addLog(
      `🗺️ ${location.name} bölgesine giriş yapıldı! Bu bölgede toplam ${totalMonstersCount} adet ${location.monsterConfig?.name} var.`,
      'info'
    );
    spawnMonster(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Monster attack logic
  const monsterStrike = (monster: ActiveMonster, isInitiativeStrike = false) => {
    if (monster.health <= 0) return;

    // Calculate monster damage:
    // If snake: random between 3 and 6
    let baseDamage = monster.minDamage;
    if (monster.isSnake) {
      sound.playSnakeHiss();
      baseDamage = Math.floor(Math.random() * (monster.maxDamage - monster.minDamage + 1)) + monster.minDamage;
    } else {
      sound.playMonsterHit();
    }

    const armorBlock = inventory.armor.block;
    const finalDamage = Math.max(0, baseDamage - armorBlock);
    const newPlayerHealth = Math.max(0, player.health - finalDamage);

    const strikePrefix = isInitiativeStrike ? '⚡ İLK HAMLE: ' : '';
    const blockText = armorBlock > 0 ? ` (${inventory.armor.name} ${armorBlock} engelledi)` : '';

    addLog(
      `${strikePrefix}${monster.name} saldırdı! Hasar: ${baseDamage}${blockText} ➔ Sana ${finalDamage} hasar verdi.`,
      'monster_hit'
    );

    const updatedPlayer: Character = {
      ...player,
      health: newPlayerHealth,
    };
    onUpdatePlayer(updatedPlayer);

    if (newPlayerHealth <= 0) {
      sound.playGameOver();
      addLog(`💀 Canın tükendi! ${monster.name} tarafından mağlup edildin...`, 'danger');
      setCombatFinished(true);
      setTimeout(() => {
        onGameOver();
      }, 1200);
    } else {
      setIsProcessingTurn(false);
    }
  };

  // Player attack logic
  const handlePlayerAttack = () => {
    if (!activeMonster || isProcessingTurn || combatFinished) return;
    setIsProcessingTurn(true);

    sound.playAttack();
    const totalPlayerDamage = player.damage + inventory.weapon.damage;
    const newMonsterHealth = Math.max(0, activeMonster.health - totalPlayerDamage);

    addLog(
      `🗡️ ${player.name} (${inventory.weapon.name}) ile saldırdı! ${activeMonster.name}'a ${totalPlayerDamage} hasar verdin.`,
      'player_hit'
    );

    const updatedMonster: ActiveMonster = {
      ...activeMonster,
      health: newMonsterHealth,
    };
    setActiveMonster(updatedMonster);

    if (newMonsterHealth <= 0) {
      // Monster defeated!
      handleMonsterDefeated(updatedMonster);
    } else {
      // Monster counter-attacks
      setTimeout(() => {
        monsterStrike(updatedMonster, false);
      }, 650);
    }
  };

  // Handle defeat of an individual monster
  const handleMonsterDefeated = (defeatedMonster: ActiveMonster) => {
    sound.playCoin();
    addLog(`✨ ${defeatedMonster.name} alt edildi!`, 'victory');

    // Check for Snake Loot Drop (Requirement 3)
    if (defeatedMonster.isSnake) {
      const drop = rollSnakeLoot();
      setActiveLootDrop(drop);
      setLootHistory((prev) => [...prev, drop]);

      if (drop.type === 'nothing') {
        addLog(`🐍 Yılan Ganimeti: ${drop.title} (${drop.rollSummary})`, 'info');
      } else if (drop.type === 'money' && drop.money) {
        sound.playCoin();
        const updatedPlayer: Character = {
          ...player,
          money: player.money + drop.money,
        };
        onUpdatePlayer(updatedPlayer);
        addLog(
          `💰 Yılan Ganimeti: ${drop.title} (+${drop.money} Altın Envantere Eklendi!) [${drop.rollSummary}]`,
          'loot'
        );
      } else if (drop.type === 'weapon' && drop.weapon) {
        sound.playLootFanfare();
        addLog(
          `⚔️ Yılan Ganimeti: ${drop.title} (+${drop.weapon.damage} Hasar) [${drop.rollSummary}]`,
          'loot'
        );
      } else if (drop.type === 'armor' && drop.armor) {
        sound.playLootFanfare();
        addLog(
          `🛡️ Yılan Ganimeti: ${drop.title} (+${drop.armor.block} Engelleme) [${drop.rollSummary}]`,
          'loot'
        );
      }

      // Record snake kill count
      onUpdateInventory({
        ...inventory,
        totalSnakesKilled: (inventory.totalSnakesKilled || 0) + 1,
      });
    } else {
      // Regular monster money drop
      const updatedPlayer: Character = {
        ...player,
        money: player.money + defeatedMonster.money,
      };
      onUpdatePlayer(updatedPlayer);
      addLog(`💰 ${defeatedMonster.money} altın topladın!`, 'loot');
    }

    // Check if more monsters in wave
    if (currentMonsterIndex < totalMonstersCount) {
      setTimeout(() => {
        const nextIdx = currentMonsterIndex + 1;
        setCurrentMonsterIndex(nextIdx);
        spawnMonster(nextIdx);
        setIsProcessingTurn(false);
      }, 900);
    } else {
      // ALL MONSTERS IN THIS REGION CLEARED! (Requirement 1)
      handleWaveClear();
    }
  };

  // Equip weapon or armor dropped by snake
  const handleEquipDroppedItem = (drop: SnakeLootDrop) => {
    if (drop.weapon) {
      sound.playLootFanfare();
      onUpdateInventory({
        ...inventory,
        weapon: drop.weapon,
      });
      addLog(`Equipped: ${drop.weapon.name} kuşanıldı! (+${drop.weapon.damage} Hasar)`, 'loot');
    } else if (drop.armor) {
      sound.playLootFanfare();
      onUpdateInventory({
        ...inventory,
        armor: drop.armor,
      });
      addLog(`Equipped: ${drop.armor.name} kuşanıldı! (+${drop.armor.block} Engelleme)`, 'loot');
    }
    setActiveLootDrop(null);
  };

  // Requirement 1: Complete wave cleared!
  const handleWaveClear = () => {
    sound.playVictory();
    setCombatFinished(true);
    setLocationCleared(true);
    setIsProcessingTurn(false);

    if (location.award) {
      const awardType = location.award;
      const awardTurkish =
        awardType === 'YEMEK' ? 'Yemek (Food)' : awardType === 'ODUN' ? 'Odun (Firewood)' : 'Su (Water)';

      addLog(
        `🏆 BÖLGE TEMİZLENDİ! Tebrikler, tüm düşmanları alt ettin.`,
        'victory'
      );
      addLog(
        `🎁 ÖDÜL KAZANILDI: Envanterine "${awardTurkish}" eklendi!`,
        'award'
      );
      addLog(
        `🔒 Bu bölge artık kilitlendi ve tekrar giriş yapılamaz.`,
        'info'
      );

      // Add award and mark cleared
      const updatedAwards = inventory.awards.includes(awardType)
        ? inventory.awards
        : [...inventory.awards, awardType];

      const updatedCleared = inventory.clearedLocations.includes(location.id)
        ? inventory.clearedLocations
        : [...inventory.clearedLocations, location.id];

      onUpdateInventory({
        ...inventory,
        awards: updatedAwards,
        clearedLocations: updatedCleared,
      });

      onVictoryClear(location.id);
    } else if (location.id === 'MINE') {
      // Mine cleared
      addLog(`🏆 Maden bölgesindeki tüm yılanları temizledin!`, 'victory');
      onUpdateInventory({
        ...inventory,
        mineRunsCompleted: (inventory.mineRunsCompleted || 0) + 1,
      });
    }
  };

  const monsterHpPercent = activeMonster
    ? Math.max(0, Math.min(100, (activeMonster.health / activeMonster.maxHealth) * 100))
    : 0;

  const playerHpPercent = Math.max(
    0,
    Math.min(100, (player.health / player.maxHealth) * 100)
  );

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 space-y-4">
      {/* Top Banner with Location and Monster Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onFlee}
            disabled={isProcessingTurn || isRollingInitiative}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 disabled:opacity-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kaç (Haritaya Dön)</span>
          </button>
          <div>
            <h2 className="font-serif font-bold text-lg text-amber-100 flex items-center gap-2">
              <span>{location.name} Savaş Alanı</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Dalga: {currentMonsterIndex} / {totalMonstersCount} Canavar
              </span>
            </h2>
            <p className="text-xs text-slate-400">{location.tagline}</p>
          </div>
        </div>

        {/* 50% initiative indicator status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
            <Dices className="w-4 h-4 text-amber-400" />
            {isRollingInitiative ? (
              <span className="text-amber-300 animate-pulse">İnisiyatif Belirleniyor (%50)...</span>
            ) : initiativeWinner === 'PLAYER' ? (
              <span className="text-emerald-400 font-semibold">İlk Vuran: Oyuncu (%50)</span>
            ) : (
              <span className="text-red-400 font-semibold">İlk Vuran: Canavar (%50)</span>
            )}
          </div>
        </div>
      </div>

      {/* Duel Arena View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-mono text-amber-400/80 uppercase">Maceracı</span>
              <h3 className="font-serif font-bold text-xl text-slate-100">{player.name}</h3>
              <p className="text-xs text-slate-400">
                {inventory.weapon.name} & {inventory.armor.name}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-red-400">
                {player.health} / {player.maxHealth} HP
              </span>
            </div>
          </div>

          {/* Health bar */}
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 mb-4">
            <div
              className={`h-full transition-all duration-300 ${
                playerHpPercent > 50
                  ? 'bg-emerald-500'
                  : playerHpPercent > 25
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${playerHpPercent}%` }}
            />
          </div>

          {/* Combat Stats */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/80">
            <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Toplam Hasar</div>
              <div className="text-sm font-bold font-mono text-orange-300">
                {player.damage + inventory.weapon.damage}
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Engelleme</div>
              <div className="text-sm font-bold font-mono text-blue-300">
                +{inventory.armor.block}
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Altın</div>
              <div className="text-sm font-bold font-mono text-amber-300">
                {player.money} Para
              </div>
            </div>
          </div>
        </div>

        {/* Monster Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
          {activeMonster ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[11px] font-mono text-red-400/80 uppercase">
                    Düşman #{currentMonsterIndex}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-red-100 flex items-center gap-2">
                    {activeMonster.name}
                    {activeMonster.isSnake && (
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 font-mono border border-purple-500/30">
                        Zehirli Yılan
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeMonster.isSnake
                      ? 'Hasar: 3-6 (Rastgele) · Ganimet Bırakır'
                      : `Hasar: ${activeMonster.minDamage} · Düşecek Altın: ${activeMonster.money}`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-red-400">
                    {activeMonster.health} / {activeMonster.maxHealth} HP
                  </span>
                </div>
              </div>

              {/* Health bar */}
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 mb-4">
                <div
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${monsterHpPercent}%` }}
                />
              </div>

              {/* Monster Stats */}
              <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-800/80">
                <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Saldırı Gücü</div>
                  <div className="text-sm font-bold font-mono text-red-400">
                    {activeMonster.isSnake
                      ? '3 ~ 6 (Rastgele)'
                      : `${activeMonster.minDamage} Hasar`}
                  </div>
                </div>
                <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Ödül / Ganimet</div>
                  <div className="text-sm font-bold font-mono text-amber-400">
                    {activeMonster.isSnake ? 'Silah / Zırh / Para' : `${activeMonster.money} Altın`}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Canavar bekleniyor...
            </div>
          )}
        </div>
      </div>

      {/* Snake Loot Drop Popup / Modal if item dropped */}
      {activeLootDrop && (
        <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/60 border border-purple-500/40 rounded-xl p-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-amber-200">
                    Maden Ganimeti: {activeLootDrop.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 font-mono border border-purple-700/40">
                    Ödev 3 Şansı
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{activeLootDrop.description}</p>
                <p className="text-[11px] font-mono text-slate-400">{activeLootDrop.rollSummary}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeLootDrop.weapon && (
                <button
                  onClick={() => handleEquipDroppedItem(activeLootDrop)}
                  className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Kuşan (+{activeLootDrop.weapon.damage} Hasar)</span>
                </button>
              )}
              {activeLootDrop.armor && (
                <button
                  onClick={() => handleEquipDroppedItem(activeLootDrop)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Kuşan (+{activeLootDrop.armor.block} Engelleme)</span>
                </button>
              )}
              <button
                onClick={() => setActiveLootDrop(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {locationCleared ? (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>
                {location.name} başarıyla temizlendi!{' '}
                {location.award
                  ? `"${location.award === 'YEMEK' ? 'Yemek' : location.award === 'ODUN' ? 'Odun' : 'Su'}" ödülü kazanıldı ve bu bölge kilitlendi.`
                  : 'Maden temizlendi ve ganimetler toplandı.'}
              </span>
            </div>
            <button
              onClick={() => onVictoryClear(location.id)}
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
            >
              Haritaya Dön
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayerAttack}
                disabled={isProcessingTurn || isRollingInitiative || combatFinished}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <Swords className="w-4 h-4" />
                <span>Vur (Saldır)</span>
              </button>

              <button
                onClick={onFlee}
                disabled={isProcessingTurn || isRollingInitiative || combatFinished}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kaç</span>
              </button>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>
                {isRollingInitiative
                  ? 'İlk hamle için zar atılıyor...'
                  : isProcessingTurn
                  ? 'Hamle hesaplanıyor...'
                  : 'Sıra sizde! Saldırmak için "Vur" butonuna tıklayın.'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Combat Log Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Savaş Günlüğü
          </span>
          <span className="text-[11px] text-slate-500">
            {logs.length} kayıt
          </span>
        </div>
        <div
          ref={logContainerRef}
          className="h-44 overflow-y-auto space-y-1.5 font-mono text-xs pr-2 scrollbar-thin scrollbar-thumb-slate-800"
        >
          {logs.map((log) => {
            let color = 'text-slate-300';
            if (log.type === 'player_hit') color = 'text-emerald-300';
            if (log.type === 'monster_hit') color = 'text-red-300';
            if (log.type === 'loot') color = 'text-amber-300 font-bold';
            if (log.type === 'award') color = 'text-purple-300 font-bold';
            if (log.type === 'initiative') color = 'text-cyan-300';
            if (log.type === 'danger') color = 'text-red-400 font-bold';
            if (log.type === 'victory') color = 'text-emerald-400 font-bold';

            return (
              <div key={log.id} className={`${color} leading-relaxed flex items-start gap-2`}>
                <span className="text-slate-600 select-none">›</span>
                <span>{log.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
