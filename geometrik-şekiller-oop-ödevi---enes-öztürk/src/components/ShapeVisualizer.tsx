import React from 'react';
import { AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Dikdortgen, Kare, Ucgen } from '../models/Sekil';

interface ShapeVisualizerProps {
  shapeType: 'dikdortgen' | 'kare' | 'ucgen';
  dikdortgen: Dikdortgen;
  kare: Kare;
  ucgen: Ucgen;
}

export const ShapeVisualizer: React.FC<ShapeVisualizerProps> = ({
  shapeType,
  dikdortgen,
  kare,
  ucgen
}) => {
  // SVG Canvas dimensions
  const viewBoxSize = 360;
  const padding = 45;
  const usableSize = viewBoxSize - padding * 2;

  // Render Rectangle
  const renderDikdortgen = () => {
    const w = dikdortgen.genislik || 1;
    const h = dikdortgen.yukseklik || 1;
    const maxDim = Math.max(w, h, 1);
    const scale = usableSize / maxDim;

    const renderW = Math.max(30, Math.min(usableSize, w * scale));
    const renderH = Math.max(30, Math.min(usableSize, h * scale));

    const x = (viewBoxSize - renderW) / 2;
    const y = (viewBoxSize - renderH) / 2;

    return (
      <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full">
        <defs>
          <linearGradient id="rectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
          </linearGradient>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Background Grid */}
        <rect width={viewBoxSize} height={viewBoxSize} fill="url(#grid)" />

        {/* Rectangle Shape */}
        <rect
          x={x}
          y={y}
          width={renderW}
          height={renderH}
          rx="6"
          fill="url(#rectGrad)"
          stroke="#818cf8"
          strokeWidth="3"
          strokeDasharray="4 2"
          className="transition-all duration-300"
        />

        {/* Right Angle Indicators */}
        <path
          d={`M ${x} ${y + 14} L ${x + 14} ${y + 14} L ${x + 14} ${y}`}
          fill="none"
          stroke="#a5b4fc"
          strokeWidth="1.5"
        />
        <path
          d={`M ${x + renderW - 14} ${y} L ${x + renderW - 14} ${y + 14} L ${x + renderW} ${y + 14}`}
          fill="none"
          stroke="#a5b4fc"
          strokeWidth="1.5"
        />

        {/* Width Dimension (Top) */}
        <line
          x1={x}
          y1={y - 14}
          x2={x + renderW}
          y2={y - 14}
          stroke="#38bdf8"
          strokeWidth="2"
        />
        <circle cx={x} cy={y - 14} r="3" fill="#38bdf8" />
        <circle cx={x + renderW} cy={y - 14} r="3" fill="#38bdf8" />
        <text
          x={x + renderW / 2}
          y={y - 20}
          fill="#38bdf8"
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
        >
          Genişlik (a) = {dikdortgen.genislik} br
        </text>

        {/* Height Dimension (Right) */}
        <line
          x1={x + renderW + 14}
          y1={y}
          x2={x + renderW + 14}
          y2={y + renderH}
          stroke="#c084fc"
          strokeWidth="2"
        />
        <circle cx={x + renderW + 14} cy={y} r="3" fill="#c084fc" />
        <circle cx={x + renderW + 14} cy={y + renderH} r="3" fill="#c084fc" />
        <text
          x={x + renderW + 24}
          y={y + renderH / 2 + 4}
          fill="#c084fc"
          textAnchor="start"
          fontSize="13"
          fontWeight="bold"
        >
          Yükseklik (b) = {dikdortgen.yukseklik} br
        </text>

        {/* Center Info */}
        <text
          x={x + renderW / 2}
          y={y + renderH / 2 - 8}
          fill="#f8fafc"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
        >
          Alan: {dikdortgen.alanHesapla().toFixed(1)} br²
        </text>
        <text
          x={x + renderW / 2}
          y={y + renderH / 2 + 14}
          fill="#94a3b8"
          textAnchor="middle"
          fontSize="12"
        >
          Çevre: {dikdortgen.cevreHesapla().toFixed(1)} br
        </text>
      </svg>
    );
  };

  // Render Square (Special Rectangle)
  const renderKare = () => {
    const k = kare.kenar || 1;
    const renderSize = Math.max(50, Math.min(usableSize, 220));
    const x = (viewBoxSize - renderSize) / 2;
    const y = (viewBoxSize - renderSize) / 2;

    return (
      <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full">
        <defs>
          <linearGradient id="squareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
          </linearGradient>
          <pattern id="gridKare" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={viewBoxSize} height={viewBoxSize} fill="url(#gridKare)" />

        {/* Square Shape */}
        <rect
          x={x}
          y={y}
          width={renderSize}
          height={renderSize}
          rx="6"
          fill="url(#squareGrad)"
          stroke="#34d399"
          strokeWidth="3.5"
          className="transition-all duration-300"
        />

        {/* Equal side ticks (all 4 sides have tick marks) */}
        <line x1={x + renderSize / 2 - 5} y1={y - 4} x2={x + renderSize / 2 + 5} y2={y + 4} stroke="#34d399" strokeWidth="2" />
        <line x1={x + renderSize / 2 - 5} y1={y + renderSize - 4} x2={x + renderSize / 2 + 5} y2={y + renderSize + 4} stroke="#34d399" strokeWidth="2" />
        <line x1={x - 4} y1={y + renderSize / 2 - 5} x2={x + 4} y2={y + renderSize / 2 + 5} stroke="#34d399" strokeWidth="2" />
        <line x1={x + renderSize - 4} y1={y + renderSize / 2 - 5} x2={x + renderSize + 4} y2={y + renderSize / 2 + 5} stroke="#34d399" strokeWidth="2" />

        {/* Dimension Label (Top) */}
        <text
          x={x + renderSize / 2}
          y={y - 14}
          fill="#34d399"
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
        >
          Kenar = {kare.kenar} br
        </text>

        {/* Right Angle Indicator */}
        <path
          d={`M ${x} ${y + 14} L ${x + 14} ${y + 14} L ${x + 14} ${y}`}
          fill="none"
          stroke="#6ee7b7"
          strokeWidth="1.5"
        />

        {/* Center Info */}
        <text
          x={x + renderSize / 2}
          y={y + renderSize / 2 - 12}
          fill="#f8fafc"
          textAnchor="middle"
          fontSize="15"
          fontWeight="bold"
        >
          Kare (a = b)
        </text>
        <text
          x={x + renderSize / 2}
          y={y + renderSize / 2 + 10}
          fill="#6ee7b7"
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
        >
          Alan: {kare.alanHesapla().toFixed(1)} br²
        </text>
        <text
          x={x + renderSize / 2}
          y={y + renderSize / 2 + 28}
          fill="#94a3b8"
          textAnchor="middle"
          fontSize="12"
        >
          Çevre: {kare.cevreHesapla().toFixed(1)} br
        </text>
      </svg>
    );
  };

  // Render Triangle (Heron Formula)
  const renderUcgen = () => {
    const isValid = ucgen.gecerliMi();

    if (!isValid) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-red-950/20 border border-red-500/20 rounded-2xl">
          <AlertCircle className="w-12 h-12 text-rose-400 mb-3 animate-pulse" />
          <h4 className="text-base font-bold text-rose-300">Geçersiz Üçgen Boyutları</h4>
          <p className="text-xs text-slate-300 mt-2 max-w-xs leading-relaxed">
            Üçgen eşitsizliği kuralına göre: her kenar, diğer iki kenarın toplamından küçük ve mutlak farkından büyük olmalıdır.
          </p>
          <div className="mt-3 px-3 py-1.5 bg-slate-900 border border-rose-500/30 rounded-lg text-xs font-mono text-rose-300">
            |a - b| &lt; c &lt; a + b
          </div>
        </div>
      );
    }

    // Place vertices: Let base be side c along bottom.
    // Point A at (0, 0), Point B at (c, 0).
    // Point C has coordinates:
    // x = (b^2 + c^2 - a^2) / (2 * c)
    // y = sqrt(b^2 - x^2)
    const { a, b, c } = ucgen;
    // Cosine law for point C with base c:
    const cosA = (b * b + c * c - a * a) / (2 * b * c);
    const angleA = Math.acos(Math.max(-1, Math.min(1, cosA)));
    const cX = b * Math.cos(angleA);
    const cY = b * Math.sin(angleA);

    // Bounding box of triangle
    const minX = Math.min(0, c, cX);
    const maxX = Math.max(0, c, cX);
    const minY = Math.min(0, cY);
    const maxY = Math.max(0, cY);

    const spanX = Math.max(maxX - minX, 0.001);
    const spanY = Math.max(maxY - minY, 0.001);
    const maxSpan = Math.max(spanX, spanY);
    const scale = usableSize / maxSpan;

    // Map to SVG coordinates (inverted Y)
    const offsetX = (viewBoxSize - spanX * scale) / 2 - minX * scale;
    const offsetY = (viewBoxSize + spanY * scale) / 2 + minY * scale;

    const p1 = { x: 0 * scale + offsetX, y: offsetY - 0 * scale };
    const p2 = { x: c * scale + offsetX, y: offsetY - 0 * scale };
    const p3 = { x: cX * scale + offsetX, y: offsetY - cY * scale };

    const area = ucgen.alanHesapla();
    const perimeter = ucgen.cevreHesapla();
    const triangleType = ucgen.turBelirle();

    return (
      <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full">
        <defs>
          <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.15" />
          </linearGradient>
          <pattern id="gridUcgen" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={viewBoxSize} height={viewBoxSize} fill="url(#gridUcgen)" />

        {/* Triangle Polygon */}
        <polygon
          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
          fill="url(#triGrad)"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* Altitude (Height) dashed line */}
        <line
          x1={p3.x}
          y1={p3.y}
          x2={p3.x}
          y2={p1.y}
          stroke="#fbbf24"
          strokeDasharray="4 3"
          strokeWidth="1.5"
        />

        {/* Side c Label (Bottom) */}
        <text
          x={(p1.x + p2.x) / 2}
          y={p1.y + 18}
          fill="#fbbf24"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
        >
          c = {c} br (taban)
        </text>

        {/* Side b Label (Left) */}
        <text
          x={(p1.x + p3.x) / 2 - 12}
          y={(p1.y + p3.y) / 2}
          fill="#f472b6"
          textAnchor="end"
          fontSize="12"
          fontWeight="bold"
        >
          b = {b} br
        </text>

        {/* Side a Label (Right) */}
        <text
          x={(p2.x + p3.x) / 2 + 12}
          y={(p2.y + p3.y) / 2}
          fill="#38bdf8"
          textAnchor="start"
          fontSize="12"
          fontWeight="bold"
        >
          a = {a} br
        </text>

        {/* Vertices */}
        <circle cx={p1.x} cy={p1.y} r="4" fill="#f59e0b" />
        <circle cx={p2.x} cy={p2.y} r="4" fill="#f59e0b" />
        <circle cx={p3.x} cy={p3.y} r="4" fill="#f59e0b" />

        {/* Center Info */}
        <g transform={`translate(${viewBoxSize / 2}, ${viewBoxSize - 22})`}>
          <rect x="-110" y="-14" width="220" height="26" rx="13" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" opacity="0.9" />
          <text textAnchor="middle" y="4" fill="#fde68a" fontSize="11" fontWeight="bold">
            {triangleType} • Alan: {area.toFixed(1)} br²
          </text>
        </g>
      </svg>
    );
  };

  return (
    <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-xl overflow-hidden min-h-[360px]">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="absolute top-3 left-4 flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>
          {shapeType === 'dikdortgen' && 'Dikdörtgen (Sekil Sınıfından)'}
          {shapeType === 'kare' && 'Kare (Dikdortgen Sınıfından Miras)'}
          {shapeType === 'ucgen' && 'Üçgen (Heron Formülü)'}
        </span>
      </div>

      {/* Canvas Area */}
      <div className="w-full max-w-[340px] aspect-square flex items-center justify-center">
        {shapeType === 'dikdortgen' && renderDikdortgen()}
        {shapeType === 'kare' && renderKare()}
        {shapeType === 'ucgen' && renderUcgen()}
      </div>

      {/* Architecture note pill */}
      {shapeType === 'kare' && (
        <div className="mt-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Kare, Dikdörtgenin tüm özelliklerini super(kenar, kenar) ile kullanır!</span>
        </div>
      )}
    </div>
  );
};
