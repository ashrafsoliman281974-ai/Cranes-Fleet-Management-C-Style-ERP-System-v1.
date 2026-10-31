export interface ModuleItem {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  badge?: number | string;
}

export interface WorkspaceShortcut {
  id: string;
  titleAr: string;
  titleEn: string;
  icon?: string;
  linkTo: string;
  count?: number;
  color?: string;
}

export interface WorkspaceFolderItem {
  id: string;
  titleAr: string;
  titleEn: string;
  type: 'report' | 'doctype' | 'page';
  route: string;
}

export interface WorkspaceFolder {
  id: string;
  titleAr: string;
  titleEn: string;
  items: WorkspaceFolderItem[];
}

export interface InvoiceItem {
  id: string;
  itemCode: string;
  itemNameAr: string;
  itemNameEn: string;
  qty: number;
  rate: number;
  discountPercent: number;
  amount: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNo: string;
  customerNameAr: string;
  customerNameEn: string;
  postingDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  hijriPostingDate?: string;
  hijriDueDate?: string;
  currency: 'EGP' | 'SAR' | 'USD';
  status: 'مسودة' | 'معتمدة' | 'مدفوعة' | 'ملغاة';
  items: InvoiceItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  outstandingAmount: number;
  amountInWordsAr: string;
  amountInWordsEn: string;
  paymentTermsAr: string;
  paymentTermsEn: string;
  customerAddressAr?: string;
  contactPersonAr?: string;
  remarksAr?: string;
}

export interface GeneralLedgerEntry {
  id: string;
  postingDate: string;
  accountAr: string;
  accountEn: string;
  debit: number;
  credit: number;
  balance: number;
  voucherTypeAr: string;
  voucherNo: string;
  partyNameAr: string;
  remarksAr: string;
}

export interface JournalEntryLine {
  id: string;
  accountAr: string;
  accountEn: string;
  debit: number;
  credit: number;
  costCenterId?: string;
  costCenterAr?: string;
  partyNameAr?: string;
  lineRemark?: string;
  // Multi-dimensional tagging:
  dimensionLevel?: 'إدارة' | 'معدة/سيارة' | 'عميل' | 'مشروع' | 'حساب';
  linkedDepartment?: string;
  linkedEquipment?: string;
  linkedClient?: string;
  linkedProject?: string;
}

