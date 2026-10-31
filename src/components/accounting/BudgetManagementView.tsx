import React, { useState } from 'react';
import {
  PieChart,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck,
  Plus,
  Filter,
  DollarSign,
  TrendingDown,
  Building2,
  FolderGit2,
  Users2,
  FileSpreadsheet,
  Clock,
  Check,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { BudgetRecord, BudgetLevel, BudgetOverrideRequest } from '../../types/erp';

export const BudgetManagementView: React.FC = () => {
  const {
    budgets,
    saveBudgetRecord,
    budgetOverrides,
    requestBudgetOverride,
    approveBudgetOverride,
    rejectBudgetOverride,
    currentUser,
    checkBudgetConstraint,
    language,
    t,
  } = useERP();

  const [activeLevelTab, setActiveLevelTab] = useState<'all' | BudgetLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [selectedBudgetForOverride, setSelectedBudgetForOverride] = useState<BudgetRecord | null>(null);

  // New Budget Form State
  const [newBudget, setNewBudget] = useState<Partial<BudgetRecord>>({
    level: 'حساب',
    fiscalYear: 2026,
    allocatedBudget: 5000000,
    actualSpent: 0,
    committedAmount: 0,
    notes: '',
  });

  // Simulation Tool State
  const [simLevel, setSimLevel] = useState<BudgetLevel>('حساب');
  const [simTargetCode, setSimTargetCode] = useState<string>('5210');
  const [simAmount, setSimAmount] = useState<number>(500000);
  const [simResult, setSimResult] = useState<any>(null);

  // Override Request Form State
  const [overrideJustification, setOverrideJustification] = useState('');
  const [overrideAmount, setOverrideAmount] = useState<number>(250000);

  // Filter budgets
  const filteredBudgets = budgets.filter((b) => {
    const matchLevel = activeLevelTab === 'all' || b.level === activeLevelTab;
    const matchQuery =
      b.targetNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchQuery;
  });

  // Counts & Totals
  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocatedBudget + (b.approvedOverrideAmount || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.actualSpent, 0);
  const exceededCount = budgets.filter((b) => b.status === 'تجاوز الموازنة (محظور)').length;
  const warningCount = budgets.filter((b) => b.status === 'تحذير (قريب من الحد)').length;
  const pendingOverridesCount = budgetOverrides.filter((o) => o.status === 'بانتظار اعتماد المدير المالي').length;

  const handleTestSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkBudgetConstraint(simLevel, simTargetCode, simAmount);
    setSimResult(result);
  };

  const handleCreateOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudgetForOverride) return;

    requestBudgetOverride({
      budgetId: selectedBudgetForOverride.id,
      budgetNameAr: selectedBudgetForOverride.targetNameAr,
      level: selectedBudgetForOverride.level,
      allocatedBudget: selectedBudgetForOverride.allocatedBudget,
      currentSpent: selectedBudgetForOverride.actualSpent,
      transactionAmount: overrideAmount,
      exceededAmount: Math.max(0, overrideAmount - (selectedBudgetForOverride.allocatedBudget - selectedBudgetForOverride.actualSpent)),
      requestedByUserId: currentUser.id,
      requestedByUserNameAr: currentUser.nameAr,
      requestDate: new Date().toISOString().split('T')[0],
      justificationAr: overrideJustification || 'طلب اعتماد استثنائي لتغطية تكاليف تشغيل عاجلة لضمان عدم توقف الرافعات.',
    });

    setSelectedBudgetForOverride(null);
    setOverrideJustification('');
  };

  const handleSaveNewBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.targetNameAr) return;

    const record: BudgetRecord = {
      id: `bdg-${Date.now()}`,
      code: newBudget.code || `BDG-${Date.now().toString().slice(-4)}`,
      level: newBudget.level || 'حساب',
      targetNameAr: newBudget.targetNameAr,
      targetNameEn: newBudget.targetNameEn || newBudget.targetNameAr,
      referenceId: newBudget.referenceId || `ref-${Date.now()}`,
      fiscalYear: newBudget.fiscalYear || 2026,
      allocatedBudget: Number(newBudget.allocatedBudget) || 1000000,
      actualSpent: Number(newBudget.actualSpent) || 0,
      committedAmount: Number(newBudget.committedAmount) || 0,
      variance: (Number(newBudget.allocatedBudget) || 1000000) - (Number(newBudget.actualSpent) || 0),
      utilizationPercent:
        (Number(newBudget.allocatedBudget) || 1) > 0
          ? ((Number(newBudget.actualSpent) || 0) / (Number(newBudget.allocatedBudget) || 1)) * 100
          : 0,
      status: 'ضمن الموازنة',
      notes: newBudget.notes || '',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    saveBudgetRecord(record);
    setIsAddModalOpen(false);
    setNewBudget({
      level: 'حساب',
      fiscalYear: 2026,
      allocatedBudget: 5000000,
      actualSpent: 0,
      committedAmount: 0,
      notes: '',
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('Multi-Level Budgeting & Governance', 'الموازنات التقديرية والرقابة على الصرف')}
            </span>
            <span className="text-xs text-slate-400 font-mono">Workflow & Approval Override</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('Budget Control & Over-Budget Approvals', 'الموازنة التقديرية وتنبيهات حظر وتجاوز الصرف')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              'Multi-level budget allocation across accounts, departments, projects, and clients with automatic transaction lock and authorized maker-checker approval override.',
              'رقابة الصرف على 4 مستويات (الحساب، الإدارة، المشروع، والعميل) مع حظر المعاملات عند التجاوز إلا باعتماد المدير المالي.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsSimulationOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200"
          >
            <Lock className="w-3.5 h-3.5 text-red-600" />
            <span>محاكي فحص الموازنة المسبق</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة بند موازنة جديد</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">إجمالي الموازنات المعتمدة (2026)</span>
          <div className="text-xl font-black text-slate-900 font-mono">
            {totalAllocated.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-500">ج.م</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">تغطي كافة الحسابات والإدارات والمشاريع</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">إجمالي المنصرف الفعلي (Actual Spent)</span>
          <div className="text-xl font-black text-slate-800 font-mono">
            {totalSpent.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-500">ج.م</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">
            نسبة الاستهلاك العام: {((totalSpent / totalAllocated) * 100).toFixed(1)}%
          </span>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-900">بنود تحت التحذير (80% - 100%)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 font-mono">{warningCount} بنود</div>
          <span className="text-[10px] text-amber-700 block mt-1">شارفت على استنفاد السقف المالي المعتمد</span>
        </div>

        <div className="bg-red-50 p-4 rounded-2xl border border-red-300 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-red-900">بنود متجاوزة (محظور الصرف عليها)</span>
            <Lock className="w-4 h-4 text-red-600 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-900 font-mono">{exceededCount} بنود محظورة</div>
          <span className="text-[10px] text-red-700 font-bold block mt-1">
            لا تُمرر أي معاملة إلا باعتماد استثنائي من الإدارة المالية
          </span>
        </div>
      </div>

      {/* PENDING APPROVAL OVERRIDES SECTION */}
      {budgetOverrides.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-black">
                سجل طلبات الاعتماد الاستثنائي لتجاوز الموازنة (Approval Overrides & Audit Log)
              </h3>
            </div>
            {pendingOverridesCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 font-mono animate-pulse">
                {pendingOverridesCount} طلب بانتظار الاعتماد
              </span>
            ) : (
              <span className="text-[11px] text-emerald-400 font-medium">كافة الطلبات معتمدة</span>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {budgetOverrides.map((ovr) => {
              const isPending = ovr.status === 'بانتظار اعتماد المدير المالي';
              const isApproved = ovr.status === 'معتمد استثنائياً';

              return (
                <div key={ovr.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{ovr.requestNo}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                        مستوى: {ovr.level}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isPending
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ovr.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800">{ovr.budgetNameAr}</h4>
                    <p className="text-[11px] text-slate-500 max-w-2xl">{ovr.justificationAr}</p>

                    <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                      <span>طالب الاعتماد: {ovr.requestedByUserNameAr} ({ovr.requestDate})</span>
                      {ovr.approvedByUserNameAr && (
                        <span className="text-emerald-700 font-semibold">
                          معتمد من: {ovr.approvedByUserNameAr} بتاريخ {ovr.approvedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">المبلغ الزائد المطلوب:</span>
                      <span className="text-sm font-black font-mono text-red-700">
                        +{ovr.transactionAmount.toLocaleString('ar-EG')} ج.م
                      </span>
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => approveBudgetOverride(ovr.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
                          title="اعتماد استثنائي لفك الحظر وتمرير المعاملة"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>اعتماد استثنائي</span>
                        </button>
                        <button
                          onClick={() => rejectBudgetOverride(ovr.id, 'تجاوز غير مبرر ويجب ترشيد بنود الصيانة')}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-lg font-bold text-xs transition-colors"
                          title="رفض الطلب واستمرار الحظر"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>رفض</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MULTI-LEVEL BUDGET LIST & FILTER TABS */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveLevelTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLevelTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              جميع المستويات ({budgets.length})
            </button>
            <button
              onClick={() => setActiveLevelTab('حساب')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLevelTab === 'حساب' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. مستوى الحسابات ({budgets.filter((b) => b.level === 'حساب').length})
            </button>
            <button
              onClick={() => setActiveLevelTab('إدارة')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLevelTab === 'إدارة' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. مستوى الإدارات ({budgets.filter((b) => b.level === 'إدارة').length})
            </button>
            <button
              onClick={() => setActiveLevelTab('مشروع')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLevelTab === 'مشروع' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. مستوى المشاريع ({budgets.filter((b) => b.level === 'مشروع').length})
            </button>
            <button
              onClick={() => setActiveLevelTab('عميل')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLevelTab === 'عميل' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4. مستوى العملاء ({budgets.filter((b) => b.level === 'عميل').length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="بحث في بنود الموازنة والكود..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>
        </div>

        {/* Budgets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">الكود / المستوى</th>
                <th className="py-3 px-4">اسم البند أو الجهة المعنية</th>
                <th className="py-3 px-4">الموازنة التقديرية المعتمدة</th>
                <th className="py-3 px-4">المنصرف الفعلي</th>
                <th className="py-3 px-4">المتاح / التجاوز</th>
                <th className="py-3 px-4">نسبة الاستهلاك</th>
                <th className="py-3 px-4">حالة الرقابة</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBudgets.map((b) => {
                const isExceeded = b.status === 'تجاوز الموازنة (محظور)';
                const isWarning = b.status === 'تحذير (قريب من الحد)';

                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      <div>{b.code}</div>
                      <span className="text-[10px] font-normal text-slate-400">مستوى {b.level}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{b.targetNameAr}</div>
                      {b.notes && <span className="text-[10px] text-slate-400 line-clamp-1">{b.notes}</span>}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {b.allocatedBudget.toLocaleString('ar-EG')} ج.م
                      {b.approvedOverrideAmount ? (
                        <span className="text-[10px] block text-emerald-700 font-semibold">
                          (+{b.approvedOverrideAmount.toLocaleString('ar-EG')} استثناء)
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {b.actualSpent.toLocaleString('ar-EG')} ج.م
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={b.variance < 0 ? 'text-red-700' : 'text-emerald-700'}>
                        {b.variance.toLocaleString('ar-EG')} ج.م
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-28 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                          <span>{b.utilizationPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              b.utilizationPercent > 100
                                ? 'bg-red-600'
                                : b.utilizationPercent >= 80
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, b.utilizationPercent)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                          isExceeded
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : isWarning
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isExceeded ? <Lock className="w-3 h-3 text-red-700" /> : isWarning ? <AlertTriangle className="w-3 h-3 text-amber-700" /> : <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                        <span>{b.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isExceeded ? (
                        <button
                          onClick={() => {
                            setSelectedBudgetForOverride(b);
                            setOverrideAmount(Math.abs(b.variance) + 100000);
                          }}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors"
                        >
                          طلب استثناء اعتماد
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">طبيعي</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIMULATION / PRE-CHECK MODAL */}
      {isSimulationOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                محاكي فحص موازنة المعاملات (Pre-Transaction Check)
              </h3>
              <button
                onClick={() => {
                  setIsSimulationOpen(false);
                  setSimResult(null);
                }}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              اختبر ما إذا كان قيد اليومية أو إذن الصرف أو فاتورة الشراء سيمر بسلاسة أم سيتم حظره وتنبيه المستخدم لتجاوز الموازنة.
            </p>

            <form onSubmit={handleTestSimulation} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المستوى الرقابي:</label>
                <select
                  value={simLevel}
                  onChange={(e) => setSimLevel(e.target.value as BudgetLevel)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  <option value="حساب">مستوى الحسابات (Account)</option>
                  <option value="إدارة">مستوى الإدارات (Department)</option>
                  <option value="مشروع">مستوى المشاريع (Project)</option>
                  <option value="عميل">مستوى العملاء (Client)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">كود أو اسم البند:</label>
                <input
                  type="text"
                  value={simTargetCode}
                  onChange={(e) => setSimTargetCode(e.target.value)}
                  placeholder="مثال: 5210 أو قطاع مونوريل العاصمة"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">قيمة المعاملة المراد صرفها (ج.م):</label>
                <input
                  type="number"
                  value={simAmount}
                  onChange={(e) => setSimAmount(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                فحص الموازنة وتطبيق شروط الحظر
              </button>
            </form>

            {/* Simulation Result Output */}
            {simResult && (
              <div
                className={`p-4 rounded-xl border text-xs mt-3 space-y-1.5 animate-in fade-in ${
                  simResult.isExceeded
                    ? 'bg-red-50 border-red-300 text-red-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-sm">
                  {simResult.isExceeded ? (
                    <>
                      <Lock className="w-4 h-4 text-red-700" />
                      <span>محظور: تم رفض المعاملة لتجاوز الموازنة!</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>مسموح: المعاملة تقع بالكامل ضمن الموازنة المعتمدة.</span>
                    </>
                  )}
                </div>
                {simResult.warningMessage && <p className="text-[11px] font-medium leading-relaxed">{simResult.warningMessage}</p>}
                {simResult.budgetRecord && (
                  <div className="pt-2 text-[10px] text-slate-600 border-t border-slate-200/60 font-mono">
                    بند: {simResult.budgetRecord.targetNameAr} | المتاح: {(simResult.budgetRecord.allocatedBudget - simResult.budgetRecord.actualSpent).toLocaleString('ar-EG')} ج.م
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* OVERRIDE REQUEST MODAL */}
      {selectedBudgetForOverride && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">
                طلب اعتماد استثناء موازنة لـ {selectedBudgetForOverride.targetNameAr}
              </h3>
              <button onClick={() => setSelectedBudgetForOverride(null)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOverride} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المبلغ المطلوب اعتماده استثنائياً (ج.م):</label>
                <input
                  type="number"
                  value={overrideAmount}
                  onChange={(e) => setOverrideAmount(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">سبب الاستثناء ومبرر الصرف الطارئ:</label>
                <textarea
                  rows={3}
                  value={overrideJustification}
                  onChange={(e) => setOverrideJustification(e.target.value)}
                  placeholder="وضح سبب تجاوز الموازنة والضرورة التشغيلية..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                ⚠️ بمجرد تقديم الطلب، سيصل إشعار للمدير المالي لاعتماده أو رفضه. لا يمكن الصرف حتى صدور الاعتماد.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBudgetForOverride(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
                >
                  إرسال الطلب للاعتماد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW BUDGET MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">إضافة بند موازنة تقديرية جديد</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewBudget} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">المستوى الرقابي:</label>
                <select
                  value={newBudget.level}
                  onChange={(e) => setNewBudget({ ...newBudget, level: e.target.value as BudgetLevel })}
                  className="w-full font-bold bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  <option value="حساب">مستوى الحساب (Account)</option>
                  <option value="إدارة">مستوى الإدارة (Department)</option>
                  <option value="مشروع">مستوى المشروع (Project)</option>
                  <option value="عميل">مستوى العميل (Client)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">كود البند:</label>
                <input
                  type="text"
                  value={newBudget.code || ''}
                  onChange={(e) => setNewBudget({ ...newBudget, code: e.target.value })}
                  placeholder="مثال: 5240 أو PRJ-DELTA"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم البند / الجهة التقديرية (بالعربية):</label>
                <input
                  type="text"
                  value={newBudget.targetNameAr || ''}
                  onChange={(e) => setNewBudget({ ...newBudget, targetNameAr: e.target.value })}
                  placeholder="مثال: موازنة قطع غيار الورشة المتنقلة"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">المبلغ المعتمد للموازنة (ج.م):</label>
                <input
                  type="number"
                  value={newBudget.allocatedBudget || ''}
                  onChange={(e) => setNewBudget({ ...newBudget, allocatedBudget: Number(e.target.value) })}
                  className="w-full font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ملاحظات وشروط الصرف:</label>
                <textarea
                  rows={2}
                  value={newBudget.notes || ''}
                  onChange={(e) => setNewBudget({ ...newBudget, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-black text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
                >
                  حفظ الموازنة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
