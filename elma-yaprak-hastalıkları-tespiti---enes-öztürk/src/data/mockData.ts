import { ClassInfo, ModelBenchmark, SampleLeafImage } from '../types/pathology';

export const AUTHOR_NAME = 'Enes Öztürk';
export const PROJECT_TITLE = 'Elma Ağaçlarındaki Yaprak Hastalıklarının Bilgisayarlı Görü ile Belirlenmesi';
export const KAGGLE_COMPETITION_URL = 'https://www.kaggle.com/c/plant-pathology-2020-fgvc7/data';

export const CLASSES_DATA: ClassInfo[] = [
  {
    id: 'healthy',
    name: 'Sağlıklı (Healthy)',
    scientificName: 'Patojensiz Doku',
    count: 516,
    percent: 28.34,
    color: '#10b981',
    description: 'Herhangi bir fungal lezyon, kloroz veya nekroz barındırmayan, fotosentez kapasitesi optimal yeşil yaprak dokusu.',
    typicalSymptoms: [
      'Homojen canlı yeşil klorofil dağılımı',
      'Pürüzsüz ve hasarsız yaprak kütikulası',
      'Net ve düzenli yaprak damar mimarisi',
      'Leke, püstül veya nekrotik odak bulunmaması'
    ]
  },
  {
    id: 'rust',
    name: 'Elma Memeli Pası (Rust)',
    scientificName: 'Gymnosporangium juniperi-virginianae',
    count: 622,
    percent: 34.16,
    color: '#f59e0b',
    description: 'Ardıç ağaçları ile elma ağaçları arasında konukçu döngüsü olan, yapraklarda parlak sarı-turuncu lekelere yol açan mantari hastalık.',
    typicalSymptoms: [
      'Yaprak üstünde parlak sarı-turuncu dairesel lekeler',
      'Lezyon merkezinde minik siyah spermagonyum noktacıkları',
      'Yaprak altında tüpsü aecial püstüller (meme benzeri çıkıntılar)',
      'Şiddetli evrede yaprak dökülmesi ve sürgün kurumaları'
    ]
  },
  {
    id: 'scab',
    name: 'Elma Karalekesi (Scab)',
    scientificName: 'Venturia inaequalis',
    count: 592,
    percent: 32.51,
    color: '#ef4444',
    description: 'Elma yetiştiriciliğinde küresel çapta en büyük ekonomik kayba yol açan, yapraklarda ve meyvelerde kadifemsi koyu lezyonlar oluşturan patojen.',
    typicalSymptoms: [
      'Zeytin yeşilinden koyu kahverengiye dönen kadifemsi lekeler',
      'Belirsiz sınırlarla başlayan, sonradan dokuyu çatlatıp büzen nekroz',
      'Yaprak ayasında deformasyon ve erken yaprak dökümü',
      'Meyvelere sirayet ettiğinde pazar değerinin sıfırlanması'
    ]
  },
  {
    id: 'multiple_diseases',
    name: 'Çoklu Hastalık (Multiple Diseases)',
    scientificName: 'Venturia inaequalis + Gymnosporangium spp.',
    count: 91,
    percent: 5.00,
    color: '#8b5cf6',
    description: 'Aynı yaprak üzerinde hem karaleke hem pas lezyonlarının bir arada görüldüğü en nadir (%5) ve teşhisi en kritik karma enfeksiyon sınıfı.',
    typicalSymptoms: [
      'Turuncu pas püstülleri ile zeytin yeşili karaleke lekelerinin birlikteliği',
      'Ağır kloroz ve klorofil kaybı',
      'Yaprak kenarlarında kuruma ve doku parçalanmaları',
      'İkili patojen etkileşimi nedeniyle hızlanmış doku çürümesi'
    ]
  }
];

