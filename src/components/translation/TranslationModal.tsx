import React, { useState } from 'react';
import { X, Languages, Plus, Check, Edit2, Search, Trash2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { TranslationItem } from '../../types/erp';

export const TranslationModal: React.FC = () => {
  const {
    isTranslationModalOpen,
    setIsTranslationModalOpen,
    translations,
    editingTranslation,
    setEditingTranslation,
    saveTranslation,
  } = useERP();

  const [originalText, setOriginalText] = useState(editingTranslation?.originalText || 'Asset Maintenance Team');
  const [translatedText, setTranslatedText] = useState(editingTranslation?.translatedText || 'فريق صيانة الأصول');
  const [context, setContext] = useState(editingTranslation?.context || 'Assets Management');
  const [filterQuery, setFilterQuery] = useState('');

  if (!isTranslationModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalText.trim() || !translatedText.trim()) return;
    saveTranslation(originalText.trim(), translatedText.trim(), context.trim());
    setOriginalText('');
    setTranslatedText('');
    setContext('');
    setEditingTranslation(null);
  };

  const handleStartEdit = (item: TranslationItem) => {
    setEditingTranslation(item);
    setOriginalText(item.originalText);
    setTranslatedText(item.translatedText);
    setContext(item.context);
  };

  const filtered = translations.filter(
    (t) =>
      t.originalText.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.translatedText.includes(filterQuery) ||
      t.context.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between text-white"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-sky-300" />
            <div>
              <h3 className="text-base font-bold">Add / Update Translation (الترجمة الفورية من الواجهة)</h3>
              <p className="text-xs text-white/80">
                تعديل وتصحيح المصطلحات فورياً أثناء العمل وحفظها مباشرة في قاعدة البيانات
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsTranslationModalOpen(false);
              setEditingTranslation(null);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Form directly matching Screenshot 02 */}
          <form onSubmit={handleSave} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-700">
                {editingTranslation ? 'تعديل الترجمة الحالية' : 'إضافة ترجمة جديدة'}
              </span>
              <span className="text-[11px] text-slate-400">تطبيق حي ومباشر على شاشات ERP</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  النص الأصلي (Original Text) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asset Maintenance Team"
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  الترجمة بالعربية (Translation) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فريق صيانة الأصول"
                  value={translatedText}
                  onChange={(e) => setTranslatedText(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                سياق الاستخدام (Context)
              </label>
              <input
                type="text"
                placeholder="e.g. Asset Maintenance, Document Label, Button Action"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              {editingTranslation && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTranslation(null);
                    setOriginalText('');
                    setTranslatedText('');
                    setContext('');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  إلغاء التعديل
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-lg text-white shadow-xs transition-opacity hover:opacity-90 flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                <Check className="w-3.5 h-3.5" />
                <span>حفظ وتطبيق الترجمة</span>
              </button>
            </div>
          </form>

          {/* List of Existing Translations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">قائمة الترجمات المعرّفة بالنظام</span>
              <div className="relative w-56">
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث في الترجمات..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg pr-8 pl-3 py-1.5 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.translatedText}</span>
                      <span className="text-slate-400">←</span>
                      <span className="text-xs font-mono text-slate-600" dir="ltr">
                        {item.originalText}
                      </span>
                    </div>
                    {item.context && (
                      <span className="text-[11px] text-slate-500 block">
                        السياق: {item.context}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="تعديل"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>يتم حفظ جميع التعديلات في التخزين المباشر للنظام وتطبيقها فوراً.</span>
          <button
            onClick={() => {
              setIsTranslationModalOpen(false);
              setEditingTranslation(null);
            }}
            className="px-4 py-1.5 font-bold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
