import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Layers,
  ChevronLeft,
  Truck,
  Activity,
  FileSignature,
  BookOpen,
  Database,
  Palette,
  Languages,
  UserCheck,
  ChevronDown,
  ShieldCheck,
  Bell,
  Menu,
  Globe,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { gregorianToHijri, formatDateISO } from '../../utils/hijri';

export const TopHeader: React.FC = () => {
  const {
    activeView,
    setActiveView,
    language,
    setIsThemeModalOpen,
    setIsTranslationModalOpen,
    setIsMobileSidebarOpen,
    currentUser,
    setCurrentUser,
    users,
    journalEntries,
    loginSettings,
    t,
  } = useERP();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const pendingApprovalsCount = journalEntries.filter((j) => j.status === 'بانتظار الاعتماد').length;

  const today = new Date();
  const todayISO = formatDateISO(today);
  const hijriToday = gregorianToHijri(today);

  // Generate breadcrumb titles
  const getBreadcrumbs = () => {
    const crumbs = [{ title: language === 'ar' ? 'الرئيسية' : 'Home', action: () => setActiveView('workspace') }];

    if (activeView === 'fleet') {
      crumbs.push({ title: 'أسطول الأوناش والمشاريع (Egypt Cranes)', action: () => setActiveView('fleet') });
    } else if (activeView === 'gate-ops') {
      crumbs.push({ title: 'بوابة الأوناش ولوحة التشغيل والأعطال', action: () => setActiveView('gate-ops') });
    } else if (activeView === 'contracts') {
      crumbs.push({ title: 'عقود التأجير والتشغيل', action: () => setActiveView('contracts') });
    } else if (activeView === 'new-contract') {
      crumbs.push({ title: 'عقود التأجير والتشغيل', action: () => setActiveView('contracts') });
      crumbs.push({ title: 'عقد جديد', action: () => {} });
    } else if (activeView === 'journals') {
      crumbs.push({ title: 'الحسابات وقيود اليومية', action: () => setActiveView('journals') });
    } else if (activeView === 'new-jv') {
      crumbs.push({ title: 'الحسابات وقيود اليومية', action: () => setActiveView('journals') });
      crumbs.push({ title: 'قيد يومية جديد', action: () => {} });
    } else if (activeView === 'cost-centers') {
      crumbs.push({ title: 'مراكز التكلفة والمشاريع', action: () => setActiveView('cost-centers') });
    } else if (activeView === 'users') {
      crumbs.push({ title: 'إدارة المستخدمين والصلاحيات', action: () => setActiveView('users') });
    } else if (activeView === 'backup') {
      crumbs.push({ title: 'النسخ الاحتياطي واستعادة البيانات', action: () => setActiveView('backup') });
    } else if (activeView === 'invoices') {
      crumbs.push({ title: 'فواتير المبيعات والتأجير', action: () => setActiveView('invoices') });
    } else if (activeView === 'new-invoice') {
      crumbs.push({ title: 'فواتير المبيعات والتأجير', action: () => setActiveView('invoices') });
      crumbs.push({ title: 'فاتورة جديدة', action: () => {} });
    } else if (activeView === 'ledger') {
      crumbs.push({ title: 'دفتر الأستاذ العام', action: () => setActiveView('ledger') });
    } else if (activeView === 'financial-statements') {
      crumbs.push({ title: 'القوائم المالية والتقارير الختامية', action: () => setActiveView('financial-statements') });
    } else if (activeView === 'equipment-costing') {
      crumbs.push({ title: 'تحليل تكلفة ساعة التشغيل للأوناش', action: () => setActiveView('equipment-costing') });
    } else if (activeView === 'budget-management') {
      crumbs.push({ title: 'الموازنات التقديرية وتنبيهات الحظر', action: () => setActiveView('budget-management') });
    } else if (activeView === 'permissions') {
      crumbs.push({ title: 'مدير الصلاحيات (RBAC)', action: () => setActiveView('permissions') });
    } else if (activeView === 'fleet-maintenance') {
      crumbs.push({ title: 'متابعة صيانة الأسطول', action: () => setActiveView('fleet-maintenance') });
    } else if (activeView === 'multi-cheques') {
      crumbs.push({ title: 'إدارة الشيكات المجمعة والـ FIFO', action: () => setActiveView('multi-cheques') });
    } else if (activeView === 'banking-reconciliation') {
      crumbs.push({ title: 'البنوك وخطابات الضمان والمطابقة الآلية', action: () => setActiveView('banking-reconciliation') });
    } else if (activeView === 'biometric-attendance') {
      crumbs.push({ title: 'حضور بصمة ADMS Push ولقطات ATTPHOTO', action: () => setActiveView('biometric-attendance') });
    } else if (activeView === 'payroll-calculation') {
      crumbs.push({ title: 'مسير الرواتب ومراكز تكلفة الأوناش', action: () => setActiveView('payroll-calculation') });
    } else if (activeView === 'unified-messaging') {
      crumbs.push({ title: 'محرك الرسائل الموحد WhatsApp / SMS', action: () => setActiveView('unified-messaging') });
    } else if (activeView === 'itrack-gps') {
      crumbs.push({ title: 'تكامل i-Track GPS ومطابقة ساعات المحرك', action: () => setActiveView('itrack-gps') });
    } else if (activeView === 'integration-status') {
      crumbs.push({ title: 'لوحة حالة ومراقبة التكاملات الخارجية', action: () => setActiveView('integration-status') });
    } else if (activeView === 'audit-trail') {
      crumbs.push({ title: 'سجل التدقيق والحوكمة والامتثال (Audit Trail)', action: () => setActiveView('audit-trail') });
    } else if (activeView === 'landing-cms') {
      crumbs.push({ title: 'إدارة محتوى صفحة الهبوط (Landing CMS)', action: () => setActiveView('landing-cms') });
    } else if (activeView === 'landing-preview') {
      crumbs.push({ title: 'صفحة الهبوط العامة C-Style', action: () => setActiveView('landing-preview') });
    } else if (activeView === 'customer-portal') {
      crumbs.push({ title: 'بوابة العميل الرقمية', action: () => setActiveView('customer-portal') });
    } else if (activeView === 'employee-portal') {
      crumbs.push({ title: 'بوابة الموظف الذاتية', action: () => setActiveView('employee-portal') });
    } else if (activeView === 'login-settings') {
      crumbs.push({ title: 'إعدادات صفحة الدخول', action: () => setActiveView('login-settings') });
    } else if (activeView === 'login-preview') {
      crumbs.push({ title: 'معاينة صفحة الدخول', action: () => {} });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-14 bg-white border-b border-slate-200/90 px-3 sm:px-5 flex items-center justify-between shrink-0 select-none z-10 shadow-xs gap-2">
      {/* Right side in RTL: Hamburger + Breadcrumbs & Quick Global Search */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors shrink-0 flex items-center justify-center border border-slate-200/90 active:scale-95 cursor-pointer"
          aria-label="القائمة الجانبية"
          title="فتح القائمة الرئيسية"
        >
          <Menu className="w-5 h-5 text-slate-800" />
        </button>

        {/* Breadcrumb Path */}
        <nav className="flex items-center gap-1 sm:gap-1.5 text-xs font-medium text-slate-500 overflow-x-auto no-scrollbar max-w-[150px] sm:max-w-none py-1 shrink-0">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronLeft className="w-3.5 h-3.5 text-slate-400 rotate-180 shrink-0" />}
              <button
                onClick={crumb.action}
                className={`transition-colors truncate max-w-[120px] sm:max-w-none ${
                  idx === breadcrumbs.length - 1
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {crumb.title}
              </button>
            </React.Fragment>
          ))}
        </nav>

        {/* Global Search Bar */}
        <div className="relative hidden xl:block w-64 2xl:w-72">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t('Search crane, contract, voucher (Ctrl + G)...', 'بحث في أسطول الأوناش، العقود، القيود (Ctrl + G)...', 'Search...')}
            className="w-full text-xs bg-slate-100/90 border border-slate-200/90 rounded-lg pr-9 pl-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Left side in RTL: Date Badge, Theme & Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Dual Date Badge (Islamic Hijri + Gregorian Today) */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 py-1 text-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-bold text-slate-800 font-mono tabular-nums">{todayISO}</span>
          <span className="text-slate-300">|</span>
          <span
            className="font-semibold text-xs px-1.5 py-0.5 rounded text-amber-900"
            style={{ backgroundColor: 'var(--accent-metallic-light, #fef3c7)' }}
          >
            {hijriToday.formattedAr}
          </span>
        </div>

        {/* Pending Approvals Quick Alert Button */}
        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => setActiveView('journals')}
            className="flex items-center gap-1 sm:gap-1.5 text-xs font-bold px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-2xs animate-pulse shrink-0"
            title="يوجد طلبات اعتماد قيود محاسبية معلقة"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">{pendingApprovalsCount} اعتماد معلق</span>
            <span className="sm:hidden font-mono">{pendingApprovalsCount}</span>
          </button>
        )}

        {/* Quick Public Landing Page Button */}
        <button
          onClick={() => setActiveView('landing-preview')}
          className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-900 transition-colors shadow-2xs shrink-0 cursor-pointer"
          title="عرض صفحة الهبوط العامة بالمؤثرات والقصة والمشروعات"
        >
          <Globe className="w-3.5 h-3.5 text-red-700 animate-spin" style={{ animationDuration: '15s' }} />
          <span className="hidden sm:inline">صفحة الهبوط</span>
        </button>

        {/* Quick Integration Health Button */}
        <button
          onClick={() => setActiveView('integration-status')}
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
          title="مراقبة وحالة التكاملات الستة (i-Track, ADMS, Meta WhatsApp, WPS, etc.)"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>التكاملات (6)</span>
        </button>

        {/* Quick C-Style Theme Button */}
        <button
          onClick={() => setIsThemeModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 shadow-2xs shrink-0"
          title="تخصيص ألوان وثيم C-Style"
        >
          <Palette className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden md:inline">الثيم</span>
        </button>

        {/* Quick In-Context Translation Button */}
        <button
          onClick={() => setIsTranslationModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 shadow-2xs shrink-0"
          title="الترجمة الفورية من الواجهة"
        >
          <Languages className="w-3.5 h-3.5 text-sky-600" />
          <span className="hidden md:inline">ترجمة</span>
        </button>

        {/* User Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-slate-800 shadow-2xs"
            title="تبديل حساب المستخدم لتجربة الاعتماد (Maker vs Checker)"
          >
            <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
              {currentUser.nameAr.charAt(0)}
            </div>
            <span className="hidden md:inline">{currentUser.nameAr.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-right animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-400 font-bold">
                تبديل المستخدم (اختبار دورة الاعتماد):
              </div>
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setCurrentUser(u);
                    setIsUserMenuOpen(false);
                  }}
                  className={`w-full text-right px-3 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors ${
                    currentUser.id === u.id ? 'bg-red-50 text-red-900 font-bold' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{u.nameAr}</span>
                    {u.canApproveFinance ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                        معتمد (Checker)
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                        منفذ (Maker)
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 truncate">{u.roleAr}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
