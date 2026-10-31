import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Calendar,
  Layers,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Eye,
  AlertTriangle,
  FileText,
  DollarSign,
  User,
  Building,
  Truck,
  Briefcase,
  MapPin,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { JournalEntry } from '../../types/erp';
import { gregorianToHijri } from '../../utils/hijri';

export const JournalEntryListView: React.FC = () => {
  const {
    journalEntries,
    setActiveJournalEntry,
    setActiveView,
    currentUser,
    setCurrentUser,
    users,
    approveJournalEntry,
    rejectJournalEntry,
    t,
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'بانتظار الاعتماد' | 'معتمد ومرحل' | 'مسودة' | 'مرفوض'>('All');

  // Modal for previewing entry details
  const [previewEntry, setPreviewEntry] = useState<JournalEntry | null>(null);

  // Modal for rejecting entry with reason
  const [rejectingEntry, setRejectingEntry] = useState<JournalEntry | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Pending entries for approval
  const pendingEntries = journalEntries.filter((j) => j.status === 'بانتظار الاعتماد');

  const filtered = journalEntries.filter((j) => {
    if (statusFilter !== 'All' && j.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        j.entryNo.toLowerCase().includes(q) ||
        j.remarksAr.toLowerCase().includes(q) ||
        (j.costCenterAr && j.costCenterAr.toLowerCase().includes(q)) ||
        (j.createdByUserNameAr && j.createdByUserNameAr.toLowerCase().includes(q)) ||
        (j.approvedByUserNameAr && j.approvedByUserNameAr.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleOpenRejectModal = (entry: JournalEntry) => {
    setRejectingEntry(entry);
    setRejectionReasonInput('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingEntry) return;
    if (!rejectionReasonInput.trim()) {
      alert('يرجى كتابة سبب رفض القيد لتوضيحه للمنفذ.');
      return;
    }
    rejectJournalEntry(rejectingEntry.id, rejectionReasonInput.trim());
    setRejectingEntry(null);
    if (previewEntry?.id === rejectingEntry.id) {
      setPreviewEntry(null);
    }
  };

  const handleApprove = (entry: JournalEntry) => {
    approveJournalEntry(entry.id);
    if (previewEntry?.id === entry.id) {
      setPreviewEntry(null);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('Accounting & Finance', 'المالية والحسابات العامة', 'Accounting')}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              دورة اعتماد القيود (Maker-Checker)
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-700" />
            <span>{t('Journal Entries', 'قيود اليومية المحاسبية واعتمادات الإدارة المالية', 'Journal Entries')}</span>
          </h1>
        </div>

        <button
          onClick={() => {
            setActiveJournalEntry(null);
            setActiveView('new-jv');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء قيد يومية جديد (+)</span>
        </button>
      </div>

      {/* Persona Switcher Bar for Maker-Checker Demonstration */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">المستخدم المسجل حالياً في النظام:</span>
              <span className="text-sm font-black text-amber-300">{currentUser.nameAr}</span>
              {currentUser.canApproveFinance ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700">
                  صاحب صلاحية الاعتماد المالي (Approver)
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-700">
                  كاتب قيد ومنفذ فقط (Maker / Preparer)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentUser.canApproveFinance
                ? 'لديك صلاحية مراجعة القيود المحاسبية واعتمادها وترحيلها لدفتر الأستاذ العام أو رفضها.'
                : 'أنت مسجل كمنفذ قيد: القيود التي تنشئها تنتقل لحالة "بانتظار الاعتماد" وتتطلب موافقة المدير المالي.'}
            </p>
          </div>
        </div>

        {/* User Switcher Quick Buttons */}
        <div className="flex items-center gap-2 shrink-0 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700">
          <span className="text-[11px] text-slate-400 font-bold px-1.5">تبديل المستخدم:</span>
          {users
            .filter((u) => u.id === 'usr-2' || u.id === 'usr-1' || u.id === 'usr-5')
            .map((u) => {
              const isSelected = currentUser.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setCurrentUser(u)}
                  className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                  title={`${u.roleAr} - ${u.canApproveFinance ? 'له صلاحية اعتماد' : 'كاتب قيد'}`}
                >
                  {u.nameAr.split(' ')[0]} {u.canApproveFinance ? '(معتمد)' : '(منفذ)'}
                </button>
              );
            })}
        </div>
      </div>

      {/* PENDING APPROVALS QUEUE BANNER (Shown prominently when user has approval rights) */}
      {currentUser.canApproveFinance ? (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                {pendingEntries.length}
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>صندوق طلبات اعتماد القيود المعلقة (Pending Approvals Queue)</span>
                </h3>
                <p className="text-xs text-amber-800">
                  هذه القيود تم إنشاؤها وتوقيعها من محاسب التكاليف والتشغيل وبانتظار قرارك المالي بالاعتماد والترحيل أو الرفض
                </p>
              </div>
            </div>

            {pendingEntries.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 animate-pulse">
                مطلوب اتخاذ قرار ({pendingEntries.length} قيد)
              </span>
            )}
          </div>

          {/* Pending Entries Cards */}
          {pendingEntries.length === 0 ? (
            <div className="p-4 bg-white/70 rounded-lg border border-amber-200/60 text-center text-xs font-bold text-amber-900 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>لا توجد طلبات اعتماد قيود معلقة حالياً. كافة القيود إما معتمدة ومرحلة أو مسودات.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 pt-1">
              {pendingEntries.map((pe) => (
                <div
                  key={pe.id}
                  className="bg-white p-4 rounded-xl border border-amber-300/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                        {pe.entryNo}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        تاريخ: {pe.postingDate} ({pe.hijriPostingDate})
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        مُنَفّذ القيد: {pe.createdByUserNameAr}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-900">{pe.remarksAr}</div>

                    {/* Dimensions & Cost Center */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-0.5">
                      <span className="font-semibold text-slate-500">مركز التكلفة:</span>
                      <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                        {pe.costCenterAr || 'مركز رئيسي'}
                      </span>
                      {pe.lines[0]?.linkedEquipment && (
                        <span className="font-medium bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                          المعدة: {pe.lines[0].linkedEquipment}
                        </span>
                      )}
                      {pe.lines[0]?.linkedClient && (
                        <span className="font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                          العميل: {pe.lines[0].linkedClient}
                        </span>
                      )}
                    </div>

                    {/* Amount & Tafqeet */}
                    <div className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="font-mono font-black text-slate-900 text-sm">
                        المبلغ الإجمالي: {pe.totalDebit.toLocaleString()} {pe.currency}
                      </div>
                      <div className="text-slate-600 font-medium text-[11px]">
                        فقط: {pe.amountInWordsAr}
                      </div>
                    </div>
                  </div>

                  {/* Approver Decisions Buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                    <button
                      onClick={() => setPreviewEntry(pe)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      title="معاينة كافة أطراف القيد والبيانات"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>معاينة وتفاصيل</span>
                    </button>

                    <button
                      onClick={() => handleOpenRejectModal(pe)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors"
                      title="رفض القيد مع إبداء الأسباب للمنفذ"
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>رفض القيد (Reject)</span>
                    </button>

                    <button
                      onClick={() => handleApprove(pe)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                      title="اعتماد القيد وترحيله فوراً لدفتر الأستاذ العام"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>اعتماد وترحيل (Approve & Post)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* If user is maker, show maker guidance banner */
        <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>حساب كاتب القيد (Maker):</strong> عند إنشاء أي قيد محاسبي وإرساله، يتم إدراجه في صندوق طلبات الاعتماد
              الخاص بالمدير المالي (<span className="font-bold">أشرف سليمان</span> أو <span className="font-bold">المهندس أمير مانسي</span>)
              للاعتماد والترحيل.
            </span>
          </div>
          <span className="font-mono font-bold bg-white px-2 py-1 rounded text-blue-800 border border-blue-200 shrink-0">
            {pendingEntries.length} قيد بانتظار الاعتماد
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث برقم القيد، البيان، المنفذ، المعتمد، مركز التكلفة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'All', label: 'كافة القيود' },
            { id: 'بانتظار الاعتماد', label: `بانتظار الاعتماد (${pendingEntries.length})` },
            { id: 'معتمد ومرحل', label: 'معتمد ومرحل (Posted)' },
            { id: 'مسودة', label: 'مسودة (Draft)' },
            { id: 'مرفوض', label: 'مرفوض (Rejected)' },
          ].map((st) => {
            const isSelected = statusFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as any)}
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

      {/* Main Journal Entries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
              <tr>
                <th className="py-3 px-4">رقم القيد</th>
                <th className="py-3 px-4">نوع القيد</th>
                <th className="py-3 px-4">تاريخ الترحيل</th>
                <th className="py-3 px-4">البيان العام والملاحظات</th>
                <th className="py-3 px-4">مركز التكلفة والأبعاد</th>
                <th className="py-3 px-4">منفذ القيد (Maker)</th>
                <th className="py-3 px-4">المعتمد (Checker)</th>
                <th className="py-3 px-4 text-left">إجمالي القيد</th>
                <th className="py-3 px-4 text-center">الحالة</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filtered.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    <button
                      onClick={() => setPreviewEntry(j)}
                      className="hover:underline text-indigo-700 font-bold"
                    >
                      {j.entryNo}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{j.entryType}</td>
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-800">{j.postingDate}</div>
                    <div className="text-[10px] text-amber-800 font-medium">{j.hijriPostingDate}</div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-medium text-slate-900 truncate" title={j.remarksAr}>
                      {j.remarksAr}
                    </div>
                    {j.rejectionReason && (
                      <div className="text-[11px] font-bold text-red-600 bg-red-50 p-1 rounded mt-1">
                        سبب الرفض: {j.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {j.costCenterAr || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {j.createdByUserNameAr || 'محاسب تكاليف'}
                  </td>
                  <td className="py-3 px-4">
                    {j.approvedByUserNameAr ? (
                      <div>
                        <div className="text-emerald-800 font-bold text-[11px]">{j.approvedByUserNameAr}</div>
                        {j.approvedAt && <div className="text-[10px] text-slate-400 font-mono">{j.approvedAt}</div>}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">قيد الانتظار</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 text-left">
                    {j.totalDebit.toLocaleString()} {j.currency}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        j.status === 'معتمد ومرحل'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : j.status === 'بانتظار الاعتماد'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                          : j.status === 'مرفوض'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {j.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setPreviewEntry(j)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-600"
                        title="معاينة القيد"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* If pending and current user can approve */}
                      {j.status === 'بانتظار الاعتماد' && currentUser.canApproveFinance && (
                        <>
                          <button
                            onClick={() => handleApprove(j)}
                            className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="اعتماد وترحيل"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenRejectModal(j)}
                            className="p-1 rounded bg-red-50 text-red-700 hover:bg-red-100"
                            title="رفض القيد"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {/* Edit option */}
                      {(j.status === 'مسودة' || j.status === 'مرفوض') && (
                        <button
                          onClick={() => {
                            setActiveJournalEntry(j);
                            setActiveView('new-jv');
                          }}
                          className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                        >
                          تعديل
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL PREVIEW MODAL */}
      {previewEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-indigo-700" />
                <div>
                  <h3 className="font-mono font-black text-slate-900 text-sm">
                    سند قيد يومية: {previewEntry.entryNo}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-sans">{previewEntry.entryType}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewEntry(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Approval status banner */}
              <div
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  previewEntry.status === 'معتمد ومرحل'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : previewEntry.status === 'بانتظار الاعتماد'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : previewEntry.status === 'مرفوض'
                    ? 'bg-red-50 border-red-200 text-red-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div>
                  <span className="font-bold">حالة الاعتماد المالي:</span> {previewEntry.status}
                  {previewEntry.approvedByUserNameAr && (
                    <div className="text-[11px] mt-0.5">
                      تم الاعتماد بواسطة: <strong>{previewEntry.approvedByUserNameAr}</strong> بتاريخ {previewEntry.approvedAt}
                    </div>
                  )}
                  {previewEntry.rejectionReason && (
                    <div className="text-[11px] text-red-700 mt-0.5 font-bold">
                      سبب الرفض: {previewEntry.rejectionReason}
                    </div>
                  )}
                </div>
                <div className="text-[11px]">
                  منشئ القيد: <strong>{previewEntry.createdByUserNameAr}</strong>
                </div>
              </div>

              {/* Remarks & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 font-bold block mb-1">البيان العام:</span>
                  <p className="font-bold text-slate-800">{previewEntry.remarksAr}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block mb-1">تاريخ الترحيل:</span>
                  <p className="font-mono font-bold text-slate-800">
                    {previewEntry.postingDate} ({previewEntry.hijriPostingDate})
                  </p>
                </div>
              </div>

              {/* Lines Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">الحساب المحاسبي</th>
                      <th className="py-2.5 px-3">مركز التكلفة والأبعاد</th>
                      <th className="py-2.5 px-3">البيان التحليلي</th>
                      <th className="py-2.5 px-3 text-left">مدين (Debit)</th>
                      <th className="py-2.5 px-3 text-left">دائن (Credit)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewEntry.lines.map((ln) => (
                      <tr key={ln.id}>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{ln.accountAr}</td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">
                          <div>{ln.costCenterAr || previewEntry.costCenterAr || '-'}</div>
                          {ln.linkedEquipment && (
                            <span className="text-[10px] text-amber-800 bg-amber-50 px-1 rounded">
                              {ln.linkedEquipment}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{ln.lineRemark || '-'}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-left">
                          {ln.debit > 0 ? ln.debit.toLocaleString() : '-'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-left">
                          {ln.credit > 0 ? ln.credit.toLocaleString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-mono font-bold border-t border-slate-200 text-xs">
                    <tr>
                      <td colSpan={3} className="py-2 px-3 text-right">الإجمالي:</td>
                      <td className="py-2 px-3 text-left text-slate-900">
                        {previewEntry.totalDebit.toLocaleString()} {previewEntry.currency}
                      </td>
                      <td className="py-2 px-3 text-left text-slate-900">
                        {previewEntry.totalCredit.toLocaleString()} {previewEntry.currency}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Tafqeet */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                <div>
                  <span className="text-slate-500 font-bold">المبلغ بالحروف بالعربية: </span>
                  <span className="font-bold text-slate-800">{previewEntry.amountInWordsAr}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">In English: </span>
                  <span className="font-mono text-slate-700">{previewEntry.amountInWordsEn}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-white"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة السند</span>
              </button>

              <div className="flex items-center gap-2">
                {previewEntry.status === 'بانتظار الاعتماد' && currentUser.canApproveFinance && (
                  <>
                    <button
                      onClick={() => handleOpenRejectModal(previewEntry)}
                      className="px-3 py-2 text-xs font-bold rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                    >
                      رفض القيد
                    </button>
                    <button
                      onClick={() => handleApprove(previewEntry)}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                    >
                      اعتماد وترحيل لدفتر الأستاذ
                    </button>
                  </>
                )}
                <button
                  onClick={() => setPreviewEntry(null)}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-300 text-slate-700 hover:bg-white"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 bg-red-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-sm">رفض اعتماد قيد اليومية: {rejectingEntry.entryNo}</h3>
              </div>
              <button
                onClick={() => setRejectingEntry(null)}
                className="p-1 rounded hover:bg-red-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-5 space-y-4">
              <p className="text-xs text-slate-600">
                يرجى كتابة سبب عدم اعتماد هذا القيد المحاسبي ليتم إرساله للمنفذ (
                <strong>{rejectingEntry.createdByUserNameAr}</strong>) لتصحيحه:
              </p>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  سبب الرفض والملاحظات التصحيحية *
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="مثال: يرجى إرفاق فاتورة التوريد الأصلية وتعديل مركز تكلفة المعدة إلى كود EC-500-04..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 bg-slate-50"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingEntry(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  تأكيد الرفض وإعادة القيد للمنفذ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
