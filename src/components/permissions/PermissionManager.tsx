import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Plus,
  Check,
  Filter,
  Search,
  Info,
  UserCheck,
  Users,
  Building,
  Layers,
  X,
  Trash2,
  Copy,
  AlertCircle,
  Eye,
  Edit3,
  PlusCircle,
  CheckCircle2,
  Ban,
  RotateCcw,
  Lock,
  Unlock,
  Sparkles,
  FileText,
  Sliders,
  CheckCheck,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { RolePermission, UserRole } from '../../types/erp';

// Modern Interactive Switch Component (Replacing legacy checkboxes)
interface ModernSwitchProps {
  checked: boolean;
  onChange: () => void;
  variant?: 'emerald' | 'amber' | 'purple' | 'sky';
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md';
}

const ModernSwitch: React.FC<ModernSwitchProps> = ({
  checked,
  onChange,
  variant = 'emerald',
  disabled = false,
  label,
  size = 'sm',
}) => {
  const isAmber = variant === 'amber';
  const isPurple = variant === 'purple';
  const isSky = variant === 'sky';

  const activeBg = isAmber
    ? 'bg-amber-500 shadow-amber-500/30'
    : isPurple
    ? 'bg-purple-600 shadow-purple-600/30'
    : isSky
    ? 'bg-sky-500 shadow-sky-500/30'
    : 'bg-emerald-600 shadow-emerald-600/30';

  const activeRing = isAmber
    ? 'focus:ring-amber-400'
    : isPurple
    ? 'focus:ring-purple-400'
    : isSky
    ? 'focus:ring-sky-400'
    : 'focus:ring-emerald-400';

  const activeColor = isAmber
    ? 'text-amber-600'
    : isPurple
    ? 'text-purple-600'
    : isSky
    ? 'text-sky-600'
    : 'text-emerald-600';

  return (
    <button
      type="button"
      role="switch"
      dir="ltr"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer select-none ${
        size === 'sm' ? 'w-9 h-5 p-0.5' : 'w-11 h-6 p-0.5'
      } ${
        checked
          ? `${activeBg} shadow-sm ring-1 ring-white/20`
          : 'bg-slate-200 hover:bg-slate-300 border border-slate-300/60'
      } ${activeRing} ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
      title={label || (checked ? 'مفعل (انقر للتعطيل)' : 'معطل (انقر للتفعيل)')}
    >
      <span
        className={`pointer-events-none inline-flex items-center justify-center rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
          size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
        } ${
          checked
            ? size === 'sm'
              ? 'translate-x-4'
              : 'translate-x-5'
            : 'translate-x-0'
        }`}
      >
        {checked ? (
          <Check className={`${size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} ${activeColor} stroke-[3]`} />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        )}
      </span>
    </button>
  );
};

