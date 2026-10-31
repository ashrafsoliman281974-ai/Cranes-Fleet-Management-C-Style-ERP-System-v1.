import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  CreditCard,
  FileText,
  Users,
  Plus,
  ArrowUpRight,
  Shield,
  FileSpreadsheet,
  Settings,
  Palette,
  Languages,
  Calendar,
  Layers,
  Sparkles,
  Truck,
  Wrench,
  Activity,
  FileSignature,
  BookOpen,
  Target,
  Database,
  ExternalLink,
  Landmark,
  Package,
  QrCode,
  Image as ImageIcon,
  Check,
  ChevronDown,
  SlidersHorizontal,
  Eye,
  Maximize2,
  X,
  Film,
  Video,
  VolumeX,
  Play,
  Pause,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { gregorianToHijri } from '../../utils/hijri';
import craneWelcomeBanner from '../../assets/images/crane_welcome_banner.jpg';
import craneFleetBanner from '../../assets/images/crane_fleet_banner.jpg';
import craneBrandEmblem from '../../assets/images/crane_brand_emblem.png';

interface BannerBgOption {
  id: string;
  type: 'video' | 'image';
  title: string;
  subtitle: string;
  mediaUrl: string;
  poster?: string;
  tag: string;
}

const BANNER_BACKGROUND_OPTIONS: BannerBgOption[] = [
  {
    id: 'egypt-cranes-fleet-video-new',
    type: 'video',
    title: 'فيديو أسطول ومشاريع Egypt Cranes (الملف المرفق الجديد)',
    subtitle: 'فيديو تشغيل الرافعات الميدانية بالمواقع القومية - يظهر بالكامل بالشاشة بدون قص',
    mediaUrl: '/assets/aistudio/Untitled_video__6__027704d9.mp4',
    tag: 'فيديو الأسطول الجديد (عرض كامل)',
  },
  {
    id: 'digen-3d-logo',
    type: 'video',
    title: 'فيديو شعار الأوناش ثلاثي الأبعاد 3D',
    subtitle: 'أنيميشن ثلاثي الأبعاد معدني لشعار وهيئة CRANES - صامت',
    mediaUrl: '/assets/aistudio/Digen_video_1_64a2df0b.mp4',
    tag: 'فيديو 3D أنيميشن',
  },
  {
    id: 'attached-video',
    type: 'video',
    title: 'فيديو تشغيل الأوناش الميداني (فيديو الموقع)',
    subtitle: 'فيديو حي لعمليات الرفع الثقيل بالموقع - بدون صوت (Muted)',
    mediaUrl: '/assets/aistudio/VID-20260929-WA0006_2a3ccfa8.mp4',
    poster: craneWelcomeBanner,
    tag: 'فيديو تشغيل ميداني',
  },
  {
    id: 'attached-crawler',
    type: 'image',
    title: 'الرافعة المجنزرة العملاقة 1200T (Sunset Lift)',
    subtitle: 'الصورة الفوتوغرافية - أوناش الرفع الثقيل بالموقع الميداني',
    mediaUrl: craneWelcomeBanner,
    tag: 'صورة فوتوغرافية',
  },
  {
    id: 'fleet-site',
    type: 'image',
    title: 'أسطول رافعات ليبهير بالموقع الصناعي',
    subtitle: 'منظومة الرافعات التلسكوبية والشبكية',
    mediaUrl: craneFleetBanner,
    tag: 'موقع العمل',
  },
  {
    id: 'brand-emblem',
    type: 'image',
    title: 'شعار وهوية Egypt Cranes الهندسية',
    subtitle: 'العلامة التجارية والرمز الصناعي للرافعات',
    mediaUrl: craneBrandEmblem,
    tag: 'علامة الهوية',
  },
];

