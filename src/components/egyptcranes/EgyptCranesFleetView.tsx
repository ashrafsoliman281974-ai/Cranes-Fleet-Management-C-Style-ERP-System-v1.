import React, { useState } from 'react';
import {
  Truck,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Building,
  FileSignature,
  Filter,
  Search,
  ArrowUpRight,
  Sparkles,
  Award,
  Clock,
  Layers,
  Wrench,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { EgyptCraneFleetItem } from '../../types/erp';

export const EgyptCranesFleetView: React.FC = () => {
  const { fleet, setActiveContract, setActiveView, t } = useERP();

  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFleet = fleet.filter((crane) => {
    if (typeFilter !== 'All' && !crane.typeAr.includes(typeFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        crane.model.toLowerCase().includes(q) ||
        crane.brand.toLowerCase().includes(q) ||
        crane.typeAr.toLowerCase().includes(q) ||
        crane.featuredProjectsAr.some((p) => p.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleBookCrane = (crane: EgyptCraneFleetItem) => {
    setActiveContract({
      id: `cnt-${Date.now()}`,
      contractNo: `CRN-CNT-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientNameAr: '',
      projectNameAr: crane.featuredProjectsAr[0] || 'مشروع جديد',
      craneModel: `${crane.model} (${crane.capacityTon} Ton)`,
      craneCapacityTon: crane.capacityTon,
      startDate: '2026-07-26',
      endDate: '2026-09-26',
      rateType: 'شهري',
      rateAmount: crane.capacityTon >= 500 ? 650000 : 350000,
      mobilizationFee: 120000,
      currency: 'EGP',
      status: 'مسودة',
      operatorIncluded: true,
      fuelIncluded: false,
      terms: [],
    });
    setActiveView('new-contract');
  };

  const majorProjects = [
    {
      nameAr: 'حقل ظهر العملاق للغاز الطبيعي (Zohr Gas Field)',
      locationAr: 'بورسعيد / البحر المتوسط',
      clientAr: 'شركة بتروبل / إيني الإيطالية',
      cranesUsedAr: 'أوناش 500 طن و 700 طن لرفع أبراج التبريد وتثبيت وحدات المعالجة',
      status: 'مشروع وطني استراتيجي',
    },
    {
      nameAr: 'البرج الأيقوني ومونوريل العاصمة الإدارية (New Capital)',
      locationAr: 'العاصمة الإدارية الجديدة',
      clientAr: 'تحالف أوراسكوم والمقاولون العرب / وزارة النقل',
      cranesUsedAr: 'أوناش ليبهير وديمج 700 طن و 1200 طن لتركيب الكمرات مسبقة الصنع',
      status: 'بنية تحتية متطورة',
    },
    {
      nameAr: 'محطة كهرباء شمال الجيزة المركبة 2250 ميجاوات',
      locationAr: 'شمال الجيزة / كومبرة',
      clientAr: 'هيئة كهرباء مصر / شركة جنوب الجيزة',
      cranesUsedAr: 'أوناش مجنزرة 600 طن Liebherr LR 1600 لتثبيت التوربينات الغازية',
      status: 'مشروع طاقة كهربائية عملاق',
    },
    {
      nameAr: 'مجمع السويس للصلب وتوسعات مصانع الدرفلة',
      locationAr: 'المنطقة الاقتصادية لقناة السويس',
      clientAr: 'شركة السويس للصلب',
      cranesUsedAr: 'أوناش رفع أوزان ثقيلة 400 طن و 500 طن لتركيب أفران الصهر',
      status: 'صناعات ثقيلة',
    },
    {
      nameAr: 'توسعات رصيف ميناء أبو قير البحري الجديد',
      locationAr: 'خليج أبو قير / الإسكندرية',
      clientAr: 'تحالف الموانئ البحرية الدولية',
      cranesUsedAr: 'رافعات تلسكوبية ومجنزرة لتثبيت كتل الأرصفة الخرسانية البحرية',
      status: 'موانئ ولوجستيات',
    },
    {
      nameAr: 'مجمع موبكو للبتروكيماويات والأسمدة (Mopco)',
      locationAr: 'دمياط / المنطقة الحرة',
      clientAr: 'مصر لإنتاج الأسمدة (موبكو)',
      cranesUsedAr: 'رافعات تلسكوبية 600 طن لتركيب مفاعلات اليوريا والأمونيا',
      status: 'بتروكيماويات وطاقة',
    },
  ];

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Official Header with Company Logo & Website Link */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Logo / Emblem */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-slate-900 border-2 border-red-600 p-2 flex items-center justify-center shrink-0 shadow-md">
            <img
              src="/assets/aistudio/Industrial_Crane_Emblem_and_Wordmark__1__8be0357c.png"
              alt="Egypt Cranes Logo"
              className="max-h-full max-w-full object-contain filter drop-shadow"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                منذ 1990 (أكثر من 35 عاماً من الريادة)
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">ISO 9001, 14001, 45001</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              شركة مصر للمقاولات المتخصصة (إيجيبت كرينز - Egypt Cranes)
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed hidden sm:block">
              الأسطول الأكبر والأقوى في جمهورية مصر العربية والشرق الأوسط لتأجير وتشغيل الرافعات الهيدروليكية والمجنزرة من 30 طن وحتى 1200 طن، وحلول هندسة الرفع الثقيل (Heavy Lifting & Engineering Solutions).
            </p>
          </div>
        </div>

        {/* Website Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
          <a
            href="https://egyptcranes.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
          >
            <span>زيارة الموقع الرسمي: egyptcranes.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Fleet Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">أسطول الرافعات والأوناش (Cranes Fleet)</h2>
            <p className="text-xs text-slate-500">
              حمولة تبدأ من 30 طن وتصل حتى 1200 طن لرافعات Liebherr, Demag, Grove, Tadano
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالموديل، الماركة، أو المشروع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg pr-9 pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'All', label: 'جميع الرافعات' },
            { id: 'All-Terrain', label: 'رافعات لجميع التضاريس (All-Terrain)' },
            { id: 'Crawler', label: 'رافعات مجنزرة بوم شبكي (Crawler)' },
            { id: 'Rough', label: 'رافعات أراضي وعرة (Rough Terrain)' },
          ].map((flt) => {
            const isSelected = typeFilter === flt.id;
            return (
              <button
                key={flt.id}
                onClick={() => setTypeFilter(flt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {flt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFleet.map((crane) => (
          <div
            key={crane.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4 hover:shadow-md transition-shadow relative flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-red-600 tracking-wider block uppercase">
                    {crane.brand} Heavy Lift
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-tight">{crane.model}</h3>
                </div>

                <div className="text-center bg-slate-900 text-white px-2.5 py-1 rounded-xl shadow-xs">
                  <span className="text-sm font-black font-mono leading-none block">{crane.capacityTon}</span>
                  <span className="text-[9px] text-amber-300 font-bold block">TON</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {crane.typeAr}
              </div>

              {/* Technical Specs */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block">طول البوم الرئيسي:</span>
                  <span className="font-mono font-bold text-slate-800">{crane.mainBoomMeters} متر</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block">أقصى ارتفاع للخطاف:</span>
                  <span className="font-mono font-bold text-slate-800">{crane.maxTipHeightMeters} متر</span>
                </div>
              </div>

              {/* Featured In Real Egyptian Projects */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">أبرز مشاريع الرافعة بمصر:</span>
                <div className="flex flex-wrap gap-1">
                  {crane.featuredProjectsAr.map((p, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Booking & Maintenance Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  crane.currentStatus === 'متاح للتأجير'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {crane.currentStatus}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveView('fleet-maintenance')}
                  title="سجل ومواعيد صيانة الرافعة"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-700" />
                  <span>الصيانة (D3)</span>
                </button>

                <button
                  onClick={() => handleBookCrane(crane)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  <span>إعداد عقد (+)</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Major Projects Section from egyptcranes.com */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            سجل مشاريع شركة مصر للأوناش (Egypt Cranes Featured Projects)
          </h2>
          <p className="text-xs text-slate-500">
            مشاركة استراتيجية في كبرى المشاريع القومية للبترول والغاز، الطاقة، والبنية التحتية بجمهورية مصر العربية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {majorProjects.map((proj, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {proj.status}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{proj.locationAr}</span>
              </div>

              <h4 className="text-xs font-black text-slate-900 leading-tight">{proj.nameAr}</h4>

              <div className="text-[11px] text-slate-600">
                <span className="font-bold text-slate-700">الجهة / العميل:</span> {proj.clientAr}
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-700 block mb-0.5">الرافعات المستخدمة:</span>
                {proj.cranesUsedAr}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
