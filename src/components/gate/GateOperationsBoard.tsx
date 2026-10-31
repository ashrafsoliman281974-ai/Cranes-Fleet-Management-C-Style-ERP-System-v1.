import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Search,
  Truck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wrench,
  ShieldCheck,
  MapPin,
  ArrowRightLeft,
  Calendar,
  FileCheck,
  Building,
  UserCheck,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { CraneGateLog, CraneOperationStatus, CraneBreakdownLog } from '../../types/erp';
import { gregorianToHijri, formatDateISO } from '../../utils/hijri';

export const GateOperationsBoard: React.FC = () => {
  const {
    gateLogs,
    addGateLog,
    operationsStatuses,
    updateCraneStatus,
    breakdownLogs,
    addBreakdownLog,
    updateBreakdownStatus,
    fleet,
    costCenters,
    showToast,
    t,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'gate' | 'operations' | 'breakdowns'>('operations');

  // Gate Form State
  const [selectedCrane, setSelectedCrane] = useState(fleet[0]?.model || '');
  const [plateNo, setPlateNo] = useState('ق د س 9142 / نقل ثقيل');
  const [driverNameAr, setDriverNameAr] = useState('كابتن محمود عبد العال');
  const [direction, setDirection] = useState<CraneGateLog['direction']>('خروج للموقع');
  const [targetProjectAr, setTargetProjectAr] = useState('مشروع حقل ظهر للغاز الطبيعي');
  const [hourMeter, setHourMeter] = useState<number>(4860);
  const [safetyCheckPassed, setSafetyCheckPassed] = useState(true);
  const [permitNo, setPermitNo] = useState('PRM-ZOHR-2026-08');
  const [securityOfficerAr, setSecurityOfficerAr] = useState('محمد عبد الله (مسؤول البوابة)');

  // Breakdown Form State
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [bCraneCode, setBCraneCode] = useState(operationsStatuses[0]?.code || 'EC-700-02');
  const [bType, setBType] = useState<CraneBreakdownLog['breakdownType']>('هيدروليك');
  const [bSeverity, setBSeverity] = useState<CraneBreakdownLog['severity']>('حرج (توقف كامل)');
  const [bLocation, setBLocation] = useState('موقع العاصمة الإدارية - قطاع R3');
  const [bProject, setBProject] = useState('مشروع مونوريل العاصمة الإدارية');
  const [bTechnician, setBTechnician] = useState('م. إبراهيم القاضي (رئيس الورشة)');
  const [bParts, setBParts] = useState('طقم جوانات وأولسيهات بستم البوم + زيت هيدروليك');

  const handleCreateGateLog = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const hijri = gregorianToHijri(today);

    addGateLog({
      craneId: 'flt-custom',
      craneModel: selectedCrane,
      plateNo,
      driverNameAr,
      direction,
      targetProjectAr,
      logTimestamp: `${formatDateISO(today)} ${today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      hijriDateFormatted: hijri.formattedAr,
      hourMeter: Number(hourMeter),
      safetyCheckPassed,
      permitNo,
      securityOfficerAr,
    });
  };

  const handleCreateBreakdown = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const matched = operationsStatuses.find((c) => c.code === bCraneCode);

    addBreakdownLog({
      craneCode: bCraneCode,
      craneModel: matched ? matched.craneModel : 'Crane Heavy Model',
      breakdownType: bType,
      severity: bSeverity,
      locationAr: bLocation,
      projectAr: bProject,
      reportedTime: `${formatDateISO(today)} ${today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      assignedTechnicianAr: bTechnician,
      status: 'بلاغ جديد',
      partsRequired: bParts,
    });

    if (matched) {
      updateCraneStatus(matched.id, 'عطل / صيانة طارئة', bLocation);
    }

    setIsBreakdownModalOpen(false);
  };

  const operatingCount = operationsStatuses.filter((s) => s.currentStatus === 'في الموقع (يعمل)').length;
  const transitCount = operationsStatuses.filter((s) => s.currentStatus === 'في الطريق (ترانزيت)').length;
  const readyCount = operationsStatuses.filter((s) => s.currentStatus === 'جاهز بالمستودع').length;
  const breakdownCount = operationsStatuses.filter((s) => s.currentStatus === 'عطل / صيانة طارئة').length;

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('Operations Center', 'مركز عمليات وتشغيل الأوناش', 'Operations')}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
              Egypt Cranes Live Hub
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600 animate-pulse" />
            <span>بوابة الأوناش ولوحة التشغيل اليومي والأعطال</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBreakdownModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-xs transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>تسجيل بلاغ عطل طارئ (+)</span>
          </button>
        </div>
      </div>

      {/* KPI Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>في الموقع (تعمل)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-xl font-black text-emerald-800 font-mono tabular-nums">
            {operatingCount} رافعات
          </div>
          <div className="text-[11px] text-slate-400">حقول البترول والعاصمة والكهرباء</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>في الطريق (ترانزيت)</span>
            <ArrowRightLeft className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-blue-800 font-mono tabular-nums">
            {transitCount} رافعات
          </div>
          <div className="text-[11px] text-slate-400">بمرافقة أمن الطرق وأوزان النقل</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>جاهزة بالمستودع</span>
            <CheckCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-black text-slate-800 font-mono tabular-nums">
            {readyCount} رافعات
          </div>
          <div className="text-[11px] text-slate-400">مستعدة للتعاقد والتحميل الفوري</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>تحت الصيانة / أعطال</span>
            <Wrench className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl font-black text-red-700 font-mono tabular-nums">
            {breakdownCount} رافعات
          </div>
          <div className="text-[11px] text-red-600 font-medium">جاري فحصها بالورشة المركزية</div>
        </div>
      </div>

      {/* 3 Main Tabs Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-4 overflow-x-auto">
          {[
            { id: 'operations', label: 'لوحة التشغيل اليومي المباشر للأوناش', icon: Activity },
            { id: 'gate', label: 'سجل وتصاريح بوابة الدخول والخروج', icon: Truck },
            { id: 'breakdowns', label: `سجل وبلاغات الأعطال اليومية (${breakdownLogs.length})`, icon: Wrench },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3.5 px-5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-red-600 text-red-700 bg-white shadow-2xs font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Daily Operations Live Kanban */}
        {activeTab === 'operations' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                متابعة تمركز وحالة عمل أسطول الأوناش لحظة بلحظة مع خيارات التحديث السريع
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(
                [
                  { status: 'في الموقع (يعمل)', color: 'border-emerald-500', bg: 'bg-emerald-50/50' },
                  { status: 'في الطريق (ترانزيت)', color: 'border-blue-500', bg: 'bg-blue-50/50' },
                  { status: 'جاهز بالمستودع', color: 'border-slate-400', bg: 'bg-slate-50' },
                  { status: 'عطل / صيانة طارئة', color: 'border-red-500', bg: 'bg-red-50/50' },
                ] as const
              ).map((col) => {
                const cranesInStatus = operationsStatuses.filter((s) => s.currentStatus === col.status);
                return (
                  <div key={col.status} className="bg-slate-50/70 rounded-xl border border-slate-200 p-3 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-black text-slate-800">{col.status}</span>
                      <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        {cranesInStatus.length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[350px]">
                      {cranesInStatus.map((crane) => (
                        <div
                          key={crane.id}
                          className={`bg-white p-3.5 rounded-xl border-r-4 ${col.color} border border-slate-200 shadow-2xs space-y-2 hover:shadow-xs transition-shadow`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-mono text-xs font-black text-slate-900">{crane.code}</span>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              {crane.capacityTon} Ton
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-800 leading-tight">{crane.craneModel}</h4>

                          <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                            <div className="flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{crane.assignedProjectAr}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="text-slate-500 truncate">{crane.locationAr}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="text-slate-700 font-medium">{crane.operatorNameAr}</span>
                            </div>
                          </div>

                          {/* Quick Status Changers */}
                          <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px]">
                            <span className="text-slate-400">تغيير الحالة:</span>
                            <select
                              value={crane.currentStatus}
                              onChange={(e) => updateCraneStatus(crane.id, e.target.value as any)}
                              className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-bold"
                            >
                              <option value="في الموقع (يعمل)">في الموقع</option>
                              <option value="في الطريق (ترانزيت)">ترانزيت</option>
                              <option value="جاهز بالمستودع">جاهز</option>
                              <option value="عطل / صيانة طارئة">صيانة / عطل</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Gate In/Out Register */}
        {activeTab === 'gate' && (
          <div className="p-6 space-y-6">
            {/* Quick Gate Pass Form */}
            <form onSubmit={handleCreateGateLog} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-black text-slate-800">
                  تسجيل تصريح حركة بوابة جديدة (Gate In/Out Pass)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  تسجيل مباشر متوافق مع معايير السلامة الصناعية
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الرافعة *</label>
                  <select
                    value={selectedCrane}
                    onChange={(e) => setSelectedCrane(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold"
                  >
                    {fleet.map((f) => (
                      <option key={f.id} value={`${f.model} (${f.capacityTon}T)`}>
                        {f.model} ({f.capacityTon} طن)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">نوع حركة البوابة *</label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as any)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-blue-900"
                  >
                    <option value="خروج للموقع">خروج للموقع (Outgoing to Project)</option>
                    <option value="دخول للورشة / المستودع">دخول للورشة / المستودع (Incoming to Depot)</option>
                    <option value="ترانزيت نقل ثقيل">ترانزيت نقل ثقيل (In-Transit)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم السائق / المشغل *</label>
                  <input
                    type="text"
                    required
                    value={driverNameAr}
                    onChange={(e) => setDriverNameAr(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رقم اللوحة المعدنية</label>
                  <input
                    type="text"
                    value={plateNo}
                    onChange={(e) => setPlateNo(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">وجهة المشروع / الموقع المستلم *</label>
                  <input
                    type="text"
                    required
                    value={targetProjectAr}
                    onChange={(e) => setTargetProjectAr(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">قراءة عداد الساعات (Hour Meter)</label>
                  <input
                    type="number"
                    value={hourMeter}
                    onChange={(e) => setHourMeter(Number(e.target.value))}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رقم تصريح الخروج / الشحن</label>
                  <input
                    type="text"
                    value={permitNo}
                    onChange={(e) => setPermitNo(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={safetyCheckPassed}
                    onChange={(e) => setSafetyCheckPassed(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>تم فحص السلامة الفنية ومستويات الزيوت وإطارات الشاحنة</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  تسجيل وطباعة تصريح البوابة
                </button>
              </div>
            </form>

            {/* Historical Gate Log Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">رقم التصريح</th>
                    <th className="py-3 px-4">الرافعة والموديل</th>
                    <th className="py-3 px-4">نوع الحركة</th>
                    <th className="py-3 px-4">السائق / المشغل</th>
                    <th className="py-3 px-4">وجهة المشروع</th>
                    <th className="py-3 px-4">التاريخ والوقت</th>
                    <th className="py-3 px-4 text-center">عداد الساعات</th>
                    <th className="py-3 px-4">مسؤول البوابة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {gateLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{log.logNo}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{log.craneModel}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            log.direction === 'خروج للموقع'
                              ? 'bg-amber-100 text-amber-800'
                              : log.direction === 'دخول للورشة / المستودع'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {log.direction}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800">{log.driverNameAr}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{log.targetProjectAr}</td>
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                        <div>{log.logTimestamp}</div>
                        <div className="text-[10px] text-amber-800 font-sans">{log.hijriDateFormatted}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 tabular-nums">
                        {log.hourMeter} ساعة
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{log.securityOfficerAr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Daily Breakdowns and Maintenance Log */}
        {activeTab === 'breakdowns' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">سجل وبلاغات الأعطال اليومية للرافعات</h3>
                <p className="text-xs text-slate-500">
                  متابعة بلاغات الأعطال الميكانيكية والهيدروليكية، قطع الغيار، ومراحل الصيانة
                </p>
              </div>

              <button
                onClick={() => setIsBreakdownModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>فتح بلاغ عطل جديد (+)</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">رقم البلاغ</th>
                    <th className="py-3 px-4">الرافعة وكودها</th>
                    <th className="py-3 px-4">نوع العطل</th>
                    <th className="py-3 px-4">درجة الخطورة</th>
                    <th className="py-3 px-4">الموقع والمشروع</th>
                    <th className="py-3 px-4">تاريخ الإبلاغ</th>
                    <th className="py-3 px-4">الفني المسؤول</th>
                    <th className="py-3 px-4">حالة الإصلاح</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {breakdownLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-red-700">{log.ticketNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{log.craneModel}</div>
                        <span className="font-mono text-[10px] text-slate-500">{log.craneCode}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">{log.breakdownType}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            log.severity.includes('حرج')
                              ? 'bg-red-100 text-red-800'
                              : log.severity.includes('متوسط')
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div>{log.projectAr}</div>
                        <div className="text-[10px] text-slate-400">{log.locationAr}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">{log.reportedTime}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{log.assignedTechnicianAr}</td>
                      <td className="py-3 px-4">
                        <select
                          value={log.status}
                          onChange={(e) => updateBreakdownStatus(log.id, e.target.value as any)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-800"
                        >
                          <option value="بلاغ جديد">بلاغ جديد</option>
                          <option value="قيد الفحص والإصلاح">قيد الفحص والإصلاح</option>
                          <option value="انتظار قطع الغيار">انتظار قطع الغيار</option>
                          <option value="تم الإصلاح والاختبار">تم الإصلاح والاختبار</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Breakdown Ticket */}
      {isBreakdownModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>تسجيل بلاغ عطل طارئ لرافعة (Breakdown Ticket)</span>
            </h3>

            <form onSubmit={handleCreateBreakdown} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الرافعة المتعطلة *</label>
                <select
                  value={bCraneCode}
                  onChange={(e) => setBCraneCode(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold"
                >
                  {operationsStatuses.map((s) => (
                    <option key={s.id} value={s.code}>
                      {s.code} - {s.craneModel} ({s.locationAr})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">نوع العطل الرئيسي</label>
                  <select
                    value={bType}
                    onChange={(e) => setBType(e.target.value as any)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="هيدروليك">هيدروليك وبساتم</option>
                    <option value="محرك وديزل">محرك وديزل</option>
                    <option value="ذراع التلسكوب/بوم">ذراع التلسكوب / بوم</option>
                    <option value="كهرباء وحساسات">كهرباء وحساسات LMI</option>
                    <option value="كابلات وبكرات">كابلات واير وبكرات</option>
                    <option value="تسريب زيوت">تسريب زيوت</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">شدة وخطورة العطل</label>
                  <select
                    value={bSeverity}
                    onChange={(e) => setBSeverity(e.target.value as any)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-red-800"
                  >
                    <option value="حرج (توقف كامل)">حرج (توقف كامل للرافعة)</option>
                    <option value="متوسط (تأثير جزئي)">متوسط (تأثير جزئي)</option>
                    <option value="بسيط (ملاحظة دورية)">بسيط (ملاحظة دورية)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المشروع</label>
                  <input
                    type="text"
                    value={bProject}
                    onChange={(e) => setBProject(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الموقع المحدد</label>
                  <input
                    type="text"
                    value={bLocation}
                    onChange={(e) => setBLocation(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الفني / المهندس المسؤول عن الإصلاح</label>
                <input
                  type="text"
                  value={bTechnician}
                  onChange={(e) => setBTechnician(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">قطع الغيار واللوازم المطلوبة فوراً</label>
                <textarea
                  rows={2}
                  value={bParts}
                  onChange={(e) => setBParts(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBreakdownModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
                >
                  تسجيل البلاغ ونقله للوحة التشغيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
