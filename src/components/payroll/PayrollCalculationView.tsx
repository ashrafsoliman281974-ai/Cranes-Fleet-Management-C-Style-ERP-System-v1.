import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  Download,
  Printer,
  CheckCircle,
  FileSpreadsheet,
  Calendar,
  Layers,
  ChevronDown,
  Building2,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
  CreditCard,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { INITIAL_PAYROLL_RUN } from '../../data/masterEnterpriseSeed';
import { PayrollRun, EmployeePayrollItem } from '../../types/erp';
import { tafqeetArabic } from '../../utils/tafqeet';

export const PayrollCalculationView: React.FC = () => {
  const { showToast } = useERP();

  const [payrollRun, setPayrollRun] = useState<PayrollRun>(INITIAL_PAYROLL_RUN);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeePayrollItem | null>(null);
  const [filterDepartment, setFilterDepartment] = useState('الكل');

  const handleExportBankWPS = () => {
    // Generate WPS CSV
    const headers = 'EmployeeID,Name,BankAccount,NetSalary,Basic,Overtime,Deductions\n';
    const rows = payrollRun.employees
      .map(
        (e) =>
          `${e.employeeId},"${e.employeeNameAr}",${e.bankAccountNo},${e.netSalary},${e.basicSalary},${e.overtimeAmount},${e.socialInsuranceDeduction + e.incomeTaxDeduction}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EgyptCranes_Payroll_WPS_${payrollRun.month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('تم تصدير ملف صرف المرتبات البنكي المعتمد (WPS Format) بنجاح!');
  };

  const filteredEmployees = payrollRun.employees.filter(
    (e) => filterDepartment === 'الكل' || e.departmentAr === filterDepartment
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <span>الموارد البشرية والرواتب</span>
            <span>/</span>
            <span className="text-red-600">مسير المرتبات وتوزيع تكلفة العمالة (Payroll Run)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <DollarSign className="w-6 h-6 text-red-600" />
            <span>مسير الرواتب الشهري المرتبط بالبصمة ومراكز التكلفة</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            احتساب الرواتب التلقائي، الإضافي وبدلات الموقع، التأمينات والضرائب المصرية، وتوزيع تكلفة العمالة على الأوناش.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBankWPS}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>تصدير ملف التحويل البنكي (WPS)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>إجمالي مسير الرواتب المستحق</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {payrollRun.totalNetPayroll.toLocaleString()} ج.م
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">صافي مستحق لـ {payrollRun.employeesCount} موظفاً</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>بدلات الموقع والمخاطر</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-700 font-mono">
            {payrollRun.totalAllowances.toLocaleString()} ج.م
          </div>
          <div className="text-[11px] text-slate-500">بدل مشقة مواقع ومبيت للعمالة</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>ساعات العمل الإضافية (Overtime)</span>
            <Clock className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-black text-cyan-700 font-mono">
            {payrollRun.totalOvertime.toLocaleString()} ج.م
          </div>
          <div className="text-[11px] text-slate-500">محسوبة من أجهزة البصمة الميدانية</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>استقطاعات التأمينات والضرائب</span>
            <Building2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-black text-purple-700 font-mono">
            {payrollRun.totalDeductions.toLocaleString()} ج.م
          </div>
          <div className="text-[11px] text-slate-500">تأمينات اجتماعية 11% وضريبة كسب عمل</div>
        </div>
      </div>

      {/* Employees Payroll Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              كشف استحقاقات الرواتب لشهر {payrollRun.monthNameAr}
            </h3>
            <p className="text-xs text-slate-500">
              مربوط آلياً بحضور البصمات، مع تفصيل توزيع تكلفة العمالة على مراكز تكلفة الأوناش والمواقع.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">فلترة بالإدارة:</span>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700"
            >
              <option value="الكل">كل الإدارات</option>
              <option value="إدارة العمليات والتشغيل">إدارة العمليات والتشغيل</option>
              <option value="إدارة الصيانة والدعم الفني">إدارة الصيانة والدعم الفني</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-3">الموظف / المشغل</th>
                <th className="py-2.5 px-3">الوظيفة والإدارة</th>
                <th className="py-2.5 px-3">أيام الحضور</th>
                <th className="py-2.5 px-3">الأساسي</th>
                <th className="py-2.5 px-3">الإضافي والبدلات</th>
                <th className="py-2.5 px-3">الاستقطاعات</th>
                <th className="py-2.5 px-3">صافي الراتب</th>
                <th className="py-2.5 px-3">توزيع مركز التكلفة</th>
                <th className="py-2.5 px-3 text-center">قسيمة الراتب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{emp.employeeNameAr}</div>
                    <div className="text-[10px] font-mono text-slate-400">{emp.employeeId}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-800 font-bold">{emp.roleAr}</div>
                    <div className="text-[10px] text-slate-500">{emp.departmentAr}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {emp.attendanceDays} يوماً ({emp.overtimeHours} س.إضافي)
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-900">{emp.basicSalary.toLocaleString()} ج.م</td>
                  <td className="py-3 px-3 font-mono text-emerald-700 font-bold">
                    +{(emp.overtimeAmount + emp.siteHardshipAllowance + emp.hazardAllowance).toLocaleString()} ج.م
                  </td>
                  <td className="py-3 px-3 font-mono text-red-600 font-bold">
                    -{(emp.socialInsuranceDeduction + emp.incomeTaxDeduction + emp.advancesDeduction).toLocaleString()} ج.م
                  </td>
                  <td className="py-3 px-3 font-mono font-black text-base text-slate-900">
                    {emp.netSalary.toLocaleString()} ج.م
                  </td>
                  <td className="py-3 px-3">
                    <div className="space-y-0.5">
                      {emp.costCenterAllocation.map((c, i) => (
                        <div key={i} className="text-[10px] font-mono text-slate-600 truncate max-w-xs">
                          {c.costCenterAr}: <span className="font-bold">{c.allocatedAmount.toLocaleString()} ج.م</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] cursor-pointer"
                    >
                      عرض القسيمة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Slip Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-slate-300 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/Industrial_Crane_Emblem_and_Wordmark__1__8be0357c.png"
                  alt="Egypt Cranes Logo"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    شركة مصر للمقاولات المتخصصة (إيجيبت كرينز)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    قسيمة راتب شهر {payrollRun.monthNameAr} • SALARY SLIP
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl text-xs">
              <div>الاسم: <span className="font-bold text-slate-900">{selectedEmployee.employeeNameAr}</span></div>
              <div>الوظيفة: <span className="font-bold text-slate-900">{selectedEmployee.roleAr}</span></div>
              <div>الإدارة: <span className="font-bold text-slate-900">{selectedEmployee.departmentAr}</span></div>
              <div>الحساب البنكي: <span className="font-mono text-slate-700">{selectedEmployee.bankAccountNo}</span></div>
            </div>

            {/* Earnings & Deductions Table */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Earnings */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <h4 className="font-black text-emerald-800 border-b border-emerald-200 pb-1">الاستحقاقات (Earnings)</h4>
                <div className="flex justify-between">
                  <span>الراتب الأساسي:</span>
                  <span className="font-mono font-bold">{selectedEmployee.basicSalary.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>ساعات إضافية ({selectedEmployee.overtimeHours}س):</span>
                  <span className="font-mono font-bold">{selectedEmployee.overtimeAmount.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>بدل مشقة موقع:</span>
                  <span className="font-mono font-bold">{selectedEmployee.siteHardshipAllowance.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>بدل مخاطر تشغيل:</span>
                  <span className="font-mono font-bold">{selectedEmployee.hazardAllowance.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-200 font-black text-emerald-900">
                  <span>إجمالي الاستحقاق:</span>
                  <span className="font-mono">{selectedEmployee.grossSalary.toLocaleString()} ج.م</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-2">
                <h4 className="font-black text-red-800 border-b border-red-200 pb-1">الاستقطاعات (Deductions)</h4>
                <div className="flex justify-between">
                  <span>تأمينات اجتماعية (11%):</span>
                  <span className="font-mono font-bold">{selectedEmployee.socialInsuranceDeduction.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>ضريبة كسب العمل:</span>
                  <span className="font-mono font-bold">{selectedEmployee.incomeTaxDeduction.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>سلفيات وأقساط:</span>
                  <span className="font-mono font-bold">{selectedEmployee.advancesDeduction.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-red-200 font-black text-red-900">
                  <span>إجمالي الاستقطاع:</span>
                  <span className="font-mono">
                    {(selectedEmployee.socialInsuranceDeduction + selectedEmployee.incomeTaxDeduction + selectedEmployee.advancesDeduction).toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            </div>

            {/* Net Amount Box with Tafqeet */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">صافي الراتب المستحق للصرف:</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {selectedEmployee.netSalary.toLocaleString()} ج.م
                </span>
                <div className="text-[11px] text-slate-300 font-mono mt-1">
                  {tafqeetArabic(selectedEmployee.netSalary)}
                </div>
              </div>
              <button
                onClick={() => {
                  window.print();
                  showToast('جارٍ طباعة قسيمة الراتب الرسمية...');
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة القسيمة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
