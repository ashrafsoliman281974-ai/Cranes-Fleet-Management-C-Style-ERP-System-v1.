import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingCart,
  Landmark,
  ShoppingBag,
  Package,
  Building2,
  Factory,
  FolderKanban,
  FileSpreadsheet,
  ShieldCheck,
  Sliders,
  Palette,
  Languages,
  Plus,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Truck,
  Activity,
  FileSignature,
  BookOpen,
  Target,
  Users,
  Database,
  LogOut,
  Calendar,
  CalendarClock,
  Folder,
  FolderOpen,
  FileText,
  ChevronsUpDown,
  Minimize2,
  Maximize2,
  Pin,
  Scale,
  Calculator,
  ShieldAlert,
  Globe,
  X,
  Wrench,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { INITIAL_MODULES, INITIAL_SHORTCUTS, INITIAL_FOLDERS } from '../../data/initialData';
import { AnimatedLogo } from './AnimatedLogo';
import { EQUIPMENT_SHOWCASE_LIST } from '../../data/equipmentShowcaseData';

// System Folder Icon SVG Backdrop - Realistic OS System Folder with tab, flap, and 3D depth
const SystemFolderBackdrop: React.FC<{
  isActive: boolean;
}> = ({ isActive }) => {
  return (
    <svg
      viewBox="0 0 54 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300 drop-shadow-sm"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Dark Tech Folder Gradients (Default Inactive) */}
        <linearGradient id="folderBackDark" x1="0" y1="0" x2="0" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="folderFrontDark" x1="0" y1="10" x2="0" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#090E17" />
        </linearGradient>

        {/* System Folder Gold Gradients (Classic OS Golden Folder on Hover) */}
        <linearGradient id="folderBackHover" x1="0" y1="0" x2="0" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="folderFrontHover" x1="0" y1="10" x2="0" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Enterprise Royal Red & Gold Gradients (Active State) */}
        <linearGradient id="folderBackActive" x1="0" y1="0" x2="0" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#991B1B" />
          <stop offset="100%" stopColor="#450A0A" />
        </linearGradient>
        <linearGradient id="folderFrontActive" x1="0" y1="10" x2="0" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="45%" stopColor="#991B1B" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>

        {/* Front flap 3D drop shadow */}
        <filter id="folderFlapShadow" x="-15%" y="0%" width="130%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* 1. Folder Back Plate with Top Tab */}
      <path
        d="M 4 38 
           L 4 7 
           A 3.5 3.5 0 0 1 7.5 3.5 
           L 20.5 3.5 
           A 3 3 0 0 1 23 5 
           L 25.5 8 
           A 3 3 0 0 0 28 9.5 
           L 49 9.5 
           A 3.5 3.5 0 0 1 52.5 13 
           L 52.5 38 
           Z"
        fill={isActive ? 'url(#folderBackActive)' : 'url(#folderBackDark)'}
        stroke={isActive ? '#FDE68A' : 'rgba(255,255,255,0.18)'}
        strokeWidth="1"
        className="transition-all duration-300 group-hover:fill-[url(#folderBackHover)] group-hover:stroke-amber-300"
      />

      {/* 2. Folder Document Paper Sheet Peeking Inside */}
      <path
        d="M 8 7 
           L 40 7 
           A 2 2 0 0 1 42 9 
           L 42 14 
           L 8 14 
           Z"
        fill="rgba(255, 255, 255, 0.28)"
        className="transition-all duration-300 group-hover:fill-white/70 group-hover:-translate-y-1"
      />

      {/* 3. Folder Front Cover / Flap */}
      <path
        d="M 3 38 
           L 4 12.5 
           A 3 3 0 0 1 7 9.5 
           L 49.5 9.5 
           A 3 3 0 0 1 52.5 12.5 
           L 50.5 38 
           A 3.5 3.5 0 0 1 47 41.5 
           L 6.5 41.5 
           A 3.5 3.5 0 0 1 3 38 
           Z"
        fill={isActive ? 'url(#folderFrontActive)' : 'url(#folderFrontDark)'}
        filter="url(#folderFlapShadow)"
        stroke={isActive ? '#FEF08A' : 'rgba(255,255,255,0.22)'}
        strokeWidth="1"
        className="transition-all duration-300 group-hover:fill-[url(#folderFrontHover)] group-hover:stroke-amber-200"
      />

      {/* 4. Glossy Highlight Line on top lip of folder cover */}
      <line
        x1="7"
        y1="10.5"
        x2="48"
        y2="10.5"
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth="1"
        strokeLinecap="round"
        className="transition-opacity duration-300 group-hover:stroke-white/80"
      />
    </svg>
  );
};

