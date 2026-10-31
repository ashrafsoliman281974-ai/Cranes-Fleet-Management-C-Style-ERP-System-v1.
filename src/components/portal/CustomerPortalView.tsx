import React, { useState } from 'react';
import {
  Users,
  FileSignature,
  Clock,
  CreditCard,
  CheckCircle,
  FileText,
  Truck,
  Plus,
  ShieldCheck,
  Calendar,
  PenTool,
  Printer,
  ChevronDown,
  ArrowRight,
  Send,
  Building2,
  Lock,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { tafqeetArabic } from '../../utils/tafqeet';

export const CustomerPortalView: React.FC = () => {
  const { invoices, contracts, showToast, setActiveView } = useERP();

  const [activeTab, setActiveTab] = useState<'overview' | 'usage-logs' | 'contracts' | 'invoices' | 'new-request'>('usage-logs');

  // Customer daily usage logs requiring customer approval
  const [usageLogs, setUsageLogs] = useState([
    {
      id: 'ulog-01',
      date: '2026-10-30',
      craneModel: 'Liebherr LTM 11200-9.1 (1200 Ton)',
      plateOrCode: 'CRN-1200T-01',
      projectAr: 'محطة الضبعة النووية - وحدة المفاعل 1',
      operatorNameAr: 'حمادة منصور حسنين',
      startCounter: 4210.5,
      endCounter: 4219.0,
      totalHours: 8.5,
      standbyHours: 1.0,
      overtimeHours: 1.5,
      billableHours: 9.0,
      workDescriptionAr: 'رفع وتثبيت الحلقة الدائرية الثقيلة لغرفة الاحتواء، وزن القطعة 140 طن.',
      status: 'بانتظار اعتماد وتوقيع العميل',
      clientSignedBy: '',
      signedAt: '',
    },
    {
      id: 'ulog-02',
      date: '2026-10-29',
      craneModel: 'Liebherr LTM 11200-9.1 (1200 Ton)',
      plateOrCode: 'CRN-1200T-01',
      projectAr: 'محطة الضبعة النووية - وحدة المفاعل 1',
      operatorNameAr: 'حمادة منصور حسنين',
      startCounter: 4202.0,
      endCounter: 4210.5,
      totalHours: 8.5,
      standbyHours: 0,
      overtimeHours: 0.5,
      billableHours: 8.5,
      workDescriptionAr: 'تجهيز وتجميع ذراع التلسكوب والأثقال الموازنة 160 طن بموقع العمل.',
      status: 'معتمد وموقع إلكترونياً ✓',
      clientSignedBy: 'م. حسام الدين عبد الرحيم',
      signedAt: '2026-10-29 18:30',
    },
  ]);

  const [signingLogId, setSigningLogId] = useState<string | null>(null);
  const [signerName, setSignerName] = useState('م. حسام الدين عبد الرحيم (ممثل المقاول العام)');

  const handleSignUsageLog = (logId: string) => {
    setUsageLogs(
      usageLogs.map((log) => {
        if (log.id !== logId) return log;
        return {
          ...log,
          status: 'معتمد وموقع إلكترونياً ✓',
          clientSignedBy: signerName,
          signedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        };
      })
    );
    setSigningLogId(null);
    showToast('تم توقيع واعتماد ساعات سجل التشغيل إلكترونياً وقفله للفوترة!');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <span>البوابة الرقمية الموحدة</span>
            <span>/</span>
            <span className="text-red-600">بوابة العملاء والمشروعات (Client Portal)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-red-600" />
            <span>بوابة عملاء إيجيبت كرينز • متابعة التشغيل واعتماد الساعات</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            مرحباً بشركة المقاولون العرب / أوراسكوم. تتيح لك البوابة اعتماد ساعات العمل اليومية وتتبع عقودك وفواتيرك.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('workspace')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى لوحة التحكم الرئيسية</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('usage-logs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'usage-logs'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>سجلات التشغيل اليومية واعتماد الساعات (Usage Logs)</span>
        </button>

        <button
          onClick={() => setActiveTab('contracts')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'contracts'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSignature className="w-4 h-4" />
          <span>عقود التأجير السارية ({contracts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'invoices'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>فواتير الساعات وكشوف الحساب ({invoices.length})</span>
        </button>
      </div>

      {/* Tab 1: Usage Logs */}
      {activeTab === 'usage-logs' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                سجلات التشغيل اليومية للرافعات العاملة بمشروعك (Usage Logs)
              </h3>
              <p className="text-xs text-slate-500">
                قرار معتمد: الفوترة تتم من الساعات المعتمدة بتوقيعك الإلكتروني على الشاشة. السجل المقفل لا يُعدل.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {usageLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-red-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{log.craneModel}</h4>
                      <p className="text-xs text-slate-500">{log.projectAr} • المشغل: {log.operatorNameAr}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-700">التاريخ: {log.date}</span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        log.status.includes('معتمد')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3.5 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">عداد البداية / النهاية:</span>
                    <span className="font-mono font-bold text-slate-800">{log.startCounter} → {log.endCounter}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">إجمالي ساعات التشغيل:</span>
                    <span className="font-mono font-bold text-slate-800">{log.totalHours} ساعات</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ساعات انتظار / إضافي:</span>
                    <span className="font-mono text-slate-800">{log.standbyHours} س انتظار • {log.overtimeHours} س إضافي</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">الساعات المفوترة المعتمدة:</span>
                    <span className="font-mono font-black text-red-600 text-sm">{log.billableHours} ساعات</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">الأعمال المنفذة بالموقع:</span>
                  {log.workDescriptionAr}
                </p>

                {/* Sign-off Area */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  {log.status.includes('معتمد') ? (
                    <div className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle className="w-4 h-4" />
                      <span>تم الاعتماد بواسطة: {log.clientSignedBy} في ({log.signedAt})</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSigningLogId(log.id)}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <PenTool className="w-4 h-4" />
                      <span>توقيع واعتماد ساعات هذا اليوم</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Digital Signature Pad Modal */}
          {signingLogId && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-300 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900">اعتماد وتوقيع ساعات التشغيل</h3>
                  <button onClick={() => setSigningLogId(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">×</button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">اسم ممثل العميل الموقع</label>
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  {/* Visual Signature Canvas Pad */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">التوقيع الإلكتروني على الشاشة</label>
                    <div className="h-28 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 font-mono text-xs">
                      [ منطقة التوقيع الرقمي باللمس والماوس معتمدة قانونياً ]
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setSigningLogId(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
                    إلغاء
                  </button>
                  <button
                    onClick={() => handleSignUsageLog(signingLogId)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md cursor-pointer"
                  >
                    اعتماد الساعات وإقفال السجل
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Contracts */}
      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((contract) => (
            <div key={contract.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                  {contract.contractNo}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {contract.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{contract.projectNameAr}</h3>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                <div>الرافعة: <span className="font-bold text-slate-800">{contract.craneModel} ({contract.craneCapacityTon} طن)</span></div>
                <div>المدة: <span className="font-mono">{contract.startDate} → {contract.endDate}</span></div>
                <div>القيمة: <span className="font-mono font-black text-slate-900">{contract.rateAmount.toLocaleString()} {contract.currency} / {contract.rateType}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3">رقم الفاتورة</th>
                  <th className="py-2.5 px-3">التاريخ</th>
                  <th className="py-2.5 px-3">الإجمالي الشامل</th>
                  <th className="py-2.5 px-3">المدفوع</th>
                  <th className="py-2.5 px-3">المتبقي المستحق</th>
                  <th className="py-2.5 px-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                    <td className="py-3 px-3 font-mono">{inv.postingDate}</td>
                    <td className="py-3 px-3 font-mono font-black text-slate-900">{inv.grandTotal.toLocaleString()} ج.م</td>
                    <td className="py-3 px-3 font-mono text-emerald-700">{inv.paidAmount.toLocaleString()} ج.م</td>
                    <td className="py-3 px-3 font-mono font-bold text-red-600">{inv.outstandingAmount.toLocaleString()} ج.م</td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
