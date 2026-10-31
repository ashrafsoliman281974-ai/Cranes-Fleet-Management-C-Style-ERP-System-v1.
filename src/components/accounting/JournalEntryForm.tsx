import React, { useState } from 'react';
import {
  BookOpen,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Printer,
  ArrowRight,
  AlertCircle,
  DollarSign,
  Building,
  Send,
  XCircle,
  ShieldCheck,
  UserCheck,
  Truck,
  Briefcase,
  MapPin,
  Layers,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { JournalEntry, JournalEntryLine } from '../../types/erp';
import { HijriDatePicker } from '../datepicker/HijriDatePicker';
import { tafqeetArabic, tafqeetEnglish } from '../../utils/tafqeet';

interface JournalEntryFormProps {
  entry?: JournalEntry | null;
  onBack?: () => void;
}

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ entry, onBack }) => {
  const {
    saveJournalEntry,
    submitJournalEntryForApproval,
    approveJournalEntry,
    rejectJournalEntry,
    costCenters,
    fleet,
    currentUser,
    setActiveView,
    showToast,
    t,
  } = useERP();

  const [id, setId] = useState<string>(entry?.id || '');
  const [entryNo, setEntryNo] = useState<string>(entry?.entryNo || '');
  const [postingDate, setPostingDate] = useState<string>(entry?.postingDate || '2026-07-26');
  const [entryType, setEntryType] = useState<JournalEntry['entryType']>(entry?.entryType || 'قيد يومية عام');
  const [currency, setCurrency] = useState<'EGP' | 'SAR' | 'USD'>(entry?.currency || 'EGP');
  const [status, setStatus] = useState<JournalEntry['status']>(entry?.status || 'مسودة');
  const [remarksAr, setRemarksAr] = useState<string>(
    entry?.remarksAr || 'إثبات مصروفات تشغيل وصيانة أسطول رافعات الموقع'
  );
  const [costCenterAr, setCostCenterAr] = useState<string>(
    entry?.costCenterAr || (costCenters[0]?.nameAr || '')
  );

  const [lines, setLines] = useState<JournalEntryLine[]>(
    entry?.lines && entry.lines.length > 0
      ? entry.lines
      : [
          {
            id: 'line-1',
            accountAr: '5120 - مصروفات تشغيل ووقود أوناش الموقع',
            accountEn: '5120 - Crane Site Fuel & Lubricants',
            debit: 185000,
            credit: 0,
            costCenterAr: costCenters[0]?.nameAr || 'مشروع حقل ظهر للغاز الطبيعي',
            dimensionLevel: 'مشروع',
            linkedEquipment: 'Liebherr LTM 1500-8.1 (500 Ton)',
            linkedClient: 'شركة بترول بلاعيم (بتروبل)',
            linkedProject: 'مشروع حقل ظهر للغاز الطبيعي',
            partyNameAr: 'شركة مصر للبترول',
            lineRemark: 'سولار وزيوت هيدروليك للرافعات',
          },
          {
            id: 'line-2',
            accountAr: '1110 - البنك الأهلي المصري - حساب إيجيبت كرينز',
            accountEn: '1110 - National Bank of Egypt',
            debit: 0,
            credit: 185000,
            costCenterAr: costCenters[0]?.nameAr || 'مشروع حقل ظهر للغاز الطبيعي',
            partyNameAr: 'البنك الأهلي',
            lineRemark: 'شيك سداد مسحوبات وقود ديزل',
          },
        ]
  );

  const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference === 0 && totalDebit > 0;

  const wordsAr = tafqeetArabic(totalDebit, currency);
  const wordsEn = tafqeetEnglish(totalDebit, currency);

  const handleUpdateLine = (index: number, field: keyof JournalEntryLine, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const handleAddLine = () => {
    const newLine: JournalEntryLine = {
      id: `line-${Date.now()}`,
      accountAr: '5210 - مصروفات صيانة وإصلاح الرافعات',
      accountEn: '5210 - Crane Maintenance & Repairs',
      debit: 0,
      credit: 0,
      costCenterAr: costCenterAr,
      dimensionLevel: 'معدة/سيارة',
      lineRemark: '',
    };
    setLines([...lines, newLine]);
  };

  const handleDeleteLine = (index: number) => {
    if (lines.length <= 2) {
      showToast('يجب أن يحتوي القيد على طرفين على الأقل (طرف مدين وطرف دائن)');
      return;
    }
    setLines(lines.filter((_, i) => i !== index));
  };

  // Save Draft
  const handleSaveDraft = () => {
    const saved = saveJournalEntry({
      id: id || undefined,
      entryNo: entryNo || undefined,
      postingDate,
      entryType,
      currency,
      status: status === 'معتمد ومرحل' ? status : 'مسودة',
      remarksAr,
      costCenterAr,
      lines,
    });
    setId(saved.id);
    setEntryNo(saved.entryNo);
    setStatus(saved.status);
  };

  // Submit for Approval (Maker flow)
  const handleSubmitForApproval = () => {
    if (!isBalanced) {
      showToast('خطأ: لا يمكن إرسال القيد للاعتماد لأن مجموع المدين لا يساوي مجموع الدائن!');
      return;
    }
    const saved = saveJournalEntry({
      id: id || undefined,
      entryNo: entryNo || undefined,
      postingDate,
      entryType,
      currency,
      status: 'بانتظار الاعتماد',
      remarksAr,
      costCenterAr,
      lines,
    });
    setId(saved.id);
    setEntryNo(saved.entryNo);
    submitJournalEntryForApproval(saved.id);
    setStatus('بانتظار الاعتماد');
    if (onBack) onBack();
    else setActiveView('journals');
  };

  // Direct Approve & Post (Approver flow)
  const handleDirectApprove = () => {
    if (!isBalanced) {
      showToast('خطأ: لا يمكن اعتماد القيد لأن مجموع المدين لا يساوي مجموع الدائن!');
      return;
    }
    const saved = saveJournalEntry({
      id: id || undefined,
      entryNo: entryNo || undefined,
      postingDate,
      entryType,
      currency,
      status: 'بانتظار الاعتماد',
      remarksAr,
      costCenterAr,
      lines,
    });
    setId(saved.id);
    setEntryNo(saved.entryNo);
    approveJournalEntry(saved.id);
    setStatus('معتمد ومرحل');
    if (onBack) onBack();
    else setActiveView('journals');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('Journal Entry', 'قيد يومية محاسبي', 'Journal Entry')}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  status === 'معتمد ومرحل'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'بانتظار الاعتماد'
                    ? 'bg-amber-100 text-amber-800'
                    : status === 'مرفوض'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {status}
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 font-mono tracking-tight">
              {entryNo || 'قيد يومية جديد (New Journal Voucher)'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة القيد</span>
          </button>

          {/* Maker action: Submit for Approval */}
          {status !== 'معتمد ومرحل' && !currentUser.canApproveFinance && (
            <button
              onClick={handleSubmitForApproval}
              disabled={!isBalanced}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-xs transition-colors ${
                isBalanced
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-slate-300 cursor-not-allowed text-slate-500'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال للاعتماد المالي (Submit for Approval)</span>
            </button>
          )}

          {/* Approver action: Approve & Post */}
          {status !== 'معتمد ومرحل' && currentUser.canApproveFinance && (
            <button
              onClick={handleDirectApprove}
              disabled={!isBalanced}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-xs transition-colors ${
                isBalanced
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-300 cursor-not-allowed text-slate-500'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>اعتماد وترحيل لدفتر الأستاذ (Approve & Post)</span>
            </button>
          )}

          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-xs transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ كمسودة (Save Draft)</span>
          </button>
        </div>
      </div>

      {/* Maker vs Approver Notice */}
      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span>
            المستخدم الحالي: <strong>{currentUser.nameAr}</strong> ({currentUser.roleAr}) -{' '}
            {currentUser.canApproveFinance ? (
              <span className="text-emerald-700 font-bold">لديك صلاحية اعتماد وترحيل القيود</span>
            ) : (
              <span className="text-amber-800 font-bold">صلاحية كاتب قيد (يتطلب اعتماد المدير المالي)</span>
            )}
          </span>
        </div>
        <button
          onClick={() => setActiveView('journals')}
          className="text-xs text-indigo-700 font-bold hover:underline"
        >
          العودة لسجل القيود
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Posting Date with Hijri Badge */}
          <div>
            <HijriDatePicker
              label="تاريخ الترحيل المحاسبي (Posting Date)"
              required
              value={postingDate}
              onChange={(iso) => setPostingDate(iso)}
            />
          </div>

          {/* Entry Type */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">نوع القيد المحاسبي</label>
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as any)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
            >
              <option value="قيد يومية عام">قيد يومية عام (General Journal)</option>
              <option value="قيد افتتاحي">قيد افتتاحي (Opening Entry)</option>
              <option value="قيد تسوية">قيد تسوية (Adjustment Entry)</option>
              <option value="قيد بنكي / تحويل">قيد بنكي / تحويل (Bank / Cash Transfer)</option>
            </select>
          </div>

          {/* Cost Center */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">مركز التكلفة الافتراضي للمشروع</label>
            <select
              value={costCenterAr}
              onChange={(e) => setCostCenterAr(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
            >
              {costCenters.map((cc) => (
                <option key={cc.id} value={cc.nameAr}>
                  {cc.code} - {cc.nameAr} ({cc.level})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">البيان العام والملاحظات المحاسبية</label>
          <input
            type="text"
            value={remarksAr}
            onChange={(e) => setRemarksAr(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-medium"
          />
        </div>

        {/* Multi-line Debit/Credit Table */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              أطراف القيد المحاسبي والأبعاد التحليلية (Journal Entry Lines & Dimensions)
            </h3>
            <button
              onClick={handleAddLine}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة طرف محاسبي (+)</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center">#</th>
                    <th className="py-3 px-3">الحساب المحاسبي (Account)</th>
                    <th className="py-3 px-3">مركز التكلفة / البعد</th>
                    <th className="py-3 px-3">المعدة / العميل / المشروع</th>
                    <th className="py-3 px-3 text-left w-36">مدين (Debit)</th>
                    <th className="py-3 px-3 text-left w-36">دائن (Credit)</th>
                    <th className="py-3 px-3">شرح الطرف التحليلي</th>
                    <th className="py-3 px-3 w-12 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {lines.map((line, index) => (
                    <tr key={line.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-bold">
                        {index + 1}
                      </td>

                      {/* Account */}
                      <td className="py-2.5 px-3 min-w-[200px]">
                        <input
                          type="text"
                          value={line.accountAr}
                          onChange={(e) => handleUpdateLine(index, 'accountAr', e.target.value)}
                          placeholder="مثال: 5120 - مصروفات تشغيل ووقود"
                          className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:bg-white"
                        />
                      </td>

                      {/* Cost Center */}
                      <td className="py-2.5 px-3 min-w-[170px]">
                        <select
                          value={line.costCenterAr || ''}
                          onChange={(e) => handleUpdateLine(index, 'costCenterAr', e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:bg-white"
                        >
                          <option value="">-- اختياري --</option>
                          {costCenters.map((cc) => (
                            <option key={cc.id} value={cc.nameAr}>
                              {cc.code} - {cc.nameAr}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Linked Crane or Client */}
                      <td className="py-2.5 px-3 min-w-[160px]">
                        <input
                          type="text"
                          value={line.linkedEquipment || line.linkedClient || ''}
                          onChange={(e) => handleUpdateLine(index, 'linkedEquipment', e.target.value)}
                          placeholder="الرافعة أو العميل المرتبط..."
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:bg-white"
                        />
                      </td>

                      {/* Debit */}
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={line.debit || ''}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            handleUpdateLine(index, 'debit', val);
                            if (val > 0) handleUpdateLine(index, 'credit', 0);
                          }}
                          className="w-full text-xs font-mono font-bold text-left bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:bg-white text-slate-900"
                        />
                      </td>

                      {/* Credit */}
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={line.credit || ''}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            handleUpdateLine(index, 'credit', val);
                            if (val > 0) handleUpdateLine(index, 'debit', 0);
                          }}
                          className="w-full text-xs font-mono font-bold text-left bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:bg-white text-slate-900"
                        />
                      </td>

                      {/* Remark */}
                      <td className="py-2.5 px-3 min-w-[160px]">
                        <input
                          type="text"
                          value={line.lineRemark || ''}
                          onChange={(e) => handleUpdateLine(index, 'lineRemark', e.target.value)}
                          placeholder="ملاحظة الطرف..."
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:bg-white"
                        />
                      </td>

                      {/* Delete */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteLine(index)}
                          className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                          title="حذف هذا الطرف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Table Footer: Totals and Difference */}
                <tfoot className="bg-slate-50/90 border-t border-slate-300 font-bold text-xs">
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-left font-sans">
                      إجمالي أطراف القيد (Totals):
                    </td>
                    <td className="py-3 px-3 font-mono font-black text-left text-slate-900 text-sm">
                      {totalDebit.toLocaleString()} {currency}
                    </td>
                    <td className="py-3 px-3 font-mono font-black text-left text-slate-900 text-sm">
                      {totalCredit.toLocaleString()} {currency}
                    </td>
                    <td colSpan={2} className="py-3 px-3 text-center">
                      {difference === 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>القيد متوازن تماماً</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-800 bg-red-100 px-2 py-0.5 rounded-full font-bold text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                          <span>فارق: {difference.toLocaleString()} {currency}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Bilingual Amount In Words (Tafqeet) */}
        <div className="bg-gradient-to-r from-slate-50 to-amber-50/40 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-slate-800">
              التفقيط المالي التلقائي (Amount in Words):
            </span>
          </div>

          <div className="text-xs leading-relaxed text-slate-800 font-bold">
            <span className="text-slate-500 font-normal">بالعربية: </span>
            {wordsAr}
          </div>

          <div className="text-xs leading-relaxed font-sans text-slate-700">
            <span className="text-slate-500 font-normal font-sans">In English: </span>
            {wordsEn}
          </div>
        </div>
      </div>
    </div>
  );
};
