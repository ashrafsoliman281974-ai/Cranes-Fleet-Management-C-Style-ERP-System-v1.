import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Truck,
  Users,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Share2,
  Copy,
  MessageSquare,
  Wrench,
  FileText,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  Send,
  Eye,
  Check,
  Package,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  DailyOperationAssignment,
  OperatorScheduleEntry,
  DailyBreakdownTicket,
  FleetVehicleItem,
  OperatorItem,
} from '../../types/erp';
import { formatDateISO } from '../../utils/hijri';

export const DailyOperationsView: React.FC = () => {
  const {
    dailyOperations,
    saveDailyOperation,
    deleteDailyOperation,
    fleetVehicles,
    saveFleetVehicle,
    operators,
    saveOperator,
    operatorSchedules,
    updateOperatorShift,
    swapOperatorShifts,
    dailyBreakdowns,
    saveDailyBreakdown,
    shiftSwaps,
    fleet,
    setActiveView,
    showToast,
  } = useERP();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'dispatch' | 'roster' | 'vehicles' | 'breakdowns'>('dispatch');

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>(formatDateISO(new Date()));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterShift, setFilterShift] = useState<string>('all');
  const [filterEquipmentType, setFilterEquipmentType] = useState<string>('all');

  // Month and Year for Monthly Roster (Default October 2026)
  const [currentRosterMonth, setCurrentRosterMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [currentRosterYear, setCurrentRosterYear] = useState<number>(2026);

  // Modals
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [editingDispatch, setEditingDispatch] = useState<DailyOperationAssignment | null>(null);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTargetAssignment, setMessageTargetAssignment] = useState<DailyOperationAssignment | null>(null);
  const [customMessageNotes, setCustomMessageNotes] = useState<string>('');

  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapForm, setSwapForm] = useState({
    operatorAId: operators[0]?.id || '',
    operatorBId: operators[1]?.id || '',
    shiftADate: formatDateISO(new Date()),
    shiftBDate: formatDateISO(new Date()),
    reasonAr: 'ظرف عمل طارئ وتنسيق تبادلي بين المشغلين',
  });

  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [editingBreakdown, setEditingBreakdown] = useState<Partial<DailyBreakdownTicket> | null>(null);

  const [isShiftCellModalOpen, setIsShiftCellModalOpen] = useState(false);
  const [selectedShiftEntry, setSelectedShiftEntry] = useState<OperatorScheduleEntry | null>(null);

  // Form State for New/Edit Daily Dispatch
  const [formDispatch, setFormDispatch] = useState<Partial<DailyOperationAssignment>>({
    date: formatDateISO(new Date()),
    equipmentType: 'رافعة مؤجرة',
    equipmentId: fleet[0]?.id || '',
    equipmentModel: fleet[0] ? `${fleet[0].model} (${fleet[0].capacityTon}T)` : 'Liebherr LTM 1500 (500T)',
    equipmentCapacityTon: fleet[0]?.capacityTon || 500,
    operatorId: operators[0]?.id || '',
    operatorNameAr: operators[0]?.nameAr || 'كابتن عزت البرلسي',
    operatorPhone: operators[0]?.phone || '01001234567',
    clientAr: 'شركة أتوم ستروي إكسبورت الروسية / بتروجت',
    projectAr: 'مشروع محطة الضبعة للطاقة النووية',
    locationAr: 'موقع الضبعة - الساحل الشمالي',
    shiftType: 'وردية صباحية (08:00 ص - 04:00 م)',
    workHours: 8,
    siteSupervisorAr: 'م. طارق بدير',
    siteSupervisorPhone: '01002345678',
    operationStatus: 'في الموقع (يعمل)',
    liftingPlanApproved: true,
    notes: '',
  });

  // Form State for Breakdown Ticket
  const [formBreakdown, setFormBreakdown] = useState<Partial<DailyBreakdownTicket>>({
    date: formatDateISO(new Date()),
    time: '11:00',
    machineType: 'رافعة مؤجرة',
    machineId: fleet[1]?.id || 'fleet-2',
    machineModel: 'Liebherr LTM 1500-8.1 (500T)',
    operatorNameAr: operators[1]?.nameAr || 'كابتن محمود الشناوي',
    clientAr: 'شركة إيني الإيطالية (IEOC)',
    projectAr: 'مشروع حقل ظهر للغاز الطبيعي',
    locationAr: 'بورسعيد - رصيف الغاز رقم 3',
    breakdownSubsystem: 'هيدروليك وبساتم',
    severity: 'حرج (توقف كامل عن العمل)',
    reportedDetails: '',
    downtimeHours: 3.5,
    assignedTechnicianAr: 'م. سامح الجوهري (مهندس هيدروليك)',
    technicianPhone: '01003847592',
    status: 'بلاغ جديد',
    partsRequested: '',
    actionTaken: '',
  });

  // Filtered Daily Operations
  const filteredDailyOperations = useMemo(() => {
    return dailyOperations.filter((op) => {
      if (filterShift !== 'all' && !op.shiftType.includes(filterShift)) return false;
      if (filterEquipmentType !== 'all' && op.equipmentType !== filterEquipmentType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          op.equipmentModel.toLowerCase().includes(q) ||
          op.operatorNameAr.toLowerCase().includes(q) ||
          op.projectAr.toLowerCase().includes(q) ||
          op.clientAr.toLowerCase().includes(q) ||
          op.locationAr.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [dailyOperations, filterShift, filterEquipmentType, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalDispatches = dailyOperations.length;
    const activeCranes = dailyOperations.filter((d) => d.equipmentType === 'رافعة مؤجرة').length;
    const activeVehicles = dailyOperations.filter((d) => d.equipmentType === 'سيارة خدمة / نقل ثقيل').length;
    const workingNow = dailyOperations.filter((d) => d.operationStatus === 'في الموقع (يعمل)').length;
    const criticalBreakdownsCount = dailyBreakdowns.filter(
      (b) => b.severity.includes('حرج') && b.status !== 'تم الإصلاح وعادت للتشغيل'
    ).length;
    const activeBreakdownsCount = dailyBreakdowns.filter(
      (b) => b.status !== 'تم الإصلاح وعادت للتشغيل'
    ).length;
    return {
      totalDispatches,
      activeCranes,
      activeVehicles,
      workingNow,
      criticalBreakdownsCount,
      activeBreakdownsCount,
    };
  }, [dailyOperations, dailyBreakdowns]);

  // Days in selected Month for Roster
  const daysInRosterMonth = useMemo(() => {
    return new Date(currentRosterYear, currentRosterMonth + 1, 0).getDate();
  }, [currentRosterYear, currentRosterMonth]);

  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // WhatsApp Message Generator
  const generateWhatsAppMessage = (assignment: DailyOperationAssignment) => {
    const cleanPhone = assignment.operatorPhone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone;

    const text = `*مجموعة مصر للمقاولات المتخصصة (إيجيبت كرينز)* 🏗️
*أمر تشغيل ووردية عمل يومية*
----------------------------------------
👤 *المشغل / السائق المكلف:* ${assignment.operatorNameAr}
📅 *التاريخ:* ${assignment.date}
⏰ *الوردية:* ${assignment.shiftType} (ساعات العمل: ${assignment.workHours} س)
🚜 *المعدة / الشاحنة:* ${assignment.equipmentModel}
📍 *الموقع والمحافظة:* ${assignment.locationAr}
🏢 *العميل:* ${assignment.clientAr}
🏗️ *المشروع:* ${assignment.projectAr}
👷‍♂️ *مشرف الموقع:* ${assignment.siteSupervisorAr} (${assignment.siteSupervisorPhone})
${customMessageNotes ? `\n📝 *ملاحظات خاصة:* ${customMessageNotes}` : ''}
----------------------------------------
⚠️ *تعليمات السلامة الإلزامية:*
1. فحص دائرة الهيدروليك ومستويات الزيوت ومحدد عزم الحمل (LMI) قبل بدء الرفع.
2. ارتداء مهمات السلامة (PPE) كاملة والتأكد من تثبيت ركائز الأوناش على ألواح خشبية/فولاذية معتمدة.
3. في حالة أي عطل طارئ، يرجى إيقاف الرفع والإبلاغ الفوري على الخط الساخن.`;

    const encoded = encodeURIComponent(text);
    const link = `https://wa.me/${intlPhone}?text=${encoded}`;
    return { text, link };
  };

  const handleCopyMessageText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('تم نسخ نص رسالة أمر التشغيل للحافظة');
  };

  const handleOpenWhatsApp = (assignment: DailyOperationAssignment) => {
    const { link } = generateWhatsAppMessage(assignment);
    window.open(link, '_blank');
    showToast(`جاري إرسال جدول الوردية للمشغل ${assignment.operatorNameAr} عبر واتساب`);
  };

  const handleSaveDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyOperation({
      ...formDispatch,
      id: editingDispatch ? editingDispatch.id : undefined,
    });
    setIsDispatchModalOpen(false);
    setEditingDispatch(null);
  };

  const handleSaveBreakdown = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyBreakdown({
      ...formBreakdown,
      id: editingBreakdown?.id,
    });
    setIsBreakdownModalOpen(false);
    setEditingBreakdown(null);
  };

  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (swapForm.operatorAId === swapForm.operatorBId) {
      showToast('يرجى اختيار مشغلين مختلفين لإتمام التبديل');
      return;
    }
    const success = swapOperatorShifts({
      operatorAId: swapForm.operatorAId,
      operatorBId: swapForm.operatorBId,
      shiftADate: swapForm.shiftADate,
      shiftBDate: swapForm.shiftBDate,
      reasonAr: swapForm.reasonAr,
    });
    if (success) {
      setIsSwapModalOpen(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
            <span>التشغيل والعمليات الميدانية</span>
            <span>/</span>
            <span className="text-amber-700 font-bold">إدارة المعدات والسيارات والورديات والأعطال</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-amber-600" />
            التشغيل اليومي والورديات والأعطال
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            تنظيم المعدات المؤجرة والسيارات، وتوزيع المشغلين على الورديات، والجدول الشهري والإجازات مع إرسال تفاصيل التكليف عبر واتساب وتسجيل الأعطال اليومية
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setEditingDispatch(null);
              setFormDispatch({
                date: formatDateISO(new Date()),
                equipmentType: 'رافعة مؤجرة',
                equipmentId: fleet[0]?.id || '',
                equipmentModel: fleet[0] ? `${fleet[0].model} (${fleet[0].capacityTon}T)` : 'Liebherr LTM 1500 (500T)',
                equipmentCapacityTon: fleet[0]?.capacityTon || 500,
                operatorId: operators[0]?.id || '',
                operatorNameAr: operators[0]?.nameAr || 'كابتن عزت البرلسي',
                operatorPhone: operators[0]?.phone || '01001234567',
                clientAr: 'شركة أتوم ستروي إكسبورت الروسية / بتروجت',
                projectAr: 'مشروع محطة الضبعة للطاقة النووية',
                locationAr: 'موقع الضبعة - الساحل الشمالي',
                shiftType: 'وردية صباحية (08:00 ص - 04:00 م)',
                workHours: 8,
                siteSupervisorAr: 'م. طارق بدير',
                siteSupervisorPhone: '01002345678',
                operationStatus: 'في الموقع (يعمل)',
                liftingPlanApproved: true,
                notes: '',
              });
              setIsDispatchModalOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            + تكليف تشغيل جديد (معدة / سيارة)
          </button>

          <button
            onClick={() => setIsSwapModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4" />
            تبديل وردية بين مشغلين
          </button>

          <button
            onClick={() => {
              setEditingBreakdown(null);
              setFormBreakdown({
                date: formatDateISO(new Date()),
                time: '11:00',
                machineType: 'رافعة مؤجرة',
                machineId: fleet[1]?.id || 'fleet-2',
                machineModel: 'Liebherr LTM 1500-8.1 (500T)',
                operatorNameAr: operators[1]?.nameAr || 'كابتن محمود الشناوي',
                clientAr: 'شركة إيني الإيطالية (IEOC)',
                projectAr: 'مشروع حقل ظهر للغاز الطبيعي',
                locationAr: 'بورسعيد - رصيف الغاز رقم 3',
                breakdownSubsystem: 'هيدروليك وبساتم',
                severity: 'حرج (توقف كامل عن العمل)',
                reportedDetails: '',
                downtimeHours: 3.5,
                assignedTechnicianAr: 'م. سامح الجوهري (مهندس هيدروليك)',
                technicianPhone: '01003847592',
                status: 'بلاغ جديد',
                partsRequested: '',
                actionTaken: '',
              });
              setIsBreakdownModalOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <AlertTriangle className="w-4 h-4" />
            + بلاغ عطل يومي جديد
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">رافعات مؤجرة عاملة</span>
            <span className="text-xl font-black text-slate-900 block mt-0.5">
              {metrics.activeCranes} رافعة
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">في مواقع المشاريع</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">شاحنات وسيارات خدمة</span>
            <span className="text-xl font-black text-slate-900 block mt-0.5">
              {metrics.activeVehicles} مركبة
            </span>
            <span className="text-[10px] text-blue-600 font-bold block mt-0.5">تريلات وورش متنقلة</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">المشغلين والسائقين المناوبين</span>
            <span className="text-xl font-black text-slate-900 block mt-0.5">
              {operators.length} مشغل وسائق
            </span>
            <span className="text-[10px] text-slate-500 font-bold block mt-0.5">رخص معدات ثقيلة معتمدة</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">الحالة التشغيلية الآن</span>
            <span className="text-xl font-black text-emerald-700 block mt-0.5">
              {metrics.workingNow} تعمل بالموقع
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">بخطط رفع معتمدة</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">الأعطال اليومية النشطة</span>
            <span
              className={`text-xl font-black block mt-0.5 ${
                metrics.criticalBreakdownsCount > 0 ? 'text-red-600' : 'text-slate-900'
              }`}
            >
              {metrics.activeBreakdownsCount} بلاغ
            </span>
            <span className="text-[10px] text-red-600 font-bold block mt-0.5">
              {metrics.criticalBreakdownsCount} عطل حرج متوقف
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-reverse space-x-2">
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'dispatch'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          التشغيل اليومي وتوزيع المعدات والمشغلين ({filteredDailyOperations.length})
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          الجدول الشهري والورديات والإجازات
        </button>

        <button
          onClick={() => setActiveTab('vehicles')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'vehicles'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          شاحنات وسيارات النقل والخدمة ({fleetVehicles.length})
        </button>

        <button
          onClick={() => setActiveTab('breakdowns')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'breakdowns'
              ? 'border-red-600 text-red-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          واجهة الأعطال اليومية والصيانة ({dailyBreakdowns.length})
        </button>
      </div>

      {/* ================= TAB 1: DAILY FLEET DISPATCH ================= */}
      {activeTab === 'dispatch' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث بالمعدة، المشغل، المشروع، العميل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <select
                value={filterShift}
                onChange={(e) => setFilterShift(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none"
              >
                <option value="all">كل الورديات</option>
                <option value="صباحية">وردية صباحية</option>
                <option value="مسائية">وردية مسائية</option>
                <option value="ليلية">وردية ليلية</option>
                <option value="متواصل">تشغيل متواصل 24 ساعة</option>
              </select>

              <select
                value={filterEquipmentType}
                onChange={(e) => setFilterEquipmentType(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none"
              >
                <option value="all">كل أنواع المعدات</option>
                <option value="رافعة مؤجرة">رافعات مؤجرة فقط</option>
                <option value="سيارة خدمة / نقل ثقيل">شاحنات وسيارات خدمة فقط</option>
              </select>
            </div>

            <span className="text-xs font-semibold text-slate-500">
              عدد أوامر التشغيل: {filteredDailyOperations.length}
            </span>
          </div>

          {/* Cards Grid of Operations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDailyOperations.map((op) => {
              const isCrane = op.equipmentType === 'رافعة مؤجرة';
              return (
                <div
                  key={op.id}
                  className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    {/* Header: Machine & Type */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-1 ${
                            isCrane ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {op.equipmentType} {op.equipmentCapacityTon ? `(${op.equipmentCapacityTon} طن)` : ''}
                        </span>
                        <h3 className="text-xs font-black text-slate-900 leading-snug">
                          {op.equipmentModel}
                        </h3>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          op.operationStatus === 'في الموقع (يعمل)'
                            ? 'bg-emerald-100 text-emerald-800'
                            : op.operationStatus === 'في الطريق (ترانزيت)'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {op.operationStatus}
                      </span>
                    </div>

                    {/* Operator Details */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                          {op.operatorNameAr.charAt(0)}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">المشغل / السائق:</span>
                          <span className="text-xs font-bold text-slate-900">{op.operatorNameAr}</span>
                        </div>
                      </div>
                      <a
                        href={`tel:${op.operatorPhone}`}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 transition-colors"
                        title={op.operatorPhone}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Project & Client & Shift */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">العميل والمشروع:</span>
                        <span className="font-semibold text-slate-800 text-left truncate max-w-[180px]">
                          {op.clientAr}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <span className="font-medium truncate">{op.projectAr} - {op.locationAr}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-400">الوردية المعتمدة:</span>
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                          {op.shiftType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">مشرف الموقع:</span>
                        <span className="text-slate-700 font-medium">
                          {op.siteSupervisorAr} ({op.siteSupervisorPhone})
                        </span>
                      </div>
                    </div>

                    {op.notes && (
                      <div className="text-[11px] text-slate-500 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                        <span className="font-bold text-amber-900 block mb-0.5">تفاصيل مناورة الرفع:</span>
                        <p className="line-clamp-2 leading-relaxed">{op.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setMessageTargetAssignment(op);
                        setCustomMessageNotes('');
                        setIsMessageModalOpen(true);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      إرسال الوردية (واتساب)
                    </button>

                    <button
                      onClick={() => {
                        setEditingBreakdown({
                          machineType: op.equipmentType,
                          machineId: op.equipmentId,
                          machineModel: op.equipmentModel,
                          operatorNameAr: op.operatorNameAr,
                          clientAr: op.clientAr,
                          projectAr: op.projectAr,
                          locationAr: op.locationAr,
                          date: formatDateISO(new Date()),
                        });
                        setIsBreakdownModalOpen(true);
                      }}
                      className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                      title="تسجيل بلاغ عطل للمعدة"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      عطل
                    </button>

                    <button
                      onClick={() => deleteDailyOperation(op.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      title="حذف أمر التشغيل"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MONTHLY ROSTER & SHIFT/LEAVE SCHEDULE ================= */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Header Controls for Month & Actions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => {
                    if (currentRosterMonth === 0) {
                      setCurrentRosterMonth(11);
                      setCurrentRosterYear((y) => y - 1);
                    } else {
                      setCurrentRosterMonth((m) => m - 1);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors"
                  title="الشهر السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <span className="px-3 text-xs font-black text-slate-900">
                  جدول تشغيل {monthNamesAr[currentRosterMonth]} {currentRosterYear}
                </span>

                <button
                  onClick={() => {
                    if (currentRosterMonth === 11) {
                      setCurrentRosterMonth(0);
                      setCurrentRosterYear((y) => y + 1);
                    } else {
                      setCurrentRosterMonth((m) => m + 1);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors"
                  title="الشهر التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Legend Badges */}
              <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  ☀️ ص (صباحية)
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                  🌆 م (مسائية)
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                  🌙 ل (ليلية)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                  🏖️ إجازة دورية
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                  ☕ راحة أسبوعية
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSwapModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                تبديل وردية بين مشغلين
              </button>
            </div>
          </div>

          {/* Roster Calendar Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-3 min-w-[170px] sticky right-0 bg-slate-100 z-10 shadow-sm">
                      المشغل / السائق
                    </th>
                    <th className="py-3 px-2 min-w-[120px]">المعدة المعتادة</th>
                    {Array.from({ length: daysInRosterMonth }, (_, i) => i + 1).map((day) => {
                      const isToday =
                        day === 24 && currentRosterMonth === 9 && currentRosterYear === 2026;
                      return (
                        <th
                          key={day}
                          className={`py-2 px-1 text-center min-w-[34px] border-r border-slate-200 ${
                            isToday ? 'bg-amber-200 text-amber-950 font-black' : ''
                          }`}
                        >
                          <span className="block text-[11px] leading-tight">{day}</span>
                          <span className="block text-[9px] text-slate-400 font-normal">
                            {['أح', 'اث', 'ثل', 'أر', 'خم', 'جم', 'سب'][
                              new Date(currentRosterYear, currentRosterMonth, day).getDay()
                            ]}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {operators.map((op) => {
                    return (
                      <tr key={op.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 sticky right-0 bg-white z-10 shadow-xs font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center shrink-0">
                              {op.nameAr.charAt(0)}
                            </div>
                            <div>
                              <span className="block leading-tight text-xs">{op.nameAr}</span>
                              <span className="block text-[9px] text-slate-400">{op.phone}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-2 px-2 text-[11px] text-slate-600 truncate max-w-[120px]">
                          {op.currentEquipmentNameAr || 'معدات متعددة'}
                        </td>

                        {Array.from({ length: daysInRosterMonth }, (_, i) => i + 1).map((day) => {
                          const dayStr = day < 10 ? `0${day}` : `${day}`;
                          const monthStr = currentRosterMonth + 1 < 10 ? `0${currentRosterMonth + 1}` : `${currentRosterMonth + 1}`;
                          const dateKey = `${currentRosterYear}-${monthStr}-${dayStr}`;

                          const scheduleEntry = operatorSchedules.find(
                            (s) => s.operatorId === op.id && s.date === dateKey
                          );

                          const shiftType = scheduleEntry?.shiftType || op.defaultShift;

                          let badgeClass = 'bg-slate-100 text-slate-600';
                          let label = 'ص';
                          if (shiftType.includes('صباحية')) {
                            badgeClass = 'bg-amber-100 text-amber-900 border border-amber-200';
                            label = 'ص';
                          } else if (shiftType.includes('مسائية')) {
                            badgeClass = 'bg-indigo-100 text-indigo-900 border border-indigo-200';
                            label = 'م';
                          } else if (shiftType.includes('ليلية')) {
                            badgeClass = 'bg-purple-100 text-purple-900 border border-purple-200';
                            label = 'ل';
                          } else if (shiftType.includes('دورية')) {
                            badgeClass = 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black';
                            label = 'إجازة';
                          } else if (shiftType.includes('راحة')) {
                            badgeClass = 'bg-slate-200 text-slate-700 border border-slate-300';
                            label = 'راحة';
                          } else if (shiftType.includes('سنوية') || shiftType.includes('مرضية')) {
                            badgeClass = 'bg-rose-100 text-rose-900 border border-rose-300';
                            label = 'سنوي';
                          }

                          return (
                            <td
                              key={day}
                              onClick={() => {
                                setSelectedShiftEntry(
                                  scheduleEntry || {
                                    id: `sched-${op.id}-${dateKey}`,
                                    operatorId: op.id,
                                    operatorNameAr: op.nameAr,
                                    date: dateKey,
                                    shiftType,
                                    locationAr: 'موقع العمل الميداني',
                                  }
                                );
                                setIsShiftCellModalOpen(true);
                              }}
                              className="py-1 px-1 text-center border-r border-slate-100 cursor-pointer hover:bg-amber-50/80 transition-colors"
                              title={`${op.nameAr} - ${dateKey} : ${shiftType} (انقر للتعديل)`}
                            >
                              <span
                                className={`inline-block w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center mx-auto transition-transform active:scale-90 ${badgeClass}`}
                              >
                                {label}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shift Swapping Audit Table */}
          {shiftSwaps.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                سجل التبديلات المعتمدة بين المشغلين
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {shiftSwaps.map((sw) => (
                  <div key={sw.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">
                        {sw.operatorANameAr} ({sw.shiftAType})
                      </span>
                      <span className="text-slate-400 mx-1.5">↔️</span>
                      <span className="font-bold text-slate-900">
                        {sw.operatorBNameAr} ({sw.shiftBType})
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        بتاريخ: {sw.shiftADate} - السبب: {sw.reasonAr}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {sw.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: FLEET VEHICLES & SERVICE TRUCKS ================= */}
      {activeTab === 'vehicles' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-600" />
              سيارات ومركبات الخدمة والنقل الثقيل (Fleet Support & Lowbeds)
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              تريلات نقل الأوزان الثقيلة، سيارات الورش المتنقلة، فناطيس الوقود، وسيارات التأمين
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fleetVehicles.map((veh) => {
              return (
                <div
                  key={veh.id}
                  className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                        {veh.vehicleTypeAr}
                      </span>
                      <h3 className="text-xs font-black text-slate-900">{veh.model}</h3>
                      <span className="font-mono text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-1">
                        لوحة: {veh.plateNumber}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        veh.status === 'في الموقع'
                          ? 'bg-emerald-100 text-emerald-800'
                          : veh.status === 'في الخدمة / متحركة'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {veh.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">السائق المكلف:</span>
                      <span className="font-bold text-slate-800">{veh.driverNameAr}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">هاتف السائق:</span>
                      <a href={`tel:${veh.driverPhone}`} className="text-emerald-700 font-mono font-bold">
                        {veh.driverPhone}
                      </a>
                    </div>
                    <div className="flex items-start justify-between text-[11px] pt-1">
                      <span className="text-slate-400 shrink-0">الموقع الحالي:</span>
                      <span className="text-slate-700 font-medium text-left truncate max-w-[180px]">
                        {veh.currentLocationAr}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => {
                        const tempAssignment: DailyOperationAssignment = {
                          id: `temp-${veh.id}`,
                          date: formatDateISO(new Date()),
                          equipmentType: 'سيارة خدمة / نقل ثقيل',
                          equipmentId: veh.id,
                          equipmentModel: `${veh.model} (${veh.plateNumber})`,
                          operatorId: veh.id,
                          operatorNameAr: veh.driverNameAr,
                          operatorPhone: veh.driverPhone,
                          clientAr: 'إدارة الحركة والنقل - إيجيبت كرينز',
                          projectAr: veh.assignedProjectAr || 'دعم لوجستي للمواقع',
                          locationAr: veh.currentLocationAr,
                          shiftType: 'وردية صباحية (08:00 ص - 04:00 م)',
                          workHours: 8,
                          siteSupervisorAr: 'م. طارق بدير',
                          siteSupervisorPhone: '01002345678',
                          operationStatus: 'في الموقع (يعمل)',
                          liftingPlanApproved: true,
                        };
                        setMessageTargetAssignment(tempAssignment);
                        setCustomMessageNotes('');
                        setIsMessageModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      إرسال أمر الحركة للسائق
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: DAILY BREAKDOWNS & INCIDENT TICKETS ================= */}
      {activeTab === 'breakdowns' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                سجل الأعطال اليومية والصيانة الميدانية الطارئة
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                حصر أعطال الرافعات والشاحنات بالمواقع مع توثيق ساعات التوقف وقطع الغيار المطلوبة
              </span>
            </div>

            <button
              onClick={() => {
                setEditingBreakdown(null);
                setFormBreakdown({
                  date: formatDateISO(new Date()),
                  time: '11:00',
                  machineType: 'رافعة مؤجرة',
                  machineId: fleet[1]?.id || 'fleet-2',
                  machineModel: 'Liebherr LTM 1500-8.1 (500T)',
                  operatorNameAr: operators[1]?.nameAr || 'كابتن محمود الشناوي',
                  clientAr: 'شركة إيني الإيطالية (IEOC)',
                  projectAr: 'مشروع حقل ظهر للغاز الطبيعي',
                  locationAr: 'بورسعيد - رصيف الغاز رقم 3',
                  breakdownSubsystem: 'هيدروليك وبساتم',
                  severity: 'حرج (توقف كامل عن العمل)',
                  reportedDetails: '',
                  downtimeHours: 3.5,
                  assignedTechnicianAr: 'م. سامح الجوهري (مهندس هيدروليك)',
                  technicianPhone: '01003847592',
                  status: 'بلاغ جديد',
                  partsRequested: '',
                  actionTaken: '',
                });
                setIsBreakdownModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              + تسجيل بلاغ عطل جديد
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-3">رقم البلاغ</th>
                    <th className="py-3 px-3">المعدة المتأثرة</th>
                    <th className="py-3 px-3">المشغل والموقع</th>
                    <th className="py-3 px-3">نظام العطل</th>
                    <th className="py-3 px-3">درجة الخطورة</th>
                    <th className="py-3 px-3">ساعات التوقف</th>
                    <th className="py-3 px-3">الفني المكلف</th>
                    <th className="py-3 px-3">حالة الإصلاح</th>
                    <th className="py-3 px-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyBreakdowns.map((bk) => {
                    const isCritical = bk.severity.includes('حرج');
                    return (
                      <tr key={bk.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {bk.ticketNo}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {bk.date} - {bk.time}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{bk.machineModel}</span>
                          <span className="text-[10px] text-slate-500">{bk.machineType}</span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-800 block">{bk.operatorNameAr}</span>
                          <span className="text-[10px] text-slate-500">{bk.projectAr}</span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {bk.breakdownSubsystem}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                              isCritical ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {bk.severity}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-red-700">
                          {bk.downtimeHours} ساعة
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-800 block">{bk.assignedTechnicianAr}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{bk.technicianPhone}</span>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              bk.status === 'تم الإصلاح وعادت للتشغيل'
                                ? 'bg-emerald-100 text-emerald-800'
                                : bk.status === 'بانتظار قطع الغيار من المستودع'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {bk.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingBreakdown(bk);
                                setFormBreakdown(bk);
                                setIsBreakdownModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                            >
                              تعديل
                            </button>

                            {bk.partsRequested && (
                              <button
                                onClick={() => {
                                  setActiveView('inventory');
                                  showToast(`انتقلنا إلى شاشة المخازن لصرف قطع الغيار المطلوبة: ${bk.partsRequested}`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1"
                                title="صرف قطع الغيار المطلوبة من المستودع"
                              >
                                <Package className="w-3 h-3" />
                                صرف قطع الغيار
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

      {/* ================= MODAL 1: WHATSAPP DISPATCH MESSAGE SENDER ================= */}
      {isMessageModalOpen && messageTargetAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    إرسال أمر التشغيل والوردية عبر WhatsApp
                  </h3>
                  <span className="text-xs text-slate-500">
                    إلى الكابتن: {messageTargetAssignment.operatorNameAr} ({messageTargetAssignment.operatorPhone})
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Notes to append */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ملاحظات أو توجيهات إضافية في نص الرسالة (اختياري):
              </label>
              <input
                type="text"
                placeholder="مثال: يرجى التواجد قبل الموعد بـ 30 دقيقة لحضور اجتماع السلامة (TBT)..."
                value={customMessageNotes}
                onChange={(e) => setCustomMessageNotes(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
              />
            </div>

            {/* WhatsApp Formatted Message Preview */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 font-sans text-xs text-slate-800 whitespace-pre-line leading-relaxed shadow-inner max-h-72 overflow-y-auto">
              {generateWhatsAppMessage(messageTargetAssignment).text}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleCopyMessageText(generateWhatsAppMessage(messageTargetAssignment).text)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                نسخ النص
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  إلغاء
                </button>

                <button
                  onClick={() => handleOpenWhatsApp(messageTargetAssignment)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  إرسال عبر WhatsApp الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: NEW / EDIT DAILY DISPATCH ================= */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-600" />
                {editingDispatch ? 'تعديل تكليف تشغيل يومي' : 'تسجيل أمر تشغيل وتكليف يومي جديد'}
              </h3>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDispatch} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">نوع التكليف</label>
                  <select
                    value={formDispatch.equipmentType}
                    onChange={(e) =>
                      setFormDispatch({
                        ...formDispatch,
                        equipmentType: e.target.value as DailyOperationAssignment['equipmentType'],
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="رافعة مؤجرة">رافعة مؤجرة (Crane)</option>
                    <option value="سيارة خدمة / نقل ثقيل">شاحنة / سيارة خدمة / نقل ثقيل</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">تاريخ التشغيل</label>
                  <input
                    type="date"
                    value={formDispatch.date}
                    onChange={(e) => setFormDispatch({ ...formDispatch, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Equipment Selector */}
              <div>
                <label className="block text-slate-600 font-bold mb-1">المعدة أو الشاحنة المكلفة</label>
                {formDispatch.equipmentType === 'رافعة مؤجرة' ? (
                  <select
                    value={formDispatch.equipmentId}
                    onChange={(e) => {
                      const found = fleet.find((f) => f.id === e.target.value);
                      setFormDispatch({
                        ...formDispatch,
                        equipmentId: e.target.value,
                        equipmentModel: found ? `${found.model} (${found.capacityTon}T)` : 'رافعة هيدروليكية',
                        equipmentCapacityTon: found?.capacityTon,
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    {fleet.map((crane) => (
                      <option key={crane.id} value={crane.id}>
                        {crane.model} ({crane.capacityTon} طن) - {crane.typeAr}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={formDispatch.equipmentId}
                    onChange={(e) => {
                      const found = fleetVehicles.find((v) => v.id === e.target.value);
                      setFormDispatch({
                        ...formDispatch,
                        equipmentId: e.target.value,
                        equipmentModel: found ? `${found.model} (${found.plateNumber})` : 'شاحنة خدمة',
                        operatorNameAr: found ? found.driverNameAr : formDispatch.operatorNameAr,
                        operatorPhone: found ? found.driverPhone : formDispatch.operatorPhone,
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    {fleetVehicles.map((veh) => (
                      <option key={veh.id} value={veh.id}>
                        {veh.model} - لوحة: {veh.plateNumber} ({veh.vehicleTypeAr})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Operator Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">المشغل أو السائق</label>
                  <select
                    value={formDispatch.operatorId}
                    onChange={(e) => {
                      const found = operators.find((o) => o.id === e.target.value);
                      setFormDispatch({
                        ...formDispatch,
                        operatorId: e.target.value,
                        operatorNameAr: found ? found.nameAr : '',
                        operatorPhone: found ? found.phone : '',
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    {operators.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.nameAr} - {op.roleType}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">رقم هاتف المشغل</label>
                  <input
                    type="text"
                    value={formDispatch.operatorPhone || ''}
                    onChange={(e) => setFormDispatch({ ...formDispatch, operatorPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Project & Client */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">اسم العميل</label>
                  <input
                    type="text"
                    placeholder="مثال: شركة بتروجت / أوراسكوم..."
                    value={formDispatch.clientAr || ''}
                    onChange={(e) => setFormDispatch({ ...formDispatch, clientAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">اسم المشروع والموقع</label>
                  <input
                    type="text"
                    placeholder="مثال: محطة الضبعة النووية..."
                    value={formDispatch.projectAr || ''}
                    onChange={(e) => setFormDispatch({ ...formDispatch, projectAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">الوردية</label>
                  <select
                    value={formDispatch.shiftType}
                    onChange={(e) =>
                      setFormDispatch({
                        ...formDispatch,
                        shiftType: e.target.value as DailyOperationAssignment['shiftType'],
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="وردية صباحية (08:00 ص - 04:00 م)">وردية صباحية (08:00 ص - 04:00 م)</option>
                    <option value="وردية مسائية (04:00 م - 12:00 ص)">وردية مسائية (04:00 م - 12:00 ص)</option>
                    <option value="وردية ليلية / طوارئ (12:00 ص - 08:00 ص)">وردية ليلية / طوارئ (12:00 ص - 08:00 ص)</option>
                    <option value="تشغيل متواصل 24 ساعة">تشغيل متواصل 24 ساعة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">الحالة الميدانية</label>
                  <select
                    value={formDispatch.operationStatus}
                    onChange={(e) =>
                      setFormDispatch({
                        ...formDispatch,
                        operationStatus: e.target.value as DailyOperationAssignment['operationStatus'],
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="في الموقع (يعمل)">في الموقع (يعمل)</option>
                    <option value="في الطريق (ترانزيت)">في الطريق (ترانزيت)</option>
                    <option value="توقف مؤقت / عطل">توقف مؤقت / عطل</option>
                    <option value="مكتمل بنجاح">مكتمل بنجاح</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">مشرف الموقع</label>
                  <input
                    type="text"
                    placeholder="م. طارق بدير"
                    value={formDispatch.siteSupervisorAr || ''}
                    onChange={(e) => setFormDispatch({ ...formDispatch, siteSupervisorAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">هاتف المشرف</label>
                  <input
                    type="text"
                    placeholder="01002345678"
                    value={formDispatch.siteSupervisorPhone || ''}
                    onChange={(e) => setFormDispatch({ ...formDispatch, siteSupervisorPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">ملاحظات مناورة الرفع والتكليف</label>
                <textarea
                  rows={2}
                  placeholder="بيان تفاصيل الرفع، الأوزان، نصف القطر..."
                  value={formDispatch.notes || ''}
                  onChange={(e) => setFormDispatch({ ...formDispatch, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold shadow-md hover:bg-slate-800"
                >
                  حفظ وتأكيد أمر التشغيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: SHIFT SWAP MODAL ================= */}
      {isSwapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                تبديل وردية بين مشغلين (Shift Swap)
              </h3>
              <button
                onClick={() => setIsSwapModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteSwap} className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
                <span className="font-bold text-indigo-900 block">المشغل الأول (طالب التبديل):</span>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={swapForm.operatorAId}
                    onChange={(e) => setSwapForm({ ...swapForm, operatorAId: e.target.value })}
                    className="w-full bg-white border border-indigo-200 rounded-xl px-2.5 py-1.5 font-bold"
                  >
                    {operators.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.nameAr}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={swapForm.shiftADate}
                    onChange={(e) => setSwapForm({ ...swapForm, shiftADate: e.target.value })}
                    className="w-full bg-white border border-indigo-200 rounded-xl px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <span className="font-bold text-amber-900 block">المشغل الثاني (الزميل البديل):</span>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={swapForm.operatorBId}
                    onChange={(e) => setSwapForm({ ...swapForm, operatorBId: e.target.value })}
                    className="w-full bg-white border border-amber-200 rounded-xl px-2.5 py-1.5 font-bold"
                  >
                    {operators.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.nameAr}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={swapForm.shiftBDate}
                    onChange={(e) => setSwapForm({ ...swapForm, shiftBDate: e.target.value })}
                    className="w-full bg-white border border-amber-200 rounded-xl px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">سبب ومبرر التبديل المعتمد</label>
                <textarea
                  rows={2}
                  value={swapForm.reasonAr}
                  onChange={(e) => setSwapForm({ ...swapForm, reasonAr: e.target.value })}
                  placeholder="بيان سبب التبديل وتأكيد موافقة الطرفين..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSwapModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  اعتماد وتبديل الوردية فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: DAILY BREAKDOWN TICKET MODAL ================= */}
      {isBreakdownModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                {editingBreakdown?.id ? 'تعديل بلاغ العطل اليومي' : 'تسجيل بلاغ عطل ميداني وتوقف معدة'}
              </h3>
              <button
                onClick={() => setIsBreakdownModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBreakdown} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">المعدة أو الشاحنة المعطلة</label>
                  <input
                    type="text"
                    value={formBreakdown.machineModel || ''}
                    onChange={(e) => setFormBreakdown({ ...formBreakdown, machineModel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">المشغل المبلغ</label>
                  <input
                    type="text"
                    value={formBreakdown.operatorNameAr || ''}
                    onChange={(e) => setFormBreakdown({ ...formBreakdown, operatorNameAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">نظام ومنظومة العطل</label>
                  <select
                    value={formBreakdown.breakdownSubsystem}
                    onChange={(e) =>
                      setFormBreakdown({
                        ...formBreakdown,
                        breakdownSubsystem: e.target.value as DailyBreakdownTicket['breakdownSubsystem'],
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="هيدروليك وبساتم">هيدروليك وبساتم</option>
                    <option value="محرك وديزل">محرك وديزل</option>
                    <option value="ذراع التلسكوب/بوم ووايرات">ذراع التلسكوب/بوم ووايرات</option>
                    <option value="حساسات وكروت إلكترونية (LMI)">حساسات وكروت إلكترونية (LMI)</option>
                    <option value="نظام الفرامل ونقل الحركة">نظام الفرامل ونقل الحركة</option>
                    <option value="تسريب زيوت وسوائل">تسريب زيوت وسوائل</option>
                    <option value="إطارات وجنازير">إطارات وجنازير</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">درجة الخطورة</label>
                  <select
                    value={formBreakdown.severity}
                    onChange={(e) =>
                      setFormBreakdown({
                        ...formBreakdown,
                        severity: e.target.value as DailyBreakdownTicket['severity'],
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-red-700"
                  >
                    <option value="حرج (توقف كامل عن العمل)">حرج (توقف كامل عن العمل)</option>
                    <option value="متوسط (تأثير جزئي)">متوسط (تأثير جزئي)</option>
                    <option value="بسيط (ملاحظة دورية مع استمرار العمل)">بسيط (ملاحظة دورية مع استمرار العمل)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">المشروع والموقع الميداني</label>
                  <input
                    type="text"
                    value={formBreakdown.projectAr || ''}
                    onChange={(e) => setFormBreakdown({ ...formBreakdown, projectAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">ساعات التوقف المقدرة</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formBreakdown.downtimeHours || 1}
                    onChange={(e) => setFormBreakdown({ ...formBreakdown, downtimeHours: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">وصف العطل بالتفصيل</label>
                <textarea
                  rows={2}
                  placeholder="وصف الأعراض، تسريب الزيوت، رسائل خطأ الكمبيوتر..."
                  value={formBreakdown.reportedDetails || ''}
                  onChange={(e) => setFormBreakdown({ ...formBreakdown, reportedDetails: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">الفني المكلف بالمعاينة والإصلاح</label>
                  <input
                    type="text"
                    value={formBreakdown.assignedTechnicianAr || ''}
                    onChange={(e) => setFormBreakdown({ ...formBreakdown, assignedTechnicianAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">حالة البلاغ والإصلاح</label>
                  <select
                    value={formBreakdown.status}
                    onChange={(e) =>
                      setFormBreakdown({
                        ...formBreakdown,
                        status: e.target.value as DailyBreakdownTicket['status'],
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="بلاغ جديد">بلاغ جديد</option>
                    <option value="قيد الفحص الميداني">قيد الفحص الميداني</option>
                    <option value="بانتظار قطع الغيار من المستودع">بانتظار قطع الغيار من المستودع</option>
                    <option value="تم الإصلاح وعادت للتشغيل">تم الإصلاح وعادت للتشغيل</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">قطع الغيار المطلوبة من المستودع (إن وجدت)</label>
                <input
                  type="text"
                  placeholder="مثال: طقم جوانات هيدروليك ليبهير (كود: SP-EC-HYD-102)..."
                  value={formBreakdown.partsRequested || ''}
                  onChange={(e) => setFormBreakdown({ ...formBreakdown, partsRequested: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-amber-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBreakdownModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                >
                  حفظ وتحديث بلاغ العطل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: CELL SHIFT EDITOR MODAL ================= */}
      {isShiftCellModalOpen && selectedShiftEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div>
                <h4 className="font-black text-slate-900">{selectedShiftEntry.operatorNameAr}</h4>
                <span className="text-[11px] text-slate-500 font-mono">{selectedShiftEntry.date}</span>
              </div>
              <button
                onClick={() => setIsShiftCellModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-700 font-bold">تحديد الوردية أو الإجازة:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'وردية صباحية', label: '☀️ صباحية (08-16)' },
                  { type: 'وردية مسائية', label: '🌆 مسائية (16-00)' },
                  { type: 'وردية ليلية', label: '🌙 ليلية (00-08)' },
                  { type: 'إجازة دورية', label: '🏖️ إجازة دورية' },
                  { type: 'راحة أسبوعية', label: '☕ راحة أسبوعية' },
                  { type: 'إجازة سنوية', label: '🌴 إجازة سنوية' },
                  { type: 'إجازة مرضية', label: '🏥 إجازة مرضية' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => {
                      updateOperatorShift(
                        selectedShiftEntry.id,
                        item.type as OperatorScheduleEntry['shiftType']
                      );
                      setIsShiftCellModalOpen(false);
                    }}
                    className={`py-2 px-2.5 rounded-xl font-bold text-center border transition-all ${
                      selectedShiftEntry.shiftType === item.type
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setIsShiftCellModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
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
