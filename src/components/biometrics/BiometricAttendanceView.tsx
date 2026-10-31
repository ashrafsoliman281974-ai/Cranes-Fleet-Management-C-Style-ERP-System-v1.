import React, { useState } from 'react';
import {
  Fingerprint,
  Camera,
  Wifi,
  WifiOff,
  QrCode,
  ShieldAlert,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
  Plus,
  AlertTriangle,
  Eye,
  Download,
  Printer,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  INITIAL_BIOMETRIC_DEVICES,
  INITIAL_BIOMETRIC_PUNCHES,
  INITIAL_ATTENDANCE_EXCEPTIONS,
} from '../../data/masterEnterpriseSeed';
import { BiometricDevice, BiometricPunch, AttendanceExceptionItem } from '../../types/erp';

export const BiometricAttendanceView: React.FC = () => {
  const { showToast } = useERP();

  const [activeTab, setActiveTab] = useState<'devices' | 'punches' | 'gallery' | 'exceptions' | 'wizard'>('devices');
  const [devices, setDevices] = useState<BiometricDevice[]>(INITIAL_BIOMETRIC_DEVICES);
  const [punches, setPunches] = useState<BiometricPunch[]>(INITIAL_BIOMETRIC_PUNCHES);
  const [exceptions, setExceptions] = useState<AttendanceExceptionItem[]>(INITIAL_ATTENDANCE_EXCEPTIONS);

  // Simulator state
  const [simulatingDevice, setSimulatingDevice] = useState('bio-dev-01');
  const [simulatingPin, setSimulatingPin] = useState('1001');
  const [simulatingDirection, setSimulatingDirection] = useState<'دخول (Check-In)' | 'خروج (Check-Out)'>('دخول (Check-In)');

  const handleSimulatePunch = () => {
    const dev = devices.find((d) => d.id === simulatingDevice) || devices[0];
    const newPunch: BiometricPunch = {
      id: `punch-${Date.now()}`,
      deviceId: dev.id,
      deviceNameAr: dev.deviceNameAr,
      userPin: simulatingPin,
      employeeNameAr: simulatingPin === '1001' ? 'حمادة منصور حسنين' : 'مشغل معتمد',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      direction: simulatingDirection,
      verifyType: 'بصمة وجه + صورة',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      costCenterAr: dev.assignedCostCenterAr,
      projectAr: dev.assignedProjectAr,
      status: 'معتمد',
    };

    setPunches([newPunch, ...punches]);
    showToast(`تم استقبال بصمة دفع حية (Push ADMS) بنجاح عبر بروتوكول iClock من الجهاز ${dev.serialNumber}!`);
  };

  const handleResolveException = (excId: string) => {
    setExceptions(
      exceptions.map((e) =>
        e.id === excId ? { ...e, status: 'تم التصحيح والاعتماد', resolvedByAr: 'المهندس أمير مانسي' } : e
      )
    );
    showToast('تم تصحيح استثناء الحضور واعتماده وربطه بمسير المرتبات');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <span>الموارد البشرية والعمليات</span>
            <span>/</span>
            <span className="text-red-600">أجهزة البصمة البيومترية المتصلة بالإنترنت (ADMS Push)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Fingerprint className="w-6 h-6 text-red-600" />
            <span>منظومة الحضور اللحظي بالبصمة والصورة (ADMS / iClock Push Protocol)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ربط أجهزة البصمة بالمستودع والمواقع الميدانية (الضبعة، العاصمة الإدارية)، سحب البصمات والصور لحظياً، ومعالجة الاستثناءات.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('wizard')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-md"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>معالج ربط جهاز جديد (Setup Wizard)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>الأجهزة المتصلة أونلاين</span>
            <Wifi className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {devices.filter((d) => d.isOnline).length} / {devices.length} أجهزة
          </div>
          <div className="text-[11px] text-slate-500 font-mono">ADMS Heartbeat: Active</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>بصمات مسجلة اليوم</span>
            <Fingerprint className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-cyan-700 font-mono">
            106 بصمة
          </div>
          <div className="text-[11px] text-slate-500">من كافة المواقع والمستودعات</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>صور الحضور الميداني</span>
            <Camera className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-700 font-mono">
            100% موثقة
          </div>
          <div className="text-[11px] text-slate-500">خاصية ATTPHOTO مفعلة</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>استثناءات تحتاج مراجعة</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {exceptions.filter((e) => e.status === 'بانتظار المعالجة').length} استثناء
          </div>
          <div className="text-[11px] text-amber-700 font-bold">بصمات خروج ناقصة وتأخير</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'devices'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>الأجهزة الميدانية وحالة الاتصال ({devices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'gallery'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>معرض صور الحضور بالبصمة (Photo Stream)</span>
        </button>

        <button
          onClick={() => setActiveTab('punches')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'punches'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>سجل البصمات اللحظي (Raw & Processed)</span>
        </button>

        <button
          onClick={() => setActiveTab('exceptions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'exceptions'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>شاشة استثناءات الحضور ({exceptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wizard')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'wizard'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>معالج التوصيل وخطوات الـ ADMS</span>
        </button>
      </div>

      {/* Simulator Strip */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-slate-700">
        <div className="flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <div className="text-xs font-black">محاكي إرسال بصمة ADMS حية (ADMS Protocol Simulator)</div>
            <div className="text-[11px] text-slate-400">لاختبار استقبال نبضات الحضور والصور اللحظية من أجهزة ZKTeco دون الحاجة لجهاز فيزيائي</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={simulatingDevice}
            onChange={(e) => setSimulatingDevice(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-xs font-bold text-slate-200"
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>{d.deviceNameAr}</option>
            ))}
          </select>

          <button
            onClick={handleSimulatePunch}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Fingerprint className="w-4 h-4" />
            <span>بث بصمة + صورة تجريبية</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Devices */}
      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {devices.map((dev) => (
            <div
              key={dev.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-red-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
                    <Fingerprint className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">{dev.deviceNameAr}</h3>
                    <p className="text-[10px] font-mono text-slate-500">{dev.model}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>متصل (Online)</span>
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">الرقم التسلسلي (SN):</span>
                  <span className="font-mono font-bold text-slate-800">{dev.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">البروتوكول:</span>
                  <span className="font-bold text-red-600">{dev.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">مركز التكلفة المرتبط:</span>
                  <span className="font-bold text-slate-800">{dev.assignedCostCenterAr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IP الجهاز:</span>
                  <span className="font-mono text-slate-800">{dev.ipAddress}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">نبضة الحياة: {dev.lastHeartbeat}</span>
                <span className="font-mono font-bold text-emerald-700">{dev.totalPunchesToday} بصمة اليوم</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Attendance Photo Gallery */}
      {activeTab === 'gallery' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                معرض صور الحضور اللحظي بالكاميرا (ATTPHOTO Live Gallery)
              </h3>
              <p className="text-xs text-slate-500">
                يتم التقاط صورة لحظية لكل مشغل وفني فور ملامسة البصمة، مع سياسة احتفاظ 90 يوماً متوافقة مع الخصوصية.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">سياسة الاحتفاظ: 90 يوماً</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {punches.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-center hover:border-red-400 transition-all shadow-xs"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 relative">
                  {p.photoUrl ? (
                    <img src={p.photoUrl} alt={p.employeeNameAr} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-white">
                    {p.timestamp.slice(11, 16)}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 truncate">{p.employeeNameAr}</h4>
                  <div className="text-[10px] text-slate-500 font-mono">PIN: {p.userPin}</div>
                  <span className="text-[10px] font-bold text-emerald-700 block mt-1">{p.direction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Punches Stream */}
      {activeTab === 'punches' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3">التوقيت والتاريخ</th>
                  <th className="py-2.5 px-3">اسم الموظف / المشغل</th>
                  <th className="py-2.5 px-3">رقم PIN</th>
                  <th className="py-2.5 px-3">نوع الحركة</th>
                  <th className="py-2.5 px-3">طريقة التحقق</th>
                  <th className="py-2.5 px-3">جهاز البصمة</th>
                  <th className="py-2.5 px-3">مركز التكلفة والمشروع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {punches.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{p.timestamp}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{p.employeeNameAr}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{p.userPin}</td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {p.direction}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{p.verifyType}</td>
                    <td className="py-3 px-3 text-slate-600">{p.deviceNameAr}</td>
                    <td className="py-3 px-3 font-bold text-slate-700">{p.costCenterAr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Exceptions */}
      {activeTab === 'exceptions' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-3">
            {exceptions.map((exc) => (
              <div
                key={exc.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                      {exc.exceptionType}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{exc.employeeNameAr}</h4>
                    <span className="text-slate-400 font-mono">PIN: {exc.userPin}</span>
                  </div>
                  <p className="text-slate-600">{exc.detailsAr}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {exc.status === 'بانتظار المعالجة' ? (
                    <button
                      onClick={() => handleResolveException(exc.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer transition-all shadow-xs"
                    >
                      اعتماد وتصحيح الحضور
                    </button>
                  ) : (
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                      {exc.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Setup Wizard */}
      {activeTab === 'wizard' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">معالج توصيل أجهزة ZKTeco بتقنية ADMS Push</h3>
            <p className="text-xs text-slate-500 mt-1">
              أدخل هذه الإعدادات مباشرة في قائمة إعدادات السحابة (Cloud Server / ADMS Settings) داخل شاشة جهاز البصمة بالموقع.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 block">عنوان خادم السحابة (Cloud Server IP / Domain):</span>
                <div className="font-mono font-black text-sm text-red-600 bg-white p-2.5 rounded-lg border border-slate-300" dir="ltr">
                  attendance.egyptcranes.com
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 block">منفذ الاتصال الآمن (Server Port):</span>
                <div className="font-mono font-black text-sm text-slate-900 bg-white p-2.5 rounded-lg border border-slate-300" dir="ltr">
                  443 (HTTPS) أو 8080 (HTTP)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 block">مفتاح الاتصال المشفر (Comm Key):</span>
                <div className="font-mono font-black text-sm text-slate-900 bg-white p-2.5 rounded-lg border border-slate-300" dir="ltr">
                  CRN_ADMS_SECURE_2026
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-28 h-28 bg-white p-2 rounded-2xl shadow-xl">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://attendance.egyptcranes.com/setup?key=CRN_ADMS_SECURE_2026"
                  alt="Device Setup QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-300">مسح الإعدادات عبر الباركود (QR Code)</h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  امسح الرمز بكاميرا الجهاز أو تطبيق الفنيين للمزامنة التلقائية لبيانات السيرفر وتفعيل رفع الصور فورياً.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
