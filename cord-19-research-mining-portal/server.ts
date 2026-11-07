import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google GenAI client if key exists
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// CORD-19 AI Text Mining API Route
app.post('/api/mine', async (req, res) => {
  const { query, taskId } = req.body;

  if (!query && !taskId) {
    return res.status(400).json({ error: 'Sorgu metni veya görev kimliği gereklidir.' });
  }

  // If Gemini API is available, synthesize with gemini-2.5-flash
  if (aiClient) {
    try {
      const prompt = `Sen tıp literatürü ve COVID-19 Açık Araştırma Veri Seti (CORD-19) konusunda uzmanlaşmış bir Biyomedikal Veri ve Metin Madenciliği Motorusun.
Bu platform "Enes Öztürk İmzalı" olarak bilim insanlarına ve tıp camiasına hizmet vermektedir.

Kullanıcının araştırma sorgusu: "${query || taskId}"

Lütfen CORD-19 veri setinde yer alan bilimsel yayınlara (NEJM, Lancet, Science, Nature, JAMA, bioRxiv) dayanarak aşağıdaki JSON formatında kanıta dayalı bir metin madenciliği analizi hazırla:

JSON Formatı:
{
  "query": "${query || taskId}",
  "synthesizedAnswer": "Bilimsel konsensüse dayalı 2-3 paragraflık net, kanıt destekli tıp özeti",
  "consensusScore": 95,
  "evidenceGrade": "Yüksek (GRADE A)",
  "extractedEntities": {
    "genesAndProteins": ["ACE2", "TMPRSS2", "Spike S1/S2", "IL-6"],
    "drugsAndChemicals": ["Dexamethasone", "Paxlovid", "Remdesivir"],
    "riskFactors": ["İleri Yaş", "Hipertansiyon", "Tip 2 Diyabet"],
    "biomarkers": ["D-Dimer", "Ferritin", "CRP", "Lenfopeni"]
  },
  "oddsRatios": [
    {
      "factor": "Klinik Faktör veya İlaç",
      "value": 2.45,
      "ciLower": 1.82,
      "ciUpper": 3.29,
      "pValue": "p < 0.001",
      "paperTitle": "Örnek Hakemli Yayın Başlığı",
      "paperJournal": "The Lancet"
    }
  ],
  "keyTakeaways": [
    "Madde 1: Kanıtlanmış kritik bulgu",
    "Madde 2: Klinik yönetim çıkarımı",
    "Madde 3: İmmünolojik veya epidemiyolojik sonuç"
  ],
  "scientificConsensus": "Literatürdeki genel mutabakat düzeyi ve metodolojik güvenilirlik",
  "openContradictions": [
    "Açık kalan veya çelişkili bulunan nokta"
  ]
}

Sadece saf JSON döndür, hiçbir markdown codefence ekleme.`;

      const aiResponse = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (aiResponse.text) {
        const parsed = JSON.parse(aiResponse.text);
        return res.json(parsed);
      }
    } catch (err) {
      console.error('Gemini mining error, fallback to algorithmic response:', err);
    }
  }

  // If no AI key or AI failed, respond 404 to let client fallback smoothly to local NLP engine
  return res.status(503).json({ message: 'Fallback to local mining engine' });
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CORD-19 Research Mining Portal listening on port ${PORT}`);
  });
}

startServer();
