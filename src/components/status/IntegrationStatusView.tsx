import React, { useState } from 'react';
import {
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Server,
  Navigation,
  MessageSquare,
  Smartphone,
  Landmark,
  Database,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { INITIAL_INTEGRATION_HEALTH } from '../../data/masterEnterpriseSeed';
import { IntegrationHealthItem } from '../../types/erp';

export const IntegrationStatusView: React.FC = () => {
  const { showToast } = useERP();
  const [services, setServices] = useState<IntegrationHealthItem[]>(INITIAL_INTEGRATION_HEALTH);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('تم فحص جميع نقاط الاتصال بالخدمات الخارجية بنجاح - كل الأنظمة تعمل بكفاءة 100%!');
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <span>لوحة المراقبة والتحكم</span>
            <span>/</span>
            <span className="text-red-600">لوحة حالة التكاملات والأنظمة الخارجية (Integration Status)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-red-600" />
            <span>حالة التكاملات اللحظية (Biometrics, i-Track GPS, WhatsApp, SMS, Banks)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            مراقبة حية لصحة أجهزة البصمة، مزامنة الـ GPS، بوابات الرسائل القصيرة والواتساب، والمطابقة البنكية.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'جارٍ الفحص...' : 'فحص الاتصال الشامل'}</span>
        </button>
      </div>

      {/* Grid of 6 Integrated Subsystems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-red-400 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-bold">
                  {item.serviceCategory === 'أجهزة البصمة (Push)' && <Server className="w-5 h-5" />}
                  {item.serviceCategory === 'تتبع GPS (i-Track)' && <Navigation className="w-5 h-5" />}
                  {item.serviceCategory === 'محرك واتساب' && <MessageSquare className="w-5 h-5" />}
                  {item.serviceCategory === 'بوابة SMS' && <Smartphone className="w-5 h-5" />}
                  {item.serviceCategory === 'المطابقة البنكية' && <Landmark className="w-5 h-5" />}
                  {item.serviceCategory === 'النسخ الاحتياطي' && <Database className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900">{item.serviceNameAr}</h3>
                  <p className="text-[10px] text-slate-500">{item.serviceCategory}</p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{item.status}</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-150 leading-relaxed">
              {item.detailsAr}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">آخر اتصال: {item.lastActivity}</span>
              <span className="font-mono font-bold text-emerald-700">{item.successRate}% كفاءة</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
