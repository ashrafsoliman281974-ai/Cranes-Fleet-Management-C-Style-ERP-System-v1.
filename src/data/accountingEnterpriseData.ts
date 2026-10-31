import {
  EquipmentCostingProfile,
  BudgetRecord,
  BudgetOverrideRequest,
  FinancialFilter,
  StatementSection,
  StatementLineItem,
} from '../types/erp';

// ==================== INITIAL EQUIPMENT HOURLY COSTING DATA ====================
export const INITIAL_EQUIPMENT_COSTING: EquipmentCostingProfile[] = [
  {
    id: 'cost-1',
    craneId: 'flt-1',
    craneModel: 'Liebherr LTM 11200-9.1 (1200 Ton)',
    craneBrand: 'Liebherr',
    capacityTon: 1200,
    plateNoOrCode: 'EC-1200-01',
    directCosts: {
      fuelLitersPerHour: 65,
      fuelPricePerLiter: 14.5,
      fuelCostPerHour: 942.5,
      operatorHourlyWage: 250,
      riggerHourlyWage: 120,
      lubricantsAndHydraulicsPerHour: 220,
      wearTearSparePartsPerHour: 450,
      tiresAndWireRopesPerHour: 180,
      totalDirectCostPerHour: 2162.5,
    },
    indirectCosts: {
      craneAssetValue: 85000000,
      economicLifeYears: 15,
      annualWorkingHoursTarget: 1800,
      depreciationPerHour: 3148,
      insuranceAndCertificationsPerHour: 420,
      yardAndWorkshopOverheadPerHour: 250,
      adminAndGpsTrackingPerHour: 110,
      totalIndirectCostPerHour: 3928,
    },
    totalOperatingCostPerHour: 6090.5,
    breakEvenHourlyRate: 6090.5,
    currentRentalHourlyRate: 9500,
    targetProfitMarginPercent: 35.8,
    hourlyGrossProfit: 3409.5,
    hourlyProfitMarginPercent: 35.88,
    lastUpdated: '2026-10-24',
  },
  {
    id: 'cost-2',
    craneId: 'flt-2',
    craneModel: 'Demag AC 700 SSL (700 Ton)',
    craneBrand: 'Demag',
    capacityTon: 700,
    plateNoOrCode: 'EC-700-02',
    directCosts: {
      fuelLitersPerHour: 48,
      fuelPricePerLiter: 14.5,
      fuelCostPerHour: 696,
      operatorHourlyWage: 190,
      riggerHourlyWage: 95,
      lubricantsAndHydraulicsPerHour: 160,
      wearTearSparePartsPerHour: 310,
      tiresAndWireRopesPerHour: 130,
      totalDirectCostPerHour: 1581,
    },
    indirectCosts: {
      craneAssetValue: 48000000,
      economicLifeYears: 14,
      annualWorkingHoursTarget: 2000,
      depreciationPerHour: 1714,
      insuranceAndCertificationsPerHour: 280,
      yardAndWorkshopOverheadPerHour: 180,
      adminAndGpsTrackingPerHour: 85,
      totalIndirectCostPerHour: 2259,
    },
    totalOperatingCostPerHour: 3840,
    breakEvenHourlyRate: 3840,
    currentRentalHourlyRate: 5800,
    targetProfitMarginPercent: 33.7,
    hourlyGrossProfit: 1960,
    hourlyProfitMarginPercent: 33.79,
    lastUpdated: '2026-10-24',
  },
  {
    id: 'cost-3',
    craneId: 'flt-3',
    craneModel: 'Liebherr LR 1600/2 Crawler (600 Ton)',
    craneBrand: 'Liebherr',
    capacityTon: 600,
    plateNoOrCode: 'EC-600-03',
    directCosts: {
      fuelLitersPerHour: 42,
      fuelPricePerLiter: 14.5,
      fuelCostPerHour: 609,
      operatorHourlyWage: 180,
      riggerHourlyWage: 90,
      lubricantsAndHydraulicsPerHour: 145,
      wearTearSparePartsPerHour: 280,
      tiresAndWireRopesPerHour: 95,
      totalDirectCostPerHour: 1399,
    },
    indirectCosts: {
      craneAssetValue: 42000000,
      economicLifeYears: 16,
      annualWorkingHoursTarget: 2100,
      depreciationPerHour: 1250,
      insuranceAndCertificationsPerHour: 240,
      yardAndWorkshopOverheadPerHour: 160,
      adminAndGpsTrackingPerHour: 75,
      totalIndirectCostPerHour: 1725,
    },
    totalOperatingCostPerHour: 3124,
    breakEvenHourlyRate: 3124,
    currentRentalHourlyRate: 4900,
    targetProfitMarginPercent: 36.2,
    hourlyGrossProfit: 1776,
    hourlyProfitMarginPercent: 36.24,
    lastUpdated: '2026-10-24',
  },
  {
    id: 'cost-4',
    craneId: 'flt-4',
    craneModel: 'Liebherr LTM 1500-8.1 (500 Ton)',
    craneBrand: 'Liebherr',
    capacityTon: 500,
    plateNoOrCode: 'EC-500-04',
    directCosts: {
      fuelLitersPerHour: 36,
      fuelPricePerLiter: 14.5,
      fuelCostPerHour: 522,
      operatorHourlyWage: 160,
      riggerHourlyWage: 80,
      lubricantsAndHydraulicsPerHour: 125,
      wearTearSparePartsPerHour: 240,
      tiresAndWireRopesPerHour: 90,
      totalDirectCostPerHour: 1217,
    },
    indirectCosts: {
      craneAssetValue: 34000000,
      economicLifeYears: 14,
      annualWorkingHoursTarget: 2100,
      depreciationPerHour: 1156,
      insuranceAndCertificationsPerHour: 210,
      yardAndWorkshopOverheadPerHour: 140,
      adminAndGpsTrackingPerHour: 65,
      totalIndirectCostPerHour: 1571,
    },
    totalOperatingCostPerHour: 2788,
    breakEvenHourlyRate: 2788,
    currentRentalHourlyRate: 4200,
    targetProfitMarginPercent: 33.6,
    hourlyGrossProfit: 1412,
    hourlyProfitMarginPercent: 33.61,
    lastUpdated: '2026-10-24',
  },
  {
    id: 'cost-5',
    craneId: 'flt-6',
    craneModel: 'Tadano ATF 220G-5 (220 Ton)',
    craneBrand: 'Tadano',
    capacityTon: 220,
    plateNoOrCode: 'EC-220-06',
    directCosts: {
      fuelLitersPerHour: 24,
      fuelPricePerLiter: 14.5,
      fuelCostPerHour: 348,
      operatorHourlyWage: 120,
      riggerHourlyWage: 60,
      lubricantsAndHydraulicsPerHour: 85,
      wearTearSparePartsPerHour: 160,
      tiresAndWireRopesPerHour: 65,
      totalDirectCostPerHour: 838,
    },
    indirectCosts: {
      craneAssetValue: 18500000,
      economicLifeYears: 12,
      annualWorkingHoursTarget: 2200,
      depreciationPerHour: 700,
      insuranceAndCertificationsPerHour: 140,
      yardAndWorkshopOverheadPerHour: 95,
      adminAndGpsTrackingPerHour: 45,
      totalIndirectCostPerHour: 980,
    },
    totalOperatingCostPerHour: 1818,
    breakEvenHourlyRate: 1818,
    currentRentalHourlyRate: 2750,
    targetProfitMarginPercent: 33.8,
    hourlyGrossProfit: 932,
    hourlyProfitMarginPercent: 33.89,
    lastUpdated: '2026-10-24',
  },
  {
    id: 'cost-6',
    craneId: 'flt-7',
    craneModel: 'Grove RT890E Rough Terrain (90 Ton)',
    craneBrand: 'Grove',
    capacityTon: 90,
    plateNoOrCode: 'EC-90-07',
    directCosts: {
      fuelLitersPerHour: 18,
      fuelPricePerLiter: 14.5,
      fuelCostPerHour: 261,
      operatorHourlyWage: 95,
      riggerHourlyWage: 50,
      lubricantsAndHydraulicsPerHour: 60,
      wearTearSparePartsPerHour: 110,
      tiresAndWireRopesPerHour: 45,
      totalDirectCostPerHour: 621,
    },
    indirectCosts: {
      craneAssetValue: 9500000,
      economicLifeYears: 12,
      annualWorkingHoursTarget: 2300,
      depreciationPerHour: 344,
      insuranceAndCertificationsPerHour: 85,
      yardAndWorkshopOverheadPerHour: 65,
      adminAndGpsTrackingPerHour: 30,
      totalIndirectCostPerHour: 524,
    },
    totalOperatingCostPerHour: 1145,
    breakEvenHourlyRate: 1145,
    currentRentalHourlyRate: 1750,
    targetProfitMarginPercent: 34.5,
    hourlyGrossProfit: 605,
    hourlyProfitMarginPercent: 34.57,
    lastUpdated: '2026-10-24',
  },
];

