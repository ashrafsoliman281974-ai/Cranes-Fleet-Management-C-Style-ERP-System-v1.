import React, { useState } from 'react';
import {
  Users,
  Fingerprint,
  Camera,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle,
  AlertTriangle,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { INITIAL_BIOMETRIC_PUNCHES, INITIAL_PAYROLL_RUN } from '../../data/masterEnterpriseSeed';
import { tafqeetArabic } from '../../utils/tafqeet';

export const EmployeePortalView: React.FC = () => {
  const { setActiveView, showToast } = useERP();

  const [activeTab, setActiveTab] = useState<'attendance' | 'payslip' | 'leave-request'>('attendance');
  const [leaveDays, setLeaveDays] = useState(3);
  const [leaveReason, setLeaveReason] = useState('إجازة اعتيادية دورية بعد إنهاء وردية موقع الضبعة');

  const myPunches = INITIAL_BIOMETRIC_PUNCHES;
  const myPayroll = INITIAL_PAYROLL_RUN.employees[0]; // حمادة منصور حسنين

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('تم رفع طلب الإجازة بنجاح لرئيس العمليات ومسؤول الموارد البشرية!');
    setActiveTab('attendance');
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                بوابة الموظف والمشغل الميداني (Employee Self-Service)
              </h1>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                PWA Ready
              </span>
            </div>
            <p className="text-xs text-slate-500">
              مرحباً: <span className="font-bold text-slate-800">حمادة منصور حسنين</span> • مشغل رافعة 1200 طن (Liebherr Master)
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('workspace')}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للنظام</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'attendance'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          <span>سجل بصماتي وصوري اللحظية</span>
        </button>

        <button
          onClick={() => setActiveTab('payslip')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'payslip'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>قسيمة راتبي الشهري</span>
        </button>

        <button
          onClick={() => setActiveTab('leave-request')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'leave-request'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>طلب إجازة أو سلفة</span>
        </button>
      </div>

      {/* Tab 1: Attendance & Biometric Photos */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900">حركات الحضور والانصراف بالبصمة والصورة</h3>
              <p className="text-xs text-slate-500">مسجلة تلقائياً عبر بروتوكول ADMS من أجهزة المواقع</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
              رصيد الإجازات المتبقي: 18 يوماً
            </span>
          </div>

          <div className="space-y-3">
            {myPunches.map((punch) => (
              <div
                key={punch.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                    <img src={punch.photoUrl} alt="بصمة المشغل" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{punch.direction}</div>
                    <div className="text-[11px] text-slate-500">{punch.deviceNameAr}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{punch.timestamp}</div>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                  {punch.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Payslip */}
      {activeTab === 'payslip' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-black text-slate-900">قسيمة الراتب - شهر أكتوبر 2026</h3>
              <p className="text-xs text-slate-500">محسوبة طبقاً لساعات البصمة الميدانية وبدلات الموقع والمخاطر</p>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              معتمد ومحول للبنك ✓
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <span className="font-black text-emerald-900 block border-b border-emerald-200 pb-1">الاستحقاقات</span>
              <div className="flex justify-between"><span>الأساسي:</span><span className="font-mono font-bold">{myPayroll.basicSalary.toLocaleString()} ج.م</span></div>
              <div className="flex justify-between"><span>ساعات إضافية ({myPayroll.overtimeHours}س):</span><span className="font-mono font-bold">{myPayroll.overtimeAmount.toLocaleString()} ج.م</span></div>
              <div className="flex justify-between"><span>بدل موقع ومبيت:</span><span className="font-mono font-bold">{myPayroll.siteHardshipAllowance.toLocaleString()} ج.م</span></div>
              <div className="flex justify-between"><span>بدل مخاطر:</span><span className="font-mono font-bold">{myPayroll.hazardAllowance.toLocaleString()} ج.م</span></div>
            </div>

            <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-2">
              <span className="font-black text-red-900 block border-b border-red-200 pb-1">الاستقطاعات</span>
              <div className="flex justify-between"><span>تأمينات اجتماعية:</span><span className="font-mono font-bold">{myPayroll.socialInsuranceDeduction.toLocaleString()} ج.م</span></div>
              <div className="flex justify-between"><span>ضريبة كسب العمل:</span><span className="font-mono font-bold">{myPayroll.incomeTaxDeduction.toLocaleString()} ج.م</span></div>
              <div className="flex justify-between"><span>أقساط سلفة:</span><span className="font-mono font-bold">{myPayroll.advancesDeduction.toLocaleString()} ج.م</span></div>
            </div>
          </div>

          <div className="p-5 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">صافي الراتب المستلم:</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{myPayroll.netSalary.toLocaleString()} ج.م</span>
              <div className="text-[11px] text-slate-300 font-mono mt-1">{tafqeetArabic(myPayroll.netSalary)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Leave Request */}
      {activeTab === 'leave-request' && (
        <form onSubmit={handleApplyLeave} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900">تقديم طلب إجازة دورية أو سنوية</h3>
            <p className="text-xs text-slate-500">يصل الطلب مباشرة لمدير العمليات ومسؤول الورديات لاعتماد البديل</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">نوع الإجازة</label>
              <select className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold">
                <option>إجازة دورية بعد وردية الموقع</option>
                <option>إجازة اعتيادية سنوية</option>
                <option>إجازة عارضة / طارئة</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">عدد الأيام المطلوبة</label>
              <input
                type="number"
                value={leaveDays}
                onChange={(e) => setLeaveDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">سبب الإجازة والملاحظات</label>
            <textarea
              rows={3}
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-md"
          >
            إرسال طلب الإجازة
          </button>
        </form>
      )}
    </div>
  );
};
