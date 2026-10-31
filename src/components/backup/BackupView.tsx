import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Shield,
  RefreshCw,
  HardDrive,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const BackupView: React.FC = () => {
  const { backups, createBackup, restoreBackup, showToast, t } = useERP();

  const [isRestoring, setIsRestoring] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [autoBackupFreq, setAutoBackupFreq] = useState<'daily' | 'weekly'>('daily');

  const handleCreateManualBackup = () => {
    createBackup('يدوي');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setIsRestoring(true);
        setTimeout(() => {
          const success = restoreBackup(content);
          setIsRestoring(false);
        }, 600);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('System Recovery', 'أمان واستعادة البيانات', 'System Recovery')}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
              نسخ احتياطي شامل
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-700" />
            <span>إدارة النسخ الاحتياطي واستعادة بيانات النظام (Backup & Restore)</span>
          </h1>
        </div>

        <button
          onClick={handleCreateManualBackup}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-95 transition-opacity"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <Download className="w-4 h-4" />
          <span>تنزيل نسخة احتياطية فورية (JSON)</span>
        </button>
      </div>

      {/* Action Cards: Create Backup & Restore Backup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Create Backup */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">إنشاء نسخة احتياطية فورية</h3>
              <p className="text-xs text-slate-500">
                تصدير لقطة كاملة من قيود اليومية، الفواتير، العقود، وسجلات الأوناش
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>تتضمن النسخة:</span>
            </div>
            <div className="pr-4 space-y-0.5 text-[11px] text-slate-500">
              <div>• كافة قيود اليومية المحاسبية ومراكز التكلفة</div>
              <div>• فواتير المبيعات وعقود تشغيل الأوناش وبنود الاشتراطات</div>
              <div>• سجلات بوابات الأوناش وحركات الدخول والخروج وبلاغات الأعطال</div>
              <div>• بيانات المستخدمين وقواعد الصلاحيات والترجمات الفورية</div>
            </div>
          </div>

          <button
            onClick={handleCreateManualBackup}
            className="w-full py-2.5 rounded-lg text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Download className="w-4 h-4" />
            <span>إنشاء وتنزيل ملف النسخة الآن</span>
          </button>
        </div>

        {/* Card 2: Restore from Backup */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">استعادة من ملف نسخة احتياطية</h3>
              <p className="text-xs text-slate-500">
                استرجاع بيانات النظام بالكامل من ملف نسخة احتياطية محفوظ سابقاً
              </p>
            </div>
          </div>

          <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all text-center">
            <Upload className="w-6 h-6 text-slate-400" />
            <div>
              <span className="text-xs font-bold text-blue-700">اضغط لرفع ملف النسخة الاحتياطية (JSON)</span>
              <p className="text-[10px] text-slate-400 mt-0.5">الملف يجب أن يكون بامتداد .json ومطابقاً لهيكل النظام</p>
            </div>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          {isRestoring && (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-700">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>جاري فحص واسترجاع البيانات...</span>
            </div>
          )}
        </div>
      </div>

      {/* Auto Backup Scheduling Settings */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              جدولة النسخ الاحتياطي التلقائي (Automated Scheduling)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            مفعّل تلقائياً
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={autoBackupEnabled}
              onChange={(e) => setAutoBackupEnabled(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span>تفعيل النسخ الاحتياطي التلقائي الدوري</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">التكرار:</span>
            <select
              value={autoBackupFreq}
              onChange={(e) => setAutoBackupFreq(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 font-bold text-slate-800"
            >
              <option value="daily">يومياً عند الساعة 02:00 صباحاً (Daily)</option>
              <option value="weekly">أسبوعياً كل يوم جمعة (Weekly)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Historical Backups Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            سجل النسخ الاحتياطية السابقة
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {backups.length} نسخ محفوظة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
              <tr>
                <th className="py-3 px-4">اسم ملف النسخة</th>
                <th className="py-3 px-4">تاريخ الإنشاء (ميلادي / هجري)</th>
                <th className="py-3 px-4 text-center">الحجم</th>
                <th className="py-3 px-4 text-center">عدد السجلات</th>
                <th className="py-3 px-4">نوع النسخ</th>
                <th className="py-3 px-4">المنشئ</th>
                <th className="py-3 px-4 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {backups.map((bk) => (
                <tr key={bk.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{bk.filename}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono text-slate-800">{bk.createdAt}</div>
                    <div className="text-[10px] text-amber-800">{bk.hijriCreatedAt}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    {bk.sizeKb} KB
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                    {bk.recordsCount} سجل
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bk.type === 'تلقائي مجدول'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {bk.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{bk.createdBy}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleCreateManualBackup()}
                      className="px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    >
                      تحميل ثانٍ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
