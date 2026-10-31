import React, { useState } from 'react';
import {
  FileSignature,
  Save,
  CheckCircle,
  Printer,
  ArrowRight,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  Calendar,
  Building,
  Truck,
  Fuel,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { CraneContract, ContractTermClause } from '../../types/erp';
import { HijriDatePicker } from '../datepicker/HijriDatePicker';
import { STANDARD_CONTRACT_CLAUSES } from '../../data/initialData';
import { tafqeetArabic, tafqeetEnglish } from '../../utils/tafqeet';

interface ContractFormProps {
  contract?: CraneContract | null;
  onBack?: () => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({ contract, onBack }) => {
  const { saveContract, fleet, showToast, t } = useERP();

  const [id, setId] = useState<string>(contract?.id || '');
  const [contractNo, setContractNo] = useState<string>(contract?.contractNo || '');
  const [clientNameAr, setClientNameAr] = useState<string>(
    contract?.clientNameAr || 'شركة المقاولات الهندسية الحديثة'
  );
  const [projectNameAr, setProjectNameAr] = useState<string>(
    contract?.projectNameAr || 'مشروع البرج الأيقوني - العاصمة الإدارية'
  );
  const [craneModel, setCraneModel] = useState<string>(
    contract?.craneModel || 'Liebherr LTM 1500-8.1 (500 Ton)'
  );
  const [craneCapacityTon, setCraneCapacityTon] = useState<number>(contract?.craneCapacityTon || 500);
  const [startDate, setStartDate] = useState<string>(contract?.startDate || '2026-07-26');
  const [endDate, setEndDate] = useState<string>(contract?.endDate || '2026-09-26');
  const [rateType, setRateType] = useState<CraneContract['rateType']>(contract?.rateType || 'شهري');
  const [rateAmount, setRateAmount] = useState<number>(contract?.rateAmount || 650000);
  const [mobilizationFee, setMobilizationFee] = useState<number>(contract?.mobilizationFee || 120000);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>(contract?.currency || 'EGP');
  const [status, setStatus] = useState<CraneContract['status']>(contract?.status || 'ساري');
  const [operatorIncluded, setOperatorIncluded] = useState<boolean>(contract?.operatorIncluded ?? true);
  const [fuelIncluded, setFuelIncluded] = useState<boolean>(contract?.fuelIncluded ?? false);

  // Clauses
  const [terms, setTerms] = useState<ContractTermClause[]>(
    contract?.terms && contract.terms.length > 0 ? contract.terms : [...STANDARD_CONTRACT_CLAUSES]
  );

  const [newClauseTitle, setNewClauseTitle] = useState('');
  const [newClauseContent, setNewClauseContent] = useState('');

  const handleCraneChange = (modelName: string) => {
    setCraneModel(modelName);
    const found = fleet.find((f) => f.model.toLowerCase().includes(modelName.toLowerCase()));
    if (found) {
      setCraneCapacityTon(found.capacityTon);
    }
  };

  const handleToggleClause = (clauseId: string) => {
    setTerms((prev) =>
      prev.map((cl) => (cl.id === clauseId ? { ...cl, enabled: !cl.enabled } : cl))
    );
  };

  const handleUpdateClauseContent = (clauseId: string, content: string) => {
    setTerms((prev) =>
      prev.map((cl) => (cl.id === clauseId ? { ...cl, contentAr: content } : cl))
    );
  };

  const handleAddCustomClause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClauseTitle.trim() || !newClauseContent.trim()) return;

    const newClause: ContractTermClause = {
      id: `cl-cust-${Date.now()}`,
      titleAr: newClauseTitle.trim(),
      contentAr: newClauseContent.trim(),
      enabled: true,
      category: 'تشغيل وصيانة',
    };

    setTerms([...terms, newClause]);
    setNewClauseTitle('');
    setNewClauseContent('');
    showToast('تمت إضافة الشرط المخصص إلى بنود العقد بنجاح');
  };

  const handleSave = () => {
    const today = new Date();
    const finalContract: CraneContract = {
      id: id || `cnt-${Date.now()}`,
      contractNo: contractNo || `CRN-CNT-${today.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clientNameAr,
      projectNameAr,
      craneModel,
      craneCapacityTon,
      startDate,
      endDate,
      rateType,
      rateAmount: Number(rateAmount),
      mobilizationFee: Number(mobilizationFee),
      currency,
      status,
      operatorIncluded,
      fuelIncluded,
      terms,
    };

    saveContract(finalContract);
    setId(finalContract.id);
    setContractNo(finalContract.contractNo);
  };

  const enabledTermsCount = terms.filter((t) => t.enabled).length;

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
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('Heavy Equipment Contract', 'عقود تأجير وتشغيل الرافعات', 'Contracts')}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  status === 'ساري' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status}
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 font-mono tracking-tight">
              {contractNo || 'عقد تشغيل رافعة جديد (New Crane Contract)'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة العقد الرسمي</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg text-white shadow-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ العقد</span>
          </button>
        </div>
      </div>

      {/* Main Parameters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
          1. بيانات العميل والمشروع والرافعة المؤجرة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">اسم العميل / الشركة المستأجرة *</label>
            <input
              type="text"
              required
              value={clientNameAr}
              onChange={(e) => setClientNameAr(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">اسم وموقع المشروع الميداني *</label>
            <input
              type="text"
              required
              value={projectNameAr}
              onChange={(e) => setProjectNameAr(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">الرافعة المطلوبة من أسطول Egypt Cranes *</label>
            <select
              value={craneModel}
              onChange={(e) => handleCraneChange(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-blue-900"
            >
              {fleet.map((crane) => (
                <option key={crane.id} value={`${crane.model} (${crane.capacityTon} Ton)`}>
                  {crane.model} - حمولة {crane.capacityTon} طن ({crane.brand})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">الحمولة القصوى المعتمدة</label>
            <input
              type="text"
              readOnly
              value={`${craneCapacityTon} طن متري (Metric Ton)`}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono font-black text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">نظام احتساب الإيجار</label>
            <select
              value={rateType}
              onChange={(e) => setRateType(e.target.value as any)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
            >
              <option value="شهري">إيجار شهري (Monthly Rate)</option>
              <option value="يومي">إيجار يومي (Daily Rate)</option>
              <option value="أسبوعي">إيجار أسبوعي (Weekly Rate)</option>
              <option value="بالمهمة">بالمهمة / الرفعة الواحدة (Per Lift Job)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <HijriDatePicker label="تاريخ بداية التشغيل (Start Date)" value={startDate} onChange={(iso) => setStartDate(iso)} />
          </div>
          <div>
            <HijriDatePicker label="تاريخ انتهاء العقد (End Date)" value={endDate} onChange={(iso) => setEndDate(iso)} />
          </div>
        </div>

        {/* Pricing & Inclusions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">قيمة الإيجار ({rateType})</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={rateAmount}
                onChange={(e) => setRateAmount(Number(e.target.value))}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono font-bold text-slate-900"
              />
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">{currency}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">مصاريف نقل وتجهيز الرافعة (Mobilization)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={mobilizationFee}
                onChange={(e) => setMobilizationFee(Number(e.target.value))}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono font-bold text-slate-900"
              />
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">{currency}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={operatorIncluded}
                onChange={(e) => setOperatorIncluded(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>شامل السائق والمشغل</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={fuelIncluded}
                onChange={(e) => setFuelIncluded(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>شامل السولار والوقود</span>
            </label>
          </div>
        </div>
      </div>

      {/* Streamlined Terms & Conditions Engine (سهولة إدخال الاشتراطات) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>محرك الاشتراطات وبنود العقد الذكي (Smart Terms Builder)</span>
            </h2>
            <p className="text-xs text-slate-500">
              سهولة تفعيل وتعطيل الشروط القياسية بنقرة واحدة وتعديل صياغتها أو إضافة شروط مخصصة
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {enabledTermsCount} شروط مفعلة بالعقد
          </span>
        </div>

        {/* List of Standard Clauses */}
        <div className="space-y-4">
          {terms.map((clause, idx) => (
            <div
              key={clause.id}
              className={`p-4 rounded-xl border transition-all ${
                clause.enabled
                  ? 'bg-slate-50/80 border-slate-300 shadow-2xs'
                  : 'bg-slate-100/40 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clause.enabled}
                    onChange={() => handleToggleClause(clause.id)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-black text-slate-900">
                    بند {idx + 1}: {clause.titleAr}
                  </span>
                </label>

                <span className="text-[10px] font-bold bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                  {clause.category}
                </span>
              </div>

              {clause.enabled && (
                <textarea
                  rows={2}
                  value={clause.contentAr}
                  onChange={(e) => handleUpdateClauseContent(clause.id, e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-700 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-600 font-sans"
                />
              )}
            </div>
          ))}
        </div>

        {/* Add Custom Clause Form */}
        <form onSubmit={handleAddCustomClause} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>إضافة شرط مخصص إضافي للعقد</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="عنوان الشرط (مثال: شروط العمل في الأماكن المغلقة)"
              value={newClauseTitle}
              onChange={(e) => setNewClauseTitle(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold"
            />
            <input
              type="text"
              placeholder="نص الشرط والالتزام التعاقدي..."
              value={newClauseContent}
              onChange={(e) => setNewClauseContent(e.target.value)}
              className="w-full md:col-span-2 text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              إدراج الشرط في العقد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
