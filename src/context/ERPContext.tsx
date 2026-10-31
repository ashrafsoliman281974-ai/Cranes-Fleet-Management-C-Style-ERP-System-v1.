import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ModuleItem,
  SalesInvoice,
  GeneralLedgerEntry,
  RolePermission,
  ThemeConfig,
  LoginPageSettings,
  TranslationItem,
  InvoiceItem,
  JournalEntry,
  CostCenter,
  UserProfile,
  CraneContract,
  CraneGateLog,
  CraneOperationStatus,
  CraneBreakdownLog,
  SystemBackup,
  EgyptCraneFleetItem,
  ContractTermClause,
  UserRole,
  CashBox,
  TreasuryVoucher,
  ChequeItem,
  Warehouse,
  StockItem,
  StockVoucher,
  ItemCardEntry,
  FleetVehicleItem,
  OperatorItem,
  DailyOperationAssignment,
  OperatorScheduleEntry,
  DailyBreakdownTicket,
  ShiftSwapRecord,
  FinancialFilter,
  BudgetRecord,
  BudgetOverrideRequest,
  BudgetLevel,
  EquipmentCostingProfile,
  CraneMaintenanceEvent,
  MechanicTechnicianItem,
  MaintenanceStatus,
} from '../types/erp';
import {
  INITIAL_EQUIPMENT_COSTING,
  INITIAL_BUDGETS,
  INITIAL_BUDGET_OVERRIDES,
} from '../data/accountingEnterpriseData';
import {
  INITIAL_MODULES,
  THEME_PRESETS,
  INITIAL_LOGIN_SETTINGS,
  INITIAL_TRANSLATIONS,
  INITIAL_INVOICES,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_ROLE_PERMISSIONS,
  INITIAL_ROLES,
  INITIAL_COST_CENTERS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_USERS,
  INITIAL_CONTRACTS,
  INITIAL_EGYPT_CRANES_FLEET,
  INITIAL_GATE_LOGS,
  INITIAL_OPERATION_STATUSES,
  INITIAL_BREAKDOWN_LOGS,
  INITIAL_BACKUPS,
  STANDARD_CONTRACT_CLAUSES,
  INITIAL_CASH_BOXES,
  INITIAL_TREASURY_VOUCHERS,
  INITIAL_CHEQUES,
  INITIAL_WAREHOUSES,
  INITIAL_STOCK_ITEMS,
  INITIAL_STOCK_VOUCHERS,
  INITIAL_ITEM_CARD_ENTRIES,
  INITIAL_FLEET_VEHICLES,
  INITIAL_OPERATORS_DRIVERS,
  INITIAL_DAILY_OPERATIONS,
  INITIAL_OPERATOR_SCHEDULES,
  INITIAL_DAILY_BREAKDOWNS,
  INITIAL_SHIFT_SWAPS,
  INITIAL_MECHANICS,
  INITIAL_MAINTENANCE_EVENTS,
} from '../data/initialData';
import { gregorianToHijri, formatDateISO } from '../utils/hijri';
import { tafqeetArabic, tafqeetEnglish } from '../utils/tafqeet';

interface ERPContextType {
  // Navigation & View
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // Theme
  currentTheme: ThemeConfig;
  setThemeConfig: (theme: ThemeConfig) => void;
  applyPreset: (presetName: string) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;

  // In-Context Translation
  translations: TranslationItem[];
  isTranslationModalOpen: boolean;
  setIsTranslationModalOpen: (open: boolean) => void;
  editingTranslation: TranslationItem | null;
  setEditingTranslation: (item: TranslationItem | null) => void;
  saveTranslation: (orig: string, trans: string, ctx?: string) => void;
  t: (key: string, defaultAr: string, defaultEn?: string) => string;

  // Invoices
  invoices: SalesInvoice[];
  activeInvoice: SalesInvoice | null;
  setActiveInvoice: (inv: SalesInvoice | null) => void;
  saveInvoice: (invoice: Partial<SalesInvoice>) => SalesInvoice;
  submitInvoice: (id: string) => void;
  cancelInvoice: (id: string) => void;

  // General Ledger
  ledgerEntries: GeneralLedgerEntry[];

  // Current Active User & Persona
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;

  // Journal Entries & Maker-Checker Workflow
  journalEntries: JournalEntry[];
  activeJournalEntry: JournalEntry | null;
  setActiveJournalEntry: (entry: JournalEntry | null) => void;
  saveJournalEntry: (entry: Partial<JournalEntry>) => JournalEntry;
  submitJournalEntry: (id: string) => void;
  submitJournalEntryForApproval: (id: string) => void;
  approveJournalEntry: (id: string, notes?: string) => void;
  rejectJournalEntry: (id: string, reason: string) => void;

  // Cost Centers
  costCenters: CostCenter[];
  saveCostCenter: (cc: CostCenter) => void;
  deleteCostCenter: (id: string) => boolean;

  // Users
  users: UserProfile[];
  saveUser: (user: UserProfile) => void;

  // Contracts
  contracts: CraneContract[];
  activeContract: CraneContract | null;
  setActiveContract: (cnt: CraneContract | null) => void;
  saveContract: (contract: CraneContract) => void;

  // Gate & Operations & Breakdowns
  gateLogs: CraneGateLog[];
  addGateLog: (log: Omit<CraneGateLog, 'id' | 'logNo'>) => void;
  operationsStatuses: CraneOperationStatus[];
  updateCraneStatus: (id: string, status: CraneOperationStatus['currentStatus'], location?: string) => void;
  breakdownLogs: CraneBreakdownLog[];
  addBreakdownLog: (bLog: Omit<CraneBreakdownLog, 'id' | 'ticketNo'>) => void;
  updateBreakdownStatus: (id: string, status: CraneBreakdownLog['status'], actionTaken?: string) => void;

  // Fleet
  fleet: EgyptCraneFleetItem[];

  // Backups
  backups: SystemBackup[];
  createBackup: (type?: 'يدوي' | 'تلقائي مجدول') => SystemBackup;
  restoreBackup: (backupJson: string) => boolean;

  // Roles & Permissions
  roles: UserRole[];
  addRole: (newRole: {
    nameAr: string;
    nameEn?: string;
    descriptionAr?: string;
    departmentAr?: string;
    canApproveFinanceDefault?: boolean;
    canIssueGatePermitsDefault?: boolean;
    copyFromRole?: string;
  }) => UserRole;
  deleteRole: (id: string) => void;
  permissions: RolePermission[];
  togglePermission: (id: string, field: keyof RolePermission) => void;
  addPermissionRule: (rule: Omit<RolePermission, 'id'>) => RolePermission;

  // Login Page Settings
  loginSettings: LoginPageSettings;
  updateLoginSettings: (settings: Partial<LoginPageSettings>) => void;

  // Toast / Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Treasury, Safes & Vouchers (QR)
  cashBoxes: CashBox[];
  saveCashBox: (box: CashBox) => void;
  treasuryVouchers: TreasuryVoucher[];
  activeTreasuryVoucher: TreasuryVoucher | null;
  setActiveTreasuryVoucher: (v: TreasuryVoucher | null) => void;
  saveTreasuryVoucher: (voucher: Omit<TreasuryVoucher, 'id' | 'voucherNo' | 'qrPayload'>) => TreasuryVoucher;
  cancelTreasuryVoucher: (id: string) => void;

  // Cheque Portfolio Tracker
  cheques: ChequeItem[];
  updateChequeStatus: (
    id: string,
    newStatus: ChequeItem['status'],
    extra?: {
      transferredToSupplierAr?: string;
      bounceReasonAr?: string;
      depositBankAr?: string;
    }
  ) => void;
  addCheque: (cheque: Omit<ChequeItem, 'id'>) => ChequeItem;

  // Warehouses & Stock Items (Barcode, QR, Image, Item Card)
  warehouses: Warehouse[];
  saveWarehouse: (wh: Warehouse) => void;
  stockItems: StockItem[];
  saveStockItem: (item: StockItem) => void;
  stockVouchers: StockVoucher[];
  activeStockVoucher: StockVoucher | null;
  setActiveStockVoucher: (v: StockVoucher | null) => void;
  saveStockVoucher: (voucher: Omit<StockVoucher, 'id' | 'voucherNo' | 'qrPayload'>) => StockVoucher;
  itemCardEntries: ItemCardEntry[];

  // Daily Operations, Fleet Vehicles, Shifts, Monthly Roster & Daily Breakdowns
  dailyOperations: DailyOperationAssignment[];
  saveDailyOperation: (op: Partial<DailyOperationAssignment> & { id?: string }) => void;
  deleteDailyOperation: (id: string) => void;
  fleetVehicles: FleetVehicleItem[];
  saveFleetVehicle: (veh: FleetVehicleItem) => void;
  operators: OperatorItem[];
  saveOperator: (op: OperatorItem) => void;
  operatorSchedules: OperatorScheduleEntry[];
  updateOperatorShift: (id: string, shiftType: OperatorScheduleEntry['shiftType'], notes?: string) => void;
  swapOperatorShifts: (swapData: {
    operatorAId: string;
    operatorBId: string;
    shiftADate: string;
    shiftBDate: string;
    reasonAr: string;
  }) => boolean;
  dailyBreakdowns: DailyBreakdownTicket[];
  saveDailyBreakdown: (ticket: Partial<DailyBreakdownTicket> & { id?: string }) => void;
  shiftSwaps: ShiftSwapRecord[];

  // Financial Statements & Period Filtering
  financialFilter: FinancialFilter;
  setFinancialFilter: (filter: FinancialFilter) => void;

  // Equipment Hourly Costing
  equipmentCostings: EquipmentCostingProfile[];
  saveEquipmentCosting: (profile: EquipmentCostingProfile) => void;