// ==================== INITIAL MULTI-LEVEL BUDGET RECORDS ====================
export const INITIAL_BUDGETS: BudgetRecord[] = [
  // --- 1. Level: حساب (Account Level) ---
  {
    id: 'bdg-acc-1',
    code: '5110',
    level: 'حساب',
    targetNameAr: '5110 - وقود وسولار ديزل الأسطول والمشاريع',
    targetNameEn: 'Diesel Fuel for Crane Fleet',
    referenceId: 'acc-5110',
    fiscalYear: 2026,
    allocatedBudget: 12000000,
    actualSpent: 10450000,
    committedAmount: 950000,
    variance: 600000,
    utilizationPercent: 87.1,
    status: 'تحذير (قريب من الحد)',
    notes: 'موازنة السولار السنوية لأسطول الرافعات بكافة المشاريع البترولية والقومية',
    lastUpdated: '2026-10-24',
  },
  {
    id: 'bdg-acc-2',
    code: '5210',
    level: 'حساب',
    targetNameAr: '5210 - قطع غيار وهيدروليك وخراطيم ضغط عالي',
    targetNameEn: 'Hydraulic & Mechanical Spare Parts',
    referenceId: 'acc-5210',
    fiscalYear: 2026,
    allocatedBudget: 6500000,
    actualSpent: 6920000,
    committedAmount: 480000,
    variance: -420000,
    utilizationPercent: 106.5,
    status: 'تجاوز الموازنة (محظور)',
    approvedOverrideAmount: 500000,
    notes: 'تجاوز الموازنة بسبب عمرة ذراع التلسكوب لرافعة 500 طن واستيراد بساتم ألمانية عاجلة',
    lastUpdated: '2026-10-24',
  },
  {
    id: 'bdg-acc-3',
    code: '5310',
    level: 'حساب',
    targetNameAr: '5310 - رواتب ومكافآت مشغلي الأوناش والريجر',
    targetNameEn: 'Crane Operators & Riggers Payroll',
    referenceId: 'acc-5310',
    fiscalYear: 2026,
    allocatedBudget: 9000000,
    actualSpent: 6750000,
    committedAmount: 620000,
    variance: 1630000,
    utilizationPercent: 75.0,
    status: 'ضمن الموازنة',
    notes: 'رواتب مشغلي الأوناش والورديات الميدانية الإضافية',
    lastUpdated: '2026-10-24',
  },
  {
    id: 'bdg-acc-4',
    code: '5410',
    level: 'حساب',
    targetNameAr: '5410 - تأمين شامل وتراخيص ومعايرات دولية للرافعات',
    targetNameEn: 'Crane Insurance & Third-Party Inspection',
    referenceId: 'acc-5410',
    fiscalYear: 2026,
    allocatedBudget: 3800000,
    actualSpent: 3650000,
    committedAmount: 120000,
    variance: 30000,
    utilizationPercent: 96.1,
    status: 'تحذير (قريب من الحد)',
    notes: 'تجديد وثائق التأمين الشامل وفحص TÜV وBureau Veritas السنوية',
    lastUpdated: '2026-10-24',
  },

  // --- 2. Level: إدارة (Department Level) ---
  {
    id: 'bdg-dept-1',
    code: 'DEPT-OPS',
    level: 'إدارة',
    targetNameAr: 'إدارة العمليات والتشغيل الميداني وهندسة الرفع',
    targetNameEn: 'Operations & Field Lifting Dept',
    referenceId: 'dept-ops',
    fiscalYear: 2026,
    allocatedBudget: 45000000,
    actualSpent: 38200000,
    committedAmount: 2900000,
    variance: 3900000,
    utilizationPercent: 84.8,
    status: 'تحذير (قريب من الحد)',
    notes: 'الموازنة الشاملة لنقل وتشغيل وتأمين الرافعات في كافة المواقع',
    lastUpdated: '2026-10-24',
  },
  {
    id: 'bdg-dept-2',
    code: 'DEPT-MAINT',
    level: 'إدارة',
    targetNameAr: 'إدارة الصيانة والورش المركزية والدعم الفني',
    targetNameEn: 'Central Maintenance & Workshops Dept',
    referenceId: 'dept-maint',
    fiscalYear: 2026,
    allocatedBudget: 11000000,
    actualSpent: 11650000,
    committedAmount: 850000,
    variance: -650000,
    utilizationPercent: 105.9,
    status: 'تجاوز الموازنة (محظور)',
    notes: 'تجاوز حد الصيانة السنوية يتطلب موافقة المدير المالي لأي أوامر توريد جديدة',
    lastUpdated: '2026-10-24',
  },
  {
    id: 'bdg-dept-3',
    code: 'DEPT-HSE',
    level: 'إدارة',
    targetNameAr: 'إدارة السلامة والصحة المهنية وتصاريح الرفع (HSE)',
    targetNameEn: 'Health, Safety & Environment (HSE)',
    referenceId: 'dept-hse',
    fiscalYear: 2026,
    allocatedBudget: 2800000,
    actualSpent: 1850000,
    committedAmount: 220000,
    variance: 730000,
    utilizationPercent: 66.1,
    status: 'ضمن الموازنة',
    notes: 'مهمات الوقاية الشخصية، فحص ركائز الأوناش، تدريب فنيي الإشارة والريجر',
    lastUpdated: '2026-10-24',
  },

  // --- 3. Level: مشروع (Project Level) ---
  {
    id: 'bdg-proj-1',
    code: 'PRJ-ZOHR',
    level: 'مشروع',
    targetNameAr: 'مشروع: حقل ظهر للغاز الطبيعي - محطة المعالجة البحرية',
    targetNameEn: 'Zohr Gas Field Deepwater Plant Project',
    referenceId: 'prj-zohr',
    fiscalYear: 2026,
    allocatedBudget: 15000000,
    actualSpent: 12450000,
    committedAmount: 1100000,
    variance: 1450000,
    utilizationPercent: 83.0,
    status: 'تحذير (قريب من الحد)',
    notes: 'موقع بورسعيد - رافعة ليبهير 500 طن وسيارة ورشة متنقلة',
    lastUpdated: '2026-10-24',
  },
  {
    id: 'bdg-proj-2',
    code: 'PRJ-MONORAIL',
    level: 'مشروع',
    targetNameAr: 'مشروع: مونوريل والبرج الأيقوني بالعاصمة الإدارية R3',
    targetNameEn: 'New Administrative Capital Monorail',
    referenceId: 'prj-monorail',
    fiscalYear: 2026,
    allocatedBudget: 18000000,
    actualSpent: 15850000,
    committedAmount: 1500000,
    variance: 650000,
    utilizationPercent: 88.1,
    status: 'تحذير (قريب من الحد)',
    notes: 'تركيب كمرات المونوريل بواسطة رافعة ديمج 700 طن وتريلات الأوزان',
    lastUpdated: '2026-10-24',
  },
  {
    id: 'bdg-proj-3',
    code: 'PRJ-DABAA',
    level: 'مشروع',
    targetNameAr: 'مشروع: محطة الضبعة للطاقة النووية - بلوك المفاعلات',
    targetNameEn: 'El-Dabaa Nuclear Power Plant Project',
    referenceId: 'prj-dabaa',
    fiscalYear: 2026,
    allocatedBudget: 22000000,
    actualSpent: 23100000,
    committedAmount: 1800000,
    variance: -1100000,
    utilizationPercent: 105.0,
    status: 'تجاوز الموازنة (محظور)',
    notes: 'موقع الضبعة النووي - رافعة 1200 طن ومجنزرة 600 طن، العمل على مدار الساعة',
    lastUpdated: '2026-10-24',
  },

  // --- 4. Level: عميل (Client Level) ---
  {
    id: 'bdg-clnt-1',
    code: 'CLT-PETROBEL',
    level: 'عميل',
    targetNameAr: 'العميل: شركة بترول بلاعيم (بتروبل للغاز)',
    targetNameEn: 'Petrobel Petroleum Co.',
    referenceId: 'clt-petrobel',
    fiscalYear: 2026,
    allocatedBudget: 16000000,
    actualSpent: 13200000,
    committedAmount: 1200000,
    variance: 1600000,
    utilizationPercent: 82.5,
    status: 'تحذير (قريب من الحد)',
    notes: 'سقف التكاليف المعتمد لمناقصة عقود التأجير بحقل ظهر',
    lastUpdated: '2026-10-24',
  },
  {
    id: 'bdg-clnt-2',
    code: 'CLT-ORASCOM',
    level: 'عميل',
    targetNameAr: 'العميل: تحالف شركة أوراسكوم والمقاولون العرب',
    targetNameEn: 'Orascom & Arab Contractors JV',
    referenceId: 'clt-orascom',
    fiscalYear: 2026,
    allocatedBudget: 20000000,
    actualSpent: 17100000,
    committedAmount: 1400000,
    variance: 1500000,
    utilizationPercent: 85.5,
    status: 'تحذير (قريب من الحد)',
    notes: 'عقود المونوريل والقطار الكهربائي السريع',
    lastUpdated: '2026-10-24',
  },
  {
    id: 'bdg-clnt-3',
    code: 'CLT-ENI',
    level: 'عميل',
    targetNameAr: 'العميل: شركة إيني الإيطالية (IEOC Production B.V.)',
    targetNameEn: 'IEOC Production B.V. (ENI Egypt)',
    referenceId: 'clt-eni',
    fiscalYear: 2026,
    allocatedBudget: 14000000,
    actualSpent: 14850000,
    committedAmount: 900000,
    variance: -850000,
    utilizationPercent: 106.1,
    status: 'تجاوز الموازنة (محظور)',
    notes: 'مشاريع الرفع التخصصي لحقول الغاز، مطلوب ملحق موازنة معتمد',
    lastUpdated: '2026-10-24',
  },
];

