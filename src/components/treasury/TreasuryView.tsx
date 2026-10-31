import React, { useState, useMemo } from 'react';
import {
  Landmark,
  Plus,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Building,
  UserCheck,
  CreditCard,
  QrCode,
  DollarSign,
  Briefcase,
  ChevronDown,
  X,
  Truck,
  Send,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { CashBox, TreasuryVoucher, ChequeItem } from '../../types/erp';
import { formatDateISO } from '../../utils/hijri';
import { QRCodeDisplay } from '../common/QrBarcodeTools';

export const TreasuryView: React.FC = () => {
  const {
    cashBoxes,
    saveCashBox,
    treasuryVouchers,
    saveTreasuryVoucher,
    cancelTreasuryVoucher,
    cheques,
    updateChequeStatus,
    addCheque,
    fleet,
    costCenters,
    currentUser,
    loginSettings,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'safes' | 'vouchers' | 'position' | 'cheques'>('safes');
  const [searchQuery, setSearchQuery] = useState('');
  const [voucherFilterType, setVoucherFilterType] = useState<string>('all');
  const [voucherFilterMethod, setVoucherFilterMethod] = useState<string>('all');
  const [selectedSafeId, setSelectedSafeId] = useState<string>('all');
  const [chequeStatusFilter, setChequeStatusFilter] = useState<string>('all');

  // Financial Position Date Filter
  const [positionDateMode, setPositionDateMode] = useState<'today' | 'custom'>('today');
  const [positionStartDate, setPositionStartDate] = useState<string>(
    formatDateISO(new Date(Date.now() - 7 * 86400000))
  );
  const [positionEndDate, setPositionEndDate] = useState<string>(formatDateISO(new Date()));
  const [positionSafeFilter, setPositionSafeFilter] = useState<string>('all');

  // Modals
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherModalType, setVoucherModalType] = useState<'إذن قبض / إضافة' | 'إذن صرف'>('إذن قبض / إضافة');
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<TreasuryVoucher | null>(null);
  const [isSafeModalOpen, setIsSafeModalOpen] = useState(false);
  const [isChequeModalOpen, setIsChequeModalOpen] = useState(false);
  const [isTransferSupplierModalOpen, setIsTransferSupplierModalOpen] = useState(false);
  const [selectedChequeForTransfer, setSelectedChequeForTransfer] = useState<ChequeItem | null>(null);
  const [supplierNameInput, setSupplierNameInput] = useState('');

  // Voucher Form State
  const [formVoucher, setFormVoucher] = useState<{
    cashBoxId: string;
    paymentMethod: 'نقدي' | 'شيك';
    date: string;
    amount: number;
    currency: 'EGP' | 'USD';
    partyType: TreasuryVoucher['partyType'];
    partyNameAr: string;
    costCenterAr: string;
    linkedEquipment: string;
    linkedVehicle: string;
    chequeNo: string;
    chequeDate: string;
    bankNameAr: string;
    remarksAr: string;
    receivedByOrPaidToAr: string;
  }>({
    cashBoxId: cashBoxes[0]?.id || '',
    paymentMethod: 'نقدي',
    date: formatDateISO(new Date()),
    amount: 0,
    currency: 'EGP',
    partyType: 'عميل',
    partyNameAr: '',
    costCenterAr: '',
    linkedEquipment: '',
    linkedVehicle: '',
    chequeNo: '',
    chequeDate: formatDateISO(new Date()),
    bankNameAr: '',
    remarksAr: '',
    receivedByOrPaidToAr: '',
  });

  // Safe Form State
  const [formSafe, setFormSafe] = useState<Partial<CashBox>>({
    code: `1101-0${cashBoxes.length + 1}`,
    nameAr: '',
    nameEn: '',
    type: 'خزينة فرعية / موقع',
    currency: 'EGP',
    openingBalance: 0,
    custodianAr: currentUser.nameAr,
    branchOrProjectAr: '',
    status: 'نشط',
  });

  // Cheque Form State
  const [formCheque, setFormCheque] = useState<Partial<ChequeItem>>({
    chequeNo: '',
    direction: 'وارد (من عميل)',
    status: 'في الخزينة',
    amount: 0,
    currency: 'EGP',
    drawerBankAr: 'البنك التجاري الدولي (CIB)',
    dueDate: formatDateISO(new Date(Date.now() + 15 * 86400000)),
    issueDate: formatDateISO(new Date()),
    clientOrPayerAr: '',
    beneficiaryAr: 'شركة مصر للمقاولات المتخصصة (إيجيبت كرينز)',
    notes: '',
  });

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalCashEgp = cashBoxes
      .filter((b) => b.type.includes('خزينة') && b.currency === 'EGP')
      .reduce((s, b) => s + b.currentBalance, 0);

    const totalBankEgp = cashBoxes
      .filter((b) => b.type === 'حساب بنكي جاري' && b.currency === 'EGP')
      .reduce((s, b) => s + b.currentBalance, 0);

    const totalUsd = cashBoxes
      .filter((b) => b.currency === 'USD')
      .reduce((s, b) => s + b.currentBalance, 0);

    const pendingChequesInSafe = cheques
      .filter((c) => c.direction === 'وارد (من عميل)' && (c.status === 'في الخزينة' || c.status === 'مرسل للتحصيل بالبنك'))
      .reduce((s, c) => s + c.amount, 0);

    return { totalCashEgp, totalBankEgp, totalUsd, pendingChequesInSafe };
  }, [cashBoxes, cheques]);

  // Financial Position Calculation
  const financialPosition = useMemo(() => {
    const today = formatDateISO(new Date());
    const startDate = positionDateMode === 'today' ? today : positionStartDate;
    const endDate = positionDateMode === 'today' ? today : positionEndDate;

    const relevantBoxes = positionSafeFilter === 'all'
      ? cashBoxes
      : cashBoxes.filter((b) => b.id === positionSafeFilter);

    const relevantVouchers = treasuryVouchers.filter((v) => {
      if (v.status === 'ملغى') return false;
      if (positionSafeFilter !== 'all' && v.cashBoxId !== positionSafeFilter) return false;
      return v.date >= startDate && v.date <= endDate;
    });

    const cashReceipts = relevantVouchers
      .filter((v) => v.type === 'إذن قبض / إضافة' && v.paymentMethod === 'نقدي')
      .reduce((s, v) => s + v.amount, 0);

    const chequeReceipts = relevantVouchers
      .filter((v) => v.type === 'إذن قبض / إضافة' && v.paymentMethod === 'شيك')
      .reduce((s, v) => s + v.amount, 0);

    const cashPayments = relevantVouchers
      .filter((v) => v.type === 'إذن صرف' && v.paymentMethod === 'نقدي')
      .reduce((s, v) => s + v.amount, 0);

    const chequePayments = relevantVouchers
      .filter((v) => v.type === 'إذن صرف' && v.paymentMethod === 'شيك')
      .reduce((s, v) => s + v.amount, 0);

    const currentTotalBalance = relevantBoxes.reduce((s, b) => s + b.currentBalance, 0);
    const netPeriodMovement = (cashReceipts + chequeReceipts) - (cashPayments + chequePayments);
    const openingPeriodBalance = currentTotalBalance - netPeriodMovement;

    return {
      startDate,
      endDate,
      relevantBoxes,
      relevantVouchers,
      openingPeriodBalance,
      cashReceipts,
      chequeReceipts,
      totalReceipts: cashReceipts + chequeReceipts,
      cashPayments,
      chequePayments,
      totalPayments: cashPayments + chequePayments,
      netPeriodMovement,
      currentTotalBalance,
    };
  }, [positionDateMode, positionStartDate, positionEndDate, positionSafeFilter, cashBoxes, treasuryVouchers]);

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return treasuryVouchers.filter((v) => {
      if (voucherFilterType !== 'all' && v.type !== voucherFilterType) return false;
      if (voucherFilterMethod !== 'all' && v.paymentMethod !== voucherFilterMethod) return false;
      if (selectedSafeId !== 'all' && v.cashBoxId !== selectedSafeId) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          v.voucherNo.toLowerCase().includes(q) ||
          v.partyNameAr.toLowerCase().includes(q) ||
          v.remarksAr.toLowerCase().includes(q) ||
          (v.linkedEquipment && v.linkedEquipment.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [treasuryVouchers, voucherFilterType, voucherFilterMethod, selectedSafeId, searchQuery]);

  // Filtered Cheques
  const filteredCheques = useMemo(() => {
    return cheques.filter((c) => {
      if (chequeStatusFilter !== 'all' && c.status !== chequeStatusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.chequeNo.toLowerCase().includes(q) ||
          c.clientOrPayerAr.toLowerCase().includes(q) ||
          c.beneficiaryAr.toLowerCase().includes(q) ||
          (c.transferredToSupplierAr && c.transferredToSupplierAr.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [cheques, chequeStatusFilter, searchQuery]);

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVoucher.amount || formVoucher.amount <= 0) return;

    const safe = cashBoxes.find((b) => b.id === formVoucher.cashBoxId);

    saveTreasuryVoucher({
      type: voucherModalType,
      paymentMethod: formVoucher.paymentMethod,
      cashBoxId: formVoucher.cashBoxId,
      cashBoxNameAr: safe ? safe.nameAr : 'الخزينة المحددة',
      date: formVoucher.date,
      amount: Number(formVoucher.amount),
      currency: formVoucher.currency,
      amountInWordsAr: '',
      amountInWordsEn: '',
      partyType: formVoucher.partyType,
      partyNameAr: formVoucher.partyNameAr || 'عميل / مورد عام',
      costCenterAr: formVoucher.costCenterAr || undefined,
      linkedEquipment: formVoucher.linkedEquipment || undefined,
      linkedVehicle: formVoucher.linkedVehicle || undefined,
      chequeNo: formVoucher.paymentMethod === 'شيك' ? formVoucher.chequeNo : undefined,
      chequeDate: formVoucher.paymentMethod === 'شيك' ? formVoucher.chequeDate : undefined,
      bankNameAr: formVoucher.paymentMethod === 'شيك' ? formVoucher.bankNameAr : undefined,
      remarksAr: formVoucher.remarksAr,
      status: 'معتمد',
      createdByAr: currentUser.nameAr,
      receivedByOrPaidToAr: formVoucher.receivedByOrPaidToAr || currentUser.nameAr,
    });

    setIsVoucherModalOpen(false);
  };

  const handleCreateSafe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSafe.nameAr) return;

    saveCashBox({
      id: `cb-${Date.now()}`,
      code: formSafe.code || `1101-0${cashBoxes.length + 1}`,
      nameAr: formSafe.nameAr,
      nameEn: formSafe.nameEn || formSafe.nameAr,
      type: formSafe.type as CashBox['type'],
      currency: formSafe.currency as CashBox['currency'],
      openingBalance: Number(formSafe.openingBalance || 0),
      currentBalance: Number(formSafe.openingBalance || 0),
      custodianAr: formSafe.custodianAr || currentUser.nameAr,
      branchOrProjectAr: formSafe.branchOrProjectAr || 'المقر الرئيسي',
      bankAccountNumber: formSafe.bankAccountNumber,
      bankNameAr: formSafe.bankNameAr,
      status: 'نشط',
    });

    setIsSafeModalOpen(false);
  };

  const handleCreateCheque = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCheque.chequeNo || !formCheque.amount) return;

    addCheque({
      chequeNo: formCheque.chequeNo,
      direction: formCheque.direction as ChequeItem['direction'],
      status: 'في الخزينة',
      amount: Number(formCheque.amount),
      currency: formCheque.currency as ChequeItem['currency'],
      drawerBankAr: formCheque.drawerBankAr || 'البنك المسحوب عليه',
      dueDate: formCheque.dueDate || formatDateISO(new Date()),
      issueDate: formCheque.issueDate || formatDateISO(new Date()),
      clientOrPayerAr: formCheque.clientOrPayerAr || 'الساحب',
      beneficiaryAr: formCheque.beneficiaryAr || 'شركة مصر للمقاولات المتخصصة (إيجيبت كرينز)',
      notes: formCheque.notes,
    });

    setIsChequeModalOpen(false);
  };

  const handleEndorseCheque = () => {
    if (!selectedChequeForTransfer || !supplierNameInput.trim()) return;
    updateChequeStatus(selectedChequeForTransfer.id, 'محول لمورد (تظهير)', {
      transferredToSupplierAr: supplierNameInput.trim(),
    });
    setIsTransferSupplierModalOpen(false);
    setSelectedChequeForTransfer(null);
    setSupplierNameInput('');
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6" dir="rtl">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
            <span>المالية والحسابات</span>
            <span>/</span>
            <span className="text-red-700 font-bold">الخزائن والشيكات النقدية</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Landmark className="w-7 h-7 text-red-600" />
            إدارة الخزائن النقدية وحافظة الشيكات
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة الخزينة الرئيسية وخزائن المواقع، أذون الإضافة والصرف مع رمز QR للتحقق، والمركز المالي اليومي
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setVoucherModalType('إذن قبض / إضافة');
              setFormVoucher((prev) => ({
                ...prev,
                paymentMethod: 'نقدي',
                partyType: 'عميل',
              }));
              setIsVoucherModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <ArrowDownLeft className="w-4 h-4" />
            + إذن قبض / إضافة (QR)
          </button>

          <button
            onClick={() => {
              setVoucherModalType('إذن صرف');
              setFormVoucher((prev) => ({
                ...prev,
                paymentMethod: 'نقدي',
                partyType: 'مصروفات تشغيل ومعدات',
              }));
              setIsVoucherModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4" />
            + إذن صرف نقدية / شيك (QR)
          </button>

          <button
            onClick={() => setIsSafeModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            + فتح خزينة / حساب
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">سيولة الخزائن النقدية (EGP)</span>
            <span className="text-xl font-black text-slate-900 block mt-1">
              {metrics.totalCashEgp.toLocaleString()} ج.م
            </span>
            <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">
              جاهزة للصرف بمستودعات ومواقع الأوناش
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">أرصدة البنوك الجارية (EGP)</span>
            <span className="text-xl font-black text-slate-900 block mt-1">
              {metrics.totalBankEgp.toLocaleString()} ج.م
            </span>
            <span className="text-[11px] text-blue-600 font-bold mt-0.5 block">
              حسابات العمليات والشركات
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">رصيد العملة الأجنبية (USD)</span>
            <span className="text-xl font-black text-amber-700 block mt-1">
              ${metrics.totalUsd.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-bold mt-0.5 block">
              حساب بنك مصر للاستيراد وقطع الغيار
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">شيكات واردة تحت التحصيل</span>
            <span className="text-xl font-black text-purple-700 block mt-1">
              {metrics.pendingChequesInSafe.toLocaleString()} ج.م
            </span>
            <span className="text-[11px] text-purple-600 font-bold mt-0.5 block">
              في الخزينة ومرسلة للبنك
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-1 bg-white p-1 rounded-2xl shadow-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('safes')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'safes'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          الخزائن والحسابات البنكية ({cashBoxes.length})
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'vouchers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4 text-emerald-400" />
          أذون القبض والصرف (QR) ({treasuryVouchers.length})
        </button>

        <button
          onClick={() => setActiveTab('position')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'position'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          المركز المالي للخزينة (يومي / دوري)
        </button>

        <button
          onClick={() => setActiveTab('cheques')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'cheques'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-400" />
          حافظة ومتابعة دورة حياة الشيكات ({cheques.length})
        </button>
      </div>

      {/* ================= TAB 1: SAFES & BANK ACCOUNTS ================= */}
      {activeTab === 'safes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cashBoxes.map((box) => {
              const isMain = box.type === 'خزينة رئيسية';
              const isBank = box.type === 'حساب بنكي جاري';
              return (
                <div
                  key={box.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-1.5 ${
                          isMain
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : isBank
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {box.type}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{box.nameAr}</h3>
                      <span className="text-[11px] font-mono text-slate-400 block mt-0.5">كود: {box.code}</span>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      {isBank ? <CreditCard className="w-5 h-5 text-blue-600" /> : <Landmark className="w-5 h-5 text-red-600" />}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">أمين الخزينة / المفوض:</span>
                      <span className="font-semibold text-slate-800">{box.custodianAr}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">الموقع / الفرع:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[160px]">{box.branchOrProjectAr}</span>
                    </div>
                    {box.bankAccountNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">رقم الحساب IBAN/ACC:</span>
                        <span className="font-mono font-bold text-slate-800">{box.bankAccountNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">الرصيد الفعلي الحالي</span>
                      <span className="text-lg font-black text-slate-900">
                        {box.currentBalance.toLocaleString()}{' '}
                        <span className="text-xs font-bold text-slate-500">{box.currency}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setPositionSafeFilter(box.id);
                        setActiveTab('position');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      كشف حركة
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: TREASURY VOUCHERS (QR) ================= */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث برقم الإذن، المستلم، المعدة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <select
                value={voucherFilterType}
                onChange={(e) => setVoucherFilterType(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none"
              >
                <option value="all">جميع الأذون (قبض وصرف)</option>
                <option value="إذن قبض / إضافة">أذون القبض / الإضافة (+)</option>
                <option value="إذن صرف">أذون الصرف (-)</option>
              </select>

              <select
                value={voucherFilterMethod}
                onChange={(e) => setVoucherFilterMethod(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none"
              >
                <option value="all">كل طرق الدفع</option>
                <option value="نقدي">نقدي (كاش)</option>
                <option value="شيك">شيك بنكي</option>
              </select>

              <select
                value={selectedSafeId}
                onChange={(e) => setSelectedSafeId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none max-w-[200px]"
              >
                <option value="all">كل الخزائن والحسابات</option>
                {cashBoxes.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs font-semibold text-slate-500">
              إجمالي الأذون المعروضة: {filteredVouchers.length}
            </span>
          </div>

          {/* Vouchers Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">رقم الإذن ورمز QR</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">نوع الإذن</th>
                    <th className="py-3 px-4">الخزينة / الحساب</th>
                    <th className="py-3 px-4">الجهة / المستلم</th>
                    <th className="py-3 px-4">المعدة / مركز التكلفة</th>
                    <th className="py-3 px-4">المبلغ</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVouchers.map((v) => {
                    const isReceipt = v.type === 'إذن قبض / إضافة';
                    const isCancelled = v.status === 'ملغى';
                    return (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                          <button
                            onClick={() => setSelectedVoucherForPrint(v)}
                            title="عرض وطباعة الإذن مع رمز QR"
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <span>{v.voucherNo}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{v.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isReceipt
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {isReceipt ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            {v.type} ({v.paymentMethod})
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700 max-w-[150px] truncate">
                          {v.cashBoxNameAr}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{v.partyNameAr}</td>
                        <td className="py-3 px-4 text-slate-600">
                          {v.linkedEquipment ? (
                            <span className="inline-flex items-center gap-1 text-slate-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <Truck className="w-3 h-3 text-amber-700" />
                              {v.linkedEquipment}
                            </span>
                          ) : (
                            v.costCenterAr || 'عام'
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          <span className={isReceipt ? 'text-emerald-700' : 'text-red-700'}>
                            {isReceipt ? '+' : '-'} {v.amount.toLocaleString()} {v.currency}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isCancelled
                                ? 'bg-slate-100 text-slate-500 line-through'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {v.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedVoucherForPrint(v)}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition-colors flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3" />
                              طباعة
                            </button>
                            {!isCancelled && (
                              <button
                                onClick={() => cancelTreasuryVoucher(v.id)}
                                title="إلغاء الإذن وتسوية الرصيد"
                                className="px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold transition-colors"
                              >
                                إلغاء
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: FINANCIAL POSITION STATEMENT ================= */}
      {activeTab === 'position' && (
        <div className="space-y-5">
          {/* Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setPositionDateMode('today')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    positionDateMode === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  المركز المالي لليوم (Daily)
                </button>
                <button
                  onClick={() => setPositionDateMode('custom')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    positionDateMode === 'custom' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  تحديد فترة مخصصة (Custom Range)
                </button>
              </div>

              {positionDateMode === 'custom' && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                    <span className="text-slate-400 font-bold">من:</span>
                    <input
                      type="date"
                      value={positionStartDate}
                      onChange={(e) => setPositionStartDate(e.target.value)}
                      className="bg-transparent font-medium focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                    <span className="text-slate-400 font-bold">إلى:</span>
                    <input
                      type="date"
                      value={positionEndDate}
                      onChange={(e) => setPositionEndDate(e.target.value)}
                      className="bg-transparent font-medium focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <select
                value={positionSafeFilter}
                onChange={(e) => setPositionSafeFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-none"
              >
                <option value="all">المركز المالي الشامل (كل الخزائن والبنوك)</option>
                {cashBoxes.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-slate-800"
            >
              <Printer className="w-4 h-4" />
              طباعة كشف المركز المالي
            </button>
          </div>

          {/* Statement Board */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-red-600 block uppercase tracking-wider">
                  شركة مصر للمقاولات المتخصصة (إيجيبت كرينز)
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  تقرير المركز المالي لحركة الخزائن والسيولة النقدية
                </h2>
                <span className="text-xs text-slate-500 block mt-0.5">
                  الفترة: من {financialPosition.startDate} إلى {financialPosition.endDate} | الخزينة المحددة:{' '}
                  {positionSafeFilter === 'all'
                    ? 'كافة الخزائن والبنوك'
                    : cashBoxes.find((b) => b.id === positionSafeFilter)?.nameAr}
                </span>
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-400 block">تاريخ إعداد التقرير</span>
                <span className="text-sm font-bold text-slate-800">{formatDateISO(new Date())}</span>
              </div>
            </div>

            {/* Balances Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 block">رصيد بداية الفترة</span>
                <span className="text-lg font-black text-slate-800 block mt-1">
                  {financialPosition.openingPeriodBalance.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">الرصيد الافتتاحي قبل الحركات</span>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 block">إجمالي المقبوضات (+)</span>
                <span className="text-lg font-black text-emerald-900 block mt-1">
                  +{financialPosition.totalReceipts.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-emerald-700 mt-0.5 block">
                  نقدي: {financialPosition.cashReceipts.toLocaleString()} | شيكات:{' '}
                  {financialPosition.chequeReceipts.toLocaleString()}
                </span>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <span className="text-xs font-bold text-red-800 block">إجمالي المدفوعات (-)</span>
                <span className="text-lg font-black text-red-900 block mt-1">
                  -{financialPosition.totalPayments.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-red-700 mt-0.5 block">
                  نقدي: {financialPosition.cashPayments.toLocaleString()} | شيكات:{' '}
                  {financialPosition.chequePayments.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm">
                <span className="text-xs font-bold text-slate-300 block">رصيد نهاية الفترة (السيولة الحالية)</span>
                <span className="text-xl font-black text-amber-400 block mt-1">
                  {financialPosition.currentTotalBalance.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-slate-300 mt-0.5 block">
                  صافي الحركة خلال الفترة: {financialPosition.netPeriodMovement >= 0 ? '+' : ''}
                  {financialPosition.netPeriodMovement.toLocaleString()} ج.م
                </span>
              </div>
            </div>

            {/* Vouchers in Period */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">حركات الخزينة المعتمدة خلال هذه الفترة</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">رقم الإذن</th>
                      <th className="py-2.5 px-3">التاريخ</th>
                      <th className="py-2.5 px-3">نوع الحركة</th>
                      <th className="py-2.5 px-3">البيان والجهة</th>
                      <th className="py-2.5 px-3">الخزينة</th>
                      <th className="py-2.5 px-3">المقبوضات (+)</th>
                      <th className="py-2.5 px-3">المدفوعات (-)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {financialPosition.relevantVouchers.map((v) => {
                      const isReceipt = v.type === 'إذن قبض / إضافة';
                      return (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{v.voucherNo}</td>
                          <td className="py-2.5 px-3 text-slate-600">{v.date}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isReceipt ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {v.type} ({v.paymentMethod})
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">
                            {v.partyNameAr} - {v.remarksAr}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{v.cashBoxNameAr}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                            {isReceipt ? `${v.amount.toLocaleString()} ج.م` : '-'}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-red-700">
                            {!isReceipt ? `${v.amount.toLocaleString()} ج.م` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: CHEQUES PORTFOLIO ================= */}
      {activeTab === 'cheques' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث برقم الشيك، الساحب، المستفيد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <select
                value={chequeStatusFilter}
                onChange={(e) => setChequeStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="في الخزينة">في الخزينة</option>
                <option value="مرسل للتحصيل بالبنك">مرسل للتحصيل بالبنك</option>
                <option value="محصل بحساب البنك">محصل بحساب البنك</option>
                <option value="محول لمورد (تظهير)">محول لمورد (تظهير)</option>
                <option value="مرتد">مرتد</option>
              </select>
            </div>

            <button
              onClick={() => setIsChequeModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              + إضافة شيك للحافظة
            </button>
          </div>

          {/* Cheques Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCheques.map((chq) => {
              const isIncoming = chq.direction === 'وارد (من عميل)';
              return (
                <div
                  key={chq.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-1 ${
                          isIncoming
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {chq.direction}
                      </span>
                      <h3 className="text-base font-black font-mono text-slate-900">{chq.chequeNo}</h3>
                      <span className="text-xs text-slate-500 font-medium">{chq.drawerBankAr}</span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        chq.status === 'في الخزينة'
                          ? 'bg-amber-100 text-amber-800'
                          : chq.status === 'مرسل للتحصيل بالبنك'
                          ? 'bg-blue-100 text-blue-800'
                          : chq.status === 'محصل بحساب البنك'
                          ? 'bg-emerald-100 text-emerald-800'
                          : chq.status === 'محول لمورد (تظهير)'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {chq.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">الساحب / العميل:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                        {chq.clientOrPayerAr}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">المستفيد:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[170px]">
                        {chq.beneficiaryAr}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">تاريخ الاستحقاق:</span>
                      <span className="font-bold text-red-700">{chq.dueDate}</span>
                    </div>

                    {chq.transferredToSupplierAr && (
                      <div className="bg-purple-50 p-2 rounded-lg border border-purple-200 text-purple-900 mt-2">
                        <span className="font-bold block text-[11px]">مُحوّل ومُظهّر للمورد:</span>
                        <span className="font-semibold text-xs">{chq.transferredToSupplierAr}</span>
                        {chq.transferDate && (
                          <span className="text-[10px] text-purple-700 block mt-0.5">
                            بتاريخ: {chq.transferDate}
                          </span>
                        )}
                      </div>
                    )}

                    {chq.bounceReasonAr && (
                      <div className="bg-red-50 p-2 rounded-lg border border-red-200 text-red-900 mt-2">
                        <span className="font-bold block text-[11px]">سبب الارتداد:</span>
                        <span className="font-medium text-xs">{chq.bounceReasonAr}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">مبلغ الشيك</span>
                      <span className="text-lg font-black text-slate-900">
                        {chq.amount.toLocaleString()} {chq.currency}
                      </span>
                    </div>

                    {/* Lifecycle Actions */}
                    <div className="flex items-center gap-1">
                      {chq.status === 'في الخزينة' && (
                        <>
                          <button
                            onClick={() => updateChequeStatus(chq.id, 'مرسل للتحصيل بالبنك')}
                            title="إرسال للتحصيل بالبنك"
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedChequeForTransfer(chq);
                              setIsTransferSupplierModalOpen(true);
                            }}
                            title="تظهير وتحويل لمورد"
                            className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {chq.status === 'مرسل للتحصيل بالبنك' && (
                        <>
                          <button
                            onClick={() => updateChequeStatus(chq.id, 'محصل بحساب البنك')}
                            title="تأكيد التحصيل والإيداع بالحساب"
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            تحصيل
                          </button>
                          <button
                            onClick={() => {
                              const reason = window.prompt('يرجى إدخال سبب ارتداد الشيك:');
                              if (reason) {
                                updateChequeStatus(chq.id, 'مرتد', { bounceReasonAr: reason });
                              }
                            }}
                            title="تسجيل ارتداد الشيك"
                            className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODAL: PRINT TREASURY VOUCHER (QR) ================= */}
      {selectedVoucherForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            {/* Header & Logo */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/Industrial_Crane_Emblem_and_Wordmark__1__8be0357c.png"
                  alt="Egypt Cranes"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    شركة مصر للمقاولات المتخصصة (إيجيبت كرينز)
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    قطاع الشؤون المالية والحسابات - إدارة الخزينة المركزية
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVoucherForPrint(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Title & Number */}
            <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-500 block">مستند رسمي معتمد</span>
              <h2 className="text-xl font-black text-slate-900">{selectedVoucherForPrint.type}</h2>
              <span className="font-mono text-xs font-bold text-red-700 mt-0.5 block">
                كود الإذن: {selectedVoucherForPrint.voucherNo} | التاريخ: {selectedVoucherForPrint.date}
              </span>
            </div>

            {/* Voucher Details Body */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold block">الخزينة / الحساب البنكي:</span>
                  <span className="font-bold text-slate-800">{selectedVoucherForPrint.cashBoxNameAr}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">طريقة السداد:</span>
                  <span className="font-bold text-slate-800">
                    {selectedVoucherForPrint.paymentMethod}
                    {selectedVoucherForPrint.chequeNo && ` (شيك رقم: ${selectedVoucherForPrint.chequeNo})`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">الجهة / المستلم أو الساحب:</span>
                  <span className="font-bold text-slate-800">{selectedVoucherForPrint.partyNameAr}</span>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold block">التحميل ومركز التكلفة:</span>
                  <span className="font-bold text-slate-800">
                    {selectedVoucherForPrint.linkedEquipment ? (
                      <span className="text-red-700 font-black">
                        الرافعة: {selectedVoucherForPrint.linkedEquipment}
                      </span>
                    ) : (
                      selectedVoucherForPrint.costCenterAr || 'المصروفات العامة'
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">محرر الإذن:</span>
                  <span className="font-bold text-slate-800">{selectedVoucherForPrint.createdByAr}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">المستلم الفعلي:</span>
                  <span className="font-bold text-slate-800">{selectedVoucherForPrint.receivedByOrPaidToAr}</span>
                </div>
              </div>
            </div>

            {/* Amount Box */}
            <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-900">المبلغ بالأرقام:</span>
                <span className="text-xl font-black font-mono text-red-900">
                  {selectedVoucherForPrint.amount.toLocaleString()} {selectedVoucherForPrint.currency}
                </span>
              </div>
              <div className="text-xs text-red-800 font-medium pt-1 border-t border-red-200/60">
                <span className="font-bold">المبلغ بالحروف:</span> {selectedVoucherForPrint.amountInWordsAr}
              </div>
            </div>

            {/* Remarks */}
            <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">البيان وملاحظات الصرف / القبض:</span>
              <p className="text-slate-600 leading-relaxed">{selectedVoucherForPrint.remarksAr}</p>
            </div>

            {/* QR Code Verification Section */}
            <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  رمز التحقق الرقمي المعتمد (Digital Verification QR)
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed max-w-sm">
                  يمكن مسح رمز الـ QR عبر كاميرا الهاتف أو جهاز قارئ الباركود للتحقق اللحظي من صحة ومطابقة بيانات
                  الإذن مع قاعدة بيانات Egypt Cranes ERP.
                </p>
                <span className="font-mono text-[9px] text-slate-400 block truncate max-w-xs">
                  {selectedVoucherForPrint.qrPayload}
                </span>
              </div>

              <div className="bg-white p-1 rounded-xl shrink-0">
                <QRCodeDisplay value={selectedVoucherForPrint.qrPayload} size={90} />
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-center text-xs">
              <div>
                <span className="text-slate-400 block mb-6 font-bold">أمين الخزينة</span>
                <span className="font-bold text-slate-800">سامح فكري</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-6 font-bold">المستلم / الصادر له</span>
                <span className="font-bold text-slate-800">{selectedVoucherForPrint.receivedByOrPaidToAr}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-6 font-bold">اعتماد الإدارة المالية</span>
                <span className="font-bold text-slate-800">أشرف سليمان (CFO)</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedVoucherForPrint(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                طباعة الإذن الفوري
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: NEW VOUCHER ================= */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                إنشاء {voucherModalType} جديد (توليد QR تلقائي)
              </h3>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">الخزينة أو الحساب البنكي</label>
                  <select
                    value={formVoucher.cashBoxId}
                    onChange={(e) => setFormVoucher({ ...formVoucher, cashBoxId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  >
                    {cashBoxes.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nameAr} ({b.currentBalance.toLocaleString()} {b.currency})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">طريقة المعاملة</label>
                  <select
                    value={formVoucher.paymentMethod}
                    onChange={(e) =>
                      setFormVoucher({
                        ...formVoucher,
                        paymentMethod: e.target.value as 'نقدي' | 'شيك',
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="نقدي">نقدي (كاش بالخزينة)</option>
                    <option value="شيك">شيك بنكي (إيداع / سحب)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">المبلغ</label>
                  <input
                    type="number"
                    min="1"
                    value={formVoucher.amount || ''}
                    onChange={(e) => setFormVoucher({ ...formVoucher, amount: Number(e.target.value) })}
                    placeholder="أدخل المبلغ..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold font-mono text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">تاريخ الإذن</label>
                  <input
                    type="date"
                    value={formVoucher.date}
                    onChange={(e) => setFormVoucher({ ...formVoucher, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  />
                </div>
              </div>

              {/* If Cheque, show cheque details */}
              {formVoucher.paymentMethod === 'شيك' && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
                  <span className="font-bold text-purple-900 block">بيانات الشيك البنكي المرتبط:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-purple-800 mb-0.5">رقم الشيك</label>
                      <input
                        type="text"
                        placeholder="CHQ-12345"
                        value={formVoucher.chequeNo}
                        onChange={(e) => setFormVoucher({ ...formVoucher, chequeNo: e.target.value })}
                        className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-purple-800 mb-0.5">البنك المسحوب عليه</label>
                      <input
                        type="text"
                        placeholder="CIB / البنك الأهلي"
                        value={formVoucher.bankNameAr}
                        onChange={(e) => setFormVoucher({ ...formVoucher, bankNameAr: e.target.value })}
                        className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-purple-800 mb-0.5">تاريخ الاستحقاق</label>
                      <input
                        type="date"
                        value={formVoucher.chequeDate}
                        onChange={(e) => setFormVoucher({ ...formVoucher, chequeDate: e.target.value })}
                        className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">نوع الجهة</label>
                  <select
                    value={formVoucher.partyType}
                    onChange={(e) =>
                      setFormVoucher({
                        ...formVoucher,
                        partyType: e.target.value as TreasuryVoucher['partyType'],
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="عميل">عميل (إيجيبت كرينز)</option>
                    <option value="مورد">مورد قطع غيار وزيوت</option>
                    <option value="مصروفات تشغيل ومعدات">مصروفات تشغيل أوناش وسيارات</option>
                    <option value="موظف / عهدة">موظف / تسوية عهدة</option>
                    <option value="تحويل داخلي">تحويل بين الخزائن</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">اسم الجهة / المستلم / الساحب</label>
                  <input
                    type="text"
                    placeholder="مثال: شركة بتروبل / محطة وطنية..."
                    value={formVoucher.partyNameAr}
                    onChange={(e) => setFormVoucher({ ...formVoucher, partyNameAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Crane / Vehicle Linkage for Cost Allocation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    تحميل على رافعة أو معدة (اختياري)
                  </label>
                  <select
                    value={formVoucher.linkedEquipment}
                    onChange={(e) => setFormVoucher({ ...formVoucher, linkedEquipment: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="">بدون تحميل على رافعة معينة</option>
                    {fleet.map((crane) => (
                      <option key={crane.id} value={`${crane.model} (${crane.capacityTon}T)`}>
                        {crane.model} - {crane.capacityTon} طن
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">مركز التكلفة</label>
                  <select
                    value={formVoucher.costCenterAr}
                    onChange={(e) => setFormVoucher({ ...formVoucher, costCenterAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="">اختر مركز التكلفة...</option>
                    {costCenters.map((cc) => (
                      <option key={cc.id} value={cc.nameAr}>
                        {cc.code} - {cc.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">البيان والشرح</label>
                <textarea
                  rows={2}
                  placeholder="اكتب تفاصيل المعاملة..."
                  value={formVoucher.remarksAr}
                  onChange={(e) => setFormVoucher({ ...formVoucher, remarksAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold shadow-md hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  حفظ وتوليد الإذن الفوري مع QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: NEW SAFE / BANK ================= */}
      {isSafeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-red-600" />
                فتح خزينة فرعية أو حساب بنكي جديد
              </h3>
              <button
                onClick={() => setIsSafeModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSafe} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">اسم الخزينة / الحساب</label>
                <input
                  type="text"
                  placeholder="مثال: خزينة موقع العلمين الجديدة..."
                  value={formSafe.nameAr || ''}
                  onChange={(e) => setFormSafe({ ...formSafe, nameAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">النوع</label>
                  <select
                    value={formSafe.type}
                    onChange={(e) => setFormSafe({ ...formSafe, type: e.target.value as CashBox['type'] })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="خزينة فرعية / موقع">خزينة فرعية / موقع</option>
                    <option value="خزينة رئيسية">خزينة رئيسية</option>
                    <option value="حساب بنكي جاري">حساب بنكي جاري</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">العملة</label>
                  <select
                    value={formSafe.currency}
                    onChange={(e) =>
                      setFormSafe({ ...formSafe, currency: e.target.value as CashBox['currency'] })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="EUR">يورو (EUR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">رصيد أول المدة</label>
                  <input
                    type="number"
                    value={formSafe.openingBalance || ''}
                    onChange={(e) => setFormSafe({ ...formSafe, openingBalance: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">أمين الخزينة / المسؤول</label>
                  <input
                    type="text"
                    value={formSafe.custodianAr || ''}
                    onChange={(e) => setFormSafe({ ...formSafe, custodianAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">الموقع أو المشروع التابع له</label>
                <input
                  type="text"
                  placeholder="مثال: موقع العاصمة الإدارية / ورشة السويس..."
                  value={formSafe.branchOrProjectAr || ''}
                  onChange={(e) => setFormSafe({ ...formSafe, branchOrProjectAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSafeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold shadow-md hover:bg-slate-800"
                >
                  حفظ الخزينة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: NEW CHEQUE ================= */}
      {isChequeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                تسجيل شيك جديد بحافظة الشيكات
              </h3>
              <button
                onClick={() => setIsChequeModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCheque} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">اتجاه الشيك</label>
                  <select
                    value={formCheque.direction}
                    onChange={(e) =>
                      setFormCheque({
                        ...formCheque,
                        direction: e.target.value as ChequeItem['direction'],
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="وارد (من عميل)">وارد (من عميل)</option>
                    <option value="صادر (لمورد / جهة)">صادر (لمورد / جهة)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">رقم الشيك</label>
                  <input
                    type="text"
                    placeholder="CHQ-000000"
                    value={formCheque.chequeNo || ''}
                    onChange={(e) => setFormCheque({ ...formCheque, chequeNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">المبلغ (ج.م)</label>
                  <input
                    type="number"
                    min="1"
                    value={formCheque.amount || ''}
                    onChange={(e) => setFormCheque({ ...formCheque, amount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">البنك المسحوب عليه</label>
                  <input
                    type="text"
                    placeholder="CIB / بنك مصر / QNB..."
                    value={formCheque.drawerBankAr || ''}
                    onChange={(e) => setFormCheque({ ...formCheque, drawerBankAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">الساحب / العميل</label>
                  <input
                    type="text"
                    placeholder="اسم العميل أو الساحب..."
                    value={formCheque.clientOrPayerAr || ''}
                    onChange={(e) => setFormCheque({ ...formCheque, clientOrPayerAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={formCheque.dueDate}
                    onChange={(e) => setFormCheque({ ...formCheque, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">الملاحظات</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات الحفظ والمشروع..."
                  value={formCheque.notes || ''}
                  onChange={(e) => setFormCheque({ ...formCheque, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsChequeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
                >
                  حفظ الشيك بالحافظة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ENDORSE TO SUPPLIER ================= */}
      {isTransferSupplierModalOpen && selectedChequeForTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-purple-600" />
                تظهير وتحويل الشيك لمورد
              </h3>
              <button
                onClick={() => setIsTransferSupplierModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 space-y-1">
                <span className="text-purple-800 font-bold block">
                  الشيك رقم: {selectedChequeForTransfer.chequeNo}
                </span>
                <span className="text-purple-900 font-black block">
                  المبلغ: {selectedChequeForTransfer.amount.toLocaleString()} {selectedChequeForTransfer.currency}
                </span>
                <span className="text-purple-700 block text-[11px]">
                  وارد من: {selectedChequeForTransfer.clientOrPayerAr} | استحقاق:{' '}
                  {selectedChequeForTransfer.dueDate}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم المورد المحول إليه (المستفيد الجديد):</label>
                <input
                  type="text"
                  placeholder="مثال: الشركة الهندسية لتوكيلات الإطارات..."
                  value={supplierNameInput}
                  onChange={(e) => setSupplierNameInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTransferSupplierModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleEndorseCheque}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
                >
                  تأكيد التظهير والتحويل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
