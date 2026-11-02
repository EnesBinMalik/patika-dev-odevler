import React, { useState } from 'react';
import {
  Send,
  ArrowRight,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Coins,
  KeyRound,
  FileCheck2,
} from 'lucide-react';
import { AssignmentMode, TokenAccount, TransactionReceipt } from '../types';
import { DEFAULT_SOURCE_ACCOUNT, DEFAULT_DEST_ACCOUNT } from '../data/assignmentData';

interface TokenTransferSimulatorProps {
  currentMode: AssignmentMode;
  onSelectMode: (mode: AssignmentMode) => void;
}

export const TokenTransferSimulator: React.FC<TokenTransferSimulatorProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const [sourceAccount, setSourceAccount] = useState<TokenAccount>({ ...DEFAULT_SOURCE_ACCOUNT });
  const [destAccount, setDestAccount] = useState<TokenAccount>({ ...DEFAULT_DEST_ACCOUNT });
  const [customAmount, setCustomAmount] = useState<number>(50);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [lastReceipt, setLastReceipt] = useState<TransactionReceipt | null>(null);
  const [history, setHistory] = useState<TransactionReceipt[]>([]);
  const [selectedTx, setSelectedTx] = useState<TransactionReceipt | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compute active transfer amount based on assignment mode
  const effectiveAmount =
    currentMode === 'initial'
      ? sourceAccount.amount // Hatalı eski durum: Tüm bakiye
      : currentMode === 'step1'
      ? 50 // Adım 1: Sabit kodlanmış 50
      : customAmount; // Opsiyonel: Kullanıcı girdisi

  const handleResetAccounts = () => {
    setSourceAccount({ ...DEFAULT_SOURCE_ACCOUNT });
    setDestAccount({ ...DEFAULT_DEST_ACCOUNT });
    setCustomAmount(50);
    setErrorMsg(null);
    setLastReceipt(null);
  };

  const handleExecuteTransfer = () => {
    setErrorMsg(null);

    if (effectiveAmount <= 0) {
      setErrorMsg('Hata: Transfer miktarı sıfırdan büyük olmalıdır (InvalidAmount).');
      return;
    }

    if (sourceAccount.amount < effectiveAmount) {
      setErrorMsg(`Hata: Yetersiz Bakiye! Kaynak kasada ${sourceAccount.amount} token var, talep edilen: ${effectiveAmount}.`);
      return;
    }

    setIsTransferring(true);

    setTimeout(() => {
      const sourceOld = sourceAccount.amount;
      const destOld = destAccount.amount;
      const sourceNew = sourceOld - effectiveAmount;
      const destNew = destOld + effectiveAmount;

      const randomHash = Array.from({ length: 44 }, () =>
        '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'.charAt(
          Math.floor(Math.random() * 58)
        )
      ).join('');

      const signature = `5Enes${randomHash.slice(0, 36)}Ozturk`;

      const receipt: TransactionReceipt = {
        signature,
        slot: 284910234 + history.length,
        timestamp: new Date().toLocaleTimeString('tr-TR'),
        fromPubkey: sourceAccount.pubkey,
        toPubkey: destAccount.pubkey,
        amount: effectiveAmount,
        symbol: sourceAccount.symbol,
        fee: 0.000005,
        status: 'confirmed',
        signer: 'Enes Öztürk',
        signerNote: 'Ed25519 Dijital İmzası Başarıyla Doğrulandı',
        instruction: 'token_transfer::transfer_tokens',
        sourceOldBalance: sourceOld,
        sourceNewBalance: sourceNew,
        destOldBalance: destOld,
        destNewBalance: destNew,
      };

      setSourceAccount((prev) => ({ ...prev, amount: sourceNew }));
      setDestAccount((prev) => ({ ...prev, amount: destNew }));
      setLastReceipt(receipt);
      setHistory((prev) => [receipt, ...prev]);
      setIsTransferring(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector and Context Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <Coins className="w-3.5 h-3.5" />
            <span>SOLANA TOKEN TRANSFER PLATFORMU</span>
          </div>
          <h2 className="text-base font-bold text-white mt-1">
            Canlı İşlem ve Bakiye Simülatörü
          </h2>
          <p className="text-xs text-slate-400">
            Kaynak hesaptan hedef hesaba token transferini gerçekleştirin, Enes Öztürk imzasını doğrulayın.
          </p>
        </div>

        {/* Mode pill toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => onSelectMode('step1')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              currentMode === 'step1'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Adım 1 (Sabit 50)
          </button>
          <button
            onClick={() => onSelectMode('optional')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              currentMode === 'optional'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Opsiyonel (Girdi + İmza)
          </button>
          <button
            onClick={() => onSelectMode('initial')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              currentMode === 'initial'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Önceki (Tüm Bakiye)
          </button>
        </div>
      </div>

      {/* Warning if initial mode is selected */}
      {currentMode === 'initial' && (
        <div className="p-3.5 bg-red-950/40 border border-red-900/60 rounded-xl flex items-start gap-3 text-xs text-red-200">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <strong>Dikkat: Önceki Hatalı Mantık Aktif!</strong>
            <p className="text-red-300/80 mt-0.5">
              Kod <code className="bg-red-900/40 px-1 py-0.5 rounded font-mono">let amount = source_account.amount;</code> olarak çalıştığı için transfer butonuna basıldığında kaynak hesabın TÜM bakiyesi ({sourceAccount.amount} token) bir defada aktarılır.
            </p>
          </div>
        </div>
      )}

      {/* Visual Account Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Account (Enes Öztürk) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              <Wallet className="w-3.5 h-3.5" />
              <span>Kaynak Hesap (Source)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">SPL Token Account</span>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">{sourceAccount.name}</div>
            <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5" title={sourceAccount.pubkey}>
              Pubkey: {sourceAccount.pubkey}
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800/80 flex items-baseline justify-between">
            <span className="text-xs text-slate-400">Mevcut Bakiye:</span>
            <div className="text-right">
              <span className="text-3xl font-bold font-mono text-white tabular-nums">
                {sourceAccount.amount.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-cyan-400 ml-2 font-semibold">
                {sourceAccount.symbol}
              </span>
            </div>
          </div>

          {/* Signer Info */}
          <div className="p-2.5 bg-indigo-950/30 rounded-lg border border-indigo-900/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-300">Yetkili / İmzalayan:</span>
            </div>
            <span className="font-semibold text-indigo-300">Enes Öztürk (Signer)</span>
          </div>
        </div>

        {/* Destination Account (Recipient) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              <Wallet className="w-3.5 h-3.5" />
              <span>Hedef Hesap (Destination)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Recipient Token Account</span>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">{destAccount.name}</div>
            <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5" title={destAccount.pubkey}>
              Pubkey: {destAccount.pubkey}
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800/80 flex items-baseline justify-between">
            <span className="text-xs text-slate-400">Mevcut Bakiye:</span>
            <div className="text-right">
              <span className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                {destAccount.amount.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-emerald-300 ml-2 font-semibold">
                {destAccount.symbol}
              </span>
            </div>
          </div>

          {/* Status info */}
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Hesap Durumu:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Aktif & Doğrulanmış
            </span>
          </div>
        </div>
      </div>

      {/* Transfer Execution Control Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white">Transfer Parametreleri</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentMode === 'step1'
                ? 'Adım 1 Modu: Miktar sözleşme içinde sabit 50 olarak kodlanmıştır.'
                : currentMode === 'optional'
                ? 'Opsiyonel Mod: Miktarı serbestçe girin. Enes Öztürk imzasıyla aktarılır.'
                : 'Önceki Mod: Kaynak hesabın tüm bakiyesi aktarılır.'}
            </p>
          </div>

          <button
            onClick={handleResetAccounts}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Bakiyeleri Sıfırla</span>
          </button>
        </div>

        {/* Amount Input and Presets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <label className="block text-xs font-medium text-slate-300">
              Transfer Edilecek Token Miktarı:
            </label>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max={sourceAccount.amount}
                  disabled={currentMode !== 'optional' || isTransferring}
                  value={effectiveAmount}
                  onChange={(e) => setCustomAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 font-mono text-lg text-white tabular-nums focus:outline-none transition-colors ${
                    currentMode === 'optional'
                      ? 'border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      : 'border-slate-800 opacity-80 cursor-not-allowed'
                  }`}
                />
                <span className="absolute right-4 top-3 text-xs font-mono font-bold text-slate-400">
                  {sourceAccount.symbol}
                </span>
              </div>

              {/* Presets if Optional mode */}
              {currentMode === 'optional' && (
                <div className="flex items-center gap-1.5">
                  {[25, 50, 100, 200].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCustomAmount(preset)}
                      className="px-2.5 py-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
                    >
                      +{preset}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomAmount(sourceAccount.amount)}
                    className="px-2.5 py-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-lg transition-colors font-semibold"
                  >
                    Maks
                  </button>
                </div>
              )}
            </div>

            {currentMode === 'step1' && (
              <p className="text-[11px] text-cyan-400">
                ✓ Adım 1 gereğince <code className="font-mono font-bold">let amount: u64 = 50;</code> sabit tanımlıdır.
              </p>
            )}
            {currentMode === 'optional' && (
              <p className="text-[11px] text-indigo-400">
                ✓ Opsiyonel gereğince kullanıcıdan dinamik girdi alınır ve Enes Öztürk imzasıyla onaylanır.
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleExecuteTransfer}
              disabled={isTransferring || sourceAccount.amount <= 0}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                currentMode === 'initial'
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-950/50'
                  : currentMode === 'step1'
                  ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-950/50'
                  : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-950/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isTransferring ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Solana İşlemi İmzalanıyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {currentMode === 'initial'
                      ? `Tüm Bakiyeyi (${effectiveAmount}) Aktar`
                      : `${effectiveAmount} ${sourceAccount.symbol} Transfer Et (Enes Öztürk İmzalı)`}
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Yetkili: <strong>Enes Öztürk</strong> · Ed25519 On-Chain Signer</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/50 border border-red-900 rounded-lg text-xs text-red-300 font-mono">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Latest Transaction Confirmation Card */}
      {lastReceipt && (
        <div className="bg-slate-900/60 border border-emerald-900/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>İşlem Başarıyla Onaylandı</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{lastReceipt.timestamp}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">Aktarılan Miktar</span>
              <span className="text-base font-bold text-white font-mono">
                {lastReceipt.amount} {lastReceipt.symbol}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">İmzalayan (Authority)</span>
              <span className="text-base font-bold text-indigo-300 font-mono">
                {lastReceipt.signer}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">İşlem Ücreti (Fee)</span>
              <span className="text-base font-bold text-slate-300 font-mono">
                {lastReceipt.fee} SOL
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">Solana Slot</span>
              <span className="text-base font-bold text-slate-300 font-mono">
                #{lastReceipt.slot}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="text-slate-400 truncate">
              <span className="text-slate-500 mr-2">Signature:</span>
              <span className="text-cyan-400">{lastReceipt.signature}</span>
            </div>
            <button
              onClick={() => setSelectedTx(lastReceipt)}
              className="flex items-center gap-1 text-slate-300 hover:text-white shrink-0 underline"
            >
              <span>Program Loglarını İncele</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Transaction Explorer Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-white font-sans">
                  Solana On-Chain İşlem Makbuzu
                </span>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                ✕ Kapat
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-500 block mb-0.5">Transaction Signature</span>
                <span className="text-cyan-300 break-all bg-slate-900 p-2 rounded block">
                  {selectedTx.signature}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-2.5 rounded">
                  <span className="text-slate-500 block">İmzalayan (Authority)</span>
                  <span className="text-indigo-300 font-bold">{selectedTx.signer}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded">
                  <span className="text-slate-500 block">İmza Doğrulama Notu</span>
                  <span className="text-emerald-400">{selectedTx.signerNote}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Anchor Program Logları (stdout)</span>
                <div className="bg-slate-900 p-3 rounded space-y-1 text-slate-300 font-mono text-[11px] leading-relaxed">
                  <div className="text-slate-500">Program EnesTransfer111111111111111111111111111111 invoke [1]</div>
                  <div className="text-cyan-400">Program log: Instruction: TransferTokens</div>
                  <div className="text-indigo-300">Program log: Yetkili İmza Doğrulandı: Enes Öztürk (Pubkey: EnesÖztürk8fR1w...)</div>
                  <div className="text-emerald-400">Program log: Transfer Başarılı! Miktar: {selectedTx.amount} token.</div>
                  <div className="text-slate-500">Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]</div>
                  <div className="text-slate-500">Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success</div>
                  <div className="text-emerald-400 font-bold">Program EnesTransfer111111111111111111111111111111 success</div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-[11px] space-y-1">
                <div className="text-slate-400">Kaynak Bakiye: <strong className="text-white">{selectedTx.sourceOldBalance}</strong> → <strong className="text-cyan-400">{selectedTx.sourceNewBalance}</strong> {selectedTx.symbol}</div>
                <div className="text-slate-400">Hedef Bakiye: <strong className="text-white">{selectedTx.destOldBalance}</strong> → <strong className="text-emerald-400">{selectedTx.destNewBalance}</strong> {selectedTx.symbol}</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-sans"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