export const DualSidebar: React.FC = () => {
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % EQUIPMENT_SHOWCASE_LIST.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const showcaseEquipment = EQUIPMENT_SHOWCASE_LIST[showcaseIndex];
  const {
    activeModuleId,
    setActiveModuleId,
    activeView,
    setActiveView,
    setActiveInvoice,
    setActiveJournalEntry,
    setActiveContract,
    language,
    setLanguage,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    setIsThemeModalOpen,
    setIsTranslationModalOpen,
    loginSettings,
    currentUser,
    t,
    journalEntries,
    budgetOverrides,
    contracts,
    dailyBreakdowns,
    shiftSwaps,
    breakdownLogs,
    cheques,
    treasuryVouchers,
    stockItems,
    budgets,
    invoices,
    fleet,
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  // Map of folder collapse state (default: all expanded for quick access)
  const [collapsedFolders, setCollapsedFolders] = useState<{ [key: string]: boolean }>({});

  const toggleFolder = (folderId: string) => {
    setCollapsedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const collapseAllFolders = () => {
    const allCollapsed: { [key: string]: boolean } = {};
    INITIAL_FOLDERS.forEach((f) => {
      allCollapsed[f.id] = true;
    });
    setCollapsedFolders(allCollapsed);
  };

  const expandAllFolders = () => {
    setCollapsedFolders({});
  };

  // Helper for file-type badges matching modern IDE / Claude Code design
  const getFileBadge = (route: string, type?: string) => {
    if (route === 'financial-statements' || route === 'ledger') {
      return { tag: 'REP', label: 'تقرير', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
    if (route === 'multi-cheques') {
      return { tag: 'CHQ', label: 'شيكات', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
    if (route === 'banking-reconciliation') {
      return { tag: 'BNK', label: 'بنوك', bg: 'bg-teal-100 text-teal-800 border-teal-300' };
    }
    if (route === 'biometric-attendance') {
      return { tag: 'BIO', label: 'بصمة', bg: 'bg-cyan-100 text-cyan-800 border-cyan-300' };
    }
    if (route === 'payroll-calculation') {
      return { tag: 'PAY', label: 'رواتب', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
    }
    if (route === 'itrack-gps') {
      return { tag: 'GPS', label: 'تتبع', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    if (route === 'unified-messaging') {
      return { tag: 'MSG', label: 'رسائل', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
    if (route === 'integration-status') {
      return { tag: 'INT', label: 'تكامل', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
    if (route === 'audit-trail') {
      return { tag: 'AUD', label: 'تدقيق', bg: 'bg-red-100 text-red-800 border-red-300' };
    }
    if (route === 'landing-cms' || route === 'landing-preview') {
      return { tag: 'CMS', label: 'موقع', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
    if (route === 'customer-portal' || route === 'employee-portal') {
      return { tag: 'PRT', label: 'بوابة', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    }
    if (route === 'equipment-costing' || route === 'cost-centers') {
      return { tag: 'CST', label: 'تكاليف', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    if (route === 'budget-management') {
      return { tag: 'BDG', label: 'موازنة', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
    if (route === 'invoices' || route === 'contracts' || route === 'journals') {
      return { tag: 'DOC', label: 'مستند', bg: 'bg-sky-100 text-sky-800 border-sky-300' };
    }
    if (route === 'fleet-maintenance') {
      return { tag: 'MNT', label: 'صيانة', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    if (route === 'fleet' || route === 'gate-ops' || route === 'daily-operations') {
      return { tag: 'OPS', label: 'تشغيل', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
    }
    if (route === 'treasury' || route === 'inventory') {
      return { tag: 'TRK', label: 'عهدة', bg: 'bg-teal-100 text-teal-800 border-teal-300' };
    }
    return { tag: 'SYS', label: 'نظام', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  // Dynamic calculation of pending items and alerts per module
  // Only modules with count > 0 will display a badge in the UI
  const pendingCounts: Record<string, number> = useMemo(() => {
    // 1. accounting-journals: pending maker-checker approval entries + pending budget overrides
    const pendingJournals = (journalEntries || []).filter((j) => j.status === 'بانتظار الاعتماد').length;
    const pendingOverrides = (budgetOverrides || []).filter((o) => o.status === 'بانتظار اعتماد المدير المالي').length;
    const accountingTotal = pendingJournals + pendingOverrides;

    // 2. contracts: draft contracts awaiting signature/execution
    const pendingContracts = (contracts || []).filter((c) => c.status === 'مسودة').length;

    // 3. daily-ops: open breakdown tickets (not yet fixed) + shift swap reviews
    const openDailyBreakdowns = (dailyBreakdowns || []).filter(
      (b) => b.status !== 'تم الإصلاح وعادت للتشغيل'
    ).length;
    const pendingSwaps = (shiftSwaps || []).filter((s) => s.status === 'قيد مراجعة مدير التشغيل').length;
    const dailyOpsTotal = openDailyBreakdowns + pendingSwaps;

    // 4. gate-ops: cranes currently with breakdown logs open
    const openGateBreakdowns = (breakdownLogs || []).filter(
      (b) => b.status !== 'تم الإصلاح والاختبار'
    ).length;

    // 5. treasury: bounced cheques or draft vouchers
    const bouncedCheques = (cheques || []).filter((c) => c.status === 'مرتد').length;
    const draftVouchers = (treasuryVouchers || []).filter((v) => v.status === 'مسودة').length;
    const treasuryTotal = bouncedCheques + draftVouchers;

    // 6. inventory: items below or at reorder level
    const lowStockItems = (stockItems || []).filter(
      (item) => item.currentStock <= item.reorderLevel
    ).length;

    // 7. cost-centers: budgets that exceeded their limit or are flagged for warning
    const exceededBudgets = (budgets || []).filter(
      (b) => b.status === 'تجاوز الموازنة (محظور)' || b.actualSpent > b.allocatedBudget
    ).length;

    // 8. selling: draft invoices or unpaid invoices with outstanding balances
    const pendingInvoices = (invoices || []).filter(
      (i) => i.status === 'مسودة' || (i.status === 'معتمدة' && i.outstandingAmount > 0)
    ).length;

    // 9. fleet: cranes requiring periodic inspection
    const fleetAlerts = (fleet || []).filter(
      (f) => f.currentStatus === 'قيد الفحص الدوري'
    ).length;

    return {
      'accounting-journals': accountingTotal,
      'contracts': pendingContracts,
      'daily-ops': dailyOpsTotal,
      'gate-ops': openGateBreakdowns,
      'treasury': treasuryTotal,
      'inventory': lowStockItems,
      'cost-centers': exceededBudgets,
      'selling': pendingInvoices,
      'fleet': fleetAlerts,
    };
  }, [
    journalEntries,
    budgetOverrides,
    contracts,
    dailyBreakdowns,
    shiftSwaps,
    breakdownLogs,
    cheques,
    treasuryVouchers,
    stockItems,
    budgets,
    invoices,
    fleet,
  ]);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-amber-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'Truck':
        return <Truck className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-amber-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'Calendar':
        return <CalendarClock className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-amber-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'Activity':
        return <Activity className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-emerald-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'FileSignature':
        return <FileSignature className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-sky-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-indigo-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'Target':
        return <Target className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-rose-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'Users':
        return <Users className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-teal-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'Database':
        return <Database className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-slate-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-amber-400 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-amber-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-emerald-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-blue-300 group-hover:text-slate-950 drop-shadow-sm" />;
      case 'Sliders':
        return <Sliders className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-slate-300 group-hover:text-slate-950 drop-shadow-sm" />;
      default:
        return <Package className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-125 text-yellow-300 group-hover:text-slate-950 drop-shadow-sm" />;
    }
  };

  const activeModule = INITIAL_MODULES.find((m) => m.id === activeModuleId) || INITIAL_MODULES[0];

  // Count total files in the explorer
  const totalExplorerItems = useMemo(() => {
    return INITIAL_FOLDERS.reduce((acc, folder) => acc + folder.items.length, 0);
  }, []);

  const handleSelectView = (route: string, setupAction?: () => void) => {
    if (setupAction) setupAction();
    setActiveView(route);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay for screens below lg */}
      <div
        onClick={() => setIsMobileSidebarOpen(false)}
        className={`fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ${
          isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="إغلاق القائمة"
      />

      {/* Dual Sidebar: Fixed slide-over drawer on < lg, static flex on lg+ */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex h-full max-w-[100vw] select-none shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:max-w-none lg:shadow-none lg:translate-x-0 border-l border-slate-800 ${
          isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Dark Narrow Modules Rail (RTL rightmost) - System Folder Icons that expand leftward on hover */}
        <div
          className="w-16 flex flex-col justify-between items-center py-3 text-slate-300 transition-colors duration-300 relative z-30 overflow-visible shrink-0"
          style={{ backgroundColor: 'var(--sidebar-dark-bg)' }}
        >
          {/* Top: Egypt Cranes Emblem Logo */}
          <div className="flex flex-col items-center gap-3 w-full">
            <AnimatedLogo
              size="md"
              equipmentIndex={showcaseIndex}
              onIndexChange={setShowcaseIndex}
              onClick={() => handleSelectView('workspace')}
              className="mt-1"
            />

          {/* Module Icons List - System Folder backdrops with leftward expansion and zoom on hover */}
          <div className="flex flex-col items-center gap-2 w-[calc(100%+32px)] -mr-0 -ml-8 pl-8 pr-1.5 overflow-y-auto overflow-x-visible max-h-[calc(100vh-230px)] scrollbar-none py-1">
            {INITIAL_MODULES.map((mod) => {
              const isActive = activeModuleId === mod.id;
              const pendingCount = pendingCounts[mod.id] || 0;
              const moduleName = language === 'ar' ? mod.nameAr : mod.nameEn;
              const tooltipText =
                pendingCount > 0
                  ? `${moduleName} • (${pendingCount} ${language === 'ar' ? 'معلق / تنبيه' : 'pending alerts'})`
                  : moduleName;

              return (
                <div key={mod.id} className="relative flex items-center justify-end w-12 h-10">
                  <button
                    onClick={() => {
                      setActiveModuleId(mod.id);
                      if (mod.id === 'fleet') setActiveView('fleet');
                      else if (mod.id === 'maintenance') setActiveView('fleet-maintenance');
                      else if (mod.id === 'daily-ops') setActiveView('daily-operations');
                      else if (mod.id === 'gate-ops') setActiveView('gate-ops');
                      else if (mod.id === 'contracts') setActiveView('contracts');
                      else if (mod.id === 'accounting-journals') setActiveView('journals');
                      else if (mod.id === 'treasury') setActiveView('treasury');
                      else if (mod.id === 'inventory') setActiveView('inventory');
                      else if (mod.id === 'cost-centers') setActiveView('cost-centers');
                      else if (mod.id === 'users') setActiveView('users');
                      else if (mod.id === 'backup') setActiveView('backup');
                      else if (mod.id === 'selling') setActiveView('invoices');
                      else if (mod.id === 'ledger') setActiveView('ledger');
                      else if (mod.id === 'permissions') setActiveView('permissions');
                      else if (mod.id === 'settings') setActiveView('login-settings');
                      else setActiveView('workspace');
                    }}
                    title={tooltipText}
                    aria-label={tooltipText}
                    className={`relative flex items-center justify-center transition-all duration-300 ease-out origin-right group
                      w-11 h-10 rounded-lg cursor-pointer
                      hover:w-[62px] hover:h-[44px] hover:-translate-x-3.5 hover:scale-120 hover:z-50
                      hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.7),0_0_18px_rgba(245,158,11,0.35)]
                      ${isActive ? 'z-20' : 'z-10'}
                    `}
                  >
                    {/* System Folder Icon SVG Backdrop */}
                    <SystemFolderBackdrop isActive={isActive} />

                    {/* Module Icon centered on folder front face */}
                    <div className="relative z-10 flex items-center justify-center pointer-events-none mt-1">
                      {getModuleIcon(mod.icon)}
                    </div>

                    {/* Pending items / alerts count badge: Only shown if pendingCount > 0 */}
                    {pendingCount > 0 && (
                      <span
                        className="absolute -top-1.5 -left-1.5 z-20 min-w-[19px] h-[19px] px-1 text-[10px] font-black rounded-full flex items-center justify-center shadow-lg ring-2 ring-slate-900 bg-rose-600 text-white animate-pulse"
                        title={`${pendingCount} ${language === 'ar' ? 'معلقات وتنبيهات بحاجة لمتابعة' : 'pending items needing attention'}`}
                      >
                        {pendingCount > 99 ? '99+' : pendingCount}
                      </span>
                    )}

                    {/* Active indicator bar on right edge */}
                    {isActive && (
                      <div
                        className="absolute -right-1 top-2 bottom-2 w-1 rounded-l-full shadow-md z-20"
                        style={{ backgroundColor: 'var(--accent-metallic)' }}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Rail Utilities: C-Style, Translation, Language - Icon only, expanding smoothly to the left */}
        <div className="flex flex-col items-center gap-2 w-full px-2 border-t border-white/10 pt-2.5 overflow-visible">
          {/* C-Style Theme Customizer */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            title="تخصيص ثيم وألوان النظام (C-Style Customizer)"
            aria-label="تخصيص ثيم وألوان النظام"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-300 hover:text-amber-200 hover:bg-white/10 transition-all duration-300 origin-right group active:scale-95 hover:-translate-x-2 hover:scale-115 hover:shadow-lg hover:z-40"
          >
            <Palette className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform stroke-[2]" />
          </button>

          {/* Instant In-Context Translation Button */}
          <button
            onClick={() => setIsTranslationModalOpen(true)}
            title="الترجمة الفورية من الواجهة (In-Context Translation)"
            aria-label="الترجمة الفورية"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sky-300 hover:text-white hover:bg-white/10 transition-all duration-300 origin-right group active:scale-95 hover:-translate-x-2 hover:scale-115 hover:shadow-lg hover:z-40"
          >
            <Languages className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform stroke-[2]" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            title={language === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}
            aria-label={language === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-300 origin-right border border-white/15 active:scale-95 group hover:-translate-x-2 hover:scale-115 hover:shadow-lg hover:z-40"
          >
            <div className="flex items-center gap-0.5 font-mono">
              <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors mr-0.5" />
              <span>{language === 'ar' ? 'EN' : 'ع'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Modern Claude Code / IDE Style Explorer Sidebar */}
      <div className="w-64 sm:w-72 max-w-[calc(100vw-4.5rem)] bg-slate-900 border-r border-slate-800 flex flex-col justify-between text-slate-300 shadow-xl font-sans shrink-0">
        {/* Top: Header with Equipment Backdrop and Brand Info */}
        <div className="relative p-3 border-b border-slate-800/90 bg-slate-950/70 overflow-hidden">
          {/* Equipment Photo Texture Behind the Sidebar Title */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none transition-all duration-1000 scale-105"
            style={{
              backgroundImage: `url(${showcaseEquipment.imageUrl})`,
              filter: 'blur(0.8px)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/80 pointer-events-none" />

          {/* Brand Row without the duplicate small logo */}
          <div className="relative z-1 flex items-center justify-between gap-2 mb-2">
            <div className="min-w-0 text-right">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-white tracking-tight truncate">
                  مصر للأوناش
                </h1>
                <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-red-950/80 text-red-400 border border-red-800/50 shrink-0">
                  ERP v16
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium truncate mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate font-mono text-slate-300">Egypt Cranes Fleet</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  if (activeModuleId === 'contracts') {
                    setActiveContract(null);
                    handleSelectView('new-contract');
                  } else if (activeModuleId === 'accounting-journals') {
                    setActiveJournalEntry(null);
                    handleSelectView('new-jv');
                  } else {
                    setActiveInvoice(null);
                    handleSelectView('new-invoice');
                  }
                }}
                title="إنشاء مستند جديد (+)"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all active:scale-90 hover:brightness-110 shadow-sm border border-white/20"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Mobile Close Drawer Button */}
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                title="إغلاق القائمة الجانبية"
                aria-label="إغلاق القائمة الجانبية"
                className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Equipment Showcase Banner */}
          <div className="relative z-1 flex items-center justify-between text-[10px] py-1 px-2 mb-2.5 bg-slate-900/90 text-white rounded-lg border border-slate-800 shadow-inner">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span className="text-amber-300 font-semibold truncate font-mono text-[11px]">
                {showcaseEquipment.model}
              </span>
            </div>
            <span className="text-[9px] font-mono font-black bg-red-600 text-white px-1.5 py-0.2 rounded shrink-0">
              {showcaseEquipment.capacityTon}T
            </span>
          </div>

          {/* Claude Code Style Explorer Header Bar */}
          <div className="relative z-1 flex items-center justify-between text-[11px] font-mono px-2 py-1.5 bg-slate-900/90 rounded-md border border-slate-800/80 mb-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider">
              <FolderKanban className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-200">EXPLORER</span>
              <span className="text-[10px] text-slate-500">/</span>
              <span className="text-[10px] text-amber-400/90">EGYPT-CRANES</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={expandAllFolders}
                title="توسيع كافة المجلدات (Expand All)"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
              <button
                onClick={collapseAllFolders}
                title="طي كافة المجلدات (Collapse All)"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Minimize2 className="w-3 h-3" />
              </button>
              <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1 rounded ml-0.5">
                {totalExplorerItems}
              </span>
            </div>
          </div>

          {/* Search Box Styled as Modern Terminal / IDE Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder={t('Search explorer items...', 'تصفية الملفات والقوائم...', 'Filter tree...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-900/90 text-slate-200 border border-slate-800 rounded-lg pr-8 pl-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Explorer Folder Tree Canvas */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {/* Section 1: Pinned Shortcuts (اختصارات الوصول السريع) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 px-2 py-1">
              <span className="flex items-center gap-1.5">
                <Pin className="w-3 h-3 text-amber-400" />
                <span>QUICK ACCESS</span>
              </span>
              <span className="text-[10px] text-slate-500">مباشر</span>
            </div>

            <div className="space-y-0.5">
              {INITIAL_SHORTCUTS.filter(
                (sc) =>
                  sc.titleAr.includes(searchQuery) ||
                  sc.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((sc) => {
                const isShortcutActive =
                  (sc.linkTo === 'fleet' && activeView === 'fleet') ||
                  (sc.linkTo === 'gate-ops' && activeView === 'gate-ops') ||
                  (sc.linkTo === 'contracts' && activeView === 'contracts') ||
                  (sc.linkTo === 'treasury' && activeView === 'treasury') ||
                  (sc.linkTo === 'inventory' && activeView === 'inventory') ||
                  (sc.linkTo === 'cost-centers' && activeView === 'cost-centers') ||
                  (sc.linkTo === 'users' && activeView === 'users') ||
                  (sc.linkTo === 'backup' && activeView === 'backup');

                return (
                  <button
                    key={sc.id}
                    onClick={() => {
                      if (sc.linkTo === 'fleet') handleSelectView('fleet');
                      else if (sc.linkTo === 'gate-ops') handleSelectView('gate-ops');
                      else if (sc.linkTo === 'contracts') handleSelectView('contracts');
                      else if (sc.linkTo === 'treasury') handleSelectView('treasury');
                      else if (sc.linkTo === 'inventory') handleSelectView('inventory');
                      else if (sc.linkTo === 'new-jv') {
                        handleSelectView('new-jv', () => setActiveJournalEntry(null));
                      } else if (sc.linkTo === 'cost-centers') handleSelectView('cost-centers');
                      else if (sc.linkTo === 'users') handleSelectView('users');
                      else if (sc.linkTo === 'backup') handleSelectView('backup');
                      else handleSelectView('invoices');
                    }}
                    className={`w-full text-right text-xs py-1.5 px-2 rounded-md flex items-center justify-between transition-colors group ${
                      isShortcutActive
                        ? 'bg-amber-500/15 text-amber-300 font-semibold border-r-2 border-amber-400'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: 'var(--accent-metallic)' }}
                      />
                      <span className="truncate">{language === 'ar' ? sc.titleAr : sc.titleEn}</span>
                    </div>
                    {sc.count ? (
                      <span className="text-[10px] font-mono bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded border border-slate-700 tabular-nums">
                        {sc.count}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                        →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Claude Code Style Folders (شجرة مجلدات النظام) */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="text-[11px] font-mono font-bold text-slate-400 px-2 py-0.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Folder className="w-3 h-3 text-sky-400" />
                <span>MODULE DIRECTORIES</span>
              </span>
              <span className="text-[9px] font-mono text-slate-500">RTL Tree</span>
            </div>

            {INITIAL_FOLDERS.map((folder) => {
              const isCollapsed = collapsedFolders[folder.id];
              const filteredItems = folder.items.filter(
                (item) =>
                  item.titleAr.includes(searchQuery) ||
                  item.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (searchQuery && filteredItems.length === 0) return null;

              const hasActiveChild = filteredItems.some((i) => activeView === i.route);

              return (
                <div key={folder.id} className="rounded-md bg-slate-950/40 border border-slate-800/60 overflow-hidden">
                  {/* Folder Header Row */}
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className={`w-full flex items-center justify-between text-xs py-1.5 px-2 transition-colors ${
                      hasActiveChild
                        ? 'bg-slate-800/80 text-amber-300 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isCollapsed ? (
                        <Folder className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span className="truncate text-right font-medium">
                        {language === 'ar' ? folder.titleAr : folder.titleEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 mr-1">
                      <span className="text-[10px] font-mono text-slate-500">
                        {filteredItems.length}
                      </span>
                      {isCollapsed ? (
                        <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Folder Items (Tree Children with RTL guide line on right) */}
                  {!isCollapsed && (
                    <div className="py-1 pr-3 pl-1 space-y-0.5 border-r border-slate-800 mr-3 my-1">
                      {filteredItems.map((item) => {
                        const isItemActive = activeView === item.route;
                        const badgeInfo = getFileBadge(item.route, item.type);

                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              handleSelectView(item.route, () => {
                                if (item.route === 'new-contract') setActiveContract(null);
                                if (item.route === 'new-jv') setActiveJournalEntry(null);
                              });
                            }}
                            className={`w-full text-right text-xs py-1 px-2 rounded flex items-center justify-between transition-all group ${
                              isItemActive
                                ? 'bg-amber-400/15 text-amber-300 font-semibold shadow-xs'
                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate min-w-0">
                              <FileText
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isItemActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-400'
                                }`}
                              />
                              <span className="truncate">{language === 'ar' ? item.titleAr : item.titleEn}</span>
                            </div>

                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${badgeInfo.bg}`}
                            >
                              [{badgeInfo.tag}]
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom User Profile Card Styled as IDE Terminal Status */}
        <div className="p-2.5 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity min-w-0"
              onClick={() => handleSelectView('users')}
              title="إدارة بيانات المستخدمين والصلاحيات"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-white text-xs shadow-inner shrink-0 border border-white/20"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                {currentUser.nameAr.charAt(0)}
              </div>
              <div className="text-right min-w-0">
                <span className="text-xs font-bold text-slate-200 block leading-tight truncate">
                  {currentUser.nameAr}
                </span>
                <span className="text-[10px] text-amber-400/90 font-mono block leading-tight truncate max-w-[130px]">
                  {currentUser.roleAr}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleSelectView('login-preview')}
              title="معاينة صفحة الدخول المخصصة"
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  </>
);
};
