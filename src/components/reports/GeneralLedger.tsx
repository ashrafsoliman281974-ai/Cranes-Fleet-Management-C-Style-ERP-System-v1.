import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Filter,
  Search,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { HijriDatePicker } from '../datepicker/HijriDatePicker';
import { gregorianToHijri } from '../../utils/hijri';

export const GeneralLedger: React.FC = () => {
  const { ledgerEntries, setActiveView, t } = useERP();

  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-08-30');
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [disableOpeningBalance, setDisableOpeningBalance] = useState(false);

  // Accounts list from entries
  const accounts = Array.from(new Set(ledgerEntries.map((e) => e.accountAr)));

  const filteredEntries = ledgerEntries.filter((entry) => {
    if (selectedAccount !== 'All' && entry.accountAr !== selectedAccount) return false;
    if (entry.postingDate < fromDate || entry.postingDate > toDate) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        entry.accountAr.toLowerCase().includes(q) ||
        entry.voucherNo.toLowerCase().includes(q) ||
        entry.partyNameAr.toLowerCase().includes(q) ||
        entry.remarksAr.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalDebit = filteredEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = filteredEntries.reduce((sum, e) => sum + e.credit, 0);
  const netBalance = totalDebit - totalCredit;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('Accounting Reports', 'التقارير المحاسبية', 'Accounting Reports')}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              تقرير رسمي معتمد
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-700" />
            <span>{t('General Ledger', 'دفتر الأستاذ العام', 'General Ledger')}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة التقرير</span>
          </button>
          <button
            onClick={() => alert('تم تصدير تقرير دفتر الأستاذ بنجاح بصيغة Excel / CSV')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (Matching options in Screenshot 11) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>فلاتر البحث وتحديد الفترة المحاسبية</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <HijriDatePicker label="من تاريخ" value={fromDate} onChange={(iso) => setFromDate(iso)} />
          </div>

          <div>
            <HijriDatePicker label="إلى تاريخ" value={toDate} onChange={(iso) => setToDate(iso)} />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">الحساب المالي</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
            >
              <option value="All">جميع الحسابات (All Accounts)</option>
              {accounts.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">بحث نصي حر</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="بحث برقم القيد أو الطرف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg pr-8 pl-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Checkbox from Video: Disable Opening Balance Calculation */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <input
            type="checkbox"
            id="disableOpening"
            checked={disableOpeningBalance}
            onChange={(e) => setDisableOpeningBalance(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="disableOpening" className="text-xs font-medium text-slate-700 cursor-pointer">
            {t(
              'Disable Opening Balance Calculation',
              'تعطيل احتساب الرصيد الافتتاحي (Disable Opening Balance Calculation)',
              'Disable Opening Balance Calculation'
            )}
          </label>
        </div>
      </div>

      {/* High Density General Ledger Table (Wide scrollable table from screenshot 11) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
              <tr>
                <th className="py-3 px-4">تاريخ الترحيل</th>
                <th className="py-3 px-4">الحساب المالي</th>
                <th className="py-3 px-4">نوع المستند</th>
                <th className="py-3 px-4">رقم السند/الفاتورة</th>
                <th className="py-3 px-4">الطرف / العميل</th>
                <th className="py-3 px-4 text-left">مدين (Debit)</th>
                <th className="py-3 px-4 text-left">دائن (Credit)</th>
                <th className="py-3 px-4 text-left">الرصيد التراكمي</th>
                <th className="py-3 px-4">البيان والملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredEntries.map((entry) => {
                const hijri = gregorianToHijri(entry.postingDate);
                return (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-800 whitespace-nowrap">
                      <div>{entry.postingDate}</div>
                      <div className="text-[10px] text-amber-800 font-sans">{hijri.formattedAr}</div>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                      {entry.accountAr}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {entry.voucherTypeAr}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-blue-700 font-bold whitespace-nowrap">
                      {entry.voucherNo}
                    </td>
                    <td className="py-2.5 px-4 text-slate-800 whitespace-nowrap">
                      {entry.partyNameAr}
                    </td>
                    <td className="py-2.5 px-4 text-left font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {entry.debit > 0
                        ? entry.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })
                        : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-left font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {entry.credit > 0
                        ? entry.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })
                        : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-left font-mono font-black text-blue-900 tabular-nums whitespace-nowrap">
                      {entry.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate">
                      {entry.remarksAr}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Totals Summary Footer Row */}
            <tfoot className="bg-slate-100/80 border-t-2 border-slate-300 font-black text-slate-900">
              <tr>
                <td colSpan={5} className="py-3 px-4 text-left">
                  الإجمالي الكلي للفترة المحددة:
                </td>
                <td className="py-3 px-4 text-left font-mono tabular-nums text-emerald-800 text-sm">
                  {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-left font-mono tabular-nums text-amber-800 text-sm">
                  {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-left font-mono tabular-nums text-blue-950 text-sm">
                  {netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} EGP
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
