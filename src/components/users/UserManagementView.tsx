import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Check,
  Shield,
  Building,
  Phone,
  Mail,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { UserProfile } from '../../types/erp';

export const UserManagementView: React.FC = () => {
  const { users, saveUser, roles, addRole, showToast, t } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Add Role Modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRoleNameAr, setNewRoleNameAr] = useState('');
  const [newRoleNameEn, setNewRoleNameEn] = useState('');
  const [newRoleDeptAr, setNewRoleDeptAr] = useState('إدارة العمليات والتشغيل الميداني');
  const [newRoleDescAr, setNewRoleDescAr] = useState('');
  const [roleCanApproveFinance, setRoleCanApproveFinance] = useState(false);
  const [roleCanIssueGatePermits, setRoleCanIssueGatePermits] = useState(false);

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleAr, setRoleAr] = useState('');
  const [departmentAr, setDepartmentAr] = useState('');
  const [assignedDepotAr, setAssignedDepotAr] = useState('');
  const [canApproveFinance, setCanApproveFinance] = useState(false);
  const [canIssueGatePermits, setCanIssueGatePermits] = useState(false);
  const [status, setStatus] = useState<'نشط' | 'معطل'>('نشط');

  const handleOpenAddRole = () => {
    setNewRoleNameAr('');
    setNewRoleNameEn('');
    setNewRoleDeptAr('إدارة العمليات والتشغيل الميداني');
    setNewRoleDescAr('');
    setRoleCanApproveFinance(false);
    setRoleCanIssueGatePermits(false);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleNameAr.trim()) {
      showToast('يرجى كتابة اسم الدور الوظيفي بالعربية');
      return;
    }

    const created = addRole({
      nameAr: newRoleNameAr.trim(),
      nameEn: newRoleNameEn.trim(),
      descriptionAr: newRoleDescAr.trim(),
      departmentAr: newRoleDeptAr,
      canApproveFinanceDefault: roleCanApproveFinance,
      canIssueGatePermitsDefault: roleCanIssueGatePermits,
    });

    // If currently creating a user, auto-select this new role
    setRoleAr(created.nameAr);
    setDepartmentAr(created.departmentAr || departmentAr);
    if (created.canApproveFinanceDefault) setCanApproveFinance(true);
    if (created.canIssueGatePermitsDefault) setCanIssueGatePermits(true);

    setIsRoleModalOpen(false);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setNameAr('');
    setNameEn('');
    setEmail('@egyptcranes.com');
    setPhone('+20 1');
    setRoleAr('مهندس تشغيل وصيانة أوناش');
    setDepartmentAr('إدارة العمليات والتشغيل الميداني');
    setAssignedDepotAr('المستودع الرئيسي - طريق السويس');
    setCanApproveFinance(false);
    setCanIssueGatePermits(true);
    setStatus('نشط');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserProfile) => {
    setEditingUser(user);
    setNameAr(user.nameAr);
    setNameEn(user.nameEn);
    setEmail(user.email);
    setPhone(user.phone);
    setRoleAr(user.roleAr);
    setDepartmentAr(user.departmentAr);
    setAssignedDepotAr(user.assignedDepotAr);
    setCanApproveFinance(user.canApproveFinance);
    setCanIssueGatePermits(user.canIssueGatePermits);
    setStatus(user.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !email.trim()) return;

    const updatedUser: UserProfile = {
      id: editingUser?.id || `usr-${Date.now()}`,
      nameAr,
      nameEn,
      email,
      phone,
      roleAr,
      departmentAr,
      assignedDepotAr,
      canApproveFinance,
      canIssueGatePermits,
      status,
    };

    saveUser(updatedUser);
    setIsModalOpen(false);
  };

  const filtered = users.filter(
    (u) =>
      u.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.roleAr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('Administration', 'إدارة النظام والمستخدمين', 'Administration')}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              دليل المستخدمين
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            <span>{t('User Management', 'واجهة تعديل وبيانات مستخدمي النظام', 'User Management')}</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Requested button: إضافة دور وظيفي */}
          <button
            onClick={handleOpenAddRole}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 border border-purple-300 transition-colors shadow-2xs"
          >
            <UserCheck className="w-4 h-4 text-purple-700" />
            <span>إضافة دور وظيفي جديد (+)</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مستخدم جديد (+)</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو البريد أو المسمى الوظيفي..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 focus:outline-none focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-bold hidden sm:inline">
          إجمالي المستخدمين: {users.length} مستخدم
        </span>
      </div>

      {/* Users Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Color Accent */}
            <div
              className="absolute top-0 right-0 left-0 h-1"
              style={{ backgroundColor: user.status === 'نشط' ? 'var(--primary-color)' : '#94a3b8' }}
            />

            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xs"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  {user.nameAr.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    user.status === 'نشط' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">{user.nameAr}</h3>
                <p className="text-[11px] text-slate-400 font-mono" dir="ltr">{user.nameEn}</p>
                <div className="text-xs font-bold text-blue-800 mt-1">{user.roleAr}</div>
                <div className="text-[11px] text-slate-500">{user.departmentAr}</div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono truncate" dir="ltr">{user.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono" dir="ltr">{user.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{user.assignedDepotAr}</span>
                </div>
              </div>

              {/* Special Badges */}
              <div className="flex flex-wrap gap-1 pt-1">
                {user.canApproveFinance && (
                  <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-semibold">
                    اعتماد مالي
                  </span>
                )}
                {user.canIssueGatePermits && (
                  <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded font-semibold">
                    تصاريح بوابات
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleOpenEdit(user)}
              className="w-full mt-2 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>تعديل بيانات المستخدم</span>
            </button>
          </div>
        ))}
      </div>

      {/* Edit / Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              {editingUser ? 'تعديل بيانات وصلاحيات المستخدم' : 'إضافة مستخدم جديد للنظام'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الاسم بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الاسم بالإنجليزية (EN)</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف / واتساب</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">الدور الوظيفي (Role) *</label>
                    <button
                      type="button"
                      onClick={handleOpenAddRole}
                      className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>دور جديد</span>
                    </button>
                  </div>
                  <select
                    value={roleAr}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      setRoleAr(selectedVal);
                      const matched = roles.find((r) => r.nameAr === selectedVal);
                      if (matched) {
                        if (matched.departmentAr && !departmentAr) {
                          setDepartmentAr(matched.departmentAr);
                        }
                        if (matched.canApproveFinanceDefault !== undefined) {
                          setCanApproveFinance(matched.canApproveFinanceDefault);
                        }
                        if (matched.canIssueGatePermitsDefault !== undefined) {
                          setCanIssueGatePermits(matched.canIssueGatePermitsDefault);
                        }
                      }
                    }}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.nameAr}>
                        {r.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">القسم / الإدارة</label>
                  <input
                    type="text"
                    value={departmentAr}
                    onChange={(e) => setDepartmentAr(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المستودع / الفرع المسند إليه</label>
                <input
                  type="text"
                  value={assignedDepotAr}
                  onChange={(e) => setAssignedDepotAr(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Toggles for Permissions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block">الصلاحيات التنفيذية الخاصة:</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={canApproveFinance}
                    onChange={(e) => setCanApproveFinance(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>منح صلاحية الاعتماد المالي النهائي لقيود اليومية والفواتير</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={canIssueGatePermits}
                    onChange={(e) => setCanIssueGatePermits(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>منح صلاحية إصدار تصاريح بوابات دخول وخروج الأوناش</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">الحالة:</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 font-bold"
                  >
                    <option value="نشط">نشط (Active)</option>
                    <option value="معطل">معطل (Suspended)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ROLE MODAL */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 bg-purple-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-900">
                <UserCheck className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-sm">إضافة دور وظيفي جديد (Create Job Role)</h3>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1 rounded hover:bg-purple-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  اسم الدور الوظيفي (بالعربية) *
                </label>
                <input
                  type="text"
                  required
                  value={newRoleNameAr}
                  onChange={(e) => setNewRoleNameAr(e.target.value)}
                  placeholder="مثال: مشرف تشغيل ورفع أوناش، مراجع حسابات، مسؤول سلامة"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 bg-slate-50 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  اسم الدور بالإنجليزية (Role Name in English)
                </label>
                <input
                  type="text"
                  value={newRoleNameEn}
                  onChange={(e) => setNewRoleNameEn(e.target.value)}
                  placeholder="e.g. Field Lifting Supervisor, HSE Officer, Auditor"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 bg-slate-50 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  الإدارة أو القسم التابع له
                </label>
                <select
                  value={newRoleDeptAr}
                  onChange={(e) => setNewRoleDeptAr(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="إدارة العمليات والتشغيل الميداني">إدارة العمليات والتشغيل الميداني</option>
                  <option value="الشؤون المالية وقسم التكاليف">الشؤون المالية وقسم التكاليف</option>
                  <option value="قسم الصيانة والدعم الفني">قسم الصيانة والدعم الفني</option>
                  <option value="الأمن والسلامة والجودة HSE">الأمن والسلامة والجودة HSE</option>
                  <option value="إدارة المبيعات والتعاقدات">إدارة المبيعات والتعاقدات</option>
                  <option value="الإدارة العليا">الإدارة العليا</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  وصف المهام والمسؤوليات
                </label>
                <textarea
                  rows={2}
                  value={newRoleDescAr}
                  onChange={(e) => setNewRoleDescAr(e.target.value)}
                  placeholder="موجز عن المهام التي يمارسها صاحب هذا الدور في النظام..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                ></textarea>
              </div>

              {/* Default flags */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-700 block">الصلاحيات الافتراضية للنظام:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="user-role-approve-finance"
                    checked={roleCanApproveFinance}
                    onChange={(e) => setRoleCanApproveFinance(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <label htmlFor="user-role-approve-finance" className="text-xs text-slate-700 cursor-pointer">
                    منح صلاحية اعتماد القيود اليومية والفواتير المالية (Checker Authority)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="user-role-issue-permits"
                    checked={roleCanIssueGatePermits}
                    onChange={(e) => setRoleCanIssueGatePermits(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <label htmlFor="user-role-issue-permits" className="text-xs text-slate-700 cursor-pointer">
                    منح صلاحية إصدار تصاريح حركة الأوناش عبر البوابات الأمنية
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                >
                  حفظ وإضافة الدور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
