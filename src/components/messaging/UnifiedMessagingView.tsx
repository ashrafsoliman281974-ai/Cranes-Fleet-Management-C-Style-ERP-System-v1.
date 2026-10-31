import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Smartphone,
  Mail,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  Plus,
  ShieldCheck,
  Check,
  Key,
  Globe,
  CreditCard,
  ExternalLink,
  FileText,
  CheckCheck,
  Filter,
  Phone,
  UserCheck,
  XCircle,
  AlertCircle,
  PlayCircle,
  Eye,
  Bot,
  User,
  Zap,
  Lock,
  Calendar,
  Share2,
  Copy,
  Sliders,
  DollarSign,
  Truck,
  FileCheck,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  INITIAL_MESSAGING_RULES,
  INITIAL_MESSAGING_LOGS,
} from '../../data/masterEnterpriseSeed';
import {
  UnifiedMessageRule,
  UnifiedMessageLog,
  MessageChannel,
  WhatsAppTemplate,
  WhatsAppConversationMessage,
} from '../../types/erp';
import { eventDispatcher, CranesEventType } from '../../utils/eventDispatcher';

interface ConversationContact {
  id: string;
  nameAr: string;
  companyAr: string;
  phone: string;
  normalizedPhone: string;
  roleAr: string;
  is24hActive: boolean;
  hoursRemaining: number;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  optedOut: boolean;
  linkedDocs: {
    type: string;
    no: string;
    title: string;
    amount?: number;
    date: string;
    status: string;
  }[];
}

const INITIAL_CONTACTS: ConversationContact[] = [
  {
    id: 'ct-1',
    nameAr: 'م. حسام الدين عبد الرحيم',
    companyAr: 'تحالف أوراسكوم - حسن علام (مشروع المونوريل)',
    phone: '01004567890',
    normalizedPhone: '+201004567890',
    roleAr: 'مدير قطاع المعدات والنقل الثقيل',
    is24hActive: true,
    hoursRemaining: 18,
    unreadCount: 1,
    lastMessage: 'نحتاج الرافعة 500 طن بوم 84 متراً لموقع العاصمة الإدارية بدءاً من الأحد القادم.',
    lastMessageTime: '09:32 ص',
    optedOut: false,
    linkedDocs: [
      { type: 'Lead', no: 'LEAD-2026-0089', title: 'طلب تأجير ونش ليبهير 500 طن', date: '2026-10-31', status: 'جديد' },
      { type: 'Crane Contract', no: 'CRN-CNT-2026-081', title: 'عقد تشغيل شهري - مونوريل العاصمة', amount: 850000, date: '2026-10-25', status: 'قيد الاعتماد' },
      { type: 'Sales Invoice', no: 'ACC-SINV-2026-0001', title: 'فاتورة ساعات عمل رافعة ليبهير 500 طن', amount: 877800, date: '2026-10-15', status: 'مستحقة' },
      { type: 'Cheque', no: '00984122', title: 'شيك مسحوب على البنك الأهلي', amount: 450000, date: '2026-11-15', status: 'تحت التحصيل' },
    ],
  },
  {
    id: 'ct-2',
    nameAr: 'م. طارق فاروق',
    companyAr: 'بتروجيت للمشروعات البترولية والصناعية',
    phone: '01223344556',
    normalizedPhone: '+201223344556',
    roleAr: 'مدير مشروع مصفاة تكرير ميدور',
    is24hActive: false,
    hoursRemaining: 0,
    unreadCount: 0,
    lastMessage: 'تم استلام كشف حساب الشيكات والدفعة الجديدة. شكراً لسرعة الرد.',
    lastMessageTime: 'أمس 04:15 م',
    optedOut: false,
    linkedDocs: [
      { type: 'Crane Contract', no: 'CRN-CNT-2026-082', title: 'عقد رافعة ديمج 1600 طن مجنزرة', amount: 1650000, date: '2026-10-20', status: 'سارٍ' },
      { type: 'Sales Invoice', no: 'ACC-SINV-2026-0002', title: 'فاتورة تعبئة ونقل الأثقال الإضافية', amount: 600000, date: '2026-10-18', status: 'مسددة جزئياً' },
    ],
  },
  {
    id: 'ct-3',
    nameAr: 'م. أحمد عثمان',
    companyAr: 'شركة المقاولون العرب (عثمان أحمد عثمان)',
    phone: '01112233445',
    normalizedPhone: '+201112233445',
    roleAr: 'مدير الإدارة العامة للمعدات والميكانيكا',
    is24hActive: true,
    hoursRemaining: 11,
    unreadCount: 0,
    lastMessage: 'أرسلنا شيكات الدفعة الجديدة CHQ-BATCH-2026-001 برجاء إفادتنا بإيصال القبض.',
    lastMessageTime: 'أمس 01:20 م',
    optedOut: false,
    linkedDocs: [
      { type: 'Cheque Batch', no: 'CHQ-BATCH-2026-001', title: 'حافظة شيكات 3 شيكات بنكية', amount: 1400000, date: '2026-10-28', status: 'معتمدة ومرحلة' },
      { type: 'Sales Invoice', no: 'ACC-SINV-2026-0001', title: 'فاتورة تشغيل الأوناش البرجية', amount: 450000, date: '2026-10-10', status: 'مسددة بشيك' },
    ],
  },
  {
    id: 'ct-4',
    nameAr: 'م. يوسف القاضي (سلامة الموقع)',
    companyAr: 'هيئة المحطات النووية - مشروع الضبعة',
    phone: '01556677889',
    normalizedPhone: '+201556677889',
    roleAr: 'رئيس قسم السلامة والصحة المهنية HSE',
    is24hActive: true,
    hoursRemaining: 23,
    unreadCount: 2,
    lastMessage: 'يرجى إرسال شهادة TÜV المحدثة لرافعة ليبهير 1200 طن لتجديد تصريح الدخول.',
    lastMessageTime: '10:15 ص',
    optedOut: false,
    linkedDocs: [
      { type: 'Crane Inspection', no: 'CERT-TUV-2026-091', title: 'شهادة المعايرة الدورية للرافعة 1200 طن', date: '2026-11-15', status: 'قرب الانتهاء' },
    ],
  },
];

