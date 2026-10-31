import React, { useState } from 'react';
import {
  FileSignature,
  Plus,
  Search,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  Calendar,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { CraneContract } from '../../types/erp';
import { gregorianToHijri } from '../../utils/hijri';

export const ContractListView: React.FC = () => {
  const { contracts, setActiveContract, setActiveView, t } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = contracts.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        c.contractNo.toLowerCase().includes(q) ||
        c.clientNameAr.toLowerCase().includes(q) ||
        c.projectNameAr.toLowerCase().includes(q) ||
        c.craneModel.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('Equipment Operations', 'عقود تشغيل الرافعات', 'Contracts')}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              العقود السارية
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-emerald-700" />
            <span>عقود تأجير وتشغيل الرافعات الثقيلة (Crane Contracts)</span>
          </h1>
        </div>

        <button
          onClick={() => {
            setActiveContract(null);
            setActiveView('new-contract');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء عقد رافعة جديد (+)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث برقم العقد أو العميل أو المشروع أو الموديل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'All', label: 'الكل' },
            { id: 'ساري', label: 'ساري (Active)' },
            { id: 'مسودة', label: 'مسودة (Draft)' },
            { id: 'منتهي', label: 'منتهي (Closed)' },
          ].map((st) => {
            const isSelected = statusFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
              <tr>
                <th className="py-3 px-4">رقم العقد</th>
                <th className="py-3 px-4">العميل والمشروع</th>
                <th className="py-3 px-4">الرافعة المؤجرة والحمولة</th>
                <th className="py-3 px-4">فترة التشغيل</th>
                <th className="py-3 px-4 text-left">قيمة الإيجار</th>
                <th className="py-3 px-4 text-center">الاشتراطات المفعلة</th>
                <th className="py-3 px-4 text-center">الحالة</th>
                <th className="py-3 px-4 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filtered.map((cnt) => {
                const activeClauses = cnt.terms.filter((t) => t.enabled).length;
                return (
                  <tr key={cnt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{cnt.contractNo}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{cnt.clientNameAr}</div>
                      <div className="text-[11px] text-slate-500">{cnt.projectNameAr}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                        <span>{cnt.craneModel}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">حمولة: {cnt.craneCapacityTon} طن</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                      <div>من: {cnt.startDate}</div>
                      <div>إلى: {cnt.endDate}</div>
                    </td>
                    <td className="py-3 px-4 text-left font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {cnt.rateAmount.toLocaleString()} {cnt.currency} / {cnt.rateType}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {activeClauses} شروط
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cnt.status === 'ساري'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {cnt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setActiveContract(cnt);
                          setActiveView('new-contract');
                        }}
                        className="px-3 py-1 rounded-md text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        فتح العقد
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