export const BENCHMARK_MODELS: ModelBenchmark[] = [
  {
    id: 'baseline_cnn',
    name: 'Baseline Custom CNN',
    family: 'CNN',
    params: '3.4M',
    rocAuc: 0.8120,
    f1Score: 0.7410,
    logLoss: 0.6420,
    accuracy: 78.4,
    inferenceTimeMs: 12,
    notes: 'Sıfırdan eğitilen 4 konvolüsyon katmanlı temel ağ. Dengesiz "multiple_diseases" sınıfında aşırı zorlanmaktadır.'
  },
  {
    id: 'mobilenet_v3',
    name: 'MobileNet-V3 Large',
    family: 'Mobile',
    params: '5.4M',
    rocAuc: 0.9410,
    f1Score: 0.8950,
    logLoss: 0.2450,
    accuracy: 90.6,
    inferenceTimeMs: 8,
    notes: 'Hafif mimari. Çiftçilerin sahada cep telefonunda çevrimdışı çalıştırabileceği yüksek hız/performans oranı sunar.'
  },
  {
    id: 'resnet50',
    name: 'ResNet-50 (ImageNet Pretrained)',
    family: 'Residual',
    params: '25.6M',
    rocAuc: 0.9582,
    f1Score: 0.9120,
    logLoss: 0.2140,
    accuracy: 92.1,
    inferenceTimeMs: 24,
    notes: 'Residual atlama bağlantıları sayesinde gradyan kaybolmasını önler ve pas püstüllerini başarıyla ayrıştırır.'
  },
  {
    id: 'densenet121',
    name: 'DenseNet-121',
    family: 'Dense',
    params: '8.0M',
    rocAuc: 0.9654,
    f1Score: 0.9280,
    logLoss: 0.1870,
    accuracy: 93.4,
    inferenceTimeMs: 28,
    notes: 'Özellik haritalarının katmanlar arası birleşimi (concatenation) ince fungal doku desenlerini çok iyi yakalar.'
  },
  {
    id: 'convnext_tiny',
    name: 'ConvNeXt-Tiny',
    family: 'Modern Conv',
    params: '28.6M',
    rocAuc: 0.9745,
    f1Score: 0.9420,
    logLoss: 0.1420,
    accuracy: 94.8,
    inferenceTimeMs: 26,
    notes: '7x7 geniş çekirdek ve ters darboğaz blokları ile Vision Transformer seviyesinde modern konvolüsyonel güç.'
  },
  {
    id: 'vit_base',
    name: 'Vision Transformer (ViT-B/16)',
    family: 'Transformer',
    params: '86.6M',
    rocAuc: 0.9780,
    f1Score: 0.9490,
    logLoss: 0.1280,
    accuracy: 95.3,
    inferenceTimeMs: 42,
    notes: '16x16 yama bazlı self-attention mekanizması. Yaprağın bütünü ile leke arasındaki uzamsal ilişkiyi eksiksiz yakalar.'
  },
  {
    id: 'efficientnet_b4',
    name: 'EfficientNet-B4 ⭐ (En Başarılı Tekil Model)',
    family: 'CNN',
    params: '19.3M',
    rocAuc: 0.9842,
    f1Score: 0.9610,
    logLoss: 0.0980,
    accuracy: 96.5,
    inferenceTimeMs: 31,
    isBest: true,
    notes: 'Bileşik ölçekleme (derinlik, genişlik, 380x380 giriş çözünürlüğü) ile tekil mimariler arasında en yüksek ROC-AUC skorunu vermiştir.'
  },
  {
    id: 'ensemble_stacking',
    name: 'Ensemble Blending (EfficientNet-B4 + ViT + DenseNet)',
    family: 'Ensemble',
    params: '113.9M',
    rocAuc: 0.9891,
    f1Score: 0.9720,
    logLoss: 0.0760,
    accuracy: 97.4,
    inferenceTimeMs: 98,
    isBest: true,
    notes: '5-Fold çapraz doğrulama OOF tahminlerinin ağırlıklı birleşimi (0.50 EfficientNet + 0.30 ViT + 0.20 DenseNet). Zirve yarışma skoru!'
  }
];

