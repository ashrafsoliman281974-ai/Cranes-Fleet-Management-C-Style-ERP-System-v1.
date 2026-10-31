import React, { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  Search,
  Building,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  PieChart,
  FolderTree,
  Table,
  Truck,
  Briefcase,
  MapPin,
  Calculator,
  Layers,
  ArrowRight,
  CheckCircle,
  X,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { CostCenter } from '../../types/erp';

export const CostCentersView: React.FC = () => {
  const { costCenters, saveCostCenter, deleteCostCenter, fleet, showToast, t } = useERP();

  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Expanded nodes set for the Tree View
  const [expandedNodes, setExpandedNodes] = useState<{ [id: string]: boolean }>(() => {
    // Default: expand all parent nodes
    const initial: { [id: string]: boolean } = {};
    costCenters.forEach((c) => {
      if (c.isGroup || !c.parentId) {
        initial[c.id] = true;
      }
    });
    return initial;
  });

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const expandAll = () => {
    const allExp: { [id: string]: boolean } = {};
    costCenters.forEach((c) => {
      allExp[c.id] = true;
    });
    setExpandedNodes(allExp);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<CostCenter | null>(null);

  // Form Fields
  const [formCode, setFormCode] = useState('');
  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formParentId, setFormParentId] = useState<string>('');
  const [formIsGroup, setFormIsGroup] = useState<boolean>(false);
  const [formLevel, setFormLevel] = useState<CostCenter['level']>('مشروع');
  const [formDepartmentAr, setFormDepartmentAr] = useState('');
  const [formLinkedEquipmentAr, setFormLinkedEquipmentAr] = useState('');
  const [formLinkedClientAr, setFormLinkedClientAr] = useState('');
  const [formLinkedProjectAr, setFormLinkedProjectAr] = useState('');
  const [formAllocatedBudget, setFormAllocatedBudget] = useState<number>(5000000);
  const [formActualSpent, setFormActualSpent] = useState<number>(0);
  const [formManagerAr, setFormManagerAr] = useState('');
  const [formStatus, setFormStatus] = useState<CostCenter['status']>('نشط');

  // Calculations
  const totalBudget = costCenters.reduce((sum, c) => sum + (c.allocatedBudget || 0), 0);
  const totalSpent = costCenters.reduce((sum, c) => sum + (c.actualSpent || 0), 0);
  const totalVariance = totalBudget - totalSpent;

  // Distinct departments and equipments for quick selections
  const departmentsList = [
    'إدارة التشغيل الميداني',
    'إدارة الصيانة والدعم الفني',
    'الإدارة العامة واللوجستيات',
    'الشؤون المالية وقسم التكاليف',
  ];

  const clientsList = [
    'شركة بترول بلاعيم (بتروبل)',
    'تحالف أوراسكوم والمقاولون العرب',
    'شركة إيني الإيطالية للطاقة',
    'السويدي إليكتريك',
    'بتروجيت للمشروعات البترولية',
    'إعمار مصر للتنمية',
    'شركة حسن علام القابضة',
  ];

  const projectsList = [
    'مشروع حقل ظهر للغاز الطبيعي',
    'مونوريل العاصمة الإدارية والبرج الأيقوني',
    'محطة الضبعة النووية لتوليد الكهرباء',
    'مجمع بنبان للطاقة الشمسية بأسوان',
    'توسعات ميناء دمياط البحري وأبو قير',
    'مشروع القطار الكهربائي السريع (العين السخنة - العلمين)',
  ];

  // Open Add Modal
  const handleOpenAdd = (parentCenter?: CostCenter) => {
    setEditingCenter(null);
    let defaultLevel: CostCenter['level'] = 'مشروع';
    let defaultDept = 'إدارة التشغيل الميداني';
    let defaultEqp = '';
    let defaultClient = '';
    let defaultParentId = parentCenter ? parentCenter.id : 'cc-dept-ops';

    if (parentCenter) {
      if (parentCenter.level === 'تجميعي رئيسي') defaultLevel = 'إدارة';
      else if (parentCenter.level === 'إدارة') defaultLevel = 'معدة أو سيارة';
      else if (parentCenter.level === 'معدة أو سيارة') defaultLevel = 'عميل';
      else if (parentCenter.level === 'عميل') defaultLevel = 'مشروع';
      else if (parentCenter.level === 'مشروع') defaultLevel = 'حساب';

      defaultDept = parentCenter.departmentAr || defaultDept;
      defaultEqp = parentCenter.linkedEquipmentAr || '';
      defaultClient = parentCenter.linkedClientAr || '';
    }

    setFormCode(`${parentCenter?.code || '11'}-${String(costCenters.length + 1).padStart(2, '0')}`);
    setFormNameAr('');
    setFormNameEn('');
    setFormParentId(defaultParentId);
    setFormIsGroup(false);
    setFormLevel(defaultLevel);
    setFormDepartmentAr(defaultDept);
    setFormLinkedEquipmentAr(defaultEqp);
    setFormLinkedClientAr(defaultClient);
    setFormLinkedProjectAr('');
    setFormAllocatedBudget(3000000);
    setFormActualSpent(0);
    setFormManagerAr('م. ');
    setFormStatus('نشط');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cc: CostCenter) => {
    setEditingCenter(cc);
    setFormCode(cc.code);
    setFormNameAr(cc.nameAr);
    setFormNameEn(cc.nameEn || '');
    setFormParentId(cc.parentId || '');
    setFormIsGroup(cc.isGroup);
    setFormLevel(cc.level);
    setFormDepartmentAr(cc.departmentAr || '');
    setFormLinkedEquipmentAr(cc.linkedEquipmentAr || '');
    setFormLinkedClientAr(cc.linkedClientAr || '');
    setFormLinkedProjectAr(cc.linkedProjectAr || '');
    setFormAllocatedBudget(cc.allocatedBudget);
    setFormActualSpent(cc.actualSpent);
    setFormManagerAr(cc.managerAr);
    setFormStatus(cc.status);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameAr.trim() || !formCode.trim()) {
      showToast('يرجى ملء كود المركز واسم المركز بالعربية');
      return;
    }

    const variance = Number(formAllocatedBudget) - Number(formActualSpent);

    const costCenterData: CostCenter = {
      id: editingCenter ? editingCenter.id : `cc-${Date.now()}`,
      code: formCode.trim(),
      nameAr: formNameAr.trim(),
      nameEn: formNameEn.trim() || formNameAr.trim(),
      parentId: formParentId || undefined,
      isGroup: formIsGroup,
      level: formLevel,
      departmentAr: formDepartmentAr || undefined,
      linkedEquipmentAr: formLinkedEquipmentAr || undefined,
      linkedClientAr: formLinkedClientAr || undefined,
      linkedProjectAr: formLinkedProjectAr || undefined,
      allocatedBudget: Number(formAllocatedBudget) || 0,
      actualSpent: Number(formActualSpent) || 0,
      variance,
      managerAr: formManagerAr || 'مدير التكاليف',
      status: formStatus,
    };

    saveCostCenter(costCenterData);
    setIsModalOpen(false);
  };

  const handleDelete = (cc: CostCenter) => {
    if (window.confirm(`هل أنت متأكد من حذف مركز التكلفة: "${cc.nameAr}"؟`)) {
      deleteCostCenter(cc.id);
    }
  };

  // Build Hierarchical Tree Structure
  const treeRoots = useMemo(() => {
    const map: { [id: string]: CostCenter & { children: any[] } } = {};
    const roots: (CostCenter & { children: any[] })[] = [];

    // Initialize map
    costCenters.forEach((c) => {
      map[c.id] = { ...c, children: [] };
    });

    // Link children to parents
    costCenters.forEach((c) => {
      if (c.parentId && map[c.parentId]) {
        map[c.parentId].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });

    return roots;
  }, [costCenters]);

  // Level Badge Renderer
  const renderLevelBadge = (level: CostCenter['level']) => {
    switch (level) {
      case 'تجميعي رئيسي':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            <Layers className="w-3 h-3 text-purple-600" />
            <span>تجميعي رئيسي</span>
          </span>
        );
      case 'إدارة':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <Building className="w-3 h-3 text-blue-600" />
            <span>مستوى الإدارة</span>
          </span>
        );
      case 'معدة أو سيارة':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Truck className="w-3 h-3 text-amber-600" />
            <span>معدة / سيارة</span>
          </span>
        );
      case 'عميل':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Briefcase className="w-3 h-3 text-emerald-600" />
            <span>مستوى العميل</span>
          </span>
        );
      case 'مشروع':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
            <MapPin className="w-3 h-3 text-red-600" />
            <span>مستوى المشروع</span>
          </span>
        );
      case 'حساب':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Calculator className="w-3 h-3 text-indigo-600" />
            <span>مستوى الحساب</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {level}
          </span>
        );
    }
  };

  // Recursive Tree Node Component
  const TreeNodeItem: React.FC<{
    node: CostCenter & { children: any[] };
    depth: number;
  }> = ({ node, depth }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id] ?? false;

    // Spending ratio
    const spendPercent =
      node.allocatedBudget > 0
        ? Math.min(100, Math.round((node.actualSpent / node.allocatedBudget) * 100))
        : 0;

    return (
      <div className="flex flex-col">
        {/* Node Card */}
        <div
          className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 my-1 rounded-xl border transition-all ${
            node.isGroup
              ? 'bg-slate-50/90 border-slate-200 hover:border-slate-300'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
          }`}
          style={{
            marginRight: `${depth * 24}px`,
          }}
        >
          {/* Right Info: Icon, Code, Title, Badges */}
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            {/* Expand / Collapse Button */}
            {hasChildren || node.isGroup ? (
              <button
                onClick={() => toggleExpand(node.id)}
                className="mt-0.5 p-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
                title={isExpanded ? 'طي التفريعات' : 'توسيع التفريعات'}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-700" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                )}
              </button>
            ) : (
              <div className="w-6 shrink-0 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              </div>
            )}

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-200/80 text-slate-800">
                  {node.code}
                </span>
                <span className="font-black text-sm text-slate-900 truncate">{node.nameAr}</span>
                {renderLevelBadge(node.level)}
                {node.isGroup && (
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                    (تجميعي)
                  </span>
                )}
              </div>

              {/* Dimensional Lineage Chain */}
              {(node.departmentAr || node.linkedEquipmentAr || node.linkedClientAr || node.linkedProjectAr) && (
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 pt-0.5">
                  <LinkIcon className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-400 font-semibold">ربط الأبعاد:</span>
                  {node.departmentAr && (
                    <span className="font-medium bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded">
                      إدارة: {node.departmentAr}
                    </span>
                  )}
                  {node.linkedEquipmentAr && (
                    <span className="font-medium bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">
                      معدة: {node.linkedEquipmentAr}
                    </span>
                  )}
                  {node.linkedClientAr && (
                    <span className="font-medium bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">
                      عميل: {node.linkedClientAr}
                    </span>
                  )}
                  {node.linkedProjectAr && (
                    <span className="font-medium bg-red-50 text-red-800 px-1.5 py-0.5 rounded">
                      مشروع: {node.linkedProjectAr}
                    </span>
                  )}
                </div>
              )}

              {/* English name and manager */}
              <div className="text-[11px] text-slate-400 flex items-center gap-3">
                <span className="font-sans">{node.nameEn}</span>
                <span>•</span>
                <span>المسؤول: {node.managerAr}</span>
              </div>
            </div>
          </div>

          {/* Left Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-4 shrink-0 lg:pr-4 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
            {/* Budget & Spend */}
            <div className="w-48 space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-500">المنصرف: {(node.actualSpent / 1000).toLocaleString()} ألف</span>
                <span className="font-bold text-slate-800">
                  الميزانية: {(node.allocatedBudget / 1000).toLocaleString()} ألف
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    spendPercent > 95
                      ? 'bg-red-600'
                      : spendPercent > 75
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${spendPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>المتبقي: {(node.variance / 1000).toLocaleString()} ألف ج.م</span>
                <span className="font-bold text-slate-700">{spendPercent}%</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenAdd(node)}
                className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors shadow-2xs"
                title="إضافة مركز تكلفة فرعي تحت هذا المركز"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إضافة فرعي (+)</span>
              </button>

              <button
                onClick={() => handleOpenEdit(node)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                title="تعديل المركز والأبعاد"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDelete(node)}
                className="p-1.5 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50 transition-colors"
                title="حذف المركز"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="border-r-2 border-slate-200/80 mr-3 my-0.5">
            {node.children.map((child: any) => (
              <TreeNodeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Table Filtered List
  const filteredTableList = costCenters.filter((c) => {
    if (levelFilter !== 'All' && c.level !== levelFilter) return false;
    if (departmentFilter !== 'All' && c.departmentAr !== departmentFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        c.nameAr.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.managerAr && c.managerAr.toLowerCase().includes(q)) ||
        (c.linkedEquipmentAr && c.linkedEquipmentAr.toLowerCase().includes(q)) ||
        (c.linkedClientAr && c.linkedClientAr.toLowerCase().includes(q)) ||
        (c.linkedProjectAr && c.linkedProjectAr.toLowerCase().includes(q));
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
              {t('Cost Centers Tree', 'محاسبة التكاليف والأبعاد الرقابية', 'Cost Centers')}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              مراكز التكلفة الهرمية
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-amber-700" />
            <span>شجرة ودليل مراكز التكلفة متعددة الأبعاد (Cost Centers Hierarchy)</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Tree vs Table Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'tree'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5 text-amber-600" />
              <span>شجرة هرمية</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-indigo-600" />
              <span>جدول تحليلي</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مركز تكلفة جديد (+)</span>
          </button>
        </div>
      </div>

      {/* Relational Dimensions Explanation Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-xs border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              تسلسل ربط الأبعاد المحاسبية التراكمية:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-500/40">
              1. مستوى الإدارة (Department)
            </span>
            <span className="text-slate-400">←</span>
            <span className="bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded border border-amber-500/40">
              2. مستوى المعدة أو السيارة (Equipment/Crane)
            </span>
            <span className="text-slate-400">←</span>
            <span className="bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded border border-emerald-500/40">
              3. مستوى العميل (Client)
            </span>
            <span className="text-slate-400">←</span>
            <span className="bg-red-900/60 text-red-200 px-2 py-0.5 rounded border border-red-500/40">
              4. مستوى المشروع (Project)
            </span>
            <span className="text-slate-400">←</span>
            <span className="bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded border border-indigo-500/40">
              5. مستوى الحساب التحليلي (Account)
            </span>
          </div>
        </div>
        <div className="text-left text-xs text-slate-300 font-mono">
          {costCenters.length} مراكز مسجلة بالدليل
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">إجمالي الموازنات المعتمدة للمشاريع</span>
          <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
            {(totalBudget / 1000000).toFixed(2)} مليون ج.م
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">إجمالي المنصرف الفعلي حتى تاريخه</span>
          <div className="text-lg font-black text-emerald-800 font-mono tabular-nums">
            {(totalSpent / 1000000).toFixed(2)} مليون ج.م
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">صافي الوفر المتبقي بالموازنة</span>
          <div className="text-lg font-black text-blue-900 font-mono tabular-nums">
            {(totalVariance / 1000000).toFixed(2)} مليون ج.م
          </div>
        </div>
      </div>

      {/* View Mode: Tree vs Table */}
      {viewMode === 'tree' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          {/* Tree Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                توسيع كافة الفروع
              </button>
              <button
                onClick={collapseAll}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                طي كافة الفروع
              </button>
            </div>

            <div className="text-xs text-slate-500">
              * انقر على زر <span className="font-bold text-red-600">(+) إضافة فرعي</span> لإضافة مركز تكلفة مربوط مباشرة
            </div>
          </div>

          {/* Tree Hierarchy Canvas */}
          <div className="space-y-1 overflow-x-auto">
            {treeRoots.map((root) => (
              <TreeNodeItem key={root.id} node={root} depth={0} />
            ))}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="space-y-4">
          {/* Table Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="بحث بالكود، الاسم، الرافعة، العميل، المشروع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 py-2 focus:outline-none focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
              >
                <option value="All">كافة مستويات الأبعاد</option>
                <option value="تجميعي رئيسي">تجميعي رئيسي</option>
                <option value="إدارة">مستوى الإدارة</option>
                <option value="معدة أو سيارة">معدة أو سيارة</option>
                <option value="عميل">مستوى العميل</option>
                <option value="مشروع">مستوى المشروع</option>
                <option value="حساب">مستوى الحساب</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
              >
                <option value="All">كافة الإدارات</option>
                {departmentsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">الكود</th>
                    <th className="py-3 px-4">اسم مركز التكلفة</th>
                    <th className="py-3 px-4">مستوى البعد</th>
                    <th className="py-3 px-4">الإدارة التابعة</th>
                    <th className="py-3 px-4">المعدة / الرافعة</th>
                    <th className="py-3 px-4">العميل المرتبط</th>
                    <th className="py-3 px-4">المشروع المرتبط</th>
                    <th className="py-3 px-4">الميزانية المعتمدة</th>
                    <th className="py-3 px-4">المنصرف الفعلي</th>
                    <th className="py-3 px-4">المتبقي</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredTableList.map((cc) => (
                    <tr key={cc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{cc.code}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{cc.nameAr}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{cc.nameEn}</div>
                      </td>
                      <td className="py-3 px-4">{renderLevelBadge(cc.level)}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{cc.departmentAr || '-'}</td>
                      <td className="py-3 px-4">
                        {cc.linkedEquipmentAr ? (
                          <span className="font-medium bg-amber-50 text-amber-900 px-2 py-0.5 rounded text-[11px]">
                            {cc.linkedEquipmentAr}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {cc.linkedClientAr ? (
                          <span className="font-medium bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded text-[11px]">
                            {cc.linkedClientAr}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {cc.linkedProjectAr ? (
                          <span className="font-medium bg-red-50 text-red-900 px-2 py-0.5 rounded text-[11px]">
                            {cc.linkedProjectAr}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {cc.allocatedBudget.toLocaleString()} ج.م
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-700">
                        {cc.actualSpent.toLocaleString()} ج.م
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-800">
                        {cc.variance.toLocaleString()} ج.م
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(cc)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-600"
                            title="تعديل"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cc)}
                            className="p-1 rounded hover:bg-red-50 text-red-600"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Cost Center Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-600" />
                <h3 className="font-black text-slate-900 text-sm">
                  {editingCenter ? 'تعديل بيانات وربط مركز التكلفة' : 'إضافة مركز تكلفة جديد وتحديد أبعاد الربط'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4 overflow-y-auto">
              {/* Hierarchy Parent & Group Indicator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    المركز الأب في الشجرة (Parent Node)
                  </label>
                  <select
                    value={formParentId}
                    onChange={(e) => setFormParentId(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="">-- مركز رئيسي أعلى الشجرة (Root Node) --</option>
                    {costCenters
                      .filter((c) => !editingCenter || c.id !== editingCenter.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} - {c.nameAr} ({c.level})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    مستوى البعد المحاسبي (Dimension Level)
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as any)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold"
                  >
                    <option value="تجميعي رئيسي">تجميعي رئيسي (Main Group)</option>
                    <option value="إدارة">مستوى الإدارة (Department)</option>
                    <option value="معدة أو سيارة">مستوى المعدة أو السيارة (Equipment/Vehicle)</option>
                    <option value="عميل">مستوى العميل (Client)</option>
                    <option value="مشروع">مستوى المشروع (Project)</option>
                    <option value="حساب">مستوى الحساب التحليلي (Account)</option>
                  </select>
                </div>
              </div>

              {/* Code & Name Ar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">كود المركز المحاسبي *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="مثال: 1111-02"
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    اسم مركز التكلفة (بالعربية) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    placeholder="مثال: رافعة ليبهير 500 طن - مشروع حقل ظهر"
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  اسم المركز بالإنجليزية (English Name)
                </label>
                <input
                  type="text"
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  placeholder="e.g. Liebherr 500T - Zohr Gas Field Project"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-sans"
                />
              </div>

              {/* Cascading Relational Dimensions Linkage Section */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <LinkIcon className="w-3.5 h-3.5 text-red-600" />
                  <span>ربط الأبعاد التشغيلية (إدارة ← معدة/سيارة ← عميل ← مشروع):</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Department */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      1. الإدارة المسؤولة (Department)
                    </label>
                    <select
                      value={formDepartmentAr}
                      onChange={(e) => setFormDepartmentAr(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                    >
                      <option value="">-- اختياري --</option>
                      {departmentsList.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Equipment / Crane / Vehicle */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      2. المعدة أو السيارة أو الرافعة المرتبطة
                    </label>
                    <select
                      value={formLinkedEquipmentAr}
                      onChange={(e) => setFormLinkedEquipmentAr(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                    >
                      <option value="">-- غير محدد أو عام --</option>
                      {fleet.map((fl) => (
                        <option key={fl.id} value={`${fl.model} (${fl.capacityTon} Ton)`}>
                          {fl.model} ({fl.capacityTon} طن) - {fl.typeAr}
                        </option>
                      ))}
                      <option value="سيارة دعم وصيانة متنقلة رقم 12">سيارة دعم وصيانة متنقلة رقم 12</option>
                      <option value="شاحنة نقل كتل الاتزان Counterweight Truck">
                        شاحنة نقل كتل الاتزان Counterweight Truck
                      </option>
                    </select>
                  </div>

                  {/* Client */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      3. العميل المرتبط (Client)
                    </label>
                    <input
                      type="text"
                      list="clients-datalist"
                      value={formLinkedClientAr}
                      onChange={(e) => setFormLinkedClientAr(e.target.value)}
                      placeholder="اختر أو اكتب اسم العميل..."
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                    />
                    <datalist id="clients-datalist">
                      {clientsList.map((cl) => (
                        <option key={cl} value={cl} />
                      ))}
                    </datalist>
                  </div>

                  {/* Project */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      4. المشروع الميداني المرتبط (Project)
                    </label>
                    <input
                      type="text"
                      list="projects-datalist"
                      value={formLinkedProjectAr}
                      onChange={(e) => setFormLinkedProjectAr(e.target.value)}
                      placeholder="اختر أو اكتب اسم المشروع..."
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                    />
                    <datalist id="projects-datalist">
                      {projectsList.map((pr) => (
                        <option key={pr} value={pr} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Budget, Spent, Manager, Status */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الميزانية التقديرية (ج.م)</label>
                  <input
                    type="number"
                    min="0"
                    value={formAllocatedBudget}
                    onChange={(e) => setFormAllocatedBudget(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المنصرف الفعلي (ج.م)</label>
                  <input
                    type="number"
                    min="0"
                    value={formActualSpent}
                    onChange={(e) => setFormActualSpent(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المسؤول المباشر</label>
                  <input
                    type="text"
                    value={formManagerAr}
                    onChange={(e) => setFormManagerAr(e.target.value)}
                    placeholder="م. "
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الحالة</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="نشط">نشط (Active)</option>
                    <option value="مكتمل">مكتمل (Completed)</option>
                    <option value="معلق">معلق (Suspended)</option>
                  </select>
                </div>
              </div>

              {/* Is Group Checkbox */}
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <input
                  type="checkbox"
                  id="form-is-group"
                  checked={formIsGroup}
                  onChange={(e) => setFormIsGroup(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <label htmlFor="form-is-group" className="text-xs font-bold text-amber-900 cursor-pointer">
                  مركز تجميعي يقبل تفريعات فرعية (Group Cost Center)
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg text-white shadow-xs transition-opacity hover:opacity-90 flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{editingCenter ? 'حفظ التعديلات' : 'إضافة المركز للشجرة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