export interface JournalEntry {
  id: string;
  entryNo: string;
  postingDate: string;
  hijriPostingDate?: string;
  entryType:
    | 'قيد يومية عام'
    | 'قيد افتتاحي'
    | 'قيد تسوية'
    | 'قيد بنكي / تحويل'
    | 'سند قبض شيكات مجمعة'
    | 'سند صرف شيكات موردين'
    | 'إيداع شيك تحت التحصيل'
    | 'تحصيل شيك بنكي'
    | 'قيد عكسي لارتداد شيك بنكي';
  currency: 'EGP' | 'SAR' | 'USD';
  lines: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  difference: number;
  status: 'مسودة' | 'بانتظار الاعتماد' | 'معتمد ومرحل' | 'مرفوض';
  remarksAr: string;
  costCenterAr?: string;
  amountInWordsAr: string;
  amountInWordsEn: string;
  // Approval Workflow Fields:
  createdByUserId: string;
  createdByUserNameAr: string;
  approvedByUserId?: string;
  approvedByUserNameAr?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface CostCenter {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  parentId?: string; // For tree hierarchy
  isGroup: boolean; // True if it has children / parent node
  level: 'تجميعي رئيسي' | 'إدارة' | 'معدة أو سيارة' | 'عميل' | 'مشروع' | 'حساب';
  allocatedBudget: number;
  actualSpent: number;
  variance: number;
  managerAr: string;
  status: 'نشط' | 'مكتمل' | 'معلق';
  // Relational dimensions:
  departmentAr?: string;
  linkedEquipmentAr?: string; // الرافعة أو سيارة الخدمة
  linkedClientAr?: string; // العميل
  linkedProjectAr?: string; // المشروع الميداني
}

export interface UserProfile {
  id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  phone: string;
  roleAr: string;
  departmentAr: string;
  status: 'نشط' | 'معطل';
  avatar?: string;
  assignedDepotAr: string;
  canApproveFinance: boolean; // صلاحية الاعتماد المالي
  canIssueGatePermits: boolean;
}

export interface ContractTermClause {
  id: string;
  titleAr: string;
  contentAr: string;
  enabled: boolean;
  category: 'تأمين وسلامة' | 'تشغيل وصيانة' | 'سولار وزيوت' | 'ساعات العمل' | 'شروط الموقع والتربة' | 'غرامات وتوقف';
}

export interface CraneContract {
  id: string;
  contractNo: string;
  clientNameAr: string;
  projectNameAr: string;
  craneModel: string;
  craneCapacityTon: number;
  startDate: string;
  endDate: string;
  hijriStartDate?: string;
  hijriEndDate?: string;
  rateType: 'يومي' | 'أسبوعي' | 'شهري' | 'بالمهمة';
  rateAmount: number;
  mobilizationFee: number;
  currency: 'EGP' | 'USD';
  status: 'ساري' | 'مسودة' | 'منتهي' | 'ملغى';
  operatorIncluded: boolean;
  fuelIncluded: boolean;
  terms: ContractTermClause[];
  notes?: string;
}

export interface CraneGateLog {
  id: string;
  logNo: string;
  craneId: string;
  craneModel: string;
  plateNo: string;
  driverNameAr: string;
  direction: 'خروج للموقع' | 'دخول للورشة / المستودع' | 'ترانزيت نقل ثقيل';
  targetProjectAr: string;
  logTimestamp: string;
  hijriDateFormatted: string;
  hourMeter: number;
  safetyCheckPassed: boolean;
  permitNo: string;
  securityOfficerAr: string;
  notes?: string;
}

export interface CraneOperationStatus {
  id: string;
  craneModel: string;
  code: string;
  capacityTon: number;
  currentStatus: 'في الموقع (يعمل)' | 'في الطريق (ترانزيت)' | 'جاهز بالمستودع' | 'عطل / صيانة طارئة';
  assignedProjectAr: string;
  clientAr: string;
  operatorNameAr: string;
  lastMaintenanceDate: string;
  locationAr: string;
}

export interface CraneBreakdownLog {
  id: string;
  ticketNo: string;
  craneCode: string;
  craneModel: string;
  breakdownType: 'هيدروليك' | 'محرك وديزل' | 'ذراع التلسكوب/بوم' | 'كهرباء وحساسات' | 'كابلات وبكرات' | 'تسريب زيوت';
  severity: 'حرج (توقف كامل)' | 'متوسط (تأثير جزئي)' | 'بسيط (ملاحظة دورية)';
  locationAr: string;
  projectAr: string;
  reportedTime: string;
  assignedTechnicianAr: string;
  status: 'بلاغ جديد' | 'قيد الفحص والإصلاح' | 'انتظار قطع الغيار' | 'تم الإصلاح والاختبار';
  partsRequired?: string;
  actionTaken?: string;
}

// ==================== FLEET MAINTENANCE TRACKING ====================
export type MaintenanceEventType =
  | 'صيانة دورية وقائية (250/500/1000 ساعة)'
  | 'صيانة هيدروليك وبساتم وضغوط'
  | 'عمرة وصيانة محرك وديزل'
  | 'فحص ذراع التلسكوب والبوم والوايرات'
  | 'معايرة كمبيوتر الحمولة LMI والحساسات'
  | 'شهادة فحص واختبار أمان دولي (Load Test)'
  | 'إصلاح عطل طارئ واستبدال قطع غيار'
  | 'صيانة إطارات وفرامل وشاسيه الرافعة';

export type MaintenanceStatus =
  | 'مجدولة قادمة'
  | 'قيد التنفيذ بالورشة / الموقع'
  | 'مكتملة ومختبرة'
  | 'متأخرة / تنبيه حرج'
  | 'ملغاة';

export type MaintenancePriority = 'عادية' | 'متوسطة' | 'حرجة / عاجلة';

export interface MaintenanceSparePartLine {
  itemCode: string;
  itemNameAr: string;
  qty: number;
  unitCost: number;
  totalCost: number;
}

export interface MechanicTechnicianItem {
  id: string;
  nameAr: string;
  nameEn: string;
  phone: string;
  specialtyAr:
    | 'هندسة هيدروليك وبساتم وضغوط'
    | 'ميكانيكا محركات ديزل ثقيلة'
    | 'إلكترونيات وحساسات LMI وكمبيوتر'
    | 'وايرات وبكرات وميكانيزم رفع'
    | 'شاسيه وفرامل وأنظمة تعليق'
    | 'فحص ومعايرة أمان واختبار أحمال';
  workshopLocationAr: string;
  experienceYears: number;
  certificationNumber: string;
  status: 'متاح للعمل' | 'مكلف بمهمة صيانة' | 'في إجازة دورية';
  currentAssignedCrane?: string;
}

export interface CraneMaintenanceEvent {
  id: string;
  eventNo: string; // e.g. MNT-2026-0042
  craneId: string;
  craneCode: string;
  craneModel: string;
  capacityTon: number;
  eventType: MaintenanceEventType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduledDate: string; // YYYY-MM-DD
  actualServiceDate?: string; // YYYY-MM-DD
  nextDueDate: string; // YYYY-MM-DD
  currentHourMeter: number;
  nextDueHourMeter: number;
  workshopLocation: string;
  leadMechanicId?: string;
  leadMechanicNameAr: string;
  leadMechanicPhone?: string;
  assistingCrewAr?: string;
  taskDescriptionAr: string;
  workDoneReportAr?: string;
  sparePartsUsed?: MaintenanceSparePartLine[];
  estimatedCost: number;
  actualCost: number;
  downtimeHours: number;
  safetyInspectionPassed: boolean;
  certifiedByAr?: string;
  notes?: string;
  createdAt: string;
}

export interface SystemBackup {
  id: string;
  filename: string;
  createdAt: string;
  hijriCreatedAt: string;
  sizeKb: number;
  recordsCount: number;
  createdBy: string;
  type: 'يدوي' | 'تلقائي مجدول';
}

export interface EgyptCraneFleetItem {
  id: string;
  code?: string;
  model: string;
  brand: 'Liebherr' | 'Demag' | 'Grove' | 'Tadano' | 'Krupp' | 'Hitachi' | 'Sumitomo';
  typeAr: 'رافعة هيدروليكية لجميع التضاريس (All-Terrain)' | 'رافعة مجنزرة بوم شبكي (Crawler Crane)' | 'رافعة للأراضي الوعرة (Rough Terrain)' | 'رافعة شاحنة تلسكوبية (Truck Mounted)';
  capacityTon: number;
  mainBoomMeters: number;
  maxTipHeightMeters: number;
  imageUrl?: string;
  currentStatus: 'متاح للتأجير' | 'في مشروع حالي' | 'قيد الفحص الدوري';
  featuredProjectsAr: string[];
  currentHourMeter?: number;
}

export interface RolePermission {
  id: string;
  docTypeAr: string;
  docTypeEn: string;
  roleAr: string;
  roleEn: string;
  read: boolean;
  write: boolean;
  create: boolean;
  delete: boolean;
  submit: boolean;
  cancel: boolean;
  amend: boolean;
  onlyIfCreator: boolean;
}

export interface UserRole {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  departmentAr?: string;
  isCustom?: boolean;
  canApproveFinanceDefault?: boolean;
  canIssueGatePermitsDefault?: boolean;
}

export interface ThemeConfig {
  presetName: string;
  primaryColor: string;
  primaryHover: string;
  primaryLight: string;
  accentMetallic: string;
  sidebarDarkBg: string;
}

export interface LoginPageSettings {
  companyNameAr: string;
  companyNameEn: string;
  subtitleAr: string;
  subtitleEn: string;
  logoUrl: string;
  backgroundImageUrl: string;
  panelPosition: 'right' | 'center' | 'left';
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  addressAr: string;
}

export interface TranslationItem {
  id: string;
  originalText: string;
  translatedText: string;
  context: string;
}

// ==================== TREASURY & CASH BOXES ====================
export interface CashBox {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  type: 'خزينة رئيسية' | 'خزينة فرعية / موقع' | 'حساب بنكي جاري';
  currency: 'EGP' | 'USD' | 'EUR';
  openingBalance: number;
  currentBalance: number;
  custodianAr: string;
  branchOrProjectAr: string;
  bankAccountNumber?: string;
  bankNameAr?: string;
  status: 'نشط' | 'مجمد';
}

export interface TreasuryVoucher {
  id: string;
  voucherNo: string;
  type: 'إذن قبض / إضافة' | 'إذن صرف';
  paymentMethod: 'نقدي' | 'شيك';
  cashBoxId: string;
  cashBoxNameAr: string;
  date: string; // YYYY-MM-DD
  hijriDate?: string;
  amount: number;
  currency: 'EGP' | 'USD';
  amountInWordsAr: string;
  amountInWordsEn: string;
  partyType: 'عميل' | 'مورد' | 'موظف / عهدة' | 'مصروفات تشغيل ومعدات' | 'تحويل داخلي';
  partyNameAr: string;
  costCenterAr?: string;
  linkedEquipment?: string; // الرافعة المنصرف لها
  linkedVehicle?: string; // سيارة الخدمة
  chequeNo?: string;
  chequeDate?: string;
  bankNameAr?: string;
  remarksAr: string;
  qrPayload: string;
  status: 'معتمد' | 'مسودة' | 'ملغى';
  createdByAr: string;
  receivedByOrPaidToAr: string;
}

export interface ChequeItem {
  id: string;
  chequeNo: string;
  direction: 'وارد (من عميل)' | 'صادر (لمورد / جهة)';
  status: 'في الخزينة' | 'مرسل للتحصيل بالبنك' | 'محصل بحساب البنك' | 'محول لمورد (تظهير)' | 'مرتد' | 'ملغى';
  amount: number;
  currency: 'EGP' | 'USD';
  drawerBankAr: string; // البنك المسحوب عليه
  depositBankAr?: string; // بنك الإيداع
  dueDate: string; // تاريخ الاستحقاق
  issueDate: string; // تاريخ التحرير
  clientOrPayerAr: string; // الساحب / العميل
  beneficiaryAr: string; // المستفيد
  transferredToSupplierAr?: string; // اسم المورد المحول إليه في حالة التظهير
  transferDate?: string;
  collectionDate?: string;
  bounceReasonAr?: string;
  relatedVoucherNo?: string;
  notes?: string;
}

// ==================== WAREHOUSES & INVENTORY ====================
export interface Warehouse {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  type: 'مستودع مركزي' | 'مستودع ورشة الصيانة المركزية' | 'مستودع موقع ميداني';
  locationAr: string;
  keeperAr: string;
  status: 'نشط' | 'معطل';
}

export interface StockItem {
  id: string;
  itemCode: string;
  barcode: string;
  nameAr: string;
  nameEn: string;
  categoryAr: 'فلاتر وزيوت هيدروليكية' | 'كابلات وبكرات وايرات' | 'حساسات وكروت إلكترونية' | 'إطارات وجنازير نقل ثقيل' | 'مهمات سلامة وأحزمة رفع' | 'قطع غيار محركات ديزل';
  unitAr: 'قطعة' | 'طقم' | 'برميل 208 لتر' | 'متر طولي' | 'علبة' | 'بكرة';
  currentStock: number;
  openingStock: number;
  reorderLevel: number;
  costPrice: number;
  warehouseId: string;
  warehouseNameAr: string;
  rackLocation: string;
  shelfNumber?: string; // رقم الرف بالمخزن
  storageAreaCode?: string; // رمز المساحة التخزينية (Bin / Zone Code)
  warehouseLocationDetails?: string; // موقعها بالمخزن (الممر - المستوى - القطاع)
  imageUrl: string;
  specificationsAr?: string;
  compatibleCranes?: string[];
}

export interface StockVoucherItem {
  itemId: string;
  itemCode: string;
  itemNameAr: string;
  qty: number;
  unitPrice: number;
  totalAmount: number;
}

export interface StockVoucher {
  id: string;
  voucherNo: string;
  type: 'إذن وارد مخزني (إضافة)' | 'إذن منصرف مخزني (صرف)' | 'إذن مرتجع مخزني (مرتجع)';
  warehouseId: string;
  warehouseNameAr: string;
  date: string;
  hijriDate?: string;
  items: StockVoucherItem[];
  totalAmount: number;
  supplierOrReceiverAr: string;
  costAllocationType?: 'معدة أو رافعة' | 'سيارة خدمة' | 'إدارة داخلية' | 'مشروع عميل';
  allocatedEquipment?: string; // الرافعة المنصرف لها أو المرتجع منها
  allocatedVehicle?: string; // سيارة الخدمة والصيانة
  allocatedDepartment?: string; // إدارة الصيانة أو الحركة
  allocatedProject?: string; // موقع المشروع
  costCenterAr?: string;
  notes?: string;
  qrPayload: string;
  storeKeeperAr: string;
  status: 'معتمد ومصروف' | 'مسودة';
}

export interface ItemCardEntry {
  id: string;
  itemId: string;
  date: string;
  voucherType: 'رصيد افتتاحي' | 'إذن وارد' | 'إذن منصرف' | 'إذن مرتجع مخزني';
  voucherNo: string;
  qtyIn: number;
  qtyOut: number;
  balanceAfter: number;
  unitPrice: number;
  totalCost: number;
  allocatedToAr?: string; // المعدة أو الإدارة التي تم التحميل عليها أو الارتجاع منها
  notes?: string;
}

// ==================== DAILY OPERATIONS & SHIFT DISPATCH ====================

export interface FleetVehicleItem {
  id: string;
  plateNumber: string;
  vehicleTypeAr:
    | 'تريلا نقل ثقيل (Lowbed)'
    | 'سيارة ورشة وصيانة متنقلة'
    | 'فنطاس وقود وسولار'
    | 'سيارة إشراف وحراسة وتأمين (Escort)'
    | 'ونش شوكة وتفريغ (Forklift)';
  model: string;
  driverNameAr: string;
  driverPhone: string;
  status: 'في الخدمة / متحركة' | 'في الموقع' | 'جاهزة بالورشة' | 'عطل / صيانة';
  currentLocationAr: string;
  assignedProjectAr?: string;
}

export interface OperatorItem {
  id: string;
  nameAr: string;
  nameEn: string;
  phone: string;
  roleType:
    | 'مشغل ونش ثقيل (Heavy Crane Operator)'
    | 'مشغل ونش تلسكوبي'
    | 'مشغل ونش مجنزر (Crawler)'
    | 'سائق نقل ثقيل وتريلات'
    | 'مساعد مشغل وفني ريجر (Rigger)';
  licenseNumber: string;
  experienceYears: number;
  currentEquipmentId?: string;
  currentEquipmentNameAr?: string;
  defaultShift: 'وردية صباحية' | 'وردية مسائية' | 'وردية ليلية';
  status: 'على رأس العمل' | 'في راحة / إجازة دورية' | 'إجازة سنوية' | 'متاح كبديل طوارئ';
  emergencyContact: string;
}

export interface DailyOperationAssignment {
  id: string;
  date: string; // YYYY-MM-DD
  equipmentType: 'رافعة مؤجرة' | 'سيارة خدمة / نقل ثقيل';
  equipmentId: string;
  equipmentModel: string;
  equipmentCapacityTon?: number;
  operatorId: string;
  operatorNameAr: string;
  operatorPhone: string;
  clientAr: string;
  projectAr: string;
  locationAr: string;
  shiftType:
    | 'وردية صباحية (08:00 ص - 04:00 م)'
    | 'وردية مسائية (04:00 م - 12:00 ص)'
    | 'وردية ليلية / طوارئ (12:00 ص - 08:00 ص)'
    | 'تشغيل متواصل 24 ساعة';
  workHours: number;
  siteSupervisorAr: string;
  siteSupervisorPhone: string;
  operationStatus: 'في الموقع (يعمل)' | 'في الطريق (ترانزيت)' | 'توقف مؤقت / عطل' | 'مكتمل بنجاح';
  liftingPlanApproved: boolean;
  notes?: string;
}

export interface OperatorScheduleEntry {
  id: string;
  operatorId: string;
  operatorNameAr: string;
  date: string; // YYYY-MM-DD
  shiftType:
    | 'وردية صباحية'
    | 'وردية مسائية'
    | 'وردية ليلية'
    | 'إجازة دورية'
    | 'راحة أسبوعية'
    | 'إجازة سنوية'
    | 'إجازة مرضية';
  assignedEquipmentAr?: string;
  locationAr?: string;
  projectAr?: string;
  isOvertime?: boolean;
  replacementOperatorId?: string;
  replacementOperatorNameAr?: string;
  notes?: string;
}

export interface DailyBreakdownTicket {
  id: string;
  ticketNo: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  machineType: 'رافعة مؤجرة' | 'سيارة خدمة / نقل ثقيل' | 'سيارة نقل / خدمة';
  machineId: string;
  machineModel: string;
  operatorNameAr: string;
  clientAr: string;
  projectAr: string;
  locationAr: string;
  breakdownSubsystem:
    | 'هيدروليك وبساتم'
    | 'محرك وديزل'
    | 'ذراع التلسكوب/بوم ووايرات'
    | 'حساسات وكروت إلكترونية (LMI)'
    | 'نظام الفرامل ونقل الحركة'
    | 'تسريب زيوت وسوائل'
    | 'إطارات وجنازير';
  severity:
    | 'حرج (توقف كامل عن العمل)'
    | 'متوسط (تأثير جزئي)'
    | 'بسيط (ملاحظة دورية مع استمرار العمل)';
  reportedDetails: string;
  downtimeHours: number;
  assignedTechnicianAr: string;
  technicianPhone: string;
  status:
    | 'بلاغ جديد'
    | 'قيد الفحص الميداني'
    | 'بانتظار قطع الغيار من المستودع'
    | 'تم الإصلاح وعادت للتشغيل';
  partsRequested?: string;
  actionTaken?: string;
  resolvedAt?: string;
}

export interface ShiftSwapRecord {
  id: string;
  requestDate: string;
  operatorAId: string;
  operatorANameAr: string;
  shiftADate: string;
  shiftAType: string;
  operatorBId: string;
  operatorBNameAr: string;
  shiftBDate: string;
  shiftBType: string;
  reasonAr: string;
  status: 'تم التبديل بنجاح' | 'قيد مراجعة مدير التشغيل' | 'مرفوض';
}

// ==================== FINANCIAL STATEMENTS & REPORTING TYPES ====================
export type FinancialPeriodType = 'annual' | 'quarterly' | 'custom';
export type QuarterPeriod = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'ALL';

export interface FinancialFilter {
  periodType: FinancialPeriodType;
  selectedYear: number;
  selectedQuarter: QuarterPeriod;
  startDate: string;
  endDate: string;
  showComparison?: boolean;
  comparisonYear?: number;
  showVariancePercent?: boolean;
}

export interface StatementLineItem {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  amount: number;
  previousAmount?: number;
  varianceAmount?: number;
  variancePercent?: number;
  isTotal?: boolean;
  isHeader?: boolean;
  indent?: number;
  notes?: string;
}

export interface StatementSection {
  titleAr: string;
  titleEn: string;
  items: StatementLineItem[];
  totalAmount: number;
  previousTotalAmount?: number;
  totalVarianceAmount?: number;
  totalVariancePercent?: number;
}

// ==================== EQUIPMENT HOURLY COSTING TYPES ====================
export interface DirectCostBreakdown {
  fuelLitersPerHour: number;
  fuelPricePerLiter: number;
  fuelCostPerHour: number;
  operatorHourlyWage: number;
  riggerHourlyWage: number;
  lubricantsAndHydraulicsPerHour: number;
  wearTearSparePartsPerHour: number;
  tiresAndWireRopesPerHour: number;
  totalDirectCostPerHour: number;
}

export interface IndirectCostBreakdown {
  craneAssetValue: number;
  economicLifeYears: number;
  annualWorkingHoursTarget: number;
  depreciationPerHour: number;
  insuranceAndCertificationsPerHour: number;
  yardAndWorkshopOverheadPerHour: number;
  adminAndGpsTrackingPerHour: number;
  totalIndirectCostPerHour: number;
}

export interface EquipmentCostingProfile {
  id: string;
  craneId: string;
  craneModel: string;
  craneBrand: string;
  capacityTon: number;
  plateNoOrCode: string;
  directCosts: DirectCostBreakdown;
  indirectCosts: IndirectCostBreakdown;
  totalOperatingCostPerHour: number;
  breakEvenHourlyRate: number;
  currentRentalHourlyRate: number;
  targetProfitMarginPercent: number;
  hourlyGrossProfit: number;
  hourlyProfitMarginPercent: number;
  lastUpdated: string;
}

// ==================== MULTI-LEVEL BUDGETING & APPROVAL OVERRIDE ====================
export type BudgetLevel = 'حساب' | 'إدارة' | 'مشروع' | 'عميل';

export interface BudgetRecord {
  id: string;
  code: string;
  level: BudgetLevel;
  targetNameAr: string;
  targetNameEn: string;
  referenceId: string;
  fiscalYear: number;
  allocatedBudget: number;
  actualSpent: number;
  committedAmount: number;
  variance: number;
  utilizationPercent: number;
  status: 'ضمن الموازنة' | 'تحذير (قريب من الحد)' | 'تجاوز الموازنة (محظور)';
  approvedOverrideAmount?: number;
  notes?: string;
  lastUpdated: string;
}

export interface BudgetOverrideRequest {
  id: string;
  requestNo: string;
  budgetId: string;
  budgetNameAr: string;
  level: BudgetLevel;
  allocatedBudget: number;
  currentSpent: number;
  transactionAmount: number;
  exceededAmount: number;
  requestedByUserId: string;
  requestedByUserNameAr: string;
  requestDate: string;
  justificationAr: string;
  status: 'بانتظار اعتماد المدير المالي' | 'معتمد استثنائياً' | 'مرفوض';
  approvedByUserId?: string;
  approvedByUserNameAr?: string;
  approvedAt?: string;
  approvalRemarks?: string;
}

// ==================== PART A: LANDING CMS & STORY MODE TYPES ====================
export interface LandingSettings {
  fleetCount: string; // "+100 ونش"
  projectCount: string; // "+250 مشروع"
  maxCapacityTon: string; // "+800 طن"
  experienceYears: string; // "+35 سنة"
  headlineAr: string; // "قوة ترفع مشروعك"
  headlineEn: string; // "BUILT FOR BIGGER DREAMS"
  subheadlineAr: string;
  subheadlineEn: string;
  heroVideoUrl: string;
  erpLoginButtonTextAr: string; // "دخول إلى النظام"
  erpLoginButtonTextEn: string; // "Login to ERP"
  showLoginButton: boolean;
  contactPhone: string;
  whatsappPhone: string;
  contactEmail: string;
  addressAr: string;
}

export interface GlassCardItem {
  id: string;
  cardNo: string; // "01", "02", etc.
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  mediaUrl: string;
  tagAr: string;
  tagEn: string;
  order: number;
}

export interface StorySceneItem {
  id: string;
  sceneNumber: number; // 1 to 20
  titleAr: string;
  titleEn: string;
  captionAr: string;
  captionEn: string;
  mediaUrl: string;
  cameraMotion: string;
  badgeAr?: string;
  durationSeconds: number; // 6 seconds
}

export interface MediaAssetItem {
  id: string;
  filename: string;
  titleAr: string;
  altTextAr: string;
  category: 'خلفيات وبانرات' | 'أسطول الأوناش' | 'مشاريع قومية' | 'شهادات وسلامة' | 'فيديوهات سينمائية';
  url: string;
  fileSizeKb: number;
  resolution: string;
  licenseType: 'ملكية الشركة (أصل)' | 'مرخص تجارياً' | 'تصوير ميداني معتمد';
  qaPassed: boolean;
  status: 'معتمد' | 'مسودة';
}

export interface LeadBookingRequest {
  id: string;
  leadNo: string;
  clientName: string;
  companyName: string;
  phone: string;
  email: string;
  selectedCraneModel: string;
  projectLocation: string;
  startDate: string;
  durationDays: number;
  maxLoadTon: number;
  maxHeightMeters: number;
  notes?: string;
  source: 'نموذج الموقع' | 'واتساب' | 'اتصال هاتفي';
  status: 'طلب جديد' | 'تم التواصل' | 'تم إرسال عرض سعر' | 'مرفوض';
  createdAt: string;
  whatsappConsentGiven: boolean;
}

// ==================== PART B: MULTI-CHEQUE MANAGEMENT TYPES ====================
export type ChequeLifecycleState =
  | 'Received' // استلام
  | 'Under Collection' // تحت التحصيل بالبنك
  | 'Collected' // تم التحصيل
  | 'Returned' // مرتد
  | 'Paid' // مدفوع (شيكات صادرة)
  | 'Issued' // صادر لمورد
  | 'Cancelled'; // ملغى

export interface ChequeSettings {
  id: string;
  company: string;
  chequesInHandAccount: string;
  chequesUnderCollectionAccount: string;
  chequesPayableAccount: string;
  bankChargesAccount: string;
  penaltyRevenueAccount: string;
  defaultAllocationRule: 'FIFO' | 'Manual';
  debtReductionTiming: 'عند الاستلام' | 'عند التحصيل';
  warningDays: number[]; // [7, 3, 1]
  allowPartialCollection: boolean;
  allowEndorsement: boolean;
  numberingSeries: string;
}

export interface ChequeStatusLog {
  id: string;
  chequeId: string;
  fromStatus: ChequeLifecycleState;
  toStatus: ChequeLifecycleState;
  user: string;
  timestamp: string;
  reason: string;
  linkedJournalEntryNo?: string;
}

export interface ChequeBatchItem {
  id: string;
  chequeNo: string;
  partyType: 'عميل' | 'مورد';
  partyNameAr: string;
  partyId?: string;
  drawerName?: string;
  drawerBankAr: string;
  branchName?: string;
  accountLast4: string;
  amount: number;
  currency: 'EGP' | 'USD' | 'EUR';
  issueDate: string;
  dueDate: string;
  hijriDueDate?: string;
  status: ChequeLifecycleState;
  chequeScanUrl?: string;
  notes?: string;
  depositDate?: string;
  collectionDate?: string;
  bounceDate?: string;
  bounceReason?: string;
  bankCharges?: number;
  penaltyAmount?: number;
  replacementChequeNo?: string;
  endorsedToSupplierAr?: string;
  linkedPaymentEntryNo?: string;
  linkedJournalEntryNo?: string;
  statusLogs?: ChequeStatusLog[];
}

export interface ChequeBatchAllocation {
  id: string;
  chequeItemId: string;
  referenceType: 'Sales Invoice' | 'Purchase Invoice' | 'دفعة مقدمة';
  invoiceId: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceDueDate?: string;
  invoiceOutstanding: number;
  allocatedAmount: number;
}

export interface ChequeBatch {
  id: string;
  batchNo: string;
  direction: 'استلام من عملاء (Receive)' | 'سداد لموردين (Pay)';
  company: string;
  postingDate: string;
  hijriPostingDate?: string;
  companyBankAccount: string;
  bankAccountNameAr: string;
  paymentMethod: string;
  costCenterAr?: string;
  projectAr?: string;
  cheques: ChequeBatchItem[];
  allocations: ChequeBatchAllocation[];
  totalChequesAmount: number;
  totalAllocatedAmount: number;
  unallocatedAdvanceAmount: number;
  status: 'مسودة' | 'معتمدة ومرحلة' | 'ملغاة';
  remarksAr: string;
  linkedJournalEntryNo?: string;
}

export interface ChequeBook {
  id: string;
  bankAccount: string;
  bankNameAr: string;
  fromNo: string;
  toNo: string;
  currentLeaf: string;
  totalLeaves: number;
  remainingLeaves: number;
  status: 'نشط' | 'قارب على النفاد' | 'منتهي';
  notes?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  titleAr: string;
  language: 'ar' | 'en';
  category: 'Utility' | 'Marketing' | 'Authentication';
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttons?: { type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER'; text: string; value?: string }[];
  variables: string[];
  approvalStatus: 'مسودة' | 'قيد المراجعة' | 'معتمد' | 'مرفوض';
}

export interface WhatsAppConversationMessage {
  id: string;
  direction: 'وارد (Inbound)' | 'صادر (Outbound)';
  sender: string;
  recipient: string;
  text: string;
  timestamp: string;
  status: 'في الانتظار' | 'أُرسلت' | 'سُلِّمت' | 'قُرئت' | 'فشلت';
  isTemplate: boolean;
  relatedDocType?: string;
  relatedDocNo?: string;
  signedPortalLink?: string;
}


// ==================== PART C: BANKS & RECONCILIATION TYPES ====================
export interface BankAccountItem {
  id: string;
  bankNameAr: string;
  bankNameEn: string;
  accountNumber: string;
  iban: string;
  currency: 'EGP' | 'USD' | 'EUR';
  glAccountCode: string;
  costCenterAr: string;
  currentBalance: number;
  status: 'نشط' | 'مجمد';
}

export interface BankStatementTransaction {
  id: string;
  date: string;
  referenceNo: string;
  descriptionAr: string;
  debit: number;
  credit: number;
  balanceAfter: number;
  matchedStatus: 'مطابق آلياً' | 'مطابق يدوياً' | 'غير مطابق';
  matchedDocType?: string;
  matchedDocNo?: string;
}

export interface LetterOfGuarantee {
  id: string;
  lgNumber: string;
  type: 'ضمان ابتدائي (Bid Bond)' | 'ضمان نهائي (Performance Bond)' | 'ضمان دفعة مقدمة (Advance Payment Bond)';
  issuingBankAr: string;
  beneficiaryAr: string;
  projectAr: string;
  amount: number;
  currency: 'EGP' | 'USD';
  cashMarginPercent: number;
  cashMarginAmount: number;
  issueDate: string;
  expiryDate: string;
  daysToExpiry: number;
  status: 'سارٍ' | 'قرب الانتهاء (تنبيه)' | 'مفرج عنه' | 'مصادر';
}

// ==================== PART C: BIOMETRIC ATTENDANCE (PUSH/ADMS) TYPES ====================
export interface BiometricDevice {
  id: string;
  deviceNameAr: string;
  model: string; // e.g. ZKTeco uFace 800 Plus (ADMS)
  serialNumber: string;
  protocol: 'ADMS/iClock (Push)' | 'Standalone Push';
  locationAr: string;
  assignedCostCenterAr: string;
  assignedProjectAr: string;
  ipAddress: string;
  cloudServerUrl: string;
  commKey: string;
  isOnline: boolean;
  lastHeartbeat: string;
  totalPunchesToday: number;
  supportsFaceAndPhoto: boolean;
}

export interface BiometricPunch {
  id: string;
  deviceId: string;
  deviceNameAr: string;
  userPin: string;
  employeeNameAr: string;
  timestamp: string;
  direction: 'دخول (Check-In)' | 'خروج (Check-Out)';
  verifyType: 'بصمة وجه + صورة' | 'بصمة إصبع' | 'بطاقة RFID';
  photoUrl?: string; // ATTPHOTO snapshot
  costCenterAr: string;
  projectAr: string;
  status: 'معتمد' | 'استثناء يحتاج مراجعة';
}

export interface AttendanceExceptionItem {
  id: string;
  date: string;
  employeeNameAr: string;
  userPin: string;
  exceptionType: 'بصمة خروج مفقودة' | 'تأخير صباحي' | 'انصراف مبكر' | 'موظف غير معرف (Unmapped PIN)';
  detailsAr: string;
  status: 'بانتظار المعالجة' | 'تم التصحيح والاعتماد' | 'مرفوض';
  resolvedByAr?: string;
}

// ==================== PART C: PAYROLL TYPES ====================
export interface EmployeePayrollItem {
  id: string;
  employeeId: string;
  employeeNameAr: string;
  departmentAr: string;
  roleAr: string;
  basicSalary: number;
  attendanceDays: number;
  overtimeHours: number;
  overtimeAmount: number;
  siteHardshipAllowance: number;
  hazardAllowance: number;
  grossSalary: number;
  socialInsuranceDeduction: number; // 11%
  incomeTaxDeduction: number;
  advancesDeduction: number;
  penaltiesDeduction: number;
  netSalary: number;
  costCenterAllocation: {
    costCenterAr: string;
    projectAr: string;
    allocatedAmount: number;
  }[];
  bankAccountNo: string;
  status: 'معتمد' | 'مدفوع';
}

export interface PayrollRun {
  id: string;
  runNo: string;
  month: string; // "2026-10"
  monthNameAr: string;
  totalBasic: number;
  totalAllowances: number;
  totalOvertime: number;
  totalGross: number;
  totalDeductions: number;
  totalNetPayroll: number;
  employeesCount: number;
  status: 'مسودة' | 'بانتظار اعتماد المدير العام' | 'معتمد ومحول للبنك';
  wpsFileGenerated: boolean;
  employees: EmployeePayrollItem[];
}

// ==================== PART C: UNIFIED MESSAGING ENGINE TYPES ====================
export type MessageChannel = 'WhatsApp' | 'SMS' | 'Email';

export interface UnifiedMessageRule {
  id: string;
  ruleNameAr: string;
  triggerEvent:
    | 'إنشاء طلب حجز Lead جديد'
    | 'اعتماد عرض سعر'
    | 'اعتماد عقد تأجير'
    | 'إصدار فاتورة مبيعات'
    | 'سجل تشغيل ينتظر اعتماد العميل'
    | 'اقتراب استحقاق شيك'
    | 'ارتداد شيك'
    | 'قرب انتهاء شهادة مشغل أو ترخيص ونش'
    | 'تنبيه انقطاع جهاز بصمة'
    | 'تجاوز سرعة GPS';
  channelPriority: MessageChannel[];
  targetRecipientType: 'العميل' | 'المشغل/الموظف' | 'فريق المبيعات' | 'مسؤول السلامة' | 'المدير المالي';
  templateId: string;
  isActive: boolean;
  relatedDocType?: string;
}

export interface UnifiedMessageLog {
  id: string;
  timestamp: string;
  channel: MessageChannel;
  recipientNameAr: string;
  recipientPhone: string;
  messageContent: string;
  relatedDocType: string;
  relatedDocNo: string;
  status: 'تم التسليم بنجاح' | 'في الانتظار' | 'فشل الإرسال (تم التحويل لـ SMS)';
  failureReason?: string;
}

export interface WhatsAppConsent {
  id: string;
  phone: string;
  clientNameAr: string;
  status: 'موافق' | 'ملغى';
  source: 'نموذج حجز الموقع' | 'عقد تأجير' | 'يدوي';
  updatedAt: string;
}

// ==================== PART C: I-TRACK GPS INTEGRATION TYPES ====================
export interface ITrackTracker {
  id: string;
  imeiOrTrackerId: string;
  deviceName: string;
  assignedCraneCode: string;
  assignedCraneModel: string;
  effectiveCostCenterAr: string;
  effectiveProjectAr: string;
  lastGpsPing: string;
  lastCoordinates: string; // "30.0444, 31.2357"
  engineStatus: 'دوران وعمل' | 'توقف تام' | 'خمول';
  todayDistanceKm: number;
  todayEngineHours: number;
}

export interface ITrackReportLine {
  id: string;
  trackerId: string;
  date: string;
  craneModel: string;
  distanceKm: number;
  engineWorkingHours: number;
  idleHours: number;
  fuelEstimatedLiters: number;
  maxSpeedKmh: number;
  speedViolationsCount: number;
  assignedCostCenterAr: string;
  assignedProjectAr: string;
}

export interface GpsUsageLogComparison {
  id: string;
  date: string;
  craneModel: string;
  craneCode: string;
  projectAr: string;
  usageLogHours: number; // الساعات المعتمدة بسجل التشغيل
  gpsEngineHours: number; // ساعات تشغيل المحرك من GPS
  varianceHours: number;
  variancePercentage: number;
  complianceStatus: 'متطابق (ضمن الحد المسموح)' | 'فارق يحتاج مراجعة التشغيل';
}

// ==================== PART C: INTEGRATION HEALTH STATUS ====================
export interface IntegrationHealthItem {
  id: string;
  serviceNameAr: string;
  serviceCategory: 'أجهزة البصمة (Push)' | 'تتبع GPS (i-Track)' | 'محرك واتساب' | 'بوابة SMS' | 'المطابقة البنكية' | 'النسخ الاحتياطي';
  status: 'يعمل بكفاءة' | 'تحذير' | 'متوقف';
  lastActivity: string;
  successRate: number;
  detailsAr: string;
}

// ==================== AUDIT TRAIL & COMPLIANCE TRACKING TYPES ====================
export interface FieldChangeDiff {
  fieldNameAr: string;
  fieldNameEn: string;
  oldValue: string | number | boolean;
  newValue: string | number | boolean;
}

export type AuditActionType =
  | 'إنشاء'
  | 'تعديل'
  | 'اعتماد'
  | 'إلغاء'
  | 'حذف'
  | 'تسجيل دخول'
  | 'تصدير بيانات'
  | 'تجاوز موازنة'
  | 'طباعة'
  | 'تغيير صلاحية';

export type AuditSeverity = 'عادي (Info)' | 'تنبيه (Warning)' | 'حرج (Critical)' | 'أمني (Security)';

export type ComplianceCategory =
  | 'حوكمة مالية (SOX / IFRS)'
  | 'سلامة وتشغيل (HSE / ISO 45001)'
  | 'أمان وسريّة البيانات'
  | 'إجراءات قانونية وعقود'
  | 'تأمينات وضرائب (Egyptian Tax & Social Insurance)';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // "2026-10-31 14:35:22"
  hijriDate: string; // "19 ربيع الآخر 1448 هـ"
  userId: string;
  userNameAr: string;
  userRoleAr: string;
  userIpAddress: string;
  userDevice: string;
  actionType: AuditActionType;
  moduleNameAr: string;
  docType: string;
  docId: string;
  docNumber: string;
  summaryAr: string;
  severity: AuditSeverity;
  complianceCategory: ComplianceCategory;
  status: 'نجاح' | 'فشل أو محظور';
  checksumSha256?: string;
  fieldChanges?: FieldChangeDiff[];
  metadata?: Record<string, string | number | boolean>;
}