// Sample images encoded with SVG illustrations of realistic leaves
export const SAMPLE_LEAVES: SampleLeafImage[] = [
  {
    id: 'sample_rust',
    name: 'Elma Memeli Pası (Rust Örneği)',
    diseaseType: 'rust',
    tag: 'Test Seti #1402',
    description: 'Yaprak ayasında parlak turuncu-sarı aecial lezyonlar ve merkezi koyu spermagonyum noktaları mevcut.',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <defs>
          <radialGradient id="bgG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#14281d"/>
            <stop offset="100%" stop-color="#0a120e"/>
          </radialGradient>
          <linearGradient id="leafG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4ade80"/>
            <stop offset="50%" stop-color="#22c55e"/>
            <stop offset="100%" stop-color="#15803d"/>
          </linearGradient>
          <radialGradient id="rustSpot1" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stop-color="#ea580c"/>
            <stop offset="35%" stop-color="#f97316"/>
            <stop offset="70%" stop-color="#facc15"/>
            <stop offset="100%" stop-color="#84cc16" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="500" height="500" fill="url(#bgG)"/>
        <!-- Main Apple Leaf -->
        <path d="M 250 60 C 370 120 420 280 340 400 C 270 440 210 420 160 380 C 80 290 120 120 250 60 Z" fill="url(#leafG)" stroke="#166534" stroke-width="4"/>
        <!-- Veins -->
        <path d="M 250 60 Q 240 240 250 420" stroke="#14532d" stroke-width="6" fill="none"/>
        <path d="M 245 150 Q 320 170 370 200" stroke="#14532d" stroke-width="3" fill="none"/>
        <path d="M 245 220 Q 330 250 360 300" stroke="#14532d" stroke-width="3" fill="none"/>
        <path d="M 245 160 Q 180 180 140 220" stroke="#14532d" stroke-width="3" fill="none"/>
        <path d="M 245 250 Q 180 290 150 340" stroke="#14532d" stroke-width="3" fill="none"/>
        <!-- Rust Spots with Pustules -->
        <circle cx="210" cy="200" r="38" fill="url(#rustSpot1)"/>
        <circle cx="205" cy="198" r="4" fill="#451a03"/>
        <circle cx="218" cy="204" r="3" fill="#451a03"/>
        <circle cx="310" cy="240" r="46" fill="url(#rustSpot1)"/>
        <circle cx="308" cy="238" r="5" fill="#451a03"/>
        <circle cx="320" cy="248" r="4" fill="#451a03"/>
        <circle cx="230" cy="310" r="34" fill="url(#rustSpot1)"/>
        <circle cx="160" cy="260" r="28" fill="url(#rustSpot1)"/>
      </svg>
    `),
    defaultHotspots: [
      { x: 42, y: 40, radius: 20, intensity: 0.96, label: 'Primer Pas Püstülü' },
      { x: 62, y: 48, radius: 22, intensity: 0.94, label: 'Sekonder Pas Lezyonu' },
      { x: 46, y: 62, radius: 16, intensity: 0.82, label: 'Aecial Küme' }
    ]
  },
  {
    id: 'sample_scab',
    name: 'Elma Karalekesi (Scab Örneği)',
    diseaseType: 'scab',
    tag: 'Test Seti #0884',
    description: 'Yaprak ayasında kadifemsi, zeytin yeşili ve koyu kahverengi nekrotik lezyonlar kolonize olmuş.',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <defs>
          <radialGradient id="bgG2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#182218"/>
            <stop offset="100%" stop-color="#0a120a"/>
          </radialGradient>
          <linearGradient id="leafG2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#86efac"/>
            <stop offset="60%" stop-color="#22c55e"/>
            <stop offset="100%" stop-color="#15803d"/>
          </linearGradient>
          <radialGradient id="scabSpot1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#27272a"/>
            <stop offset="40%" stop-color="#3f3f46"/>
            <stop offset="70%" stop-color="#4d4c20"/>
            <stop offset="100%" stop-color="#22c55e" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="500" height="500" fill="url(#bgG2)"/>
        <!-- Apple Leaf -->
        <path d="M 250 50 C 380 110 430 270 350 410 C 270 450 200 420 150 370 C 70 280 110 110 250 50 Z" fill="url(#leafG2)" stroke="#166534" stroke-width="4"/>
        <!-- Veins -->
        <path d="M 250 50 Q 240 230 250 430" stroke="#14532d" stroke-width="6" fill="none"/>
        <path d="M 245 140 Q 320 160 360 210" stroke="#14532d" stroke-width="3" fill="none"/>
        <path d="M 245 220 Q 330 240 370 290" stroke="#14532d" stroke-width="3" fill="none"/>
        <path d="M 245 150 Q 170 170 130 210" stroke="#14532d" stroke-width="3" fill="none"/>
        <path d="M 245 230 Q 170 270 140 320" stroke="#14532d" stroke-width="3" fill="none"/>
        <!-- Scab Dark Irregular Spots -->
        <path d="M 230 180 Q 260 160 280 190 Q 290 220 260 240 Q 220 230 230 180 Z" fill="url(#scabSpot1)"/>
        <path d="M 170 260 Q 210 250 220 280 Q 210 320 180 310 Q 160 290 170 260 Z" fill="url(#scabSpot1)"/>
        <path d="M 290 280 Q 340 270 350 310 Q 330 350 290 330 Q 270 300 290 280 Z" fill="url(#scabSpot1)"/>
        <circle cx="210" cy="140" r="14" fill="#3f3f46" opacity="0.8"/>
        <circle cx="310" cy="180" r="18" fill="#3f3f46" opacity="0.8"/>
      </svg>
    `),
    defaultHotspots: [
      { x: 52, y: 42, radius: 22, intensity: 0.98, label: 'Venturia inaequalis Nekroz Kolonisi' },
      { x: 38, y: 58, radius: 18, intensity: 0.91, label: 'Kütikula Deformasyonu' },
      { x: 62, y: 64, radius: 20, intensity: 0.88, label: 'Marjinal Karaleke Alanı' }
    ]
  },
  {
    id: 'sample_multiple',
    name: 'Çoklu Hastalık (Karma Enfeksiyon)',
    diseaseType: 'multiple_diseases',
    tag: 'Test Seti #0219 (Nadir Sınıf %5)',
    description: 'Aynı yaprakta hem pas püstülleri hem de zeytin rengi karaleke lezyonları eşzamanlı gözleniyor.',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <defs>
          <radialGradient id="bgG3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1c1f1a"/>
            <stop offset="100%" stop-color="#0c0e0b"/>
          </radialGradient>
          <linearGradient id="leafG3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#84cc16"/>
            <stop offset="40%" stop-color="#4ade80"/>
            <stop offset="100%" stop-color="#166534"/>
          </linearGradient>
          <radialGradient id="rustSp" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stop-color="#ea580c"/>
            <stop offset="50%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#84cc16" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="500" height="500" fill="url(#bgG3)"/>
        <!-- Apple Leaf with irregular edge -->
        <path d="M 250 50 C 370 100 440 250 360 410 C 280 440 210 430 160 380 C 80 290 110 110 250 50 Z" fill="url(#leafG3)" stroke="#166534" stroke-width="4"/>
        <path d="M 250 50 Q 240 240 250 430" stroke="#14532d" stroke-width="5" fill="none"/>
        <path d="M 245 150 Q 320 170 370 210" stroke="#14532d" stroke-width="3" fill="none"/>
        <path d="M 245 230 Q 320 260 360 310" stroke="#14532d" stroke-width="3" fill="none"/>
        <!-- Rust Spot -->
        <circle cx="200" cy="190" r="36" fill="url(#rustSp)"/>
        <circle cx="196" cy="188" r="4" fill="#451a03"/>
        <circle cx="210" cy="194" r="3" fill="#451a03"/>
        <!-- Scab Spot -->
        <path d="M 280 230 Q 330 210 340 250 Q 330 290 290 280 Q 270 250 280 230 Z" fill="#27272a" opacity="0.9"/>
        <circle cx="270" cy="330" r="26" fill="url(#rustSp)"/>
        <path d="M 160 270 Q 200 260 210 290 Q 190 320 160 300 Z" fill="#27272a" opacity="0.9"/>
      </svg>
    `),
    defaultHotspots: [
      { x: 40, y: 38, radius: 18, intensity: 0.94, label: 'Pas Püstül Kümesi' },
      { x: 62, y: 52, radius: 20, intensity: 0.95, label: 'Karaleke Nekroz Odağı' },
      { x: 54, y: 66, radius: 16, intensity: 0.86, label: 'Sekonder Enfeksiyon' }
    ]
  },
  {
    id: 'sample_healthy',
    name: 'Sağlıklı Yaprak (Healthy Leaf)',
    diseaseType: 'healthy',
    tag: 'Test Seti #0045',
    description: 'Klorofilce zengin, hasarsız ve homojen yüzeye sahip sağlıklı elma yaprağı.',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <defs>
          <radialGradient id="bgG4" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#0f2617"/>
            <stop offset="100%" stop-color="#07130c"/>
          </radialGradient>
          <linearGradient id="leafG4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4ade80"/>
            <stop offset="40%" stop-color="#22c55e"/>
            <stop offset="100%" stop-color="#15803d"/>
          </linearGradient>
        </defs>
        <rect width="500" height="500" fill="url(#bgG4)"/>
        <!-- Pristine Green Apple Leaf -->
        <path d="M 250 50 C 370 100 420 260 340 410 C 270 450 200 420 150 370 C 80 280 120 110 250 50 Z" fill="url(#leafG4)" stroke="#166534" stroke-width="4"/>
        <path d="M 250 50 Q 240 230 250 430" stroke="#166534" stroke-width="5" fill="none"/>
        <path d="M 246 130 Q 320 150 360 190" stroke="#166534" stroke-width="2.5" fill="none"/>
        <path d="M 246 200 Q 330 220 360 270" stroke="#166534" stroke-width="2.5" fill="none"/>
        <path d="M 246 270 Q 310 290 340 340" stroke="#166534" stroke-width="2" fill="none"/>
        <path d="M 246 140 Q 170 160 140 200" stroke="#166534" stroke-width="2.5" fill="none"/>
        <path d="M 246 210 Q 170 240 140 280" stroke="#166534" stroke-width="2.5" fill="none"/>
      </svg>
    `),
    defaultHotspots: [
      { x: 50, y: 50, radius: 15, intensity: 0.35, label: 'Genel Yaprak Ayası' }
    ]
  }
];

