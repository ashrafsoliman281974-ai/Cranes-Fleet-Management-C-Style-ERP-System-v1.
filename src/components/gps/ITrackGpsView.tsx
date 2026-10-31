import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Activity,
  Layers,
  Clock,
  AlertTriangle,
  Upload,
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  Fuel,
  Compass,
  Search,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  INITIAL_ITRACK_TRACKERS,
  INITIAL_GPS_COMPARISONS,
} from '../../data/masterEnterpriseSeed';
import { ITrackTracker, GpsUsageLogComparison } from '../../types/erp';

export const ITrackGpsView: React.FC = () => {
  const { showToast } = useERP();

  const [activeTab, setActiveTab] = useState<'trackers' | 'reconciliation' | 'import' | 'settings'>('reconciliation');
  const [trackers, setTrackers] = useState<ITrackTracker[]>(INITIAL_ITRACK_TRACKERS);
  const [comparisons, setComparisons] = useState<GpsUsageLogComparison[]>(INITIAL_GPS_COMPARISONS);

  const handleSimulateSync = () => {
    showToast('تمت مزامنة تقارير أجهزة i-Track وتحديث ساعات عمل المحركات وربطها بمراكز التكلفة!');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <span>التشغيل والأسطول</span>
            <span>/</span>
            <span className="text-red-600">تكامل تتبع الأسطول i-Track بمراكز التكلفة</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Navigation className="w-6 h-6 text-red-600" />
            <span>ربط منظومة i-Track (GPS) بمراكز التكلفة وسجلات التشغيل بالساعة</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            استيراد تقارير ساعات تشغيل المحرك من GPS، مطابقتها مع سجلات التشغيل اليومية (Usage Logs)، وتحديث عدادات الصيانة الوقائية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateSync}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>مزامنة تقارير i-Track الآن</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>أجهزة تتبع GPS نشطة</span>
            <Navigation className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {trackers.length} أجهزة
          </div>
          <div className="text-[11px] text-slate-500">مربوطة بأسطول الأوناش والتريلات</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>ساعات تشغيل المحركات اليوم</span>
            <Clock className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-cyan-700 font-mono">
            23.5 ساعة
          </div>
          <div className="text-[11px] text-slate-500">مسجلة بحساسات الإشعال (Ignition ON)</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>مطابقة ساعات الفوترة</span>
            <CheckCircle className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-700 font-mono">
            96.2%
          </div>
          <div className="text-[11px] text-slate-500">تطابق سجل التشغيل مع الـ GPS</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>تنبيهات الفروقات والمراجعة</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            1 رافعة
          </div>
          <div className="text-[11px] text-amber-700 font-bold">فارق ساعات يستوجب مراجعة العميل</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'reconciliation'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>مطابقة ساعات المحرك (GPS) مع سجل التشغيل (Usage Log)</span>
        </button>

        <button
          onClick={() => setActiveTab('trackers')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'trackers'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>قائمة الأجهزة وربط مراكز التكلفة ({trackers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'import'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>معالج استيراد تقارير i-Track (Excel/CSV/PDF)</span>
        </button>
      </div>

      {/* Tab 1: Reconciliation Report */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                تقرير المقارنة الرقابية: ساعات تشغيل المحرك (GPS) مقابل الساعات المعتمدة للفوترة
              </h3>
              <p className="text-xs text-slate-500">
                دليل تدقيق هندسي يضمن دقة الفوترة بالساعة وكشف أي ساعات خمول أو تشغيل غير موثق بالموقع.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3">التاريخ</th>
                  <th className="py-2.5 px-3">كود وطراز الرافعة</th>
                  <th className="py-2.5 px-3">المشروع الميداني</th>
                  <th className="py-2.5 px-3">ساعات سجل التشغيل (المفوترة)</th>
                  <th className="py-2.5 px-3">ساعات محرك GPS (الفعلية)</th>
                  <th className="py-2.5 px-3">الفارق بالساعات</th>
                  <th className="py-2.5 px-3">نسبة الانحراف</th>
                  <th className="py-2.5 px-3">حالة التطابق الرقابي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono">{c.date}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{c.craneModel}</div>
                      <div className="text-[10px] font-mono text-slate-500">{c.craneCode}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">{c.projectAr}</td>
                    <td className="py-3 px-3 font-mono font-black text-slate-900">
                      {c.usageLogHours} ساعات
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">
                      {c.gpsEngineHours} ساعات
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={c.varianceHours > 0.5 ? 'text-amber-600' : 'text-slate-600'}>
                        {c.varianceHours} س
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      {c.variancePercentage}%
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          c.complianceStatus.includes('متطابق')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.complianceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Trackers List */}
      {activeTab === 'trackers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trackers.map((tracker) => (
            <div
              key={tracker.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-red-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-red-600" />
                  <h3 className="text-xs font-black text-slate-900">{tracker.deviceName}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {tracker.engineStatus}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">الرافعة:</span>
                  <span className="font-bold text-slate-800">{tracker.assignedCraneModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">مركز التكلفة:</span>
                  <span className="font-bold text-red-600">{tracker.effectiveCostCenterAr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">المشروع الساري:</span>
                  <span className="font-bold text-slate-800">{tracker.effectiveProjectAr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">آخر إحداثيات:</span>
                  <span className="font-mono text-[10px] text-slate-700" dir="ltr">{tracker.lastCoordinates}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">آخر إشارة: {tracker.lastGpsPing}</span>
                <span className="font-mono font-bold text-emerald-700">{tracker.todayEngineHours} ساعات عمل</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Report Import Wizard */}
      {activeTab === 'import' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900">معالج استيراد تقارير منصة i-Track</h3>
            <p className="text-xs text-slate-500">
              طبقة محولات تدعم استيراد تقارير الساعات والمسافات والوقود مع التعيين الآلي لمراكز التكلفة لكل سطر.
            </p>
          </div>

          <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-3 bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <div className="text-sm font-bold text-slate-800">اسحب وأفلت ملف تقرير i-Track هنا</div>
              <div className="text-xs text-slate-500 mt-0.5">يدعم صيغ Excel (.xlsx), CSV, أو PDF-جدول مع منع التكرار التلقائي (Checksum)</div>
            </div>
            <button
              onClick={() => showToast('تم سحب ملف i-Track ومعالجة 48 سطراً وربطها بمراكز التكلفة بنجاح!')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              استعراض الملفات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
