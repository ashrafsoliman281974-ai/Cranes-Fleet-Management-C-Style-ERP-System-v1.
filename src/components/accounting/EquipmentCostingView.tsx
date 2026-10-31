import React, { useState } from 'react';
import {
  Truck,
  Fuel,
  Users,
  Wrench,
  Shield,
  Building,
  TrendingUp,
  DollarSign,
  Edit,
  Save,
  Calculator,
  AlertCircle,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { EquipmentCostingProfile } from '../../types/erp';

export const EquipmentCostingView: React.FC = () => {
  const { equipmentCostings, saveEquipmentCosting, language, t } = useERP();
  const [selectedCraneId, setSelectedCraneId] = useState<string>(
    equipmentCostings[0]?.id || ''
  );
  const [editingProfile, setEditingProfile] = useState<EquipmentCostingProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const selectedCrane = equipmentCostings.find((c) => c.id === selectedCraneId) || equipmentCostings[0];

  // Helper calculation
  const calculateTotalCost = (profile: EquipmentCostingProfile) => {
    const direct =
      profile.directCosts.fuelCostPerHour +
      profile.directCosts.operatorHourlyWage +
      profile.directCosts.riggerHourlyWage +
      profile.directCosts.lubricantsAndHydraulicsPerHour +
      profile.directCosts.wearTearSparePartsPerHour +
      profile.directCosts.tiresAndWireRopesPerHour;

    const indirect =
      profile.indirectCosts.depreciationPerHour +
      profile.indirectCosts.insuranceAndCertificationsPerHour +
      profile.indirectCosts.yardAndWorkshopOverheadPerHour +
      profile.indirectCosts.adminAndGpsTrackingPerHour;

    const total = direct + indirect;
    const profit = profile.currentRentalHourlyRate - total;
    const margin = profile.currentRentalHourlyRate > 0 ? (profit / profile.currentRentalHourlyRate) * 100 : 0;

    return { direct, indirect, total, profit, margin };
  };

  const handleOpenEdit = (profile: EquipmentCostingProfile) => {
    setEditingProfile(JSON.parse(JSON.stringify(profile)));
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    // Recalculate computed values
    const fuelCostPerHour = editingProfile.directCosts.fuelLitersPerHour * editingProfile.directCosts.fuelPricePerLiter;
    const totalDirect =
      fuelCostPerHour +
      editingProfile.directCosts.operatorHourlyWage +
      editingProfile.directCosts.riggerHourlyWage +
      editingProfile.directCosts.lubricantsAndHydraulicsPerHour +
      editingProfile.directCosts.wearTearSparePartsPerHour +
      editingProfile.directCosts.tiresAndWireRopesPerHour;

    const deprecPerHour =
      editingProfile.indirectCosts.economicLifeYears > 0 && editingProfile.indirectCosts.annualWorkingHoursTarget > 0
        ? Math.round(
            editingProfile.indirectCosts.craneAssetValue /
              (editingProfile.indirectCosts.economicLifeYears * editingProfile.indirectCosts.annualWorkingHoursTarget)
          )
        : editingProfile.indirectCosts.depreciationPerHour;

    const totalIndirect =
      deprecPerHour +
      editingProfile.indirectCosts.insuranceAndCertificationsPerHour +
      editingProfile.indirectCosts.yardAndWorkshopOverheadPerHour +
      editingProfile.indirectCosts.adminAndGpsTrackingPerHour;

    const totalCost = totalDirect + totalIndirect;
    const grossProfit = editingProfile.currentRentalHourlyRate - totalCost;
    const margin = editingProfile.currentRentalHourlyRate > 0 ? (grossProfit / editingProfile.currentRentalHourlyRate) * 100 : 0;

    const updated: EquipmentCostingProfile = {
      ...editingProfile,
      directCosts: {
        ...editingProfile.directCosts,
        fuelCostPerHour,
        totalDirectCostPerHour: totalDirect,
      },
      indirectCosts: {
        ...editingProfile.indirectCosts,
        depreciationPerHour: deprecPerHour,
        totalIndirectCostPerHour: totalIndirect,
      },
      totalOperatingCostPerHour: totalCost,
      breakEvenHourlyRate: totalCost,
      hourlyGrossProfit: grossProfit,
      hourlyProfitMarginPercent: parseFloat(margin.toFixed(2)),
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    saveEquipmentCosting(updated);
    setIsEditModalOpen(false);
    setEditingProfile(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" />
              {t('Equipment Cost Engineering', 'هندسة تكاليف ومعدلات تشغيل الأوناش')}
            </span>
            <span className="text-xs text-slate-400 font-mono">Hourly Rate & Cost Allocation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('Crane Hourly Cost Analysis & Profitability', 'تحليل تكلفة ساعة التشغيل وهامش ربحية الرافعات')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              'Detailed direct fuel, operator wages, maintenance costs vs indirect depreciation, insurance, and depot overhead to determine break-even and optimal rental rates.',
              'تحديد التكاليف المباشرة وغير المباشرة لساعة التشغيل، وحساب نقطة التعادل وهوامش الربحية التعاقدية لأسطول إيجيبت كرينز.'
            )}
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-right">
            <span className="text-[10px] text-slate-400 font-bold block">إجمالي أسطول الأوناش المحلل</span>
            <span className="text-base font-black text-slate-900 font-mono">
              {equipmentCostings.length} رافعات ثقيلة
            </span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL CRANE SELECTION CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {equipmentCostings.map((crane) => {
          const isSelected = crane.id === selectedCrane.id;
          return (
            <button
              key={crane.id}
              onClick={() => setSelectedCraneId(crane.id)}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-red-500 shadow-md ring-2 ring-red-500/30'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded font-mono ${
                      isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {crane.capacityTon}T
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{crane.plateNoOrCode}</span>
                </div>
                <h4 className="text-xs font-bold leading-snug line-clamp-2">{crane.craneModel}</h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/40">
                <span className="text-[9px] text-slate-400 block">تكلفة الساعة:</span>
                <span className="text-xs font-black font-mono">
                  {Math.round(crane.totalOperatingCostPerHour).toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN SELECTED CRANE DETAIL VIEW */}
      {selectedCrane && (
        <div className="space-y-6">
          {/* Top Crane Header Bar & Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 border border-red-200 flex items-center justify-center font-black text-sm shrink-0">
                {selectedCrane.capacityTon}T
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900">{selectedCrane.craneModel}</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 font-mono">
                    {selectedCrane.plateNoOrCode}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  العلامة التجارية: {selectedCrane.craneBrand} | ساعات التشغيل السنوية المستهدفة: {selectedCrane.indirectCosts.annualWorkingHoursTarget.toLocaleString('ar-EG')} ساعة/سنة
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenEdit(selectedCrane)}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>تعديل معاملات التكلفة والتسعير</span>
            </button>
          </div>

          {/* 3 Major Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Cost Per Hour */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                إجمالي تكلفة ساعة التشغيل (Break-Even)
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {Math.round(selectedCrane.totalOperatingCostPerHour).toLocaleString('ar-EG')}{' '}
                <span className="text-xs font-normal text-slate-500">ج.م / ساعة</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium mt-2">
                <span>مباشرة: {Math.round(selectedCrane.directCosts.totalDirectCostPerHour).toLocaleString('ar-EG')} ج.م</span>
                <span>•</span>
                <span>غير مباشرة: {Math.round(selectedCrane.indirectCosts.totalIndirectCostPerHour).toLocaleString('ar-EG')} ج.م</span>
              </div>
            </div>

            {/* Current Rental Hourly Rate */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                سعر تأجير الساعة التعاقدي المعتمد
              </span>
              <div className="text-2xl font-black text-blue-900 font-mono">
                {Math.round(selectedCrane.currentRentalHourlyRate).toLocaleString('ar-EG')}{' '}
                <span className="text-xs font-normal text-slate-500">ج.م / ساعة</span>
              </div>
              <span className="text-[11px] text-blue-700 font-bold block mt-2">
                سعر الوردية القياسية (8 ساعات): {(selectedCrane.currentRentalHourlyRate * 8).toLocaleString('ar-EG')} ج.م
              </span>
            </div>

            {/* Profit Margin */}
            <div className="bg-gradient-to-br from-slate-900 to-red-950 text-white p-5 rounded-2xl shadow-md">
              <span className="text-xs font-bold text-amber-300 block mb-1">
                صافي هامش الربح بالساعة (% Profit Margin)
              </span>
              <div className="text-2xl font-black text-white font-mono flex items-center justify-between">
                <span>{selectedCrane.hourlyProfitMarginPercent}%</span>
                <span className="text-base text-emerald-400">
                  +{Math.round(selectedCrane.hourlyGrossProfit).toLocaleString('ar-EG')} ج.م
                </span>
              </div>
              <span className="text-[10px] text-slate-300 block mt-2">
                الربح التقديري السنوي عند استيفاء ساعات التشغيل: {(selectedCrane.hourlyGrossProfit * selectedCrane.indirectCosts.annualWorkingHoursTarget).toLocaleString('ar-EG')} ج.م
              </span>
            </div>
          </div>

          {/* Dual Detailed Breakdown: Direct vs Indirect Costs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DIRECT COSTS CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-black text-slate-900">
                    التكاليف المباشرة لساعة التشغيل (Direct Costs)
                  </h3>
                </div>
                <span className="text-xs font-black font-mono text-slate-900">
                  {Math.round(selectedCrane.directCosts.totalDirectCostPerHour).toLocaleString('ar-EG')} ج.م
                </span>
              </div>

              <div className="divide-y divide-slate-100 p-2">
                {/* Diesel */}
                <div className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">وقود السولار / الديزل</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {selectedCrane.directCosts.fuelLitersPerHour} لتر/ساعة × {selectedCrane.directCosts.fuelPricePerLiter} ج.م/لتر
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {Math.round(selectedCrane.directCosts.fuelCostPerHour).toLocaleString('ar-EG')} ج.م
                  </span>
                </div>

                {/* Operator Wage */}
                <div className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">أجر مشغل الرافعة المعتمد (ساعة)</span>
                    <span className="text-[11px] text-slate-400">سائق ونش درجة أولى ومكافأة وردية</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedCrane.directCosts.operatorHourlyWage.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>

                {/* Rigger Wage */}
                <div className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">أجر مساعد المشغل وفني الريجر (Rigger)</span>
                    <span className="text-[11px] text-slate-400">توجيه الأحمال وتأمين الوايرات</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedCrane.directCosts.riggerHourlyWage.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>

                {/* Lubricants & Hydraulics */}
                <div className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">زيوت هيدروليك وتروس وشحوم عالية الضغط</span>
                    <span className="text-[11px] text-slate-400">معدل الاستهلاك الدوري والفلاتر</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedCrane.directCosts.lubricantsAndHydraulicsPerHour.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>

                {/* Wear & Tear Parts */}
                <div className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">قطع غيار مستهلكة وصيانة وقائية دورية</span>
                    <span className="text-[11px] text-slate-400">خراطيم، بكرات، وسيور</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedCrane.directCosts.wearTearSparePartsPerHour.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>

                {/* Tires & Outriggers */}
                <div className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">مخصص إطارات ضخمة، جنازير، ووايرات صلب</span>
                    <span className="text-[11px] text-slate-400">استهلاك كاوتش المحاور والأسلاك المعدنية</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedCrane.directCosts.tiresAndWireRopesPerHour.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>
            </div>

            {/* INDIRECT COSTS CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-black text-slate-900">
                    التكاليف غير المباشرة ومخصصات الأصول (Indirect Costs)
                  </h3>
                </div>
                <span className="text-xs font-black font-mono text-slate-900">
                  {Math.round(selectedCrane.indirectCosts.totalIndirectCostPerHour).toLocaleString('ar-EG')} ج.م
                </span>
              </div>

              <div className="divide-y divide-slate-100 p-2">
                {/* Depreciation */}
                <div className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">قسط إهلاك الرافعة بالساعة (Depreciation)</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      قيمة الأصل: {selectedCrane.indirectCosts.craneAssetValue.toLocaleString('ar-EG')} ج.م على {selectedCrane.indirectCosts.economicLifeYears} سنة
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedCrane.indirectCosts.depreciationPerHour.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>

                {/* Insurance & Certifications */}
                <div className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">التأمين الشامل وشهادات المعايرة الدولية TÜV</span>
                    <span className="text-[11px] text-slate-400">وثائق الحوادث وتصاريح المرور السنوية</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedCrane.indirectCosts.insuranceAndCertificationsPerHour.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>

                {/* Yard & Workshop Overhead */}
                <div className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">نصيب الرافعة من إيجار ساحة السويس والورش</span>
                    <span className="text-[11px] text-slate-400">حراسة، كهرباء، ومعدات الورشة المركزية</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedCrane.indirectCosts.yardAndWorkshopOverheadPerHour.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>

                {/* Admin & GPS Tracking */}
                <div className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">مصروفات الإدارة المشتركة وأنظمة الـ GPS</span>
                    <span className="text-[11px] text-slate-400">تتبع الأقمار الصناعية وبوابة النظام ERP</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedCrane.indirectCosts.adminAndGpsTrackingPerHour.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  تعديل بطاقة تكلفة الرافعة: {editingProfile.craneModel}
                </h3>
                <span className="text-xs text-slate-400">إعادة ضبط أسعار الوقود، الأجور، والتقديرات السنوية</span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              {/* Rental Rate & Hours Target */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    سعر التأجير بالساعة المستهدف (ج.م):
                  </label>
                  <input
                    type="number"
                    value={editingProfile.currentRentalHourlyRate}
                    onChange={(e) =>
                      setEditingProfile({
                        ...editingProfile,
                        currentRentalHourlyRate: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs font-bold bg-white border border-slate-300 rounded-lg p-2 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ساعات التشغيل السنوية المستهدفة:
                  </label>
                  <input
                    type="number"
                    value={editingProfile.indirectCosts.annualWorkingHoursTarget}
                    onChange={(e) =>
                      setEditingProfile({
                        ...editingProfile,
                        indirectCosts: {
                          ...editingProfile.indirectCosts,
                          annualWorkingHoursTarget: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full text-xs font-bold bg-white border border-slate-300 rounded-lg p-2 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Direct Costs Inputs */}
              <div>
                <h4 className="text-xs font-black text-slate-900 mb-3 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-amber-600" />
                  معاملات التكاليف المباشرة:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      معدل استهلاك السولار (لتر/ساعة):
                    </label>
                    <input
                      type="number"
                      value={editingProfile.directCosts.fuelLitersPerHour}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          directCosts: {
                            ...editingProfile.directCosts,
                            fuelLitersPerHour: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      سعر لتر السولار (ج.م):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingProfile.directCosts.fuelPricePerLiter}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          directCosts: {
                            ...editingProfile.directCosts,
                            fuelPricePerLiter: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      أجر مشغل الرافعة بالساعة (ج.م):
                    </label>
                    <input
                      type="number"
                      value={editingProfile.directCosts.operatorHourlyWage}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          directCosts: {
                            ...editingProfile.directCosts,
                            operatorHourlyWage: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      أجر فني الريجر بالساعة (ج.م):
                    </label>
                    <input
                      type="number"
                      value={editingProfile.directCosts.riggerHourlyWage}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          directCosts: {
                            ...editingProfile.directCosts,
                            riggerHourlyWage: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      زيوت وهيدروليك بالساعة (ج.م):
                    </label>
                    <input
                      type="number"
                      value={editingProfile.directCosts.lubricantsAndHydraulicsPerHour}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          directCosts: {
                            ...editingProfile.directCosts,
                            lubricantsAndHydraulicsPerHour: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      قطع غيار وصيانة دورية بالساعة (ج.م):
                    </label>
                    <input
                      type="number"
                      value={editingProfile.directCosts.wearTearSparePartsPerHour}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          directCosts: {
                            ...editingProfile.directCosts,
                            wearTearSparePartsPerHour: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Indirect Costs Inputs */}
              <div>
                <h4 className="text-xs font-black text-slate-900 mb-3 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  معاملات التكاليف غير المباشرة:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      قيمة شراء الرافعة (الأصل ج.م):
                    </label>
                    <input
                      type="number"
                      value={editingProfile.indirectCosts.craneAssetValue}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          indirectCosts: {
                            ...editingProfile.indirectCosts,
                            craneAssetValue: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      العمر الافتراضي (سنوات):
                    </label>
                    <input
                      type="number"
                      value={editingProfile.indirectCosts.economicLifeYears}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          indirectCosts: {
                            ...editingProfile.indirectCosts,
                            economicLifeYears: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      التأمين والمعايرة بالساعة (ج.م):
                    </label>
                    <input
                      type="number"
                      value={editingProfile.indirectCosts.insuranceAndCertificationsPerHour}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          indirectCosts: {
                            ...editingProfile.indirectCosts,
                            insuranceAndCertificationsPerHour: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors"
                >
                  حفظ وتطبيق المعاملات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
