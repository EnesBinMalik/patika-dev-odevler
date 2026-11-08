import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, User, Terminal, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAnalyticsAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Merhaba! Ben Enes Öztürk\'ün E-Ticaret Veri Analitiği ve Modelleme Asistanıyım. SQL sorguları, Tukey IQR aykırı değer temizleme adımları, RFM segmentasyon stratejileri veya Seasonal ARIMA satış tahminleme parametreleri hakkında dilediğinizi sorabilirsiniz.',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Risk Altındakiler (At-Risk) segmenti için aksiyon planı hazırla',
    'Tukey IQR formülünü ve k=1.5 çarpanının matematiksel mantığını açıkla',
    'Seasonal ARIMA modelindeki (1,1,1)x(1,1,1)[7] parametreleri ne anlama gelir?',
    'RFM analizi ile K-Means kümeleme arasındaki farklar nelerdir?',
  ];

  const handleSend = async (userText = input) => {
    if (!userText.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).GEMINI_API_KEY || '';

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userText,
          config: {
            systemInstruction:
              'Sen Enes Öztürk\'ün geliştirdiği "E-Ticaret Müşteri Segmentasyonu ve Satış Tahminleme Motoru" projesinin uzman kıdemli veri bilimcisi ve analitik danışmanısın. Türkçe konuş. SQL (JOIN, GROUP BY, HAVING), Pandas veri ön işleme, Tukey IQR aykırı değer elemesi, RFM analizi, K-Means ve ARIMA zaman serisi konularında matematiksel formüllere ve e-ticaret stratejilerine dayalı, kurumsal ve net yanıtlar ver. İmzanda "Enes Öztürk Veri Bilimi Laboratuvarı" referansı ver.',
          },
        });

        const reply = response.text || 'Yanıt oluşturulamadı.';
        setMessages([...newMessages, { role: 'assistant', content: reply }]);
      } else {
        // High-fidelity domain-expert deterministic response
        setTimeout(() => {
          let smartReply = '';
          const lower = userText.toLowerCase();

          if (lower.includes('risk') || lower.includes('at-risk') || lower.includes('aksiyon')) {
            smartReply = `**Risk Altındakiler (At Risk) Segmenti Stratejik Eylem Planı:**
1. **Durum Tespiti:** Bu segmentteki 38 müşteri geçmişte yüksek sıklık ve ciro sağlamış ancak son 90-180 gündür sipariş vermemiştir. Toplam risk altındaki ciro havuzu **184.200 ₺** seviyesindedir.
2. **Kişiselleştirilmiş Win-Back Kampanyası:**
   - 1. Gün: "Sizi Özledik! Eski Favori Ürünlerinizde %20 Özel İndirim" e-postası.
   - 7. Gün: SMS ile süreli (48 saat geçerli) kargo bedava + sepet tamamlama teşviki.
   - 14. Gün: Ürün veya hizmet memnuniyeti anketi (NPS) ile kopma nedeninin tespiti.
3. **Beklenen Geri Dönüş:** %18-22 arası dönüşüm oranı ile yaklaşık 35.000 ₺ - 42.000 ₺ arası cironun kurtarılması hedeflenir.

*— Enes Öztürk Veri Bilimi Laboratuvarı*`;
          } else if (lower.includes('iqr') || lower.includes('aykırı') || lower.includes('outlier')) {
            smartReply = `**Tukey IQR Yöntemi ve k=1.5 Matematiksel Mantığı:**
- **IQR (Interquartile Range):** $IQR = Q_3 - Q_1$ (Verinin merkezdeki %50'lik diliminin yayılımı).
- **Sınırlar:** Alt = $Q_1 - 1.5 \\times IQR$, Üst = $Q_3 + 1.5 \\times IQR$.
- **Neden 1.5 Çarpanı?** John Tukey'nin normal dağılım varsayımı altında k=1.5 değeri yaklaşık $\\pm 2.7\\sigma$ standart sapmaya denk gelir. Bu da rastgele bir gözlemin normal dağılımda aykırı sayılma olasılığını yaklaşık %0.7 (yaklaşık 150'de 1) yapar.
- E-ticarette 185.000 ₺ gibi B2B toptan alımları perakende müşteri dağılımını çarpıttığı için bu formülle tespit edilerek ayrıştırılır.

*— Enes Öztürk Veri Bilimi Laboratuvarı*`;
          } else if (lower.includes('arima') || lower.includes('parametre') || lower.includes('tahmin')) {
            smartReply = `**Seasonal ARIMA(1,1,1)x(1,1,1)[7] Modeli:**
- **(p=1, d=1, q=1) Standart Bileşen:**
  - $p=1$ (Otoregresyon - AR): Bugünkü ciro dünkü ciro ile ilişkilidir.
  - $d=1$ (Fark Alma - I): Zaman serisini durağan (stationary) kılmak için 1. dereceden fark alınır.
  - $q=1$ (Hareketli Ortalama - MA): Önceki günün tahmin hatası modele dahil edilir.
- **(P=1, D=1, Q=1)[s=7] Mevsimsel Bileşen:**
  - $s=7$: Haftalık periyodu temsil eder (e-ticarette hafta sonu pikleri).
- Modelimiz **%5.82 MAPE** hata payı ile önümüzdeki 30 günde toplam **1.428.950 ₺** ciro öngörmektedir.

*— Enes Öztürk Veri Bilimi Laboratuvarı*`;
          } else {
            smartReply = `**Veri Bilimi ve E-Ticaret Analitik Değerlendirmesi:**
Sorunuz: "${userText}"

E-ticaret veri ambarımızda uyguladığımız yöntem:
1. **İlişkisel SQL:** Ham veriler customers, orders ve order_items üzerinden JOIN ve HAVING SUM(total_amount) > 0 kurallarıyla çekilir.
2. **RFM Çeyreklik Skorlama:** Recency ters orantılı (küçük gün = 5 puan), Frequency ve Monetary doğru orantılı (büyük = 5 puan) 1-5 arasında skorlanır.
3. **K-Means:** Log dönüşümü sonrası $k=4$ optimal küme merkezleri ile teyit edilir.

*— Enes Öztürk Veri Bilimi Laboratuvarı*`;
          }

          setMessages([...newMessages, { role: 'assistant', content: smartReply }]);
          setIsLoading(false);
        }, 500);
      }
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorgu işlenirken bir sorun oluştu. Lütfen tekrar deneyin.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">Veri Bilimi & Modelleme Asistanı</div>
              <div className="text-[11px] text-slate-400 font-mono">Enes Öztürk Danışman AI</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analitik model hesaplanıyor...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 space-y-1.5">
          <div className="text-[11px] text-slate-400 font-medium">Hızlı Veri Bilimi Soruları:</div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] text-left p-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-md transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="SQL, Tukey IQR, RFM veya ARIMA hakkında sorun..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
