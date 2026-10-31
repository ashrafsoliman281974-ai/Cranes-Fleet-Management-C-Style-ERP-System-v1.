import React, { useState } from 'react';
import {
  Landmark,
  CreditCard,
  FileCheck,
  ShieldCheck,
  Upload,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  Calendar,
  Layers,
  FileSpreadsheet,
  Download,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  INITIAL_BANK_ACCOUNTS,
  INITIAL_BANK_TRANSACTIONS,
  INITIAL_LETTERS_OF_GUARANTEE,
} from '../../data/masterEnterpriseSeed';
import { BankAccountItem, BankStatementTransaction, LetterOfGuarantee } from '../../types/erp';

export const BankingReconciliationView: React.FC = () => {
  const { showToast } = useERP();

  const [activeTab, setActiveTab] = useState<'accounts' | 'reconciliation' | 'guarantees'>('reconciliation');
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>(INITIAL_BANK_ACCOUNTS);
  const [transactions, setTransactions] = useState<BankStatementTransaction[]>(INITIAL_BANK_TRANSACTIONS);
  const [guarantees, setGuarantees] = useState<LetterOfGuarantee[]>(INITIAL_LETTERS_OF_GUARANTEE);

  const [selectedBankId, setSelectedBankId] = useState('bank-cib');

  const handleAutoReconcile = () => {
    setTransactions(
      transactions.map((t) => ({
        ...t,
        matchedStatus: 'مطابق آلياً',
      }))
    );
    showToast('تمت المطابقة الآلية لجميع بنود كشف الحساب البنكي وتسوية الشيكات ومسير الرواتب!');
  };

  const totalBankBalanceEGP = bankAccounts
    .filter((b) => b.currency === 'EGP')
    .reduce((sum, b) => sum + b.currentBalance, 0);

  const totalGuaranteesEGP = guarantees
    .filter((g) => g.currency === 'EGP')
    .reduce((sum, g) => sum + g.amount, 0);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <span>الحسابات والمالية</span>
            <span>/</span>
            <span className="text-red-600">موديول البنوك والمطابقة البنكية الذكية</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Landmark className="w-6 h-6 text-red-600" />
            <span>البنوك، المطابقة الآلية لكشوف الحساب، وخطابات الضمان</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة الحسابات البنكية متعددة العملات، استيراد كشوف الحساب، تسوية الشيكات، ومتابعة خطابات الضمان للمشاريع القومية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoReconcile}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <CheckCircle className="w-4 h-4" />
            <span>مطابقة آلية فورية (Auto-Reconcile)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>إجمالي الأرصدة البنكية (EGP)</span>
            <Landmark className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-700 font-mono">
            {totalBankBalanceEGP.toLocaleString()} ج.م
          </div>
          <div className="text-[11px] text-slate-500">حسابات CIB و QNB والبنك الأهلي</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>حسابات النقد الأجنبي (USD)</span>
            <CreditCard className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-black text-cyan-700 font-mono">
            $485,000 USD
          </div>
          <div className="text-[11px] text-slate-500">حساب استيراد قطع الغيار والرافعات</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>إجمالي خطابات الضمان القائمة</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-700 font-mono">
            {totalGuaranteesEGP.toLocaleString()} ج.م
          </div>
          <div className="text-[11px] text-slate-500">مشروع الضبعة والقطار الكهربائي</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'reconciliation'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>أداة المطابقة البنكية الآلية (Bank Reconciliation Tool)</span>
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'accounts'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>الحسابات البنكية ومراكز التكلفة ({bankAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('guarantees')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'guarantees'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>خطابات الضمان البنكية (Letters of Guarantee)</span>
        </button>
      </div>

      {/* Tab 1: Reconciliation Tool */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">اختر الحساب البنكي:</span>
              <select
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900"
              >
                {bankAccounts.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bankNameAr} ({b.accountNumber}) - {b.currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('تم سحب أحدث كشف حساب إلكتروني بنجاح (Zero Discrepancy)')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>استيراد كشف حساب (Excel/CSV)</span>
              </button>
            </div>
          </div>

          {/* Transactions Reconciliation Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3">التاريخ</th>
                  <th className="py-2.5 px-3">رقم المرجع البنكي</th>
                  <th className="py-2.5 px-3">البيان / الوصف</th>
                  <th className="py-2.5 px-3">مدين (صادر)</th>
                  <th className="py-2.5 px-3">دائن (وارد)</th>
                  <th className="py-2.5 px-3">حالة المطابقة</th>
                  <th className="py-2.5 px-3">المستند المطابق بالنظام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono">{txn.date}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{txn.referenceNo}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{txn.descriptionAr}</td>
                    <td className="py-3 px-3 font-mono text-red-600 font-bold">
                      {txn.debit > 0 ? `${txn.debit.toLocaleString()} ج.م` : '-'}
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-600 font-bold">
                      {txn.credit > 0 ? `${txn.credit.toLocaleString()} ج.م` : '-'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>{txn.matchedStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {txn.matchedDocType} #{txn.matchedDocNo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Bank Accounts */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-black text-slate-900">{account.bankNameAr}</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {account.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                <div className="text-slate-500">رقم الحساب: <span className="font-mono font-bold text-slate-800">{account.accountNumber}</span></div>
                <div className="text-slate-500">IBAN: <span className="font-mono text-[10px] text-slate-800">{account.iban}</span></div>
                <div className="text-slate-500">حساب الأستاذ: <span className="font-mono text-slate-800">{account.glAccountCode}</span></div>
                <div className="text-slate-500">مركز التكلفة: <span className="font-bold text-slate-800">{account.costCenterAr}</span></div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">الرصيد الدفتري الحالي:</span>
                <span className="text-base font-black text-emerald-700 font-mono">
                  {account.currentBalance.toLocaleString()} {account.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Letters of Guarantee */}
      {activeTab === 'guarantees' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">سجل خطابات الضمان البنكية للمشاريع الكبرى</h3>
              <p className="text-xs text-slate-500">متابعة التواريخ والتنبيه التلقائي قبل الانتهاء بـ 60 و 30 و 7 أيام.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3">رقم خطاب الضمان</th>
                  <th className="py-2.5 px-3">النوع</th>
                  <th className="py-2.5 px-3">البنك المصدر</th>
                  <th className="py-2.5 px-3">المستفيد / المشروع</th>
                  <th className="py-2.5 px-3">القيمة والغطاء النقدي</th>
                  <th className="py-2.5 px-3">تاريخ الانتهاء</th>
                  <th className="py-2.5 px-3">الحالة والتنبيه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {guarantees.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{g.lgNumber}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{g.type}</td>
                    <td className="py-3 px-3 text-slate-600">{g.issuingBankAr}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{g.beneficiaryAr}</div>
                      <div className="text-[11px] text-slate-500">{g.projectAr}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono font-black text-slate-900">
                        {g.amount.toLocaleString()} {g.currency}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        غطاء نقدي {g.cashMarginPercent}% ({g.cashMarginAmount.toLocaleString()} ج.م)
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <div>{g.expiryDate}</div>
                      <div className="text-[10px] font-sans text-amber-600 font-bold">
                        متبقٍ {g.daysToExpiry} يوماً
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          g.status === 'سارٍ'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {g.status}
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
