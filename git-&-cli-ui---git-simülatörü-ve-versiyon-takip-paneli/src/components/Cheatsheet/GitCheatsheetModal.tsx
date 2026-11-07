import React from 'react';
import { X, BookOpen, Terminal, Sparkles, Copy, Check } from 'lucide-react';

interface GitCheatsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunCommand: (command: string) => void;
}

interface CommandItem {
  cmd: string;
  desc: string;
  category: string;
}

const CHEATSHEET_DATA: CommandItem[] = [
  { cmd: 'git init', desc: 'Mevcut dizinde yeni bir Git deposu başlatır.', category: 'Kurulum' },
  { cmd: 'git status', desc: 'Çalışma alanı ve hazırlık alanındaki durumları listeler.', category: 'Temel' },
  { cmd: 'git add .', desc: 'Tüm yeni ve değiştirilmiş dosyaları hazırlık (stage) alanına alır.', category: 'Temel' },
  { cmd: 'git add <dosya>', desc: 'Belirtilen tek bir dosyayı hazırlık alanına ekler.', category: 'Temel' },
  { cmd: 'git commit -m "mesaj"', desc: 'Hazırlık alanındaki dosyaları yeni bir commit olarak kaydeder.', category: 'Temel' },
  { cmd: 'git commit -am "mesaj"', desc: 'Takip edilen tüm değiştirilmiş dosyaları otomatik stage edip commitler.', category: 'Temel' },
  { cmd: 'git branch', desc: 'Mevcut yerel dalları listeler.', category: 'Dallanma (Branching)' },
  { cmd: 'git branch <dal_adı>', desc: 'Mevcut commit üzerinde yeni bir dal oluşturur.', category: 'Dallanma (Branching)' },
  { cmd: 'git checkout <dal_adı>', desc: 'Belirtilen dala geçiş yapar.', category: 'Dallanma (Branching)' },
  { cmd: 'git checkout -b <dal_adı>', desc: 'Yeni bir dal açar ve anında o dala geçer.', category: 'Dallanma (Branching)' },
  { cmd: 'git switch <dal_adı>', desc: 'Modern Git sözdizimi ile belirtilen dala geçer.', category: 'Dallanma (Branching)' },
  { cmd: 'git merge <hedef_dal>', desc: 'Hedef dalın geçmişini mevcut dala birleştirir.', category: 'Dallanma (Branching)' },
  { cmd: 'git branch -d <dal_adı>', desc: 'Birleştirilmiş güvenli bir dalı siler.', category: 'Dallanma (Branching)' },
  { cmd: 'git push origin <dal>', desc: 'Yerel commitleri uzak depodaki (remote) dala gönderir.', category: 'Uzak Depo (Remote)' },
  { cmd: 'git pull origin <dal>', desc: 'Uzak depodaki değişiklikleri çeker ve mevcut dala birleştirir.', category: 'Uzak Depo (Remote)' },
  { cmd: 'git fetch', desc: 'Uzak depodaki referansları çeker fakat otomatik merge yapmaz.', category: 'Uzak Depo (Remote)' },
  { cmd: 'git remote -v', desc: 'Tanımlanmış uzak depo bağlantılarını listeler.', category: 'Uzak Depo (Remote)' },
  { cmd: 'git log --oneline', desc: 'Commit geçmişini tek satırlık özetler halinde gösterir.', category: 'Geçmiş & İnceleme' },
  { cmd: 'git diff', desc: 'Çalışma alanı ile hazırlık alanı arasındaki satır farklarını gösterir.', category: 'Geçmiş & İnceleme' },
  { cmd: 'git diff --staged', desc: 'Hazırlık alanındaki değişikliklerin son commit ile farkını gösterir.', category: 'Geçmiş & İnceleme' },
  { cmd: 'git stash', desc: 'Tamamlanmamış değişiklikleri geçici bir rafa kaldırarak çalışma alanını temizler.', category: 'Geri Alma & Rafa Kaldırma' },
  { cmd: 'git stash pop', desc: 'Raftaki en son değişikliği geri yükler ve raftan siler.', category: 'Geri Alma & Rafa Kaldırma' },
  { cmd: 'git reset --soft HEAD~1', desc: 'Son commiti geri alır ancak değişiklikleri staged olarak korur.', category: 'Geri Alma & Rafa Kaldırma' },
  { cmd: 'git reset --hard HEAD~1', desc: 'Son commiti ve yapılan tüm değişiklikleri tamamen geri alır (dikkat!).', category: 'Geri Alma & Rafa Kaldırma' },
];

export const GitCheatsheetModal: React.FC<GitCheatsheetModalProps> = ({
  isOpen,
  onClose,
  onRunCommand,
}) => {
  if (!isOpen) return null;

  const categories = Array.from(new Set(CHEATSHEET_DATA.map((c) => c.category)));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Git Komut Rehberi & Hızlı İpuçları</h3>
              <p className="text-xs text-slate-400">
                Sıklıkla başvurulan Git komutları ve kullanım amaçları. Butonlara tıklayarak terminalde çalıştırabilirsiniz.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content categorized */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                {cat}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {CHEATSHEET_DATA.filter((c) => c.category === cat).map((item) => (
                  <div
                    key={item.cmd}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 flex flex-col justify-between group transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-xs font-mono font-semibold text-emerald-400">
                          {item.cmd}
                        </code>
                        <button
                          onClick={() => {
                            onRunCommand(item.cmd);
                            onClose();
                          }}
                          className="opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 transition-all"
                        >
                          Çalıştır
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Hazırlayan: Enes Öztürk</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
