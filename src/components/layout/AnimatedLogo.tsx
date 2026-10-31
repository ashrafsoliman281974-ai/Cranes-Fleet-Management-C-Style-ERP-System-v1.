import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Cog,
  Radio,
  Flame,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Truck,
} from 'lucide-react';
import {
  EQUIPMENT_SHOWCASE_LIST,
  EquipmentShowcaseItem,
} from '../../data/equipmentShowcaseData';

export type LogoAnimationMode = 'shimmer' | 'float' | 'radar' | 'pulse' | 'all';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  interactive?: boolean;
  defaultMode?: LogoAnimationMode;
  showEquipmentBackdrop?: boolean;
  onClick?: () => void;
  className?: string;
  equipmentIndex?: number;
  onIndexChange?: (index: number) => void;
  onEquipmentChange?: (equipment: EquipmentShowcaseItem) => void;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'md',
  showTitle = false,
  interactive = true,
  defaultMode = 'all',
  showEquipmentBackdrop = true,
  onClick,
  className = '',
  equipmentIndex,
  onIndexChange,
  onEquipmentChange,
}) => {
  const [currentMode, setCurrentMode] = useState<LogoAnimationMode>(defaultMode);
  const [internalEqIndex, setInternalEqIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  const isControlled = equipmentIndex !== undefined;
  const activeEqIndex = isControlled ? equipmentIndex : internalEqIndex;
  const currentEquipment = EQUIPMENT_SHOWCASE_LIST[activeEqIndex] || EQUIPMENT_SHOWCASE_LIST[0];

  // Auto-cycle through equipment images in the background if NOT controlled by parent
  useEffect(() => {
    if (isControlled || !isAutoCycling || isHovered) return;

    const timer = setInterval(() => {
      setInternalEqIndex((prev) => (prev + 1) % EQUIPMENT_SHOWCASE_LIST.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isControlled, isAutoCycling, isHovered]);

  // Safe notification to parent only if uncontrolled and onEquipmentChange provided
  useEffect(() => {
    if (!isControlled && onEquipmentChange) {
      onEquipmentChange(currentEquipment);
    }
  }, [isControlled, activeEqIndex, onEquipmentChange, currentEquipment]);

  const changeEquipmentIndex = (nextIndex: number) => {
    if (onIndexChange) {
      onIndexChange(nextIndex);
    } else {
      setInternalEqIndex(nextIndex);
    }
  };

  const handleNextEquipment = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = (activeEqIndex + 1) % EQUIPMENT_SHOWCASE_LIST.length;
    changeEquipmentIndex(next);
  };

  const handlePrevEquipment = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = (activeEqIndex - 1 + EQUIPMENT_SHOWCASE_LIST.length) % EQUIPMENT_SHOWCASE_LIST.length;
    changeEquipmentIndex(prev);
  };

  // Dimension classes based on size
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
  };

  const imageSizes = {
    sm: 'p-0.5',
    md: 'p-1',
    lg: 'p-1.5',
  };

  const isShimmerActive = currentMode === 'shimmer' || currentMode === 'all';
  const isFloatActive = currentMode === 'float' || currentMode === 'all';
  const isRadarActive = currentMode === 'radar' || currentMode === 'all';
  const isPulseActive = currentMode === 'pulse' || currentMode === 'all';

  return (
    <div className={`relative inline-flex items-center gap-2.5 ${className}`}>
      {/* Outer Logo Container with Animations */}
      <div
        className={`relative group cursor-pointer select-none ${isFloatActive ? 'animate-logo-float' : ''}`}
        onClick={() => {
          if (onClick) onClick();
          else setShowModeSelector((prev) => !prev);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={`مصر للأوناش - ${currentEquipment.nameAr} (${currentEquipment.capacityTon}T)`}
      >
        {/* Ambient Glow Aura */}
        <div
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600/40 via-amber-500/30 to-red-700/40 blur-md opacity-75 transition-all duration-500 group-hover:opacity-100 group-hover:blur-lg ${
            isPulseActive ? 'animate-logo-pulse' : ''
          }`}
        />

        {/* Outer Rotating Gear Ring */}
        <div className="absolute -inset-1 rounded-2xl overflow-hidden pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity">
          <div className="w-full h-full border border-dashed border-amber-400/60 rounded-2xl animate-logo-spin-slow" />
        </div>

        {/* Main Logo Card Badge */}
        <div
          className={`relative ${sizeClasses[size]} bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-red-500/80 shadow-lg flex items-center justify-center overflow-hidden transition-all duration-300 ${
            isHovered ? 'scale-105 border-red-400 shadow-red-500/30' : ''
          }`}
          style={{
            boxShadow: isHovered
              ? '0 0 20px rgba(220, 38, 38, 0.5), inset 0 0 12px rgba(212, 175, 55, 0.25)'
              : '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          {/* BACKGROUND EQUIPMENT IMAGES LAYER BEHIND THE LOGO */}
          {showEquipmentBackdrop && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {EQUIPMENT_SHOWCASE_LIST.map((eq, idx) => {
                const isActive = idx === activeEqIndex;
                return (
                  <div
                    key={eq.id}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                      isActive ? 'opacity-65 scale-110' : 'opacity-0 scale-100'
                    }`}
                    style={{
                      backgroundImage: `url(${eq.imageUrl})`,
                    }}
                  />
                );
              })}

              {/* High-contrast gradient vignette so the logo is vivid, crisp and readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-950/85" />
              <div className="absolute inset-0 bg-red-950/20 mix-blend-color" />
            </div>
          )}

          {/* Internal Mesh Background Grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none z-1"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
              backgroundSize: '5px 5px',
            }}
          />

          {/* Internal Shimmer / Shiny Light Beam Sweeping Across the Logo */}
          {isShimmerActive && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              <div
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/45 to-transparent transform -skew-x-25 animate-logo-shimmer"
                style={{ filter: 'blur(1px)' }}
              />
            </div>
          )}

          {/* Internal Radar Laser Scan Line */}
          {isRadarActive && (
            <div className="absolute inset-x-0 pointer-events-none z-20 overflow-hidden h-full">
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_6px_#38bdf8] animate-logo-radar" />
            </div>
          )}

          {/* Actual Egypt Cranes Logo Image in the foreground */}
          <img
            src="/assets/aistudio/Industrial_Crane_Emblem_and_Wordmark__1__8be0357c.png"
            alt="Egypt Cranes Logo"
            className={`w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] relative z-10 transition-transform duration-300 ${imageSizes[size]} ${
              isHovered ? 'scale-110' : ''
            }`}
          />

          {/* Corner Hydraulic Accents */}
          <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-amber-400/80 rounded-full z-20" />
          <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-red-500/80 rounded-full z-20" />

          {/* Hover Glint Effect */}
          {isHovered && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full blur-xs animate-ping pointer-events-none z-30" />
          )}
        </div>

        {/* Live System Indicator Dot with Equipment Badge */}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 z-30">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-900" />
        </span>

        {/* Equipment Capacity Micro-Badge */}
        {size !== 'sm' && (
          <span className="absolute -top-1.5 -left-1.5 z-30 text-[8px] font-black font-mono px-1 py-0.2 rounded bg-amber-400 text-slate-950 shadow-xs border border-amber-300">
            {currentEquipment.capacityTon}T
          </span>
        )}
      </div>

      {/* Equipment Name Pill Tooltip on Hover */}
      {isHovered && (
        <div className="absolute -bottom-8 right-0 z-50 whitespace-nowrap bg-slate-900/95 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xl border border-slate-700 flex items-center gap-1.5 animate-in fade-in duration-150">
          <Truck className="w-3 h-3 text-amber-400" />
          <span className="text-amber-300">{currentEquipment.model}</span>
          <span className="text-slate-400">({currentEquipment.capacityTon} طن)</span>
        </div>
      )}

      {/* Optional Title Beside Logo */}
      {showTitle && (
        <div className="flex flex-col text-right leading-tight select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-wide text-slate-800 bg-gradient-to-r from-slate-900 via-red-900 to-amber-900 bg-clip-text text-transparent">
              مصر للأوناش
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200">
              ERP v16
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 truncate max-w-[130px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-amber-700 font-bold">{currentEquipment.nameEn.split('(')[0]}</span>
          </span>
        </div>
      )}

      {/* Interactive Mode & Equipment Selector Popover */}
      {interactive && showModeSelector && (
        <div
          className="absolute top-full mt-2 right-0 z-50 w-72 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 rounded-xl p-3 shadow-2xl animate-in fade-in zoom-in-95 text-right"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/80">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">معدات الرفع في الخلفية</span>
            </div>
            <button
              onClick={() => setShowModeSelector(false)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          {/* Current Active Equipment Preview */}
          <div className="relative rounded-lg overflow-hidden border border-slate-700 mb-2.5 h-24">
            <img
              src={currentEquipment.imageUrl}
              alt={currentEquipment.nameAr}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-2 flex flex-col justify-end">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white truncate max-w-[170px]">
                  {currentEquipment.nameAr}
                </span>
                <span className="text-[10px] font-black bg-red-600 text-white px-1.5 py-0.2 rounded">
                  {currentEquipment.capacityTon}T
                </span>
              </div>
              <span className="text-[9px] text-amber-300 truncate">
                {currentEquipment.projectAr}
              </span>
            </div>

            {/* Prev / Next Equipment Buttons */}
            <button
              onClick={handlePrevEquipment}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center transition-colors shadow"
              title="المعدة السابقة"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextEquipment}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center transition-colors shadow"
              title="المعدة التالية"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Equipment Selector Grid (Thumbnails) */}
          <div className="mb-3">
            <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center justify-between">
              <span>اختر المعدة للعرض خلف اللوجو:</span>
              <button
                onClick={() => setIsAutoCycling(!isAutoCycling)}
                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded transition-colors ${
                  isAutoCycling ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isAutoCycling ? 'التبديل التلقائي: نشط' : 'التبديل التلقائي: متوقف'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {EQUIPMENT_SHOWCASE_LIST.map((eq, idx) => (
                <button
                  key={eq.id}
                  onClick={() => {
                    changeEquipmentIndex(idx);
                  }}
                  className={`relative rounded-md overflow-hidden border p-0.5 transition-all group ${
                    idx === activeEqIndex
                      ? 'border-amber-400 ring-1 ring-amber-400/50 scale-102'
                      : 'border-slate-700 opacity-70 hover:opacity-100 hover:border-slate-500'
                  }`}
                >
                  <img
                    src={eq.imageUrl}
                    alt={eq.model}
                    className="w-full h-9 object-cover rounded-sm"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/85 text-[8px] font-bold text-center text-slate-200 py-0.5 truncate px-0.5">
                    {eq.capacityTon}T
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Animation Modes Selector */}
          <div className="pt-2 border-t border-slate-700/80">
            <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>أنماط حركة اللوجو:</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setCurrentMode('all')}
                className={`text-[10px] p-1.5 rounded text-right transition-colors ${
                  currentMode === 'all' ? 'bg-red-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                شامل (All)
              </button>
              <button
                onClick={() => setCurrentMode('shimmer')}
                className={`text-[10px] p-1.5 rounded text-right transition-colors ${
                  currentMode === 'shimmer' ? 'bg-red-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                لمعان داخلي
              </button>
              <button
                onClick={() => setCurrentMode('float')}
                className={`text-[10px] p-1.5 rounded text-right transition-colors ${
                  currentMode === 'float' ? 'bg-red-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                تعويم هيدروليكي
              </button>
              <button
                onClick={() => setCurrentMode('radar')}
                className={`text-[10px] p-1.5 rounded text-right transition-colors ${
                  currentMode === 'radar' ? 'bg-red-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                مسح راداري
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
