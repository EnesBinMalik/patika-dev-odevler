import React, { useState } from 'react';
import { BankingEngine } from '../services/bankingEngine';
import { Layers, RotateCcw, Users, Clock, ArrowRight, CheckCircle, Ticket, Play, AlertCircle } from 'lucide-react';

interface Module2DataStructuresProps {
  engine: BankingEngine;
  onRefresh: () => void;
}

export const Module2DataStructures: React.FC<Module2DataStructuresProps> = ({ engine, onRefresh }) => {
  const [selectedTicketType, setSelectedTicketType] = useState<'Bireysel' | 'Kurumsal' | 'VIP'>('Bireysel');
  const [lastUndoMessage, setLastUndoMessage] = useState<string | null>(null);

  const undoStack = engine.getUndoStack(); // Top first
  const queueItems = engine.getBranchQueue();
  const activeDesks = engine.getActiveDesks();
  const customers = engine.getCustomers();

  const handleUndo = () => {
    try {
      const res = engine.undoLastTransaction();
      setLastUndoMessage(`Geri alındı: ${res.description}`);
      onRefresh();
      setTimeout(() => setLastUndoMessage(null), 6000);
    } catch (err: unknown) {
      setLastUndoMessage(`Hata: ${(err as Error).message}`);
    }
  };

  const handleEnqueue = () => {
    const randomCust = customers[Math.floor(Math.random() * customers.length)];
    engine.enqueueCustomer(randomCust.id, selectedTicketType);
    onRefresh();
  };

  const handleCallNext = (deskId: number) => {
    engine.callNextCustomer(deskId);
    onRefresh();
  };

  const handleCompleteDesk = (deskId: number) => {
    engine.completeService(deskId);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <span>MODÜL 2</span>
          <span>·</span>
          <span>VERİ YAPILARI</span>
          <span>·</span>
          <span>STACK (LIFO) & QUEUE (FIFO)</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">İşlem Geçmişi ve Bellek Yönetimi</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Finansal hareketler Yığıt (<code className="text-amber-300">Stack&lt;BankTransaction&gt;</code> - LIFO) ile saklanarak
          hatalı işlemler tek tıkla geri alınabilir (Rollback). Şube veznesinde ise Kuyruk (
          <code className="text-cyan-300">Queue&lt;QueueTicket&gt;</code> - FIFO) veri yapısıyla adil ve öncelikli sıra yönetimi sağlanır.
        </p>
      </div>

      {lastUndoMessage && (
        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{lastUndoMessage}</span>
          </div>
          <button onClick={() => setLastUndoMessage(null)} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* 2-Column Split: Stack on Left, Queue on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 1: STACK (LIFO) UNDO ENGINE */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
                LIFO
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">Yığıt (Stack) & Geri Al (Undo)</h3>
                <span className="text-[11px] text-slate-400">Last-In, First-Out İşlem Hafızası</span>
              </div>
            </div>

            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors shadow-sm ${
                undoStack.length > 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Geri Al (Undo / Pop)</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Aktif Yığıt Derinliği: <strong className="text-amber-400">{undoStack.length}</strong></span>
            <span>Bellek Modeli: In-Memory LIFO</span>
          </div>

          {/* Visual Stack Cards */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {undoStack.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs font-mono">
                Yığıt boş. Modül 1 veya Canlı Konsol üzerinden bir para yatırma/çekme işlemi gerçekleştirin.
              </div>
            ) : (
              undoStack.map((tx, idx) => {
                const isTop = idx === 0;
                return (
                  <div
                    key={tx.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isTop
                        ? 'bg-amber-950/20 border-amber-500/40 text-slate-200 ring-1 ring-amber-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-300">[{idx}]</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'Deposit' ? 'bg-emerald-500/20 text-emerald-300' :
                          tx.type === 'Withdrawal' ? 'bg-rose-500/20 text-rose-300' :
                          'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {tx.type}
                        </span>
                        <span className="text-slate-300 font-semibold">{tx.id}</span>
                      </div>
                      {isTop && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                          SP &rarr; TEPE (TOP)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 font-mono text-xs">
                      <span className="text-slate-400">{tx.accountNumber} {tx.targetAccount ? `&rarr; ${tx.targetAccount}` : ''}</span>
                      <span className={`font-bold tabular-nums ${
                        tx.type === 'Deposit' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {tx.type === 'Deposit' ? '+' : '-'}{tx.amount.toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 font-sans">{tx.description}</p>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="text-amber-400 font-semibold">C# Stack Metodu:</span>
            <div className="text-slate-300 mt-1">
              var lastAction = _undoStack.Pop(); <br />
              lastAction.Rollback(accountRegistry);
            </div>
          </div>
        </div>

        {/* PANEL 2: QUEUE (FIFO) BRANCH TELLER DESK */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
                FIFO
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">Kuyruk (Queue) & Şube Veznesi</h3>
                <span className="text-[11px] text-slate-400">First-In, First-Out Gişe Sistemi</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <select
                value={selectedTicketType}
                onChange={(e) => setSelectedTicketType(e.target.value as 'Bireysel' | 'Kurumsal' | 'VIP')}
                className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-slate-200"
              >
                <option value="Bireysel">Bireysel</option>
                <option value="Kurumsal">Kurumsal</option>
                <option value="VIP">VIP</option>
              </select>
              <button
                onClick={handleEnqueue}
                className="px-2.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg font-mono transition-colors shadow-sm flex items-center gap-1"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Fiş Al (Enqueue)</span>
              </button>
            </div>
          </div>

          {/* Active Teller Desks */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 block">Şube Vezneleri (Hizmet Masaları):</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeDesks.map((desk) => {
                const isBusy = desk.currentTicket !== null;
                return (
                  <div
                    key={desk.deskId}
                    className={`p-2.5 rounded-xl border ${
                      isBusy
                        ? 'bg-cyan-950/20 border-cyan-500/40 text-slate-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-white">Vezne #{desk.deskId}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                        isBusy ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isBusy ? 'İşlemde' : 'Boş'}
                      </span>
                    </div>

                    {isBusy && desk.currentTicket ? (
                      <div className="mt-2 space-y-1">
                        <div className="text-xs font-bold text-cyan-400 font-mono">
                          {desk.currentTicket.ticketNumber}
                        </div>
                        <div className="text-[11px] text-slate-300 truncate">
                          {desk.currentTicket.customerName}
                        </div>
                        <button
                          onClick={() => handleCompleteDesk(desk.deskId)}
                          className="w-full mt-1.5 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono transition-colors"
                        >
                          Tamamla & Serbest Bırak
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <p className="text-[10px] text-slate-500">Gişe hazır</p>
                        <button
                          onClick={() => handleCallNext(desk.deskId)}
                          disabled={queueItems.length === 0}
                          className={`w-full mt-1.5 py-1 text-[10px] rounded font-mono transition-colors ${
                            queueItems.length > 0
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
                              : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                          }`}
                        >
                          Sıradakini Çağır &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Waiting Queue List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Sırada Bekleyenler: <strong className="text-cyan-400">{queueItems.length} Müşteri</strong></span>
              <span>FIFO Prensibi (İlk Gelen İlk Hizmet Alır)</span>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {queueItems.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs font-mono">
                  Şu an sırada bekleyen müşteri yok. "Fiş Al" butonuna basarak kuyruğa ekleyin.
                </div>
              ) : (
                queueItems.map((ticket, index) => (
                  <div
                    key={ticket.ticketNumber}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">#{index + 1}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        ticket.ticketType === 'VIP'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : ticket.ticketType === 'Kurumsal'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {ticket.ticketNumber}
                      </span>
                      <span className="text-slate-200">{ticket.customerName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{ticket.issueTime}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
