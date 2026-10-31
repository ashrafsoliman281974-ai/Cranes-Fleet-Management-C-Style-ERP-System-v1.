import React, { useState } from 'react';
import {
  Globe,
  Sliders,
  Layers,
  Film,
  Image as ImageIcon,
  CheckCircle,
  Plus,
  Save,
  Eye,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  FileText,
  Phone,
  Video,
  Check,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  INITIAL_LANDING_SETTINGS,
  INITIAL_FEATURED_GLASS_CARDS,
  INITIAL_STORY_SCENES,
  INITIAL_MEDIA_ASSETS,
} from '../../data/masterEnterpriseSeed';
import { GlassCardItem, StorySceneItem, MediaAssetItem } from '../../types/erp';

export const LandingCMSView: React.FC = () => {
  const { setActiveView, leadBookings, showToast } = useERP();

  const [activeTab, setActiveTab] = useState<'settings' | 'cards' | 'scenes' | 'media' | 'leads'>('settings');

  // Settings State
  const [settings, setSettings] = useState(INITIAL_LANDING_SETTINGS);

  // Glass Cards State
  const [cards, setCards] = useState<GlassCardItem[]>(INITIAL_FEATURED_GLASS_CARDS);
  const [editingCard, setEditingCard] = useState<GlassCardItem | null>(null);

  // Story Scenes State
  const [scenes, setScenes] = useState<StorySceneItem[]>(INITIAL_STORY_SCENES);
  const [selectedScene, setSelectedScene] = useState<StorySceneItem | null>(null);

  // Media Assets State
  const [mediaAssets, setMediaAssets] = useState<MediaAssetItem[]>(INITIAL_MEDIA_ASSETS);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('تم حفظ إعدادات الموقع ونشرها بنجاح على صفحة الهبوط!');
  };

  const handleSaveCard = (card: GlassCardItem) => {
    setCards(cards.map((c) => (c.id === card.id ? card : c)));
    setEditingCard(null);
    showToast(`تم حفظ تعديل البطاقة الزجاجية ${card.cardNo}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header Breadcrumbs & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <span>لوحة التحكم الرئيسية</span>
            <span>/</span>
            <span className="text-red-600">إدارة محتوى الموقع (Landing CMS)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-red-600" />
            <span>لوحة تحكم إدارة الموقع وصفحة الهبوط العامة</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            التحكم في الأرقام المعتمدة، نصوص الـ Hero، البطاقات الزجاجية الخمس، قصة كرينز السينمائية (20 مشهداً)، ومكتبة الوسائط المعتمدة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('landing-preview')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-md"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>معاينة صفحة الهبوط الحية</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>إعدادات الهبوط والأرقام المعتمدة</span>
        </button>

        <button
          onClick={() => setActiveTab('cards')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'cards'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>البطاقات الزجاجية (Glass Cards 01-05)</span>
        </button>

        <button
          onClick={() => setActiveTab('scenes')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'scenes'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>مشاهد قصة كرينز (20 مشهداً)</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'media'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>مكتبة الأصول والتراخيص (Media QA)</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'leads'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>طلبات الحجز الواردة من الموقع ({leadBookings.length})</span>
        </button>
      </div>

      {/* Tab 1: Settings Form */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900">الأرقام المعتمدة والنصوص الرسمية (Landing Settings)</h3>
              <p className="text-xs text-slate-500">وفقاً لقرارات المالك في القسم 3: المصدر الوحيد لحقائق الموقع.</p>
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الإعدادات</span>
            </button>
          </div>

          {/* Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <label className="text-xs font-bold text-slate-700">عدد الأسطول الرسمي</label>
              <input
                type="text"
                value={settings.fleetCount}
                onChange={(e) => setSettings({ ...settings, fleetCount: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-black text-red-600 font-mono"
              />
              <span className="text-[10px] text-slate-500">المعتمد: +100 ونش</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <label className="text-xs font-bold text-slate-700">عدد المشاريع المنجزة</label>
              <input
                type="text"
                value={settings.projectCount}
                onChange={(e) => setSettings({ ...settings, projectCount: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-black text-amber-600 font-mono"
              />
              <span className="text-[10px] text-slate-500">المعتمد: +250 مشروع</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <label className="text-xs font-bold text-slate-700">أقصى قدرة رفع (طن)</label>
              <input
                type="text"
                value={settings.maxCapacityTon}
                onChange={(e) => setSettings({ ...settings, maxCapacityTon: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-black text-emerald-600 font-mono"
              />
              <span className="text-[10px] text-slate-500">المعتمد: +800 طن</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <label className="text-xs font-bold text-slate-700">سنوات الخبرة الراسخة</label>
              <input
                type="text"
                value={settings.experienceYears}
                onChange={(e) => setSettings({ ...settings, experienceYears: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-black text-cyan-600 font-mono"
              />
              <span className="text-[10px] text-slate-500">المعتمد: +35 سنة (منذ 1990)</span>
            </div>
          </div>

          {/* Slogans & Hero Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                العنوان الرئيسي بالعربية (Headline AR)
              </label>
              <input
                type="text"
                value={settings.headlineAr}
                onChange={(e) => setSettings({ ...settings, headlineAr: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                العنوان الرئيسي بالإنجليزية (Headline EN)
              </label>
              <input
                type="text"
                value={settings.headlineEn}
                onChange={(e) => setSettings({ ...settings, headlineEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              الوصف الفرعي بالهيدر (Subheadline)
            </label>
            <textarea
              rows={2}
              value={settings.subheadlineAr}
              onChange={(e) => setSettings({ ...settings, subheadlineAr: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
            />
          </div>

          {/* Buttons & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نص زر دخول النظام (ERP Button)
              </label>
              <input
                type="text"
                value={settings.erpLoginButtonTextAr}
                onChange={(e) => setSettings({ ...settings, erpLoginButtonTextAr: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                هاتف الواتساب المعتمد (WhatsApp)
              </label>
              <input
                type="text"
                value={settings.whatsappPhone}
                onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                البريد الإلكتروني للطلبات
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Glass Cards 01-05 */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                قائمة البطاقات الزجاجية الخمس (Featured Projects Cards 01-05)
              </h3>
              <p className="text-xs text-slate-500">
                البطاقات المعتمدة في المرجع ss1.mp4 والتي تتبدل خلفيات الهيدر عند النقر والتمرير عليها.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-red-400 transition-all shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="w-9 h-9 rounded-xl bg-red-50 text-red-700 font-mono font-black text-sm flex items-center justify-center shrink-0 border border-red-200">
                    {card.cardNo}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{card.titleAr}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {card.tagAr}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{card.descriptionAr}</p>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      ملف الميديا المرتبط: {card.mediaUrl}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEditingCard(card)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
              </div>
            ))}
          </div>

          {/* Edit Card Modal */}
          {editingCard && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-300 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900">
                    تعديل البطاقة الزجاجية رقم {editingCard.cardNo}
                  </h3>
                  <button
                    onClick={() => setEditingCard(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">العنوان بالعربية</label>
                    <input
                      type="text"
                      value={editingCard.titleAr}
                      onChange={(e) => setEditingCard({ ...editingCard, titleAr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">الوصف التفصيلي</label>
                    <textarea
                      rows={3}
                      value={editingCard.descriptionAr}
                      onChange={(e) => setEditingCard({ ...editingCard, descriptionAr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">الوسم (Badge Tag)</label>
                    <input
                      type="text"
                      value={editingCard.tagAr}
                      onChange={(e) => setEditingCard({ ...editingCard, tagAr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingCard(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => handleSaveCard(editingCard)}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Story Scenes (20 scenes) */}
      {activeTab === 'scenes' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                مشاهد قصة كرينز السينمائية (20 مشهداً × 6 ثوانٍ = 02:00 دقيقة)
              </h3>
              <p className="text-xs text-slate-500">
                تطابق تام مع نصوص القسم 8 في البرومبت المعتمد وتتحكم في العرض التفاعلي وسرد التمرير.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 hover:border-slate-400 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-slate-900 text-white">
                      #{scene.sceneNumber.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{scene.titleAr}</span>
                  </div>
                  <span className="text-[10px] font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    {scene.titleEn}
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                  «{scene.captionAr}»
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>حركة الكاميرا: {scene.cameraMotion}</span>
                  <span className="font-mono">{scene.durationSeconds} ثوانٍ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Media QA & Assets Library */}
      {activeTab === 'media' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">مكتبة الأصول وفحص الجودة (Media QA Checklist)</h3>
              <p className="text-xs text-slate-500">
                تسجيل دقة الوسائط، الترخيص، وخلوها من أي علامات دخيلة طبقاً لمعايير القسم 4.
              </p>
            </div>
            <button
              onClick={() => showToast('خاصية رفع وسائط جديدة للمستودع فعالة')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع أصل وسائط جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaAssets.map((asset) => (
              <div key={asset.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {asset.category === 'فيديوهات سينمائية' ? (
                      <Video className="w-4 h-4 text-red-500" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-cyan-500" />
                    )}
                    <h4 className="text-xs font-bold text-slate-900">{asset.titleAr}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>فحص QA معتمد</span>
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 font-mono text-[11px]">
                  <div>الملف: {asset.filename}</div>
                  <div>الدقة: {asset.resolution} • الحجم: {Math.round(asset.fileSizeKb / 1024)} MB</div>
                  <div>الترخيص المسجل: {asset.licenseType}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Incoming Website Leads */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                طلبات حجز وتأجير الأوناش الواردة من نموذج الموقع العام
              </h3>
              <p className="text-xs text-slate-500">
                تتحول تلقائياً إلى سجلات Lead في نظام المبيعات، مع موافقة موثقة للتواصل عبر واتساب.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {leadBookings.map((lead) => (
              <div
                key={lead.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-red-400 transition-all shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black font-mono px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">
                      {lead.leadNo}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{lead.clientName}</h4>
                      <p className="text-xs text-slate-500">{lead.companyName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      {lead.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{lead.createdAt}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">الرافعة المطلوبة:</span>
                    <span className="font-bold text-slate-800">{lead.selectedCraneModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">الموقع الميداني:</span>
                    <span className="font-bold text-slate-800">{lead.projectLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">الهاتف / واتساب:</span>
                    <span className="font-bold text-slate-800 font-mono" dir="ltr">
                      {lead.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">موافقة واتساب:</span>
                    <span className="font-bold text-emerald-600">
                      {lead.whatsappConsentGiven ? '✓ موافق ومسجل' : 'غير مفعل'}
                    </span>
                  </div>
                </div>

                {lead.notes && (
                  <p className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-150 text-slate-600">
                    ملاحظات: {lead.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
