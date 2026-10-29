import React from 'react';
import { X, CheckCircle2, ArrowRight, Code2, Edit3, Trash2, Layers, User } from 'lucide-react';
import { BlogPost } from '../types';

interface HomeworkChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  samplePost?: BlogPost;
  onTestEdit: (post: BlogPost) => void;
  onTestDelete: (post: BlogPost) => void;
  onGoToCode: (fileId?: string) => void;
}

export const HomeworkChecklistModal: React.FC<HomeworkChecklistModalProps> = ({
  isOpen,
  onClose,
  samplePost,
  onTestEdit,
  onTestDelete,
  onGoToCode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="p-6 bg-[#212529] text-white flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-1">
              <CheckCircle2 className="w-3 h-3" />
              ÖDEV 11 DEĞERLENDİRME KRİTERLERİ
            </div>
            <h2 className="text-xl font-serif font-bold text-white">
              Clean Blog Projesi 5. Bölüm Kontrol Listesi
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              İmzalı: <strong className="text-white">Enes Öztürk</strong> &bull; Patika.dev Node.js Eğitimi
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Requirements Body */}
        <div className="p-6 space-y-6">
          {/* Requirement 1 */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-950">
                    1. post.ejs template içerisinde UPDATE ve DELETE butonu oluşturuldu
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Tamamlandı
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  <code className="text-emerald-800 font-mono">views/post.ejs</code> şablonunda sarı renkli UPDATE butonu (<code className="font-mono">/posts/edit/:id</code>) ve kırmızı renkli DELETE butonu (<code className="font-mono">?_method=DELETE</code>) yerleştirilmiştir.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onGoToCode('post-ejs');
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-emerald-200"
                  >
                    <Code2 className="w-3.5 h-3.5" /> post.ejs Kodunu Aç
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Requirement 2 */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-950">
                    2. Post verisini güncellemek için gerekli çalışmalar yapıldı
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Tamamlandı
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  <code className="text-amber-800 font-mono">edit.ejs</code> oluşturuldu, post verileri inputlara dolduruldu. Form <code className="font-mono">PUT</code> isteği gönderir ve <code className="font-mono">postController.updatePost</code> ile veritabanı güncellenir.
                </p>
                {samplePost && (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onTestEdit(samplePost);
                      }}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-amber-300"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Canlı Güncellemeyi Test Et
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onGoToCode('edit-ejs');
                      }}
                      className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-gray-200"
                    >
                      <Code2 className="w-3.5 h-3.5" /> edit.ejs Kodu
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Requirement 3 */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-rose-950">
                    3. Post verisini silmek için gerekli çalışmalar yapıldı
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Tamamlandı
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  DELETE butonu <code className="font-mono">method-override</code> aracılığıyla <code className="font-mono">DELETE /posts/:id</code> isteği gönderir. <code className="font-mono">postController.deletePost</code> içinde <code className="font-mono">Post.findByIdAndDelete</code> ile silinip anasayfaya yönlendirilir.
                </p>
                {samplePost && (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onTestDelete(samplePost);
                      }}
                      className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Canlı Silmeyi Test Et
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Requirement 4 */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-blue-950">
                    4. Kodumuz MVC yapısına göre tekrar düzenlendi
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Tamamlandı
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Proje <strong>controllers/</strong> (postController, pageController), <strong>models/</strong> (Post), <strong>views/</strong> (EJS şablonları) ve <strong>app.js</strong> olarak kusursuz MVC mimarisine ayrıştırıldı.
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => {
                      onClose();
                      onGoToCode('post-controller');
                    }}
                    className="text-xs font-semibold text-blue-800 hover:text-blue-950 flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-blue-300"
                  >
                    <Layers className="w-3.5 h-3.5" /> MVC Dosya Ağacını İncele
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Requirement 5 */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-purple-950">
                    5. Enes Öztürk İmzalı
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    Onaylandı
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Tüm kod dosyalarında (JSDoc), sayfa başlıklarında, navbar rozetinde ve footer imzasında <strong>Enes Öztürk</strong> imzası ve GitHub iletişim bağlantıları eksiksiz yer almaktadır.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Tüm 5 kriter başarıyla test edildi.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#212529] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
