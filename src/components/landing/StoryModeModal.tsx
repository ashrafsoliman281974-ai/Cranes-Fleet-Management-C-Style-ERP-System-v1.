import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Film,
  Sparkles,
  ArrowRight,
  LogIn,
  CheckCircle,
} from 'lucide-react';
import { StorySceneItem } from '../../types/erp';
import { INITIAL_STORY_SCENES } from '../../data/masterEnterpriseSeed';
import { useERP } from '../../context/ERPContext';

interface StoryModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
  onOpenBooking: () => void;
}

export const StoryModeModal: React.FC<StoryModeModalProps> = ({
  isOpen,
  onClose,
  onGoToLogin,
  onOpenBooking,
}) => {
  const { language } = useERP();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [secondsElapsedInScene, setSecondsElapsedInScene] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const scenes = INITIAL_STORY_SCENES;
  const currentScene = scenes[currentSceneIndex] || scenes[0];

  // Auto-advance scenes every 6 seconds if playing
  useEffect(() => {
    if (!isOpen) return;

    setSecondsElapsedInScene(0);
    const interval = setInterval(() => {
      if (isPlaying) {
        setSecondsElapsedInScene((prev) => {
          if (prev >= currentScene.durationSeconds - 1) {
            // Advance to next scene
            setCurrentSceneIndex((idx) => {
              if (idx < scenes.length - 1) {
                return idx + 1;
              } else {
                // Loop or pause at end
                return idx;
              }
            });
            return 0;
          }
          return prev + 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, currentSceneIndex, currentScene.durationSeconds, scenes.length]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') nextScene();
      if (e.key === 'ArrowRight') prevScene();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSceneIndex]);

  const nextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
      setSecondsElapsedInScene(0);
    }
  };

  const prevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
      setSecondsElapsedInScene(0);
    }
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullScreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between text-white select-none animate-in fade-in duration-300"
      dir="rtl"
    >
      {/* 1. Top Header Bar & Scene Navigation Scrubber */}
      <div className="z-30 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-red-500/60 p-1 flex items-center justify-center shadow-lg">
              <img
                src="/assets/aistudio/Industrial_Crane_Emblem_and_Wordmark__1__8be0357c.png"
                alt="Egypt Cranes Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wide text-red-400">
                  CRANES STORY MODE
                </span>
                <span className="text-[10px] bg-red-950/80 text-red-300 px-2 py-0.5 rounded-full border border-red-500/40">
                  المشهد {currentScene.sceneNumber} من 20 (2:00 دقيقة)
                </span>
              </div>
              <p className="text-sm font-bold text-slate-200">
                قصة ريادة الرفع الثقيل بالمشاريع القومية منذ 1990
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              title={isMuted ? 'تشغيل الصوت الموسيقي' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={toggleFullScreen}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="ملء الشاشة"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white border border-red-400/50 transition-all cursor-pointer"
              title="إغلاق القصة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 20-Segment Story Timeline Progress Bar */}
        <div className="grid grid-cols-20 gap-1.5 mt-4 max-w-7xl mx-auto">
          {scenes.map((scene, idx) => {
            const isPassed = idx < currentSceneIndex;
            const isCurrent = idx === currentSceneIndex;
            const progressPercent = isCurrent
              ? ((secondsElapsedInScene + 1) / scene.durationSeconds) * 100
              : isPassed
              ? 100
              : 0;

            return (
              <button
                key={scene.id}
                onClick={() => {
                  setCurrentSceneIndex(idx);
                  setSecondsElapsedInScene(0);
                }}
                className="group relative h-1.5 rounded-full overflow-hidden bg-slate-800 hover:h-2.5 transition-all cursor-pointer"
                title={`المشهد ${idx + 1}: ${scene.titleAr}`}
              >
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Stage Area (Full Visual Backdrop & Dynamic Scene Narrative) */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4 sm:px-12">
        {/* Dynamic Video / Motion Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video
            ref={videoRef}
            key={currentScene.mediaUrl}
            src={currentScene.mediaUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.08] saturate-[1.15]"
          />
          {/* Subtle vignette and cinematic dark gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80 pointer-events-none" />
        </div>

        {/* Cinematic Narrative Glass Card in Center */}
        <div className="max-w-3xl w-full mx-auto p-6 sm:p-10 rounded-3xl bg-slate-950/70 border border-white/20 shadow-2xl backdrop-blur-xl relative z-10 space-y-4 animate-in fade-in zoom-in-95 duration-500 text-center">
          {/* Top Badge */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-600 text-white shadow-md">
              SCENE {currentScene.sceneNumber.toString().padStart(2, '0')}
            </span>
            {currentScene.badgeAr && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 backdrop-blur-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentScene.badgeAr}</span>
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700">
              {currentScene.cameraMotion}
            </span>
          </div>

          {/* Titles */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
              {currentScene.titleAr}
            </h2>
            <p className="text-xs sm:text-sm font-black tracking-widest text-red-400 font-mono uppercase">
              {currentScene.titleEn}
            </p>
          </div>

          {/* Body Narrative Quote */}
          <p className="text-base sm:text-xl md:text-2xl font-bold text-slate-100 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pt-2">
            «{currentScene.captionAr}»
          </p>
          <p className="text-xs sm:text-sm text-slate-400 italic">
            "{currentScene.captionEn}"
          </p>

          {/* Final Scene (Scene 20) Call To Action Buttons */}
          {currentScene.sceneNumber === 20 && (
            <div className="pt-6 border-t border-slate-700/80 flex items-center justify-center gap-3 sm:gap-4 flex-wrap animate-in fade-in slide-in-from-bottom-3 duration-500">
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm shadow-xl shadow-red-900/50 border border-red-400 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>اطلب عرض سعر الرفع والتشغيل</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onGoToLogin();
                }}
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-xl border border-white/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-red-400" />
                <span>دخول إلى نظام Cranes ERP v16</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Controls Bar */}
      <div className="z-30 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Previous Button */}
          <button
            onClick={prevScene}
            disabled={currentSceneIndex === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              currentSceneIndex === 0
                ? 'opacity-40 border-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-slate-900/80 hover:bg-slate-800 text-white border-white/20'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>المشهد السابق</span>
          </button>

          {/* Central Play/Pause Controller */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-2xl bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-900/50 flex items-center justify-center transition-transform active:scale-95 cursor-pointer border border-red-400/40"
              title={isPlaying ? 'إيقاف مؤقت' : 'متابعة التشغيل'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>
            <span className="text-xs font-mono text-slate-300">
              0{Math.floor((currentSceneIndex * 6 + secondsElapsedInScene) / 60)}:
              {((currentSceneIndex * 6 + secondsElapsedInScene) % 60).toString().padStart(2, '0')} / 02:00
            </span>
          </div>

          {/* Next Button */}
          <button
            onClick={nextScene}
            disabled={currentSceneIndex === scenes.length - 1}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              currentSceneIndex === scenes.length - 1
                ? 'opacity-40 border-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white border-red-400/40 shadow-md'
            }`}
          >
            <span>المشهد التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
