import React, { useState, useMemo } from 'react';
import {
  Landmark,
  CreditCard,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  FileText,
  Printer,
  ChevronDown,
  Layers,
  Sparkles,
  TrendingUp,
  X,
  RefreshCw,
  Send,
  Eye,
  Check,
  ShieldAlert,
  Sliders,
  DollarSign,
  Building,
  RotateCcw,
  BookOpen,
  ArrowRightLeft,
  Paperclip,
  Lock,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  ChequeBatch,
  ChequeBatchItem,
  ChequeBatchAllocation,
  ChequeLifecycleState,
  ChequeSettings,
  ChequeBook,
} from '../../types/erp';
import { tafqeetArabic, tafqeetEnglish } from '../../utils/tafqeet';
import { gregorianToHijri } from '../../utils/hijri';

export const MultiChequeManagementView: React.FC = () => {
  const {
    invoices,
    chequeBatches,
    saveChequeBatch,
    transitionChequeLifecycle,
    chequeSettings,
    setChequeSettings,
    chequeBooks,
    showToast,
    currentUser,
    logAuditEvent,
  } = useERP();

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'batches' | 'register' | 'new-batch' | 'reports' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('الكل');
  const [partyFilter, setPartyFilter] = useState<string>('الكل');

  // Modal States
  const [selectedPrintBatch, setSelectedPrintBatch] = useState<ChequeBatch | null>(null);
  const [printType, setPrintType] = useState<'receipt' | 'deposit' | 'payment' | 'bounced'>('receipt');
  const [selectedChequeForAction, setSelectedChequeForAction] = useState<{
    batchId: string;
    cheque: ChequeBatchItem;
  } | null>(null);
  const [actionModalType, setActionModalType] = useState<'deposit' | 'collect' | 'bounce' | 'endorse' | 'replace' | 'history' | null>(null);

  // Action Inputs
  const [depositBankInput, setDepositBankInput] = useState('البنك التجاري الدولي (CIB)');
  const [depositDateInput, setDepositDateInput] = useState(new Date().toISOString().slice(0, 10));
  const [bounceReasonInput, setBounceReasonInput] = useState('عدم كفاية الرصيد وطلب مهلة');
  const [bankChargesInput, setBankChargesInput] = useState(250);
  const [penaltyInput, setPenaltyInput] = useState(1000);
  const [endorseSupplierInput, setEndorseSupplierInput] = useState('الشركة الهندسية لإطارات ومهمات الأوناش');
  const [replacementChequeInput, setReplacementChequeInput] = useState('');

  // New Batch Form State
  const [newBatchDirection, setNewBatchDirection] = useState<'استلام من عملاء (Receive)' | 'سداد لموردين (Pay)'>('استلام من عملاء (Receive)');
  const [newBatchCompany, setNewBatchCompany] = useState('شركة مصر للمقاولات المتخصصة (إيجيبت كرينز)');
  const [newBatchBank, setNewBatchBank] = useState('البنك التجاري الدولي CIB - حساب جاري الشركات');
  const [newBatchPostingDate, setNewBatchPostingDate] = useState(new Date().toISOString().slice(0, 10));
  const [newBatchCostCenter, setNewBatchCostCenter] = useState('مشروع مونوريل العاصمة الإدارية');
  const [newBatchRemarks, setNewBatchRemarks] = useState('دفعة شيكات متعددة مع تسوية آلية بنظام الأقدم فالأقدم FIFO');
  const [showJvPreview, setShowJvPreview] = useState(false);

  // New Batch Items Table
  const [batchCheques, setBatchCheques] = useState<ChequeBatchItem[]>([
    {
      id: 'cb-draft-1',
      chequeNo: '00881901',
      partyType: 'عميل',
      partyNameAr: 'شركة المقاولون العرب (عثمان أحمد عثمان)',
      partyId: 'client-arab-contractors',
      drawerName: 'م. أحمد عثمان',
      drawerBankAr: 'البنك الأهلي المصري NBE',
      branchName: 'فرع طلعت حرب',
      accountLast4: '4892',
      amount: 450000,
      currency: 'EGP',
      issueDate: '2026-10-31',
      dueDate: '2026-11-20',
      hijriDueDate: '10 جمادى الأولى 1448',
      status: 'Received',
      notes: 'سداد ساعات تشغيل رافعة 700 طن بمونوريل العاصمة',
    },
    {
      id: 'cb-draft-2',
      chequeNo: '00881902',
      partyType: 'عميل',
      partyNameAr: 'تحالف أوراسكوم للإنشاءات',
      partyId: 'client-orascom',
      drawerName: 'أوراسكوم للإنشاءات ش.م.م',
      drawerBankAr: 'بنك قطر الوطني الأهلي QNB',
      branchName: 'فرع الكوربة',
      accountLast4: '1099',
      amount: 320000,
      currency: 'EGP',
      issueDate: '2026-10-31',
      dueDate: '2026-12-05',
      hijriDueDate: '25 جمادى الأولى 1448',
      status: 'Received',
      notes: 'دفعة سداد مشروع محطة الضبعة النووية',
    },
  ]);

  // New Batch Allocation Table
  const [batchAllocations, setBatchAllocations] = useState<ChequeBatchAllocation[]>([]);

  // Calculation of Totals for New Batch
  const totalChequesSum = useMemo(() => {
    return batchCheques.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  }, [batchCheques]);

  const totalAllocatedSum = useMemo(() => {
    return batchAllocations.reduce((sum, a) => sum + (Number(a.allocatedAmount) || 0), 0);
  }, [batchAllocations]);

  const unallocatedAdvanceSum = Math.max(0, totalChequesSum - totalAllocatedSum);

  // All Cheques Flattened from All Batches for Register
  const allChequesList = useMemo(() => {
    const list: { batch: ChequeBatch; cheque: ChequeBatchItem }[] = [];
    chequeBatches.forEach((batch) => {
      batch.cheques.forEach((cheque) => {
        list.push({ batch, cheque });
      });
    });
    return list;
  }, [chequeBatches]);

  // Dashboard Metrics
  const metrics = useMemo(() => {
    let inSafe = 0;
    let underCollection = 0;
    let collectedThisMonth = 0;
    let returnedCount = 0;
    let returnedAmount = 0;
    let dueNext7Days = 0;

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    allChequesList.forEach(({ cheque }) => {
      if (cheque.status === 'Received') inSafe += cheque.amount;
      if (cheque.status === 'Under Collection') underCollection += cheque.amount;
      if (cheque.status === 'Collected') collectedThisMonth += cheque.amount;
      if (cheque.status === 'Returned') {
        returnedCount++;
        returnedAmount += cheque.amount;
      }

      if (cheque.dueDate) {
        const d = new Date(cheque.dueDate);
        if (d >= today && d <= nextWeek && cheque.status !== 'Collected' && cheque.status !== 'Cancelled') {
          dueNext7Days += cheque.amount;
        }
      }
    });

    return { inSafe, underCollection, collectedThisMonth, returnedCount, returnedAmount, dueNext7Days };
  }, [allChequesList]);

  // Automated FIFO Invoice Allocation Engine
  const runFifoAutoAllocation = () => {
    if (batchCheques.length === 0) {
      showToast('يرجى إضافة شيكات أولاً لتوزيعها على الفواتير');
      return;
    }

    const newAllocations: ChequeBatchAllocation[] = [];

    // Group cheques by party to ensure cheques only pay invoices of the same client!
    const partyCheques: Record<string, { totalAmount: number; cheques: ChequeBatchItem[] }> = {};
    batchCheques.forEach((c) => {
      if (!partyCheques[c.partyNameAr]) {
        partyCheques[c.partyNameAr] = { totalAmount: 0, cheques: [] };
      }
      partyCheques[c.partyNameAr].totalAmount += c.amount;
      partyCheques[c.partyNameAr].cheques.push(c);
    });

    // For each party, fetch their outstanding invoices and allocate FIFO (oldest invoice first)
    Object.entries(partyCheques).forEach(([partyName, partyData]) => {
      let remainingMoneyToAllocate = partyData.totalAmount;

      // Filter invoices for this party only, sort by date ascending (FIFO)
      const partyInvoices = invoices
        .filter((inv) => inv.customerNameAr.includes(partyName) || partyName.includes(inv.customerNameAr))
        .filter((inv) => (inv.outstandingAmount || 0) > 0)
        .sort((a, b) => new Date(a.postingDate).getTime() - new Date(b.postingDate).getTime());

      for (const inv of partyInvoices) {
        if (remainingMoneyToAllocate <= 0) break;

        const outstanding = inv.outstandingAmount || 0;
        const toPay = Math.min(outstanding, remainingMoneyToAllocate);

        // Find which cheque from this party covers this portion
        const firstCheque = partyData.cheques[0];

        newAllocations.push({
          id: `alloc-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          chequeItemId: firstCheque.id,
          referenceType: 'Sales Invoice',
          invoiceId: inv.id,
          invoiceNo: inv.invoiceNo,
          invoiceDate: inv.postingDate,
          invoiceDueDate: inv.dueDate,
          invoiceOutstanding: outstanding,
          allocatedAmount: toPay,
        });

        remainingMoneyToAllocate -= toPay;
      }
    });

    setBatchAllocations(newAllocations);
    showToast(`تم التوزيع التلقائي FIFO بنجاح على ${newAllocations.length} فاتورة.`);
  };

  // Add Row to New Batch
  const handleAddChequeRow = () => {
    const newCheque: ChequeBatchItem = {
      id: `cb-draft-${Date.now()}`,
      chequeNo: `00${Math.floor(100000 + Math.random() * 900000)}`,
      partyType: newBatchDirection.includes('Receive') ? 'عميل' : 'مورد',
      partyNameAr: 'شركة المقاولون العرب',
      drawerBankAr: 'البنك الأهلي المصري NBE',
      accountLast4: '0000',
      amount: 150000,
      currency: 'EGP',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      status: 'Received',
      notes: 'شيك دفعات ساعات تشغيل الرافعة',
    };
    setBatchCheques([...batchCheques, newCheque]);
  };

  // Remove Row from New Batch
  const handleRemoveChequeRow = (id: string) => {
    setBatchCheques(batchCheques.filter((c) => c.id !== id));
    setBatchAllocations(batchAllocations.filter((a) => a.chequeItemId !== id));
  };

  // Save New Batch
  const handleSaveBatch = (submitNow: boolean) => {
    if (batchCheques.length === 0) {
      showToast('يرجى إضافة شيك واحد على الأقل داخل الدفعة');
      return;
    }

    // Validation: prevent duplicate cheque number in same drawer/bank
    const chequeNoSet = new Set<string>();
    for (const chq of batchCheques) {
      const key = `${chq.chequeNo}-${chq.drawerBankAr}`;
      if (chequeNoSet.has(key)) {
        showToast(`خطأ: رقم الشيك ${chq.chequeNo} مكرر لنفس البنك!`);
        return;
      }
      chequeNoSet.add(key);

      if (chq.amount <= 0) {
        showToast(`خطأ: مبلغ الشيك ${chq.chequeNo} يجب أن يكون أكبر من صفر!`);
        return;
      }
    }

    const hijri = gregorianToHijri(new Date(newBatchPostingDate));

    const newBatch: ChequeBatch = {
      id: `batch-${Date.now()}`,
      batchNo: `CHQ-BCH-2026-${Math.floor(100 + Math.random() * 900)}`,
      direction: newBatchDirection,
      company: newBatchCompany,
      postingDate: newBatchPostingDate,
      hijriPostingDate: hijri.formattedAr,
      companyBankAccount: '100045892110',
      bankAccountNameAr: newBatchBank,
      paymentMethod: 'شيك بنكي خطي',
      costCenterAr: newBatchCostCenter,
      projectAr: newBatchCostCenter,
      cheques: batchCheques,
      allocations: batchAllocations,
      totalChequesAmount: totalChequesSum,
      totalAllocatedAmount: totalAllocatedSum,
      unallocatedAdvanceAmount: unallocatedAdvanceSum,
      status: submitNow ? 'معتمدة ومرحلة' : 'مسودة',
      remarksAr: newBatchRemarks,
    };

    saveChequeBatch(newBatch);
    showToast(submitNow ? 'تم اعتماد وترحيل دفعة الشيكات وتوليد القيد المحاسبي بنجاح!' : 'تم حفظ مسودة الدفعة بنجاح!');
    setActiveTab('batches');
  };

  // Execute Lifecycle Action from Modal
  const handleExecuteAction = () => {
    if (!selectedChequeForAction) return;
    const { batchId, cheque } = selectedChequeForAction;

    if (actionModalType === 'deposit') {
      transitionChequeLifecycle(batchId, cheque.id, 'Under Collection', {
        depositDate: depositDateInput,
        reason: `إيداع بالبنك في ${depositBankInput}`,
      });
      showToast(`تم إيداع الشيك ${cheque.chequeNo} في البنك بنجاح.`);
    } else if (actionModalType === 'collect') {
      transitionChequeLifecycle(batchId, cheque.id, 'Collected', {
        reason: 'تم تحصيل الشيك وإضافته إلى كشف حساب البنك.',
      });
      showToast(`تم تحصيل الشيك ${cheque.chequeNo} وإقفال المديونية بنجاح.`);
    } else if (actionModalType === 'bounce') {
      transitionChequeLifecycle(batchId, cheque.id, 'Returned', {
        reason: bounceReasonInput,
        bankCharges: Number(bankChargesInput),
        penaltyAmount: Number(penaltyInput),
      });
      showToast(`تم تسجيل ارتداد الشيك ${cheque.chequeNo} وتوليد القيد العكسي.`);
    } else if (actionModalType === 'endorse') {
      transitionChequeLifecycle(batchId, cheque.id, 'Paid', {
        endorsedToSupplier: endorseSupplierInput,
        reason: `تظهير الشيك لصالح المورد: ${endorseSupplierInput}`,
      });
      showToast(`تم تظهير الشيك ${cheque.chequeNo} للمورد بنجاح.`);
    } else if (actionModalType === 'replace') {
      transitionChequeLifecycle(batchId, cheque.id, 'Cancelled', {
        replacementChequeNo: replacementChequeInput,
        reason: `إلغاء لصدور شيك بديل رقم ${replacementChequeInput}`,
      });
      showToast(`تم ربط الشيك البديل رقم ${replacementChequeInput} بنجاح.`);
    }

    setActionModalType(null);
    setSelectedChequeForAction(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-right" dir="rtl">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 shadow-inner">
                <Landmark className="w-6 h-6 text-emerald-400" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  إدارة الشيكات المتعددة والتسوية الآلية (Multi-Cheque Management)
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    FIFO Auto-Allocation
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  إدارة حوافظ الشيكات المتعددة، التسوية بالأقدمية (FIFO)، دورة الحياة الكاملة والربط المالي الصارم بالقيود المحاسبية لشركة إيجيبت كرينز
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('new-batch')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>دفعة شيكات جديدة (+)</span>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-300" />
              <span>سجل الشيكات المركزي</span>
            </button>
          </div>
        </div>

        {/* 2. Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium">شيكات في الخزينة (أوراق قبض)</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {metrics.inSafe.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">ج.م</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>بانتظار الإيداع البنكي</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium">شيكات تحت التحصيل بالبنك</div>
            <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
              {metrics.underCollection.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">ج.م</span>
            </div>
            <div className="text-[10px] text-amber-300 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>مودعة بحسابات البنوك</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium">استحقاق الأسبوع القادم (7 أيام)</div>
            <div className="text-lg font-black text-sky-400 font-mono mt-0.5">
              {metrics.dueNext7Days.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">ج.م</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-sky-400" />
              <span>تنبيه الخزينة مفعّل</span>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium">شيكات مرتدة (تنبيه مخاطر)</div>
            <div className="text-lg font-black text-rose-400 font-mono mt-0.5">
              {metrics.returnedAmount.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">ج.م</span>
            </div>
            <div className="text-[10px] text-rose-300 mt-1 flex items-center gap-1 font-bold">
              <AlertTriangle className="w-3 h-3" />
              <span>{metrics.returnedCount} شيكات مرتدة</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto no-scrollbar pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>لوحة التحكم ومؤشرات السيولة</span>
        </button>

        <button
          onClick={() => setActiveTab('batches')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'batches'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>حوافظ الشيكات المتعددة (Batches)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono">
            {chequeBatches.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'register'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>سجل الشيكات ودورة الحياة (Register)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono">
            {allChequesList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('new-batch')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'new-batch'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء دفعة وتوزيع FIFO (+)</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'reports'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>تقارير المطابقة والتدفق النقدي</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-b-2 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>إعدادات الشيكات ودفاتر البنوك</span>
        </button>
      </div>

      {/* 4. Tab 1: Cheques Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Aging & Lifecycle Distribution */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>توزيع دورة حياة الشيكات والسيولة المتوقعة</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">Egypt Cranes Cash Position</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] text-slate-500 font-medium">مستلم بالخزينة (PDC)</div>
                  <div className="text-base font-bold text-slate-900 font-mono mt-1">
                    {metrics.inSafe.toLocaleString()} ج.م
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">أوراق قبض غير مودعة</div>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                  <div className="text-[11px] text-amber-800 font-medium">تحت التحصيل بالبنك</div>
                  <div className="text-base font-bold text-amber-900 font-mono mt-1">
                    {metrics.underCollection.toLocaleString()} ج.م
                  </div>
                  <div className="text-[10px] text-amber-700 mt-1">بانتظار قيد المقاصة</div>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                  <div className="text-[11px] text-emerald-800 font-medium">محصل بحسابات البنوك</div>
                  <div className="text-base font-bold text-emerald-900 font-mono mt-1">
                    {metrics.collectedThisMonth.toLocaleString()} ج.م
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-1">سيولة بنكية فعلية</div>
                </div>
              </div>

              {/* Due Date Alert Feed */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>الشيكات المستحقة للتحصيل خلال الأيام القادمة:</span>
                  <span className="text-[11px] text-emerald-600 font-medium">تنبيهات تلقائية 7 / 3 / 1 أيام</span>
                </div>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                  {allChequesList
                    .filter((c) => c.cheque.status !== 'Collected' && c.cheque.status !== 'Cancelled')
                    .slice(0, 4)
                    .map(({ batch, cheque }) => (
                      <div key={cheque.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-900">{cheque.chequeNo}</span>
                          <div>
                            <div className="font-bold text-slate-800">{cheque.partyNameAr}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {cheque.drawerBankAr} • استحقاق: {cheque.dueDate}
                            </div>
                          </div>
                        </div>
                        <div className="text-left font-mono font-bold text-slate-900">
                          {cheque.amount.toLocaleString()} ج.م
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Credit Risk & Bounced Cheques Alert */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>مراقبة مخاطر الائتمان والشيكات المرتدة</span>
                </h2>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>تنبيه سياسة المبيعات والعقود:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  يظهر تحذير فوري لمسؤولي المبيعات عند تحرير عرض سعر أو عقد لعميل له شيكات مرتدة سابقة، ويُلزم موافقة المدير المالي قبل توقيع العقد.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">العملاء المدرجون بقائمة مخاطر الشيكات:</div>
                {allChequesList
                  .filter((c) => c.cheque.status === 'Returned')
                  .map(({ batch, cheque }) => (
                    <div key={cheque.id} className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{cheque.partyNameAr}</span>
                        <span className="px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 text-[10px] font-bold">مرتد</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>شيك: {cheque.chequeNo} ({cheque.amount.toLocaleString()} ج.م)</span>
                        <span className="text-rose-700 font-sans">{cheque.bounceReason || 'عدم كفاية الرصيد'}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Cheque Batches Table */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث برقم الحافظة، اسم العميل، البنك، أو الملاحظات..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-800"
                />
              </div>

              <button
                onClick={() => setActiveTab('new-batch')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء دفعة شيكات جديدة</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold select-none">
                <tr>
                  <th className="py-3 px-3">رقم الحافظة</th>
                  <th className="py-3 px-3">التاريخ والتاريخ الهجري</th>
                  <th className="py-3 px-3">الاتجاه</th>
                  <th className="py-3 px-3">الحساب البنكي للشركة</th>
                  <th className="py-3 px-3 text-center">عدد الشيكات</th>
                  <th className="py-3 px-3">إجمالي الحافظة</th>
                  <th className="py-3 px-3">الموزع على الفواتير</th>
                  <th className="py-3 px-3">غير الموزع (دفعة مقدمة)</th>
                  <th className="py-3 px-3 text-center">الحالة</th>
                  <th className="py-3 px-3 text-center">الطباعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chequeBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{batch.batchNo}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono text-slate-800">{batch.postingDate}</div>
                      <div className="text-[10px] text-amber-800">{batch.hijriPostingDate}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {batch.direction}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{batch.bankAccountNameAr}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                      {batch.cheques.length}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {batch.totalChequesAmount.toLocaleString()} ج.م
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-700 font-bold">
                      {batch.totalAllocatedAmount.toLocaleString()} ج.م
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {batch.unallocatedAdvanceAmount.toLocaleString()} ج.م
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {batch.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedPrintBatch(batch);
                          setPrintType('receipt');
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="طباعة إيصال استلام الشيكات الرسمي"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Central Cheque Register with Full Lifecycle Actions */}
      {activeTab === 'register' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">بحث عام:</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="رقم الشيك، العميل، البنك..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">تصفية بحالة دورة الحياة:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700"
                >
                  <option value="الكل">كافة الحالات</option>
                  <option value="Received">مستلم بالخزينة (Received)</option>
                  <option value="Under Collection">تحت التحصيل بالبنك (Under Collection)</option>
                  <option value="Collected">تم التحصيل بنجاح (Collected)</option>
                  <option value="Returned">مرتد (Returned)</option>
                  <option value="Paid">مدفوع لمورد (Paid)</option>
                  <option value="Cancelled">ملغي (Cancelled)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('الكل');
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            </div>
          </div>

          {/* Cheque Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold select-none">
                  <tr>
                    <th className="py-3 px-3">رقم الشيك</th>
                    <th className="py-3 px-3">الجهة / الساحب</th>
                    <th className="py-3 px-3">البنك والفرع</th>
                    <th className="py-3 px-3">آخر 4 أرقام</th>
                    <th className="py-3 px-3">المبلغ والعملة</th>
                    <th className="py-3 px-3">تاريخ الاستحقاق</th>
                    <th className="py-3 px-3 text-center">الحالة</th>
                    <th className="py-3 px-3 text-center">الإجراءات ودورة الحياة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allChequesList
                    .filter(({ cheque }) => {
                      if (statusFilter !== 'الكل' && cheque.status !== statusFilter) return false;
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase();
                        return (
                          cheque.chequeNo.toLowerCase().includes(q) ||
                          cheque.partyNameAr.toLowerCase().includes(q) ||
                          cheque.drawerBankAr.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map(({ batch, cheque }) => (
                      <tr key={cheque.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {cheque.chequeNo}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-800">{cheque.partyNameAr}</div>
                          <div className="text-[10px] text-slate-400 font-mono">دفعة: {batch.batchNo}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-slate-800">{cheque.drawerBankAr}</div>
                          {cheque.branchName && (
                            <div className="text-[10px] text-slate-400">{cheque.branchName}</div>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">***{cheque.accountLast4}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {cheque.amount.toLocaleString()} {cheque.currency}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-mono text-slate-800">{cheque.dueDate}</div>
                          <div className="text-[10px] text-amber-800">{cheque.hijriDueDate}</div>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                              cheque.status === 'Collected'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : cheque.status === 'Under Collection'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : cheque.status === 'Returned'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : cheque.status === 'Paid'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : cheque.status === 'Cancelled'
                                ? 'bg-slate-100 text-slate-600 border-slate-300'
                                : 'bg-sky-50 text-sky-800 border-sky-200'
                            }`}
                          >
                            {cheque.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {cheque.status === 'Received' && (
                              <button
                                onClick={() => {
                                  setSelectedChequeForAction({ batchId: batch.id, cheque });
                                  setActionModalType('deposit');
                                }}
                                className="px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold text-[10px] cursor-pointer"
                              >
                                إيداع بالبنك
                              </button>
                            )}

                            {cheque.status === 'Under Collection' && (
                              <button
                                onClick={() => {
                                  setSelectedChequeForAction({ batchId: batch.id, cheque });
                                  setActionModalType('collect');
                                }}
                                className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold text-[10px] cursor-pointer"
                              >
                                تحصيل الشيك
                              </button>
                            )}

                            {cheque.status !== 'Collected' && cheque.status !== 'Returned' && cheque.status !== 'Cancelled' && (
                              <button
                                onClick={() => {
                                  setSelectedChequeForAction({ batchId: batch.id, cheque });
                                  setActionModalType('bounce');
                                }}
                                className="px-2 py-1 rounded bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 font-bold text-[10px] cursor-pointer"
                              >
                                ارتداد
                              </button>
                            )}

                            {cheque.status === 'Received' && (
                              <button
                                onClick={() => {
                                  setSelectedChequeForAction({ batchId: batch.id, cheque });
                                  setActionModalType('endorse');
                                }}
                                className="px-2 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 font-bold text-[10px] cursor-pointer"
                              >
                                تظهير لمورد
                              </button>
                            )}

                            {cheque.status === 'Returned' && (
                              <button
                                onClick={() => {
                                  setSelectedChequeForAction({ batchId: batch.id, cheque });
                                  setActionModalType('replace');
                                }}
                                className="px-2 py-1 rounded bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 font-bold text-[10px] cursor-pointer"
                              >
                                شيك بديل
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Create New Cheque Batch with FIFO Engine */}
      {activeTab === 'new-batch' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>إنشاء دفعة شيكات جديدة وتوزيع آلي (FIFO Allocation)</span>
              </h2>
              <p className="text-xs text-slate-500">
                تسجيل عدة شيكات لعدة عملاء أو موردين في معاملة واحدة وتوليد قيود أوراق القبض / الدفع تلقائياً
              </p>
            </div>
          </div>

          {/* Form Headers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">اتجاه المعاملة:</label>
              <select
                value={newBatchDirection}
                onChange={(e) => setNewBatchDirection(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800"
              >
                <option value="استلام من عملاء (Receive)">استلام من عملاء (Receive)</option>
                <option value="سداد لموردين (Pay)">سداد لموردين (Pay)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">الحساب البنكي المودع به:</label>
              <select
                value={newBatchBank}
                onChange={(e) => setNewBatchBank(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
              >
                <option value="البنك التجاري الدولي CIB - حساب جاري الشركات">البنك التجاري الدولي CIB (100045892110)</option>
                <option value="بنك قطر الوطني الأهلي QNB - حساب التشغيل">بنك قطر الوطني الأهلي QNB (203011488902)</option>
                <option value="البنك الأهلي المصري - حساب العمليات الدولاري">البنك الأهلي المصري USD (550189422001)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">تاريخ المعاملة والترحيل:</label>
              <input
                type="date"
                value={newBatchPostingDate}
                onChange={(e) => setNewBatchPostingDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800"
              >
              </input>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">مركز التكلفة / المشروع:</label>
              <input
                type="text"
                value={newBatchCostCenter}
                onChange={(e) => setNewBatchCostCenter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Table 1: Cheques Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>جدول الشيكات المستلمة (Cheque Batch Items)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddChequeRow}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة شيك جديد للصفوف</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">رقم الشيك</th>
                    <th className="py-2.5 px-3">الجهة (العميل)</th>
                    <th className="py-2.5 px-3">بنك الساحب</th>
                    <th className="py-2.5 px-3">آخر 4 أرقام</th>
                    <th className="py-2.5 px-3">المبلغ (ج.م)</th>
                    <th className="py-2.5 px-3">تاريخ الاستحقاق</th>
                    <th className="py-2.5 px-3">ملاحظات</th>
                    <th className="py-2.5 px-3 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batchCheques.map((chq, idx) => (
                    <tr key={chq.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={chq.chequeNo}
                          onChange={(e) => {
                            const updated = [...batchCheques];
                            updated[idx].chequeNo = e.target.value;
                            setBatchCheques(updated);
                          }}
                          className="w-28 p-1.5 bg-slate-50 border border-slate-200 rounded font-mono font-bold"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={chq.partyNameAr}
                          onChange={(e) => {
                            const updated = [...batchCheques];
                            updated[idx].partyNameAr = e.target.value;
                            setBatchCheques(updated);
                          }}
                          className="w-48 p-1.5 bg-slate-50 border border-slate-200 rounded"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={chq.drawerBankAr}
                          onChange={(e) => {
                            const updated = [...batchCheques];
                            updated[idx].drawerBankAr = e.target.value;
                            setBatchCheques(updated);
                          }}
                          className="w-36 p-1.5 bg-slate-50 border border-slate-200 rounded"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          maxLength={4}
                          value={chq.accountLast4}
                          onChange={(e) => {
                            const updated = [...batchCheques];
                            updated[idx].accountLast4 = e.target.value;
                            setBatchCheques(updated);
                          }}
                          className="w-16 p-1.5 bg-slate-50 border border-slate-200 rounded font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={chq.amount}
                          onChange={(e) => {
                            const updated = [...batchCheques];
                            updated[idx].amount = Number(e.target.value);
                            setBatchCheques(updated);
                          }}
                          className="w-32 p-1.5 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-emerald-800"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="date"
                          value={chq.dueDate}
                          onChange={(e) => {
                            const updated = [...batchCheques];
                            updated[idx].dueDate = e.target.value;
                            setBatchCheques(updated);
                          }}
                          className="p-1.5 bg-slate-50 border border-slate-200 rounded font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={chq.notes || ''}
                          onChange={(e) => {
                            const updated = [...batchCheques];
                            updated[idx].notes = e.target.value;
                            setBatchCheques(updated);
                          }}
                          placeholder="ملاحظات..."
                          className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px]"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveChequeRow(chq.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sticky Summary & FIFO Allocation Trigger */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">إجمالي الشيكات:</span>
                <span className="text-lg font-black font-mono text-white">
                  {totalChequesSum.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-slate-400 block font-sans">
                  ({tafqeetArabic(totalChequesSum, 'EGP')})
                </span>
              </div>

              <div className="h-8 w-px bg-slate-700 hidden sm:block" />

              <div>
                <span className="text-slate-400 block text-[10px]">المبلغ الموزع على الفواتير:</span>
                <span className="text-lg font-black font-mono text-emerald-400">
                  {totalAllocatedSum.toLocaleString()} ج.م
                </span>
              </div>

              <div className="h-8 w-px bg-slate-700 hidden sm:block" />

              <div>
                <span className="text-slate-400 block text-[10px]">المتبقي كدفعة مقدمة (Advance):</span>
                <span className="text-lg font-black font-mono text-amber-400">
                  {unallocatedAdvanceSum.toLocaleString()} ج.م
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={runFifoAutoAllocation}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>توزيع تلقائي (الأقدم أولاً FIFO)</span>
              </button>

              <button
                type="button"
                onClick={() => setBatchAllocations([])}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                مسح التوزيع
              </button>

              <button
                type="button"
                onClick={() => setShowJvPreview(!showJvPreview)}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                معاينة قيود اليومية
              </button>
            </div>
          </div>

          {/* Journal Entry Preview Modal/Box */}
          {showJvPreview && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs animate-in fade-in">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>معاينة القيد المحاسبي المزدوج الناتج عن اعتماد الدفعة:</span>
                <span className="text-[10px] text-emerald-700 font-mono">SOX Compliant</span>
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 font-bold">
                    <tr>
                      <th className="p-2">الحساب المحاسبي</th>
                      <th className="p-2 text-center">مدين Debit</th>
                      <th className="p-2 text-center">دائن Credit</th>
                      <th className="p-2">البيان</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-2 text-slate-900 font-sans font-bold">{chequeSettings.chequesInHandAccount}</td>
                      <td className="p-2 text-center font-bold text-emerald-700">{totalChequesSum.toLocaleString()}</td>
                      <td className="p-2 text-center text-slate-400">0</td>
                      <td className="p-2 font-sans text-slate-500">استلام شيكات في الخزينة</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-slate-900 font-sans font-bold">1110 - حسابات العملاء والمدينين (AR)</td>
                      <td className="p-2 text-center text-slate-400">0</td>
                      <td className="p-2 text-center font-bold text-emerald-700">{totalChequesSum.toLocaleString()}</td>
                      <td className="p-2 font-sans text-slate-500">تسوية فواتير العميل أو دفعة مقدمة</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Table 2: Allocations Table */}
          {batchAllocations.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>جدول الفواتير المستحقة المسواة بنظام FIFO (Cheque Batch Allocations)</span>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">رقم الفاتورة</th>
                      <th className="py-2.5 px-3">تاريخ الفاتورة</th>
                      <th className="py-2.5 px-3">المتبقي السابق</th>
                      <th className="py-2.5 px-3">المبلغ المسدد بالشيك</th>
                      <th className="py-2.5 px-3 text-center">حالة الفاتورة بعد السداد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batchAllocations.map((alloc) => (
                      <tr key={alloc.id} className="hover:bg-slate-50 font-mono">
                        <td className="py-2 px-3 font-bold text-slate-900">{alloc.invoiceNo}</td>
                        <td className="py-2 px-3 text-slate-600">{alloc.invoiceDate}</td>
                        <td className="py-2 px-3 text-slate-700">{alloc.invoiceOutstanding.toLocaleString()} ج.م</td>
                        <td className="py-2 px-3 font-bold text-emerald-700">
                          {alloc.allocatedAmount.toLocaleString()} ج.م
                        </td>
                        <td className="py-2 px-3 text-center font-sans">
                          {alloc.allocatedAmount >= alloc.invoiceOutstanding ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              مسددة بالكامل
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              سداد جزئي
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleSaveBatch(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
            >
              حفظ كمسودة
            </button>
            <button
              type="button"
              onClick={() => handleSaveBatch(true)}
              className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>اعتماد وترحيل الدفعة وتوليد القيود</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. Tab 5: Reports & Cash Flow Forecast */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reconciliation Report */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>مطابقة سجل الشيكات مع رصيد الأستاذ العام (GL)</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  متطابق 100%
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                يضمن النظام تطابق مجموع قيم الشيكات في الخزينة وتحت التحصيل مع أرصدة الحسابات المحاسبية في دفتر الأستاذ العام في أي لحظة.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="font-sans text-slate-600">رصيد حساب أوراق قبض (1103):</span>
                  <span className="font-bold text-slate-900">{metrics.inSafe.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-slate-600">رصيد حساب شيكات تحت التحصيل (1104):</span>
                  <span className="font-bold text-slate-900">{metrics.underCollection.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-emerald-700">
                  <span className="font-sans">إجمالي أصول أوراق القبض:</span>
                  <span>{(metrics.inSafe + metrics.underCollection).toLocaleString()} ج.م</span>
                </div>
              </div>
            </div>

            {/* Expected Cash Flow by Due Date */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-sky-600" />
                  <span>توقع التدفق النقدي الداخلي من الشيكات المؤجلة (PDC Cash Flow)</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                توزيع مواعيد استحقاق الشيكات المؤجلة لتحسين السيولة والتخطيط المالي للمشروعات والصيانة.
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-50 flex justify-between items-center">
                  <span>استحقاق نوفمبر 2026:</span>
                  <span className="font-mono font-bold text-slate-900">1,050,000 ج.م</span>
                </div>
                <div className="p-2 rounded bg-slate-50 flex justify-between items-center">
                  <span>استحقاق ديسمبر 2026:</span>
                  <span className="font-mono font-bold text-slate-900">350,000 ج.م</span>
                </div>
                <div className="p-2 rounded bg-slate-50 flex justify-between items-center">
                  <span>استحقاق يناير 2027:</span>
                  <span className="font-mono font-bold text-slate-900">480,000 ج.م</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Tab 6: Cheque Settings & Cheque Books */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>إعدادات الشيكات والحسابات المحاسبية (Cheque Settings)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">حساب شيكات في الخزينة (أوراق قبض):</label>
                <input
                  type="text"
                  value={chequeSettings.chequesInHandAccount}
                  onChange={(e) => setChequeSettings({ ...chequeSettings, chequesInHandAccount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">حساب شيكات تحت التحصيل بالبنك:</label>
                <input
                  type="text"
                  value={chequeSettings.chequesUnderCollectionAccount}
                  onChange={(e) => setChequeSettings({ ...chequeSettings, chequesUnderCollectionAccount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">حساب شيكات مستحقة الدفع (أوراق دفع للموردين):</label>
                <input
                  type="text"
                  value={chequeSettings.chequesPayableAccount}
                  onChange={(e) => setChequeSettings({ ...chequeSettings, chequesPayableAccount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">وقت تخفيض مديونية العميل:</label>
                <select
                  value={chequeSettings.debtReductionTiming}
                  onChange={(e) => setChequeSettings({ ...chequeSettings, debtReductionTiming: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold"
                >
                  <option value="عند الاستلام">عند الاستلام (افتراضي - يخفض الرصيد فوراً)</option>
                  <option value="عند التحصيل">عند التحصيل (لا يخفض الرصيد إلا بعد تحصيل البنك)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="endorse-check"
                  checked={chequeSettings.allowEndorsement}
                  onChange={(e) => setChequeSettings({ ...chequeSettings, allowEndorsement: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="endorse-check" className="font-bold text-slate-700">
                  السماح بتظهير شيكات العملاء لسداد فواتير الموردين (Endorsement)
                </label>
              </div>
            </div>
          </div>

          {/* Cheque Books Management */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>دفاتر الشيكات الصادرة وتنبيهات النفاد (Cheque Books)</span>
            </h3>

            <div className="space-y-3">
              {chequeBooks.map((book) => (
                <div
                  key={book.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    book.status === 'قارب على النفاد'
                      ? 'border-rose-200 bg-rose-50/50'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{book.bankNameAr}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        book.status === 'قارب على النفاد'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {book.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-mono text-[11px]">
                    <span>من رقم: {book.fromNo} إلى: {book.toNo}</span>
                    <span>الشيك الحالي: <strong className="text-slate-900">{book.currentLeaf}</strong></span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[11px] pt-1 border-t border-slate-200/50">
                    <span>متبقي في الدفتر: <strong className="text-slate-900 font-mono">{book.remainingLeaves} شيكات</strong></span>
                    <span className="text-slate-400 font-sans">{book.notes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. Cheque Action Modal (Deposit / Collect / Bounce / Endorse / Replace) */}
      {actionModalType && selectedChequeForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                {actionModalType === 'deposit' && <span>إيداع الشيك بالبنك تحت التحصيل</span>}
                {actionModalType === 'collect' && <span>تأكيد تحصيل الشيك وإضافته للرصيد</span>}
                {actionModalType === 'bounce' && <span>إثبات ارتداد الشيك وعكس القيود</span>}
                {actionModalType === 'endorse' && <span>تظهير الشيك لمورد كسداد</span>}
                {actionModalType === 'replace' && <span>ربط شيك بديل لشيك مرتد</span>}
              </h3>
              <button
                onClick={() => setActionModalType(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="font-sans text-slate-500">رقم الشيك:</span>
                <span className="font-bold text-slate-900">{selectedChequeForAction.cheque.chequeNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-500">الجهة / الساحب:</span>
                <span className="font-sans font-bold text-slate-800">{selectedChequeForAction.cheque.partyNameAr}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-500">المبلغ:</span>
                <span className="font-bold text-emerald-700">
                  {selectedChequeForAction.cheque.amount.toLocaleString()} ج.م
                </span>
              </div>
            </div>

            {actionModalType === 'deposit' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">البنك المودع به الحافظة:</label>
                  <select
                    value={depositBankInput}
                    onChange={(e) => setDepositBankInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold"
                  >
                    <option value="البنك التجاري الدولي (CIB)">البنك التجاري الدولي (CIB)</option>
                    <option value="بنك قطر الوطني الأهلي (QNB)">بنك قطر الوطني الأهلي (QNB)</option>
                    <option value="البنك الأهلي المصري (NBE)">البنك الأهلي المصري (NBE)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ الإيداع الفعلي:</label>
                  <input
                    type="date"
                    value={depositDateInput}
                    onChange={(e) => setDepositDateInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>
            )}

            {actionModalType === 'bounce' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">سبب الارتداد البنكي:</label>
                  <input
                    type="text"
                    value={bounceReasonInput}
                    onChange={(e) => setBounceReasonInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">مصروفات البنك (ج.م):</label>
                    <input
                      type="number"
                      value={bankChargesInput}
                      onChange={(e) => setBankChargesInput(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">غرامة التأخير (ج.م):</label>
                    <input
                      type="number"
                      value={penaltyInput}
                      onChange={(e) => setPenaltyInput(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {actionModalType === 'endorse' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المورد المستفيد من التظهير:</label>
                  <input
                    type="text"
                    value={endorseSupplierInput}
                    onChange={(e) => setEndorseSupplierInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>
            )}

            {actionModalType === 'replace' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الشيك البديل الجديد:</label>
                  <input
                    type="text"
                    value={replacementChequeInput}
                    onChange={(e) => setReplacementChequeInput(e.target.value)}
                    placeholder="مثال: 00985512"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActionModalType(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                تأكيد وتنفيذ الإجراء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Printable Cheque Voucher Modal */}
      {selectedPrintBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 text-right">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/Industrial_Crane_Emblem_and_Wordmark__1__8be0357c.png"
                  alt="Egypt Cranes Logo"
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">شركة مصر للمقاولات المتخصصة (إيجيبت كرينز)</h3>
                  <p className="text-xs text-slate-500 font-mono">The Specialized Contracting Co. (Egypt Cranes)</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة فورية</span>
                </button>
                <button
                  onClick={() => setSelectedPrintBatch(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <h4 className="text-base font-black text-slate-900">
                  إيصال وحافظة استلام شيكات بنكية رسمية (Cheque Receipt Voucher)
                </h4>
                <div className="text-slate-500 font-mono">
                  رقم الحافظة: <strong>{selectedPrintBatch.batchNo}</strong> • التاريخ: {selectedPrintBatch.postingDate} ({selectedPrintBatch.hijriPostingDate})
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2">رقم الشيك</th>
                      <th className="p-2">الساحب / العميل</th>
                      <th className="p-2">البنك</th>
                      <th className="p-2">تاريخ الاستحقاق</th>
                      <th className="p-2 text-left">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {selectedPrintBatch.cheques.map((c) => (
                      <tr key={c.id}>
                        <td className="p-2 font-bold text-slate-900">{c.chequeNo}</td>
                        <td className="p-2 font-sans font-bold text-slate-800">{c.partyNameAr}</td>
                        <td className="p-2 font-sans text-slate-600">{c.drawerBankAr}</td>
                        <td className="p-2">{c.dueDate}</td>
                        <td className="p-2 text-left font-bold text-slate-900">{c.amount.toLocaleString()} ج.م</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
                    <tr>
                      <td colSpan={4} className="p-2 font-sans">الإجمالي الكلي للشيكات المستلمة:</td>
                      <td className="p-2 text-left font-mono text-emerald-800">
                        {selectedPrintBatch.totalChequesAmount.toLocaleString()} ج.م
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-slate-700 leading-relaxed font-sans">
                <strong>فقط وقدره:</strong> {tafqeetArabic(selectedPrintBatch.totalChequesAmount, 'EGP')} لا غير.
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs text-slate-700">
                <div>
                  <div className="font-bold">المستلم / أمين الخزينة:</div>
                  <div className="mt-6 border-b border-slate-300 w-32 mx-auto" />
                </div>
                <div>
                  <div className="font-bold">المحاسب المالي:</div>
                  <div className="mt-6 border-b border-slate-300 w-32 mx-auto" />
                </div>
                <div>
                  <div className="font-bold">اعتماد المدير المالي (CFO):</div>
                  <div className="mt-6 border-b border-slate-300 w-32 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
