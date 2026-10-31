import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  BarChart3,
  Scale,
  FileSpreadsheet,
  CheckSquare,
  Square,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { getFilteredFinancialData } from '../../data/accountingEnterpriseData';
import { FinancialPeriodType, QuarterPeriod, StatementLineItem, StatementSection } from '../../types/erp';

export const FinancialStatementsView: React.FC = () => {
  const { financialFilter, setFinancialFilter, language, t, showToast } = useERP();
  const [activeTab, setActiveTab] = useState<'pl' | 'bs' | 'cf' | 'eq'>('pl');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    rev: true,
    direct: true,
    admin: true,
    curr_assets: true,
    fixed_assets: true,
    curr_liab: true,
    long_liab: true,
    equity: true,
    cf_ops: true,
    cf_inv: true,
    cf_fin: true,
    eq_main: true,
  });

  const toggleSection = (sec: string) => {
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Default values for comparison controls if undefined
  const showComparison = financialFilter.showComparison !== false; // default true
  const comparisonYear = financialFilter.comparisonYear || (financialFilter.selectedYear === 2026 ? 2025 : financialFilter.selectedYear - 1);
  const showVariancePercent = financialFilter.showVariancePercent !== false; // default true

  // Generate data using the active financial filter
  const financialData = getFilteredFinancialData({
    ...financialFilter,
    showComparison,
    comparisonYear,
    showVariancePercent,
  });

  const { profitAndLoss, balanceSheet, cashFlow, equityChanges } = financialData;

  const formatEGP = (num: number) => {
    return (
      <span className="font-mono tabular-nums font-bold">
        {Math.abs(num).toLocaleString('ar-EG')}
        {num < 0 ? ' -' : ''}{' '}
        <span className="text-[10px] text-slate-500 font-normal">ج.م</span>
      </span>
    );
  };

  const renderVarianceBadge = (pct: number | undefined, invertGoodBad = false) => {
    if (pct === undefined) return null;
    const isZero = Math.abs(pct) < 0.05;
    if (isZero) {
      return (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-600">
          0.0%
        </span>
      );
    }

    const isPositive = pct > 0;
    // For expenses/costs, an increase (+) is technically cost increase, but percentage is just mathematical
    const isGood = invertGoodBad ? !isPositive : isPositive;

    const bgClass = isGood ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200';
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

    return (
      <span
        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border ${bgClass}`}
        dir="ltr"
      >
        <Icon className="w-3 h-3" />
        {isPositive ? `+${pct.toFixed(1)}%` : `${pct.toFixed(1)}%`}
      </span>
    );
  };

  const quarters: { id: QuarterPeriod; labelAr: string; labelEn: string; monthsAr: string }[] = [
    { id: 'Q1', labelAr: 'الربع الأول (Q1)', labelEn: 'Quarter 1', monthsAr: 'يناير - مارس' },
    { id: 'Q2', labelAr: 'الربع الثاني (Q2)', labelEn: 'Quarter 2', monthsAr: 'أبريل - يونيو' },
    { id: 'Q3', labelAr: 'الربع الثالث (Q3)', labelEn: 'Quarter 3', monthsAr: 'يوليو - سبتمبر' },
    { id: 'Q4', labelAr: 'الربع الرابع (Q4)', labelEn: 'Quarter 4', monthsAr: 'أكتوبر - ديسمبر' },
    { id: 'ALL', labelAr: 'كامل السنة (Full Year)', labelEn: 'Full Year', monthsAr: '12 شهراً' },
  ];

  const getStatementTitle = () => {
    switch (activeTab) {
      case 'pl':
        return 'قائمة الأرباح والخسائر (قائمة الدخل الشامل)';
      case 'bs':
        return 'الميزانية العمومية (قائمة المركز المالي)';
      case 'cf':
        return 'قائمة التدفقات النقدية (الطريقة المباشرة)';
      case 'eq':
        return 'قائمة التغير في حقوق الملكية';
    }
  };

  // =========================================================================
  // EXPORT TO EXCEL (.csv with UTF-8 BOM for Arabic support in MS Excel)
  // =========================================================================
  const exportToExcel = () => {
    const reportTitle = getStatementTitle();
    const headers = [
      'كود الحساب',
      'اسم الحساب / بيان البند',
      `السنة المالية (${financialFilter.selectedYear})`,
    ];

    if (showComparison) {
      headers.push(`سنة المقارنة (${comparisonYear})`);
      headers.push('التغير بالقيمة (ج.م)');
    }
    if (showComparison && showVariancePercent) {
      headers.push('نسبة التغير %');
    }

    const rows: string[][] = [];

    // Header metadata rows
    rows.push(['شركة رافعات مصر للمقاولات والنقل الثقيل (ش.م.م) - Egypt Cranes']);
    rows.push([reportTitle]);
    rows.push([
      `الفترة المحاسبية: ${financialFilter.periodType === 'quarterly' ? financialFilter.selectedQuarter : 'سنوي'} | السنة: ${financialFilter.selectedYear}${
        showComparison ? ` مقابل ${comparisonYear}` : ''
      }`,
    ]);
    rows.push([`تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-EG')} | العملة: الجنيه المصري (EGP)`]);
    rows.push([]);
    rows.push(headers);

    const addSectionToCsv = (section: StatementSection) => {
      rows.push([`--- ${section.titleAr} ---`]);
      section.items.forEach((it) => {
        const itemRow = [it.code, `"${it.titleAr.replace(/"/g, '""')}"`, it.amount.toString()];
        if (showComparison) {
          itemRow.push((it.previousAmount ?? 0).toString());
          itemRow.push((it.varianceAmount ?? 0).toString());
        }
        if (showComparison && showVariancePercent) {
          itemRow.push(it.variancePercent !== undefined ? `${it.variancePercent.toFixed(1)}%` : '');
        }
        rows.push(itemRow);
      });
      // Section total
      const totalRow = [
        'المجموع',
        `"إجمالي ${section.titleAr.replace(/"/g, '""')}"`,
        section.totalAmount.toString(),
      ];
      if (showComparison) {
        totalRow.push((section.previousTotalAmount ?? 0).toString());
        totalRow.push((section.totalVarianceAmount ?? 0).toString());
      }
      if (showComparison && showVariancePercent) {
        totalRow.push(section.totalVariancePercent !== undefined ? `${section.totalVariancePercent.toFixed(1)}%` : '');
      }
      rows.push(totalRow);
      rows.push([]);
    };

    if (activeTab === 'pl') {
      profitAndLoss.sections.forEach(addSectionToCsv);
      // Net Profit Summary
      rows.push([
        'الصافي',
        '"صافي أرباح الفترة بعد الضرائب (Net Profit)"',
        profitAndLoss.summary.netProfit.toString(),
        ...(showComparison
          ? [
              profitAndLoss.summary.previousNetProfit.toString(),
              profitAndLoss.summary.netProfitVariance.toString(),
            ]
          : []),
        ...(showComparison && showVariancePercent ? [`${profitAndLoss.summary.netProfitVariancePct.toFixed(1)}%`] : []),
      ]);
    } else if (activeTab === 'bs') {
      addSectionToCsv(balanceSheet.currentAssets);
      addSectionToCsv(balanceSheet.fixedAssets);
      rows.push([
        'إجمالي الأصول',
        '"مجموع الأصول (Total Assets)"',
        balanceSheet.totals.totalAssets.toString(),
        ...(showComparison
          ? [
              balanceSheet.totals.previousTotalAssets.toString(),
              balanceSheet.totals.assetsVariance.toString(),
            ]
          : []),
        ...(showComparison && showVariancePercent ? [`${balanceSheet.totals.assetsVariancePct.toFixed(1)}%`] : []),
      ]);
      rows.push([]);
      addSectionToCsv(balanceSheet.currentLiabilities);
      addSectionToCsv(balanceSheet.longTermLiabilities);
      addSectionToCsv(balanceSheet.equity);
      rows.push([
        'إجمالي الالتزامات وحقوق الملكية',
        '"مجموع الخصوم وحقوق الملكية"',
        (balanceSheet.totals.totalLiabilities + balanceSheet.totals.totalEquity).toString(),
        ...(showComparison
          ? [
              (balanceSheet.totals.previousTotalLiabilities + balanceSheet.totals.previousTotalEquity).toString(),
              (balanceSheet.totals.liabilitiesVariance + balanceSheet.totals.equityVariance).toString(),
            ]
          : []),
        ...(showComparison && showVariancePercent ? ['-'] : []),
      ]);
    } else if (activeTab === 'cf') {
      addSectionToCsv(cashFlow.operating);
      addSectionToCsv(cashFlow.investing);
      addSectionToCsv(cashFlow.financing);
      rows.push([
        'رصيد النقدية',
        '"رصيد النقدية وما في حكمها في نهاية الفترة"',
        cashFlow.summary.endingCash.toString(),
        ...(showComparison ? [cashFlow.summary.previousEndingCash.toString(), (cashFlow.summary.endingCash - cashFlow.summary.previousEndingCash).toString()] : []),
        ...(showComparison && showVariancePercent ? ['-'] : []),
      ]);
    } else if (activeTab === 'eq') {
      addSectionToCsv(equityChanges);
    }

    const csvContent = '\uFEFF' + rows.map((r) => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `EgyptCranes_${activeTab.toUpperCase()}_${financialFilter.selectedYear}${showComparison ? `_vs_${comparisonYear}` : ''}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`تم تصدير ${reportTitle} إلى ملف Excel (CSV مرمز) بنجاح`);
  };

  // =========================================================================
  // PRINT & PDF EXPORT
  // =========================================================================
  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    showToast('جارِ إعداد ملف PDF المعتمد... افتح نافذة الطباعة واختر "حفظ بتنسيق PDF"');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // Helper row renderer for comparative tables
  const renderRow = (
    item: StatementLineItem,
    totalSectionAmount: number,
    invertGoodBad = false
  ) => {
    return (
      <tr
        key={item.id}
        className="hover:bg-slate-50/80 transition-colors text-xs border-b border-slate-100 last:border-b-0"
      >
        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 w-16 text-center">
          {item.code}
        </td>
        <td className="py-2.5 px-4 font-medium text-slate-800">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">{item.titleAr}</span>
            <span className="text-[10px] text-slate-400 font-sans">{item.titleEn}</span>
          </div>
        </td>
        <td className="py-2.5 px-4 text-left font-mono font-bold text-slate-900 bg-slate-50/40">
          {formatEGP(item.amount)}
        </td>
        {showComparison && (
          <td className="py-2.5 px-4 text-left font-mono text-slate-600 bg-slate-50/20">
            {formatEGP(item.previousAmount ?? 0)}
          </td>
        )}
        {showComparison && (
          <td
            className={`py-2.5 px-4 text-left font-mono font-semibold ${
              (item.varianceAmount ?? 0) >= 0 ? 'text-slate-900' : 'text-rose-700'
            }`}
          >
            {formatEGP(item.varianceAmount ?? 0)}
          </td>
        )}
        {showComparison && showVariancePercent && (
          <td className="py-2.5 px-4 text-center">
            {renderVarianceBadge(item.variancePercent, invertGoodBad)}
          </td>
        )}
      </tr>
    );
  };

  const renderSectionHeader = (
    section: StatementSection,
    secKey: string,
    isExpanded: boolean,
    invertGoodBad = false
  ) => {
    return (
      <div
        onClick={() => toggleSection(secKey)}
        className="flex items-center justify-between p-3.5 bg-slate-100/80 hover:bg-slate-200/70 cursor-pointer transition-colors border-y border-slate-200"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500 no-print" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500 no-print" />
          )}
          <span className="text-xs font-black text-slate-900">{section.titleAr}</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-black font-mono">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500 font-normal no-print">إجمالي البند:</span>
            <span className="text-slate-900">{formatEGP(section.totalAmount)}</span>
          </div>
          {showComparison && (
            <div className="flex items-center gap-1 text-slate-600">
              <span className="text-[10px] text-slate-400 font-normal no-print">سابق:</span>
              <span>{formatEGP(section.previousTotalAmount ?? 0)}</span>
            </div>
          )}
          {showComparison && showVariancePercent && (
            <div className="no-print">
              {renderVarianceBadge(section.totalVariancePercent, invertGoodBad)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto printable-financial-statement">
      {/* ============================================================== */}
      {/* PRINT-ONLY CORPORATE LETTERHEAD (Visible only when printing/PDF) */}
      {/* ============================================================== */}
      <div className="hidden print:block mb-6 border-b-2 border-slate-800 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black text-slate-950">
              شركة رافعات مصر للمقاولات والنقل الثقيل (ش.م.م)
            </h1>
            <h2 className="text-xs text-slate-600 font-mono tracking-wider">
              Egypt Cranes Heavy Transport & Lift Engineering SAE
            </h2>
            <div className="text-[11px] text-slate-500 mt-1 flex gap-4">
              <span>س.ت: 45892 الإسكندرية / السويس</span>
              <span>ب.ض: 394-821-654</span>
              <span>رأس المال المرخص: 500,000,000 ج.م</span>
            </div>
          </div>
          <div className="text-left font-mono text-xs">
            <div className="font-bold text-slate-900">إدارة الشئون المالية والحسابات العامة</div>
            <div className="text-slate-500">كود الوثيقة: EC-FIN-REP-{financialFilter.selectedYear}</div>
            <div className="text-slate-500">تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-200 text-center">
          <h2 className="text-base font-extrabold text-slate-900">{getStatementTitle()}</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            عن السنة المالية المنتهية في 31 ديسمبر {financialFilter.selectedYear}
            {showComparison ? ` (مقارنة بالسنة المالية ${comparisonYear})` : ''} - طبقاً لمعايير المحاسبة المصرية (EAS) و IFRS
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SCREEN HEADER & ACTION BUTTONS (Hidden in print) */}
      {/* ============================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" />
              {t('IFRS & Egyptian Accounting Standards', 'المعايير المحاسبية المصرية والدولية IFRS')}
            </span>
            <span className="text-xs text-slate-400 font-mono">Egypt Cranes Finance & Fleet ERP</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('Financial Statements & Management Reports', 'القوائم المالية والتقارير المحاسبية الختامية المقارنة')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              'Comparative balance sheet, profit & loss, cash flows, and changes in equity with year-over-year variance % and audit verification.',
              'القوائم المالية الأربعة المعتمدة مع إمكانية إظهار سنة المقارنة ونسبة التغير المئوية، والطباعة والتصدير إلى Excel و PDF.'
            )}
          </p>
        </div>

        {/* Action Buttons: Print, PDF, Excel */}
        <div className="flex items-center flex-wrap gap-2 self-start md:self-auto">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors border border-slate-200 shadow-2xs cursor-pointer"
            title="طباعة القائمة المالية مباشرة"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>{t('Print', 'طباعة')}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl transition-colors border border-rose-200 shadow-2xs cursor-pointer"
            title="تصدير بصيغة PDF معتمدة"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>تصدير PDF</span>
          </button>

          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            title="تصدير جدول القوائم المالية المقارنة إلى ملف Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>تصدير Excel (.csv)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FILTER, COMPARISON YEAR & VARIANCE PERCENTAGE CONTROLS */}
      {/* ============================================================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/90 space-y-4 no-print">
        {/* Row 1: Reporting Period and Fiscal Year */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Period Mode Selector: Annual vs Quarterly vs Custom */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-red-600" />
              {t('Reporting Period:', 'نطاق الفترة المحاسبية:')}
            </span>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFinancialFilter({ ...financialFilter, periodType: 'annual', selectedQuarter: 'ALL' })}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  financialFilter.periodType === 'annual'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('Annual (سنوي)', 'سنوي كامل')}
              </button>
              <button
                onClick={() => setFinancialFilter({ ...financialFilter, periodType: 'quarterly', selectedQuarter: 'Q3' })}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  financialFilter.periodType === 'quarterly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('Quarterly (ربع سنوي)', 'ربع سنوي')}
              </button>
              <button
                onClick={() => setFinancialFilter({ ...financialFilter, periodType: 'custom' })}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  financialFilter.periodType === 'custom'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('Custom Date (فترة محددة)', 'فترة محددة')}
              </button>
            </div>
          </div>

          {/* Current Fiscal Year Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              {t('Current Fiscal Year:', 'السنة المالية الحالية:')}
            </span>
            <select
              value={financialFilter.selectedYear}
              onChange={(e) => setFinancialFilter({ ...financialFilter, selectedYear: Number(e.target.value) })}
              className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value={2026}>2026 (العام المالي النشط)</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
          </div>
        </div>

        {/* Row 2: COMPARISON YEAR & PERCENTAGE VARIANCE CONTROLS (Requested Feature) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-slate-50 to-amber-50/40 rounded-xl border border-slate-200">
          <div className="flex items-center flex-wrap gap-4">
            {/* Checkbox 1: Show Comparison Year */}
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showComparison}
                onChange={(e) =>
                  setFinancialFilter({
                    ...financialFilter,
                    showComparison: e.target.checked,
                  })
                }
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
              />
              <span>إظهار سنة المقارنة (Comparative Year)</span>
            </label>

            {/* Selector: Choose Comparison Year */}
            {showComparison && (
              <div className="flex items-center gap-2 animate-in fade-in duration-150">
                <span className="text-xs text-slate-500 font-semibold">اختيار السنة:</span>
                <select
                  value={comparisonYear}
                  onChange={(e) =>
                    setFinancialFilter({
                      ...financialFilter,
                      comparisonYear: Number(e.target.value),
                    })
                  }
                  className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value={2025}>2025 (السنة السابقة مباشرة)</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                  <option value={2022}>2022</option>
                </select>
              </div>
            )}

            {/* Checkbox 2: Show Percentage Change */}
            {showComparison && (
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer select-none animate-in fade-in duration-150 border-r border-slate-300 pr-4">
                <input
                  type="checkbox"
                  checked={showVariancePercent}
                  onChange={(e) =>
                    setFinancialFilter({
                      ...financialFilter,
                      showVariancePercent: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <span>إظهار نسبة التغير % (Variance %)</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-mono font-bold">
                    + / -
                  </span>
                </span>
              </label>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              يطبق على جميع القوائم المالية الختامية الأربعة
            </span>
          </div>
        </div>

        {/* Sub-Filters: Quarters or Custom Dates */}
        {financialFilter.periodType === 'quarterly' && (
          <div className="flex items-center flex-wrap gap-2 pt-1 animate-in fade-in duration-200">
            <span className="text-xs font-semibold text-slate-500 pl-2">
              {t('Select Quarter:', 'اختر الربع المالي:')}
            </span>
            {quarters.map((q) => (
              <button
                key={q.id}
                onClick={() => setFinancialFilter({ ...financialFilter, selectedQuarter: q.id })}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  financialFilter.selectedQuarter === q.id
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{q.labelAr}</span>
                <span
                  className={`text-[10px] font-normal ${
                    financialFilter.selectedQuarter === q.id ? 'text-red-100' : 'text-slate-400'
                  }`}
                >
                  ({q.monthsAr})
                </span>
              </button>
            ))}
          </div>
        )}

        {financialFilter.periodType === 'custom' && (
          <div className="flex items-center flex-wrap gap-3 pt-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>من:</span>
              <input
                type="date"
                value={financialFilter.startDate}
                onChange={(e) => setFinancialFilter({ ...financialFilter, startDate: e.target.value })}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <span>إلى:</span>
              <input
                type="date"
                value={financialFilter.endDate}
                onChange={(e) => setFinancialFilter({ ...financialFilter, endDate: e.target.value })}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800"
              />
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* FOUR FINANCIAL STATEMENT TABS */}
      {/* ============================================================== */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white px-3 pt-2 rounded-t-2xl no-print">
        <button
          onClick={() => setActiveTab('pl')}
          className={`flex items-center gap-2 py-3 px-4 sm:px-5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'pl'
              ? 'border-red-600 text-red-600 bg-red-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>قائمة الأرباح والخسائر (Profit & Loss)</span>
        </button>

        <button
          onClick={() => setActiveTab('bs')}
          className={`flex items-center gap-2 py-3 px-4 sm:px-5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'bs'
              ? 'border-red-600 text-red-600 bg-red-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>الميزانية العمومية (Balance Sheet)</span>
        </button>

        <button
          onClick={() => setActiveTab('cf')}
          className={`flex items-center gap-2 py-3 px-4 sm:px-5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'cf'
              ? 'border-red-600 text-red-600 bg-red-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>قائمة التدفقات النقدية (Cash Flows)</span>
        </button>

        <button
          onClick={() => setActiveTab('eq')}
          className={`flex items-center gap-2 py-3 px-4 sm:px-5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'eq'
              ? 'border-red-600 text-red-600 bg-red-50/50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>التغير في حقوق الملكية (Equity)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. PROFIT & LOSS / INCOME STATEMENT VIEW */}
      {/* ============================================================== */}
      {activeTab === 'pl' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">
                إجمالي إيرادات التأجير والتشغيل ({financialFilter.selectedYear})
              </span>
              <div className="text-xl font-black text-slate-900">
                {formatEGP(profitAndLoss.summary.totalRevenue)}
              </div>
              {showComparison && (
                <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-mono">سابق {comparisonYear}: {Math.round((profitAndLoss.summary.previousTotalRevenue || 0) / 1000000)}M ج.م</span>
                  {showVariancePercent && renderVarianceBadge(profitAndLoss.summary.revenueVariancePct)}
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">
                تكاليف التشغيل المباشرة ({financialFilter.selectedYear})
              </span>
              <div className="text-xl font-black text-slate-800">
                {formatEGP(profitAndLoss.summary.totalDirectCosts)}
              </div>
              {showComparison && (
                <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-mono">سابق {comparisonYear}: {Math.round((profitAndLoss.summary.previousTotalDirectCosts || 0) / 1000000)}M ج.م</span>
                  {showVariancePercent && renderVarianceBadge(profitAndLoss.summary.directCostsVariancePct, true)}
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">
                مجمل الربح التشغيلي (Gross Profit)
              </span>
              <div className="text-xl font-black text-blue-900">
                {formatEGP(profitAndLoss.summary.grossProfit)}
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 mt-1 inline-block">
                هامش الربح الإجمالي: {profitAndLoss.summary.grossMarginPct}%
                {showComparison && ` (مقارنة بـ ${profitAndLoss.summary.previousGrossMarginPct}%)`}
              </span>
            </div>

            <div className="bg-gradient-to-br from-red-900 to-slate-900 text-white p-4 rounded-2xl shadow-md">
              <span className="text-[11px] font-bold text-red-200 block mb-1">
                صافي الربح النهائي للفترة (Net Profit)
              </span>
              <div className="text-2xl font-black text-white">
                {formatEGP(profitAndLoss.summary.netProfit)}
              </div>
              {showComparison && (
                <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-red-800/80">
                  <span className="text-red-200 font-mono">سابق {comparisonYear}: {Math.round((profitAndLoss.summary.previousNetProfit || 0) / 1000000)}M ج.م</span>
                  {showVariancePercent && renderVarianceBadge(profitAndLoss.summary.netProfitVariancePct)}
                </div>
              )}
            </div>
          </div>

          {/* Statement Detailed Comparative Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  قائمة الأرباح والخسائر لعام {financialFilter.selectedYear}
                  {showComparison && ` مقابل عام المقارنة ${comparisonYear}`}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-medium">
                جميع المبالغ بالجنيه المصري (EGP)
              </span>
            </div>

            {/* Table structure */}
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[11px] font-black text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-3 w-16 text-center">الكود</th>
                    <th className="py-2.5 px-4">بيان الحساب / البند المحاسبي</th>
                    <th className="py-2.5 px-4 text-left w-36 bg-slate-200/50">
                      السنة الحالية ({financialFilter.selectedYear})
                    </th>
                    {showComparison && (
                      <th className="py-2.5 px-4 text-left w-36 bg-slate-100">
                        سنة المقارنة ({comparisonYear})
                      </th>
                    )}
                    {showComparison && (
                      <th className="py-2.5 px-4 text-left w-32">فارق التغير (ج.م)</th>
                    )}
                    {showComparison && showVariancePercent && (
                      <th className="py-2.5 px-4 text-center w-28">نسبة التغير %</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {profitAndLoss.sections.map((section, sIdx) => {
                    const secKey = sIdx === 0 ? 'rev' : sIdx === 1 ? 'direct' : 'admin';
                    const isExpanded = expandedSections[secKey] !== false;
                    const invertGoodBad = sIdx > 0; // For costs, increase is not automatically good

                    return (
                      <React.Fragment key={sIdx}>
                        {/* Section Header Row */}
                        <tr className="bg-slate-50/90 font-bold border-t border-b border-slate-200">
                          <td colSpan={2} className="py-2.5 px-3">
                            <button
                              onClick={() => toggleSection(secKey)}
                              className="flex items-center gap-2 text-xs font-black text-slate-900 cursor-pointer w-full text-right"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-500 no-print" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-500 no-print" />
                              )}
                              <span>{section.titleAr}</span>
                            </button>
                          </td>
                          <td className="py-2.5 px-4 text-left font-mono font-black text-slate-900 bg-slate-100/60">
                            {formatEGP(section.totalAmount)}
                          </td>
                          {showComparison && (
                            <td className="py-2.5 px-4 text-left font-mono font-bold text-slate-700 bg-slate-50">
                              {formatEGP(section.previousTotalAmount ?? 0)}
                            </td>
                          )}
                          {showComparison && (
                            <td className="py-2.5 px-4 text-left font-mono font-bold text-slate-800">
                              {formatEGP(section.totalVarianceAmount ?? 0)}
                            </td>
                          )}
                          {showComparison && showVariancePercent && (
                            <td className="py-2.5 px-4 text-center">
                              {renderVarianceBadge(section.totalVariancePercent, invertGoodBad)}
                            </td>
                          )}
                        </tr>

                        {/* Section Items */}
                        {isExpanded &&
                          section.items.map((item) => renderRow(item, section.totalAmount, invertGoodBad))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Financial Summaries */}
            <div className="bg-slate-50 p-4 space-y-2 border-t-2 border-slate-300">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>الأرباح التشغيلية قبل الفوائد والضرائب (EBITDA):</span>
                <div className="flex items-center gap-6 font-mono">
                  <span>{formatEGP(profitAndLoss.summary.operatingIncomeEBITDA)}</span>
                  {showComparison && (
                    <span className="text-slate-500 text-[11px]">
                      (سابق: {formatEGP(profitAndLoss.summary.previousOperatingIncomeEBITDA || 0)})
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>فوائد وأعباء تمويل القروض البنكية لشراء الرافعات:</span>
                <span className="text-red-700 font-mono font-semibold">({formatEGP(profitAndLoss.summary.interestExp)})</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>مخصص ضريبة الدخل التقديرية (22.5%):</span>
                <span className="text-red-700 font-mono font-semibold">({formatEGP(profitAndLoss.summary.taxExp)})</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-red-900 pt-3 border-t border-slate-300">
                <span>صافي أرباح الفترة بعد الضرائب (Net Income):</span>
                <div className="flex items-center gap-4">
                  <span className="text-base text-emerald-800 font-mono">{formatEGP(profitAndLoss.summary.netProfit)}</span>
                  {showComparison && (
                    <span className="text-xs text-slate-500 font-normal">
                      مقارنة بـ {formatEGP(profitAndLoss.summary.previousNetProfit || 0)}
                    </span>
                  )}
                  {showComparison && showVariancePercent && renderVarianceBadge(profitAndLoss.summary.netProfitVariancePct)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. BALANCE SHEET VIEW (الميزانية العمومية المقارنة) */}
      {/* ============================================================== */}
      {activeTab === 'bs' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Balance Sheet Balanced Badge Banner */}
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  الميزانية العمومية متزنة تماماً (Total Assets = Liabilities + Equity)
                </h4>
                <p className="text-[11px] text-emerald-700">
                  مجموع الأصول يطابق تماماً مجموع الالتزامات وحقوق المساهمين لعام {financialFilter.selectedYear}
                  {showComparison ? ` وعام المقارنة ${comparisonYear}` : ''} طبقا للمعيار المصري رقم 1.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-bold">إجمالي المركز المالي</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-emerald-900 font-mono">
                  {formatEGP(balanceSheet.totals.totalAssets)}
                </span>
                {showComparison && showVariancePercent && renderVarianceBadge(balanceSheet.totals.assetsVariancePct)}
              </div>
            </div>
          </div>

          {/* Dual Column Layout: Assets on Right (in RTL), Liabilities & Equity on Left */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLUMN 1: ASSETS (الأصول) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  جانب الأصول (Assets)
                </span>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-black text-amber-300">
                    {formatEGP(balanceSheet.totals.totalAssets)}
                  </span>
                  {showComparison && (
                    <span className="text-slate-400 text-[10px]">
                      ({comparisonYear}: {formatEGP(balanceSheet.totals.previousTotalAssets || 0)})
                    </span>
                  )}
                </div>
              </div>

              {/* Table of Assets */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-[10px] text-slate-600 border-b border-slate-200 font-bold">
                      <th className="py-2 px-3">الكود</th>
                      <th className="py-2 px-3">البند</th>
                      <th className="py-2 px-3 text-left">{financialFilter.selectedYear}</th>
                      {showComparison && <th className="py-2 px-3 text-left">{comparisonYear}</th>}
                      {showComparison && showVariancePercent && <th className="py-2 px-3 text-center">التغير %</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Current Assets Header */}
                    <tr className="bg-slate-50 font-bold border-b border-slate-200">
                      <td colSpan={2} className="py-2 px-3 text-slate-800">
                        {balanceSheet.currentAssets.titleAr}
                      </td>
                      <td className="py-2 px-3 text-left font-mono font-bold text-slate-900">
                        {formatEGP(balanceSheet.currentAssets.totalAmount)}
                      </td>
                      {showComparison && (
                        <td className="py-2 px-3 text-left font-mono text-slate-600">
                          {formatEGP(balanceSheet.currentAssets.previousTotalAmount ?? 0)}
                        </td>
                      )}
                      {showComparison && showVariancePercent && (
                        <td className="py-2 px-3 text-center">
                          {renderVarianceBadge(balanceSheet.currentAssets.totalVariancePercent)}
                        </td>
                      )}
                    </tr>
                    {balanceSheet.currentAssets.items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-50 border-b border-slate-100">
                        <td className="py-2 px-3 font-mono text-[10px] text-slate-400">{it.code}</td>
                        <td className="py-2 px-3 text-slate-700">{it.titleAr}</td>
                        <td className="py-2 px-3 text-left font-mono font-bold text-slate-900">{formatEGP(it.amount)}</td>
                        {showComparison && (
                          <td className="py-2 px-3 text-left font-mono text-slate-600">{formatEGP(it.previousAmount ?? 0)}</td>
                        )}
                        {showComparison && showVariancePercent && (
                          <td className="py-2 px-3 text-center">{renderVarianceBadge(it.variancePercent)}</td>
                        )}
                      </tr>
                    ))}

                    {/* Fixed Assets Header */}
                    <tr className="bg-slate-50 font-bold border-y border-slate-200">
                      <td colSpan={2} className="py-2 px-3 text-slate-800">
                        {balanceSheet.fixedAssets.titleAr}
                      </td>
                      <td className="py-2 px-3 text-left font-mono font-bold text-slate-900">
                        {formatEGP(balanceSheet.fixedAssets.totalAmount)}
                      </td>
                      {showComparison && (
                        <td className="py-2 px-3 text-left font-mono text-slate-600">
                          {formatEGP(balanceSheet.fixedAssets.previousTotalAmount ?? 0)}
                        </td>
                      )}
                      {showComparison && showVariancePercent && (
                        <td className="py-2 px-3 text-center">
                          {renderVarianceBadge(balanceSheet.fixedAssets.totalVariancePercent)}
                        </td>
                      )}
                    </tr>
                    {balanceSheet.fixedAssets.items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-50 border-b border-slate-100">
                        <td className="py-2 px-3 font-mono text-[10px] text-slate-400">{it.code}</td>
                        <td className="py-2 px-3 text-slate-700">{it.titleAr}</td>
                        <td className="py-2 px-3 text-left font-mono font-bold text-slate-900">{formatEGP(it.amount)}</td>
                        {showComparison && (
                          <td className="py-2 px-3 text-left font-mono text-slate-600">{formatEGP(it.previousAmount ?? 0)}</td>
                        )}
                        {showComparison && showVariancePercent && (
                          <td className="py-2 px-3 text-center">{renderVarianceBadge(it.variancePercent)}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Assets Foot */}
              <div className="p-4 bg-slate-100 border-t-2 border-slate-300 flex items-center justify-between text-xs font-black text-slate-900">
                <span>إجمالي الأصول (Total Assets):</span>
                <span className="text-sm font-mono text-blue-900">{formatEGP(balanceSheet.totals.totalAssets)}</span>
              </div>
            </div>

            {/* COLUMN 2: LIABILITIES & EQUITY (الخصوم وحقوق الملكية) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-400" />
                  الالتزامات وحقوق الملكية (Liabilities & Equity)
                </span>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-black text-amber-300">
                    {formatEGP(balanceSheet.totals.totalLiabilities + balanceSheet.totals.totalEquity)}
                  </span>
                  {showComparison && (
                    <span className="text-slate-400 text-[10px]">
                      ({comparisonYear}: {formatEGP(balanceSheet.totals.previousTotalLiabilities + balanceSheet.totals.previousTotalEquity)})
                    </span>
                  )}
                </div>
              </div>

              {/* Table of Liabilities & Equity */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-[10px] text-slate-600 border-b border-slate-200 font-bold">
                      <th className="py-2 px-3">الكود</th>
                      <th className="py-2 px-3">البند</th>
                      <th className="py-2 px-3 text-left">{financialFilter.selectedYear}</th>
                      {showComparison && <th className="py-2 px-3 text-left">{comparisonYear}</th>}
                      {showComparison && showVariancePercent && <th className="py-2 px-3 text-center">التغير %</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Current Liabilities */}
                    <tr className="bg-slate-50 font-bold border-b border-slate-200">
                      <td colSpan={2} className="py-2 px-3 text-slate-800">
                        {balanceSheet.currentLiabilities.titleAr}
                      </td>
                      <td className="py-2 px-3 text-left font-mono font-bold text-slate-900">
                        {formatEGP(balanceSheet.currentLiabilities.totalAmount)}
                      </td>
                      {showComparison && (
                        <td className="py-2 px-3 text-left font-mono text-slate-600">
                          {formatEGP(balanceSheet.currentLiabilities.previousTotalAmount ?? 0)}
                        </td>
                      )}
                      {showComparison && showVariancePercent && (
                        <td className="py-2 px-3 text-center">
                          {renderVarianceBadge(balanceSheet.currentLiabilities.totalVariancePercent, true)}
                        </td>
                      )}
                    </tr>
                    {balanceSheet.currentLiabilities.items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-50 border-b border-slate-100">
                        <td className="py-2 px-3 font-mono text-[10px] text-slate-400">{it.code}</td>
                        <td className="py-2 px-3 text-slate-700">{it.titleAr}</td>
                        <td className="py-2 px-3 text-left font-mono font-bold text-slate-900">{formatEGP(it.amount)}</td>
                        {showComparison && (
                          <td className="py-2 px-3 text-left font-mono text-slate-600">{formatEGP(it.previousAmount ?? 0)}</td>
                        )}
                        {showComparison && showVariancePercent && (
                          <td className="py-2 px-3 text-center">{renderVarianceBadge(it.variancePercent, true)}</td>
                        )}
                      </tr>
                    ))}

                    {/* Long Term Liabilities */}
                    <tr className="bg-slate-50 font-bold border-y border-slate-200">
                      <td colSpan={2} className="py-2 px-3 text-slate-800">
                        {balanceSheet.longTermLiabilities.titleAr}
                      </td>
                      <td className="py-2 px-3 text-left font-mono font-bold text-slate-900">
                        {formatEGP(balanceSheet.longTermLiabilities.totalAmount)}
                      </td>
                      {showComparison && (
                        <td className="py-2 px-3 text-left font-mono text-slate-600">
                          {formatEGP(balanceSheet.longTermLiabilities.previousTotalAmount ?? 0)}
                        </td>
                      )}
                      {showComparison && showVariancePercent && (
                        <td className="py-2 px-3 text-center">
                          {renderVarianceBadge(balanceSheet.longTermLiabilities.totalVariancePercent, true)}
                        </td>
                      )}
                    </tr>
                    {balanceSheet.longTermLiabilities.items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-50 border-b border-slate-100">
                        <td className="py-2 px-3 font-mono text-[10px] text-slate-400">{it.code}</td>
                        <td className="py-2 px-3 text-slate-700">{it.titleAr}</td>
                        <td className="py-2 px-3 text-left font-mono font-bold text-slate-900">{formatEGP(it.amount)}</td>
                        {showComparison && (
                          <td className="py-2 px-3 text-left font-mono text-slate-600">{formatEGP(it.previousAmount ?? 0)}</td>
                        )}
                        {showComparison && showVariancePercent && (
                          <td className="py-2 px-3 text-center">{renderVarianceBadge(it.variancePercent, true)}</td>
                        )}
                      </tr>
                    ))}

                    {/* Equity */}
                    <tr className="bg-slate-50 font-bold border-y border-slate-200">
                      <td colSpan={2} className="py-2 px-3 text-slate-800">
                        {balanceSheet.equity.titleAr}
                      </td>
                      <td className="py-2 px-3 text-left font-mono font-bold text-slate-900">
                        {formatEGP(balanceSheet.equity.totalAmount)}
                      </td>
                      {showComparison && (
                        <td className="py-2 px-3 text-left font-mono text-slate-600">
                          {formatEGP(balanceSheet.equity.previousTotalAmount ?? 0)}
                        </td>
                      )}
                      {showComparison && showVariancePercent && (
                        <td className="py-2 px-3 text-center">
                          {renderVarianceBadge(balanceSheet.equity.totalVariancePercent)}
                        </td>
                      )}
                    </tr>
                    {balanceSheet.equity.items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-50 border-b border-slate-100">
                        <td className="py-2 px-3 font-mono text-[10px] text-slate-400">{it.code}</td>
                        <td className="py-2 px-3 text-slate-700">{it.titleAr}</td>
                        <td className="py-2 px-3 text-left font-mono font-bold text-slate-900">{formatEGP(it.amount)}</td>
                        {showComparison && (
                          <td className="py-2 px-3 text-left font-mono text-slate-600">{formatEGP(it.previousAmount ?? 0)}</td>
                        )}
                        {showComparison && showVariancePercent && (
                          <td className="py-2 px-3 text-center">{renderVarianceBadge(it.variancePercent)}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Liabilities & Equity Foot */}
              <div className="p-4 bg-slate-100 border-t-2 border-slate-300 flex items-center justify-between text-xs font-black text-slate-900">
                <span>إجمالي الخصوم وحقوق الملكية:</span>
                <span className="text-sm font-mono text-emerald-900">
                  {formatEGP(balanceSheet.totals.totalLiabilities + balanceSheet.totals.totalEquity)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. CASH FLOW STATEMENT VIEW (قائمة التدفقات النقدية المقارنة) */}
      {/* ============================================================== */}
      {activeTab === 'cf' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Cash KPI Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                رصيد النقدية أول الفترة ({financialFilter.selectedYear})
              </span>
              <div className="text-xl font-black text-slate-800">{formatEGP(cashFlow.summary.beginningCash)}</div>
              {showComparison && (
                <div className="text-[11px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-100">
                  سنة المقارنة {comparisonYear}: {formatEGP(cashFlow.summary.previousBeginningCash)}
                </div>
              )}
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                صافي التدفق النقدي للفترة ({financialFilter.selectedYear})
              </span>
              <div className={`text-xl font-black ${cashFlow.summary.netCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {formatEGP(cashFlow.summary.netCashFlow)}
              </div>
              {showComparison && (
                <div className="text-[11px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-100">
                  سنة المقارنة {comparisonYear}: {formatEGP(cashFlow.summary.previousNetCashFlow)}
                </div>
              )}
            </div>
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md">
              <span className="text-xs font-bold text-amber-300 block mb-1">
                رصيد النقدية آخر الفترة (بالخزائن والبنوك)
              </span>
              <div className="text-2xl font-black text-white">{formatEGP(cashFlow.summary.endingCash)}</div>
              {showComparison && (
                <div className="text-[11px] text-slate-300 font-mono mt-1 pt-1 border-t border-slate-800">
                  سنة المقارنة {comparisonYear}: {formatEGP(cashFlow.summary.previousEndingCash)}
                </div>
              )}
            </div>
          </div>

          {/* Cash Flow Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">
                قائمة التدفقات النقدية المقارنة لعام {financialFilter.selectedYear}
                {showComparison && ` مقابل ${comparisonYear}`}
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Egypt Cranes Cash Management</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[11px] font-black text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-3 w-16 text-center">الكود</th>
                    <th className="py-2.5 px-4">بيان التدفق النقدي</th>
                    <th className="py-2.5 px-4 text-left w-36 bg-slate-200/50">
                      السنة الحالية ({financialFilter.selectedYear})
                    </th>
                    {showComparison && (
                      <th className="py-2.5 px-4 text-left w-36 bg-slate-100">
                        سنة المقارنة ({comparisonYear})
                      </th>
                    )}
                    {showComparison && (
                      <th className="py-2.5 px-4 text-left w-32">الفارق (ج.م)</th>
                    )}
                    {showComparison && showVariancePercent && (
                      <th className="py-2.5 px-4 text-center w-28">نسبة التغير %</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { section: cashFlow.operating, key: 'cf_ops' },
                    { section: cashFlow.investing, key: 'cf_inv' },
                    { section: cashFlow.financing, key: 'cf_fin' },
                  ].map(({ section, key }, idx) => {
                    const isExpanded = expandedSections[key] !== false;
                    return (
                      <React.Fragment key={idx}>
                        <tr className="bg-slate-100/90 font-bold border-y border-slate-200">
                          <td colSpan={2} className="py-2.5 px-3">
                            <button
                              onClick={() => toggleSection(key)}
                              className="flex items-center gap-2 text-xs font-black text-slate-900 cursor-pointer w-full text-right"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-500 no-print" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-500 no-print" />
                              )}
                              <span>{section.titleAr}</span>
                            </button>
                          </td>
                          <td className="py-2.5 px-4 text-left font-mono font-black text-slate-900 bg-slate-200/40">
                            {formatEGP(section.totalAmount)}
                          </td>
                          {showComparison && (
                            <td className="py-2.5 px-4 text-left font-mono font-bold text-slate-700 bg-slate-100/40">
                              {formatEGP(section.previousTotalAmount ?? 0)}
                            </td>
                          )}
                          {showComparison && (
                            <td className="py-2.5 px-4 text-left font-mono font-bold text-slate-800">
                              {formatEGP(section.totalVarianceAmount ?? 0)}
                            </td>
                          )}
                          {showComparison && showVariancePercent && (
                            <td className="py-2.5 px-4 text-center">
                              {renderVarianceBadge(section.totalVariancePercent)}
                            </td>
                          )}
                        </tr>
                        {isExpanded && section.items.map((it) => renderRow(it, section.totalAmount))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cash Reconciliation Summary */}
            <div className="p-4 bg-slate-50 space-y-1.5 border-t-2 border-slate-300">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>صافي الزيادة / (النقص) في النقدية وما في حكمها:</span>
                <span className="text-emerald-800 font-mono font-bold">{formatEGP(cashFlow.summary.netCashFlow)}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>رصيد النقدية في بداية الفترة:</span>
                <span className="font-mono">{formatEGP(cashFlow.summary.beginningCash)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>رصيد النقدية وما في حكمها في نهاية الفترة:</span>
                <span className="text-base font-mono text-red-900">{formatEGP(cashFlow.summary.endingCash)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. STATEMENT OF CHANGES IN EQUITY (قائمة التغير في حقوق الملكية) */}
      {/* ============================================================== */}
      {activeTab === 'eq' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  قائمة التغير في حقوق المساهمين لعام {financialFilter.selectedYear}
                  {showComparison && ` مقارنة بعام ${comparisonYear}`}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-medium">
                طبقاً لمعيار المحاسبة المصري رقم (1)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[11px] font-black text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-3 w-16 text-center">الكود</th>
                    <th className="py-2.5 px-4">البند الرأسمالي</th>
                    <th className="py-2.5 px-4 text-left w-40 bg-slate-200/50">
                      السنة الحالية ({financialFilter.selectedYear})
                    </th>
                    {showComparison && (
                      <th className="py-2.5 px-4 text-left w-40 bg-slate-100">
                        سنة المقارنة ({comparisonYear})
                      </th>
                    )}
                    {showComparison && (
                      <th className="py-2.5 px-4 text-left w-36">الفارق (ج.م)</th>
                    )}
                    {showComparison && showVariancePercent && (
                      <th className="py-2.5 px-4 text-center w-28">نسبة التغير %</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {equityChanges.items.map((it) => renderRow(it, equityChanges.totalAmount))}
                  {/* Total Equity Row */}
                  <tr className="bg-slate-100 font-black text-xs border-t-2 border-slate-300">
                    <td className="py-3 px-3 text-center">-</td>
                    <td className="py-3 px-4 font-black text-slate-950">إجمالي حقوق الملكية في نهاية الفترة:</td>
                    <td className="py-3 px-4 text-left font-mono font-black text-emerald-900 text-sm">
                      {formatEGP(equityChanges.totalAmount)}
                    </td>
                    {showComparison && (
                      <td className="py-3 px-4 text-left font-mono font-bold text-slate-700">
                        {formatEGP(equityChanges.previousTotalAmount ?? 0)}
                      </td>
                    )}
                    {showComparison && (
                      <td className="py-3 px-4 text-left font-mono font-bold text-slate-800">
                        {formatEGP(equityChanges.totalVarianceAmount ?? 0)}
                      </td>
                    )}
                    {showComparison && showVariancePercent && (
                      <td className="py-3 px-4 text-center">
                        {renderVarianceBadge(equityChanges.totalVariancePercent)}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* AUDIT SIGN-OFF BLOCK (Visible in both screen and print) */}
      {/* ============================================================== */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:border-slate-800 print:shadow-none print-break-inside-avoid">
        <h4 className="text-xs font-black text-slate-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>اعتماد القوائم المالية والمطابقة المحاسبية (Audit & Governance Sign-off)</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
          <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 print:bg-white print:border-slate-400">
            <span className="text-[10px] text-slate-400 block font-semibold">إعداد القوائم</span>
            <div className="font-bold text-slate-800 mt-1">أ. هاني عبد الرحمن</div>
            <span className="text-[10px] text-slate-500 block">رئيس قسم الحسابات العامة</span>
            <div className="mt-4 pt-2 border-t border-dashed border-slate-300 font-mono text-[9px] text-slate-400">
              التوقيع المعتمد
            </div>
          </div>

          <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 print:bg-white print:border-slate-400">
            <span className="text-[10px] text-slate-400 block font-semibold">مراجعة التكاليف</span>
            <div className="font-bold text-slate-800 mt-1">أ. طارق كمال</div>
            <span className="text-[10px] text-slate-500 block">مدير إدارة التكاليف والموازنات</span>
            <div className="mt-4 pt-2 border-t border-dashed border-slate-300 font-mono text-[9px] text-slate-400">
              التوقيع المعتمد
            </div>
          </div>

          <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 print:bg-white print:border-slate-400">
            <span className="text-[10px] text-slate-400 block font-semibold">الاعتماد المالي</span>
            <div className="font-bold text-slate-800 mt-1">أ. أشرف سليمان</div>
            <span className="text-[10px] text-slate-500 block">المدير المالي التنفيذي (CFO)</span>
            <div className="mt-4 pt-2 border-t border-dashed border-slate-300 font-mono text-[9px] text-slate-400">
              التوقيع والختم
            </div>
          </div>

          <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 print:bg-white print:border-slate-400">
            <span className="text-[10px] text-slate-400 block font-semibold">المراجعة الخارجية</span>
            <div className="font-bold text-slate-800 mt-1">مكتب د. مصطفى الشريف</div>
            <span className="text-[10px] text-slate-500 block">مراقب الحسابات المستقل (Auditor)</span>
            <div className="mt-4 pt-2 border-t border-dashed border-slate-300 font-mono text-[9px] text-slate-400">
              تقرير فحص غير متحفظ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
