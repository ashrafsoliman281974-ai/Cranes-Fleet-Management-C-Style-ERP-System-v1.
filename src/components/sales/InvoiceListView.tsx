import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  ChevronLeft,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { SalesInvoice } from '../../types/erp';
import { gregorianToHijri } from '../../utils/hijri';

export const InvoiceListView: React.FC = () => {
  const { invoices, setActiveInvoice, setActiveView, t } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.customerNameAr.toLowerCase().includes(q) ||
        inv.customerNameEn.toLowerCase().includes(q) ||
        inv.amountInWordsAr.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('Selling Module', 'إدارة المبيعات', 'Selling')}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              قائمة المستندات
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span>{t('Sales Invoices', 'فواتير المبيعات (Sales Invoices)', 'Sales Invoices')}</span>
          </h1>
        </div>

        <button
          onClick={() => {
            setActiveInvoice(null);
            setActiveView('new-invoice');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <Plus className="w-4 h-4" />
          <span>فاتورة مبيعات جديدة (+)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث برقم الفاتورة أو اسم العميل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 focus:outline-none focus:bg-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'All', label: 'الكل' },
            { id: 'معتمدة', label: 'معتمدة (Submitted)' },
            { id: 'مسودة', label: 'مسودة (Draft)' },
            { id: 'ملغاة', label: 'ملغاة (Cancelled)' },
          ].map((status) => {
            const isSelected = statusFilter === status.id;
            return (
              <button
                key={status.id}
                onClick={() => setStatusFilter(status.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
              <tr>
                <th className="py-3 px-4">رقم الفاتورة</th>
                <th className="py-3 px-4">العميل</th>
                <th className="py-3 px-4">تاريخ الترحيل (ميلادي / هجري)</th>
                <th className="py-3 px-4">تاريخ الاستحقاق</th>
                <th className="py-3 px-4 text-left">الإجمالي</th>
                <th className="py-3 px-4 text-left">المتبقي</th>
                <th className="py-3 px-4 text-center">الحالة</th>
                <th className="py-3 px-4 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredInvoices.map((inv) => {
                const hijri = gregorianToHijri(inv.postingDate);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {inv.invoiceNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{inv.customerNameAr}</div>
                      <div className="text-[10px] text-slate-400 font-sans" dir="ltr">
                        {inv.customerNameEn}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-800">{inv.postingDate}</div>
                      <span
                        className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 text-amber-900 border"
                        style={{
                          backgroundColor: 'var(--accent-metallic-light, #fef3c7)',
                          borderColor: 'var(--accent-metallic, #d4af37)',
                        }}
                      >
                        {hijri.formattedAr}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {inv.dueDate}
                    </td>
                    <td className="py-3 px-4 text-left font-mono font-bold text-slate-900 tabular-nums">
                      {inv.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} {inv.currency}
                    </td>
                    <td className="py-3 px-4 text-left font-mono font-bold text-red-700 tabular-nums">
                      {inv.outstandingAmount > 0
                        ? `${inv.outstandingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${inv.currency}`
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inv.status === 'معتمدة'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'ملغاة'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setActiveInvoice(inv);
                          setActiveView('new-invoice');
                        }}
                        className="px-3 py-1 rounded-md text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        فتح
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