export const PermissionManager: React.FC = () => {
  const {
    permissions,
    togglePermission,
    addPermissionRule,
    roles,
    addRole,
    deleteRole,
    users,
    showToast,
    t,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'matrix' | 'roles'>('matrix');
  const [selectedDocType, setSelectedDocType] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Role Modal State
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleNameAr, setNewRoleNameAr] = useState('');
  const [newRoleNameEn, setNewRoleNameEn] = useState('');
  const [newRoleDeptAr, setNewRoleDeptAr] = useState('إدارة العمليات والتشغيل الميداني');
  const [newRoleDescAr, setNewRoleDescAr] = useState('');
  const [copyFromRole, setCopyFromRole] = useState('');
  const [roleCanApproveFinance, setRoleCanApproveFinance] = useState(false);
  const [roleCanIssueGatePermits, setRoleCanIssueGatePermits] = useState(false);

  // Add Rule Modal State
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [ruleDocTypeAr, setRuleDocTypeAr] = useState('Crane Contract (عقد تأجير رافعة)');
  const [ruleRoleAr, setRuleRoleAr] = useState('');
  const [ruleRead, setRuleRead] = useState(true);
  const [ruleWrite, setRuleWrite] = useState(true);
  const [ruleCreate, setRuleCreate] = useState(true);
  const [ruleDelete, setRuleDelete] = useState(false);
  const [ruleSubmit, setRuleSubmit] = useState(false);
  const [ruleCancel, setRuleCancel] = useState(false);
  const [ruleAmend, setRuleAmend] = useState(false);
  const [ruleOnlyIfCreator, setRuleOnlyIfCreator] = useState(false);

  const docTypes = useMemo(() => Array.from(new Set(permissions.map((p) => p.docTypeAr))), [permissions]);
  const uniqueRolesInPerms = useMemo(() => Array.from(new Set(permissions.map((p) => p.roleAr))), [permissions]);

  // Filtered permission matrix list
  const filtered = useMemo(() => {
    return permissions.filter((p) => {
      if (selectedDocType !== 'All' && p.docTypeAr !== selectedDocType) return false;
      if (selectedRole !== 'All' && p.roleAr !== selectedRole) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesDoc = p.docTypeAr.toLowerCase().includes(q) || p.docTypeEn.toLowerCase().includes(q);
        const matchesRole = p.roleAr.toLowerCase().includes(q) || p.roleEn.toLowerCase().includes(q);
        if (!matchesDoc && !matchesRole) return false;
      }
      return true;
    });
  }, [permissions, selectedDocType, selectedRole, searchQuery]);

  // Bulk Grant or Revoke for an entire row
  const handleBulkRowToggle = (id: string, enableAll: boolean) => {
    const item = permissions.find((p) => p.id === id);
    if (!item) return;
    const fields: (keyof RolePermission)[] = ['read', 'write', 'create', 'delete', 'submit', 'cancel', 'amend'];
    fields.forEach((f) => {
      if (item[f] !== enableAll) {
        togglePermission(id, f);
      }
    });
    showToast(enableAll ? 'تم تفعيل كافة الصلاحيات لهذا المستند' : 'تم تعطيل كافة الصلاحيات لهذا المستند');
  };

  const handleOpenAddRole = () => {
    setNewRoleNameAr('');
    setNewRoleNameEn('');
    setNewRoleDeptAr('إدارة العمليات والتشغيل الميداني');
    setNewRoleDescAr('');
    setCopyFromRole('');
    setRoleCanApproveFinance(false);
    setRoleCanIssueGatePermits(false);
    setIsAddRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleNameAr.trim()) {
      showToast('يرجى إدخال اسم الدور الوظيفي بالعربية');
      return;
    }

    addRole({
      nameAr: newRoleNameAr.trim(),
      nameEn: newRoleNameEn.trim(),
      descriptionAr: newRoleDescAr.trim(),
      departmentAr: newRoleDeptAr,
      canApproveFinanceDefault: roleCanApproveFinance,
      canIssueGatePermitsDefault: roleCanIssueGatePermits,
      copyFromRole: copyFromRole || undefined,
    });

    setIsAddRoleModalOpen(false);
  };

  const handleOpenAddRule = () => {
    setRuleDocTypeAr(docTypes[0] || 'Crane Contract (عقد تأجير رافعة)');
    setRuleRoleAr(roles[0]?.nameAr || uniqueRolesInPerms[0] || '');
    setRuleRead(true);
    setRuleWrite(true);
    setRuleCreate(true);
    setRuleDelete(false);
    setRuleSubmit(false);
    setRuleCancel(false);
    setRuleAmend(false);
    setRuleOnlyIfCreator(false);
    setIsAddRuleModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleRoleAr) {
      showToast('يرجى اختيار الدور الوظيفي');
      return;
    }

    const matchedRole = roles.find((r) => r.nameAr === ruleRoleAr);

    addPermissionRule({
      docTypeAr: ruleDocTypeAr,
      docTypeEn: ruleDocTypeAr.split('(')[0].trim(),
      roleAr: ruleRoleAr,
      roleEn: matchedRole?.nameEn || ruleRoleAr,
      read: ruleRead,
      write: ruleWrite,
      create: ruleCreate,
      delete: ruleDelete,
      submit: ruleSubmit,
      cancel: ruleCancel,
      amend: ruleAmend,
      onlyIfCreator: ruleOnlyIfCreator,
    });

    setIsAddRuleModalOpen(false);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6 select-none font-sans">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              {t('System Security', 'أمن وصلاحيات النظام', 'System Security')}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              C-Style RBAC Enterprise
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm shadow-purple-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>{t('Role Permission Manager', 'مدير صلاحيات المستخدمين والأدوار الوظيفية', 'Role Permission Manager')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة متقدمة لسياسات الوصول وأذونات المستندات والتحكم بالمستويات الوظيفية (RBAC Matrix)
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAddRole}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة دور وظيفي جديد (+)</span>
          </button>

          <button
            onClick={handleOpenAddRule}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>إضافة قاعدة صلاحية (+)</span>
          </button>

          <button
            onClick={() => showToast('تم تطبيق قواعد الأمان والصلاحيات وتحديثها فورياً للنظام!')}
            className="px-4 py-2 text-xs font-bold rounded-xl text-white shadow-sm hover:brightness-110 transition-all active:scale-95 cursor-pointer"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            تطبيق وحفظ الصلاحيات
          </button>
        </div>
      </div>

      {/* Modern Metrics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400">قواعد الصلاحيات الفعالة</div>
            <div className="text-lg font-black text-slate-900 font-mono">{permissions.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400">الأدوار الوظيفية المعرفة</div>
            <div className="text-lg font-black text-slate-900 font-mono">{roles.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400">المستندات المحمية (DocTypes)</div>
            <div className="text-lg font-black text-slate-900 font-mono">{docTypes.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400">المستخدمين المسندين</div>
            <div className="text-lg font-black text-slate-900 font-mono">{users.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-2 pt-2 rounded-t-xl border-t border-x overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'matrix'
              ? 'border-purple-600 text-purple-900 bg-purple-50/60 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-600" />
          <span>مصفوفة الصلاحيات (Role Permission Matrix)</span>
          <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-mono font-bold">
            {permissions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'roles'
              ? 'border-purple-600 text-purple-900 bg-purple-50/60 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4 text-purple-600" />
          <span>دليل وتوصيف الأدوار الوظيفية (Job Roles Catalog)</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">
            {roles.length}
          </span>
        </button>
      </div>

      {activeTab === 'matrix' ? (
        <div className="space-y-4">
          {/* Smart Filter & Search Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3 w-full">
              {/* Search input */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث سريع بالمستند أو الدور الوظيفي..."
                  className="w-full text-xs pr-9 pl-3 py-2 bg-slate-50 border border-slate-300/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* DocType filter */}
              <div className="w-full sm:w-56 shrink-0">
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300/80 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-bold text-slate-700"
                >
                  <option value="All">جميع المستندات ({docTypes.length})</option>
                  {docTypes.map((dt) => (
                    <option key={dt} value={dt}>
                      {dt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role filter */}
              <div className="w-full sm:w-52 shrink-0">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300/80 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-bold text-slate-700"
                >
                  <option value="All">جميع الأدوار الوظيفية ({roles.length})</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.nameAr}>
                      {r.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick status counter */}
            <div className="text-xs font-mono text-slate-500 shrink-0">
              تم عرض <strong className="text-slate-900">{filtered.length}</strong> من إجمالي {permissions.length} قاعدة
            </div>
          </div>

          {/* Permissions Matrix Modern Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                {/* Table Header with rich iconography */}
                <thead className="bg-slate-900 text-slate-200 font-bold whitespace-nowrap border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 text-right">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <FileText className="w-4 h-4 text-sky-400" />
                        <span>نوع المستند (DocType)</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-right">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <UserCheck className="w-4 h-4 text-purple-400" />
                        <span>الدور الوظيفي (Role)</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-sky-300 font-bold">
                          <Eye className="w-3.5 h-3.5" />
                          <span>قراءة</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">Read</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-indigo-300 font-bold">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>كتابة</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">Write</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-emerald-300 font-bold">
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>إنشاء</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">Create</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-rose-300 font-bold">
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">Delete</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-teal-300 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>اعتماد</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">Submit</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-red-300 font-bold">
                          <Ban className="w-3.5 h-3.5" />
                          <span>إلغاء</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">Cancel</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-amber-300 font-bold">
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">Amend</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Lock className="w-3.5 h-3.5" />
                          <span>قيد المنشئ فقط</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">Only If Creator</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center text-slate-400">إجراءات سريعة</th>
                  </tr>
                </thead>

                {/* Table Body with Modern Interactive Toggle Switches */}
                <tbody className="divide-y divide-slate-200/80 bg-white">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <div className="font-bold text-slate-600">لا توجد قواعد صلاحية مطابقة لخيارات البحث</div>
                        <div className="text-xs text-slate-400 mt-0.5">يرجى تعديل الفلتر أو إضافة قاعدة جديدة (+)</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => {
                      const isEven = idx % 2 === 0;
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-purple-50/40 transition-colors group ${
                            isEven ? 'bg-white' : 'bg-slate-50/50'
                          }`}
                        >
                          {/* DocType */}
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                              <span className="font-bold">{item.docTypeAr}</span>
                            </div>
                            <span className="text-[10px] font-sans text-slate-400 block pr-4">
                              {item.docTypeEn}
                            </span>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4 text-slate-700 font-semibold">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200/70 font-bold text-xs">
                              {item.roleAr}
                            </span>
                          </td>

                          {/* 1. Read (Modern Switch) */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex justify-center">
                              <ModernSwitch
                                checked={item.read}
                                onChange={() => togglePermission(item.id, 'read')}
                                variant="emerald"
                                label="صلاحية القراءة"
                              />
                            </div>
                          </td>

                          {/* 2. Write (Modern Switch) */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex justify-center">
                              <ModernSwitch
                                checked={item.write}
                                onChange={() => togglePermission(item.id, 'write')}
                                variant="emerald"
                                label="صلاحية التعديل والكتابة"
                              />
                            </div>
                          </td>

                          {/* 3. Create (Modern Switch) */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex justify-center">
                              <ModernSwitch
                                checked={item.create}
                                onChange={() => togglePermission(item.id, 'create')}
                                variant="emerald"
                                label="صلاحية إنشاء مستند جديد"
                              />
                            </div>
                          </td>

                          {/* 4. Delete (Modern Switch) */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex justify-center">
                              <ModernSwitch
                                checked={item.delete}
                                onChange={() => togglePermission(item.id, 'delete')}
                                variant="emerald"
                                label="صلاحية الحذف"
                              />
                            </div>
                          </td>

                          {/* 5. Submit (Modern Switch) */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex justify-center">
                              <ModernSwitch
                                checked={item.submit}
                                onChange={() => togglePermission(item.id, 'submit')}
                                variant="emerald"
                                label="صلاحية الاعتماد والترحيل المالي"
                              />
                            </div>
                          </td>

                          {/* 6. Cancel (Modern Switch) */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex justify-center">
                              <ModernSwitch
                                checked={item.cancel}
                                onChange={() => togglePermission(item.id, 'cancel')}
                                variant="emerald"
                                label="صلاحية إلغاء المستند"
                              />
                            </div>
                          </td>

                          {/* 7. Amend (Modern Switch) */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex justify-center">
                              <ModernSwitch
                                checked={item.amend}
                                onChange={() => togglePermission(item.id, 'amend')}
                                variant="emerald"
                                label="صلاحية تعديل المستند المرحل"
                              />
                            </div>
                          </td>

                          {/* 8. Only If Creator (Modern Switch in Amber Warning Accent) */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center">
                              <ModernSwitch
                                checked={item.onlyIfCreator}
                                onChange={() => togglePermission(item.id, 'onlyIfCreator')}
                                variant="amber"
                                label="قيد الصلاحية: فقط إذا كان المستخدم هو منشئ السجل"
                              />
                            </div>
                          </td>

                          {/* Quick Row Bulk Action (Grant all / Revoke all) */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleBulkRowToggle(item.id, true)}
                                title="منح كافة الصلاحيات لهذا المستند (Grant All)"
                                className="p-1 rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold cursor-pointer"
                              >
                                تفعيل الكل
                              </button>
                              <button
                                type="button"
                                onClick={() => handleBulkRowToggle(item.id, false)}
                                title="تعطيل كافة الصلاحيات لهذا المستند (Revoke All)"
                                className="p-1 rounded-md text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[10px] font-bold cursor-pointer"
                              >
                                تعطيل
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Defined Roles Catalog Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">دليل الأدوار الوظيفية وسياسات الأمان</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                يمكنك إنشاء وتعديل وحذف الأدوار الوظيفية المخصصة وإسنادها للمستخدمين مع ضبط صلاحياتهم التلقائية
              </p>
            </div>
            <button
              onClick={handleOpenAddRole}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة دور وظيفي جديد (+)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r) => {
              const assignedCount = users.filter((u) => u.roleAr === r.nameAr).length;
              return (
                <div
                  key={r.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold border border-purple-200">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{r.nameAr}</h3>
                          <span className="text-[11px] font-sans text-slate-400 block">{r.nameEn}</span>
                        </div>
                      </div>
                      {r.isCustom && (
                        <button
                          onClick={() => deleteRole(r.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف هذا الدور"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                      {r.descriptionAr || 'لا يوجد وصف مخصص لهذا الدور'}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                      {r.departmentAr && (
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium border border-slate-200">
                          {r.departmentAr}
                        </span>
                      )}
                      {r.canApproveFinanceDefault && (
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md font-bold border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>اعتماد مالي</span>
                        </span>
                      )}
                      {r.canIssueGatePermitsDefault && (
                        <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md font-bold border border-blue-200 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>تصاريح بوابة</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium">
                      المستخدمون المسندون: <strong className="text-slate-900 font-mono">{assignedCount}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRole(r.nameAr);
                        setActiveTab('matrix');
                      }}
                      className="text-purple-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>تعديل الصلاحيات</span>
                      <span>←</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== ADD ROLE MODAL ==================== */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 bg-purple-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-900">
                <UserCheck className="w-5 h-5 text-purple-700" />
                <h3 className="font-black text-sm">إضافة دور وظيفي جديد (Create New Job Role)</h3>
              </div>
              <button
                onClick={() => setIsAddRoleModalOpen(false)}
                className="p-1 rounded-lg hover:bg-purple-100 text-slate-500 transition-colors cursor-pointer"
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
                  placeholder="مثال: مشرف تشغيل ورفع ميداني، مراجع حسابات، مهندس جودة"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-slate-50 font-bold"
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
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-slate-50 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  الإدارة أو القسم التابع له
                </label>
                <select
                  value={newRoleDeptAr}
                  onChange={(e) => setNewRoleDeptAr(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white font-medium"
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
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  نسخ الصلاحيات الأولية من دور وظيفي قائم (اختياري)
                </label>
                <select
                  value={copyFromRole}
                  onChange={(e) => setCopyFromRole(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="">-- صلاحيات قراءة افتراضية فقط --</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.nameAr}>
                      نسخ صلاحيات: {r.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modern Feature Switch Cards (Replacing Checkboxes) */}
              <div className="space-y-2.5 pt-3 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  الصلاحيات القيادية الافتراضية للنظام:
                </label>

                {/* Switch Card 1: Finance Approval */}
                <div
                  onClick={() => setRoleCanApproveFinance(!roleCanApproveFinance)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    roleCanApproveFinance
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        roleCanApproveFinance ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        صلاحية اعتماد القيود والفواتير وتجاوز الموازنة (Checker Authority)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        منح الصلاحية لاعتماد وترحيل العمليات المالية والقيود اليومية
                      </div>
                    </div>
                  </div>
                  <ModernSwitch
                    checked={roleCanApproveFinance}
                    onChange={() => setRoleCanApproveFinance(!roleCanApproveFinance)}
                    variant="emerald"
                    size="md"
                  />
                </div>

                {/* Switch Card 2: Gate Permits */}
                <div
                  onClick={() => setRoleCanIssueGatePermits(!roleCanIssueGatePermits)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    roleCanIssueGatePermits
                      ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        roleCanIssueGatePermits ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        صلاحية إصدار تصاريح حركة الأوناش عبر البوابات الأمنية
                      </div>
                      <div className="text-[11px] text-slate-500">
                        توقيع وإصدار تصاريح دخول وخروج المعدات والشاحنات للمواقع
                      </div>
                    </div>
                  </div>
                  <ModernSwitch
                    checked={roleCanIssueGatePermits}
                    onChange={() => setRoleCanIssueGatePermits(!roleCanIssueGatePermits)}
                    variant="purple"
                    size="md"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddRoleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  حفظ وإضافة الدور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD PERMISSION RULE MODAL ==================== */}
      {isAddRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="w-5 h-5 text-purple-700" />
                <h3 className="font-black text-sm">إضافة قاعدة صلاحية لمستند (Add Permission Rule)</h3>
              </div>
              <button
                onClick={() => setIsAddRuleModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">نوع المستند (DocType) *</label>
                <select
                  value={ruleDocTypeAr}
                  onChange={(e) => setRuleDocTypeAr(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                >
                  {docTypes.map((dt) => (
                    <option key={dt} value={dt}>
                      {dt}
                    </option>
                  ))}
                  <option value="Egypt Cranes Fleet (أسطول الأوناش)">Egypt Cranes Fleet (أسطول الأوناش)</option>
                  <option value="System Backup (النسخ الاحتياطي)">System Backup (النسخ الاحتياطي)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الدور الوظيفي (Role) *</label>
                <select
                  value={ruleRoleAr}
                  onChange={(e) => setRuleRoleAr(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-purple-900"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.nameAr}>
                      {r.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modern Permission Chips Switch Grid */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">تحديد الأذونات الممنوحة:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Read */}
                  <div
                    onClick={() => setRuleRead(!ruleRead)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      ruleRead
                        ? 'bg-sky-50/70 border-sky-300 text-sky-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-sky-600" />
                      <span>قراءة (Read)</span>
                    </div>
                    <ModernSwitch checked={ruleRead} onChange={() => setRuleRead(!ruleRead)} variant="sky" />
                  </div>

                  {/* Write */}
                  <div
                    onClick={() => setRuleWrite(!ruleWrite)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      ruleWrite
                        ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-indigo-600" />
                      <span>تعديل (Write)</span>
                    </div>
                    <ModernSwitch checked={ruleWrite} onChange={() => setRuleWrite(!ruleWrite)} variant="purple" />
                  </div>

                  {/* Create */}
                  <div
                    onClick={() => setRuleCreate(!ruleCreate)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      ruleCreate
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      <span>إنشاء جديد (Create)</span>
                    </div>
                    <ModernSwitch checked={ruleCreate} onChange={() => setRuleCreate(!ruleCreate)} variant="emerald" />
                  </div>

                  {/* Delete */}
                  <div
                    onClick={() => setRuleDelete(!ruleDelete)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      ruleDelete
                        ? 'bg-rose-50/70 border-rose-300 text-rose-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>حذف (Delete)</span>
                    </div>
                    <ModernSwitch checked={ruleDelete} onChange={() => setRuleDelete(!ruleDelete)} variant="emerald" />
                  </div>

                  {/* Submit */}
                  <div
                    onClick={() => setRuleSubmit(!ruleSubmit)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      ruleSubmit
                        ? 'bg-teal-50/70 border-teal-300 text-teal-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>اعتماد (Submit)</span>
                    </div>
                    <ModernSwitch checked={ruleSubmit} onChange={() => setRuleSubmit(!ruleSubmit)} variant="emerald" />
                  </div>

                  {/* Cancel */}
                  <div
                    onClick={() => setRuleCancel(!ruleCancel)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      ruleCancel
                        ? 'bg-red-50/70 border-red-300 text-red-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-600" />
                      <span>إلغاء (Cancel)</span>
                    </div>
                    <ModernSwitch checked={ruleCancel} onChange={() => setRuleCancel(!ruleCancel)} variant="emerald" />
                  </div>
                </div>

                {/* Only If Creator */}
                <div
                  onClick={() => setRuleOnlyIfCreator(!ruleOnlyIfCreator)}
                  className={`mt-3 p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    ruleOnlyIfCreator
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Lock className={`w-4 h-4 ${ruleOnlyIfCreator ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">تقييد: فقط إذا كان المنشئ (Only If Creator)</div>
                      <div className="text-[11px] text-slate-500">
                        لا يتاح للمستخدم التعديل أو الحذف إلا إذا كان هو نفسه من قام بإنشاء هذا السجل
                      </div>
                    </div>
                  </div>
                  <ModernSwitch
                    checked={ruleOnlyIfCreator}
                    onChange={() => setRuleOnlyIfCreator(!ruleOnlyIfCreator)}
                    variant="amber"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddRuleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl text-white shadow-sm transition-all active:scale-95 cursor-pointer"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  حفظ القاعدة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
