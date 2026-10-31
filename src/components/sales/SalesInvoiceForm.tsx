import React, { useState } from 'react';
import {
  FileText,
  Save,
  CheckCircle,
  Printer,
  XCircle,
  Plus,
  Trash2,
  Calendar,
  Building,
  CreditCard,
  MapPin,
  FileCheck,
  Info,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { SalesInvoice, InvoiceItem } from '../../types/erp';
import { HijriDatePicker } from '../datepicker/HijriDatePicker';
import { tafqeetArabic, tafqeetEnglish } from '../../utils/tafqeet';

interface SalesInvoiceFormProps {
  invoice?: SalesInvoice | null;
  onBack?: () => void;
}

export const SalesInvoiceForm: React.FC<SalesInvoiceFormProps> = ({ invoice, onBack }) => {
  const { saveInvoice, submitInvoice, cancelInvoice, setActiveView, showToast, language, t } = useERP();

  const [activeTab, setActiveTab] = useState<'details' | 'payments' | 'address' | 'terms' | 'more'>('details');

  const [id, setId] = useState<string>(invoice?.id || '');
  const [invoiceNo, setInvoiceNo] = useState<string>(invoice?.invoiceNo || '');
  const [customerNameAr, setCustomerNameAr] = useState<string>(invoice?.customerNameAr || 'مؤسسة الرياض للتقنية والتوريدات');
  const [customerNameEn, setCustomerNameEn] = useState<string>(invoice?.customerNameEn || 'Riyadh Tech & Supplies Est.');
  const [postingDate, setPostingDate] = useState<string>(invoice?.postingDate || '2026-07-26');
  const [dueDate, setDueDate] = useState<string>(invoice?.dueDate || '2026-08-26');
  const [currency, setCurrency] = useState<'EGP' | 'SAR' | 'USD'>(invoice?.currency || 'EGP');
  const [status, setStatus] = useState<'مسودة' | 'معتمدة' | 'مدفوعة' | 'ملغاة'>(invoice?.status || 'مسودة');

  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items && invoice.items.length > 0
      ? invoice.items
      : [
          {
            id: 'item-1',
            itemCode: 'SRV-ERP-V16',
            itemNameAr: 'ترقية وتثبيت ثيم C-Style لـ ERPNext v16 مع التعريب',
            itemNameEn: 'ERPNext v16 C-Style Theme & Arabic Localization',
            qty: 1,
            rate: 350,
            discountPercent: 0,
            amount: 350,
          },
          {
            id: 'item-2',
            itemCode: 'LIC-ADDON-HIJRI',
            itemNameAr: 'إضافة وحدة التقويم الهجري والتفقيط المزدوج',
            itemNameEn: 'Dual Hijri Datepicker & Bilingual Tafqeet Module',
            qty: 1,
            rate: 105,
            discountPercent: 0,
            amount: 105,
          },
        ]
  );

  const [taxPercent, setTaxPercent] = useState<number>(invoice?.taxPercent !== undefined ? invoice.taxPercent : 0);
  const [paidAmount, setPaidAmount] = useState<number>(invoice?.paidAmount || (invoice ? invoice.grandTotal : 0));
  const [paymentTermsAr, setPaymentTermsAr] = useState<string>(invoice?.paymentTermsAr || 'السداد بالكامل فور الاستلام');
  const [paymentTermsEn, setPaymentTermsEn] = useState<string>(invoice?.paymentTermsEn || 'Due upon receipt');
  const [customerAddressAr, setCustomerAddressAr] = useState<string>(invoice?.customerAddressAr || 'المنطقة الصناعية - قطعة 12 - الرياض');
  const [contactPersonAr, setContactPersonAr] = useState<string>(invoice?.contactPersonAr || 'م. خالد السبيعي');
  const [remarksAr, setRemarksAr] = useState<string>(invoice?.remarksAr || 'فاتورة نموذجية مطابقة لشرح فيديو ثيم C-Style');

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const grandTotal = subtotal + taxAmount;
  const outstandingAmount = Math.max(0, grandTotal - paidAmount);

  // Recalculate Tafqeet
  const wordsAr = tafqeetArabic(grandTotal, currency);
  const wordsEn = tafqeetEnglish(grandTotal, currency);

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    const qty = field === 'qty' ? Number(value) : item.qty;
    const rate = field === 'rate' ? Number(value) : item.rate;
    const discount = field === 'discountPercent' ? Number(value) : item.discountPercent;
    item.amount = Math.max(0, qty * rate * (1 - discount / 100));
    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      itemCode: `ITEM-00${items.length + 1}`,
      itemNameAr: 'صنف خدمات أو بضاعة تجارية جديدة',
      itemNameEn: 'New Commercial Goods / Service Item',
      qty: 1,
      rate: 100,
      discountPercent: 0,
      amount: 100,
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) {
      showToast('يجب أن تحتوي الفاتورة على بند واحد على الأقل');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleSave = () => {
    const saved = saveInvoice({
      id: id || undefined,
      invoiceNo: invoiceNo || undefined,
      customerNameAr,
      customerNameEn,
      postingDate,
      dueDate,
      currency,
      status,
      items,
      subtotal,
      taxPercent,
      taxAmount,
      grandTotal,
      paidAmount,
      outstandingAmount,
      paymentTermsAr,
      paymentTermsEn,
      customerAddressAr,
      contactPersonAr,
      remarksAr,
    });
    setId(saved.id);
    setInvoiceNo(saved.invoiceNo);
  };

  const handleSubmit = () => {
    handleSave();
    if (id) {
      submitInvoice(id);
      setStatus('معتمدة');
    }
  };

  const handleCancel = () => {
    if (id) {
      cancelInvoice(id);
      setStatus('ملغاة');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Document Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="العودة لقائمة الفواتير"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('Sales Invoice', 'فاتورة مبيعات', 'Sales Invoice')}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  status === 'معتمدة'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'ملغاة'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status}
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 font-mono tracking-tight">
              {invoiceNo || 'فاتورة مسودة جديدة (New Draft)'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>

          {status !== 'معتمدة' && status !== 'ملغاة' && (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>اعتماد (Submit)</span>
            </button>
          )}

          {status === 'معتمدة' && (
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>إلغاء الفاتورة</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-xs transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ (Save)</span>
          </button>
        </div>
      </div>

      {/* Tabs Header (Directly matching Frappe v16 C-Style tabs in Screenshot 07) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center border-b border-slate-200 bg-slate-50/70 px-4 overflow-x-auto">
          {[
            { id: 'details', labelAr: 'التفاصيل', labelEn: 'Details', icon: FileText },
            { id: 'payments', labelAr: 'المدفوعات', labelEn: 'Payments', icon: CreditCard },
            { id: 'address', labelAr: 'الاتصال والعنوان', labelEn: 'Address & Contact', icon: MapPin },
            { id: 'terms', labelAr: 'الشروط والأحكام', labelEn: 'Terms', icon: FileCheck },
            { id: 'more', labelAr: 'معلومات إضافية', labelEn: 'More Info', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-blue-700 text-blue-900 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                style={isActive ? { borderBottomColor: 'var(--primary-color)' } : {}}
              >
                <Icon className="w-4 h-4" />
                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: Details (التفاصيل) */}
        {activeTab === 'details' && (
          <div className="p-6 space-y-6">
            {/* Top Fields: Customer & Dates with Hijri Badge */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Customer */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  العميل (Customer) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerNameAr}
                  onChange={(e) => setCustomerNameAr(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                />
                <input
                  type="text"
                  placeholder="Customer Name (EN)"
                  value={customerNameEn}
                  onChange={(e) => setCustomerNameEn(e.target.value)}
                  className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-slate-500 focus:outline-none"
                  dir="ltr"
                />
              </div>

              {/* Posting Date with Hijri Badge & Dual Calendar */}
              <div>
                <HijriDatePicker
                  label="تاريخ الترحيل (Posting Date)"
                  required
                  value={postingDate}
                  onChange={(iso) => setPostingDate(iso)}
                />
              </div>

              {/* Due Date with Hijri Badge & Dual Calendar */}
              <div>
                <HijriDatePicker
                  label="تاريخ الاستحقاق (Payment Due Date)"
                  required
                  value={dueDate}
                  onChange={(iso) => setDueDate(iso)}
                />
              </div>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-4 py-2 border-y border-slate-100">
              <span className="text-xs font-bold text-slate-700">العملة (Currency):</span>
              <div className="flex items-center gap-2">
                {(['EGP', 'SAR', 'USD'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                      currency === curr
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {curr === 'EGP' ? 'جنيه مصري (EGP)' : curr === 'SAR' ? 'ريال سعودي (SAR)' : 'دولار (USD)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Item Rows Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">بنود الفاتورة والخدمات (Items Table)</h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs hover:opacity-95"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة بند جديد (+)</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">#</th>
                      <th className="py-2.5 px-3 w-32">كود الصنف</th>
                      <th className="py-2.5 px-3">اسم الصنف والبيان</th>
                      <th className="py-2.5 px-3 w-20 text-center">الكمية</th>
                      <th className="py-2.5 px-3 w-28 text-center">السعر</th>
                      <th className="py-2.5 px-3 w-20 text-center">خصم %</th>
                      <th className="py-2.5 px-3 w-32 text-left">الإجمالي</th>
                      <th className="py-2.5 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3 text-center text-slate-400 font-mono">
                          {index + 1}
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={item.itemCode}
                            onChange={(e) => handleUpdateItem(index, 'itemCode', e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-mono"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={item.itemNameAr}
                            onChange={(e) => handleUpdateItem(index, 'itemNameAr', e.target.value)}
                            className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1 font-medium"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleUpdateItem(index, 'qty', e.target.value)}
                            className="w-full text-xs text-center bg-white border border-slate-200 rounded px-2 py-1 font-mono font-bold"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.rate}
                            onChange={(e) => handleUpdateItem(index, 'rate', e.target.value)}
                            className="w-full text-xs text-center bg-white border border-slate-200 rounded px-2 py-1 font-mono font-bold"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discountPercent}
                            onChange={(e) => handleUpdateItem(index, 'discountPercent', e.target.value)}
                            className="w-full text-xs text-center bg-white border border-slate-200 rounded px-2 py-1 font-mono"
                          />
                        </td>
                        <td className="py-2 px-3 text-left font-mono font-bold text-slate-900 tabular-nums">
                          {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(index)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                            title="حذف البند"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals & Calculations Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              {/* Left Column: Bilingual Tafqeet Box (Directly matching Screenshot 09) */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  التفقيط المالي الثنائي (Amount in Words)
                </span>

                {/* Arabic Tafqeet */}
                <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-bold text-amber-800 block">
                    المبلغ بالحروف (العربية):
                  </span>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed font-sans">
                    {wordsAr}
                  </p>
                </div>

                {/* English Tafqeet */}
                <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-bold text-blue-800 block">
                    Amount in Words (English):
                  </span>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed font-mono" dir="ltr">
                    {wordsEn}
                  </p>
                </div>
              </div>

              {/* Right Column: Financial Summary */}
              <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-600">المجموع الفرعي (Subtotal):</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">ضريبة القيمة المضافة (VAT):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(Number(e.target.value))}
                      className="w-14 text-center text-xs bg-white border border-slate-300 rounded px-1 py-0.5 font-mono"
                    />
                    <span className="text-slate-500">%</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                  </span>
                </div>

                <div
                  className="flex justify-between text-sm py-2 px-3 rounded-lg text-white font-black mt-2 shadow-xs"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  <span>الإجمالي المستحق (Grand Total):</span>
                  <span className="font-mono text-base tabular-nums">
                    {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                  </span>
                </div>

                <div className="flex justify-between text-xs py-1 pt-2 border-t border-slate-200 text-slate-600">
                  <span>المدفوع نقداً (Paid Amount):</span>
                  <input
                    type="number"
                    min="0"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-28 text-left text-xs bg-white border border-slate-300 rounded px-2 py-0.5 font-mono font-bold"
                  />
                </div>

                <div className="flex justify-between text-xs py-1 text-red-700 font-bold">
                  <span>الرصيد المتبقي (Outstanding Amount):</span>
                  <span className="font-mono tabular-nums">
                    {outstandingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Payments (المدفوعات) */}
        {activeTab === 'payments' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  شروط السداد والدفع (Payment Terms)
                </label>
                <input
                  type="text"
                  value={paymentTermsAr}
                  onChange={(e) => setPaymentTermsAr(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  الحساب المالي للتحصيل
                </label>
                <select className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2">
                  <option>1110 - البنك الأهلي التجاري</option>
                  <option>1120 - صندوق الخزينة الرئيسية</option>
                  <option>1130 - بنك مصر - الحساب الجاري</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: Address & Contact (الاتصال والعنوان) */}
        {activeTab === 'address' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  عنوان العميل ومقر التسليم
                </label>
                <textarea
                  rows={3}
                  value={customerAddressAr}
                  onChange={(e) => setCustomerAddressAr(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  الشخص المسؤول للتواصل
                </label>
                <input
                  type="text"
                  value={contactPersonAr}
                  onChange={(e) => setContactPersonAr(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Terms (الشروط والأحكام) */}
        {activeTab === 'terms' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                الشروط التجارية والضمان (Terms & Conditions)
              </label>
              <textarea
                rows={4}
                defaultValue="تعتبر البضاعة المسلمة بحالة ممتازة ومطابقة للمواصفات الفنية المعتمدة. الضمان يسري لمدة عام كامل ضد عيوب الصناعة مع التحديثات الدورية."
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* Tab Content 5: More Info (معلومات إضافية) */}
        {activeTab === 'more' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ملاحظات الفاتورة والتسوية
              </label>
              <textarea
                rows={3}
                value={remarksAr}
                onChange={(e) => setRemarksAr(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