// ==================== INITIAL BUDGET OVERRIDE REQUESTS ====================
export const INITIAL_BUDGET_OVERRIDES: BudgetOverrideRequest[] = [
  {
    id: 'ovr-1',
    requestNo: 'OVR-2026-0012',
    budgetId: 'bdg-acc-2',
    budgetNameAr: '5210 - قطع غيار وهيدروليك وخراطيم ضغط عالي',
    level: 'حساب',
    allocatedBudget: 6500000,
    currentSpent: 6920000,
    transactionAmount: 380000,
    exceededAmount: 420000,
    requestedByUserId: 'usr-5',
    requestedByUserNameAr: 'طارق كمال (محاسب تكاليف وتشغيل)',
    requestDate: '2026-10-24',
    justificationAr: 'تطلب توريد طقم جوانات وبسطون هيدروليك أصلي لرافعة ليبهير 500 طن بحقل ظهر لتفادي غرامات توقف العمل بالموقع.',
    status: 'معتمد استثنائياً',
    approvedByUserId: 'usr-2',
    approvedByUserNameAr: 'أشرف سليمان (المدير المالي)',
    approvedAt: '2026-10-24 16:30',
    approvalRemarks: 'تمت الموافقة استثنائياً لأهمية سلامة المشروع البترولي، وتخصيص المبلغ من وفر بند مهمات السلامة.',
  },
  {
    id: 'ovr-2',
    requestNo: 'OVR-2026-0013',
    budgetId: 'bdg-dept-2',
    budgetNameAr: 'إدارة الصيانة والورش المركزية والدعم الفني',
    level: 'إدارة',
    allocatedBudget: 11000000,
    currentSpent: 11650000,
    transactionAmount: 250000,
    exceededAmount: 650000,
    requestedByUserId: 'usr-3',
    requestedByUserNameAr: 'م. إبراهيم القاضي (مدير الصيانة)',
    requestDate: '2026-10-25',
    justificationAr: 'طلب صرف زيوت هيدروليك وفلاتر توربينية لعمرة رافعة ديمج 700 طن قبل انتقالها لموقع السويس للصلب.',
    status: 'بانتظار اعتماد المدير المالي',
  },
  {
    id: 'ovr-3',
    requestNo: 'OVR-2026-0014',
    budgetId: 'bdg-proj-3',
    budgetNameAr: 'مشروع: محطة الضبعة للطاقة النووية - بلوك المفاعلات',
    level: 'مشروع',
    allocatedBudget: 22000000,
    currentSpent: 23100000,
    transactionAmount: 450000,
    exceededAmount: 1100000,
    requestedByUserId: 'usr-5',
    requestedByUserNameAr: 'طارق كمال (محاسب تكاليف وتشغيل)',
    requestDate: '2026-10-25',
    justificationAr: 'ساعات تشغيل إضافية ليلية لرافعة 1200 طن لتثبيت دعامات قبة المفاعل النووي حسب الجدول الزمني الحرج.',
    status: 'بانتظار اعتماد المدير المالي',
  },
];

