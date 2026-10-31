import React, { useState } from 'react';
import {
  Truck,
  Shield,
  Activity,
  Award,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  ArrowRight,
  LogIn,
  Play,
  Film,
  Users,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Layers,
  Wrench,
  Compass,
  FileCheck,
  Building2,
  HardHat,
  Send,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  INITIAL_LANDING_SETTINGS,
  INITIAL_FEATURED_GLASS_CARDS,
} from '../../data/masterEnterpriseSeed';
import { StoryModeModal } from './StoryModeModal';

export const LandingPage: React.FC = () => {
  const { setActiveView, language, setLanguage, setLeadBookings, leadBookings, showToast } = useERP();

  const [activeGlassCardIndex, setActiveGlassCardIndex] = useState(0);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [selectedFleetCategory, setSelectedFleetCategory] = useState<string>('الكل');
  const [selectedProjectSector, setSelectedProjectSector] = useState<string>('الكل');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSubmittedSuccess, setBookingSubmittedSuccess] = useState(false);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    clientName: '',
    companyName: '',
    phone: '',
    email: '',
    selectedCraneModel: 'Liebherr LTM 11200-9.1 (1200 Ton)',
    projectLocation: '',
    startDate: '',
    durationDays: 7,
    maxLoadTon: 150,
    maxHeightMeters: 45,
    notes: '',
    whatsappConsent: true,
  });

  const settings = INITIAL_LANDING_SETTINGS;
  const featuredCards = INITIAL_FEATURED_GLASS_CARDS;
  const currentCard = featuredCards[activeGlassCardIndex] || featuredCards[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.clientName || !bookingForm.phone) {
      showToast('يرجى ملء الاسم ورقم الهاتف على الأقل');
      return;
    }

    setIsSubmittingBooking(true);
    setTimeout(() => {
      const newLead = {
        id: `lead-${Date.now()}`,
        leadNo: `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`,
        clientName: bookingForm.clientName,
        companyName: bookingForm.companyName || 'جهة خاصة',
        phone: bookingForm.phone,
        email: bookingForm.email || 'info@client.com',
        selectedCraneModel: bookingForm.selectedCraneModel,
        projectLocation: bookingForm.projectLocation || 'مصر',
        startDate: bookingForm.startDate || '2026-11-10',
        durationDays: Number(bookingForm.durationDays) || 7,
        maxLoadTon: Number(bookingForm.maxLoadTon) || 100,
        maxHeightMeters: Number(bookingForm.maxHeightMeters) || 40,
        notes: bookingForm.notes,
        source: 'نموذج الموقع' as const,
        status: 'طلب جديد' as const,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        whatsappConsentGiven: bookingForm.whatsappConsent,
      };

      setLeadBookings([newLead, ...leadBookings]);
      setIsSubmittingBooking(false);
      setBookingSubmittedSuccess(true);
      showToast('تم إرسال طلب الحجز بنجاح! تم إنشاء سجل Lead في نظام Cranes ERP');
    }, 800);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-600 selection:text-white" dir="rtl">
      {/* ==================== 1. TOP FIXED GLASS NAVBAR ==================== */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-red-500/80 p-1.5 flex items-center justify-center shadow-xl shadow-red-950/40">
              <img
                src="/assets/aistudio/Industrial_Crane_Emblem_and_Wordmark__1__8be0357c.png"
                alt="Egypt Cranes Official Emblem"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  EGYPT CRANES
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600/90 text-white shadow-xs">
                  v16 C-Style
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-300 hidden sm:block">
                شركة مصر للمقاولات المتخصصة (إيجيبت كرينز)
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-200">
            <button onClick={() => scrollToSection('hero')} className="hover:text-red-400 transition-colors cursor-pointer">
              الرئيسية
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-red-400 transition-colors cursor-pointer">
              عن الشركة
            </button>
            <button onClick={() => scrollToSection('fleet')} className="hover:text-red-400 transition-colors cursor-pointer">
              أسطول الأوناش
            </button>
            <button onClick={() => scrollToSection('services')} className="hover:text-red-400 transition-colors cursor-pointer">
              خدمات الرفع بالساعة
            </button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-red-400 transition-colors cursor-pointer">
              المشاريع القومية (+250)
            </button>
            <button onClick={() => scrollToSection('sheq')} className="hover:text-red-400 transition-colors cursor-pointer">
              السلامة SHEQ
            </button>
            <button onClick={() => scrollToSection('booking')} className="hover:text-red-400 transition-colors cursor-pointer">
              طلب عرض سعر
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Story Mode Button */}
            <button
              onClick={() => setIsStoryModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/40 backdrop-blur-md transition-all cursor-pointer shadow-sm"
              title="مشاهدة قصة كرينز السينمائية (2:00 دقيقة)"
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>شاهد القصة (2:00)</span>
            </button>

            {/* Customer Portal Link */}
            <button
              onClick={() => setActiveView('customer-portal')}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              title="دخول بوابة العملاء"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">بوابة العملاء</span>
            </button>

            {/* MANDATORY: ERP Login Button (Part A §6) */}
            <button
              onClick={() => setActiveView('workspace')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-950/60 border border-red-400/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="دخول إلى لوحة التحكم ونظام إدارة موارد المؤسسة"
            >
              <LogIn className="w-4 h-4" />
              <span>{settings.erpLoginButtonTextAr}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. HERO SECTION WITH VIDEO & GLASS CARDS ==================== */}
      <section id="hero" className="relative pt-24 pb-16 sm:pb-24 min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Ambient Video Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
          <video
            key={currentCard.mediaUrl}
            src={currentCard.mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1] saturate-[1.15] scale-105 transition-all duration-1000"
          />
          {/* Subtle Dark Vignette & Top/Bottom Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-slate-950 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/30 to-slate-950/90 pointer-events-none" />
        </div>

        {/* Hero Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-10 sm:pt-16 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left/Right Column: Hero Text & Call to Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-red-500/40 shadow-xl backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-200">
                  {settings.headlineEn} • HEAVY LIFTING SOLUTIONS
                </span>
              </div>

              {/* Mega Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
                  {settings.headlineAr}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-l from-red-400 via-red-500 to-amber-300">
                    بأقوى أسطول رافعات بمصر
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium">
                  {settings.subheadlineAr}
                </p>
              </div>

              {/* Verified KPI Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 max-w-2xl">
                <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md shadow-xl text-center">
                  <div className="text-xl sm:text-2xl font-black text-red-400 font-mono">
                    {settings.fleetCount}
                  </div>
                  <div className="text-[11px] font-bold text-slate-300">رافعة بالأسطول</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md shadow-xl text-center">
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                    {settings.projectCount}
                  </div>
                  <div className="text-[11px] font-bold text-slate-300">مشروع منجز</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md shadow-xl text-center">
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {settings.maxCapacityTon}
                  </div>
                  <div className="text-[11px] font-bold text-slate-300">أقصى حمولة رفع</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md shadow-xl text-center">
                  <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                    {settings.experienceYears}
                  </div>
                  <div className="text-[11px] font-bold text-slate-300">سنة خبرة راسخة</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap pt-2">
                <button
                  onClick={() => scrollToSection('booking')}
                  className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-xl shadow-red-950/80 border border-red-400/60 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>GET A QUOTE / اطلب عرض سعر بالساعة</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>

                <button
                  onClick={() => setActiveView('workspace')}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm shadow-xl border border-white/30 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-red-400" />
                  <span>دخول إلى النظام (ERP Desk)</span>
                </button>

                <button
                  onClick={() => setIsStoryModalOpen(true)}
                  className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>قصة كرينز (2:00)</span>
                </button>
              </div>
            </div>

            {/* Right Column: FEATURED PROJECTS 5 Glass Cards (ss1.mp4 & Part A §7) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                    FEATURED PROJECTS & SERVICES (01 - 05)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">انقر للتبديل والتفاعل</span>
              </div>

              {/* 5 Stacked Interactive Glass Cards */}
              <div className="space-y-2.5">
                {featuredCards.map((card, idx) => {
                  const isActive = idx === activeGlassCardIndex;
                  return (
                    <div
                      key={card.id}
                      onClick={() => setActiveGlassCardIndex(idx)}
                      onMouseEnter={() => setActiveGlassCardIndex(idx)}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                        isActive
                          ? 'bg-slate-900/85 border-red-500 shadow-2xl shadow-red-950/60 translate-x-1 backdrop-blur-xl'
                          : 'bg-slate-900/40 border-white/10 hover:bg-slate-900/60 hover:border-white/25 backdrop-blur-md'
                      }`}
                    >
                      {/* Active Red Indicator Strip */}
                      {isActive && (
                        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-amber-400" />
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-sm font-black font-mono px-2 py-0.5 rounded-lg ${
                              isActive
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {card.cardNo}
                          </span>
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-white">
                              {card.titleAr}
                            </h3>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">
                              {card.titleEn}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-amber-300 border border-amber-400/30 shrink-0">
                          {card.tagAr}
                        </span>
                      </div>

                      {isActive && (
                        <p className="text-xs text-slate-300 mt-2.5 leading-relaxed pt-2 border-t border-slate-800/80 animate-in fade-in duration-200">
                          {card.descriptionAr}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 3. BOTTOM HORIZONTAL GLASS STRIP (Part A §7.1) ==================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-12">
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/75 border border-white/20 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Banner Statement */}
            <div className="flex items-center gap-2.5 border-b md:border-b-0 md:border-l border-slate-700/80 pb-3 md:pb-0 md:pl-6 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-white">MORE THAN LIFTS</div>
                <div className="text-[10px] font-bold text-red-400 tracking-wider">
                  WE BUILD PROGRESS
                </div>
              </div>
            </div>

            {/* 5 Icons Horizontal Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-1 text-center">
              <div className="flex items-center gap-2 text-right">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">تغطية قومية</div>
                  <div className="text-[10px] text-slate-400">كافة محافظات مصر</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">السلامة أولاً</div>
                  <div className="text-[10px] text-slate-400">شهادات ISO معتمدة</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">حلول هندسية</div>
                  <div className="text-[10px] text-slate-400">خطط رفع V-102</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <Users className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">فريق معتمد</div>
                  <div className="text-[10px] text-slate-400">مشغلون وفنيو ريجر</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <Clock className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">جاهزية 24/7</div>
                  <div className="text-[10px] text-slate-400">نقل ودعم مستمر</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. BRANDS MARQUEE (Part A §3 & §7.4) ==================== */}
      <section className="py-8 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              ماركات الأسطول العالمية المعتمدة:
            </span>
            <div className="flex items-center gap-8 sm:gap-12 flex-wrap font-black font-mono text-sm sm:text-base text-slate-300">
              <span className="hover:text-red-400 transition-colors">LIEBHERR</span>
              <span className="hover:text-red-400 transition-colors">DEMAG</span>
              <span className="hover:text-red-400 transition-colors">GROVE</span>
              <span className="hover:text-red-400 transition-colors">TADANO</span>
              <span className="hover:text-red-400 transition-colors">HITACHI</span>
              <span className="hover:text-red-400 transition-colors">KRUPP</span>
              <span className="hover:text-red-400 transition-colors">SUMITOMO</span>
              <span className="hover:text-red-400 transition-colors">GOTTWALD</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. ABOUT US SECTION ==================== */}
      <section id="about" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>عن إيجيبت كرينز • تاريخ عريق منذ 1990</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                أكثر من ثلاثة عقود في صدارة الرفع الثقيل والنقل المتخصص بمصر
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                تأسست شركة مصر للمقاولات المتخصصة (إيجيبت كرينز) لتكون الذراع الهندسي والتنفيذي الأقوى لشركات المقاولات والقطاعات الصناعية الكبرى. نمتلك ونشغل أسطولاً يربو على مئة رافعة بقدرات تصل حتى 1200 طن، مع التزام صارم بالفوترة بالساعة وسجلات التشغيل الرقمية الدقيقة.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-2xl font-black text-red-500 font-mono">+100 ونش</div>
                  <div className="text-xs font-bold text-slate-300 mt-1">تلسكوبي ومجنزر وشاحنة</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-2xl font-black text-amber-400 font-mono">+250 مشروع</div>
                  <div className="text-xs font-bold text-slate-300 mt-1">مشاريع قومية واستراتيجية</div>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 aspect-video flex items-center justify-center">
              <video
                src="/assets/aistudio/Untitled_video__6__027704d9.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <div className="text-xs font-black text-red-400">Liebherr LTM 11200-9.1</div>
                  <div className="text-sm font-bold text-white">الرافعة العملاقة 1200 طن أثناء الرفع بمحطة الضبعة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. FLEET SHOWCASE & BOOKING ==================== */}
      <section id="fleet" className="py-20 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black text-red-400 uppercase tracking-widest">
                CRANE FLEET CATALOG
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
                أسطول الرافعات المتطورة المتاح للتأجير الفوري
              </h2>
            </div>
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['الكل', 'All-Terrain', 'Crawler', 'Rough-Terrain', 'Truck-Mounted'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFleetCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedFleetCategory === cat
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Crane Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Crane 1 */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-red-500/60 transition-all shadow-xl group space-y-4">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 relative">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80"
                  alt="Liebherr LTM 11200"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 text-xs font-black px-2.5 py-1 rounded-full bg-red-600 text-white shadow-md">
                  1200 Ton
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Liebherr (ألماني)</span>
                  <span className="text-emerald-400 font-bold">● متاح للتأجير بالساعة</span>
                </div>
                <h3 className="text-base font-black text-white">Liebherr LTM 11200-9.1</h3>
                <p className="text-xs text-slate-300 mt-1">
                  أقوى ونش تلسكوبي بالعالم، طول بوم 100 متر + جيب شبكي، 9 محاور دفع هيدروليكي.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">سعر الساعة: حسب خطة الرفع</span>
                <button
                  onClick={() => {
                    setBookingForm((prev) => ({
                      ...prev,
                      selectedCraneModel: 'Liebherr LTM 11200-9.1 (1200 Ton)',
                    }));
                    scrollToSection('booking');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  احجز الونش
                </button>
              </div>
            </div>

            {/* Crane 2 */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-red-500/60 transition-all shadow-xl group space-y-4">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 relative">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
                  alt="Demag CC 8800"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 text-xs font-black px-2.5 py-1 rounded-full bg-amber-600 text-white shadow-md">
                  1600 Ton
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Demag (ألماني)</span>
                  <span className="text-emerald-400 font-bold">● متاح للتأجير بالساعة</span>
                </div>
                <h3 className="text-base font-black text-white">Demag CC 8800-1 Crawler</h3>
                <p className="text-xs text-slate-300 mt-1">
                  رافعة مجنزرة عملاقة بوم شبكي لمفاعلات البترول وتوربينات الطاقة النووية والرياح.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">سعر الساعة: حسب العقد</span>
                <button
                  onClick={() => {
                    setBookingForm((prev) => ({
                      ...prev,
                      selectedCraneModel: 'Demag CC 8800-1 (1600 Ton Crawler)',
                    }));
                    scrollToSection('booking');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  احجز الونش
                </button>
              </div>
            </div>

            {/* Crane 3 */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-red-500/60 transition-all shadow-xl group space-y-4">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 relative">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                  alt="Grove GMK 6400"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 text-xs font-black px-2.5 py-1 rounded-full bg-red-600 text-white shadow-md">
                  400 Ton
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Grove (أمريكي/ألماني)</span>
                  <span className="text-emerald-400 font-bold">● متاح للتأجير بالساعة</span>
                </div>
                <h3 className="text-base font-black text-white">Grove GMK 6400 (400T)</h3>
                <p className="text-xs text-slate-300 mt-1">
                  أعلى قدرة رفع على 6 محاور بنظام MegaWingLift الهيدروليكي السريع للمشاريع الحضرية.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">سعر الساعة: تسعيرة رسمية</span>
                <button
                  onClick={() => {
                    setBookingForm((prev) => ({
                      ...prev,
                      selectedCraneModel: 'Grove GMK 6400 (400 Ton)',
                    }));
                    scrollToSection('booking');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  احجز الونش
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. HOURLY SERVICES & LIFT PLANNING ==================== */}
      <section id="services" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black text-red-400 uppercase tracking-widest">
              OUR SPECIALIZED SERVICES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              خدمات الرفع المتكاملة بنظام الفوترة بالساعة المعتمدة
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              قرار معتمد: الساعة هي وحدة التسعير والفوترة الأساسية مدعومة بسجلات تشغيل يومية وتوقيع إلكتروني للعميل.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">التأجير بالساعة المعتمدة</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                سعر ساعة متفق عليه، مع حساب ساعات العمل الفعلية وساعات الانتظار والإضافي بشفافية كاملة.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">تخطيط الرفع الهندسي V-102</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                دراسة زوايا البوم، أحمال الرياح، قدرة تحمل التربة، وتصاريح العمل السارية قبل بدء الرفعة.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">النقل الثقيل والتريلات (Heavy Haulage)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                أسطول تريلات Lowbed وسيارات مرافقة وتصاريح أمنية لنقل مكونات الأوناش والأوزان الفائقة.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">بيع واستيراد الأوناش المعتمدة</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                توريد وفحص واختبار أوناش جديدة ومستعملة معتمدة بضمان وشهادات Load Test دولية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 8. NATIONAL PROJECTS SHOWCASE (+250) ==================== */}
      <section id="projects" className="py-20 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black text-red-400 uppercase tracking-widest">
                NATIONAL MEGA PROJECTS (+250)
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
                صنعنا الفارق في أضخم مشروعات مصر القومية
              </h2>
            </div>
            <div className="text-xs font-bold text-slate-400 font-mono">
              +250 مشروع بنية تحتية وطاقة وصناعة
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-red-400">قطاع الطاقة والكهرباء</span>
              <h3 className="text-lg font-black text-white">مشروع محطة الضبعة النووية</h3>
              <p className="text-xs text-slate-300">
                تشغيل متواصل لرافعات ليبهير وديمج لتركيب كمرات خرسانية ومفاعلات الرفع الثقيل بدقة بالغة.
              </p>
              <div className="pt-2 text-[11px] text-slate-400 font-mono">الأسطول المشارك: LTM 11200 + LTM 1500</div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400">قطاع النقل والأنفاق</span>
              <h3 className="text-lg font-black text-white">مشروع المونوريل والقطار السريع</h3>
              <p className="text-xs text-slate-300">
                رفع وتركيب الكمرات سابقة الصب وقطاعات المسار المرتفع بالعاصمة الإدارية ومدينة نصر.
              </p>
              <div className="pt-2 text-[11px] text-slate-400 font-mono">الأسطول المشارك: Grove GMK 6400 + Demag AC 700</div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-cyan-400">قطاع البترول والغاز</span>
              <h3 className="text-lg font-black text-white">مصفاة تكرير ميدور وتوسعات السويس</h3>
              <p className="text-xs text-slate-300">
                نقل ورفع أبراج التقطير الضخمة ومعدات التكسير الهيدروجيني بأوناش مجنزرة 1600 طن.
              </p>
              <div className="pt-2 text-[11px] text-slate-400 font-mono">الأسطول المشارك: Demag CC 8800 Crawler</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 9. SHEQ & SAFETY CERTIFICATIONS ==================== */}
      <section id="sheq" className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                  ISO & SHEQ CERTIFIED QUALITY
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                منظومة السلامة والجودة والبيئة (SHEQ) المعتمدة دولياً
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                تطبق شركة مصر للمقاولات المتخصصة أقصى معايير السلامة المهنية لحماية الأرواح والمعدات والمنشآت. حاصلون على شهادات الجودة والبيئة والسلامة والصحة المهنية المعتمدة.
              </p>
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700">
                  ISO 9001:2015 (الجودة)
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700">
                  ISO 14001:2015 (البيئة)
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700">
                  ISO 45001:2018 (السلامة والصحة المهنية)
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700">
                  OHSAS 18001
                </span>
              </div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-slate-950/80 border border-white/10 shrink-0">
              <div className="text-4xl font-black text-emerald-400 font-mono">0 حوادث</div>
              <div className="text-xs font-bold text-slate-300 mt-1">سجل نظيف بملايين ساعات العمل</div>
              <div className="text-[10px] text-slate-400 mt-2 font-mono">Zero Lost Time Injuries (LTI)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 10. BOOKING QUOTATION FORM (Generates Lead) ==================== */}
      <section id="booking" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-black text-red-400 uppercase tracking-widest">
              REQUEST A HOURLY QUOTATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              اطلب عرض سعر تأجير بالساعة ورفع هندسي
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              املأ بيانات موقعك والمعدة المطلوبة، وسيقوم فريق هندسة العمليات بالتواصل فوراً وإرسال عرض السعر المعتمد.
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
            {bookingSubmittedSuccess ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">تم استلام طلبك بنجاح!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  تم تسجيل طلب الحجز كـ Lead في نظام Cranes ERP، وتم إرسال رسالة واتساب تأكيدية على رقم هاتفك.
                </p>
                <button
                  onClick={() => setBookingSubmittedSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                >
                  إرسال طلب إضافي
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      الاسم الكامل للمهندس / المسؤول *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.clientName}
                      onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                      placeholder="م. أحمد محمد"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      اسم الشركة أو الجهة المتعاقدة
                    </label>
                    <input
                      type="text"
                      value={bookingForm.companyName}
                      onChange={(e) => setBookingForm({ ...bookingForm, companyName: e.target.value })}
                      placeholder="شركة المقاولات / الهيئة"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      رقم الهاتف / الواتساب *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="+20 100 000 0000"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-red-500 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      البريد الإلكتروني للشركة
                    </label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="procurement@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-red-500 text-left font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      طراز الرافعة المطلوبة
                    </label>
                    <select
                      value={bookingForm.selectedCraneModel}
                      onChange={(e) => setBookingForm({ ...bookingForm, selectedCraneModel: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-red-500"
                    >
                      <option value="Liebherr LTM 11200-9.1 (1200 Ton)">Liebherr LTM 11200 (1200 Ton)</option>
                      <option value="Demag CC 8800-1 (1600 Ton Crawler)">Demag CC 8800 Crawler (1600 Ton)</option>
                      <option value="Liebherr LTM 1500-8.1 (500 Ton)">Liebherr LTM 1500 (500 Ton)</option>
                      <option value="Grove GMK 6400 (400 Ton)">Grove GMK 6400 (400 Ton)</option>
                      <option value="Demag AC 700 (700 Ton)">Demag AC 700 (700 Ton)</option>
                      <option value="Tadano ATF 220G-5 (220 Ton)">Tadano ATF 220G (220 Ton)</option>
                      <option value="Krupp KMK 6160 (160 Ton)">Krupp KMK 6160 (160 Ton)</option>
                      <option value="أوناش تلسكوبية 30-100 طن">أوناش خفيفة ومتوسطة (30 إلى 100 طن)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      موقع المشروع والمحافظة
                    </label>
                    <input
                      type="text"
                      value={bookingForm.projectLocation}
                      onChange={(e) => setBookingForm({ ...bookingForm, projectLocation: e.target.value })}
                      placeholder="مثال: محطة الضبعة / العاصمة الإدارية"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      تاريخ بدء العمل الميداني
                    </label>
                    <input
                      type="date"
                      value={bookingForm.startDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      أقصى وزن للقطعة (طن)
                    </label>
                    <input
                      type="number"
                      value={bookingForm.maxLoadTon}
                      onChange={(e) => setBookingForm({ ...bookingForm, maxLoadTon: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      أقصى ارتفاع للرفع (متر)
                    </label>
                    <input
                      type="number"
                      value={bookingForm.maxHeightMeters}
                      onChange={(e) => setBookingForm({ ...bookingForm, maxHeightMeters: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-red-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ملاحظات هندسية أو متطلبات خاصة (طبيعة الأرض، عوائق، خطة الرفع V-102)
                  </label>
                  <textarea
                    rows={3}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="اكتب أي تفاصيل إضافية عن الرفعة..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-red-500"
                  />
                </div>

                {/* WhatsApp Consent Checkbox (Part B §5) */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="waConsent"
                    checked={bookingForm.whatsappConsent}
                    onChange={(e) => setBookingForm({ ...bookingForm, whatsappConsent: e.target.checked })}
                    className="rounded-md border-slate-700 text-red-600 focus:ring-red-500 accent-red-600 w-4 h-4"
                  />
                  <label htmlFor="waConsent" className="text-xs text-slate-300 cursor-pointer">
                    أوافق على استلام عرض السعر وتأكيد الحجز والتحديثات الميدانية عبر تطبيق واتساب.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm shadow-xl shadow-red-950/60 border border-red-400/50 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingBooking ? 'جارٍ الإرسال والتسجيل...' : 'إرسال طلب الحجز وعرض السعر'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ==================== 11. FAQ ACCORDION ==================== */}
      <section className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-red-400 uppercase tracking-widest">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white">الأسئلة الشائعة</h2>
          </div>

          <div className="space-y-3">
            <details className="p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer group">
              <summary className="text-xs sm:text-sm font-bold text-white flex items-center justify-between">
                <span>كيف يتم احتساب الفوترة وتحديد ساعات العمل المفوترة؟</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed border-t border-slate-800 pt-2">
                تعتمد الفوترة الأساسية على الساعات المسجلة في سجل التشغيل اليومي (Usage Log) من واقع عداد المحرك وتقرير مهندس الموقع، مع تطبيق معامل الساعات الإضافية والانتظار والحد الأدنى المتفق عليه في العقد.
              </p>
            </details>

            <details className="p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer group">
              <summary className="text-xs sm:text-sm font-bold text-white flex items-center justify-between">
                <span>هل يوفر النظام خطط رفع هندسية معتمدة (Lift Plans V-102)؟</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed border-t border-slate-800 pt-2">
                نعم، يتولى فريق هندسة الرفع لدينا إعداد دراسة كاملة لنصف قطر الرفع، توزيع أوزان البوم والوايرات، اختبار التربة، واعتماد مسؤول السلامة قبل إعطاء تصريح التشغيل.
              </p>
            </details>

            <details className="p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer group">
              <summary className="text-xs sm:text-sm font-bold text-white flex items-center justify-between">
                <span>ما هي إجراءات السلامة المتبعة وفحوصات الأمان الدورية؟</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed border-t border-slate-800 pt-2">
                تخضع جميع الرافعات لفحص يومي قبل التشغيل، واختبار أمان سنوي (Load Test) معتمد بطرف ثالث، مع شهادات ISO 45001 و 9001 و 14001 ومشغلين معتمدين فقط.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ==================== 12. FOOTER & CONTACT ==================== */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <Truck className="w-5 h-5 text-red-500" />
                <span>EGYPT CRANES ERP</span>
              </div>
              <p className="leading-relaxed">
                شركة مصر للمقاولات المتخصصة - رائدة الرفع الثقيل وتأجير الأوناش التلسكوبية والمجنزرة من 30 إلى 1200 طن.
              </p>
              <div className="text-[11px] font-mono text-slate-500">ISO 9001 • ISO 14001 • ISO 45001</div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-white">بيانات التواصل المباشر</h4>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-400" />
                <span dir="ltr">{settings.contactPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span dir="ltr">{settings.whatsappPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{settings.contactEmail}</span>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-white">العنوان والورش</h4>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{settings.addressAr}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                مستودع وورشة الأوناش الكبرى: طريق القاهرة/السويس الصحراوي - متاح 24/7.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-white">روابط سريعة للنظام</h4>
              <button
                onClick={() => setActiveView('workspace')}
                className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>دخول إلى نظام Cranes ERP</span>
              </button>
              <button
                onClick={() => setActiveView('customer-portal')}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>بوابة العملاء والمشروعات</span>
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} شركة مصر للمقاولات المتخصصة (Egypt Cranes).
            </div>
            <div className="flex items-center gap-4">
              <span>سياسة الخصوصية وحماية البيانات</span>
              <span>شروط تأجير الأوناش والسلامة</span>
              <span className="text-red-400 font-mono">v16 C-Style</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ==================== 13. FLOATING WHATSAPP BUTTON (Part B §5) ==================== */}
      <a
        href={`https://wa.me/201008181125?text=${encodeURIComponent(
          'مرحباً إيجيبت كرينز، أرغب بالاستفسار عن حجز رافعة لرفع ثقيل بالساعة بمشروعنا.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-950/80 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/40"
        title="تحدث معنا فوراً عبر واتساب (دعم 24/7)"
      >
        <MessageSquare className="w-7 h-7 fill-white" />
        <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-red-500 animate-ping" />
        <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-red-500" />
      </a>

      {/* ==================== 14. STORY MODE MODAL ==================== */}
      <StoryModeModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        onGoToLogin={() => setActiveView('workspace')}
        onOpenBooking={() => scrollToSection('booking')}
      />
    </div>
  );
};