  // Multi-Level Budgeting & Approval Override Workflow
  budgets: BudgetRecord[];
  saveBudgetRecord: (budget: BudgetRecord) => void;
  budgetOverrides: BudgetOverrideRequest[];
  requestBudgetOverride: (req: Omit<BudgetOverrideRequest, 'id' | 'requestNo' | 'status'>) => BudgetOverrideRequest;
  approveBudgetOverride: (id: string, approvalRemarks?: string) => boolean;
  rejectBudgetOverride: (id: string, reason: string) => boolean;
  checkBudgetConstraint: (level: BudgetLevel, targetNameOrCode: string, transactionAmount: number) => {
    isExceeded: boolean;
    budgetRecord?: BudgetRecord;
    amountOverBudget: number;
    allowProceed: boolean;
    warningMessage?: string;
  };

  // Fleet Maintenance Tracking & Mechanic Assignment
  maintenanceEvents: CraneMaintenanceEvent[];
  mechanics: MechanicTechnicianItem[];
  saveMaintenanceEvent: (event: Partial<CraneMaintenanceEvent> & { id?: string }) => CraneMaintenanceEvent;
  deleteMaintenanceEvent: (id: string) => boolean;
  updateMaintenanceStatus: (id: string, status: MaintenanceStatus, notes?: string) => void;
  saveMechanic: (mechanic: MechanicTechnicianItem) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeModuleId, setActiveModuleId] = useState<string>('fleet');
  const [activeView, setActiveView] = useState<string>('workspace');
  const [language, setLanguageState] = useState<'ar' | 'en'>('ar');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Theme
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('cstyle_theme');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return THEME_PRESETS[2]; // Egypt Cranes Royal Red by default
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Translations
  const [translations, setTranslations] = useState<TranslationItem[]>(() => {
    const saved = localStorage.getItem('cstyle_translations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_TRANSLATIONS;
  });
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<TranslationItem | null>(null);

  // Invoices & Ledger
  const [invoices, setInvoices] = useState<SalesInvoice[]>(() => {
    const saved = localStorage.getItem('cstyle_invoices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_INVOICES;
  });
  const [activeInvoice, setActiveInvoice] = useState<SalesInvoice | null>(null);

  const [ledgerEntries, setLedgerEntries] = useState<GeneralLedgerEntry[]>(() => {
    const saved = localStorage.getItem('cstyle_ledger');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_LEDGER_ENTRIES;
  });

  // Journal Entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('cstyle_journal_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_JOURNAL_ENTRIES;
  });
  const [activeJournalEntry, setActiveJournalEntry] = useState<JournalEntry | null>(null);

  // Cost Centers
  const [costCenters, setCostCenters] = useState<CostCenter[]>(() => {
    const saved = localStorage.getItem('cstyle_cost_centers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_COST_CENTERS;
  });

  // Users & Active Persona
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('cstyle_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cstyle_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_USERS[1]; // Ashraf Soliman (CFO - Approver) by default
  });

  const setCurrentUser = (user: UserProfile) => {
    setCurrentUserState(user);
    localStorage.setItem('cstyle_current_user', JSON.stringify(user));
    showToast(`تم التبديل إلى المستخدم: ${user.nameAr} (${user.roleAr})`);
  };

  // Contracts
  const [contracts, setContracts] = useState<CraneContract[]>(() => {
    const saved = localStorage.getItem('cstyle_contracts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_CONTRACTS;
  });
  const [activeContract, setActiveContract] = useState<CraneContract | null>(null);

  // Fleet
  const [fleet] = useState<EgyptCraneFleetItem[]>(INITIAL_EGYPT_CRANES_FLEET);

  // Gate Logs
  const [gateLogs, setGateLogs] = useState<CraneGateLog[]>(() => {
    const saved = localStorage.getItem('cstyle_gate_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_GATE_LOGS;
  });

  // Operations Statuses
  const [operationsStatuses, setOperationsStatuses] = useState<CraneOperationStatus[]>(() => {
    const saved = localStorage.getItem('cstyle_ops_statuses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_OPERATION_STATUSES;
  });

  // Breakdowns
  const [breakdownLogs, setBreakdownLogs] = useState<CraneBreakdownLog[]>(() => {
    const saved = localStorage.getItem('cstyle_breakdowns');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_BREAKDOWN_LOGS;
  });

  // Backups
  const [backups, setBackups] = useState<SystemBackup[]>(() => {
    const saved = localStorage.getItem('cstyle_backups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_BACKUPS;
  });

  // Roles, Permissions & Settings
  const [roles, setRoles] = useState<UserRole[]>(() => {
    const saved = localStorage.getItem('cstyle_roles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_ROLES;
  });

  const [permissions, setPermissions] = useState<RolePermission[]>(() => {
    const saved = localStorage.getItem('cstyle_permissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_ROLE_PERMISSIONS;
  });

  const [loginSettings, setLoginSettings] = useState<LoginPageSettings>(() => {
    const saved = localStorage.getItem('cstyle_login_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_LOGIN_SETTINGS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync Theme CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', currentTheme.primaryColor);
    root.style.setProperty('--primary-hover', currentTheme.primaryHover);
    root.style.setProperty('--primary-light', currentTheme.primaryLight);
    root.style.setProperty('--accent-metallic', currentTheme.accentMetallic);
    root.style.setProperty('--sidebar-dark-bg', currentTheme.sidebarDarkBg);
    localStorage.setItem('cstyle_theme', JSON.stringify(currentTheme));
  }, [currentTheme]);

  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    showToast(lang === 'ar' ? 'تم تحويل الواجهة إلى العربية' : 'Language switched to English');
  };

  const setThemeConfig = (newTheme: ThemeConfig) => {
    setCurrentTheme(newTheme);
    showToast(`تم تطبيق النمط: ${newTheme.presetName}`);
  };

  const applyPreset = (presetName: string) => {
    const found = THEME_PRESETS.find((p) => p.presetName === presetName);
    if (found) {
      setThemeConfig(found);
    }
  };

  const saveTranslation = (orig: string, trans: string, ctx = 'General') => {
    setTranslations((prev) => {
      const idx = prev.findIndex((t) => t.originalText.toLowerCase() === orig.toLowerCase());
      let updated: TranslationItem[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = { ...updated[idx], translatedText: trans, context: ctx };
      } else {
        const newItem: TranslationItem = {
          id: `tr-${Date.now()}`,
          originalText: orig,
          translatedText: trans,
          context: ctx,
        };
        updated = [...prev, newItem];
      }
      localStorage.setItem('cstyle_translations', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حفظ وتحديث الترجمة: "${trans}"`);
  };

  const t = (key: string, defaultAr: string, defaultEn?: string): string => {
    if (language === 'en' && defaultEn) return defaultEn;
    const match = translations.find((item) => item.originalText.toLowerCase() === key.toLowerCase());
    if (match) return match.translatedText;
    return defaultAr;
  };

  // Invoices Handlers
  const saveInvoice = (partial: Partial<SalesInvoice>): SalesInvoice => {
    const today = new Date();
    const todayISO = formatDateISO(today);
    const hijri = gregorianToHijri(partial.postingDate || todayISO);
    const dueHijri = gregorianToHijri(partial.dueDate || todayISO);

    const items: InvoiceItem[] = partial.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.rate * (1 - item.discountPercent / 100)), 0);
    const taxPercent = partial.taxPercent !== undefined ? partial.taxPercent : 14;
    const taxAmount = (subtotal * taxPercent) / 100;
    const grandTotal = subtotal + taxAmount;
    const paidAmount = partial.paidAmount || 0;
    const outstandingAmount = Math.max(0, grandTotal - paidAmount);
    const currency = partial.currency || 'EGP';

    const fullInvoice: SalesInvoice = {
      id: partial.id || `inv-${Date.now()}`,
      invoiceNo: partial.invoiceNo || `ACC-SINV-${today.getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`,
      customerNameAr: partial.customerNameAr || 'عميل نقدي عام',
      customerNameEn: partial.customerNameEn || 'General Cash Customer',
      postingDate: partial.postingDate || todayISO,
      dueDate: partial.dueDate || todayISO,
      hijriPostingDate: hijri.formattedAr,
      hijriDueDate: dueHijri.formattedAr,
      currency,
      status: partial.status || 'مسودة',
      items,
      subtotal,
      taxPercent,
      taxAmount,
      grandTotal,
      paidAmount,
      outstandingAmount,
      amountInWordsAr: tafqeetArabic(grandTotal, currency),
      amountInWordsEn: tafqeetEnglish(grandTotal, currency),
      paymentTermsAr: partial.paymentTermsAr || 'السداد نقداً عند الاستلام',
      paymentTermsEn: partial.paymentTermsEn || 'Cash on receipt',
      customerAddressAr: partial.customerAddressAr || '',
      contactPersonAr: partial.contactPersonAr || '',
      remarksAr: partial.remarksAr || '',
    };

    setInvoices((prev) => {
      const idx = prev.findIndex((i) => i.id === fullInvoice.id);
      let updated: SalesInvoice[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = fullInvoice;
      } else {
        updated = [fullInvoice, ...prev];
      }
      localStorage.setItem('cstyle_invoices', JSON.stringify(updated));
      return updated;
    });

    showToast(`تم حفظ الفاتورة بنجاح: ${fullInvoice.invoiceNo}`);
    return fullInvoice;
  };

  const submitInvoice = (id: string) => {
    setInvoices((prev) => {
      const updated = prev.map((inv) => (inv.id === id ? { ...inv, status: 'معتمدة' as const } : inv));
      localStorage.setItem('cstyle_invoices', JSON.stringify(updated));
      return updated;
    });

    const target = invoices.find((i) => i.id === id);
    if (target) {
      const gle: GeneralLedgerEntry = {
        id: `gle-${Date.now()}`,
        postingDate: target.postingDate,
        accountAr: '1310 - ذمم العملاء المدينة',
        accountEn: '1310 - Accounts Receivable',
        debit: target.grandTotal,
        credit: 0,
        balance: target.grandTotal,
        voucherTypeAr: 'فاتورة بيع',
        voucherNo: target.invoiceNo,
        partyNameAr: target.customerNameAr,
        remarksAr: `اعتماد فاتورة مبيعات وتأجير ${target.invoiceNo}`,
      };
      setLedgerEntries((lPrev) => {
        const nLedger = [gle, ...lPrev];
        localStorage.setItem('cstyle_ledger', JSON.stringify(nLedger));
        return nLedger;
      });
    }

    showToast('تم اعتماد الفاتورة وتوليد قيود دفتر الأستاذ العام تلقائياً');
  };

  const cancelInvoice = (id: string) => {
    setInvoices((prev) => {
      const updated = prev.map((inv) => (inv.id === id ? { ...inv, status: 'ملغاة' as const } : inv));
      localStorage.setItem('cstyle_invoices', JSON.stringify(updated));
      return updated;
    });
    showToast('تم إلغاء الفاتورة');
  };

  // Journal Entries Handlers (Maker-Checker Workflow)
  const saveJournalEntry = (partial: Partial<JournalEntry>): JournalEntry => {
    const today = new Date();
    const todayISO = formatDateISO(today);
    const hijri = gregorianToHijri(partial.postingDate || todayISO);
    const lines = partial.lines || [];
    const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
    const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
    const difference = Math.abs(totalDebit - totalCredit);
    const currency = partial.currency || 'EGP';

    const fullEntry: JournalEntry = {
      id: partial.id || `jv-${Date.now()}`,
      entryNo: partial.entryNo || `JV-${today.getFullYear()}-${String(journalEntries.length + 1).padStart(4, '0')}`,
      postingDate: partial.postingDate || todayISO,
      hijriPostingDate: hijri.formattedAr,
      entryType: partial.entryType || 'قيد يومية عام',
      currency,
      lines,
      totalDebit,
      totalCredit,
      difference,
      status: partial.status || 'مسودة',
      remarksAr: partial.remarksAr || '',
      costCenterAr: partial.costCenterAr || '',
      amountInWordsAr: tafqeetArabic(totalDebit, currency),
      amountInWordsEn: tafqeetEnglish(totalDebit, currency),
      createdByUserId: partial.createdByUserId || currentUser.id,
      createdByUserNameAr: partial.createdByUserNameAr || currentUser.nameAr,
      approvedByUserId: partial.approvedByUserId,
      approvedByUserNameAr: partial.approvedByUserNameAr,
      approvedAt: partial.approvedAt,
      rejectionReason: partial.rejectionReason,
    };

    setJournalEntries((prev) => {
      const idx = prev.findIndex((j) => j.id === fullEntry.id);
      let updated: JournalEntry[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = fullEntry;
      } else {
        updated = [fullEntry, ...prev];
      }
      localStorage.setItem('cstyle_journal_entries', JSON.stringify(updated));
      return updated;
    });

    showToast(`تم حفظ قيد اليومية: ${fullEntry.entryNo}`);
    return fullEntry;
  };

  // Maker submits entry for approval
  const submitJournalEntryForApproval = (id: string) => {
    const target = journalEntries.find((j) => j.id === id);
    if (!target) return;
    if (target.difference !== 0) {
      showToast('خطأ: لا يمكن إرسال القيد للاعتماد لأن مجموع المدين لا يساوي مجموع الدائن!');
      return;
    }

    setJournalEntries((prev) => {
      const updated = prev.map((j) =>
        j.id === id
          ? {
              ...j,
              status: 'بانتظار الاعتماد' as const,
              createdByUserId: currentUser.id,
              createdByUserNameAr: currentUser.nameAr,
              rejectionReason: undefined,
            }
          : j
      );
      localStorage.setItem('cstyle_journal_entries', JSON.stringify(updated));
      return updated;
    });

    showToast(`تم إرسال القيد ${target.entryNo} للاعتماد المالي بنجاح!`);
  };

  // Approver checks and approves the entry (posts to General Ledger)
  const approveJournalEntry = (id: string, notes?: string) => {
    if (!currentUser.canApproveFinance) {
      showToast('تنبيه أمني: ليس لديك صلاحية اعتماد وترحيل القيود المالية! هذه الصلاحية للمدير المالي أو المدير العام فقط.');
      return;
    }

    const target = journalEntries.find((j) => j.id === id);
    if (!target) return;
    if (target.difference !== 0) {
      showToast('خطأ محاسبي: لا يمكن اعتماد القيد لأن مجموع المدين لا يساوي مجموع الدائن!');
      return;
    }

    const now = new Date();
    const approvedAtStr = `${formatDateISO(now)} ${now.toLocaleTimeString()}`;

    setJournalEntries((prev) => {
      const updated = prev.map((j) =>
        j.id === id
          ? {
              ...j,
              status: 'معتمد ومرحل' as const,
              approvedByUserId: currentUser.id,
              approvedByUserNameAr: currentUser.nameAr,
              approvedAt: approvedAtStr,
              rejectionReason: undefined,
              remarksAr: notes ? `${j.remarksAr} (ملاحظة الاعتماد: ${notes})` : j.remarksAr,
            }
          : j
      );
      localStorage.setItem('cstyle_journal_entries', JSON.stringify(updated));
      return updated;
    });

    // Generate Ledger Entries automatically
    const newGLEntries: GeneralLedgerEntry[] = target.lines.map((line, idx) => ({
      id: `gle-jv-${target.id}-${idx}`,
      postingDate: target.postingDate,
      accountAr: line.accountAr,
      accountEn: line.accountEn,
      debit: line.debit,
      credit: line.credit,
      balance: line.debit > 0 ? line.debit : -line.credit,
      voucherTypeAr: target.entryType,
      voucherNo: target.entryNo,
      partyNameAr: line.partyNameAr || line.costCenterAr || line.linkedClient || 'قيد محاسبي معتمد',
      remarksAr: `${target.remarksAr} - ${line.lineRemark || ''} (معتمد من: ${currentUser.nameAr})`,
    }));

    setLedgerEntries((prev) => {
      const updated = [...newGLEntries, ...prev];
      localStorage.setItem('cstyle_ledger', JSON.stringify(updated));
      return updated;
    });

    showToast(`تم اعتماد وترحيل قيد اليومية رقم ${target.entryNo} بنجاح لدفتر الأستاذ العام بواسطة ${currentUser.nameAr}!`);
  };

  // Approver rejects entry with reason
  const rejectJournalEntry = (id: string, reason: string) => {
    if (!currentUser.canApproveFinance) {
      showToast('تنبيه: ليس لديك صلاحية رفض أو اعتماد القيود.');
      return;
    }
    if (!reason.trim()) {
      showToast('يرجى كتابة سبب رفض القيد لتوضيحه للمنفذ.');
      return;
    }

    const target = journalEntries.find((j) => j.id === id);
    if (!target) return;

    const now = new Date();
    const approvedAtStr = `${formatDateISO(now)} ${now.toLocaleTimeString()}`;

    setJournalEntries((prev) => {
      const updated = prev.map((j) =>
        j.id === id
          ? {
              ...j,
              status: 'مرفوض' as const,
              approvedByUserId: currentUser.id,
              approvedByUserNameAr: currentUser.nameAr,
              approvedAt: approvedAtStr,
              rejectionReason: reason,
            }
          : j
      );
      localStorage.setItem('cstyle_journal_entries', JSON.stringify(updated));
      return updated;
    });

    showToast(`تم رفض اعتماد قيد اليومية رقم ${target.entryNo} وإعادته للمنفذ للتعديل.`);
  };

  // Direct submit fallback (if user has finance approval rights, approves immediately)
  const submitJournalEntry = (id: string) => {
    if (currentUser.canApproveFinance) {
      approveJournalEntry(id);
    } else {
      submitJournalEntryForApproval(id);
    }
  };

  // Cost Centers Handlers
  const saveCostCenter = (cc: CostCenter) => {
    setCostCenters((prev) => {
      const idx = prev.findIndex((c) => c.id === cc.id);
      let updated: CostCenter[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = cc;
      } else {
        updated = [...prev, cc];
      }
      localStorage.setItem('cstyle_cost_centers', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حفظ وتحديث مركز التكلفة: ${cc.nameAr}`);
  };

  const deleteCostCenter = (id: string): boolean => {
    // Check if any child nodes exist
    const hasChildren = costCenters.some((c) => c.parentId === id);
    if (hasChildren) {
      showToast('تحذير: لا يمكن حذف مركز التكلفة لوجود مراكز وتفريعات فرعية تابعة له في الشجرة!');
      return false;
    }

    setCostCenters((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('cstyle_cost_centers', JSON.stringify(updated));
      return updated;
    });
    showToast('تم حذف مركز التكلفة بنجاح من الشجرة.');
    return true;
  };

  // Users Handlers
  const saveUser = (user: UserProfile) => {
    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.id === user.id);
      let updated: UserProfile[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = user;
      } else {
        updated = [...prev, user];
      }
      localStorage.setItem('cstyle_users', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حفظ وتحديث بيانات المستخدم: ${user.nameAr}`);
  };

  // Contracts Handlers
  const saveContract = (contract: CraneContract) => {
    setContracts((prev) => {
      const idx = prev.findIndex((c) => c.id === contract.id);
      let updated: CraneContract[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = contract;
      } else {
        updated = [contract, ...prev];
      }
      localStorage.setItem('cstyle_contracts', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حفظ عقد تشغيل الرافعة: ${contract.contractNo}`);
  };

  // Gate Logs Handlers
  const addGateLog = (logData: Omit<CraneGateLog, 'id' | 'logNo'>) => {
    const today = new Date();
    const newLog: CraneGateLog = {
      ...logData,
      id: `gt-${Date.now()}`,
      logNo: `GATE-${today.getFullYear()}-${String(gateLogs.length + 400).padStart(4, '0')}`,
    };
    setGateLogs((prev) => {
      const updated = [newLog, ...prev];
      localStorage.setItem('cstyle_gate_logs', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم تسجيل حركة البوابة بنجاح برقم: ${newLog.logNo}`);
  };

  // Operation Statuses
  const updateCraneStatus = (id: string, newStatus: CraneOperationStatus['currentStatus'], location?: string) => {
    setOperationsStatuses((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, currentStatus: newStatus, locationAr: location || s.locationAr } : s));
      localStorage.setItem('cstyle_ops_statuses', JSON.stringify(updated));
      return updated;
    });
    showToast('تم تحديث حالة تشغيل الرافعة على اللوحة اليومية');
  };

  // Breakdowns Handlers
  const addBreakdownLog = (data: Omit<CraneBreakdownLog, 'id' | 'ticketNo'>) => {
    const today = new Date();
    const newTicket: CraneBreakdownLog = {
      ...data,
      id: `bd-${Date.now()}`,
      ticketNo: `BRK-${today.getFullYear()}-${String(breakdownLogs.length + 35).padStart(4, '0')}`,
    };
    setBreakdownLogs((prev) => {
      const updated = [newTicket, ...prev];
      localStorage.setItem('cstyle_breakdowns', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم فتح بلاغ عطل وصيانة جديد برقم: ${newTicket.ticketNo}`);
  };

  const updateBreakdownStatus = (id: string, newStatus: CraneBreakdownLog['status'], actionTaken?: string) => {
    setBreakdownLogs((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, status: newStatus, actionTaken: actionTaken || b.actionTaken } : b));
      localStorage.setItem('cstyle_breakdowns', JSON.stringify(updated));
      return updated;
    });
    showToast('تم تحديث حالة أمر الإصلاح والصيانة');
  };

  // Backup & Restore
  const createBackup = (type: 'يدوي' | 'تلقائي مجدول' = 'يدوي'): SystemBackup => {
    const today = new Date();
    const hijri = gregorianToHijri(today);
    const backupSnapshot = {
      version: '16.0.0-CStyle',
      company: loginSettings.companyNameAr,
      timestamp: today.toISOString(),
      invoices,
      ledgerEntries,
      journalEntries,
      costCenters,
      users,
      contracts,
      gateLogs,
      operationsStatuses,
      breakdownLogs,
      permissions,
      loginSettings,
      translations,
      theme: currentTheme,
    };

    const jsonString = JSON.stringify(backupSnapshot, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const sizeKb = Math.round(blob.size / 1024);
    const filename = `egypt_cranes_backup_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}_${Date.now()}.json`;

    // Trigger browser file download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    const newBackupMeta: SystemBackup = {
      id: `bk-${Date.now()}`,
      filename,
      createdAt: `${formatDateISO(today)} ${today.toLocaleTimeString()}`,
      hijriCreatedAt: hijri.formattedAr,
      sizeKb,
      recordsCount: invoices.length + journalEntries.length + contracts.length + gateLogs.length,
      createdBy: 'المهندس أمير مانسي (مدير النظام)',
      type,
    };

    setBackups((prev) => {
      const updated = [newBackupMeta, ...prev];
      localStorage.setItem('cstyle_backups', JSON.stringify(updated));
      return updated;
    });

    showToast(`تم إنشاء وتنزيل النسخة الاحتياطية بنجاح: ${filename}`);
    return newBackupMeta;
  };

  const restoreBackup = (backupJson: string): boolean => {
    try {
      const data = JSON.parse(backupJson);
      if (data.invoices) setInvoices(data.invoices);
      if (data.ledgerEntries) setLedgerEntries(data.ledgerEntries);
      if (data.journalEntries) setJournalEntries(data.journalEntries);
      if (data.costCenters) setCostCenters(data.costCenters);
      if (data.users) setUsers(data.users);
      if (data.contracts) setContracts(data.contracts);
      if (data.gateLogs) setGateLogs(data.gateLogs);
      if (data.operationsStatuses) setOperationsStatuses(data.operationsStatuses);
      if (data.breakdownLogs) setBreakdownLogs(data.breakdownLogs);
      if (data.permissions) setPermissions(data.permissions);
      if (data.loginSettings) setLoginSettings(data.loginSettings);
      if (data.translations) setTranslations(data.translations);
      if (data.theme) setCurrentTheme(data.theme);

      showToast('تمت استعادة كافة بيانات النظام والمستندات بنجاح من النسخة الاحتياطية!');
      return true;
    } catch (e) {
      showToast('فشل في قراءة ملف النسخة الاحتياطية: تأكد من صحة ملف JSON.');
      return false;
    }
  };

  const addRole = (newRoleData: {
    nameAr: string;
    nameEn?: string;
    descriptionAr?: string;
    departmentAr?: string;
    canApproveFinanceDefault?: boolean;
    canIssueGatePermitsDefault?: boolean;
    copyFromRole?: string;
  }): UserRole => {
    const newRole: UserRole = {
      id: `role-${Date.now()}`,
      nameAr: newRoleData.nameAr.trim(),
      nameEn: newRoleData.nameEn?.trim() || newRoleData.nameAr.trim(),
      descriptionAr: newRoleData.descriptionAr || '',
      departmentAr: newRoleData.departmentAr || 'إدارة العمليات',
      isCustom: true,
      canApproveFinanceDefault: Boolean(newRoleData.canApproveFinanceDefault),
      canIssueGatePermitsDefault: Boolean(newRoleData.canIssueGatePermitsDefault),
    };

    setRoles((prev) => {
      const updated = [...prev, newRole];
      localStorage.setItem('cstyle_roles', JSON.stringify(updated));
      return updated;
    });

    // Auto-generate DocType permission rules for this role
    const defaultDocTypes = [
      { ar: 'Crane Contract (عقد تأجير رافعة)', en: 'Crane Contract' },
      { ar: 'Journal Entry (قيد يومية)', en: 'Journal Entry' },
      { ar: 'Crane Gate Log (تصريح بوابة الونش)', en: 'Crane Gate Log' },
      { ar: 'Cost Center (مركز تكلفة)', en: 'Cost Center' },
      { ar: 'Sales Invoice (فاتورة مبيعات)', en: 'Sales Invoice' },
      { ar: 'Breakdown Ticket (بلاغ عطل رافعة)', en: 'Breakdown Ticket' },
    ];

    let generatedPerms: RolePermission[] = [];
    if (newRoleData.copyFromRole) {
      const sourcePerms = permissions.filter((p) => p.roleAr === newRoleData.copyFromRole);
      if (sourcePerms.length > 0) {
        generatedPerms = sourcePerms.map((sp, idx) => ({
          ...sp,
          id: `rp-${Date.now()}-${idx}`,
          roleAr: newRole.nameAr,
          roleEn: newRole.nameEn,
        }));
      }
    }

    if (generatedPerms.length === 0) {
      generatedPerms = defaultDocTypes.map((dt, idx) => ({
        id: `rp-${Date.now()}-${idx}`,
        docTypeAr: dt.ar,
        docTypeEn: dt.en,
        roleAr: newRole.nameAr,
        roleEn: newRole.nameEn,
        read: true,
        write: Boolean(newRoleData.canApproveFinanceDefault),
        create: true,
        delete: false,
        submit: Boolean(newRoleData.canApproveFinanceDefault),
        cancel: false,
        amend: false,
        onlyIfCreator: !newRoleData.canApproveFinanceDefault,
      }));
    }

    setPermissions((prev) => {
      const updated = [...generatedPerms, ...prev];
      localStorage.setItem('cstyle_permissions', JSON.stringify(updated));
      return updated;
    });

    showToast(`تم إنشاء وإضافة الدور الوظيفي بنجاح: ${newRole.nameAr}`);
    return newRole;
  };

  const deleteRole = (roleId: string) => {
    const target = roles.find((r) => r.id === roleId);
    if (!target) return;
    const assignedUsers = users.filter((u) => u.roleAr === target.nameAr);
    if (assignedUsers.length > 0) {
      showToast(`تحذير: لا يمكن حذف الدور لوجود ${assignedUsers.length} مستخدم مسند إليهم هذا الدور!`);
      return;
    }
    setRoles((prev) => {
      const updated = prev.filter((r) => r.id !== roleId);
      localStorage.setItem('cstyle_roles', JSON.stringify(updated));
      return updated;
    });
    setPermissions((prev) => {
      const updated = prev.filter((p) => p.roleAr !== target.nameAr);
      localStorage.setItem('cstyle_permissions', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حذف الدور الوظيفي: ${target.nameAr}`);
  };

  const addPermissionRule = (ruleData: Omit<RolePermission, 'id'>): RolePermission => {
    const newRule: RolePermission = {
      ...ruleData,
      id: `rp-${Date.now()}`,
    };
    setPermissions((prev) => {
      const updated = [newRule, ...prev];
      localStorage.setItem('cstyle_permissions', JSON.stringify(updated));
      return updated;
    });
    showToast(`تمت إضافة قاعدة الصلاحية لمستند ${newRule.docTypeAr}`);
    return newRule;
  };

  const togglePermission = (id: string, field: keyof RolePermission) => {
    setPermissions((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p));
      localStorage.setItem('cstyle_permissions', JSON.stringify(updated));
      return updated;
    });
    showToast('تم تحديث الصلاحية بنجاح');
  };

  const updateLoginSettings = (partial: Partial<LoginPageSettings>) => {
    setLoginSettings((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem('cstyle_login_settings', JSON.stringify(updated));
      return updated;
    });
    showToast('تم حفظ إعدادات صفحة الدخول المخصصة');
  };

  // ==================== TREASURY & SAFES STATE ====================
  const [cashBoxes, setCashBoxes] = useState<CashBox[]>(() => {
    const saved = localStorage.getItem('cstyle_cash_boxes');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_CASH_BOXES;
  });

  const saveCashBox = (box: CashBox) => {
    setCashBoxes((prev) => {
      const exists = prev.some((b) => b.id === box.id);
      const updated = exists ? prev.map((b) => (b.id === box.id ? box : b)) : [box, ...prev];
      localStorage.setItem('cstyle_cash_boxes', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حفظ بيانات الخزينة / الحساب: ${box.nameAr}`);
  };

  // Treasury Vouchers
  const [treasuryVouchers, setTreasuryVouchers] = useState<TreasuryVoucher[]>(() => {
    const saved = localStorage.getItem('cstyle_treasury_vouchers');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_TREASURY_VOUCHERS;
  });
  const [activeTreasuryVoucher, setActiveTreasuryVoucher] = useState<TreasuryVoucher | null>(null);

  const saveTreasuryVoucher = (voucherData: Omit<TreasuryVoucher, 'id' | 'voucherNo' | 'qrPayload'>): TreasuryVoucher => {
    const isReceipt = voucherData.type === 'إذن قبض / إضافة';
    const prefix = isReceipt ? 'RCP' : 'PAY';
    const seq = String(treasuryVouchers.length + 101).padStart(4, '0');
    const voucherNo = `${prefix}-2026-${seq}`;
    const id = `tv-${Date.now()}`;
    const qrPayload = `EC-TRS:${voucherNo}|AMT:${voucherData.amount}|CUR:${voucherData.currency}|DATE:${voucherData.date}|PARTY:${voucherData.partyNameAr}|TYPE:${voucherData.type}|STATUS:APPROVED`;

    const newVoucher: TreasuryVoucher = {
      ...voucherData,
      id,
      voucherNo,
      qrPayload,
      amountInWordsAr: tafqeetArabic(voucherData.amount, voucherData.currency),
      amountInWordsEn: tafqeetEnglish(voucherData.amount, voucherData.currency),
    };

    setTreasuryVouchers((prev) => {
      const updated = [newVoucher, ...prev];
      localStorage.setItem('cstyle_treasury_vouchers', JSON.stringify(updated));
      return updated;
    });

    // Update cash box balance if approved
    if (newVoucher.status === 'معتمد') {
      setCashBoxes((prev) => {
        const updated = prev.map((box) => {
          if (box.id === newVoucher.cashBoxId) {
            const newBal = isReceipt
              ? box.currentBalance + newVoucher.amount
              : box.currentBalance - newVoucher.amount;
            return { ...box, currentBalance: newBal };
          }
          return box;
        });
        localStorage.setItem('cstyle_cash_boxes', JSON.stringify(updated));
        return updated;
      });
    }

    // If cheque payment method, automatically register into cheque tracker
    if (newVoucher.paymentMethod === 'شيك' && newVoucher.chequeNo) {
      const newCheque: ChequeItem = {
        id: `chq-${Date.now()}`,
        chequeNo: newVoucher.chequeNo,
        direction: isReceipt ? 'وارد (من عميل)' : 'صادر (لمورد / جهة)',
        status: isReceipt ? 'في الخزينة' : 'مرسل للتحصيل بالبنك',
        amount: newVoucher.amount,
        currency: newVoucher.currency,
        drawerBankAr: newVoucher.bankNameAr || 'البنك المعتمد',
        dueDate: newVoucher.chequeDate || newVoucher.date,
        issueDate: newVoucher.date,
        clientOrPayerAr: isReceipt ? newVoucher.partyNameAr : 'شركة مصر للأوناش',
        beneficiaryAr: isReceipt ? 'شركة مصر للمقاولات المتخصصة (إيجيبت كرينز)' : newVoucher.partyNameAr,
        relatedVoucherNo: voucherNo,
        notes: newVoucher.remarksAr,
      };
      setCheques((prev) => {
        const updated = [newCheque, ...prev];
        localStorage.setItem('cstyle_cheques', JSON.stringify(updated));
        return updated;
      });
    }

    showToast(`تم إصدار ${newVoucher.type} برقم ${voucherNo} مع رمز QR للتحقق`);
    return newVoucher;
  };

  const cancelTreasuryVoucher = (id: string) => {
    setTreasuryVouchers((prev) => {
      const target = prev.find((v) => v.id === id);
      if (!target || target.status === 'ملغى') return prev;

      // Reverse cash box impact
      const isReceipt = target.type === 'إذن قبض / إضافة';
      setCashBoxes((boxPrev) => {
        const updated = boxPrev.map((box) => {
          if (box.id === target.cashBoxId) {
            const reversedBal = isReceipt
              ? box.currentBalance - target.amount
              : box.currentBalance + target.amount;
            return { ...box, currentBalance: reversedBal };
          }
          return box;
        });
        localStorage.setItem('cstyle_cash_boxes', JSON.stringify(updated));
        return updated;
      });

      const updated = prev.map((v) => (v.id === id ? { ...v, status: 'ملغى' as const } : v));
      localStorage.setItem('cstyle_treasury_vouchers', JSON.stringify(updated));
      return updated;
    });
    showToast('تم إلغاء الإذن وتسوية رصيد الخزينة');
  };

  // Cheque Portfolio Tracker
  const [cheques, setCheques] = useState<ChequeItem[]>(() => {
    const saved = localStorage.getItem('cstyle_cheques');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_CHEQUES;
  });

  const updateChequeStatus = (
    id: string,
    newStatus: ChequeItem['status'],
    extra?: {
      transferredToSupplierAr?: string;
      bounceReasonAr?: string;
      depositBankAr?: string;
    }
  ) => {
    setCheques((prev) => {
      const updated = prev.map((chq) => {
        if (chq.id === id) {
          return {
            ...chq,
            status: newStatus,
            ...(extra?.transferredToSupplierAr ? { transferredToSupplierAr: extra.transferredToSupplierAr, transferDate: formatDateISO(new Date()) } : {}),
            ...(extra?.bounceReasonAr ? { bounceReasonAr: extra.bounceReasonAr } : {}),
            ...(extra?.depositBankAr ? { depositBankAr: extra.depositBankAr } : {}),
            ...(newStatus === 'محصل بحساب البنك' ? { collectionDate: formatDateISO(new Date()) } : {}),
          };
        }
        return chq;
      });
      localStorage.setItem('cstyle_cheques', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم تحديث حالة الشيك إلى: ${newStatus}`);
  };

  const addCheque = (chequeData: Omit<ChequeItem, 'id'>): ChequeItem => {
    const newChq: ChequeItem = {
      ...chequeData,
      id: `chq-${Date.now()}`,
    };
    setCheques((prev) => {
      const updated = [newChq, ...prev];
      localStorage.setItem('cstyle_cheques', JSON.stringify(updated));
      return updated;
    });
    showToast(`تمت إضافة الشيك رقم ${newChq.chequeNo} للحافظة بنجاح`);
    return newChq;
  };

  // ==================== WAREHOUSES & INVENTORY STATE ====================
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem('cstyle_warehouses');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_WAREHOUSES;
  });

  const saveWarehouse = (wh: Warehouse) => {
    setWarehouses((prev) => {
      const exists = prev.some((w) => w.id === wh.id);
      const updated = exists ? prev.map((w) => (w.id === wh.id ? wh : w)) : [wh, ...prev];
      localStorage.setItem('cstyle_warehouses', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حفظ بيانات المستودع: ${wh.nameAr}`);
  };

  // Stock Items & Item Cards
  const [stockItems, setStockItems] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('cstyle_stock_items');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_STOCK_ITEMS;
  });

  const saveStockItem = (item: StockItem) => {
    setStockItems((prev) => {
      const exists = prev.some((s) => s.id === item.id);
      const updated = exists ? prev.map((s) => (s.id === item.id ? item : s)) : [item, ...prev];
      localStorage.setItem('cstyle_stock_items', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حفظ كارت الصنف: ${item.nameAr}`);
  };

  // Item Card Entries
  const [itemCardEntries, setItemCardEntries] = useState<ItemCardEntry[]>(() => {
    const saved = localStorage.getItem('cstyle_item_card_entries');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_ITEM_CARD_ENTRIES;
  });

  // Stock Vouchers
  const [stockVouchers, setStockVouchers] = useState<StockVoucher[]>(() => {
    const saved = localStorage.getItem('cstyle_stock_vouchers');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_STOCK_VOUCHERS;
  });
  const [activeStockVoucher, setActiveStockVoucher] = useState<StockVoucher | null>(null);

  const saveStockVoucher = (voucherData: Omit<StockVoucher, 'id' | 'voucherNo' | 'qrPayload'>): StockVoucher => {
    const isInward = voucherData.type === 'إذن وارد مخزني (إضافة)';
    const isReturn = voucherData.type === 'إذن مرتجع مخزني (مرتجع)';
    const isOutward = voucherData.type === 'إذن منصرف مخزني (صرف)';
    const prefix = isInward ? 'GRN' : isReturn ? 'RTN' : 'GIN';
    const seq = String(stockVouchers.length + 101).padStart(4, '0');
    const voucherNo = `${prefix}-2026-${seq}`;
    const id = `stk-${Date.now()}`;
    const totalAmount = voucherData.items.reduce((sum, item) => sum + (item.totalAmount || item.qty * item.unitPrice), 0);

    const allocationTag = !isInward && voucherData.allocatedEquipment
      ? `|CHARGED_TO:${voucherData.allocatedEquipment}`
      : !isInward && voucherData.allocatedVehicle
      ? `|CHARGED_TO:${voucherData.allocatedVehicle}`
      : !isInward && voucherData.allocatedDepartment
      ? `|CHARGED_TO:${voucherData.allocatedDepartment}`
      : '';

    const qrPayload = `EC-WH:${voucherNo}|WH:${voucherData.warehouseId}|TYPE:${voucherData.type}|AMT:${totalAmount}|DATE:${voucherData.date}${allocationTag}|STATUS:APPROVED`;

    const newVoucher: StockVoucher = {
      ...voucherData,
      id,
      voucherNo,
      totalAmount,
      qrPayload,
    };

    setStockVouchers((prev) => {
      const updated = [newVoucher, ...prev];
      localStorage.setItem('cstyle_stock_vouchers', JSON.stringify(updated));
      return updated;
    });

    // Update stock levels and generate item card ledger entries
    const newItemEntries: ItemCardEntry[] = [];
    setStockItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        const voucherItem = newVoucher.items.find((vi) => vi.itemId === item.id);
        if (!voucherItem) return item;

        // Inward and Returns both increase stock; Outward decreases stock
        const delta = (isInward || isReturn) ? voucherItem.qty : -voucherItem.qty;
        const newBalance = Math.max(0, item.currentStock + delta);

        const entryType: ItemCardEntry['voucherType'] = isInward
          ? 'إذن وارد'
          : isReturn
          ? 'إذن مرتجع مخزني'
          : 'إذن منصرف';

        newItemEntries.push({
          id: `ic-${Date.now()}-${item.id}`,
          itemId: item.id,
          date: newVoucher.date,
          voucherType: entryType,
          voucherNo: voucherNo,
          qtyIn: (isInward || isReturn) ? voucherItem.qty : 0,
          qtyOut: isOutward ? voucherItem.qty : 0,
          balanceAfter: newBalance,
          unitPrice: voucherItem.unitPrice,
          totalCost: voucherItem.qty * voucherItem.unitPrice,
          allocatedToAr: !isInward
            ? [newVoucher.allocatedEquipment, newVoucher.allocatedVehicle, newVoucher.allocatedDepartment, newVoucher.allocatedProject].filter(Boolean).join(' - ')
            : undefined,
          notes: newVoucher.notes,
        });

        return {
          ...item,
          currentStock: newBalance,
        };
      });
      localStorage.setItem('cstyle_stock_items', JSON.stringify(updatedItems));
      return updatedItems;
    });

    if (newItemEntries.length > 0) {
      setItemCardEntries((prev) => {
        const updated = [...newItemEntries, ...prev];
        localStorage.setItem('cstyle_item_card_entries', JSON.stringify(updated));
        return updated;
      });
    }

    if (isReturn) {
      showToast(`تم استلام وتسجيل المرتجع المخزني ${voucherNo} وإعادة إضافة الكمية للرصيد`);
    } else if (isOutward && newVoucher.allocatedEquipment) {
      showToast(`تم إصدار إذن المنصرف ${voucherNo} مع تحميل التكلفة مباشرة على الرافعة ${newVoucher.allocatedEquipment}`);
    } else {
      showToast(`تم حفظ وتوليد ${newVoucher.type} برقم ${voucherNo} مع رمز QR والباركود`);
    }

    return newVoucher;
  };

  // ==================== DAILY OPERATIONS & DISPATCH STATE ====================
  const [dailyOperations, setDailyOperations] = useState<DailyOperationAssignment[]>(() => {
    const saved = localStorage.getItem('cstyle_daily_ops');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_DAILY_OPERATIONS;
  });

  const saveDailyOperation = (opData: Partial<DailyOperationAssignment> & { id?: string }) => {
    setDailyOperations((prev) => {
      const exists = opData.id ? prev.some((d) => d.id === opData.id) : false;
      let updated: DailyOperationAssignment[];
      if (exists) {
        updated = prev.map((d) => (d.id === opData.id ? ({ ...d, ...opData } as DailyOperationAssignment) : d));
      } else {
        const newOp: DailyOperationAssignment = {
          id: opData.id || `dop-${Date.now()}`,
          date: opData.date || formatDateISO(new Date()),
          equipmentType: opData.equipmentType || 'رافعة مؤجرة',
          equipmentId: opData.equipmentId || '',
          equipmentModel: opData.equipmentModel || 'معدة غير محددة',
          equipmentCapacityTon: opData.equipmentCapacityTon,
          operatorId: opData.operatorId || '',
          operatorNameAr: opData.operatorNameAr || 'مشغل غير محدد',
          operatorPhone: opData.operatorPhone || '',
          clientAr: opData.clientAr || 'عميل عام',
          projectAr: opData.projectAr || 'مشروع عام',
          locationAr: opData.locationAr || 'الموقع الميداني',
          shiftType: opData.shiftType || 'وردية صباحية (08:00 ص - 04:00 م)',
          workHours: Number(opData.workHours || 8),
          siteSupervisorAr: opData.siteSupervisorAr || 'مشرف الموقع',
          siteSupervisorPhone: opData.siteSupervisorPhone || '',
          operationStatus: opData.operationStatus || 'في الموقع (يعمل)',
          liftingPlanApproved: opData.liftingPlanApproved ?? true,
          notes: opData.notes || '',
        };
        updated = [newOp, ...prev];
      }
      localStorage.setItem('cstyle_daily_ops', JSON.stringify(updated));
      return updated;
    });
    showToast(opData.id ? 'تم تحديث تكليف التشغيل اليومي بنجاح' : 'تم إضافة تكليف تشغيل يومي جديد');
  };

  const deleteDailyOperation = (id: string) => {
    setDailyOperations((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      localStorage.setItem('cstyle_daily_ops', JSON.stringify(updated));
      return updated;
    });
    showToast('تم إلغاء تكليف التشغيل');
  };

  // Fleet Vehicles
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicleItem[]>(() => {
    const saved = localStorage.getItem('cstyle_fleet_vehicles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_FLEET_VEHICLES;
  });

  const saveFleetVehicle = (veh: FleetVehicleItem) => {
    setFleetVehicles((prev) => {
      const exists = prev.some((v) => v.id === veh.id);
      const updated = exists ? prev.map((v) => (v.id === veh.id ? veh : v)) : [veh, ...prev];
      localStorage.setItem('cstyle_fleet_vehicles', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حفظ بيانات المركبة: ${veh.model} (${veh.plateNumber})`);
  };

  // Operators
  const [operators, setOperators] = useState<OperatorItem[]>(() => {
    const saved = localStorage.getItem('cstyle_operators');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_OPERATORS_DRIVERS;
  });

  const saveOperator = (op: OperatorItem) => {
    setOperators((prev) => {
      const exists = prev.some((o) => o.id === op.id);
      const updated = exists ? prev.map((o) => (o.id === op.id ? op : o)) : [op, ...prev];
      localStorage.setItem('cstyle_operators', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم تحديث بيانات المشغل / السائق: ${op.nameAr}`);
  };

  // Operator Monthly Schedules
  const [operatorSchedules, setOperatorSchedules] = useState<OperatorScheduleEntry[]>(() => {
    const saved = localStorage.getItem('cstyle_operator_schedules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_OPERATOR_SCHEDULES;
  });

  const updateOperatorShift = (
    id: string,
    shiftType: OperatorScheduleEntry['shiftType'],
    notes?: string
  ) => {
    setOperatorSchedules((prev) => {
      const updated = prev.map((s) =>
        s.id === id ? { ...s, shiftType, notes: notes || s.notes } : s
      );
      localStorage.setItem('cstyle_operator_schedules', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم تعديل الوردية إلى: ${shiftType}`);
  };

  // Shift Swapping
  const [shiftSwaps, setShiftSwaps] = useState<ShiftSwapRecord[]>(() => {
    const saved = localStorage.getItem('cstyle_shift_swaps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_SHIFT_SWAPS;
  });

  const swapOperatorShifts = (swapData: {
    operatorAId: string;
    operatorBId: string;
    shiftADate: string;
    shiftBDate: string;
    reasonAr: string;
  }): boolean => {
    const opA = operators.find((o) => o.id === swapData.operatorAId);
    const opB = operators.find((o) => o.id === swapData.operatorBId);
    if (!opA || !opB) return false;

    let shiftAVal: OperatorScheduleEntry['shiftType'] = 'وردية صباحية';
    let shiftBVal: OperatorScheduleEntry['shiftType'] = 'وردية صباحية';

    setOperatorSchedules((prev) => {
      const entryA = prev.find((s) => s.operatorId === opA.id && s.date === swapData.shiftADate);
      const entryB = prev.find((s) => s.operatorId === opB.id && s.date === swapData.shiftBDate);

      shiftAVal = entryA?.shiftType || 'وردية صباحية';
      shiftBVal = entryB?.shiftType || 'وردية صباحية';

      const updated = prev.map((s) => {
        if (s.operatorId === opA.id && s.date === swapData.shiftADate) {
          return { ...s, shiftType: shiftBVal, notes: `تبديل مع ${opB.nameAr}` };
        }
        if (s.operatorId === opB.id && s.date === swapData.shiftBDate) {
          return { ...s, shiftType: shiftAVal, notes: `تبديل مع ${opA.nameAr}` };
        }
        return s;
      });
      localStorage.setItem('cstyle_operator_schedules', JSON.stringify(updated));
      return updated;
    });

    const newSwap: ShiftSwapRecord = {
      id: `swap-${Date.now()}`,
      requestDate: formatDateISO(new Date()),
      operatorAId: opA.id,
      operatorANameAr: opA.nameAr,
      shiftADate: swapData.shiftADate,
      shiftAType: shiftAVal,
      operatorBId: opB.id,
      operatorBNameAr: opB.nameAr,
      shiftBDate: swapData.shiftBDate,
      shiftBType: shiftBVal,
      reasonAr: swapData.reasonAr,
      status: 'تم التبديل بنجاح',
    };

    setShiftSwaps((prev) => {
      const updated = [newSwap, ...prev];
      localStorage.setItem('cstyle_shift_swaps', JSON.stringify(updated));
      return updated;
    });

    showToast(`تم تبديل الوردية بين ${opA.nameAr} و ${opB.nameAr} بنجاح`);
    return true;
  };

  // Daily Breakdowns (Incidents & Defects)
  const [dailyBreakdowns, setDailyBreakdowns] = useState<DailyBreakdownTicket[]>(() => {
    const saved = localStorage.getItem('cstyle_daily_breakdowns');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_DAILY_BREAKDOWNS;
  });

  const saveDailyBreakdown = (ticketData: Partial<DailyBreakdownTicket> & { id?: string }) => {
    setDailyBreakdowns((prev) => {
      const exists = ticketData.id ? prev.some((b) => b.id === ticketData.id) : false;
      let updated: DailyBreakdownTicket[];
      if (exists) {
        updated = prev.map((b) => (b.id === ticketData.id ? ({ ...b, ...ticketData } as DailyBreakdownTicket) : b));
      } else {
        const ticketNo =
          ticketData.ticketNo ||
          `BRK-${formatDateISO(new Date()).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`;
        const newTicket: DailyBreakdownTicket = {
          id: ticketData.id || `brk-${Date.now()}`,
          ticketNo,
          date: ticketData.date || formatDateISO(new Date()),
          time: ticketData.time || '10:00',
          machineType: ticketData.machineType || 'رافعة مؤجرة',
          machineId: ticketData.machineId || '',
          machineModel: ticketData.machineModel || 'معدة غير محددة',
          operatorNameAr: ticketData.operatorNameAr || 'مشغل غير محدد',
          clientAr: ticketData.clientAr || 'عميل عام',
          projectAr: ticketData.projectAr || 'مشروع عام',
          locationAr: ticketData.locationAr || 'الموقع',
          breakdownSubsystem: ticketData.breakdownSubsystem || 'هيدروليك وبساتم',
          severity: ticketData.severity || 'متوسط (تأثير جزئي)',
          reportedDetails: ticketData.reportedDetails || '',
          downtimeHours: Number(ticketData.downtimeHours || 1),
          assignedTechnicianAr: ticketData.assignedTechnicianAr || 'فريق الصيانة',
          technicianPhone: ticketData.technicianPhone || '',
          status: ticketData.status || 'بلاغ جديد',
          partsRequested: ticketData.partsRequested,
          actionTaken: ticketData.actionTaken,
          resolvedAt: ticketData.resolvedAt,
        };
        updated = [newTicket, ...prev];
      }
      localStorage.setItem('cstyle_daily_breakdowns', JSON.stringify(updated));
      return updated;
    });
    showToast(ticketData.id ? 'تم تحديث بلاغ العطل اليومي' : 'تم تسجيل بلاغ عطل يومي جديد بنجاح');
  };

  // ==================== FINANCIAL STATEMENTS & PERIOD FILTER ====================
  const [financialFilter, setFinancialFilter] = useState<FinancialFilter>({
    periodType: 'annual',
    selectedYear: 2026,
    selectedQuarter: 'ALL',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    showComparison: true,
    comparisonYear: 2025,
    showVariancePercent: true,
  });

  // ==================== EQUIPMENT HOURLY COSTING ====================
  const [equipmentCostings, setEquipmentCostings] = useState<EquipmentCostingProfile[]>(() => {
    const saved = localStorage.getItem('cstyle_equipment_costings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_EQUIPMENT_COSTING;
  });

  const saveEquipmentCosting = (profile: EquipmentCostingProfile) => {
    setEquipmentCostings((prev) => {
      const idx = prev.findIndex((p) => p.id === profile.id);
      let updated: EquipmentCostingProfile[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = { ...profile, lastUpdated: formatDateISO(new Date()) };
      } else {
        updated = [{ ...profile, lastUpdated: formatDateISO(new Date()) }, ...prev];
      }
      localStorage.setItem('cstyle_equipment_costings', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حفظ وتحديث بطاقة تكلفة الرافعة: ${profile.craneModel}`);
  };

  // ==================== MULTI-LEVEL BUDGETING & APPROVAL OVERRIDE ====================
  const [budgets, setBudgets] = useState<BudgetRecord[]>(() => {
    const saved = localStorage.getItem('cstyle_budgets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_BUDGETS;
  });

  const saveBudgetRecord = (budget: BudgetRecord) => {
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.id === budget.id);
      const totalAvailable = budget.allocatedBudget + (budget.approvedOverrideAmount || 0);
      const variance = totalAvailable - (budget.actualSpent + budget.committedAmount);
      const util = totalAvailable > 0 ? (budget.actualSpent / totalAvailable) * 100 : 100;
      let status: BudgetRecord['status'] = 'ضمن الموازنة';
      if (util > 100) status = 'تجاوز الموازنة (محظور)';
      else if (util >= 80) status = 'تحذير (قريب من الحد)';

      const record: BudgetRecord = {
        ...budget,
        variance,
        utilizationPercent: parseFloat(util.toFixed(1)),
        status,
        lastUpdated: formatDateISO(new Date()),
      };

      let updated: BudgetRecord[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = record;
      } else {
        updated = [record, ...prev];
      }
      localStorage.setItem('cstyle_budgets', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حفظ الموازنة التقديرية: ${budget.targetNameAr}`);
  };

  const [budgetOverrides, setBudgetOverrides] = useState<BudgetOverrideRequest[]>(() => {
    const saved = localStorage.getItem('cstyle_budget_overrides');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_BUDGET_OVERRIDES;
  });

  const requestBudgetOverride = (req: Omit<BudgetOverrideRequest, 'id' | 'requestNo' | 'status'>): BudgetOverrideRequest => {
    const today = new Date();
    const newReq: BudgetOverrideRequest = {
      ...req,
      id: `ovr-${Date.now()}`,
      requestNo: `OVR-${today.getFullYear()}-${String(budgetOverrides.length + 1).padStart(4, '0')}`,
      status: 'بانتظار اعتماد المدير المالي',
    };
    setBudgetOverrides((prev) => {
      const updated = [newReq, ...prev];
      localStorage.setItem('cstyle_budget_overrides', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم تقديم طلب اعتماد استثناء للموازنة (${newReq.requestNo}) بنجاح`);
    return newReq;
  };

  const approveBudgetOverride = (id: string, approvalRemarks?: string): boolean => {
    if (!currentUser.canApproveFinance) {
      showToast('خطأ: ليس لديك صلاحية اعتماد استثناءات الموازنة (مطلوب صلاحية المدير العام أو المدير المالي)');
      return false;
    }

    let approvedReq: BudgetOverrideRequest | undefined;
    setBudgetOverrides((prev) => {
      const updated = prev.map((req) => {
        if (req.id === id) {
          approvedReq = {
            ...req,
            status: 'معتمد استثنائياً' as const,
            approvedByUserId: currentUser.id,
            approvedByUserNameAr: currentUser.nameAr,
            approvedAt: formatDateISO(new Date()) + ' ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            approvalRemarks: approvalRemarks || 'تم الاعتماد استثنائياً من صاحب الصلاحية لضرورة سير العمليات',
          };
          return approvedReq;
        }
        return req;
      });
      localStorage.setItem('cstyle_budget_overrides', JSON.stringify(updated));
      return updated;
    });

    if (approvedReq) {
      // Update the budget's approvedOverrideAmount so the blockage is lifted!
      setBudgets((prev) => {
        const updated = prev.map((b) => {
          if (b.id === approvedReq!.budgetId) {
            const currentOverride = b.approvedOverrideAmount || 0;
            const newOverride = currentOverride + approvedReq!.transactionAmount;
            return {
              ...b,
              approvedOverrideAmount: newOverride,
              variance: b.allocatedBudget + newOverride - (b.actualSpent + b.committedAmount),
              status: 'تحذير (قريب من الحد)' as const,
            };
          }
          return b;
        });
        localStorage.setItem('cstyle_budgets', JSON.stringify(updated));
        return updated;
      });
    }

    showToast('تم اعتماد استثناء الموازنة بنجاح وتم فك حظر المعاملة');
    return true;
  };

  const rejectBudgetOverride = (id: string, reason: string): boolean => {
    setBudgetOverrides((prev) => {
      const updated = prev.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            status: 'مرفوض' as const,
            approvedByUserId: currentUser.id,
            approvedByUserNameAr: currentUser.nameAr,
            approvedAt: formatDateISO(new Date()),
            approvalRemarks: `تم الرفض: ${reason}`,
          };
        }
        return req;
      });
      localStorage.setItem('cstyle_budget_overrides', JSON.stringify(updated));
      return updated;
    });
    showToast('تم رفض طلب استثناء الموازنة وتثبيت الحظر');
    return true;
  };

  const checkBudgetConstraint = (level: BudgetLevel, targetNameOrCode: string, transactionAmount: number) => {
    const record = budgets.find(
      (b) =>
        b.level === level &&
        (b.code === targetNameOrCode || b.targetNameAr.includes(targetNameOrCode) || b.referenceId === targetNameOrCode)
    );

    if (!record) {
      return { isExceeded: false, allowProceed: true, amountOverBudget: 0 };
    }

    const availableBudget = record.allocatedBudget + (record.approvedOverrideAmount || 0) - record.actualSpent;
    if (transactionAmount > availableBudget) {
      const amountOver = transactionAmount - availableBudget;
      return {
        isExceeded: true,
        budgetRecord: record,
        amountOverBudget: amountOver,
        allowProceed: false,
        warningMessage: `تنبيه حرج: العملية بقيمة ${transactionAmount.toLocaleString('ar-EG')} ج.م تتجاوز الموازنة المتاحة لبند (${record.targetNameAr}) بمقدار ${amountOver.toLocaleString('ar-EG')} ج.م. لا يمكن المتابعة إلا بعد طلب اعتماد استثنائي من المدير المالي أو المدير العام.`,
      };
    }

    return {
      isExceeded: false,
      budgetRecord: record,
      amountOverBudget: 0,
      allowProceed: true,
    };
  };

  // ==================== FLEET MAINTENANCE TRACKING & MECHANIC ASSIGNMENTS ====================
  const [maintenanceEvents, setMaintenanceEvents] = useState<CraneMaintenanceEvent[]>(() => {
    const saved = localStorage.getItem('cstyle_crane_maintenance');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_MAINTENANCE_EVENTS;
  });

  const [mechanics, setMechanics] = useState<MechanicTechnicianItem[]>(() => {
    const saved = localStorage.getItem('cstyle_mechanics');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_MECHANICS;
  });

  const saveMaintenanceEvent = (eventData: Partial<CraneMaintenanceEvent> & { id?: string }): CraneMaintenanceEvent => {
    const isNew = !eventData.id;
    const today = new Date();
    const eventNo =
      eventData.eventNo ||
      `MNT-${today.getFullYear()}-${String(maintenanceEvents.length + 101).padStart(4, '0')}`;
    const id = eventData.id || `mnt-${Date.now()}`;

    const completeEvent: CraneMaintenanceEvent = {
      id,
      eventNo,
      craneId: eventData.craneId || 'flt-1',
      craneCode: eventData.craneCode || 'EC-1200-01',
      craneModel: eventData.craneModel || 'Liebherr LTM 11200-9.1 (1200 Ton)',
      capacityTon: eventData.capacityTon || 1200,
      eventType: eventData.eventType || 'صيانة دورية وقائية (250/500/1000 ساعة)',
      priority: eventData.priority || 'عادية',
      status: eventData.status || 'مجدولة قادمة',
      scheduledDate: eventData.scheduledDate || formatDateISO(today),
      actualServiceDate: eventData.actualServiceDate,
      nextDueDate: eventData.nextDueDate || formatDateISO(new Date(today.getTime() + 90 * 86400000)),
      currentHourMeter: Number(eventData.currentHourMeter || 3500),
      nextDueHourMeter: Number(eventData.nextDueHourMeter || 4000),
      workshopLocation: eventData.workshopLocation || 'الورشة المركزية - طريق السويس',
      leadMechanicId: eventData.leadMechanicId,
      leadMechanicNameAr: eventData.leadMechanicNameAr || 'م. إبراهيم القاضي',
      leadMechanicPhone: eventData.leadMechanicPhone,
      assistingCrewAr: eventData.assistingCrewAr,
      taskDescriptionAr: eventData.taskDescriptionAr || 'فحص وصيانة دورية لأسطول الرافعات',
      workDoneReportAr: eventData.workDoneReportAr,
      sparePartsUsed: eventData.sparePartsUsed || [],
      estimatedCost: Number(eventData.estimatedCost || 0),
      actualCost: Number(eventData.actualCost || 0),
      downtimeHours: Number(eventData.downtimeHours || 0),
      safetyInspectionPassed: !!eventData.safetyInspectionPassed,
      certifiedByAr: eventData.certifiedByAr,
      notes: eventData.notes,
      createdAt: eventData.createdAt || formatDateISO(today),
    };

    setMaintenanceEvents((prev) => {
      let updated: CraneMaintenanceEvent[];
      const idx = prev.findIndex((e) => e.id === id);
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = completeEvent;
      } else {
        updated = [completeEvent, ...prev];
      }
      localStorage.setItem('cstyle_crane_maintenance', JSON.stringify(updated));
      return updated;
    });

    if (completeEvent.leadMechanicNameAr) {
      setMechanics((prev) => {
        const updated = prev.map((m) => {
          if (m.nameAr === completeEvent.leadMechanicNameAr) {
            return {
              ...m,
              status: completeEvent.status === 'مكتملة ومختبرة' ? ('متاح للعمل' as const) : ('مكلف بمهمة صيانة' as const),
              currentAssignedCrane: completeEvent.status === 'مكتملة ومختبرة' ? undefined : completeEvent.craneModel,
            };
          }
          return m;
        });
        localStorage.setItem('cstyle_mechanics', JSON.stringify(updated));
        return updated;
      });
    }

    showToast(isNew ? `تم جدولة مهمة الصيانة الجديدة: ${eventNo}` : `تم تحديث أمر الصيانة: ${eventNo}`);
    return completeEvent;
  };

  const deleteMaintenanceEvent = (id: string): boolean => {
    setMaintenanceEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      localStorage.setItem('cstyle_crane_maintenance', JSON.stringify(updated));
      return updated;
    });
    showToast('تم حذف سجل الصيانة بنجاح');
    return true;
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceStatus, notes?: string) => {
    setMaintenanceEvents((prev) => {
      const updated = prev.map((e) => {
        if (e.id === id) {
          const isCompleted = status === 'مكتملة ومختبرة';
          return {
            ...e,
            status,
            actualServiceDate: isCompleted && !e.actualServiceDate ? formatDateISO(new Date()) : e.actualServiceDate,
            safetyInspectionPassed: isCompleted ? true : e.safetyInspectionPassed,
            notes: notes ? `${e.notes || ''} [${formatDateISO(new Date())}: ${notes}]` : e.notes,
          };
        }
        return e;
      });
      localStorage.setItem('cstyle_crane_maintenance', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم تحديث حالة الصيانة إلى: ${status}`);
  };

  const saveMechanic = (mechanic: MechanicTechnicianItem) => {
    setMechanics((prev) => {
      const idx = prev.findIndex((m) => m.id === mechanic.id);
      let updated: MechanicTechnicianItem[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = mechanic;
      } else {
        updated = [mechanic, ...prev];
      }
      localStorage.setItem('cstyle_mechanics', JSON.stringify(updated));
      return updated;
    });
    showToast(`تم حفظ بيانات الفني/المهندس: ${mechanic.nameAr}`);
  };

  return (
    <ERPContext.Provider
      value={{
        activeModuleId,
        setActiveModuleId,
        activeView,
        setActiveView,
        language,
        setLanguage,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        currentTheme,
        setThemeConfig,
        applyPreset,
        isThemeModalOpen,
        setIsThemeModalOpen,
        translations,
        isTranslationModalOpen,
        setIsTranslationModalOpen,
        editingTranslation,
        setEditingTranslation,
        saveTranslation,
        t,
        invoices,
        activeInvoice,
        setActiveInvoice,
        saveInvoice,
        submitInvoice,
        cancelInvoice,
        ledgerEntries,
        currentUser,
        setCurrentUser,
        journalEntries,
        activeJournalEntry,
        setActiveJournalEntry,
        saveJournalEntry,
        submitJournalEntry,
        submitJournalEntryForApproval,
        approveJournalEntry,
        rejectJournalEntry,
        costCenters,
        saveCostCenter,
        deleteCostCenter,
        users,
        saveUser,
        contracts,
        activeContract,
        setActiveContract,
        saveContract,
        gateLogs,
        addGateLog,
        operationsStatuses,
        updateCraneStatus,
        breakdownLogs,
        addBreakdownLog,
        updateBreakdownStatus,
        fleet,
        backups,
        createBackup,
        restoreBackup,
        permissions,
        togglePermission,
        addPermissionRule,
        roles,
        addRole,
        deleteRole,
        loginSettings,
        updateLoginSettings,
        toastMessage,
        showToast,
        // Treasury, Safes & Vouchers
        cashBoxes,
        saveCashBox,
        treasuryVouchers,
        activeTreasuryVoucher,
        setActiveTreasuryVoucher,
        saveTreasuryVoucher,
        cancelTreasuryVoucher,
        cheques,
        updateChequeStatus,
        addCheque,
        // Warehouses & Stock
        warehouses,
        saveWarehouse,
        stockItems,
        saveStockItem,
        stockVouchers,
        activeStockVoucher,
        setActiveStockVoucher,
        saveStockVoucher,
        itemCardEntries,
        // Daily Operations, Vehicles, Shifts & Breakdowns
        dailyOperations,
        saveDailyOperation,
        deleteDailyOperation,
        fleetVehicles,
        saveFleetVehicle,
        operators,
        saveOperator,
        operatorSchedules,
        updateOperatorShift,
        swapOperatorShifts,
        dailyBreakdowns,
        saveDailyBreakdown,
        shiftSwaps,
        // Financial Statements & Costing & Budgets
        financialFilter,
        setFinancialFilter,
        equipmentCostings,
        saveEquipmentCosting,
        budgets,
        saveBudgetRecord,
        budgetOverrides,
        requestBudgetOverride,
        approveBudgetOverride,
        rejectBudgetOverride,
        checkBudgetConstraint,
        // Fleet Maintenance Tracking
        maintenanceEvents,
        mechanics,
        saveMaintenanceEvent,
        deleteMaintenanceEvent,
        updateMaintenanceStatus,
        saveMechanic,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
