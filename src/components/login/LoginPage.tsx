import React, { useState } from 'react';
import { LogIn, ArrowRight, Settings, Globe, Phone, Mail, MapPin, Shield } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const LoginPage: React.FC = () => {
  const { loginSettings, currentTheme, setActiveView, showToast } = useERP();

  const [email, setEmail] = useState('amir.mansi@erpsys.tech');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`مرحباً بك يا ${loginSettings.companyNameAr} - تم تسجيل الدخول بنجاح!`);
    setActiveView('workspace');
  };

  // Determine panel alignment
  const getPanelAlignment = () => {
    switch (loginSettings.panelPosition) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'right':
      default:
        return 'justify-end';
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center overflow-hidden bg-slate-900 select-none">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-60 scale-105"
        style={{
          backgroundImage: `url(${loginSettings.backgroundImageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/90 backdrop-blur-xs" />

      {/* Top Controls: Return to Workspace / Customize Settings */}
      <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between">
        <button
          onClick={() => setActiveView('workspace')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition-colors border border-white/20"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لمساحة عمل النظام</span>
        </button>

        <button
          onClick={() => setActiveView('login-settings')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>تخصيص إعدادات صفحة الدخول (Login Page Settings)</span>
        </button>
      </div>

      {/* Main Container with configurable panel position */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex ${getPanelAlignment()}`}>
        {/* Floating Login Card (Matching Screenshot 03 & 05) */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 space-y-6 text-slate-800">
          {/* Brand Header */}
          <div className="space-y-2 text-right">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-md border-2 border-amber-300"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                C
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 leading-tight">
                  {loginSettings.companyNameAr}
                </h1>
                <p className="text-xs font-semibold text-slate-500 font-sans" dir="ltr">
                  {loginSettings.companyNameEn}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {loginSettings.subtitleAr}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                اسم المستخدم أو البريد الإلكتروني
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-slate-800"
                dir="ltr"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">كلمة المرور</label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-blue-700 hover:underline">
                  نسيت كلمة المرور؟
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                dir="ltr"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>تذكر بيانات الدخول على هذا الجهاز</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-black text-white shadow-lg transition-transform active:scale-98 hover:opacity-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول للنظام (Login)</span>
            </button>
          </form>

          {/* Contact Details from Login Settings (Screenshot 04) */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
            {loginSettings.addressAr && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{loginSettings.addressAr}</span>
              </div>
            )}
            {loginSettings.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono" dir="ltr">{loginSettings.contactPhone}</span>
              </div>
            )}
            {loginSettings.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono" dir="ltr">{loginSettings.contactEmail}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