export const WorkspaceHome: React.FC = () => {
  const {
    invoices,
    journalEntries,
    contracts,
    operationsStatuses,
    setActiveInvoice,
    setActiveView,
    setIsThemeModalOpen,
    setIsTranslationModalOpen,
    loginSettings,
    t,
  } = useERP();

  // Banner background customization state (stored in localStorage)
  // Default unconditionally to the newly attached fleet video
  const [activeBgId, setActiveBgId] = useState<string>(() => {
    return localStorage.getItem('erp_banner_bg_id_v8') || 'egypt-cranes-fleet-video-new';
  });

  // Video sizing mode: 'contain' to display fully without cropping, or 'cover' to fill
  const [videoFitMode, setVideoFitMode] = useState<'contain' | 'cover'>(() => {
    return (localStorage.getItem('erp_banner_fit_v8') as 'contain' | 'cover') || 'contain';
  });

  // Default to maximum transparency for background overlay (3% opacity = 97% transparent!)
  const [overlayOpacity, setOverlayOpacity] = useState<number>(() => {
    const saved = localStorage.getItem('erp_banner_transparency_v8');
    return saved ? parseInt(saved, 10) : 3;
  });

  // Glass cards transparency state: default 10% opacity = 90% ultra-transparent glass!
  const [glassOpacity, setGlassOpacity] = useState<number>(() => {
    const saved = localStorage.getItem('erp_banner_glass_v8');
    return saved ? parseInt(saved, 10) : 10;
  });

  const [showBgMenu, setShowBgMenu] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ambientVideoRef = useRef<HTMLVideoElement | null>(null);

  const selectedBg =
    BANNER_BACKGROUND_OPTIONS.find((b) => b.id === activeBgId) ||
    BANNER_BACKGROUND_OPTIONS[0];

  // Auto-play muted video safely on mount and media change
  useEffect(() => {
    if (videoRef.current && selectedBg.type === 'video') {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
      if (ambientVideoRef.current) {
        ambientVideoRef.current.defaultMuted = true;
        ambientVideoRef.current.muted = true;
        ambientVideoRef.current.play().catch(() => {});
      }
      setIsVideoPlaying(true);
    }
  }, [selectedBg.mediaUrl, selectedBg.type, videoFitMode]);

  const handleSelectBg = (id: string) => {
    setActiveBgId(id);
    localStorage.setItem('erp_banner_bg_id_v8', id);
    setIsVideoPlaying(true);
  };

  const handleVideoFitChange = (mode: 'contain' | 'cover') => {
    setVideoFitMode(mode);
    localStorage.setItem('erp_banner_fit_v8', mode);
  };

  const toggleVideoFitMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMode = videoFitMode === 'contain' ? 'cover' : 'contain';
    handleVideoFitChange(nextMode);
  };

  const handleOpacityChange = (val: number) => {
    setOverlayOpacity(val);
    localStorage.setItem('erp_banner_transparency_v8', String(val));
  };

  const handleGlassOpacityChange = (val: number) => {
    setGlassOpacity(val);
    localStorage.setItem('erp_banner_glass_v8', String(val));
  };

  const toggleVideoPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      ambientVideoRef.current?.play().catch(() => {});
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      ambientVideoRef.current?.pause();
      setIsVideoPlaying(false);
    }
  };

  const getDynamicOverlay = (opacityPct: number) => {
    const factor = opacityPct / 100;
    const o1 = Math.min(0.85, factor * 1.05).toFixed(2);
    const o2 = Math.min(0.70, factor * 0.55).toFixed(2);
    const o3 = Math.min(0.80, factor * 0.90).toFixed(2);
    return `linear-gradient(90deg, rgba(10, 20, 32, ${o1}) 0%, rgba(27, 54, 93, ${o2}) 50%, rgba(10, 20, 32, ${o3}) 100%)`;
  };

  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.outstandingAmount, 0);

  const activeCranes = operationsStatuses.filter((s) => s.currentStatus === 'في الموقع (يعمل)').length;
  const transitCranes = operationsStatuses.filter((s) => s.currentStatus === 'في الطريق (ترانزيت)').length;
  const breakdownCranes = operationsStatuses.filter((s) => s.currentStatus === 'عطل / صيانة طارئة').length;

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Welcome Banner with Attached Video/Media strictly contained inside */}
      <div
        className="rounded-2xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 isolate border border-slate-600/70 min-h-[240px] sm:min-h-[270px]"
        style={{
          backgroundColor: '#0c1524',
          boxShadow: '0 12px 40px -4px rgba(0, 0, 0, 0.55), 0 2px 10px -1px rgba(185, 28, 28, 0.35)',
        }}
      >
        {/* Background Media Container - strictly constrained to banner borders */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          {selectedBg.type === 'video' ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Ambient backdrop glow to fill canvas edges gracefully when fitting full video */}
              {videoFitMode === 'contain' && (
                <video
                  ref={ambientVideoRef}
                  key={`ambient-${selectedBg.mediaUrl}`}
                  src={selectedBg.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-center filter blur-2xl scale-110 opacity-45 pointer-events-none"
                />
              )}
              {/* Main Video Element: displays completely on screen without cropping */}
              <video
                ref={videoRef}
                key={`main-${selectedBg.mediaUrl}-${videoFitMode}`}
                src={selectedBg.mediaUrl}
                poster={selectedBg.poster}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className={`w-full h-full relative z-0 transition-all duration-300 ${
                  videoFitMode === 'contain'
                    ? 'object-contain object-center'
                    : 'object-cover object-center'
                }`}
                style={{
                  filter: 'contrast(1.05) saturate(1.1) brightness(1.0)',
                }}
              />
            </div>
          ) : (
            <img
              src={selectedBg.mediaUrl}
              alt="خلفية بانر أوناش مصر"
              className="w-full h-full object-cover object-center transition-all duration-700"
              style={{
                objectPosition: selectedBg.id === 'brand-emblem' ? 'center' : 'center 38%',
                filter:
                  selectedBg.id === 'brand-emblem'
                    ? 'brightness(1.2) drop-shadow(0 0 16px rgba(239,68,68,0.5))'
                    : 'contrast(1.08) saturate(1.15) brightness(0.92)',
              }}
            />
          )}

          {/* Maximum-Transparency Overlay: whisper-light so the video shines at peak clarity */}
          <div
            className="absolute inset-0 transition-all duration-300 pointer-events-none"
            style={{
              background: getDynamicOverlay(overlayOpacity),
            }}
          />

          {/* Subtle bottom dark vignette for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Decorative Gold & Crimson Top Shimmer Edge */}
        <div
          className="absolute top-0 right-0 left-0 h-1.5 z-20 shadow-xs pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, #b91c1c 0%, #d4af37 25%, #fff3b0 50%, #d4af37 75%, #b91c1c 100%)',
          }}
        />

        {/* Banner Content (Header + Badge + Details) in ultra-transparent frosted glass container */}
        <div 
          className="flex items-center gap-3.5 sm:gap-5 z-10 relative p-3.5 sm:p-5 rounded-2xl border border-white/25 transition-all shadow-2xl max-w-2xl"
          style={{
            backgroundColor: `rgba(15, 23, 42, ${glassOpacity / 100})`,
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
        >
          {/* Logo Badge */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-slate-950/80 border-2 border-red-500 p-1.5 flex items-center justify-center shrink-0 shadow-2xl backdrop-blur-xs">
            <img
              src="/assets/aistudio/Industrial_Crane_Emblem_and_Wordmark__1__8be0357c.png"
              alt="Egypt Cranes Logo"
              className="max-h-full max-w-full object-contain filter drop-shadow-md"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full text-slate-950 shadow-xs"
                style={{
                  backgroundColor: 'var(--accent-metallic, #d4af37)',
                }}
              >
                Egypt Cranes ERP v16 C-Style
              </span>

              {selectedBg.type === 'video' ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-950/70 text-red-200 border border-red-500/50 backdrop-blur-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <Film className="w-3 h-3 text-red-400" />
                  <span>{selectedBg.id === 'digen-3d-logo' ? 'فيديو 3D أنيميشن' : 'فيديو تشغيل حي'} (بدون صوت)</span>
                  <VolumeX className="w-3 h-3 text-red-300 opacity-90" />
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white/95 border border-white/20 backdrop-blur-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  منظومة الرفع الثقيل المتكاملة
                </span>
              )}

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                شفافية الزجاج: {100 - glassOpacity}%
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
              {loginSettings.companyNameAr}
            </h1>

            <p className="text-xs sm:text-sm text-slate-100 max-w-xl leading-relaxed drop-shadow-[0_1px_5px_rgba(0,0,0,0.9)] hidden sm:block font-medium">
              إدارة أسطول الأوناش والرافعات من 30 إلى 1200 طن، بوابات الخروج والدخول، عقود التشغيل، الحسابات وقيود اليومية، ومراكز التكلفة.
            </p>
          </div>
        </div>

        {/* Quick Actions in Banner with matching ultra-transparent frosted glass container */}
        <div 
          className="flex items-center gap-2 z-10 flex-wrap relative p-2 sm:p-2.5 rounded-2xl border border-white/25 shadow-2xl"
          style={{
            backgroundColor: `rgba(15, 23, 42, ${glassOpacity / 100})`,
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
        >
          <button
            onClick={() => setActiveView('fleet')}
            className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-black bg-white text-slate-950 hover:bg-slate-100 shadow-md transition-transform active:scale-95 border border-white/80 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-red-600" />
            <span>أسطول الأوناش (1200T)</span>
          </button>

          <button
            onClick={() => setActiveView('gate-ops')}
            className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-black bg-slate-950/80 text-white hover:bg-slate-900 shadow-md transition-transform active:scale-95 border border-red-500/50 backdrop-blur-md cursor-pointer"
          >
            <Activity className="w-4 h-4 text-red-400" />
            <span>لوحة التشغيل والبوابة</span>
          </button>

          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors border border-white/30 cursor-pointer"
          >
            <Palette className="w-4 h-4 text-amber-300" />
            <span>تخصيص الثيم</span>
          </button>

          {/* If video, provide quick play/pause button */}
          {selectedBg.type === 'video' && (
            <button
              onClick={toggleVideoPlayback}
              className="p-2 sm:p-2.5 rounded-xl text-xs font-bold bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md border border-white/25 transition-all cursor-pointer shadow-sm"
              title={isVideoPlaying ? 'إيقاف الفيديو مؤقتاً' : 'تشغيل الفيديو'}
            >
              {isVideoPlaying ? (
                <Pause className="w-4 h-4 text-amber-400" />
              ) : (
                <Play className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          )}

          {/* Video Sizing Display Mode Toggle (Fit Contain vs Cover) */}
          {selectedBg.type === 'video' && (
            <button
              onClick={toggleVideoFitMode}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-bold bg-slate-900/80 hover:bg-slate-800 text-cyan-300 backdrop-blur-md border border-cyan-400/40 transition-all cursor-pointer shadow-sm"
              title={
                videoFitMode === 'contain'
                  ? 'الوضع الحالي: يظهر بالكامل بالشاشة 100% بدون قص (انقر للتبديل إلى ملء البانر)'
                  : 'الوضع الحالي: ملء البانر (انقر للتبديل إلى احتواء كامل بدون أي قص)'
              }
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">
                {videoFitMode === 'contain' ? 'مقاس كامل (بدون قص)' : 'ملء البانر'}
              </span>
            </button>
          )}

          {/* Banner Background & Transparency Settings Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowBgMenu(!showBgMenu)}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-bold bg-slate-900/85 hover:bg-slate-800 text-amber-300 backdrop-blur-md transition-all border border-amber-400/50 shadow-sm cursor-pointer"
              title="تغيير خلفية البانر أو ضبط الشفافية"
            >
              {selectedBg.type === 'video' ? (
                <Video className="w-4 h-4 text-red-400" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">الخلفية والشفافية</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* Interactive Background & Transparency Settings Dropdown */}
            {showBgMenu && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-slate-100 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black">خيارات خلفية البانر وشفافية الزجاج</span>
                  </div>
                  <button
                    onClick={() => setShowBgMenu(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Preset Options */}
                <div className="mt-3 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400">اختر ملف الميديا داخل البانر:</div>
                  {BANNER_BACKGROUND_OPTIONS.map((opt) => {
                    const isSelected = opt.id === activeBgId;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectBg(opt.id)}
                        className={`w-full text-right p-2.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-950/50 border-red-500 shadow-xs'
                            : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-700 shrink-0 relative bg-slate-950 flex items-center justify-center">
                          {opt.type === 'video' ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                              <video
                                src={opt.mediaUrl}
                                muted
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Play className="w-3.5 h-3.5 text-white fill-white" />
                              </div>
                            </div>
                          ) : (
                            <img
                              src={opt.mediaUrl}
                              alt={opt.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold truncate text-white">
                              {opt.title}
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                              {opt.tag}
                            </span>
                            <p className="text-[10px] text-slate-400 truncate">
                              {opt.subtitle}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Video Sizing & Fit Mode Controls (When Video is Selected) */}
                {selectedBg.type === 'video' && (
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>ضبط مقاس الفيديو داخل البانر:</span>
                      </span>
                      <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                        {videoFitMode === 'contain' ? 'يظهر بالكامل بدون قص' : 'ملء المساحة'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleVideoFitChange('contain')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          videoFitMode === 'contain'
                            ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-sm'
                            : 'bg-slate-800/80 text-slate-400 border-slate-700/70 hover:bg-slate-850 hover:text-white'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${videoFitMode === 'contain' ? 'opacity-100 text-cyan-400' : 'opacity-0'}`} />
                        <span>احتواء كامل (يظهر 100%)</span>
                      </button>

                      <button
                        onClick={() => handleVideoFitChange('cover')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          videoFitMode === 'cover'
                            ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-sm'
                            : 'bg-slate-800/80 text-slate-400 border-slate-700/70 hover:bg-slate-850 hover:text-white'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${videoFitMode === 'cover' ? 'opacity-100 text-cyan-400' : 'opacity-0'}`} />
                        <span>ملء البانر (Cover)</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      {videoFitMode === 'contain'
                        ? '✓ مقاس الفيديو مضبوط ليظهر بالكامل بدون اقتطاع أي جزء، مع خلفية ديناميكية متناسقة.'
                        : '• يتم ملء أبعاد البانر بالكامل مع قص طفيف للحواف.'}
                    </p>
                  </div>
                )}

                {/* Glass Cards Transparency Controls */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>شفافية البطاقات الزجاجية (Glass Cards):</span>
                    </span>
                    <span className="text-xs text-cyan-400 font-mono font-bold">
                      {100 - glassOpacity}% شفاف
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={glassOpacity}
                    onChange={(e) => handleGlassOpacityChange(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>شفافية قصوى (95%)</span>
                    <span className="text-cyan-300 font-medium">الحالي: {100 - glassOpacity}%</span>
                    <span>شبه معتم (40%)</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 pt-0.5">
                    <button
                      onClick={() => handleGlassOpacityChange(8)}
                      className={`px-1 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                        glassOpacity === 8
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      زجاج 92%
                    </button>
                    <button
                      onClick={() => handleGlassOpacityChange(15)}
                      className={`px-1 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                        glassOpacity === 15
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      زجاج 85%
                    </button>
                    <button
                      onClick={() => handleGlassOpacityChange(30)}
                      className={`px-1 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                        glassOpacity === 30
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      زجاج 70%
                    </button>
                    <button
                      onClick={() => handleGlassOpacityChange(50)}
                      className={`px-1 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                        glassOpacity === 50
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      زجاج 50%
                    </button>
                  </div>
                </div>

                {/* Background Video Transparency Slider Controls */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                      <span>شفافية غطاء الفيديو (Video Overlay):</span>
                    </span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">
                      {100 - overlayOpacity}% ساطع
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={overlayOpacity}
                    onChange={(e) => handleOpacityChange(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>فيديو نقي 100%</span>
                    <span className="text-amber-300 font-medium">السطوع: {100 - overlayOpacity}%</span>
                    <span>تغميق (40%)</span>
                  </div>
                </div>

                {/* Preview Full Attached Media Button */}
                <div className="mt-3 pt-2">
                  <button
                    onClick={() => {
                      setShowBgMenu(false);
                      setShowFullImageModal(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>معاينة {selectedBg.type === 'video' ? 'الفيديو المرفق' : 'الصورة'} بالحجم الكامل</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Attached Media Lightbox Modal */}
      {showFullImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowFullImageModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {selectedBg.type === 'video' ? (
                  <Film className="w-4 h-4 text-red-500" />
                ) : (
                  <Truck className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs font-bold">{selectedBg.title}</span>
                {selectedBg.type === 'video' && (
                  <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded-full border border-red-500/40">
                    تشغيل بدون صوت (Muted)
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowFullImageModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-hidden">
              {selectedBg.type === 'video' ? (
                <video
                  src={selectedBg.mediaUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-w-full max-h-[72vh] rounded-lg shadow-lg object-contain mx-auto"
                />
              ) : (
                <img
                  src={selectedBg.mediaUrl}
                  alt={selectedBg.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                />
              )}
            </div>
            <div className="p-3 bg-slate-900 flex items-center justify-between text-xs text-slate-300">
              <span>{selectedBg.subtitle}</span>
              <button
                onClick={() => setShowFullImageModal(false)}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Operating Cranes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">أوناش تعمل بالمواقع القومية</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-800 font-mono tabular-nums">
            {activeCranes} رافعات بالموقع
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>حقل ظهر، العاصمة، محطة الجيزة</span>
          </div>
        </div>

        {/* Metric 2: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">إجمالي مبيعات وعقود التأجير</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono tabular-nums">
            {(totalSales / 1000).toFixed(2)} ألف ج.م
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>محدث بالكامل مع الفواتير</span>
          </div>
        </div>

        {/* Metric 3: Contracts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">عقود الرفع الثقيل السارية</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileSignature className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-amber-900 font-mono tabular-nums">
            {contracts.length} عقود معتمدة
          </div>
          <div className="text-[11px] text-amber-700 font-medium">باشتراطات الأمان والسلامة</div>
        </div>

        {/* Metric 4: Breakdowns status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">أعطال تحت الصيانة بالورشة</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-red-700 font-mono tabular-nums">
            {breakdownCranes} بلاغات صيانة
          </div>
          <div className="text-[11px] text-slate-400">فحص هيدروليك واستبدال قطع الغيار</div>
        </div>
      </div>

      {/* Core Enterprise Modules Navigation Matrix (3 Columns) */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-800 tracking-tight">
          وحدات إدارة وتشغيل Egypt Cranes المتكاملة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Fleet & Crane Operations */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-red-600" />
                <span>أسطول الأوناش والتشغيل الميداني</span>
              </span>
              <span className="text-[10px] bg-red-50 text-red-800 px-2 py-0.5 rounded-full font-mono font-bold">
                1200T
              </span>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => setActiveView('fleet')}
                className="w-full text-right p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900 flex items-center justify-between transition-colors"
              >
                <span>دليل أسطول الرافعات والمشاريع (egyptcranes.com)</span>
                <span className="text-[10px] text-red-600 font-bold">استعراض ←</span>
              </button>

              <button
                onClick={() => setActiveView('fleet-maintenance')}
                className="w-full text-right p-2 rounded-lg text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-50 to-red-50/50 hover:from-amber-100 hover:to-red-100 flex items-center justify-between transition-all border border-amber-300/80 shadow-xs"
              >
                <span className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-700" />
                  <span>لوحة صيانة الأسطول ومواعيد الخدمة (D3.js)</span>
                </span>
                <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-mono font-black shadow-xs">
                  D3 مباشر ←
                </span>
              </button>

              <button
                onClick={() => setActiveView('daily-operations')}
                className="w-full text-right p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900 flex items-center justify-between transition-colors"
              >
                <span>التشغيل والورديات وجدول مشغلي الأوناش</span>
                <span className="text-[10px] text-red-600 font-bold">ورديات ←</span>
              </button>

              <button
                onClick={() => setActiveView('gate-ops')}
                className="w-full text-right p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-900 flex items-center justify-between transition-colors"
              >
                <span>لوحة متابعة التشغيل اليومي وبوابة الأوناش</span>
                <span className="text-[10px] text-red-600 font-bold">مباشر ←</span>
              </button>

              <button
                onClick={() => setActiveView('contracts')}
                className="w-full text-right p-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <span>عقود التأجير والتشغيل مع سهولة الاشتراطات</span>
                <span className="text-[10px] text-slate-400">عقود</span>
              </button>
            </div>
          </div>

          {/* Column 2: Accounting, Journals & Cost Centers */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-700" />
                <span>الحسابات وقيود اليومية ومراكز التكلفة</span>
              </span>
              <span className="text-[10px] bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-full font-mono">
                مالية
              </span>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => setActiveView('journals')}
                className="w-full text-right p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 flex items-center justify-between transition-colors"
              >
                <span>قيود اليومية المحاسبية (Journal Entries)</span>
                <span className="text-[10px] text-indigo-700 font-bold font-mono">
                  {journalEntries.length} قيود
                </span>
              </button>

              <button
                onClick={() => setActiveView('treasury')}
                className="w-full text-right p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                  <span>الخزائن وحافظة الشيكات وأذون القبض والصرف (QR)</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">الخزينة ←</span>
              </button>

              <button
                onClick={() => setActiveView('inventory')}
                className="w-full text-right p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-600" />
                  <span>المخازن وكروت الأصناف والتحميل على الأوناش</span>
                </span>
                <span className="text-[10px] text-amber-700 font-bold">المخازن ←</span>
              </button>

              <button
                onClick={() => setActiveView('cost-centers')}
                className="w-full text-right p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 flex items-center justify-between transition-colors"
              >
                <span>مراكز التكلفة وتتبع موازنات المشاريع</span>
                <span className="text-[10px] text-indigo-700 font-bold">مراكز التكلفة</span>
              </button>

              <button
                onClick={() => setActiveView('ledger')}
                className="w-full text-right p-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <span>تقرير دفتر الأستاذ العام (General Ledger)</span>
                <span className="text-[10px] text-slate-400">تقرير</span>
              </button>
            </div>
          </div>

          {/* Column 3: Administration, Users & Backup */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-700" />
                <span>المستخدمين والنسخ الاحتياطي والأمان</span>
              </span>
              <span className="text-[10px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full font-mono">
                نظام
              </span>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => setActiveView('users')}
                className="w-full text-right p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-900 flex items-center justify-between transition-colors"
              >
                <span>واجهة تعديل وبيانات المستخدمين والصلاحيات</span>
                <span className="text-[10px] text-purple-700 font-bold">المستخدمين</span>
              </button>

              <button
                onClick={() => setActiveView('backup')}
                className="w-full text-right p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-900 flex items-center justify-between transition-colors"
              >
                <span>واجهة النسخ الاحتياطي واستعادة البيانات</span>
                <span className="text-[10px] text-purple-700 font-bold">النسخ الاحتياطي</span>
              </button>

              <button
                onClick={() => setIsTranslationModalOpen(true)}
                className="w-full text-right p-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <span>الترجمة الفورية من الواجهة (In-Context)</span>
                <span className="text-[10px] text-sky-600">ترجمة حية</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices & Crane Movements */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-0">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">أحدث فواتير وعقود تأجير الأوناش</h2>
            <p className="text-xs text-slate-500">مع التواريخ الهجرية وتفقيط المبالغ بالعربية والإنجليزية</p>
          </div>
          <button
            onClick={() => setActiveView('invoices')}
            className="text-xs font-bold text-red-700 hover:underline"
          >
            عرض الكل ({invoices.length}) ←
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold whitespace-nowrap">
              <tr>
                <th className="py-3 px-4">رقم الفاتورة</th>
                <th className="py-3 px-4">العميل والمشروع</th>
                <th className="py-3 px-4">التاريخ (ميلادي / هجري)</th>
                <th className="py-3 px-4 text-left">الإجمالي الكلي</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {invoices.map((inv) => {
                const hijri = gregorianToHijri(inv.postingDate);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {inv.invoiceNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{inv.customerNameAr}</div>
                      <div className="text-[10px] text-slate-400 font-sans" dir="ltr">
                        {inv.customerNameEn}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-700">{inv.postingDate}</div>
                      <span
                        className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 text-amber-900 border"
                        style={{
                          backgroundColor: 'var(--accent-metallic-light, #fef3c7)',
                          borderColor: 'var(--accent-metallic, #d4af37)',
                        }}
                      >
                        {hijri.formattedAr}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left font-mono font-bold text-slate-900 tabular-nums">
                      <div>
                        {inv.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} {inv.currency}
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans truncate max-w-xs" title={inv.amountInWordsAr}>
                        {inv.amountInWordsAr}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inv.status === 'معتمدة'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'ملغاة'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setActiveInvoice(inv);
                          setActiveView('new-invoice');
                        }}
                        className="px-3 py-1 rounded-md text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        فتح النموذج
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