// ==================== FINANCIAL STATEMENTS GENERATORS WITH COMPARATIVE DATA ====================
export const getFilteredFinancialData = (filter: FinancialFilter) => {
  // Ratio multiplier based on quarter or full year
  let periodMultiplier = 1.0;
  if (filter.periodType === 'quarterly') {
    if (filter.selectedQuarter === 'Q1') periodMultiplier = 0.23;
    else if (filter.selectedQuarter === 'Q2') periodMultiplier = 0.26;
    else if (filter.selectedQuarter === 'Q3') periodMultiplier = 0.28;
    else if (filter.selectedQuarter === 'Q4') periodMultiplier = 0.23;
    else periodMultiplier = 1.0;
  } else if (filter.periodType === 'custom') {
    periodMultiplier = 0.5;
  }

  const selectedYear = filter.selectedYear || 2026;
  const comparisonYear = filter.comparisonYear || (selectedYear === 2026 ? 2025 : selectedYear - 1);

  // Growth / scale factor relative to 2026 baseline
  const getYearFactor = (year: number) => {
    const diff = 2026 - year;
    return Math.max(0.3, Math.pow(0.885, diff));
  };

  const computeStatementNumbers = (year: number) => {
    const yFactor = getYearFactor(year);
    const m = periodMultiplier * yFactor;

    // Baseline Annual Numbers in EGP
    const revRentals = Math.round(96400000 * m);
    const revHaulage = Math.round(14800000 * m);
    const revMob = Math.round(7200000 * m);
    const revTech = Math.round(3600000 * m);
    const totalRevenue = revRentals + revHaulage + revMob + revTech;

    const costDiesel = Math.round(13800000 * m);
    const costOps = Math.round(9400000 * m);
    const costSpares = Math.round(7600000 * m);
    const costHyd = Math.round(4200000 * m);
    const costDeprec = Math.round(18500000 * m);
    const costInsur = Math.round(3800000 * m);
    const totalDirectCosts = costDiesel + costOps + costSpares + costHyd + costDeprec + costInsur;

    const grossProfit = totalRevenue - totalDirectCosts;
    const grossMarginPct = Number(((grossProfit / totalRevenue) * 100).toFixed(1));

    const expSalaries = Math.round(5200000 * m);
    const expYard = Math.round(2400000 * m);
    const expMkt = Math.round(1800000 * m);
    const expIT = Math.round(950000 * m);
    const totalOperatingExp = expSalaries + expYard + expMkt + expIT;

    const operatingIncomeEBITDA = grossProfit - totalOperatingExp;
    const interestExp = Math.round(3100000 * m);
    const taxExp = Math.round(6400000 * m);
    const netProfit = operatingIncomeEBITDA - interestExp - taxExp;
    const netMarginPct = Number(((netProfit / totalRevenue) * 100).toFixed(1));

    // Balance Sheet (Cumulative at period end)
    const bsCash = Math.round(18450000 * (1 + m * 0.1));
    const bsBanks = Math.round(34200000 * (1 + m * 0.05));
    const bsCheques = Math.round(8900000 * (1 + m * 0.08));
    const bsReceivables = Math.round(27400000 * (1 + m * 0.12));
    const bsInventory = Math.round(14600000 * (1 + m * 0.02));
    const totalCurrentAssets = bsCash + bsBanks + bsCheques + bsReceivables + bsInventory;

    const bsCranesFleet = Math.round(235000000 * (0.9 + yFactor * 0.1));
    const bsVehicles = Math.round(24000000 * (0.9 + yFactor * 0.1));
    const bsEquipmentTools = Math.round(11500000 * (0.9 + yFactor * 0.1));
    const bsBuildings = 18000000;
    const bsAccDeprec = -Math.round(48500000 * (0.85 + yFactor * 0.15) + costDeprec);
    const totalFixedAssets = bsCranesFleet + bsVehicles + bsEquipmentTools + bsBuildings + bsAccDeprec;

    const totalAssets = totalCurrentAssets + totalFixedAssets;

    const bsPayables = Math.round(14200000 * (1 + m * 0.05));
    const bsTaxDue = Math.round(taxExp * 0.6);
    const bsAccruedPayroll = Math.round(3100000 * (1 + m * 0.02));
    const totalCurrentLiab = bsPayables + bsTaxDue + bsAccruedPayroll;

    const bsLongTermLoans = Math.round(46000000 - interestExp * 1.5);
    const bsProvisions = 6800000;
    const totalNonCurrentLiab = bsLongTermLoans + bsProvisions;
    const totalLiabilities = totalCurrentLiab + totalNonCurrentLiab;

    const bsCapital = 180000000;
    const bsRetainedEarnings = Math.round(42000000 + (year - 2022) * 4500000);
    const bsCurrentProfit = netProfit;
    const totalEquity = totalAssets - totalLiabilities; // Perfectly balanced

    // Cash Flow
    const cfCashFromOps = Math.round(operatingIncomeEBITDA * 1.05 - bsReceivables * 0.1);
    const cfCapEx = -Math.round(12000000 * m);
    const cfDebtRepay = -Math.round(4500000 * m);
    const netCashFlow = cfCashFromOps + cfCapEx + cfDebtRepay;
    const beginningCash = Math.round(35000000 + (year - 2022) * 2500000);
    const endingCash = beginningCash + netCashFlow;

    return {
      revRentals,
      revHaulage,
      revMob,
      revTech,
      totalRevenue,
      costDiesel,
      costOps,
      costSpares,
      costHyd,
      costDeprec,
      costInsur,
      totalDirectCosts,
      grossProfit,
      grossMarginPct,
      expSalaries,
      expYard,
      expMkt,
      expIT,
      totalOperatingExp,
      operatingIncomeEBITDA,
      interestExp,
      taxExp,
      netProfit,
      netMarginPct,
      // Balance sheet
      bsCash,
      bsBanks,
      bsCheques,
      bsReceivables,
      bsInventory,
      totalCurrentAssets,
      bsCranesFleet,
      bsVehicles,
      bsEquipmentTools,
      bsBuildings,
      bsAccDeprec,
      totalFixedAssets,
      totalAssets,
      bsPayables,
      bsTaxDue,
      bsAccruedPayroll,
      totalCurrentLiab,
      bsLongTermLoans,
      bsProvisions,
      totalNonCurrentLiab,
      totalLiabilities,
      bsCapital,
      bsRetainedEarnings,
      bsCurrentProfit,
      totalEquity,
      // Cash flow
      cfCashFromOps,
      cfCapEx,
      cfDebtRepay,
      netCashFlow,
      beginningCash,
      endingCash,
    };
  };

  const cur = computeStatementNumbers(selectedYear);
  const comp = computeStatementNumbers(comparisonYear);

  // Helper to attach comparative amounts and percentage variance
  const makeItem = (
    id: string,
    code: string,
    titleAr: string,
    titleEn: string,
    curVal: number,
    compVal: number
  ): StatementLineItem => {
    const varianceAmount = curVal - compVal;
    const variancePercent = compVal !== 0 ? Math.round(((curVal - compVal) / Math.abs(compVal)) * 1000) / 10 : 0;
    return {
      id,
      code,
      titleAr,
      titleEn,
      amount: curVal,
      previousAmount: compVal,
      varianceAmount,
      variancePercent,
    };
  };

  const makeSection = (
    titleAr: string,
    titleEn: string,
    items: StatementLineItem[],
    totalAmount: number,
    previousTotalAmount: number
  ): StatementSection => {
    const totalVarianceAmount = totalAmount - previousTotalAmount;
    const totalVariancePercent =
      previousTotalAmount !== 0 ? Math.round(((totalAmount - previousTotalAmount) / Math.abs(previousTotalAmount)) * 1000) / 10 : 0;
    return {
      titleAr,
      titleEn,
      items,
      totalAmount,
      previousTotalAmount,
      totalVarianceAmount,
      totalVariancePercent,
    };
  };

  // 1. PROFIT & LOSS SECTIONS
  const plSection1 = makeSection(
    'إيرادات النشاط التشغيلي (Revenues)',
    'Operating Revenues',
    [
      makeItem('pl-1', '4110', 'إيرادات تأجير الأوناش والرافعات الثقيلة', 'Crane Rental Revenues', cur.revRentals, comp.revRentals),
      makeItem('pl-2', '4120', 'إيرادات خدمات النقل الثقيل (Heavy Haulage)', 'Heavy Haulage Transport', cur.revHaulage, comp.revHaulage),
      makeItem('pl-3', '4130', 'رسوم التجهيز والنقل والتصاريح (Mobilization/Demob)', 'Mobilization & Rigging Fees', cur.revMob, comp.revMob),
      makeItem('pl-4', '4140', 'إيرادات استشارات هندسة الرفع وتخطيط الأحمال', 'Lift Engineering & Rigging Plans', cur.revTech, comp.revTech),
    ],
    cur.totalRevenue,
    comp.totalRevenue
  );

  const plSection2 = makeSection(
    'تكاليف التشغيل المباشرة (Direct Costs)',
    'Direct Operational Costs',
    [
      makeItem('pl-5', '5110', 'سولار وديزل الرافعات والمعدات في المواقع', 'Crane Diesel & Site Fuel', cur.costDiesel, comp.costDiesel),
      makeItem('pl-6', '5310', 'أجور وبدلات مشغلي الأوناش وفنيي الريجر الميدانيين', 'Operator & Rigger Wages', cur.costOps, comp.costOps),
      makeItem('pl-7', '5210', 'قطع غيار ميكانيكية وخراطيم وبساتم هيدروليك', 'Hydraulic Parts & Mechanical Spares', cur.costSpares, comp.costSpares),
      makeItem('pl-8', '5220', 'زيوت تروس وشحوم وفلاتر هيدروليك 500 بار', 'Gear & Hydraulic Oils / Filters', cur.costHyd, comp.costHyd),
      makeItem('pl-9', '5510', 'إهلاك أسطول الرافعات والشاحنات الثقيلة', 'Crane Fleet Depreciation', cur.costDeprec, comp.costDeprec),
      makeItem('pl-10', '5410', 'تأمين شامل ومعايرات وفحص السلامة الدولي', 'Crane Insurance & Certifications', cur.costInsur, comp.costInsur),
    ],
    cur.totalDirectCosts,
    comp.totalDirectCosts
  );

  const plSection3 = makeSection(
    'المصروفات العمومية والإدارية والتسويقية (SG&A)',
    'General & Administrative Expenses',
    [
      makeItem('pl-11', '6110', 'رواتب الإدارة العامة، المحاسبة، والسلامة HSE', 'Admin, Finance & HSE Salaries', cur.expSalaries, comp.expSalaries),
      makeItem('pl-12', '6210', 'إيجار ساحات التخزين ومستودع السويس المركزي', 'Yard Lease & Depot Operations', cur.expYard, comp.expYard),
      makeItem('pl-13', '6310', 'مصروفات التسويق، كراسات الشروط، ومناقصات المشروعات', 'Bidding & Corporate Marketing', cur.expMkt, comp.expMkt),
      makeItem('pl-14', '6410', 'اشتراكات تتبع الأسطول بالـ GPS وبرامج الحسابات', 'Fleet GPS Tracking & ERP Licenses', cur.expIT, comp.expIT),
    ],
    cur.totalOperatingExp,
    comp.totalOperatingExp
  );

  // 2. BALANCE SHEET SECTIONS
  const bsCurrentAssets = makeSection(
    'الأصول المتداولة (Current Assets)',
    'Current Assets',
    [
      makeItem('bs-1', '1110', 'النقدية بالخزائن المركزية والمواقع', 'Cash on Hand & Site Safes', cur.bsCash, comp.bsCash),
      makeItem('bs-2', '1120', 'أرصدة البنوك المحلية والدولية (EGP & USD)', 'Bank Balances (NBE, CIB, Misr)', cur.bsBanks, comp.bsBanks),
      makeItem('bs-3', '1130', 'حافظة أوراق القبض والشيكات تحت التحصيل', 'Cheques in Hand / Collection', cur.bsCheques, comp.bsCheques),
      makeItem('bs-4', '1210', 'العملاء وذمم عقود التأجير المستحقة', 'Accounts Receivable (Clients)', cur.bsReceivables, comp.bsReceivables),
      makeItem('bs-5', '1310', 'مخزون قطع غيار الرافعات والزيوت والمهمات', 'Crane Spares & Lubricants Inventory', cur.bsInventory, comp.bsInventory),
    ],
    cur.totalCurrentAssets,
    comp.totalCurrentAssets
  );

  const bsFixedAssets = makeSection(
    'الأصول الثابتة (Fixed Assets)',
    'Fixed Assets',
    [
      makeItem('bs-6', '1510', 'أسطول الرافعات التلسكوبية والمجنزرة (30T - 1200T)', 'Heavy Cranes Fleet (Liebherr, Demag)', cur.bsCranesFleet, comp.bsCranesFleet),
      makeItem('bs-7', '1520', 'شاحنات النقل الثقيل والتريلات واللوابد (Lowbed)', 'Heavy Haulage Trucks & Trailers', cur.bsVehicles, comp.bsVehicles),
      makeItem('bs-8', '1530', 'ورش الصيانة المتنقلة ومعدات الهيدروليك والمولدات', 'Mobile Workshops & Hydraulic Gear', cur.bsEquipmentTools, comp.bsEquipmentTools),
      makeItem('bs-9', '1540', 'مباني الورش المركزية والمقر الإداري', 'Depot Workshop Buildings & Head Office', cur.bsBuildings, comp.bsBuildings),
      makeItem('bs-10', '1590', 'مجمع إهلاك الأصول الثابتة والرافعات', 'Accumulated Depreciation', cur.bsAccDeprec, comp.bsAccDeprec),
    ],
    cur.totalFixedAssets,
    comp.totalFixedAssets
  );

  const bsCurrentLiabilities = makeSection(
    'الخصوم المتداولة (Current Liabilities)',
    'Current Liabilities',
    [
      makeItem('bs-11', '2110', 'الموردين وذمم شراء السولار والزيوت', 'Accounts Payable (Suppliers)', cur.bsPayables, comp.bsPayables),
      makeItem('bs-12', '2120', 'مصلحة الضرائب المصرية (ضريبة القيمة المضافة والدخل)', 'Tax Authority Payables (VAT & Income)', cur.bsTaxDue, comp.bsTaxDue),
      makeItem('bs-13', '2130', 'مستحقات أجور المشغلين ومكافآت الورديات', 'Accrued Wages & Bonuses', cur.bsAccruedPayroll, comp.bsAccruedPayroll),
    ],
    cur.totalCurrentLiab,
    comp.totalCurrentLiab
  );

  const bsLongTermLiabilities = makeSection(
    'الخصوم طويلة الأجل (Long-Term Liabilities)',
    'Long-Term Liabilities',
    [
      makeItem('bs-14', '2210', 'تسهيلات بنكية وتمويل شراء الرافعات الحديثة', 'Bank Loans & Equipment Financing', cur.bsLongTermLoans, comp.bsLongTermLoans),
      makeItem('bs-15', '2220', 'مخصصات صيانة كبرى وعمرات الأوناش', 'Major Overhaul & Site Provisions', cur.bsProvisions, comp.bsProvisions),
    ],
    cur.totalNonCurrentLiab,
    comp.totalNonCurrentLiab
  );

  const bsEquity = makeSection(
    'حقوق الملكية (Shareholders Equity)',
    'Shareholders Equity',
    [
      makeItem('bs-16', '3110', 'رأس المال المصدر والمدفوع', 'Paid-in Share Capital', cur.bsCapital, comp.bsCapital),
      makeItem('bs-17', '3210', 'الأرباح المحتجزة / المبقاة من سنوات سابقة', 'Retained Earnings', cur.bsRetainedEarnings, comp.bsRetainedEarnings),
      makeItem('bs-18', '3310', 'صافي أرباح الفترة الحالية', 'Current Period Net Profit', cur.bsCurrentProfit, comp.bsCurrentProfit),
    ],
    cur.totalEquity,
    comp.totalEquity
  );

  // 3. CASH FLOW SECTIONS
  const cfOperating = makeSection(
    'التدفقات النقدية من الأنشطة التشغيلية (Operating Activities)',
    'Cash Flow from Operating Activities',
    [
      makeItem('cf-1', 'CF-10', 'المقبوضات النقدية والتحويلات من عملاء عقود التأجير', 'Cash Collected from Crane Rental Contracts', Math.round(cur.totalRevenue * 0.92), Math.round(comp.totalRevenue * 0.92)),
      makeItem('cf-2', 'CF-11', 'المدفوعات النقدية لشراء السولار والديزل من المحطات', 'Cash Paid for Diesel & Fuel', -cur.costDiesel, -comp.costDiesel),
      makeItem('cf-3', 'CF-12', 'رواتب وأجور وبدلات المشغلين وفنيي الرفع', 'Cash Paid to Operators & Crew', -cur.costOps, -comp.costOps),
      makeItem('cf-4', 'CF-13', 'المدفوعات لموردي قطع الغيار والهيدروليك والزيوت', 'Cash Paid for Spare Parts & Lubricants', -cur.costSpares - cur.costHyd, -comp.costSpares - comp.costHyd),
      makeItem('cf-5', 'CF-14', 'المصروفات الإدارية، تأمين الرافعات، والضرائب المسددة', 'Admin Expenses, Insurance & Taxes Paid', -cur.totalOperatingExp - cur.costInsur, -comp.totalOperatingExp - comp.costInsur),
    ],
    cur.cfCashFromOps,
    comp.cfCashFromOps
  );

  const cfInvesting = makeSection(
    'التدفقات النقدية من الأنشطة الاستثمارية (Investing Activities)',
    'Cash Flow from Investing Activities',
    [
      makeItem('cf-6', 'CF-20', 'شراء وتحديث رافعات تلسكوبية ومقطورات ثقيلة (CapEx)', 'Purchase of Cranes & Heavy Transport Equipment', cur.cfCapEx, comp.cfCapEx),
      makeItem('cf-7', 'CF-21', 'تطوير وتجهيز ورش الهيدروليك المركزية بالسويس', 'Workshop Facility Upgrades & Heavy Tools', -Math.round(1500000 * periodMultiplier), -Math.round(1500000 * periodMultiplier * 0.9)),
    ],
    cur.cfCapEx - Math.round(1500000 * periodMultiplier),
    comp.cfCapEx - Math.round(1500000 * periodMultiplier * 0.9)
  );

  const cfFinancing = makeSection(
    'التدفقات النقدية من الأنشطة التمويلية (Financing Activities)',
    'Cash Flow from Financing Activities',
    [
      makeItem('cf-8', 'CF-30', 'سداد أقساط التمويل البنكي لأقساط الرافعات', 'Repayment of Crane Equipment Bank Loans', cur.cfDebtRepay, comp.cfDebtRepay),
      makeItem('cf-9', 'CF-31', 'توزيعات أرباح الشركاء والاحتياطيات', 'Dividends & Shareholder Drawings', -Math.round(2500000 * periodMultiplier), -Math.round(2500000 * periodMultiplier * 0.9)),
    ],
    cur.cfDebtRepay - Math.round(2500000 * periodMultiplier),
    comp.cfDebtRepay - Math.round(2500000 * periodMultiplier * 0.9)
  );

  // 4. STATEMENT OF CHANGES IN EQUITY (قائمة التغير في حقوق الملكية)
  const equityChanges = makeSection(
    'قائمة التغير في حقوق الملكية (Statement of Changes in Equity)',
    'Statement of Changes in Equity',
    [
      makeItem('eq-1', '3110', 'رأس المال المصدر والمدفوع', 'Issued & Paid-in Share Capital', cur.bsCapital, comp.bsCapital),
      makeItem('eq-2', '3120', 'الاحتياطي القانوني والنظامي (10%)', 'Statutory Legal Reserve', Math.round(cur.bsCapital * 0.1), Math.round(comp.bsCapital * 0.1)),
      makeItem('eq-3', '3210', 'الأرباح المبقاة والمحتجزة من سنوات سابقة', 'Retained Earnings from Previous Years', cur.bsRetainedEarnings, comp.bsRetainedEarnings),
      makeItem('eq-4', '3310', 'صافي أرباح الفترة المالية الحالية', 'Current Period Net Profit', cur.netProfit, comp.netProfit),
      makeItem('eq-5', '3410', 'توزيعات أرباح معتمدة للمساهمين', 'Declared Dividends to Shareholders', -Math.round(2500000 * periodMultiplier), -Math.round(2200000 * periodMultiplier)),
    ],
    cur.totalEquity,
    comp.totalEquity
  );

  return {
    selectedYear,
    comparisonYear,
    periodMultiplier,

    profitAndLoss: {
      sections: [plSection1, plSection2, plSection3],
      summary: {
        totalRevenue: cur.totalRevenue,
        previousTotalRevenue: comp.totalRevenue,
        revenueVariance: cur.totalRevenue - comp.totalRevenue,
        revenueVariancePct: comp.totalRevenue !== 0 ? Math.round(((cur.totalRevenue - comp.totalRevenue) / comp.totalRevenue) * 1000) / 10 : 0,

        totalDirectCosts: cur.totalDirectCosts,
        previousTotalDirectCosts: comp.totalDirectCosts,
        directCostsVariance: cur.totalDirectCosts - comp.totalDirectCosts,
        directCostsVariancePct: comp.totalDirectCosts !== 0 ? Math.round(((cur.totalDirectCosts - comp.totalDirectCosts) / comp.totalDirectCosts) * 1000) / 10 : 0,

        grossProfit: cur.grossProfit,
        previousGrossProfit: comp.grossProfit,
        grossProfitVariance: cur.grossProfit - comp.grossProfit,
        grossMarginPct: cur.grossMarginPct,
        previousGrossMarginPct: comp.grossMarginPct,

        totalOperatingExp: cur.totalOperatingExp,
        previousTotalOperatingExp: comp.totalOperatingExp,

        operatingIncomeEBITDA: cur.operatingIncomeEBITDA,
        previousOperatingIncomeEBITDA: comp.operatingIncomeEBITDA,

        interestExp: cur.interestExp,
        previousInterestExp: comp.interestExp,

        taxExp: cur.taxExp,
        previousTaxExp: comp.taxExp,

        netProfit: cur.netProfit,
        previousNetProfit: comp.netProfit,
        netProfitVariance: cur.netProfit - comp.netProfit,
        netProfitVariancePct: comp.netProfit !== 0 ? Math.round(((cur.netProfit - comp.netProfit) / Math.abs(comp.netProfit)) * 1000) / 10 : 0,
        netMarginPct: cur.netMarginPct,
        previousNetMarginPct: comp.netMarginPct,
      },
    },

    balanceSheet: {
      currentAssets: bsCurrentAssets,
      fixedAssets: bsFixedAssets,
      currentLiabilities: bsCurrentLiabilities,
      longTermLiabilities: bsLongTermLiabilities,
      equity: bsEquity,
      totals: {
        totalAssets: cur.totalAssets,
        previousTotalAssets: comp.totalAssets,
        assetsVariance: cur.totalAssets - comp.totalAssets,
        assetsVariancePct: comp.totalAssets !== 0 ? Math.round(((cur.totalAssets - comp.totalAssets) / comp.totalAssets) * 1000) / 10 : 0,

        totalLiabilities: cur.totalLiabilities,
        previousTotalLiabilities: comp.totalLiabilities,
        liabilitiesVariance: cur.totalLiabilities - comp.totalLiabilities,

        totalEquity: cur.totalEquity,
        previousTotalEquity: comp.totalEquity,
        equityVariance: cur.totalEquity - comp.totalEquity,

        isBalanced: Math.abs(cur.totalAssets - (cur.totalLiabilities + cur.totalEquity)) < 100,
        isPreviousBalanced: Math.abs(comp.totalAssets - (comp.totalLiabilities + comp.totalEquity)) < 100,
      },
    },

    cashFlow: {
      operating: cfOperating,
      investing: cfInvesting,
      financing: cfFinancing,
      summary: {
        beginningCash: cur.beginningCash,
        previousBeginningCash: comp.beginningCash,
        netCashFlow: cur.netCashFlow,
        previousNetCashFlow: comp.netCashFlow,
        cashFlowVariance: cur.netCashFlow - comp.netCashFlow,
        endingCash: cur.endingCash,
        previousEndingCash: comp.endingCash,
      },
    },

    equityChanges,
  };
};
