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
  entryType: 'قيد يومية عام' | 'قيد افتتاحي' | 'قيد تسوية' | 'قيد بنكي / تحويل';
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



