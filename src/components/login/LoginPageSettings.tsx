import React, { useState } from 'react';
import {
  Settings,
  Save,
  Eye,
  ArrowRight,
  Image as ImageIcon,
  Building,
  Phone,
  Mail,
  MapPin,
  Check,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { LoginPageSettings as ILoginSettings } from '../../types/erp';

export const LoginPageSettings: React.FC = () => {
  const { loginSettings, updateLoginSettings, setActiveView, showToast, t } = useERP();

  const [form, setForm] = useState<ILoginSettings>({ ...loginSettings });

  const handleChange = (field: keyof ILoginSettings, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLoginSettings(form);
  };

  const presetBackgrounds = [
    {
      title: 'رافعة مجنزرة عملاقة 1200T بموقع العمل (الصورة المرفقة)',
      url: '/assets/images/crane_welcome_banner.jpg',
    },
    {
      title: 'أسطول رافعات الموقع ومشاريع الطاقة (Egypt Cranes Fleet)',
      url: '/assets/images/crane_fleet_banner.jpg',
    },
    {
      title: 'برج أعمال حديث (عصري)',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'مكتب هندسي وتصميم راقٍ',
      url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'مركز بيانات وحوسبة سحابية',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'مصنع متطور وخط إنتاج لوجستي',
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('System Customization', 'تخصيص النظام', 'System Customization')}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              C-Style Identity
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-700" />
            <span>إعدادات صفحة الدخول (Login Page Settings)</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('login-preview')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة صفحة الدخول</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </div>

      {/* Main Settings Form (Directly matching Screenshot 04) */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        {/* Section 1: Company Names & Description */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            1. هوية واسم الشركة (Company Brand)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                اسم الشركة بالعربية (Company Name - AR) *
              </label>
              <input
                type="text"
                required
                value={form.companyNameAr}
                onChange={(e) => handleChange('companyNameAr', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                اسم الشركة بالإنجليزية (Company Name - EN)
              </label>
              <input
                type="text"
                value={form.companyNameEn}
                onChange={(e) => handleChange('companyNameEn', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              الوصف والشعار الترويجي (Tagline & Description)
            </label>
            <textarea
              rows={2}
              value={form.subtitleAr}
              onChange={(e) => handleChange('subtitleAr', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Section 2: Panel Layout & Background Image */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            2. تخطيط ومظهر لوحة تسجيل الدخول (Layout & Background)
          </h2>

          {/* Panel Alignment Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              موضع لوحة تسجيل الدخول على الشاشة (Panel Position)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'right', label: 'الجانب الأيمن (Right - الافتراضي)' },
                { id: 'center', label: 'الوسط (Centered)' },
                { id: 'left', label: 'الجانب الأيسر (Left)' },
              ].map((pos) => {
                const isSelected = form.panelPosition === pos.id;
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => handleChange('panelPosition', pos.id)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50 text-blue-900 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {pos.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background Image URL & Presets */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              رابط صورة الخلفية (Background Image URL)
            </label>
            <input
              type="url"
              value={form.backgroundImageUrl}
              onChange={(e) => handleChange('backgroundImageUrl', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono"
              dir="ltr"
            />

            <div className="mt-2 flex flex-wrap gap-2">
              {presetBackgrounds.map((bg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChange('backgroundImageUrl', bg.url)}
                  className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors"
                >
                  {bg.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Address Information */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            3. بيانات الاتصال والعنوان في صفحة الدخول (Contact Information)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                البريد الإلكتروني للدعم (Support Email)
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                رقم الهاتف المباشر (Phone Number)
              </label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              العنوان والمقر الرئيسي (Physical Address)
            </label>
            <input
              type="text"
              value={form.addressAr}
              onChange={(e) => handleChange('addressAr', e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setActiveView('login-preview')}
            className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            معاينة فورية
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold rounded-lg text-white shadow-xs hover:opacity-90 transition-opacity flex items-center gap-2"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <Check className="w-4 h-4" />
            <span>حفظ إعدادات صفحة الدخول</span>
          </button>
        </div>
      </form>
    </div>
  );
};
