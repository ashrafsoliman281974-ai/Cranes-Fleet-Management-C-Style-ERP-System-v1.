import React, { useState } from 'react';
import { X, Check, RotateCcw, Palette, Sparkles } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { THEME_PRESETS } from '../../data/initialData';
import { ThemeConfig } from '../../types/erp';

export const ThemeModal: React.FC = () => {
  const { isThemeModalOpen, setIsThemeModalOpen, currentTheme, setThemeConfig, applyPreset, showToast } = useERP();

  const [customPrimary, setCustomPrimary] = useState(currentTheme.primaryColor);
  const [customMetallic, setCustomMetallic] = useState(currentTheme.accentMetallic);
  const [customSidebarBg, setCustomSidebarBg] = useState(currentTheme.sidebarDarkBg);

  if (!isThemeModalOpen) return null;

  const handleApplyCustom = () => {
    const updatedTheme: ThemeConfig = {
      presetName: 'نمط مخصص',
      primaryColor: customPrimary,
      primaryHover: customPrimary,
      primaryLight: '#F1F5F9',
      accentMetallic: customMetallic,
      sidebarDarkBg: customSidebarBg,
    };
    setThemeConfig(updatedTheme);
    setIsThemeModalOpen(false);
  };

  const handleSelectPreset = (preset: ThemeConfig) => {
    setCustomPrimary(preset.primaryColor);
    setCustomMetallic(preset.accentMetallic);
    setCustomSidebarBg(preset.sidebarDarkBg);
    setThemeConfig(preset);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between text-white"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-bold">تخصيص ثيم وألوان C-Style</h3>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* 1. Preset Styles (الأنماط الجاهزة من الفيديو) */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
              1. الأنماط الجاهزة (Presets)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {THEME_PRESETS.map((preset) => {
                const isCurrent = currentTheme.presetName === preset.presetName;
                return (
                  <button
                    key={preset.presetName}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-24 relative ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-slate-800">{preset.presetName}</span>
                      {isCurrent && <Check className="w-4 h-4 text-blue-600" />}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className="w-5 h-5 rounded-md shadow-2xs border border-white"
                        style={{ backgroundColor: preset.primaryColor }}
                        title="اللون الأساسي"
                      />
                      <div
                        className="w-5 h-5 rounded-md shadow-2xs border border-white"
                        style={{ backgroundColor: preset.accentMetallic }}
                        title="اللمسة المعدنية"
                      />
                      <div
                        className="w-5 h-5 rounded-md shadow-2xs border border-white"
                        style={{ backgroundColor: preset.sidebarDarkBg }}
                        title="خلفية الشريط الجانبي"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Free Customization of 3 Key Elements (تخصيص حر لثلاثة عناصر) */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              2. تخصيص دقيق لثلاثة عناصر رئيسية
            </label>

            {/* Element 1: Primary Color */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">اللون الأساسي (Primary)</span>
                <span className="text-[11px] text-slate-500">للأزرار والروابط وعناوين القوائم</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  className="w-20 text-xs font-mono font-bold text-center uppercase bg-white border border-slate-200 rounded-md py-1"
                />
              </div>
            </div>

            {/* Element 2: Metallic Accent */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">اللمسة المعدنية الذهبية (Metallic)</span>
                <span className="text-[11px] text-slate-500">للشارات والحواف والتأكيدات الراقية</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customMetallic}
                  onChange={(e) => setCustomMetallic(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={customMetallic}
                  onChange={(e) => setCustomMetallic(e.target.value)}
                  className="w-20 text-xs font-mono font-bold text-center uppercase bg-white border border-slate-200 rounded-md py-1"
                />
              </div>
            </div>

            {/* Element 3: Sidebar Dark Background */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">خلفية الشريط الجانبي الضيق</span>
                <span className="text-[11px] text-slate-500">لون خلفية شريط الوحدات الرأسي</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customSidebarBg}
                  onChange={(e) => setCustomSidebarBg(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={customSidebarBg}
                  onChange={(e) => setCustomSidebarBg(e.target.value)}
                  className="w-20 text-xs font-mono font-bold text-center uppercase bg-white border border-slate-200 rounded-md py-1"
                />
              </div>
            </div>
          </div>

          {/* Real-time Preview Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">معاينة مباشرة للنمط</span>
            <div className="flex items-center justify-between">
              <button
                className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: customPrimary }}
              >
                زر تجريبي
              </button>

              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full text-slate-900 border"
                style={{ backgroundColor: customMetallic, borderColor: customMetallic }}
              >
                شارة معدنية
              </span>

              <div
                className="w-12 h-8 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: customSidebarBg }}
              >
                شريط
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => handleSelectPreset(THEME_PRESETS[0])}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة الضبط للافتراضي</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsThemeModalOpen(false)}
              className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleApplyCustom}
              className="px-5 py-2 text-xs font-bold rounded-lg text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              تطبيق الألوان المخصصة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
