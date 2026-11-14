import React, { useState, useMemo, useEffect } from 'react';
import {
  Wrench,
  Bell,
  Calendar,
  Clock,
  Link2,
  Sparkles,
  UserCheck,
  FileText,
  Save,
  X,
  Zap,
  CheckCircle2,
  ExternalLink,
  Sliders,
  ShieldAlert,
  ArrowLeftRight,
  MessageSquare,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  UnifiedMessageRule,
  MessageChannel,
  RuleTriggerFrequency,
  WhatsAppTemplate,
} from '../../types/erp';

interface WhatsAppRuleFormProps {
  initialRule?: UnifiedMessageRule | null;
  templates: WhatsAppTemplate[];
  onSave: (rule: UnifiedMessageRule, runTestNow?: boolean) => void;
  onCancel: () => void;
}

const DOC_TYPE_OPTIONS = [
  { value: 'MaintenanceLog', labelAr: 'MaintenanceLog — سجل صيانة الأسطول والخدمة الدورية' },
  { value: 'Sales Invoice', labelAr: 'Sales Invoice — فاتورة مبيعات التأجير' },
  { value: 'Cheque', labelAr: 'Cheque — شيك بنكي / حافظة شيكات' },
  { value: 'Lead', labelAr: 'Lead — طلب حجز رافعة من الموقع' },
  { value: 'Crane Contract', labelAr: 'Crane Contract — عقد تشغيل وتأجير' },
  { value: 'Crane Inspection', labelAr: 'Crane Inspection — شهادة معايرة وفحص ونش' },
  { value: 'Biometric Device', labelAr: 'Biometric Device — جهاز بصمة مواقع' },
];

const TRIGGER_OPTIONS: {
  key: NonNullable<UnifiedMessageRule['triggerKey']>;
  eventLabel: UnifiedMessageRule['triggerEvent'];
  labelAr: string;
  recommendedDoc: string;
  recommendedRecipient: UnifiedMessageRule['targetRecipientType'];
  recommendedTemplateId: string;
}[] = [
  {
    key: 'ServiceDueSoon',
    eventLabel: 'ServiceDueSoon (اقتراب موعد خدمة دورية للونش)',
    labelAr: 'ServiceDueSoon — اقتراب موعد خدمة دورية للونش',
    recommendedDoc: 'MaintenanceLog',
    recommendedRecipient: 'مسؤول الصيانة (MaintenanceManager)',
    recommendedTemplateId: 'tmpl-maintenance-service-due',
  },
  {
    key: 'LeadCreated',
    eventLabel: 'إنشاء طلب حجز Lead جديد',
    labelAr: 'LeadCreated — إنشاء طلب حجز رافعة جديد',
    recommendedDoc: 'Lead',
    recommendedRecipient: 'فريق المبيعات',
    recommendedTemplateId: 'tmpl-lead-ack',
  },
  {
    key: 'InvoiceSubmitted',
    eventLabel: 'إصدار فاتورة مبيعات',
    labelAr: 'InvoiceSubmitted — إصدار واعتماد فاتورة مبيعات',
    recommendedDoc: 'Sales Invoice',
    recommendedRecipient: 'العميل',
    recommendedTemplateId: 'tmpl-quotation-pdf',
  },
  {
    key: 'ChequeDueSoon',
    eventLabel: 'اقتراب استحقاق شيك',
    labelAr: 'ChequeDueSoon — اقتراب تاريخ استحقاق شيك',
    recommendedDoc: 'Cheque',
    recommendedRecipient: 'المدير المالي',
    recommendedTemplateId: 'tmpl-cheque-due',
  },
  {
    key: 'ChequeReturned',
    eventLabel: 'ارتداد شيك',
    labelAr: 'ChequeReturned — ارتداد شيك بنكي',
    recommendedDoc: 'Cheque',
    recommendedRecipient: 'المدير المالي',
    recommendedTemplateId: 'tmpl-cheque-bounced',
  },
  {
    key: 'CertExpiring',
    eventLabel: 'قرب انتهاء شهادة مشغل أو ترخيص ونش',
    labelAr: 'CertExpiring — قرب انتهاء شهادة معايرة أو رخصة',
    recommendedDoc: 'Crane Inspection',
    recommendedRecipient: 'مسؤول السلامة',
    recommendedTemplateId: 'tmpl-cert-expiring',
  },
  {
    key: 'DeviceOffline',
    eventLabel: 'تنبيه انقطاع جهاز بصمة',
    labelAr: 'DeviceOffline — تنبيه انقطاع جهاز بصمة بالموقع',
    recommendedDoc: 'Biometric Device',
    recommendedRecipient: 'المشغل/الموظف',
    recommendedTemplateId: 'tmpl-cert-expiring',
  },
];

