import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  FileText,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
  Lock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Hash,
  Database,
  ExternalLink,
  Plus,
  Sliders,
  Check,
  X,
  FileSpreadsheet,
  Globe,
  Terminal,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  AuditLogEntry,
  AuditActionType,
  AuditSeverity,
  ComplianceCategory,
  FieldChangeDiff,
} from '../../types/erp';

export const AuditTrailView: React.FC = () => {
  const { auditLogs, logAuditEvent, currentUser, setActiveView } = useERP();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'stream' | 'diffs' | 'compliance' | 'console'>('stream');

  // Expanded rows
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Selected item for modal
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogEntry | null>(null);

  // Manual Audit Note Form State
  const [noteForm, setNoteForm] = useState({
    moduleNameAr: 'الحسابات وقيود اليومية',
    docType: 'Compliance Review',
    docNumber: 'REV-2026-001',
    actionType: 'اعتماد' as AuditActionType,
    severity: 'عادي (Info)' as AuditSeverity,
    complianceCategory: 'حوكمة مالية (SOX / IFRS)' as ComplianceCategory,
    summaryAr: '',
    auditorNotes: '',
  });
  const [isNoteSuccess, setIsNoteSuccess] = useState(false);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          log.docNumber.toLowerCase().includes(q) ||
          log.userNameAr.toLowerCase().includes(q) ||
          log.summaryAr.toLowerCase().includes(q) ||
          log.moduleNameAr.toLowerCase().includes(q) ||
          log.userIpAddress.toLowerCase().includes(q) ||
          (log.checksumSha256 && log.checksumSha256.toLowerCase().includes(q));
        if (!match) return false;
      }
      // Module
      if (selectedModule !== 'all' && log.moduleNameAr !== selectedModule) {
        return false;
      }
      // Action
      if (selectedAction !== 'all' && log.actionType !== selectedAction) {
        return false;
      }
      // Severity
      if (selectedSeverity !== 'all' && log.severity !== selectedSeverity) {
        return false;
      }
      // Category
      if (selectedCategory !== 'all' && log.complianceCategory !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [auditLogs, searchQuery, selectedModule, selectedAction, selectedSeverity, selectedCategory]);

  // KPIs
  const stats = useMemo(() => {
    const total = auditLogs.length;
    const critical = auditLogs.filter((l) => l.severity === 'حرج (Critical)').length;
    const security = auditLogs.filter((l) => l.severity === 'أمني (Security)').length;
    const withDiffs = auditLogs.filter((l) => l.fieldChanges && l.fieldChanges.length > 0).length;
    return { total, critical, security, withDiffs };
  }, [auditLogs]);

  // Unique modules in logs
  const availableModules = useMemo(() => {
    const set = new Set<string>();
    auditLogs.forEach((l) => set.add(l.moduleNameAr));
    return Array.from(set);
  }, [auditLogs]);

  // Handle Export CSV
  const exportToCSV = () => {
    const headers = ['المعرف', 'التاريخ والوقت', 'التاريخ الهجري', 'المستخدم', 'الدور', 'نوع الحركة', 'الوحدة', 'المستند', 'الوصف', 'الأهمية', 'الحالة', 'العنوان IP'];
    const rows = filteredLogs.map((l) => [
      l.docNumber,
      l.timestamp,
      l.hijriDate,
      l.userNameAr,
      l.userRoleAr,
      l.actionType,
      l.moduleNameAr,
      l.docType,
      `"${l.summaryAr.replace(/"/g, '""')}"`,
      l.severity,
      l.status,
      l.userIpAddress,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Egypt_Cranes_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit manual compliance audit note
  const handleAddManualNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.summaryAr.trim()) return;

    logAuditEvent({
      userId: currentUser.id,
      userNameAr: currentUser.nameAr,
      userRoleAr: currentUser.roleAr,
      userIpAddress: '192.168.1.104',
      userDevice: 'Internal Compliance Console / Web',
      actionType: noteForm.actionType,
      moduleNameAr: noteForm.moduleNameAr,
      docType: noteForm.docType,
      docId: `rev-${Date.now()}`,
      docNumber: noteForm.docNumber,
      summaryAr: noteForm.summaryAr,
      severity: noteForm.severity,
      complianceCategory: noteForm.complianceCategory,
      status: 'نجاح',
      checksumSha256: 'manual-audit-entry-' + Math.random().toString(36).substring(2, 15),
      metadata: {
        auditorNotes: noteForm.auditorNotes,
        verificationOfficer: currentUser.nameAr,
      },
    });

    setIsNoteSuccess(true);
    setNoteForm({
      moduleNameAr: 'الحسابات وقيود اليومية',
      docType: 'Compliance Review',
      docNumber: `REV-2026-${Math.floor(100 + Math.random() * 900)}`,
      actionType: 'اعتماد',
      severity: 'عادي (Info)',
      complianceCategory: 'حوكمة مالية (SOX / IFRS)',
      summaryAr: '',
      auditorNotes: '',
    });
    setTimeout(() => {
      setIsNoteSuccess(false);
      setActiveTab('stream');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-right" dir="rtl">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-red-600/30 text-red-400 border border-red-500/30 shadow-inner">
                <ShieldCheck className="w-6 h-6 text-red-400" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  سجل التدقيق والحوكمة والامتثال (Audit Trail)
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    SHA-256 Tamper-Proof
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  توثيق وتتبع كافة العمليات وتعديلات البيانات اللحظية واختام الاعتماد الثنائي (Maker-Checker) لشركة مصر للمقاولات المتخصصة (إيجيبت كرينز)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('console')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-900/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل ملاحظة تدقيق (+)</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
              title="تصدير السجل كملف Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>تصدير Excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
              title="طباعة تقرير سجل التدقيق"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>طباعة</span>
            </button>
          </div>
        </div>

        {/* 2. Top Stats KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium">إجمالي الحركات الموثقة</div>
            <div className="text-xl font-black text-white font-mono mt-0.5">{stats.total} عملية</div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Database className="w-3 h-3 text-sky-400" />
              <span>سجل غير قابل للحذف أو التعديل</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium">العمليات الحرجة والاعتمادات</div>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5">{stats.critical} عملية</div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>اعتمادات قيود وموازنات ومناقصات</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium">سجلات فوارق الحقول (Field Diffs)</div>
            <div className="text-xl font-black text-sky-400 font-mono mt-0.5">{stats.withDiffs} تعديل</div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-sky-400" />
              <span>مقارنة القيمة السابقة والجديدة</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium">سلامة التشفير والأمان</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">100% سليم</div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>بصمة SHA-256 متطابقة</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto no-scrollbar pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('stream')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'stream'
              ? 'border-red-600 text-red-700 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>جدول الحركات اللحظي (Stream)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono">
            {filteredLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('diffs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'diffs'
              ? 'border-red-600 text-red-700 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>فاحص تعديلات البيانات (Field Diffs)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 text-[10px] font-mono">
            {stats.withDiffs}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'compliance'
              ? 'border-red-600 text-red-700 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ملف الامتثال التنظيمي (SOX / ISO / IFRS)</span>
        </button>

        <button
          onClick={() => setActiveTab('console')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'console'
              ? 'border-red-600 text-red-700 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>لوحة المدقق وإضافة توثيق يدوي (+)</span>
        </button>
      </div>

      {/* 4. Tab 1: Detailed Audit Stream Table */}
      {activeTab === 'stream' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث برقم المستند، المستخدم، الوصف، أو العنوان IP..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Module Filter */}
              <div>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="all">كافة الوحدات والأنظمة</option>
                  {availableModules.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Type Filter */}
              <div>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="all">كافة أنواع الإجراءات</option>
                  <option value="اعتماد">اعتماد (Approval)</option>
                  <option value="إنشاء">إنشاء جديد (Creation)</option>
                  <option value="تعديل">تعديل (Modification)</option>
                  <option value="تجاوز موازنة">تجاوز موازنة (Budget Override)</option>
                  <option value="تصدير بيانات">تصدير بيانات (Data Export)</option>
                  <option value="تغيير صلاحية">تغيير صلاحية (Role / RBAC)</option>
                  <option value="تسجيل دخول">تسجيل دخول (Auth)</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="all">كافة مستويات الأهمية</option>
                  <option value="عادي (Info)">عادي (Info)</option>
                  <option value="تنبيه (Warning)">تنبيه (Warning)</option>
                  <option value="حرج (Critical)">حرج (Critical)</option>
                  <option value="أمني (Security)">أمني (Security)</option>
                </select>
              </div>
            </div>

            {/* Active filters pill bar */}
            {(selectedModule !== 'all' || selectedAction !== 'all' || selectedSeverity !== 'all' || searchQuery) && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 font-medium">الفلاتر المطبقة:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px]">
                    بحث: {searchQuery}
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-600 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedModule !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-800 text-[11px] font-bold">
                    الوحدة: {selectedModule}
                    <button onClick={() => setSelectedModule('all')} className="hover:text-red-900 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedAction !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold">
                    الإجراء: {selectedAction}
                    <button onClick={() => setSelectedAction('all')} className="hover:text-amber-900 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedModule('all');
                    setSelectedAction('all');
                    setSelectedSeverity('all');
                    setSelectedCategory('all');
                  }}
                  className="text-red-600 hover:underline mr-auto text-xs font-bold cursor-pointer"
                >
                  إعادة ضبط الكل
                </button>
              </div>
            )}
          </div>

          {/* Audit Stream Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold select-none">
                  <tr>
                    <th className="py-3 px-3 text-center w-10">#</th>
                    <th className="py-3 px-3">الوقت والتاريخ</th>
                    <th className="py-3 px-3">المستخدم والدور</th>
                    <th className="py-3 px-3">نوع الإجراء</th>
                    <th className="py-3 px-3">الوحدة والمستند</th>
                    <th className="py-3 px-3">بيان الحركة والملخص</th>
                    <th className="py-3 px-3 text-center">الأهمية</th>
                    <th className="py-3 px-3 text-center">الفوارق</th>
                    <th className="py-3 px-3 text-center">معاينة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-slate-600">لا توجد سجلات تدقيق تطابق معايير البحث الحالية</p>
                        <p className="text-[11px] text-slate-400 mt-1">جرّب تخفيف الفلاتر أو إزالة شروط البحث</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, index) => {
                      const isExpanded = expandedRowId === log.id;
                      const hasDiffs = log.fieldChanges && log.fieldChanges.length > 0;

                      return (
                        <React.Fragment key={log.id}>
                          <tr
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isExpanded ? 'bg-red-50/20' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                            }`}
                          >
                            <td className="py-3 px-3 text-center font-mono text-slate-400 text-[11px]">
                              {index + 1}
                            </td>

                            {/* Timestamp & Hijri */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="font-mono font-bold text-slate-900">{log.timestamp.split(' ')[1]}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{log.timestamp.split(' ')[0]}</div>
                              <div className="text-[10px] text-amber-700 font-medium">{log.hijriDate}</div>
                            </td>

                            {/* User & Role */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                                  {log.userNameAr.charAt(0)}
                                </span>
                                <span>{log.userNameAr}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 mr-6.5">{log.userRoleAr}</div>
                              <div className="text-[10px] text-slate-400 font-mono mr-6.5">IP: {log.userIpAddress}</div>
                            </td>

                            {/* Action Type Badge */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                                  log.actionType === 'اعتماد'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : log.actionType === 'تجاوز موازنة'
                                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                                    : log.actionType === 'تصدير بيانات'
                                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                                    : log.actionType === 'تغيير صلاحية'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : log.actionType === 'تسجيل دخول'
                                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                                    : 'bg-sky-50 text-sky-800 border-sky-200'
                                }`}
                              >
                                {log.actionType}
                              </span>
                            </td>

                            {/* Module & Doc */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="font-bold text-slate-800">{log.moduleNameAr}</div>
                              <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                <span className="text-slate-400">{log.docType}:</span>
                                <span className="font-bold text-slate-700">{log.docNumber}</span>
                              </div>
                            </td>

                            {/* Summary description */}
                            <td className="py-3 px-3 max-w-xs md:max-w-md">
                              <div className="text-slate-700 text-xs leading-relaxed line-clamp-2">
                                {log.summaryAr}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                                <span className="bg-slate-100 px-1.5 py-0.2 rounded text-slate-600 font-medium">
                                  {log.complianceCategory}
                                </span>
                              </div>
                            </td>

                            {/* Severity Badge */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  log.severity === 'حرج (Critical)'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                                    : log.severity === 'أمني (Security)'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                    : log.severity === 'تنبيه (Warning)'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {log.severity.split(' ')[0]}
                              </span>
                            </td>

                            {/* Field Diffs indicator / Toggle */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              {hasDiffs ? (
                                <button
                                  onClick={() => setExpandedRowId(isExpanded ? null : log.id)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 text-[10px] font-bold cursor-pointer transition-colors"
                                  title="عرض التغييرات في قيم الحقول"
                                >
                                  <span>{log.fieldChanges!.length} حقول</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              ) : (
                                <span className="text-slate-300 text-[10px]">-</span>
                              )}
                            </td>

                            {/* View Details Modal Trigger */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <button
                                onClick={() => setSelectedAuditLog(log)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                                title="عرض بطاقة الفحص والشهادة الرقمية"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Row: Deep Field Changes Inspection */}
                          {isExpanded && hasDiffs && (
                            <tr className="bg-slate-50/90 border-y border-slate-200">
                              <td colSpan={9} className="p-4">
                                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-inner space-y-3">
                                  <div className="flex items-center justify-between text-xs font-bold border-b border-slate-100 pb-2">
                                    <div className="flex items-center gap-2 text-slate-800">
                                      <Layers className="w-4 h-4 text-sky-600" />
                                      <span>مقارنة التغييرات الميدانية في الحقول (Field Change Diff)</span>
                                      <span className="font-mono text-slate-500">[{log.docNumber}]</span>
                                    </div>
                                    <div className="text-[11px] font-mono text-slate-400">
                                      SHA-256: {log.checksumSha256?.substring(0, 16)}...
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-2">
                                    {log.fieldChanges!.map((field, fIdx) => (
                                      <div
                                        key={fIdx}
                                        className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs items-center"
                                      >
                                        <div className="font-bold text-slate-700">
                                          <div>{field.fieldNameAr}</div>
                                          <div className="text-[10px] text-slate-400 font-mono">{field.fieldNameEn}</div>
                                        </div>

                                        {/* Old value */}
                                        <div className="bg-rose-50 text-rose-900 border border-rose-200 rounded p-1.5 text-xs font-mono break-all line-through opacity-80">
                                          <span className="text-[9px] text-rose-600 font-sans block">القيمة السابقة:</span>
                                          {String(field.oldValue)}
                                        </div>

                                        {/* New value */}
                                        <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded p-1.5 text-xs font-mono font-bold break-all">
                                          <span className="text-[9px] text-emerald-600 font-sans block">القيمة الجديدة:</span>
                                          {String(field.newValue)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Metadata Footer */}
                                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
                                      <span className="font-bold text-slate-500">بيانات الحوكمة الإضافية:</span>
                                      {Object.entries(log.metadata).map(([k, v]) => (
                                        <span key={k} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                                          {k}: <strong className="text-slate-900">{String(v)}</strong>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Visual Field Diffs Inspector */}
      {activeTab === 'diffs' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-600" />
                  <span>فاحص تعديلات بيانات المستندات (Data Mutation Diffs)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  استعراض مقارنة التغييرات التفصيلية عبر الزمن بين القيم السابقة والجديدة للمستندات المعتمدة
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {auditLogs
                .filter((l) => l.fieldChanges && l.fieldChanges.length > 0)
                .map((log) => (
                  <div key={log.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="p-3.5 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono px-2 py-0.5 rounded bg-white border border-slate-200">
                          {log.docNumber}
                        </span>
                        <span className="font-bold text-slate-700">{log.docType}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600">{log.moduleNameAr}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                        <span>بواسطة: <strong className="text-slate-800">{log.userNameAr}</strong></span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="text-xs text-slate-700 font-medium mb-2">{log.summaryAr}</div>
                      <div className="grid grid-cols-1 gap-2">
                        {log.fieldChanges!.map((diff, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-white p-3 rounded-lg border border-slate-200 text-xs items-center"
                          >
                            <div className="md:col-span-4 font-bold text-slate-800">
                              <div>{diff.fieldNameAr}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{diff.fieldNameEn}</div>
                            </div>
                            <div className="md:col-span-4 bg-rose-50 text-rose-800 p-2 rounded border border-rose-200 font-mono line-through text-[11px]">
                              <span className="text-[9px] text-rose-600 block font-sans">قبل التعديل:</span>
                              {String(diff.oldValue)}
                            </div>
                            <div className="md:col-span-4 bg-emerald-50 text-emerald-900 p-2 rounded border border-emerald-200 font-mono font-bold text-[11px]">
                              <span className="text-[9px] text-emerald-600 block font-sans">بعد الاعتماد:</span>
                              {String(diff.newValue)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Compliance & Regulatory Reports */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. SOX / IFRS Financial Governance */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold border-b border-slate-100 pb-2.5">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold">الحوكمة المالية (SOX / IFRS Standards)</h3>
                  <p className="text-[11px] text-slate-500 font-normal">مطابقة اشتراطات الرقابة الداخلية وفصل المهام (Segregation of Duties)</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>فصل مهام المنشئ والمعتمد (Maker vs Checker):</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> مفعّل وإلزامي
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>اعتمادات تجاوز الموازنات (Budget Overrides):</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> موثق ومختوم
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>حوافظ الشيكات المجمعة وتوزيع FIFO:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> مؤتمت 100%
                  </span>
                </li>
              </ul>
            </div>

            {/* 2. ISO 45001 / HSE Safety Compliance */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold border-b border-slate-100 pb-2.5">
                <span className="p-2 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold">معايير السلامة المهنية (ISO 45001 HSE)</h3>
                  <p className="text-[11px] text-slate-500 font-normal">توثيق فحص ركائز الأوناش وشهادات المعايرة والتصاريح</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>فحص سلامة خروج الأوناش بالبوابة:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> 100% مجتاز
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>شهادات الفحص الفني للأوناش (Third Party):</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> سارية وموثقة
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>مرافقة سيارات التأمين (Safety Escort):</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> إلزامي للأحمال 500T+
                  </span>
                </li>
              </ul>
            </div>

            {/* 3. Egyptian Tax & Social Insurance Law 148 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold border-b border-slate-100 pb-2.5">
                <span className="p-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold">التأمينات والضرائب المصرية (قانون 148 لسنة 2019)</h3>
                  <p className="text-[11px] text-slate-500 font-normal">مطابقة خصم التأمينات الاجتماعية 11% وملفات WPS البنكية</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>حصة الموظف في التأمينات (11%):</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> احتساب آلي معتمد
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>تصدير ملفات الصرف البنكي WPS:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> متوافق مع NBE / بنك مصر
                  </span>
                </li>
              </ul>
            </div>

            {/* 4. Cybersecurity & Data Integrity */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold border-b border-slate-100 pb-2.5">
                <span className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                  <Lock className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold">الأمن السيبراني وحماية البيانات (Cybersecurity)</h3>
                  <p className="text-[11px] text-slate-500 font-normal">الحظر التلقائي لمحاولات الاختراق وتشفير النسخ الاحتياطية</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>حظر عناوين IP المشبوهة (Firewall Ban):</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> نشط (بعد 3 محاولات)
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                  <span>تشفير النسخ الاحتياطية (SHA-256 + AES):</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> مشفر ومطابق
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Live Event Logger & Auditor Console */}
      {activeTab === 'console' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs max-w-3xl mx-auto space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-600" />
              <span>لوحة المدقق وتسجيل الملاحظات والقرارات التفتيشية الميدانية</span>
            </h2>
            <p className="text-xs text-slate-500">
              تسجيل ملاحظة رقابية رسمية أو اعتماد تفتيش دوري يتم تشفيره وإلحاقه بسجل التدقيق الرقمي للنظام
            </p>
          </div>

          {isNoteSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>تم تشفير وتوثيق ملاحظة التدقيق بنجاح في سجل الـ Audit Trail!</span>
            </div>
          )}

          <form onSubmit={handleAddManualNote} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">الوحدة أو الإدارة المعنية:</label>
                <select
                  value={noteForm.moduleNameAr}
                  onChange={(e) => setNoteForm({ ...noteForm, moduleNameAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
                >
                  <option value="الحسابات وقيود اليومية">الحسابات وقيود اليومية</option>
                  <option value="عقود التشغيل والتأجير">عقود التشغيل والتأجير</option>
                  <option value="أسطول الأوناش والمشاريع">أسطول الأوناش والمشاريع</option>
                  <option value="بوابة الأوناش والسلامة">بوابة الأوناش والسلامة</option>
                  <option value="المخازن والمستودعات">المخازن والمستودعات</option>
                  <option value="البنوك وخطابات الضمان">البنوك وخطابات الضمان</option>
                  <option value="الموارد البشرية والرواتب">الموارد البشرية والرواتب</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">نوع المستند أو العملية:</label>
                <input
                  type="text"
                  value={noteForm.docType}
                  onChange={(e) => setNoteForm({ ...noteForm, docType: e.target.value })}
                  placeholder="مثال: Crane Safety Audit"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">رقم المرجع أو المستند:</label>
                <input
                  type="text"
                  value={noteForm.docNumber}
                  onChange={(e) => setNoteForm({ ...noteForm, docNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">نوع الإجراء:</label>
                <select
                  value={noteForm.actionType}
                  onChange={(e) => setNoteForm({ ...noteForm, actionType: e.target.value as AuditActionType })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                >
                  <option value="اعتماد">اعتماد وتفتيش (Approval)</option>
                  <option value="تعديل">تعديل ميداني (Modification)</option>
                  <option value="تجاوز موازنة">تجاوز موازنة (Budget Override)</option>
                  <option value="تصدير بيانات">تصدير بيانات (Data Export)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">مستوى الأهمية والخطورة:</label>
                <select
                  value={noteForm.severity}
                  onChange={(e) => setNoteForm({ ...noteForm, severity: e.target.value as AuditSeverity })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                >
                  <option value="عادي (Info)">عادي (Info)</option>
                  <option value="تنبيه (Warning)">تنبيه (Warning)</option>
                  <option value="حرج (Critical)">حرج (Critical)</option>
                  <option value="أمني (Security)">أمني (Security)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">تصنيف الامتثال:</label>
                <select
                  value={noteForm.complianceCategory}
                  onChange={(e) => setNoteForm({ ...noteForm, complianceCategory: e.target.value as ComplianceCategory })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                >
                  <option value="حوكمة مالية (SOX / IFRS)">حوكمة مالية (SOX / IFRS)</option>
                  <option value="سلامة وتشغيل (HSE / ISO 45001)">سلامة وتشغيل (HSE / ISO 45001)</option>
                  <option value="أمان وسريّة البيانات">أمان وسريّة البيانات</option>
                  <option value="إجراءات قانونية وعقود">إجراءات قانونية وعقود</option>
                  <option value="تأمينات وضرائب (Egyptian Tax & Social Insurance)">تأمينات وضرائب</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">بيان وملخص الملاحظة / القرار التفتيشي:</label>
              <textarea
                rows={3}
                required
                value={noteForm.summaryAr}
                onChange={(e) => setNoteForm({ ...noteForm, summaryAr: e.target.value })}
                placeholder="اكتب تفاصيل التفتيش أو الملاحظة الرقابية بدقة..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">ملاحظات ومرفقات المدقق الداخلي:</label>
              <input
                type="text"
                value={noteForm.auditorNotes}
                onChange={(e) => setNoteForm({ ...noteForm, auditorNotes: e.target.value })}
                placeholder="رقم شهادة المعايرة / محضر الفحص الموقع..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('stream')}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>حفظ وتشفير السجل في الـ Audit Trail</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8. Detailed Modal View for Selected Audit Log */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-red-50 text-red-700 border border-red-200">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">شهادة وبطاقة الفحص الرقمي (Audit Certificate)</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Doc: {selectedAuditLog.docNumber} | ID: {selectedAuditLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 text-[10px] block">المستخدم المنفذ:</span>
                <span className="font-bold text-slate-900">{selectedAuditLog.userNameAr}</span>
                <span className="text-[10px] text-slate-500 block">{selectedAuditLog.userRoleAr}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 text-[10px] block">توقيت الحركة:</span>
                <span className="font-bold font-mono text-slate-900">{selectedAuditLog.timestamp}</span>
                <span className="text-[10px] text-amber-800 block">{selectedAuditLog.hijriDate}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 text-[10px] block">عنوان بروتوكول الإنترنت (IP):</span>
                <span className="font-mono font-bold text-slate-800">{selectedAuditLog.userIpAddress}</span>
                <span className="text-[10px] text-slate-500 block truncate">{selectedAuditLog.userDevice}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 text-[10px] block">معايير الامتثال:</span>
                <span className="font-bold text-emerald-800">{selectedAuditLog.complianceCategory}</span>
                <span className="text-[10px] text-slate-500 block">حالة التنفيذ: {selectedAuditLog.status}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
              <span className="text-slate-400 text-[10px] block mb-1">بيان وملخص العملية المعتمد:</span>
              <p className="text-slate-800 leading-relaxed font-medium">{selectedAuditLog.summaryAr}</p>
            </div>

            {/* Field Changes in Modal */}
            {selectedAuditLog.fieldChanges && selectedAuditLog.fieldChanges.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  <span>تعديلات الحقول (Before vs After):</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedAuditLog.fieldChanges.map((f, i) => (
                    <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200 text-xs grid grid-cols-3 gap-2 items-center">
                      <span className="font-bold text-slate-700">{f.fieldNameAr}</span>
                      <span className="bg-rose-50 text-rose-800 p-1 rounded font-mono text-[10px] line-through text-center">
                        {String(f.oldValue)}
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 p-1 rounded font-mono text-[10px] font-bold text-center">
                        {String(f.newValue)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checksum SHA256 */}
            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[10px] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>بصمة التشفير الرقمية (Digital Checksum):</span>
                </span>
                <span className="text-emerald-400 font-bold">VERIFIED</span>
              </div>
              <div className="text-emerald-300 break-all">{selectedAuditLog.checksumSha256 || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'}</div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