export const PYTHON_NOTEBOOK_CODE = `# ==============================================================================
# PROJE: Elma Ağaçlarındaki Yaprak Hastalıklarının Belirlenmesi
# KAGGLE: Plant Pathology 2020 - FGVC7 Challenge
# HAZIRLAYAN: Enes Öztürk (enesbino38@gmail.com)
# METRİK: Mean Column-Wise ROC-AUC
# MODEL: EfficientNet-B4 + Albumentations + Stratified 5-Fold Cross-Validation
# ==============================================================================

import os
import gc
import cv2
import time
import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score, f1_score

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingWarmRestarts

# Görüntü Çoğaltma (Augmentation)
import albumentations as A
from albumentations.pytorch import ToTensorV2
import timm

# 1. REPRODUCIBILITY / TOHUMLAMA
def seed_everything(seed=42):
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.backends.cudnn.deterministic = True

seed_everything(42)
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# 2. VERİ YÜKLEME VE EKSİK DEĞER KONTROLÜ
DATA_DIR = '../input/plant-pathology-2020-fgvc7'
train_df = pd.read_csv(f'{DATA_DIR}/train.csv')
test_df = pd.read_csv(f'{DATA_DIR}/test.csv')

print(f"Eğitim Verisi: {train_df.shape}, Test Verisi: {test_df.shape}")
print("Eksik Değer Kontrolü:")
print(train_df.isnull().sum())  # Eksik değer bulunmamaktadır!

TARGET_COLS = ['healthy', 'multiple_diseases', 'rust', 'scab']
train_df['label'] = np.argmax(train_df[TARGET_COLS].values, axis=1)

# 3. DERSİN ÖTESİNDE: AYKIRI DEĞER (OUTLIER) VE GÖRÜNTÜ KALİTESİ FİLTRELEME
def detect_blurry_and_outlier_images(df, img_dir, threshold=100.0):
    """
    Laplacian varyansı ile aşırı bulanık (outlier) veya ışık patlaması 
    olan görselleri tespit eder ve etiketler.
    """
    scores = []
    for image_id in df['image_id']:
        path = f"{img_dir}/{image_id}.jpg"
        img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
        if img is not None:
            laplacian_var = cv2.Laplacian(img, cv2.CV_64F).var()
            scores.append(laplacian_var)
        else:
            scores.append(0.0)
    df['blur_score'] = scores
    outliers = df[df['blur_score'] < threshold]
    print(f"Tespit Edilen Bulanık/Aykırı Görsel Sayısı: {len(outliers)}")
    return df

# 4. ALBUMENTATIONS İLE GELİŞMİŞ VERİ ÇOĞALTMA
IMG_SIZE = 380  # EfficientNet-B4 için optimal çözünürlük

def get_transforms():
    train_transform = A.Compose([
        A.RandomResizedCrop(IMG_SIZE, IMG_SIZE, scale=(0.8, 1.0)),
        A.HorizontalFlip(p=0.5),
        A.VerticalFlip(p=0.5),
        A.ShiftScaleRotate(shift_limit=0.1, scale_limit=0.1, rotate_limit=45, p=0.7),
        A.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, p=0.5),
        A.HueSaturationValue(hue_shift_limit=10, sat_shift_limit=20, val_shift_limit=10, p=0.5),
        A.CoarseDropout(max_holes=8, max_height=32, max_width=32, fill_value=0, p=0.5), # Cutout
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2()
    ])
    
    val_transform = A.Compose([
        A.Resize(IMG_SIZE, IMG_SIZE),
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2()
    ])
    return train_transform, val_transform

# 5. DATASET VE STRATIFIED 5-FOLD DOĞRULAMA BÖLÜNTÜSÜ
class AppleLeafDataset(Dataset):
    def __init__(self, df, img_dir, transforms=None, is_test=False):
        self.df = df
        self.img_dir = img_dir
        self.transforms = transforms
        self.is_test = is_test

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        img_path = f"{self.img_dir}/{row['image_id']}.jpg"
        image = cv2.imread(img_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        if self.transforms:
            augmented = self.transforms(image=image)
            image = augmented['image']
            
        if self.is_test:
            return image
        
        target = row[TARGET_COLS].values.astype(np.float32)
        return image, torch.tensor(target)

# Stratified K-Fold (5 Fold)
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
train_df['fold'] = -1
for fold, (train_idx, val_idx) in enumerate(skf.split(train_df, train_df['label'])):
    train_df.loc[val_idx, 'fold'] = fold

# 6. MODEL MİMARİSİ (EfficientNet-B4)
class ApplePathologyClassifier(nn.Module):
    def __init__(self, model_name='efficientnet_b4', num_classes=4, pretrained=True):
        super().__init__()
        self.backbone = timm.create_model(model_name, pretrained=pretrained, num_classes=0)
        in_features = self.backbone.num_features
        self.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_features, 512),
            nn.SiLU(),
            nn.Dropout(0.2),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        features = self.backbone(x)
        logits = self.fc(features)
        return logits

# 7. EĞİTİM DÖNGÜSÜ VE ROC-AUC METRİĞİ DEĞERLENDİRMESİ
def compute_multiclass_roc_auc(y_true, y_pred):
    """Kaggle Plant Pathology resmi metriği: Mean Column-Wise ROC-AUC"""
    roc_aucs = []
    for i in range(4):
        score = roc_auc_score(y_true[:, i], y_pred[:, i])
        roc_aucs.append(score)
    return np.mean(roc_aucs), roc_aucs

print("Kod Enes Öztürk tarafından hazırlanmıştır. Pipeline eğitime hazırdır.")
`;
