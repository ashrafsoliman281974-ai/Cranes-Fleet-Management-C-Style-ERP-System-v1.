import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  Phone,
  ShieldCheck,
  ChevronRight,
  Eye,
  Trash2,
  Edit3,
  ExternalLink,
  MapPin,
  CheckSquare,
  FileText,
  Package,
  Layers,
  BarChart3,
  Truck,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  CraneMaintenanceEvent,
  MaintenanceEventType,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceSparePartLine,
  MechanicTechnicianItem,
} from '../../types/erp';
import { MaintenanceD3Dashboard } from './MaintenanceD3Dashboard';
import { formatDateISO } from '../../utils/hijri';

export const FleetMaintenanceView: React.FC = () => {
  const {
    maintenanceEvents,
    saveMaintenanceEvent,
    deleteMaintenanceEvent,
    updateMaintenanceStatus,
    mechanics,
    saveMechanic,
    fleet,
    stockItems,
    showToast,
    language,
  } = useERP();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'mechanics'>('dashboard');

  // Filters for Events Table
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<CraneMaintenanceEvent> | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<CraneMaintenanceEvent | null>(null);

  const [isMechanicModalOpen, setIsMechanicModalOpen] = useState(false);
  const [editingMechanic, setEditingMechanic] = useState<Partial<MechanicTechnicianItem> | null>(null);

  // Form State for Event Modal
  const [formEvent, setFormEvent] = useState<Partial<CraneMaintenanceEvent>>({
    craneId: fleet[0]?.id || '',
    eventType: 'صيانة دورية وقائية (250/500/1000 ساعة)',
    priority: 'عادية',
    status: 'مجدولة قادمة',
    scheduledDate: formatDateISO(new Date()),
    nextDueDate: formatDateISO(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)),
    currentHourMeter: 3200,
    nextDueHourMeter: 3700,
    workshopLocation: 'الورشة المركزية للأوناش - طريق السويس',
    leadMechanicId: mechanics[0]?.id || '',
    taskDescriptionAr: '',
    estimatedCost: 15000,
    actualCost: 0,
    downtimeHours: 6,
    safetyInspectionPassed: false,
    sparePartsUsed: [],
  });

  // Spare parts sub-form inside Event Modal
  const [selectedStockCode, setSelectedStockCode] = useState('');
  const [partQty, setPartQty] = useState<number>(1);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return maintenanceEvents.filter((ev) => {
      const matchSearch =
        !searchQuery ||
        ev.eventNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.craneCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.craneModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.leadMechanicNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.workshopLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || ev.status === statusFilter;
      const matchPriority = priorityFilter === 'all' || ev.priority === priorityFilter;
      const matchType = eventTypeFilter === 'all' || ev.eventType === eventTypeFilter;

      return matchSearch && matchStatus && matchPriority && matchType;
    });
  }, [maintenanceEvents, searchQuery, statusFilter, priorityFilter, eventTypeFilter]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    const selectedCrane = fleet[0];
    setFormEvent({
      craneId: selectedCrane?.id || '',
      craneCode: selectedCrane?.code || 'EC-1200-01',
      craneModel: selectedCrane?.model || 'Liebherr LTM 11200',
      capacityTon: selectedCrane?.capacityTon || 1200,
      eventType: 'صيانة دورية وقائية (250/500/1000 ساعة)',
      priority: 'عادية',
      status: 'مجدولة قادمة',
      scheduledDate: formatDateISO(new Date()),
      nextDueDate: formatDateISO(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
      currentHourMeter: selectedCrane?.currentHourMeter || 3200,
      nextDueHourMeter: (selectedCrane?.currentHourMeter || 3200) + 500,
      workshopLocation: 'الورشة المركزية للأوناش - طريق السويس',
      leadMechanicId: mechanics[0]?.id || '',
      leadMechanicNameAr: mechanics[0]?.nameAr || 'م. سامح الجوهري',
      leadMechanicPhone: mechanics[0]?.phone || '01003847592',
      taskDescriptionAr: 'صيانة وتغيير فلاتر وزيوت وفحص الضغوط الهيدروليكية الشامل',
      estimatedCost: 25000,
      actualCost: 0,
      downtimeHours: 8,
      safetyInspectionPassed: false,
      sparePartsUsed: [],
    });
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (ev: CraneMaintenanceEvent) => {
    setEditingEvent(ev);
    setFormEvent({ ...ev });
    setIsEventModalOpen(true);
  };

  // Save Event Handler
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCrane = fleet.find((c) => c.id === formEvent.craneId);
    const targetMech = mechanics.find((m) => m.id === formEvent.leadMechanicId);

    const saved = saveMaintenanceEvent({
      ...formEvent,
      id: editingEvent?.id,
      craneCode: targetCrane?.code || formEvent.craneCode || 'EC-CRANE',
      craneModel: targetCrane?.model || formEvent.craneModel || 'Heavy Crane',
      capacityTon: targetCrane?.capacityTon || formEvent.capacityTon || 100,
      leadMechanicNameAr: targetMech?.nameAr || formEvent.leadMechanicNameAr || 'فني الصيانة',
      leadMechanicPhone: targetMech?.phone || formEvent.leadMechanicPhone || '',
    });

    setIsEventModalOpen(false);
    showToast(
      editingEvent
        ? `تم تحديث أمر الصيانة ${saved.eventNo} بنجاح`
        : `تم تسجيل أمر الصيانة الجديد ${saved.eventNo} وإدراجه في لوحة D3`
    );
  };

  // Add Spare Part to Form
  const handleAddSparePart = () => {
    if (!selectedStockCode) return;
    const item = stockItems.find((s) => s.itemCode === selectedStockCode);
    if (!item) return;

    const newLine: MaintenanceSparePartLine = {
      itemCode: item.itemCode,
      itemNameAr: item.nameAr,
      qty: Number(partQty) || 1,
      unitCost: item.costPrice,
      totalCost: (Number(partQty) || 1) * item.costPrice,
    };

    const currentParts = formEvent.sparePartsUsed || [];
    const updatedParts = [...currentParts, newLine];
    const partsCost = updatedParts.reduce((acc, p) => acc + p.totalCost, 0);

    setFormEvent((prev) => ({
      ...prev,
      sparePartsUsed: updatedParts,
      actualCost: (prev.actualCost || 0) + newLine.totalCost,
    }));

    setSelectedStockCode('');
    setPartQty(1);
    showToast(`تمت إضافة قطعة الغيار: ${item.nameAr}`);
  };

  // Remove Spare Part
  const handleRemoveSparePart = (idx: number) => {
    const currentParts = formEvent.sparePartsUsed || [];
    const updatedParts = currentParts.filter((_, i) => i !== idx);
    setFormEvent((prev) => ({
      ...prev,
      sparePartsUsed: updatedParts,
    }));
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const rows: string[][] = [
      ['شركة مصر للمقاولات المتخصصة (إيجيبت كرينز) - سجل صيانة أسطول الأوناش والرافعات'],
      [`تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-EG')} | إجمالي السجلات: ${filteredEvents.length}`],
      [],
      [
        'رقم البلاغ',
        'كود الرافعة',
        'طراز الرافعة',
        'الحمولة (طن)',
        'نوع الصيانة',
        'الأولوية',
        'الحالة',
        'تاريخ الاستحقاق',
        'عداد الساعات الحالي',
        'عداد الاستحقاق',
        'المسؤول الفني',
        'الموقع / الورشة',
        'ساعات التوقف',
        'التكلفة الإجمالية (ج.م)',
        'شهادة الأمان',
      ],
    ];

    filteredEvents.forEach((ev) => {
      rows.push([
        ev.eventNo,
        ev.craneCode,
        `"${ev.craneModel.replace(/"/g, '""')}"`,
        ev.capacityTon.toString(),
        `"${ev.eventType}"`,
        ev.priority,
        ev.status,
        ev.nextDueDate || ev.scheduledDate,
        ev.currentHourMeter.toString(),
        ev.nextDueHourMeter.toString(),
        `"${ev.leadMechanicNameAr}"`,
        `"${ev.workshopLocation}"`,
        ev.downtimeHours.toString(),
        (ev.actualCost || ev.estimatedCost).toString(),
        ev.safetyInspectionPassed ? 'مجتاز ومعتمد' : 'بانتظار الفحص',
      ]);
    });

    const csvContent = '\uFEFF' + rows.map((r) => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EgyptCranes_Fleet_Maintenance_${formatDateISO(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('تم تصدير سجل صيانة الأسطول إلى Excel (CSV) بنجاح');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* ENTERPRISE C-STYLE HEADER */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-amber-600 to-amber-400 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Wrench className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  متابعة صيانة أسطول الأوناش والورش (Fleet Maintenance Tracking)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  D3.js Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                نظام تخطيط وجدولة العمرات، فحص الأمان (Load Test)، واختبار الأحمال للأوناش من 30 طن حتى 1200 طن وتوزيع أطقم الميكانيكيين
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold shadow-md transition-colors"
              title="تصدير لملف إكسل"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>تصدير Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold shadow-md transition-colors"
              title="طباعة التقرير"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>طباعة</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold rounded-xl text-xs shadow-xl transition-all transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل أمر صيانة جديد</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 shadow-lg font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>لوحة الرؤية البيانية D3 (D3 Visual Dashboard)</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 shadow-lg font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>جدول أوامر وبلاغات الصيانة ({filteredEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mechanics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'mechanics'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 shadow-lg font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>طاقم الميكانيكيين والفنيين المعتمدين ({mechanics.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: D3 VISUAL DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <MaintenanceD3Dashboard
          events={maintenanceEvents}
          mechanics={mechanics}
          fleet={fleet}
          onSelectEvent={(ev) => {
            setDetailEvent(ev);
            setIsDetailModalOpen(true);
          }}
          onNewEvent={handleOpenCreateModal}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MAINTENANCE EVENTS LEDGER TABLE */}
      {/* ========================================================================= */}
      {activeTab === 'events' && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          {/* Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="بحث برقم البلاغ، الرافعة، الميكانيكي، أو الموقع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 text-slate-200 border border-slate-700 rounded-xl pr-9 pl-3 py-2 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
            >
              <option value="all">جميع الحالات (الكل)</option>
              <option value="متأخرة / تنبيه حرج">متأخرة / تنبيه حرج (Overdue)</option>
              <option value="قيد التنفيذ بالورشة / الموقع">قيد التنفيذ بالورشة / الموقع</option>
              <option value="مجدولة قادمة">مجدولة قادمة (Scheduled)</option>
              <option value="مكتملة ومختبرة">مكتملة ومختبرة (Completed)</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
            >
              <option value="all">جميع مستويات الأولوية</option>
              <option value="حرجة / عاجلة">حرجة / عاجلة (Critical)</option>
              <option value="متوسطة">متوسطة (Medium)</option>
              <option value="عادية">عادية (Routine)</option>
            </select>

            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
            >
              <option value="all">جميع أنواع الصيانة</option>
              <option value="صيانة دورية وقائية (250/500/1000 ساعة)">صيانة دورية وقائية</option>
              <option value="صيانة هيدروليك وبساتم وضغوط">هيدروليك وبساتم</option>
              <option value="عمرة وصيانة محرك وديزل">محرك وديزل</option>
              <option value="فحص ذراع التلسكوب والبوم والوايرات">بوم شبكي ووايرات</option>
              <option value="معايرة كمبيوتر الحمولة LMI والحساسات">كمبيوتر LMI وحساسات</option>
              <option value="شهادة فحص واختبار أمان دولي (Load Test)">شهادة أمان Load Test</option>
              <option value="إصلاح عطل طارئ واستبدال قطع غيار">عطل طارئ وقطع غيار</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-800/80 text-slate-400 text-[11px] font-bold border-b border-slate-700">
                <tr>
                  <th className="py-3 px-3">رقم البلاغ</th>
                  <th className="py-3 px-3">الرافعة</th>
                  <th className="py-3 px-3">نوع الصيانة والأولوية</th>
                  <th className="py-3 px-3">تاريخ الاستحقاق</th>
                  <th className="py-3 px-3">عداد الساعات</th>
                  <th className="py-3 px-3">المسؤول الفني والموقع</th>
                  <th className="py-3 px-3">التكلفة والتوقف</th>
                  <th className="py-3 px-3">شهادة الفحص</th>
                  <th className="py-3 px-3">الحالة</th>
                  <th className="py-3 px-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500 font-semibold">
                      لا توجد أوامر صيانة مطابقة لمعايير البحث الحالية
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((ev) => {
                    const isOverdue = ev.status === 'متأخرة / تنبيه حرج';
                    const isInProgress = ev.status === 'قيد التنفيذ بالورشة / الموقع';
                    const isCompleted = ev.status === 'مكتملة ومختبرة';

                    return (
                      <tr
                        key={ev.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isOverdue ? 'bg-rose-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-amber-400">
                          {ev.eventNo}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono border border-slate-700">
                              {ev.craneCode}
                            </span>
                            <span className="truncate max-w-[150px]">{ev.craneModel.split('(')[0]}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            حمولة: {ev.capacityTon} طن
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-200">{ev.eventType}</div>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                              ev.priority === 'حرجة / عاجلة'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : ev.priority === 'متوسطة'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-700/60 text-slate-300'
                            }`}
                          >
                            {ev.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <div className="text-white font-bold">{ev.nextDueDate || ev.scheduledDate}</div>
                          <div className="text-[10px] text-slate-400">مجدولة: {ev.scheduledDate}</div>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <div className="text-amber-300 font-bold">{ev.currentHourMeter} س</div>
                          <div className="text-[10px] text-slate-400">استحقاق: {ev.nextDueHourMeter} س</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{ev.leadMechanicNameAr}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>{ev.workshopLocation}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <div className="text-emerald-400 font-bold">
                            {(ev.actualCost > 0 ? ev.actualCost : ev.estimatedCost).toLocaleString('ar-EG')} ج.م
                          </div>
                          <div className="text-[10px] text-slate-400">{ev.downtimeHours} ساعة توقف</div>
                        </td>
                        <td className="py-3 px-3">
                          {ev.safetyInspectionPassed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <ShieldCheck className="w-3 h-3" />
                              <span>مجتاز ومعتمد</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              <Clock className="w-3 h-3" />
                              <span>بانتظار الاختبار</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold inline-block ${
                              isOverdue
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse'
                                : isInProgress
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                : isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {ev.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setDetailEvent(ev);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                              title="عرض التفاصيل"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(ev)}
                              className="p-1.5 bg-slate-800 hover:bg-amber-600/30 text-amber-400 rounded-lg transition-colors"
                              title="تعديل أمر الصيانة"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف أمر الصيانة ${ev.eventNo}؟`)) {
                                  deleteMaintenanceEvent(ev.id);
                                  showToast(`تم حذف أمر الصيانة ${ev.eventNo}`);
                                }
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-rose-600/30 text-rose-400 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CERTIFIED MECHANICS & TECHNICIANS ROSTER */}
      {/* ========================================================================= */}
      {activeTab === 'mechanics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <div>
              <h3 className="text-base font-black text-white">طاقم مهندسي وفنيي صيانة الأوناش المعتمدين</h3>
              <p className="text-xs text-slate-400">
                مهندسو هيدروليك وضغوط عصبية، ميكانيكا محركات ديزل ليبهير وديمج، وفاحصو كروت LMI الإلكترونية
              </p>
            </div>
            <button
              onClick={() => {
                setEditingMechanic(null);
                setIsMechanicModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-700 to-amber-600 text-white font-bold rounded-xl text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة فني معتمد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mechanics.map((mech) => {
              const activeTasks = maintenanceEvents.filter(
                (e) => e.leadMechanicId === mech.id && e.status === 'قيد التنفيذ بالورشة / الموقع'
              ).length;

              return (
                <div
                  key={mech.id}
                  className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{mech.nameAr}</h4>
                      <div className="text-xs text-amber-400 font-semibold mt-0.5">{mech.specialtyAr}</div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        mech.status === 'متاح للعمل'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : mech.status === 'مكلف بمهمة صيانة'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {mech.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">سنوات الخبرة:</span>
                      <span className="font-bold text-white">{mech.experienceYears} سنة خبرة ميدانية</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">رقم شهادة الاعتماد:</span>
                      <span className="font-mono text-cyan-300 font-bold">{mech.certificationNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">المقر والورشة:</span>
                      <span className="text-slate-200 font-medium truncate max-w-[160px]">
                        {mech.workshopLocationAr}
                      </span>
                    </div>
                    {mech.currentAssignedCrane && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                        <span className="text-slate-400">الرافعة المكلف بها:</span>
                        <span className="font-bold text-amber-300">{mech.currentAssignedCrane}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-slate-400">
                      <span>المهام النشطة: </span>
                      <span className="font-mono font-bold text-white">{activeTasks} مهمة</span>
                    </div>

                    <a
                      href={`tel:${mech.phone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span className="font-mono">{mech.phone}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT MAINTENANCE EVENT */}
      {/* ========================================================================= */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 text-right text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">
                  {editingEvent ? `تعديل أمر الصيانة (${editingEvent.eventNo})` : 'تسجيل أمر صيانة وتكليف فني جديد'}
                </h3>
              </div>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              {/* Row 1: Crane & Maintenance Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الرافعة المستهدفة بالصيانة *</label>
                  <select
                    value={formEvent.craneId}
                    onChange={(e) => {
                      const c = fleet.find((fl) => fl.id === e.target.value);
                      setFormEvent((prev) => ({
                        ...prev,
                        craneId: e.target.value,
                        craneCode: c?.code || '',
                        craneModel: c?.model || '',
                        capacityTon: c?.capacityTon || 100,
                        currentHourMeter: c?.currentHourMeter || prev.currentHourMeter,
                        nextDueHourMeter: (c?.currentHourMeter || prev.currentHourMeter || 3000) + 500,
                      }));
                    }}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  >
                    {fleet.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.model} ({c.capacityTon} طن)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نوع وتصنيف الصيانة *</label>
                  <select
                    value={formEvent.eventType}
                    onChange={(e) =>
                      setFormEvent((prev) => ({ ...prev, eventType: e.target.value as MaintenanceEventType }))
                    }
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  >
                    <option value="صيانة دورية وقائية (250/500/1000 ساعة)">صيانة دورية وقائية (250/500/1000 ساعة)</option>
                    <option value="صيانة هيدروليك وبساتم وضغوط">صيانة هيدروليك وبساتم وضغوط</option>
                    <option value="عمرة وصيانة محرك وديزل">عمرة وصيانة محرك وديزل</option>
                    <option value="فحص ذراع التلسكوب والبوم والوايرات">فحص ذراع التلسكوب والبوم والوايرات</option>
                    <option value="معايرة كمبيوتر الحمولة LMI والحساسات">معايرة كمبيوتر الحمولة LMI والحساسات</option>
                    <option value="شهادة فحص واختبار أمان دولي (Load Test)">شهادة فحص واختبار أمان دولي (Load Test)</option>
                    <option value="إصلاح عطل طارئ واستبدال قطع غيار">إصلاح عطل طارئ واستبدال قطع غيار</option>
                    <option value="صيانة إطارات وفرامل وشاسيه الرافعة">صيانة إطارات وفرامل وشاسيه الرافعة</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Priority, Status, Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">درجة الأولوية</label>
                  <select
                    value={formEvent.priority}
                    onChange={(e) =>
                      setFormEvent((prev) => ({ ...prev, priority: e.target.value as MaintenancePriority }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  >
                    <option value="حرجة / عاجلة">حرجة / عاجلة (Critical)</option>
                    <option value="متوسطة">متوسطة (Medium)</option>
                    <option value="عادية">عادية (Routine)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">حالة أمر الصيانة</label>
                  <select
                    value={formEvent.status}
                    onChange={(e) =>
                      setFormEvent((prev) => ({ ...prev, status: e.target.value as MaintenanceStatus }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  >
                    <option value="مجدولة قادمة">مجدولة قادمة</option>
                    <option value="قيد التنفيذ بالورشة / الموقع">قيد التنفيذ بالورشة / الموقع</option>
                    <option value="مكتملة ومختبرة">مكتملة ومختبرة</option>
                    <option value="متأخرة / تنبيه حرج">متأخرة / تنبيه حرج</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">موقع تنفيذ الصيانة / الورشة</label>
                  <input
                    type="text"
                    value={formEvent.workshopLocation || ''}
                    onChange={(e) => setFormEvent((prev) => ({ ...prev, workshopLocation: e.target.value }))}
                    placeholder="مثال: الورشة المركزية بالسويس"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Dates & Hour Meters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تاريخ البدء المجدول</label>
                  <input
                    type="date"
                    value={formEvent.scheduledDate || ''}
                    onChange={(e) => setFormEvent((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تاريخ الاستحقاق الأقصى</label>
                  <input
                    type="date"
                    value={formEvent.nextDueDate || ''}
                    onChange={(e) => setFormEvent((prev) => ({ ...prev, nextDueDate: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">عداد الساعات الحالي</label>
                  <input
                    type="number"
                    value={formEvent.currentHourMeter || 0}
                    onChange={(e) => setFormEvent((prev) => ({ ...prev, currentHourMeter: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">عداد الاستحقاق القادم</label>
                  <input
                    type="number"
                    value={formEvent.nextDueHourMeter || 0}
                    onChange={(e) => setFormEvent((prev) => ({ ...prev, nextDueHourMeter: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Lead Mechanic & Assisting Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المسؤول الفني الأول (Lead Mechanic) *</label>
                  <select
                    value={formEvent.leadMechanicId}
                    onChange={(e) => {
                      const m = mechanics.find((mech) => mech.id === e.target.value);
                      setFormEvent((prev) => ({
                        ...prev,
                        leadMechanicId: e.target.value,
                        leadMechanicNameAr: m?.nameAr || '',
                        leadMechanicPhone: m?.phone || '',
                      }));
                    }}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  >
                    {mechanics.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nameAr} - {m.specialtyAr} ({m.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">طاقم المساعدين والسيارة المرافقة</label>
                  <input
                    type="text"
                    value={formEvent.assistingCrewAr || ''}
                    onChange={(e) => setFormEvent((prev) => ({ ...prev, assistingCrewAr: e.target.value }))}
                    placeholder="مثال: طاقم ورشة مان المتنقلة + فني كهرباء"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Task Description */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">شرح وتفاصيل خطة الصيانة المطلوبة</label>
                <textarea
                  rows={2}
                  value={formEvent.taskDescriptionAr || ''}
                  onChange={(e) => setFormEvent((prev) => ({ ...prev, taskDescriptionAr: e.target.value }))}
                  placeholder="وصف تفصيلي للإجراءات، فحص الضغوط، تغيير الفلاتر، معايرة الحساسات..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Row 6: Spare Parts from Inventory */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs">قطع الغيار المصروفة من المخازن</span>
                  </div>
                  <span className="text-[10px] text-slate-400">تحديث تكلفة الصيانة تلقائياً</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedStockCode}
                    onChange={(e) => setSelectedStockCode(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">-- اختر قطعة الغيار من رصيد المستودع --</option>
                    {stockItems.map((st) => (
                      <option key={st.id} value={st.itemCode}>
                        {st.itemCode} - {st.nameAr} ({st.costPrice.toLocaleString('ar-EG')} ج.م)
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={partQty}
                    onChange={(e) => setPartQty(Math.max(1, Number(e.target.value)))}
                    className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono text-center"
                    placeholder="الكمية"
                  />

                  <button
                    type="button"
                    onClick={handleAddSparePart}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                  >
                    إضافة
                  </button>
                </div>

                {/* Parts Table */}
                {formEvent.sparePartsUsed && formEvent.sparePartsUsed.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-[11px]">
                      <thead className="text-slate-400 border-b border-slate-700/60 pb-1">
                        <tr>
                          <th className="py-1">الكود</th>
                          <th className="py-1">الصنف</th>
                          <th className="py-1">الكمية</th>
                          <th className="py-1">السعر</th>
                          <th className="py-1">الإجمالي</th>
                          <th className="py-1"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {formEvent.sparePartsUsed.map((p, idx) => (
                          <tr key={idx}>
                            <td className="py-1 font-mono text-amber-400">{p.itemCode}</td>
                            <td className="py-1 text-slate-200">{p.itemNameAr}</td>
                            <td className="py-1 font-mono">{p.qty}</td>
                            <td className="py-1 font-mono">{p.unitCost.toLocaleString('ar-EG')} ج.م</td>
                            <td className="py-1 font-mono font-bold text-emerald-400">
                              {p.totalCost.toLocaleString('ar-EG')} ج.م
                            </td>
                            <td className="py-1 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveSparePart(idx)}
                                className="text-rose-400 hover:text-rose-300"
                              >
                                &times;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Row 7: Costs, Downtime, Safety Pass */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">التكلفة الفعلية (ج.م)</label>
                  <input
                    type="number"
                    value={formEvent.actualCost || 0}
                    onChange={(e) => setFormEvent((prev) => ({ ...prev, actualCost: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ساعات التوقف (Downtime)</label>
                  <input
                    type="number"
                    value={formEvent.downtimeHours || 0}
                    onChange={(e) => setFormEvent((prev) => ({ ...prev, downtimeHours: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="safetyInspectionPassed"
                    checked={formEvent.safetyInspectionPassed || false}
                    onChange={(e) =>
                      setFormEvent((prev) => ({ ...prev, safetyInspectionPassed: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700 focus:ring-emerald-400"
                  />
                  <label htmlFor="safetyInspectionPassed" className="text-slate-200 font-semibold cursor-pointer">
                    اجتياز شهادة فحص الأمان واختبار الأحمال (Load Test Passed)
                  </label>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg"
                >
                  حفظ أمر الصيانة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DETAIL VIEW FOR SINGLE MAINTENANCE EVENT */}
      {/* ========================================================================= */}
      {isDetailModalOpen && detailEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4 text-right text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-amber-400 text-xs font-bold">{detailEvent.eventNo}</span>
                <h3 className="text-lg font-black text-white">{detailEvent.craneModel} ({detailEvent.craneCode})</h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
              <div>
                <span className="text-slate-400 block">نوع الصيانة:</span>
                <span className="font-bold text-white">{detailEvent.eventType}</span>
              </div>
              <div>
                <span className="text-slate-400 block">الأولوية:</span>
                <span className="font-bold text-amber-400">{detailEvent.priority}</span>
              </div>
              <div>
                <span className="text-slate-400 block">الحالة:</span>
                <span className="font-bold text-cyan-400">{detailEvent.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block">تاريخ الاستحقاق:</span>
                <span className="font-mono font-bold text-slate-200">{detailEvent.nextDueDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block">ساعات التشغيل:</span>
                <span className="font-mono font-bold text-amber-300">
                  {detailEvent.currentHourMeter} / {detailEvent.nextDueHourMeter} س
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">ساعات التوقف:</span>
                <span className="font-mono font-bold text-indigo-300">{detailEvent.downtimeHours} ساعة</span>
              </div>
              <div>
                <span className="text-slate-400 block">المسؤول الفني:</span>
                <span className="font-semibold text-white">{detailEvent.leadMechanicNameAr}</span>
              </div>
              <div>
                <span className="text-slate-400 block">هاتف الفني:</span>
                <span className="font-mono font-semibold text-emerald-400">{detailEvent.leadMechanicPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">الموقع / الورشة:</span>
                <span className="font-semibold text-slate-200 truncate block">{detailEvent.workshopLocation}</span>
              </div>
            </div>

            {/* Task Description */}
            <div className="text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-bold block mb-1">وصف المهمة وتقرير الأعمال:</span>
              <p className="text-slate-200 leading-relaxed">{detailEvent.taskDescriptionAr}</p>
              {detailEvent.workDoneReportAr && (
                <p className="text-emerald-300 mt-2 text-[11px] bg-slate-900/60 p-2 rounded-lg border border-emerald-900/50">
                  <span className="font-bold block">تقرير الإنجاز:</span> {detailEvent.workDoneReportAr}
                </p>
              )}
            </div>

            {/* Spare Parts */}
            {detailEvent.sparePartsUsed && detailEvent.sparePartsUsed.length > 0 && (
              <div className="text-xs space-y-1.5">
                <span className="text-slate-400 font-bold block">قطع الغيار المستخدمة:</span>
                <div className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-800 space-y-1">
                  {detailEvent.sparePartsUsed.map((p, i) => (
                    <div key={i} className="flex justify-between text-[11px] text-slate-200">
                      <span>{p.itemNameAr} ({p.itemCode}) &times; {p.qty}</span>
                      <span className="font-mono font-bold text-emerald-400">{p.totalCost.toLocaleString('ar-EG')} ج.م</span>
                    </div>
                  ))}
                  <div className="pt-1.5 border-t border-slate-700/60 flex justify-between font-bold text-xs text-white">
                    <span>إجمالي تكلفة قطع الغيار:</span>
                    <span className="font-mono text-emerald-400">
                      {detailEvent.sparePartsUsed.reduce((s, p) => s + p.totalCost, 0).toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {detailEvent.status !== 'مكتملة ومختبرة' && (
                  <button
                    onClick={() => {
                      updateMaintenanceStatus(detailEvent.id, 'مكتملة ومختبرة', 'تم الاختبار بنجاح');
                      setIsDetailModalOpen(false);
                      showToast(`تم تغيير حالة الصيانة ${detailEvent.eventNo} إلى مكتملة ومختبرة`);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اعتماد إتمام واختبار الصيانة</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold"
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