export const UnifiedMessagingView: React.FC = () => {
  const {
    showToast,
    whatsAppTemplates,
    whatsAppConversations,
    sendWhatsAppMessage,
    logAuditEvent,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'chat' | 'rules' | 'templates' | 'logs' | 'settings'>('chat');

  // Conversation & 2-Way Chat state
  const [contacts, setContacts] = useState<ConversationContact[]>(INITIAL_CONTACTS);
  const [selectedContactId, setSelectedContactId] = useState<string>('ct-1');
  const [chatSearch, setChatSearch] = useState('');
  const [messages, setMessages] = useState<WhatsAppConversationMessage[]>(whatsAppConversations);
  const [typedMessage, setTypedMessage] = useState('');
  const [selectedTemplateForSend, setSelectedTemplateForSend] = useState<string>('');
  const [isDocDrawerOpen, setIsDocDrawerOpen] = useState(false);

  // Webhook sandbox state
  const [incomingSimText, setIncomingSimText] = useState('تم التحقق وتأكيد الرصيد للشيك المستحق. شكراً لكم.');

  // Rules state
  const [rules, setRules] = useState<UnifiedMessageRule[]>(INITIAL_MESSAGING_RULES);
  const [logs, setLogs] = useState<UnifiedMessageLog[]>(INITIAL_MESSAGING_LOGS);

  // Meta API Settings
  const [waSettings, setWaSettings] = useState({
    wabaId: 'WABA_109948210389',
    phoneNumberId: 'PHONE_ID_8830112',
    appSecret: 'app_sec_9948bb20109ae940',
    showSecret: false,
    webhookVerifyToken: 'CRANES_WH_TOKEN_SECURE_2026',
    webhookCallbackUrl: 'https://api.egyptcranes.com/webhooks/whatsapp',
    senderNumberFormatted: '+20 100 818 1125',
    isSandboxMode: false,
    rateLimitPerMin: 60,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    quietHoursEnforced: true,
    allowEmergencyBypass: true,
  });

  // SMS Gateway Settings
  const [smsSettings, setSmsSettings] = useState({
    senderId: 'EGYPTCRANES',
    balanceEGP: 4850,
    costPerSms: 0.28,
  });

  // Phone Normalizer Tool
  const [testRawPhone, setTestRawPhone] = useState('01004567890');

  const selectedContact = useMemo(() => {
    return contacts.find((c) => c.id === selectedContactId) || contacts[0];
  }, [contacts, selectedContactId]);

  // Listen to ERP event bus updates in real time
  useEffect(() => {
    const unsubscribe = eventDispatcher.subscribe('*', (payload) => {
      // Auto create an outbound log when an ERP event fires
      const newLog: UnifiedMessageLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        channel: 'WhatsApp',
        recipientNameAr: payload.partyNameAr || 'الجهة المعنية',
        recipientPhone: payload.partyPhone || '+201008181125',
        messageContent: `[حدث تلقائي: ${payload.eventType}] تم إرسال إشعار مستند ${payload.docType} #${payload.docNumber} بنجاح.`,
        relatedDocType: payload.docType,
        relatedDocNo: payload.docNumber,
        status: 'تم التسليم بنجاح',
      };
      setLogs((prev) => [newLog, ...prev]);
    });

    return () => unsubscribe();
  }, []);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    if (!chatSearch.trim()) return contacts;
    const q = chatSearch.toLowerCase();
    return contacts.filter(
      (c) =>
        c.nameAr.toLowerCase().includes(q) ||
        c.companyAr.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [contacts, chatSearch]);

  // Phone normalization helper
  const normalizeEgyptianPhone = (raw: string) => {
    let clean = raw.replace(/\D/g, '');
    if (clean.startsWith('20')) {
      clean = clean.slice(2);
    }
    if (clean.startsWith('0')) {
      clean = clean.slice(1);
    }
    const fullNormalized = `+20${clean}`;

    let carrier = 'غير معروف';
    if (clean.startsWith('10')) carrier = 'فودافون مصر (Vodafone)';
    else if (clean.startsWith('11')) carrier = 'اتصالات مصر (e& / Etisalat)';
    else if (clean.startsWith('12')) carrier = 'أورنج مصر (Orange)';
    else if (clean.startsWith('15')) carrier = 'المصرية للاتصالات (WE)';

    const isValid = clean.length === 10 && ['10', '11', '12', '15'].includes(clean.slice(0, 2));

    return {
      normalized: fullNormalized,
      formattedDisplay: `+20 ${clean.slice(0, 2)} ${clean.slice(2, 6)} ${clean.slice(6)}`,
      carrier,
      isValid,
    };
  };

  const normalizerResult = useMemo(() => normalizeEgyptianPhone(testRawPhone), [testRawPhone]);

  // Handle Free-Text Send in 2-Way Chat
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    if (!selectedContact.is24hActive) {
      showToast('تنبيه: خارج نافذة الـ 24 ساعة التفاعلية! يجب استخدام قالب Meta معتمد.');
      return;
    }

    if (selectedContact.optedOut) {
      showToast('خطأ: المستلم قام بإلغاء الاشتراك (Opt-out) عبر أمر قف / STOP. لا يمكن مراسلته.');
      return;
    }

    const newMsg: WhatsAppConversationMessage = {
      id: `wamsg-${Date.now()}`,
      direction: 'صادر (Outbound)',
      sender: waSettings.senderNumberFormatted,
      recipient: selectedContact.normalizedPhone,
      text: typedMessage,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'سُلِّمت',
      isTemplate: false,
      relatedDocType: selectedContact.linkedDocs[0]?.type || 'Customer Contact',
      relatedDocNo: selectedContact.linkedDocs[0]?.no || 'CRM-001',
    };

    setMessages((prev) => [...prev, newMsg]);

    // Add to logs
    const newLog: UnifiedMessageLog = {
      id: `log-${Date.now()}`,
      timestamp: newMsg.timestamp,
      channel: 'WhatsApp',
      recipientNameAr: selectedContact.nameAr,
      recipientPhone: selectedContact.normalizedPhone,
      messageContent: typedMessage,
      relatedDocType: newMsg.relatedDocType || 'Customer',
      relatedDocNo: newMsg.relatedDocNo || 'CHAT',
      status: 'تم التسليم بنجاح',
    };
    setLogs((prev) => [newLog, ...prev]);

    setTypedMessage('');
    showToast(`تم إرسال الرسالة إلى ${selectedContact.nameAr} بنجاح عبر Meta Cloud API`);
  };

  // Handle Send Approved Template
  const handleSendTemplateFromChat = (templateId: string) => {
    const tmpl = whatsAppTemplates.find((t) => t.id === templateId);
    if (!tmpl) return;

    // Substitute variables based on contact
    let text = tmpl.bodyText;
    text = text.replace('{{1}}', selectedContact.nameAr);
    text = text.replace('{{2}}', selectedContact.linkedDocs[0]?.no || 'CHQ-00984122');
    text = text.replace('{{3}}', 'البنك الأهلي المصري');
    text = text.replace('{{4}}', (selectedContact.linkedDocs[0]?.amount || 450000).toLocaleString());
    text = text.replace('{{5}}', '2026-11-15');

    const newMsg: WhatsAppConversationMessage = {
      id: `wamsg-${Date.now()}`,
      direction: 'صادر (Outbound)',
      sender: waSettings.senderNumberFormatted,
      recipient: selectedContact.normalizedPhone,
      text: `${tmpl.headerText ? `*${tmpl.headerText}*\n\n` : ''}${text}${
        tmpl.footerText ? `\n\n_${tmpl.footerText}_` : ''
      }`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'سُلِّمت',
      isTemplate: true,
      relatedDocType: selectedContact.linkedDocs[0]?.type || 'Document',
      relatedDocNo: selectedContact.linkedDocs[0]?.no || 'DOC-01',
    };

    setMessages((prev) => [...prev, newMsg]);

    const newLog: UnifiedMessageLog = {
      id: `log-${Date.now()}`,
      timestamp: newMsg.timestamp,
      channel: 'WhatsApp',
      recipientNameAr: selectedContact.nameAr,
      recipientPhone: selectedContact.normalizedPhone,
      messageContent: `[قالب معتمد: ${tmpl.titleAr}] ${newMsg.text}`,
      relatedDocType: newMsg.relatedDocType || 'Template',
      relatedDocNo: newMsg.relatedDocNo || 'WA-TMPL',
      status: 'تم التسليم بنجاح',
    };
    setLogs((prev) => [newLog, ...prev]);

    showToast(`تم إرسال القالب المعتمد [${tmpl.titleAr}] للمستلم`);
  };

  // Generate Signed Portal Link
  const handleGenerateSignedLink = (doc: { type: string; no: string; title: string }) => {
    const token = `sec_sig_${Math.random().toString(36).substring(2, 10)}`;
    const link = `https://portal.egyptcranes.com/sign/${doc.no.toLowerCase()}?auth=${token}&exp=2026-11-07`;

    const text = `عزيزي ${selectedContact.nameAr}، برجاء استخدام الرابط الآمن التالي للمعاينة والاعتماد والتوقيع الرقمي للمستند (${doc.title} #${doc.no}):\n${link}\n(صلاحية الرابط 7 أيام بموجب معايير الأمان ISO 27001).`;

    const newMsg: WhatsAppConversationMessage = {
      id: `wamsg-${Date.now()}`,
      direction: 'صادر (Outbound)',
      sender: waSettings.senderNumberFormatted,
      recipient: selectedContact.normalizedPhone,
      text,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'سُلِّمت',
      isTemplate: false,
      relatedDocType: doc.type,
      relatedDocNo: doc.no,
      signedPortalLink: link,
    };

    setMessages((prev) => [...prev, newMsg]);
    showToast(`تم توليد وإرسال رابط البوابة المشفر للمستند #${doc.no}`);
  };

  // Webhook Simulation: Incoming Customer Message
  const handleSimulateInboundWebhook = (customText?: string) => {
    const textToSimulate = customText || incomingSimText;
    if (!textToSimulate.trim()) return;

    const isOptOut =
      textToSimulate.trim().toLowerCase() === 'stop' ||
      textToSimulate.trim() === 'قف' ||
      textToSimulate.trim() === 'الغاء';

    const newMsg: WhatsAppConversationMessage = {
      id: `wamsg-in-${Date.now()}`,
      direction: 'وارد (Inbound)',
      sender: selectedContact.normalizedPhone,
      recipient: waSettings.senderNumberFormatted,
      text: textToSimulate,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'قُرئت',
      isTemplate: false,
      relatedDocType: selectedContact.linkedDocs[0]?.type || 'Customer Contact',
      relatedDocNo: selectedContact.linkedDocs[0]?.no || 'CRM-001',
    };

    setMessages((prev) => [...prev, newMsg]);

    // Also update contact status to active 24h window
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContact.id) {
          return {
            ...c,
            is24hActive: !isOptOut,
            hoursRemaining: isOptOut ? 0 : 24,
            lastMessage: textToSimulate,
            lastMessageTime: 'الآن',
            optedOut: isOptOut,
          };
        }
        return c;
      })
    );

    if (isOptOut) {
      logAuditEvent({
        userId: 'system-webhook',
        userNameAr: 'خادم Webhook واتساب',
        userRoleAr: 'نظام آلي',
        userIpAddress: 'Meta-IP-31.13.64.0',
        userDevice: 'Meta Cloud API Webhook Listener',
        actionType: 'تعديل',
        moduleNameAr: 'تكامل واتساب والأمان',
        docType: 'WhatsApp Consent',
        docId: selectedContact.id,
        docNumber: selectedContact.phone,
        summaryAr: `تم استلام أمر [${textToSimulate}] وإلغاء اشتراك العميل (${selectedContact.nameAr}) من كافة الرسائل الآلية فوراً امتثالاً لسياسات Meta`,
        severity: 'تنبيه (Warning)',
        complianceCategory: 'أمان وسريّة البيانات',
        status: 'نجاح',
        fieldChanges: [
          { fieldNameAr: 'حالة الموافقة والتواصل', fieldNameEn: 'whatsappConsentGiven', oldValue: true, newValue: false },
        ],
      });
      showToast(`تم استقبال أمر [${textToSimulate}] وإيقاف المراسلات للعميل فوراً.`);
    } else {
      showToast(`تم استقبال رد العميل: "${textToSimulate.slice(0, 30)}..." وتجديد نافذة الـ 24 ساعة!`);
    }
  };

  // Rule Trigger Simulator
  const handleTestRuleEvent = (rule: UnifiedMessageRule) => {
    // Map rule trigger to CranesEventType
    let eventType: CranesEventType = 'cheque.received';
    if (rule.triggerEvent === 'اقتراب استحقاق شيك') eventType = 'cheque.due_soon';
    else if (rule.triggerEvent === 'ارتداد شيك') eventType = 'cheque.returned';
    else if (rule.triggerEvent === 'إصدار فاتورة مبيعات') eventType = 'invoice.submitted';
    else if (rule.triggerEvent === 'إنشاء طلب حجز Lead جديد') eventType = 'lead.created';
    else if (rule.triggerEvent === 'قرب انتهاء شهادة مشغل أو ترخيص ونش') eventType = 'cert.expiring';
    else if (rule.triggerEvent === 'سجل تشغيل ينتظر اعتماد العميل') eventType = 'usage_log.pending_approval';
    else if (rule.triggerEvent === 'اعتماد عقد تأجير') eventType = 'contract.approved';

    const docTypeStr = rule.relatedDocType || 'Document';

    eventDispatcher.publish({
      eventId: `sim-evt-${Date.now()}`,
      eventType,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      sourceModule: 'Automation Simulator',
      docType: docTypeStr,
      docId: 'DOC-SIM-991',
      docNumber: `${docTypeStr.toUpperCase().slice(0, 3)}-2026-99`,
      partyNameAr: selectedContact.nameAr,
      partyPhone: selectedContact.normalizedPhone,
      amount: 450000,
      currency: 'EGP',
      data: {
        ruleId: rule.id,
        ruleName: rule.ruleNameAr,
        channel: rule.channelPriority[0],
      },
    });

    showToast(`تم إطلاق الحدث [${rule.ruleNameAr}] واشتراك موديول واتساب بنجاح!`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <span>التكامل المؤسسي</span>
            <span>/</span>
            <span className="text-red-600">الموديول B: محرك واتساب والاتصالات الموحدة (Meta Cloud API)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            <span>محرك واتساب المؤسسي والرسائل الموحدة (WhatsApp Business Integration)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ربط موزع الأحداث (Event Dispatcher)، قوالب Meta المعتمدة، نافذة المحادثة التفاعلية 24 ساعة، روابط البوابة الموقعة رقمياً، والمسار البديل SMS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Meta API متصل: {waSettings.senderNumberFormatted}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>رسائل واتساب المرسلة اليوم</span>
            <MessageSquare className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {logs.filter((l) => l.channel === 'WhatsApp').length + 8} رسائل
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCheck className="w-3.5 h-3.5" />
            <span>نسبة التسليم: 99.4% (Meta Official Cloud)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>قوالب Meta المعتمدة</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-700 font-mono">
            {whatsAppTemplates.length} قوالب
          </div>
          <div className="text-[11px] text-slate-500">معتمدة ثنائية اللغة ar/en مع أزرار CTA</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>المحادثات المباشرة (2-Way)</span>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono">
            {contacts.filter((c) => c.is24hActive).length} نشطة
          </div>
          <div className="text-[11px] text-blue-600 font-bold">داخل نافذة الـ 24 ساعة التفاعلية</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>قواعد الأتمتة المربوطة بالأحداث</span>
            <Layers className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-700 font-mono">
            {rules.filter((r) => r.isActive).length} قواعد
          </div>
          <div className="text-[11px] text-slate-500">تكامل غير مباشر عبر Event Dispatcher</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'chat'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>لوحة المحادثات المباشرة (2-Way Chat Panel & 24h Window)</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'rules'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>قواعد الأتمتة وموزع الأحداث (Event Dispatcher Rules)</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'templates'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>مكتبة قوالب Meta المعتمدة ({whatsAppTemplates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'logs'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>سجل الرسائل والـ Webhook Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات Meta Cloud API والامتثال (+20 Normalizer)</span>
        </button>
      </div>

      {/* TAB 1: 2-WAY INTERACTIVE CHAT PANEL */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Contacts Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[700px] overflow-hidden">
            <div className="p-4 border-b border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-600" />
                  <span>محادثات العملاء والشركاء</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  {contacts.filter((c) => c.is24hActive).length} نشطة 24h
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث باسم العميل أو الشركة أو الهاتف..."
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  className="w-full pr-8 pl-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredContacts.map((contact) => {
                const isSelected = contact.id === selectedContact.id;
                return (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    className={`w-full p-3.5 text-right transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected ? 'bg-emerald-50/60 border-r-4 border-emerald-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                        {contact.nameAr.slice(0, 2)}
                      </div>
                      {contact.is24hActive && !contact.optedOut ? (
                        <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 left-0" />
                      ) : (
                        <span className="w-3 h-3 rounded-full bg-amber-400 border-2 border-white absolute bottom-0 left-0" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-black text-slate-900 truncate">{contact.nameAr}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{contact.lastMessageTime}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate font-medium">{contact.companyAr}</p>
                      <p className="text-[11px] text-slate-600 truncate mt-1">{contact.lastMessage}</p>

                      <div className="flex items-center gap-2 mt-1.5">
                        {contact.optedOut ? (
                          <span className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                            ملغى الاشتراك STOP
                          </span>
                        ) : contact.is24hActive ? (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>باقي {contact.hoursRemaining} ساعة</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            خارج نافذة 24h
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-slate-400">{contact.phone}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[700px] overflow-hidden">
            {/* Chat Top Header */}
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {selectedContact.nameAr.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">{selectedContact.nameAr}</h3>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {selectedContact.normalizedPhone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{selectedContact.companyAr}</span>
                    <span>•</span>
                    <span>{selectedContact.roleAr}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedContact.is24hActive && !selectedContact.optedOut ? (
                  <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-emerald-800 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>نافذة الـ 24 ساعة نشطة (متبقي {selectedContact.hoursRemaining} ساعة)</span>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-800 text-[11px] font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>خارج نافذة 24 ساعة - يلزم قالب Meta معتمد</span>
                  </div>
                )}

                <button
                  onClick={() => setIsDocDrawerOpen(!isDocDrawerOpen)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    isDocDrawerOpen
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>مستندات العميل ({selectedContact.linkedDocs.length})</span>
                </button>
              </div>
            </div>

            {/* Collapsible Documents Drawer */}
            {isDocDrawerOpen && (
              <div className="bg-slate-100 p-3.5 border-b border-slate-200 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>المستندات المرتبطة بهذا العميل (توليد روابط بوابة معتمدة):</span>
                  </span>
                  <button
                    onClick={() => setIsDocDrawerOpen(false)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    إغلاق اللوحة
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedContact.linkedDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div>
                        <div className="font-black text-slate-900 flex items-center gap-1.5">
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono font-bold">
                            {doc.type}
                          </span>
                          <span>#{doc.no}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{doc.title}</p>
                        {doc.amount && (
                          <p className="text-[11px] font-mono font-bold text-emerald-700">
                            {doc.amount.toLocaleString()} ج.م
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleGenerateSignedLink(doc)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>رابط توقيع رقمي</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Timeline (WhatsApp Style) */}
            <div
              className="flex-1 p-4 overflow-y-auto space-y-3"
              style={{
                backgroundColor: '#efeae2',
                backgroundImage:
                  'radial-gradient(circle, #00000008 10%, transparent 11%)',
                backgroundSize: '16px 16px',
              }}
            >
              {/* WhatsApp Encryption Banner */}
              <div className="flex justify-center">
                <div className="bg-amber-50/95 border border-amber-200/80 text-amber-900 text-[10px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold shadow-2xs max-w-md text-center">
                  <Lock className="w-3 h-3 text-amber-700 shrink-0" />
                  <span>الرسائل مشفرة عبر Meta Cloud WhatsApp Business API الرسمي لشركة إيجيبت كرينز.</span>
                </div>
              </div>

              {/* Messages list */}
              {messages.map((msg) => {
                const isOutbound = msg.direction.includes('Outbound') || msg.direction.includes('صادر');
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOutbound ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 shadow-2xs relative text-xs ${
                        isOutbound
                          ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                          : 'bg-white text-slate-900 rounded-tl-none'
                      }`}
                    >
                      {msg.isTemplate && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md mb-1.5 w-fit">
                          <Sparkles className="w-3 h-3" />
                          <span>قالب Meta معتمد</span>
                        </div>
                      )}

                      <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                      {/* If has signed link */}
                      {msg.signedPortalLink && (
                        <div className="mt-2 p-2 bg-white/90 rounded-xl border border-emerald-300 text-[11px] space-y-1">
                          <div className="flex items-center justify-between font-bold text-emerald-800">
                            <span>بوابة إيجيبت كرينز الرقمية (Signed Portal)</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                          <a
                            href={msg.signedPortalLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline font-mono text-[10px] block truncate"
                            dir="ltr"
                          >
                            {msg.signedPortalLink}
                          </a>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[10px] text-slate-400 font-mono">
                        <span>{msg.timestamp.slice(11, 16)}</span>
                        {isOutbound && (
                          <span className="text-blue-600">
                            <CheckCheck className="w-3.5 h-3.5 inline" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Template Selector Bar (especially useful if outside 24h) */}
            <div className="px-3.5 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-bold shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>إرسال قالب رسمي:</span>
              </div>
              <div className="flex items-center gap-2 flex-1 overflow-x-auto pb-0.5">
                {whatsAppTemplates.slice(0, 4).map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSendTemplateFromChat(tmpl.id)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-purple-500 hover:bg-purple-50 text-slate-700 text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all shadow-2xs"
                  >
                    {tmpl.titleAr}
                  </button>
                ))}
              </div>
            </div>

            {/* Webhook Quick Test Responder */}
            <div className="px-3.5 py-1.5 bg-amber-50/70 border-t border-amber-200/80 flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-amber-700" />
                <span>محاكي رد العميل عبر Webhook:</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSimulateInboundWebhook('تم استلام رابط العقد وجارٍ التوقيع الإلكتروني.')}
                  className="px-2 py-0.5 rounded bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold cursor-pointer"
                >
                  "تأكيد استلام العقد"
                </button>
                <button
                  onClick={() => handleSimulateInboundWebhook('تم إيداع مبلغ الشيك المستحق في حساب CIB.')}
                  className="px-2 py-0.5 rounded bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold cursor-pointer"
                >
                  "تأكيد رصيد الشيك"
                </button>
                <button
                  onClick={() => handleSimulateInboundWebhook('STOP')}
                  className="px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-800 hover:bg-red-200 font-bold cursor-pointer"
                >
                  اختبار أمر "STOP / قف"
                </button>
              </div>
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  selectedContact.optedOut
                    ? 'المستلم قام بإلغاء الاشتراك STOP - تم حظر المراسلات.'
                    : selectedContact.is24hActive
                    ? 'اكتب رسالتك المباشرة هنا (داخل نافذة الـ 24 ساعة)...'
                    : 'خارج نافذة 24 ساعة - اختر قالباً معتمداً من الشريط أعلاه.'
                }
                disabled={!selectedContact.is24hActive || selectedContact.optedOut}
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-600 disabled:bg-slate-100 disabled:text-slate-400"
              />

              <button
                type="submit"
                disabled={!selectedContact.is24hActive || selectedContact.optedOut || !typedMessage.trim()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>إرسال</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: RULES & EVENT DISPATCHER AUTOMATION */}
      {activeTab === 'rules' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-600" />
                <span>قواعد الأتمتة المربوطة بموزع الأحداث (Event Dispatcher Rules)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                تكامل غير مباشر (Decoupled Architecture): عند وقوع حدث في أي موديول (الشيكات، الفواتير، العقود، السلامة) يتم تشغيل القاعدة وتوجيه الرسائل آلياً مع التحويل لـ SMS عند تعذر واتساب.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl font-mono">
                8 قواعد مفعلة
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs hover:border-slate-300 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="text-sm font-black text-slate-900">{rule.ruleNameAr}</h4>
                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      {rule.relatedDocType || 'مستند نظام'}
                    </span>
                  </div>

                  <p className="text-slate-600">
                    <span className="text-slate-400 font-bold">الحدث المحرك:</span>{' '}
                    <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded font-mono">
                      {rule.triggerEvent}
                    </span>{' '}
                    • <span className="text-slate-400 font-bold">المستلم:</span>{' '}
                    <span className="font-bold text-slate-800">{rule.targetRecipientType}</span>
                  </p>

                  <p className="text-slate-500 text-[11px]">
                    <span className="font-bold text-slate-600">شروط التوقف:</span> يتم إيقاف الإرسال التلقائي فوراً في حال إلغاء العميل للاشتراك (STOP)، أو سداد الفاتورة مسبقاً، أو إلغاء الشيك.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Channel Priority */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">سلسلة القنوات (Failover):</span>
                    <div className="flex items-center gap-1.5">
                      {rule.channelPriority.map((ch, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold text-[11px] shadow-2xs"
                        >
                          {idx === 0 ? '1. واتساب (أساسي)' : `${idx + 1}. ${ch} (بديل)`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Test Event Button */}
                  <button
                    onClick={() => handleTestRuleEvent(rule)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs transition-all shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>محاكاة الحدث</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: META APPROVED TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>مكتبة قوالب Meta WhatsApp Business المعتمدة رسمياً</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                قوالب ثنائية اللغة (عربي / إنجليزي) معتمدة من Meta لإشعارات المعاملات والخدمات، مع المتغيرات الديناميكية وأزرار الروابط السريعة (CTA).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>كافة القوالب معتمدة (Approved by Meta)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {whatsAppTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{tmpl.titleAr}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{tmpl.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                        {tmpl.category}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>معتمد</span>
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Preview Card */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 shadow-2xs font-sans">
                    {tmpl.headerText && (
                      <div className="font-black text-slate-900 border-b border-slate-100 pb-1.5">
                        {tmpl.headerText}
                      </div>
                    )}
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{tmpl.bodyText}</p>
                    {tmpl.footerText && (
                      <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-100">
                        {tmpl.footerText}
                      </div>
                    )}

                    {/* Buttons */}
                    {tmpl.buttons && tmpl.buttons.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        {tmpl.buttons.map((btn, bIdx) => (
                          <div
                            key={bIdx}
                            className="w-full py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200 text-center font-bold text-emerald-700 text-xs flex items-center justify-center gap-1.5"
                          >
                            {btn.type === 'URL' && <ExternalLink className="w-3 h-3" />}
                            {btn.type === 'PHONE_NUMBER' && <Phone className="w-3 h-3" />}
                            {btn.type === 'QUICK_REPLY' && <MessageSquare className="w-3 h-3" />}
                            <span>{btn.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Variables */}
                  <div className="text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700">المتغيرات الديناميكية: </span>
                    <div className="flex flex-wrap gap-1 mt-1 font-mono text-[10px]">
                      {tmpl.variables.map((v, idx) => (
                        <span key={idx} className="bg-slate-200/80 px-2 py-0.5 rounded text-slate-800">
                          {`{{${idx + 1}}}`}: {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">اللغة: {tmpl.language.toUpperCase()}</span>
                  <button
                    onClick={() => {
                      handleSendTemplateFromChat(tmpl.id);
                      setActiveTab('chat');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال للعميل النشط</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MESSAGE LOGS & WEBHOOK SANDBOX */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          {/* Webhook Sandbox Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-600" />
                  <span>محاكي استلام الـ Webhook التفاعلي (Inbound Webhook Sandbox)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  اختبار استلام ردود العملاء الحية، وتحديث حالة نافذة الـ 24 ساعة، واختبار أمر إلغاء الاشتراك STOP الفوري مع تسجيل التدقيق.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl">
                POST /api/webhooks/whatsapp
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
              <div className="sm:col-span-8">
                <label className="block font-bold text-slate-700 mb-1">
                  نص الرسالة الواردة من العميل ({selectedContact.nameAr}):
                </label>
                <input
                  type="text"
                  value={incomingSimText}
                  onChange={(e) => setIncomingSimText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="sm:col-span-4 flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateInboundWebhook()}
                  className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Bot className="w-4 h-4" />
                  <span>محاكاة استلام Webhook</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateInboundWebhook('STOP')}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  title="اختبار إلغاء الاشتراك الفوري"
                >
                  <XCircle className="w-4 h-4" />
                  <span>STOP</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full Audit Logs Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-600" />
                  <span>سجل الرسائل المرسلة وحالة التسليم (Message Audit Trail)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  سجل غير قابل للحذف لكافة الرسائل المرسلة والبدائل مع توثيق معرف الرسالة Message ID والمستند الأصلي.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                إجمالي: {logs.length} رسائل
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="py-2.5 px-3">التوقيت</th>
                    <th className="py-2.5 px-3">القناة</th>
                    <th className="py-2.5 px-3">المستلم</th>
                    <th className="py-2.5 px-3">رقم الهاتف</th>
                    <th className="py-2.5 px-3">محتوى الرسالة</th>
                    <th className="py-2.5 px-3">المستند المرتبط</th>
                    <th className="py-2.5 px-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            log.channel === 'WhatsApp'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                          }`}
                        >
                          {log.channel}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">{log.recipientNameAr}</td>
                      <td className="py-3 px-3 font-mono" dir="ltr">
                        {log.recipientPhone}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={log.messageContent}>
                        {log.messageContent}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                        {log.relatedDocType} #{log.relatedDocNo}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 w-fit">
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>{log.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS, COMPLIANCE & NORMALIZER */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Egyptian Phone Normalizer Tool */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>أداة التحقق وتطبيع أرقام الهواتف المصرية (+20 Normalizer)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                تطبيع تلقائي لأي صيغة هاتف مصري (010, 011, 012, 015) إلى الصيغة الدولية المعيارية (+20...)، وتحديد شركة الاتصالات، والتأكد من إمكانية استقبال واتساب.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  أدخل رقم الهاتف للاختبار (مثال: 01004567890 أو 012...):
                </label>
                <input
                  type="text"
                  value={testRawPhone}
                  onChange={(e) => setTestRawPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-left"
                  dir="ltr"
                />
              </div>

              {/* Normalization Result Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600">نتيجة التطبيع المعياري:</span>
                  {normalizerResult.isValid ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>رقم مصري معتمد</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      صيغة غير صحيحة
                    </span>
                  )}
                </div>

                <div className="text-base font-black font-mono text-emerald-800" dir="ltr">
                  {normalizerResult.normalized}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>شبكة المحمول: <strong className="text-slate-800">{normalizerResult.carrier}</strong></span>
                  <span>•</span>
                  <span>العرض: <strong className="font-mono text-slate-800" dir="ltr">{normalizerResult.formattedDisplay}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Cloud API Credentials */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                <span>بيانات الاعتماد الرسمية لـ Meta Cloud WhatsApp Business API</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                إعدادات الحساب الرسمي المعتمد لشركة مصر للمقاولات المتخصصة (إيجيبت كرينز).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Business Account ID (WABA)</label>
                <input
                  type="text"
                  value={waSettings.wabaId}
                  onChange={(e) => setWaSettings({ ...waSettings, wabaId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number ID</label>
                <input
                  type="text"
                  value={waSettings.phoneNumberId}
                  onChange={(e) => setWaSettings({ ...waSettings, phoneNumberId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">App Secret / System User Token</label>
                <div className="relative">
                  <input
                    type={waSettings.showSecret ? 'text' : 'password'}
                    value={waSettings.appSecret}
                    onChange={(e) => setWaSettings({ ...waSettings, appSecret: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-left"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setWaSettings({ ...waSettings, showSecret: !waSettings.showSecret })}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer text-xs"
                  >
                    {waSettings.showSecret ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Webhook Verify Token</label>
                <input
                  type="text"
                  value={waSettings.webhookVerifyToken}
                  onChange={(e) => setWaSettings({ ...waSettings, webhookVerifyToken: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Webhook Callback URL</label>
                <input
                  type="text"
                  value={waSettings.webhookCallbackUrl}
                  readOnly
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-left bg-slate-50 text-slate-600"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Quiet Hours & Compliance Policies */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>سياسة ساعات الهدوء والامتثال (Quiet Hours & Meta Compliance)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                تأجيل إرسال الإشعارات الترويجية والتذكيرات غير الحرجة خارج أوقات العمل الرسمية (10:00 مساءً حتى 08:00 صباحاً بتوقيت القاهرة).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold block">فترة الهدوء المعتمدة:</span>
                <div className="text-base font-black text-indigo-900 font-mono">
                  {waSettings.quietHoursStart} - {waSettings.quietHoursEnd}
                </div>
                <p className="text-[11px] text-slate-500">بتوقيت القاهرة الرسمي (EET)</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold block">تطبيق حظر الإرسال الليلي:</span>
                <label className="flex items-center gap-2 cursor-pointer pt-1 font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={waSettings.quietHoursEnforced}
                    onChange={(e) => setWaSettings({ ...waSettings, quietHoursEnforced: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span>تأجيل الرسائل حتى 08:00 صباحاً</span>
                </label>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold block">استثناء طوارئ السلامة والحوادث:</span>
                <label className="flex items-center gap-2 cursor-pointer pt-1 font-bold text-red-800">
                  <input
                    type="checkbox"
                    checked={waSettings.allowEmergencyBypass}
                    onChange={(e) => setWaSettings({ ...waSettings, allowEmergencyBypass: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600"
                  />
                  <span>السماح بتمرير إشعارات HSE العاجلة</span>
                </label>
              </div>
            </div>
          </div>

          {/* SMS Gateway Balance */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <span>بوابة الرسائل النصية القصيرة الاحتياطية (SMS Failover Gateway)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                اسم المرسل المسجل رسمياً ورصيد الحساب المخصص للتحويل التلقائي عند تعذر تسليم واتساب.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 block">اسم المرسل المعتمد (Sender ID):</span>
                <div className="text-base font-black text-red-600 font-mono">{smsSettings.senderId}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 block">رصيد الحساب الحالي:</span>
                <div className="text-base font-black text-slate-900 font-mono">
                  {smsSettings.balanceEGP.toLocaleString()} ج.م
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 block">تكلفة الرسالة:</span>
                <div className="text-base font-black text-slate-900 font-mono">{smsSettings.costPerSms} ج.م / جزء</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