const RECIPIENT_OPTIONS: {
  value: UnifiedMessageRule['targetRecipientType'];
  labelAr: string;
}[] = [
  {
    value: 'مسؤول الصيانة (MaintenanceManager)',
    labelAr: 'MaintenanceManager — مسؤول الصيانة والورش المركزية',
  },
  { value: 'العميل', labelAr: 'Customer — العميل / جهة التعاقد' },
  { value: 'المشغل/الموظف', labelAr: 'Operator/Staff — مشغل الونش / الموظف' },
  { value: 'فريق المبيعات', labelAr: 'Sales Team — فريق المبيعات والتسعير' },
  { value: 'مسؤول السلامة', labelAr: 'HSE Manager — مسؤول السلامة والجودة' },
  { value: 'المدير المالي', labelAr: 'CFO — المدير المالي والخزينة' },
];

const MAINTENANCE_FIELD_OPTIONS = [
  { value: 'leadMechanicNameAr', labelAr: 'اسم مسؤول الصيانة / المهندس المكلف (leadMechanicNameAr)' },
  { value: 'craneModel', labelAr: 'موديل وطراز الونش (craneModel)' },
  { value: 'craneCode', labelAr: 'الكود التعريفي للونش (craneCode)' },
  { value: 'nextDueDate', labelAr: 'تاريخ استحقاق الخدمة الدورية القادمة (nextDueDate)' },
  { value: 'scheduledDate', labelAr: 'تاريخ الصيانة المجدول (scheduledDate)' },
  { value: 'nextDueHourMeter', labelAr: 'عدّاد الساعات المستهدف للخدمة (nextDueHourMeter)' },
  { value: 'currentHourMeter', labelAr: 'عدّاد ساعات المحرك الحالي (currentHourMeter)' },
  { value: 'eventType', labelAr: 'نوع الخدمة / الصيانة الدورية (eventType)' },
  { value: 'eventNo', labelAr: 'رقم سجل الصيانة للرابط المباشر (eventNo)' },
  { value: 'workshopLocation', labelAr: 'موقع الورشة أو الساحة (workshopLocation)' },
  { value: 'serviceUrl', labelAr: 'الرابط المباشر لتفاصيل الخدمة (Direct Service URL)' },
];

const DEFAULT_MAINTENANCE_MAPPINGS: Record<string, string> = {
  '{{1}}': 'leadMechanicNameAr',
  '{{2}}': 'craneModel',
  '{{3}}': 'craneCode',
  '{{4}}': 'nextDueDate',
  '{{5}}': 'nextDueHourMeter',
  '{{6}}': 'eventType',
  '{{7}}': 'eventNo',
};

const formatApproxHijri = (isoDate: string): string => {
  if (!isoDate) return '—';
  try {
    const dt = new Date(isoDate);
    if (Number.isNaN(dt.getTime())) return '1448 هـ';
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dt);
  } catch {
    return 'جمادى الأولى 1448 هـ';
  }
};

