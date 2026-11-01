import { useState } from 'react';
import { Header } from './components/Header';
import { CharacterSelect } from './components/CharacterSelect';
import { PlayerHUD } from './components/PlayerHUD';
import { GameDashboard } from './components/GameDashboard';
import { BattleScreen } from './components/BattleScreen';
import { StoreModal } from './components/StoreModal';
import { HomeworkSpecModal } from './components/HomeworkSpecModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { Character, Inventory, Weapon, Armor } from './types/game';
import { INITIAL_WEAPONS, INITIAL_ARMORS, LocationConfig } from './data/gameData';
import { sound } from './utils/audio';
import { Sparkles, Heart } from 'lucide-react';

type GameState = 'SELECT_CHARACTER' | 'EXPLORING' | 'BATTLE' | 'VICTORY' | 'GAME_OVER';

const INITIAL_INVENTORY: Inventory = {
  weapon: INITIAL_WEAPONS.FIST,
  armor: INITIAL_ARMORS.NONE,
  awards: [],
  clearedLocations: [],
  mineRunsCompleted: 0,
  totalSnakesKilled: 0,
  lootHistory: [],
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('SELECT_CHARACTER');
  const [player, setPlayer] = useState<Character | null>(null);
  const [inventory, setInventory] = useState<Inventory>(INITIAL_INVENTORY);
  const [activeLocation, setActiveLocation] = useState<LocationConfig | null>(null);

  // Modals & UI toggles
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [safeHouseRestNotice, setSafeHouseRestNotice] = useState<string | null>(null);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  const handleSelectCharacter = (selectedChar: Character, adventurerName: string) => {
    setPlayer(selectedChar);
    setInventory({
      ...INITIAL_INVENTORY,
      awards: [],
      clearedLocations: [],
    });
    setGameState('EXPLORING');
  };

  const handleResetGame = () => {
    setPlayer(null);
    setInventory(INITIAL_INVENTORY);
    setActiveLocation(null);
    setIsStoreOpen(false);
    setGameState('SELECT_CHARACTER');
  };

  // Safe House Logic (Requirement 1 win condition + full healing)
  const handleRestInSafeHouse = () => {
    if (!player) return;

    // Check if player has collected all 3 awards (Yemek, Odun, Su)
    const hasYemek = inventory.awards.includes('YEMEK');
    const hasOdun = inventory.awards.includes('ODUN');
    const hasSu = inventory.awards.includes('SU');

    if (hasYemek && hasOdun && hasSu) {
      sound.playVictory();
      setGameState('VICTORY');
      return;
    }

    // Otherwise heal to full max health
    const healedHp = player.maxHealth;
    setPlayer({
      ...player,
      health: healedHp,
    });

    setSafeHouseRestNotice(
      `Güvenli Ev'de dinlendiniz! Canınız tamamen yenilendi (${healedHp}/${healedHp} HP). Kalan ödülleri toplamak için haritayı keşfedin.`
    );
    setTimeout(() => {
      setSafeHouseRestNotice(null), 4000;
    }, 4000);
  };

  // Start battle in location
  const handleEnterLocation = (loc: LocationConfig) => {
    setActiveLocation(loc);
    setGameState('BATTLE');
  };

  // Battle victory & location clearing
  const handleVictoryClear = (locationId: LocationConfig['id']) => {
    setActiveLocation(null);
    setGameState('EXPLORING');
  };

  // Flee from combat back to dashboard
  const handleFlee = () => {
    setActiveLocation(null);
    setGameState('EXPLORING');
  };

  // Buy weapon in shop
  const handleBuyWeapon = (newWeapon: Weapon) => {
    if (!player) return;
    setPlayer({
      ...player,
      money: player.money - newWeapon.price,
    });
    setInventory({
      ...inventory,
      weapon: newWeapon,
    });
  };

  // Buy armor in shop
  const handleBuyArmor = (newArmor: Armor) => {
    if (!player) return;
    setPlayer({
      ...player,
      money: player.money - newArmor.price,
    });
    setInventory({
      ...inventory,
      armor: newArmor,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        onOpenSpecs={() => setIsSpecsOpen(true)}
        onResetGame={handleResetGame}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        playerName={player?.name}
        inGame={gameState !== 'SELECT_CHARACTER'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Character Selection View */}
        {gameState === 'SELECT_CHARACTER' && (
          <CharacterSelect onSelectCharacter={handleSelectCharacter} />
        )}

        {/* Active In-Game Exploration & Dashboard */}
        {gameState === 'EXPLORING' && player && (
          <div className="space-y-6">
            <PlayerHUD player={player} inventory={inventory} />

            {/* Safehouse healing toast notification */}
            {safeHouseRestNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-lg animate-fade-in">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  <span>{safeHouseRestNotice}</span>
                </div>
                <button
                  onClick={() => setSafeHouseRestNotice(null)}
                  className="text-xs text-emerald-400 hover:text-emerald-200 ml-4"
                >
                  Tamam
                </button>
              </div>
            )}

            <GameDashboard
              inventory={inventory}
              onEnterLocation={handleEnterLocation}
              onRestInSafeHouse={handleRestInSafeHouse}
              onOpenStore={() => setIsStoreOpen(true)}
            />
          </div>
        )}

        {/* Combat Encounter View */}
        {gameState === 'BATTLE' && activeLocation && player && (
          <div className="space-y-4">
            <PlayerHUD player={player} inventory={inventory} />
            <BattleScreen
              location={activeLocation}
              player={player}
              inventory={inventory}
              onUpdatePlayer={setPlayer}
              onUpdateInventory={setInventory}
              onVictoryClear={handleVictoryClear}
              onFlee={handleFlee}
              onGameOver={() => setGameState('GAME_OVER')}
            />
          </div>
        )}
      </main>

      {/* Footer with Developer Signature */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-slate-300">Java 102 Macera Oyunu</span>
            <span>·</span>
            <span>Geliştirici: <strong className="text-amber-300 font-medium">Enes Öztürk</strong></span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Ödev 1: Bölge Ödülleri & Kilitlenme</span>
            <span>·</span>
            <span>Ödev 2: %50 İlk Vuruş Şansı</span>
            <span>·</span>
            <span>Ödev 3: Maden & Yılan Ganimeti</span>
          </div>
        </div>
      </footer>

      {/* Tool Store Modal */}
      {player && (
        <StoreModal
          isOpen={isStoreOpen}
          onClose={() => setIsStoreOpen(false)}
          playerMoney={player.money}
          inventory={inventory}
          onBuyWeapon={handleBuyWeapon}
          onBuyArmor={handleBuyArmor}
        />
      )}

      {/* Homework Specifications Modal */}
      <HomeworkSpecModal isOpen={isSpecsOpen} onClose={() => setIsSpecsOpen(false)} />

      {/* Victory Modal */}
      {gameState === 'VICTORY' && player && (
        <VictoryModal
          player={player}
          inventory={inventory}
          onRestart={handleResetGame}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'GAME_OVER' && player && (
        <GameOverModal
          player={player}
          inventory={inventory}
          onRestart={handleResetGame}
        />
      )}
    </div>
  );
}