export const WhatsAppRuleForm: React.FC<WhatsAppRuleFormProps> = ({
  initialRule,
  templates,
  onSave,
  onCancel,
}) => {
  const { maintenanceEvents } = useERP();

  const todayISO = new Date().toISOString().slice(0, 10);

  const [ruleNameAr, setRuleNameAr] = useState(
    initialRule?.ruleNameAr ||
      'تنبيه مسؤول الصيانة باقتراب موعد خدمة دورية لأي ونش مع رابط تفاصيل الخدمة'
  );
  const [relatedDocType, setRelatedDocType] = useState<string>(
    initialRule?.relatedDocType || 'MaintenanceLog'
  );
  const [triggerKey, setTriggerKey] = useState<NonNullable<UnifiedMessageRule['triggerKey']>>(
    initialRule?.triggerKey || 'ServiceDueSoon'
  );
  const [targetRecipientType, setTargetRecipientType] = useState<
    UnifiedMessageRule['targetRecipientType']
  >(initialRule?.targetRecipientType || 'مسؤول الصيانة (MaintenanceManager)');
  const [templateId, setTemplateId] = useState<string>(
    initialRule?.templateId || 'tmpl-maintenance-service-due'
  );

  // Frequency & Schedule (Next Execution)
  const [frequency, setFrequency] = useState<RuleTriggerFrequency>(
    initialRule?.frequency || 'X days before'
  );
  const [daysBeforeTrigger, setDaysBeforeTrigger] = useState<number>(
    initialRule?.daysBeforeTrigger ?? 3
  );
  const [nextExecution, setNextExecution] = useState<string>(
    initialRule?.nextExecution || todayISO
  );
  const [nextExecutionTime, setNextExecutionTime] = useState<string>(
    initialRule?.nextExecutionTime || '08:00'
  );

  // Direct service details link
  const [includeDirectServiceLink, setIncludeDirectServiceLink] = useState<boolean>(
    initialRule?.includeDirectServiceLink ?? true
  );
  const [serviceLinkBaseUrl, setServiceLinkBaseUrl] = useState<string>(
    initialRule?.serviceLinkBaseUrl || 'https://egyptcranes.com/fleet/maintenance/'
  );

  // Channels & active state
  const [primaryChannel, setPrimaryChannel] = useState<MessageChannel>(
    initialRule?.channelPriority?.[0] || 'WhatsApp'
  );
  const [fallbackChannel, setFallbackChannel] = useState<MessageChannel>(
    initialRule?.channelPriority?.[1] || 'SMS'
  );
  const [isActive, setIsActive] = useState<boolean>(initialRule?.isActive ?? true);

  // Template variable mapping state
  const [variableMappings, setVariableMappings] = useState<Record<string, string>>(
    initialRule?.variableMappings || DEFAULT_MAINTENANCE_MAPPINGS
  );

  // Stop conditions
  const [stopOnCompleted, setStopOnCompleted] = useState<boolean>(true);
  const [stopOnOptOut, setStopOnOptOut] = useState<boolean>(true);

  // Sample maintenance log for live preview
  const [previewEventId, setPreviewEventId] = useState<string>(
    maintenanceEvents[0]?.id || ''
  );

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === templateId) || templates[0],
    [templates, templateId]
  );

  const selectedPreviewEvent = useMemo(
    () =>
      maintenanceEvents.find((ev) => ev.id === previewEventId) ||
      maintenanceEvents[0],
    [maintenanceEvents, previewEventId]
  );

  // Sync default mappings when template changes
  useEffect(() => {
    if (!selectedTemplate) return;
    setVariableMappings((prev) => {
      const next: Record<string, string> = { ...prev };
      selectedTemplate.variables.forEach((v, idx) => {
        const placeholder = `{{${idx + 1}}}`;
        if (!next[placeholder]) {
          next[placeholder] = v;
        }
      });
      return next;
    });
  }, [selectedTemplate]);

  // Auto-select matching trigger & template if user switches Document to MaintenanceLog
  const handleDocTypeChange = (newDoc: string) => {
    setRelatedDocType(newDoc);
    if (newDoc === 'MaintenanceLog') {
      setTriggerKey('ServiceDueSoon');
      setTargetRecipientType('مسؤول الصيانة (MaintenanceManager)');
      const maintTemplate = templates.find((t) => t.id === 'tmpl-maintenance-service-due');
      if (maintTemplate) {
        setTemplateId(maintTemplate.id);
        setVariableMappings(DEFAULT_MAINTENANCE_MAPPINGS);
      }
      setIncludeDirectServiceLink(true);
    }
  };

  const handleTriggerChange = (newKey: NonNullable<UnifiedMessageRule['triggerKey']>) => {
    setTriggerKey(newKey);
    const meta = TRIGGER_OPTIONS.find((t) => t.key === newKey);
    if (meta) {
      setRelatedDocType(meta.recommendedDoc);
      setTargetRecipientType(meta.recommendedRecipient);
      if (templates.some((t) => t.id === meta.recommendedTemplateId)) {
        setTemplateId(meta.recommendedTemplateId);
      }
    }
  };

  // Resolve value from live MaintenanceLog record for preview
  const resolveFieldPreviewValue = (fieldName: string): string => {
    const ev = selectedPreviewEvent;
    const base = serviceLinkBaseUrl.endsWith('/')
      ? serviceLinkBaseUrl
      : `${serviceLinkBaseUrl}/`;
    if (!ev) {
      const fallbacks: Record<string, string> = {
        leadMechanicNameAr: 'م. إبراهيم القاضي',
        craneModel: 'Liebherr LTM 11200-9.1 (1200 Ton)',
        craneCode: 'EC-1200-01',
        nextDueDate: '2026-11-20',
        scheduledDate: '2026-11-18',
        nextDueHourMeter: '4,000',
        currentHourMeter: '3,890',
        eventType: 'صيانة دورية وقائية (500 ساعة)',
        eventNo: 'MNT-2026-0101',
        workshopLocation: 'الورشة المركزية - طريق السويس',
        serviceUrl: `${base}MNT-2026-0101`,
      };
      return fallbacks[fieldName] || `[${fieldName}]`;
    }

    switch (fieldName) {
      case 'leadMechanicNameAr':
        return ev.leadMechanicNameAr || 'م. إبراهيم القاضي';
      case 'craneModel':
        return ev.craneModel;
      case 'craneCode':
        return ev.craneCode;
      case 'nextDueDate':
        return ev.nextDueDate;
      case 'scheduledDate':
        return ev.scheduledDate;
      case 'nextDueHourMeter':
        return ev.nextDueHourMeter.toLocaleString();
      case 'currentHourMeter':
        return ev.currentHourMeter.toLocaleString();
      case 'eventType':
        return ev.eventType;
      case 'eventNo':
        return ev.eventNo;
      case 'workshopLocation':
        return ev.workshopLocation;
      case 'serviceUrl':
        return `${base}${ev.eventNo}`;
      default:
        return `[${fieldName}]`;
    }
  };

  const renderedPreviewBody = useMemo(() => {
    if (!selectedTemplate) return '';
    let body = selectedTemplate.bodyText;
    selectedTemplate.variables.forEach((v, idx) => {
      const placeholder = `{{${idx + 1}}}`;
      const mappedField = variableMappings[placeholder] || v;
      const val = resolveFieldPreviewValue(mappedField);
      body = body.split(placeholder).join(val);
    });
    if (
      includeDirectServiceLink &&
      !body.includes(serviceLinkBaseUrl) &&
      selectedPreviewEvent
    ) {
      const base = serviceLinkBaseUrl.endsWith('/')
        ? serviceLinkBaseUrl
        : `${serviceLinkBaseUrl}/`;
      body += `\n\nرابط تفاصيل الخدمة المباشر:\n${base}${selectedPreviewEvent.eventNo}`;
    }
    return body;
  }, [
    selectedTemplate,
    variableMappings,
    selectedPreviewEvent,
    includeDirectServiceLink,
    serviceLinkBaseUrl,
  ]);

  const renderedPreviewButtonUrl = useMemo(() => {
    const base = serviceLinkBaseUrl.endsWith('/')
      ? serviceLinkBaseUrl
      : `${serviceLinkBaseUrl}/`;
    const docNo = selectedPreviewEvent?.eventNo || 'MNT-2026-0101';
    return `${base}${docNo}`;
  }, [serviceLinkBaseUrl, selectedPreviewEvent]);

  const handleSubmit = (e: React.FormEvent, runTestNow = false) => {
    e.preventDefault();
    const triggerMeta =
      TRIGGER_OPTIONS.find((t) => t.key === triggerKey) || TRIGGER_OPTIONS[0];

    const channelList: MessageChannel[] = Array.from(
      new Set([primaryChannel, fallbackChannel, 'Email'])
    );

    const stopConditions: string[] = [];
    if (stopOnCompleted) {
      stopConditions.push('إغلاق أو اعتماد أمر الصيانة إلى مكتملة ومختبرة');
    }
    if (stopOnOptOut) {
      stopConditions.push('إلغاء اشتراك المستلم (STOP)');
    }

    const savedRule: UnifiedMessageRule = {
      id: initialRule?.id || `msg-rule-${Date.now()}`,
      ruleNameAr: ruleNameAr.trim() || 'قاعدة تنبيه صيانة دورية عبر واتساب',
      relatedDocType,
      triggerKey,
      triggerEvent: triggerMeta.eventLabel,
      channelPriority: channelList,
      targetRecipientType,
      templateId,
      frequency,
      daysBeforeTrigger: frequency === 'X days before' ? daysBeforeTrigger : undefined,
      nextExecution,
      nextExecutionTime,
      includeDirectServiceLink,
      serviceLinkBaseUrl,
      variableMappings,
      stopConditions,
      isActive,
    };

    onSave(savedRule, runTestNow);
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e, false)}
      className="bg-white rounded-2xl border-2 border-emerald-500/30 shadow-lg overflow-hidden animate-in fade-in duration-150"
      dir="rtl"
    >
      {/* Top Form Header */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-950 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black">
                نموذج إعداد قاعدة أتمتة واتساب (WhatsAppRuleForm)
              </h3>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                {relatedDocType} • {triggerKey}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              ربط مستندات الصيانة والأسطول بمحرك واتساب وتحديد الجدولة الزمنية وربط متغيرات القالب ببيانات الونش وموعد الخدمة.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <X className="w-4 h-4" />
          <span>إغلاق النموذج</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Section 1: Rule Identity & Core Targeting (DocType, Trigger, Recipient) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="md:col-span-2 lg:col-span-4">
            <label className="block font-black text-slate-800 mb-1.5">
              اسم قاعدة الأتمتة (Rule Name)
            </label>
            <input
              type="text"
              required
              value={ruleNameAr}
              onChange={(e) => setRuleNameAr(e.target.value)}
              placeholder="مثال: تنبيه مسؤول الصيانة باقتراب موعد خدمة دورية للونش..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Document Type: MaintenanceLog */}
          <div>
            <label className="font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-red-600" />
              <span>المستند المرتبط (DocType)</span>
            </label>
            <select
              value={relatedDocType}
              onChange={(e) => handleDocTypeChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-600"
            >
              {DOC_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.labelAr}
                </option>
              ))}
            </select>
          </div>

          {/* Trigger: ServiceDueSoon */}
          <div>
            <label className="font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>المحفز / الحدث (Trigger)</span>
            </label>
            <select
              value={triggerKey}
              onChange={(e) =>
                handleTriggerChange(
                  e.target.value as NonNullable<UnifiedMessageRule['triggerKey']>
                )
              }
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-600"
            >
              {TRIGGER_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.labelAr}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient: MaintenanceManager */}
          <div>
            <label className="font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>المستلم المستهدف (Recipient)</span>
            </label>
            <select
              value={targetRecipientType}
              onChange={(e) =>
                setTargetRecipientType(
                  e.target.value as UnifiedMessageRule['targetRecipientType']
                )
              }
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-600"
            >
              {RECIPIENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.labelAr}
                </option>
              ))}
            </select>
          </div>

          {/* Template Selector */}
          <div>
            <label className="font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>قالب Meta المعتمد</span>
            </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-600"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.titleAr} ({t.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 2: Maintenance Automation — Frequency & Schedule Dropdowns + Next Execution Date-Picker */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>جدولة أتمتة الصيانة والتكرار (Maintenance Automation Schedule & Frequency)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                حدد تكرار إطلاق القاعدة بالنسبة لتاريخ استحقاق الخدمة الدورية للونش وموعد التنفيذ القادم (Next Execution).
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
              <span>تفعيل القاعدة آلياً (Active)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Frequency Dropdown */}
            <div>
              <label className="block font-black text-slate-700 mb-1.5">
                التكرار وتوقيت الإطلاق (Frequency)
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as RuleTriggerFrequency)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="Immediately">Immediately — فوراً عند تحقق المحفز</option>
                <option value="Daily">Daily — يومياً (فحص دوري مجدول)</option>
                <option value="X days before">X days before — قبل موعد الخدمة بـ X أيام</option>
              </select>
            </div>

            {/* Days Before Trigger (Conditional on X days before) or Schedule Summary */}
            <div>
              <label className="block font-black text-slate-700 mb-1.5">
                جدولة المهلة / نمط الإرسال (Schedule)
              </label>
              {frequency === 'X days before' ? (
                <div className="flex items-center gap-2">
                  <select
                    value={daysBeforeTrigger}
                    onChange={(e) => setDaysBeforeTrigger(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value={1}>قبل موعد الخدمة بـ 1 يوم (تنبيه عاجل)</option>
                    <option value={2}>قبل موعد الخدمة بـ 2 يوم</option>
                    <option value={3}>قبل موعد الخدمة بـ 3 أيام (موصى به)</option>
                    <option value={5}>قبل موعد الخدمة بـ 5 أيام</option>
                    <option value={7}>قبل موعد الخدمة بـ 7 أيام (أسبوع)</option>
                    <option value={14}>قبل موعد الخدمة بـ 14 يوم (أسبوعان)</option>
                  </select>
                </div>
              ) : (
                <div className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>
                    {frequency === 'Immediately'
                      ? 'تنفيذ لحظي عبر Event Dispatcher'
                      : 'تنفيذ يومي مجدول على أسطول الأوناش'}
                  </span>
                </div>
              )}
            </div>

            {/* Next Execution Date Picker */}
            <div>
              <label className="block font-black text-slate-700 mb-1.5">
                تاريخ التنفيذ القادم (Next Execution Date)
              </label>
              <input
                type="date"
                value={nextExecution}
                onChange={(e) => setNextExecution(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                التاريخ الهجري: {formatApproxHijri(nextExecution)}
              </span>
            </div>

            {/* Next Execution Time */}
            <div>
              <label className="block font-black text-slate-700 mb-1.5">
                وقت التنفيذ القادم (Next Execution Time)
              </label>
              <input
                type="time"
                value={nextExecutionTime}
                onChange={(e) => setNextExecutionTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-white focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                بتوقيت القاهرة (يلتزم بساعات الهدوء 22:00 - 08:00)
              </span>
            </div>
          </div>

          {/* Direct Service Link Configuration */}
          <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center text-xs">
            <div className="lg:col-span-5">
              <label className="flex items-center gap-2 font-black text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDirectServiceLink}
                  onChange={(e) => setIncludeDirectServiceLink(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
                <Link2 className="w-4 h-4 text-blue-600" />
                <span>تضمين رابط مباشر لتفاصيل الخدمة الدورية للونش</span>
              </label>
              <p className="text-[11px] text-slate-500 mr-6 mt-0.5">
                يُرفق الرابط الموقّع لفتح بطاقة الونش وقائمة الفحص وقطع الغيار بنقرة واحدة.
              </p>
            </div>

            {includeDirectServiceLink && (
              <div className="lg:col-span-7">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  بادئة رابط تفاصيل الخدمة (Service Details URL Pattern):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={serviceLinkBaseUrl}
                    onChange={(e) => setServiceLinkBaseUrl(e.target.value)}
                    dir="ltr"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-mono text-left bg-white text-slate-800"
                  />
                  <span className="px-2.5 py-2 rounded-xl bg-slate-200/70 font-mono text-[11px] font-bold text-slate-700" dir="ltr">
                    {'{eventNo}'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Template Variable Mapping + Live WhatsApp Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Variable Binding Table (7 cols) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-purple-600" />
                  <span>ربط متغيرات القالب ببيانات الونش وموعد الصيانة</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  اربط كل متغير ديناميكي في القالب بحقل فعلي من مستند {relatedDocType}.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg">
                {selectedTemplate?.variables.length || 0} متغيرات
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {selectedTemplate?.variables.map((varKey, idx) => {
                const placeholder = `{{${idx + 1}}}`;
                const mappedValue = variableMappings[placeholder] || varKey;
                return (
                  <div
                    key={placeholder}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200"
                  >
                    <div className="sm:col-span-3 flex items-center gap-2">
                      <span className="px-2 py-1 rounded-lg bg-purple-100 text-purple-800 font-mono font-black text-[11px]">
                        {placeholder}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono truncate">
                        {varKey}
                      </span>
                    </div>

                    <div className="sm:col-span-6">
                      <select
                        value={mappedValue}
                        onChange={(e) =>
                          setVariableMappings((prev) => ({
                            ...prev,
                            [placeholder]: e.target.value,
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-800 bg-white text-[11px]"
                      >
                        {MAINTENANCE_FIELD_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.labelAr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3 text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block">القيمة الحالية:</span>
                      <span className="text-[11px] font-bold text-emerald-700 truncate block">
                        {resolveFieldPreviewValue(mappedValue)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Failover Channels & Stop Conditions */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="font-black text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-red-600" />
                  <span>سلسلة القنوات البديلة (Failover):</span>
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={primaryChannel}
                    onChange={(e) => setPrimaryChannel(e.target.value as MessageChannel)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-[11px]"
                  >
                    <option value="WhatsApp">1. WhatsApp</option>
                    <option value="SMS">1. SMS</option>
                  </select>
                  <select
                    value={fallbackChannel}
                    onChange={(e) => setFallbackChannel(e.target.value as MessageChannel)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-[11px]"
                  >
                    <option value="SMS">2. SMS (بديل)</option>
                    <option value="Email">2. Email (بديل)</option>
                    <option value="WhatsApp">2. WhatsApp</option>
                  </select>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-black text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>شروط التوقف التلقائي:</span>
                </span>
                <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stopOnCompleted}
                    onChange={(e) => setStopOnCompleted(e.target.checked)}
                    className="accent-emerald-600"
                  />
                  <span>إيقاف التنبيه عند إتمام الصيانة (مكتملة ومختبرة)</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stopOnOptOut}
                    onChange={(e) => setStopOnOptOut(e.target.checked)}
                    className="accent-emerald-600"
                  />
                  <span>إيقاف فوري عند إرسال STOP / قف</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Live Crane Maintenance Preview Card (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#efeae2] border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 bg-white/90 p-2.5 rounded-xl border border-slate-200 text-xs">
                <span className="font-black text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>معاينة حية لرسالة الونش:</span>
                </span>
                <select
                  value={selectedPreviewEvent?.id || ''}
                  onChange={(e) => setPreviewEventId(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-slate-300 text-[11px] font-bold text-slate-800 max-w-[190px]"
                >
                  {maintenanceEvents.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.craneCode} — {ev.eventNo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Simulated WhatsApp Bubble */}
              <div className="bg-white rounded-2xl rounded-tr-none p-4 shadow-sm border border-emerald-200/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    معاينة قالب WhatsApp Business
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {nextExecution} • {nextExecutionTime}
                  </span>
                </div>

                {selectedTemplate?.headerText && (
                  <div className="font-black text-slate-900">
                    {selectedTemplate.headerText}
                  </div>
                )}

                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {renderedPreviewBody}
                </p>

                {selectedTemplate?.footerText && (
                  <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-100">
                    {selectedTemplate.footerText}
                  </div>
                )}

                {includeDirectServiceLink && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center font-black text-emerald-800 text-xs flex items-center justify-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>عرض تفاصيل الخدمة الدورية</span>
                    </div>
                    <div
                      className="text-[10px] font-mono text-blue-600 text-center truncate"
                      dir="ltr"
                    >
                      {renderedPreviewButtonUrl}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Summary Banner */}
            <div className="bg-white/90 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1">
              <div className="font-black text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ملخص التنفيذ الآلي:</span>
              </div>
              <p>
                سيتم فحص مستندات <strong>{relatedDocType}</strong> وإشعار{' '}
                <strong>{targetRecipientType}</strong>{' '}
                {frequency === 'Immediately'
                  ? 'فوراً عند تحقق الحدث'
                  : frequency === 'Daily'
                  ? 'يومياً بشكل مجدول'
                  : `قبل موعد الخدمة بـ ${daysBeforeTrigger} أيام`}{' '}
                (التنفيذ القادم: <span className="font-mono font-bold">{nextExecution} {nextExecutionTime}</span>).
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="text-[11px] text-slate-500">
            يُحفظ التكوين ضمن محرك القواعد ويرتبط تلقائياً بموزع الأحداث وسجل التدقيق (Audit Trail).
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>حفظ وإرسال تنبيه تجريبي</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>حفظ قاعدة الأتمتة</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
