import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  QrCode,
  Barcode,
  Truck,
  Building,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Wrench,
  Tag,
  Eye,
  X,
  History,
  ShieldAlert,
  Scan,
  RotateCcw,
  MapPin,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { StockItem, StockVoucher, ItemCardEntry, Warehouse, StockVoucherItem } from '../../types/erp';
import { formatDateISO } from '../../utils/hijri';
import { QRCodeDisplay, BarcodeDisplay } from '../common/QrBarcodeTools';
import { StockBarcodeScannerModal } from './StockBarcodeScannerModal';

export const InventoryWarehouseView: React.FC = () => {
  const {
    stockItems,
    saveStockItem,
    stockVouchers,
    saveStockVoucher,
    itemCardEntries,
    warehouses,
    saveWarehouse,
    fleet,
    costCenters,
    currentUser,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'items' | 'vouchers' | 'item-card' | 'warehouses'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Selected Item for Item Card View or Sticker Print
  const [selectedItemForCard, setSelectedItemForCard] = useState<StockItem | null>(stockItems[0] || null);
  const [selectedItemForLabelPrint, setSelectedItemForLabelPrint] = useState<StockItem | null>(null);

  // Selected Stock Voucher for Print
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<StockVoucher | null>(null);

  // Modals
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherModalType, setVoucherModalType] = useState<
    'إذن وارد مخزني (إضافة)' | 'إذن منصرف مخزني (صرف)' | 'إذن مرتجع مخزني (مرتجع)'
  >('إذن وارد مخزني (إضافة)');
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

  // Voucher Form State
  const [formVoucher, setFormVoucher] = useState<{
    warehouseId: string;
    date: string;
    supplierOrReceiverAr: string;
    costAllocationType: StockVoucher['costAllocationType'];
    allocatedEquipment: string;
    allocatedVehicle: string;
    allocatedDepartment: string;
    allocatedProject: string;
    costCenterAr: string;
    notes: string;
    items: { itemId: string; qty: number; unitPrice: number }[];
  }>({
    warehouseId: warehouses[0]?.id || '',
    date: formatDateISO(new Date()),
    supplierOrReceiverAr: '',
    costAllocationType: 'معدة أو رافعة',
    allocatedEquipment: '',
    allocatedVehicle: '',
    allocatedDepartment: 'إدارة التشغيل الميداني',
    allocatedProject: 'مشروع حقل ظهر للغاز الطبيعي',
    costCenterAr: '',
    notes: '',
    items: [{ itemId: stockItems[0]?.id || '', qty: 1, unitPrice: stockItems[0]?.costPrice || 0 }],
  });

  // New Item Form State
  const [formItem, setFormItem] = useState<Partial<StockItem>>({
    itemCode: `SP-EC-${Math.floor(1000 + Math.random() * 9000)}`,
    barcode: `62210892${Math.floor(1000 + Math.random() * 9000)}`,
    nameAr: '',
    nameEn: '',
    categoryAr: 'فلاتر وزيوت هيدروليكية',
    unitAr: 'قطعة',
    openingStock: 10,
    currentStock: 10,
    reorderLevel: 5,
    costPrice: 2500,
    warehouseId: warehouses[0]?.id || '',
    rackLocation: 'رف A-01',
    shelfNumber: 'رف A-01',
    storageAreaCode: 'BIN-101',
    warehouseLocationDetails: 'الممر الرئيسي - المستوى الأول',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    specificationsAr: '',
  });

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalItemsCount = stockItems.length;
    const totalInventoryValue = stockItems.reduce((s, i) => s + i.currentStock * i.costPrice, 0);
    const lowStockItemsCount = stockItems.filter((i) => i.currentStock <= i.reorderLevel).length;
    const totalVouchersCount = stockVouchers.length;
    return { totalItemsCount, totalInventoryValue, lowStockItemsCount, totalVouchersCount };
  }, [stockItems, stockVouchers]);

  // Filtered Stock Items
  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      if (selectedWarehouseId !== 'all' && item.warehouseId !== selectedWarehouseId) return false;
      if (selectedCategory !== 'all' && item.categoryAr !== selectedCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.nameAr.toLowerCase().includes(q) ||
          item.itemCode.toLowerCase().includes(q) ||
          item.barcode.toLowerCase().includes(q) ||
          item.rackLocation.toLowerCase().includes(q) ||
          (item.shelfNumber && item.shelfNumber.toLowerCase().includes(q)) ||
          (item.storageAreaCode && item.storageAreaCode.toLowerCase().includes(q)) ||
          (item.warehouseLocationDetails && item.warehouseLocationDetails.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [stockItems, selectedWarehouseId, selectedCategory, searchQuery]);

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return stockVouchers.filter((v) => {
      if (selectedWarehouseId !== 'all' && v.warehouseId !== selectedWarehouseId) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          v.voucherNo.toLowerCase().includes(q) ||
          v.supplierOrReceiverAr.toLowerCase().includes(q) ||
          (v.allocatedEquipment && v.allocatedEquipment.toLowerCase().includes(q)) ||
          (v.allocatedDepartment && v.allocatedDepartment.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [stockVouchers, selectedWarehouseId, searchQuery]);

  // Item Card Entries for Selected Item
  const activeItemCardEntries = useMemo(() => {
    if (!selectedItemForCard) return [];
    return itemCardEntries.filter((e) => e.itemId === selectedItemForCard.id);
  }, [itemCardEntries, selectedItemForCard]);

  // Handlers for Voucher creation
  const handleAddVoucherItemRow = () => {
    setFormVoucher((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { itemId: stockItems[0]?.id || '', qty: 1, unitPrice: stockItems[0]?.costPrice || 0 },
      ],
    }));
  };

  const handleRemoveVoucherItemRow = (index: number) => {
    if (formVoucher.items.length <= 1) return;
    setFormVoucher((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses.find((w) => w.id === formVoucher.warehouseId);

    const voucherItems: StockVoucherItem[] = formVoucher.items.map((line) => {
      const itm = stockItems.find((s) => s.id === line.itemId);
      const qty = Number(line.qty || 1);
      const unitPrice = Number(line.unitPrice || itm?.costPrice || 0);
      return {
        itemId: line.itemId,
        itemCode: itm ? itm.itemCode : 'SP-UNKNOWN',
        itemNameAr: itm ? itm.nameAr : 'صنف مخزني',
        qty,
        unitPrice,
        totalAmount: qty * unitPrice,
      };
    });

    saveStockVoucher({
      type: voucherModalType,
      warehouseId: formVoucher.warehouseId,
      warehouseNameAr: wh ? wh.nameAr : 'المستودع الرئيسي',
      date: formVoucher.date,
      items: voucherItems,
      totalAmount: voucherItems.reduce((s, it) => s + it.totalAmount, 0),
      supplierOrReceiverAr: formVoucher.supplierOrReceiverAr || currentUser.nameAr,
      costAllocationType: !voucherModalType.includes('وارد') ? formVoucher.costAllocationType : undefined,
      allocatedEquipment: !voucherModalType.includes('وارد') ? formVoucher.allocatedEquipment || undefined : undefined,
      allocatedVehicle: !voucherModalType.includes('وارد') ? formVoucher.allocatedVehicle || undefined : undefined,
      allocatedDepartment: !voucherModalType.includes('وارد') ? formVoucher.allocatedDepartment || undefined : undefined,
      allocatedProject: !voucherModalType.includes('وارد') ? formVoucher.allocatedProject || undefined : undefined,
      costCenterAr: formVoucher.costCenterAr || undefined,
      notes: formVoucher.notes,
      storeKeeperAr: currentUser.nameAr,
      status: 'معتمد ومصروف',
    });

    setIsVoucherModalOpen(false);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItem.nameAr) return;

    const wh = warehouses.find((w) => w.id === formItem.warehouseId);
    const newItem: StockItem = {
      id: `item-${Date.now()}`,
      itemCode: formItem.itemCode || `SP-EC-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: formItem.barcode || `62210892${Math.floor(1000 + Math.random() * 9000)}`,
      nameAr: formItem.nameAr,
      nameEn: formItem.nameEn || formItem.nameAr,
      categoryAr: formItem.categoryAr as StockItem['categoryAr'],
      unitAr: formItem.unitAr as StockItem['unitAr'],
      openingStock: Number(formItem.openingStock || 0),
      currentStock: Number(formItem.openingStock || 0),
      reorderLevel: Number(formItem.reorderLevel || 5),
      costPrice: Number(formItem.costPrice || 100),
      warehouseId: formItem.warehouseId || warehouses[0]?.id || '',
      warehouseNameAr: wh ? wh.nameAr : 'المستودع المركزي',
      rackLocation: formItem.rackLocation || 'رف عام',
      shelfNumber: formItem.shelfNumber || formItem.rackLocation || 'رف A-01',
      storageAreaCode: formItem.storageAreaCode || 'BIN-101',
      warehouseLocationDetails: formItem.warehouseLocationDetails || 'الممر الرئيسي بالمستودع',
      imageUrl: formItem.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      specificationsAr: formItem.specificationsAr,
    };

    saveStockItem(newItem);
    setSelectedItemForCard(newItem);
    setIsNewItemModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
            <span>المخازن والمستودعات</span>
            <span>/</span>
            <span className="text-amber-700 font-bold">إدارة قطع الغيار والوارد والمنصرف والباركود</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Package className="w-7 h-7 text-amber-600" />
            المخازن والأرفف والتحميل على الأوناش
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة أرقام الأرفف ورموز المساحات التخزينية (Bin Codes) ومسح الباركود/QR للعد السريع في الصرف والإضافة والمرتجعات
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Smart Scanner Button */}
          <button
            onClick={() => setIsScannerModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95 ring-2 ring-amber-400/40"
          >
            <Scan className="w-4 h-4 text-white" />
            <span>سكانر الباركود والـ QR (عد وصرف وإضافة ومرتجع)</span>
          </button>

          <button
            onClick={() => {
              setVoucherModalType('إذن وارد مخزني (إضافة)');
              setIsVoucherModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <ArrowDownLeft className="w-4 h-4" />
            + إذن وارد (GRN)
          </button>

          <button
            onClick={() => {
              setVoucherModalType('إذن منصرف مخزني (صرف)');
              setIsVoucherModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4" />
            + صرف على رافعة (GIN)
          </button>

          <button
            onClick={() => {
              setVoucherModalType('إذن مرتجع مخزني (مرتجع)');
              setIsVoucherModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            + إذن مرتجع (RTN)
          </button>

          <button
            onClick={() => setIsNewItemModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            + تعريف صنف جديد
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">إجمالي الأصناف المعرفة</span>
            <span className="text-xl font-black text-slate-900 block mt-1">
              {metrics.totalItemsCount} صنف
            </span>
            <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">
              بالمستودع الرئيسي ومخازن المواقع
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">قيمة المخزون المقدرة (EGP)</span>
            <span className="text-xl font-black text-slate-900 block mt-1">
              {metrics.totalInventoryValue.toLocaleString()} ج.م
            </span>
            <span className="text-[11px] text-blue-600 font-bold mt-0.5 block">
              متوسط تكلفة قطع الغيار والزيوت
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">أصناف قاربت النفاد (حد الطلب)</span>
            <span className="text-xl font-black text-red-600 block mt-1">
              {metrics.lowStockItemsCount} صنف
            </span>
            <span className="text-[11px] text-red-700 font-bold mt-0.5 block">
              تتطلب إعادة طلب وتوريد عاجل
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">أذون الحركات المخزنية</span>
            <span className="text-xl font-black text-purple-700 block mt-1">
              {metrics.totalVouchersCount} إذن
            </span>
            <span className="text-[11px] text-purple-600 font-bold mt-0.5 block">
              وارد وإضافة ومنصرف محمل
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-1 bg-white p-1 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'items'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4 text-amber-400" />
          دليل الأصناف وطباعة الملصقات ({stockItems.length})
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'vouchers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4 text-emerald-400" />
          أذون الوارد والمنصرف المحمل ({stockVouchers.length})
        </button>

        <button
          onClick={() => setActiveTab('item-card')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'item-card'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4 text-blue-400" />
          كارت الصنف وسجل الحركات (Item Ledger)
        </button>

        <button
          onClick={() => setActiveTab('warehouses')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'warehouses'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4 text-purple-400" />
          المستودعات والمخازن ({warehouses.length})
        </button>
      </div>

      {/* ================= TAB 1: STOCK ITEMS & STICKER PRINT ================= */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث باسم الصنف، الباركود، الكود، الرف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <select
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none"
              >
                <option value="all">كل المخازن والمستودعات</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nameAr}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none"
              >
                <option value="all">كل التصنيفات</option>
                <option value="فلاتر وزيوت هيدروليكية">فلاتر وزيوت هيدروليكية</option>
                <option value="كابلات وبكرات وايرات">كابلات وبكرات وايرات</option>
                <option value="حساسات وكروت إلكترونية">حساسات وكروت إلكترونية</option>
                <option value="إطارات وجنازير نقل ثقيل">إطارات وجنازير نقل ثقيل</option>
                <option value="مهمات سلامة وأحزمة رفع">مهمات سلامة وأحزمة رفع</option>
              </select>
            </div>

            <span className="text-xs font-semibold text-slate-500">
              عدد الأصناف: {filteredItems.length}
            </span>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isLowStock = item.currentStock <= item.reorderLevel;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.nameAr}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 mb-1">
                          {item.categoryAr}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {item.nameAr}
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-slate-400 block mt-0.5">
                          كود: {item.itemCode}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">الرف والمساحة التخزينية:</span>
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-bold border border-amber-200">
                            {item.shelfNumber || item.rackLocation}
                          </span>
                          {item.storageAreaCode && (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono font-bold border border-slate-200">
                              {item.storageAreaCode}
                            </span>
                          )}
                        </div>
                      </div>

                      {item.warehouseLocationDetails && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            موقع المخزن:
                          </span>
                          <span className="text-slate-700 font-medium truncate max-w-[170px]" title={item.warehouseLocationDetails}>
                            {item.warehouseLocationDetails}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">سعر التكلفة:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {item.costPrice.toLocaleString()} ج.م / {item.unitAr}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">الرصيد المتاح:</span>
                        <span
                          className={`font-mono font-bold text-sm ${
                            isLowStock ? 'text-red-600' : 'text-emerald-700'
                          }`}
                        >
                          {item.currentStock} {item.unitAr}
                        </span>
                      </div>
                    </div>

                    {/* Barcode & QR miniature preview */}
                    <div className="bg-slate-50 p-2 rounded-xl flex items-center justify-between border border-slate-100">
                      <div>
                        <span className="text-[9px] text-slate-400 block mb-0.5 font-bold">باركود الصنف</span>
                        <BarcodeDisplay value={item.barcode} height={20} width={1.2} showText={false} />
                        <span className="text-[9px] font-mono text-slate-600 font-bold block mt-0.5">
                          {item.barcode}
                        </span>
                      </div>
                      <div className="shrink-0">
                        <QRCodeDisplay value={`ITEM:${item.itemCode}|BARCODE:${item.barcode}`} size={38} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedItemForCard(item);
                        setActiveTab('item-card');
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <History className="w-3.5 h-3.5" />
                      كارت الصنف
                    </button>

                    <button
                      onClick={() => setSelectedItemForLabelPrint(item)}
                      className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      طباعة الملصق (Label)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: STOCK VOUCHERS (GRN / GIN WITH ALLOCATION) ================= */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث برقم الإذن، المعدة المنصرف لها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <select
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none"
              >
                <option value="all">كل المستودعات</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs font-semibold text-slate-500">
              إجمالي الأذون: {filteredVouchers.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">رقم الإذن والـ QR</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">نوع الإذن</th>
                    <th className="py-3 px-4">المستودع</th>
                    <th className="py-3 px-4">المورد / المستلم</th>
                    <th className="py-3 px-4">التحميل (الرافعة / السيارة / الإدارة)</th>
                    <th className="py-3 px-4">إجمالي القيمة</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVouchers.map((v) => {
                    const isInward = v.type.includes('وارد');
                    return (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                          <button
                            onClick={() => setSelectedVoucherForPrint(v)}
                            title="عرض الإذن مع رمز QR"
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <span>{v.voucherNo}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{v.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isInward
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {isInward ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            {v.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700 max-w-[140px] truncate">
                          {v.warehouseNameAr}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{v.supplierOrReceiverAr}</td>
                        <td className="py-3 px-4">
                          {!isInward && v.allocatedEquipment ? (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-800 font-bold px-2 py-0.5 rounded border border-red-200 text-[11px]">
                              <Truck className="w-3 h-3 text-red-600" />
                              الرافعة: {v.allocatedEquipment}
                            </span>
                          ) : !isInward && v.allocatedDepartment ? (
                            <span className="text-slate-600">{v.allocatedDepartment}</span>
                          ) : (
                            <span className="text-slate-400">توريد للمخزن العام</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {v.totalAmount.toLocaleString()} ج.م
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedVoucherForPrint(v)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition-colors flex items-center gap-1 mx-auto"
                          >
                            <Printer className="w-3 h-3" />
                            طباعة الإذن
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ITEM CARD (كارت الصنف) ================= */}
      {activeTab === 'item-card' && (
        <div className="space-y-5">
          {/* Item Selector Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-400 block">سجل حركة الصنف التفصيلي</span>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <History className="w-5 h-5 text-blue-600" />
                  كارت الصنف (Item Card Ledger)
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold">اختيار الصنف:</span>
                <select
                  value={selectedItemForCard?.id || ''}
                  onChange={(e) => {
                    const found = stockItems.find((s) => s.id === e.target.value);
                    if (found) setSelectedItemForCard(found);
                  }}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold focus:outline-none min-w-[280px]"
                >
                  {stockItems.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.itemCode} - {s.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedItemForCard && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-3 md:col-span-2">
                  <img
                    src={selectedItemForCard.imageUrl}
                    alt={selectedItemForCard.nameAr}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">
                      كود: {selectedItemForCard.itemCode} | باركود: {selectedItemForCard.barcode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {selectedItemForCard.nameAr}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {selectedItemForCard.warehouseNameAr}
                      </span>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
                        الرف: {selectedItemForCard.shelfNumber || selectedItemForCard.rackLocation}
                      </span>
                      {selectedItemForCard.storageAreaCode && (
                        <span className="text-[11px] font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-300">
                          المساحة: {selectedItemForCard.storageAreaCode}
                        </span>
                      )}
                    </div>
                    {selectedItemForCard.warehouseLocationDetails && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        الموقع: {selectedItemForCard.warehouseLocationDetails}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 block">سعر التكلفة المتوسط</span>
                  <span className="text-base font-black text-slate-900 block mt-0.5">
                    {selectedItemForCard.costPrice.toLocaleString()} ج.م
                  </span>
                  <span className="text-[10px] text-slate-500">لكل {selectedItemForCard.unitAr}</span>
                </div>

                <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-300 block">الرصيد الفعلي الحالي</span>
                  <span className="text-xl font-black text-amber-400 block mt-0.5">
                    {selectedItemForCard.currentStock} {selectedItemForCard.unitAr}
                  </span>
                  <span className="text-[10px] text-slate-300">حد إعادة الطلب: {selectedItemForCard.reorderLevel}</span>
                </div>
              </div>
            )}
          </div>

          {/* Item Ledger Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">حركات الوارد والمنصرف ورصيد الصنف</h3>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                طباعة كارت الصنف
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">نوع الحركة</th>
                    <th className="py-3 px-4">رقم الإذن</th>
                    <th className="py-3 px-4">الوارد (+)</th>
                    <th className="py-3 px-4">المنصرف (-)</th>
                    <th className="py-3 px-4">الرصيد بعد الحركة</th>
                    <th className="py-3 px-4">جهة الصرف والتحميل على المعدة</th>
                    <th className="py-3 px-4">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeItemCardEntries.map((entry) => {
                    const isOpening = entry.voucherType === 'رصيد افتتاحي';
                    const isInward = entry.voucherType === 'إذن وارد';
                    return (
                      <tr key={entry.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-600">{entry.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isOpening
                                ? 'bg-blue-100 text-blue-800'
                                : isInward
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {entry.voucherType}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{entry.voucherNo}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                          {entry.qtyIn > 0 ? `+${entry.qtyIn}` : '-'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-red-700">
                          {entry.qtyOut > 0 ? `-${entry.qtyOut}` : '-'}
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-slate-900">
                          {entry.balanceAfter} {selectedItemForCard?.unitAr}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {entry.allocatedToAr ? (
                            <span className="inline-flex items-center gap-1 text-red-800 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              <Truck className="w-3 h-3 text-red-600" />
                              {entry.allocatedToAr}
                            </span>
                          ) : (
                            <span className="text-slate-400">مخزن عام</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{entry.notes || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: WAREHOUSES DIRECTORY ================= */}
      {activeTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warehouses.map((wh) => (
            <div
              key={wh.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-1">
                    {wh.type}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{wh.nameAr}</h3>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">كود: {wh.code}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <Building className="w-5 h-5 text-amber-600" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">أمين المستودع:</span>
                  <span className="font-semibold text-slate-800">{wh.keeperAr}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">الموقع الجغرافي:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[170px]">{wh.locationAr}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  الأصناف المتوفرة:{' '}
                  <strong className="text-slate-800 font-bold">
                    {stockItems.filter((i) => i.warehouseId === wh.id).length}
                  </strong>
                </span>
                <button
                  onClick={() => {
                    setSelectedWarehouseId(wh.id);
                    setActiveTab('items');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                >
                  استعراض الأصناف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: PRINT ITEM STICKER / TAG (IMAGE + BARCODE + QR) ================= */}
      {selectedItemForLabelPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-600" />
                معاينة ملصق الصنف للطباعة والتثبيت (Tag Sticker)
              </h3>
              <button
                onClick={() => setSelectedItemForLabelPrint(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* The Actual Physical Sticker Preview to Print */}
            <div
              id="printable-item-tag"
              className="bg-white border-2 border-dashed border-slate-400 p-4 rounded-2xl shadow-inner space-y-3"
            >
              {/* Header: Company Name & Part Code */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/aistudio/Industrial_Crane_Emblem_and_Wordmark__1__8be0357c.png"
                    alt="Egypt Cranes"
                    className="w-7 h-7 object-contain"
                  />
                  <div>
                    <span className="text-[10px] font-black text-slate-800 block leading-tight">
                      EGYPT CRANES - قطع الغيار والمهمات
                    </span>
                    <span className="text-[8px] text-slate-400 block leading-tight">المستودعات المركزية</span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="font-mono text-xs font-black text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {selectedItemForLabelPrint.itemCode}
                  </span>
                </div>
              </div>

              {/* Item Image + Name & Rack Location */}
              <div className="flex items-center gap-3">
                <img
                  src={selectedItemForLabelPrint.imageUrl}
                  alt={selectedItemForLabelPrint.nameAr}
                  className="w-18 h-18 rounded-xl object-cover border border-slate-300 shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="text-xs font-black text-slate-900 leading-snug">
                    {selectedItemForLabelPrint.nameAr}
                  </h4>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {selectedItemForLabelPrint.nameEn}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                      رقم الرف: {selectedItemForLabelPrint.shelfNumber || selectedItemForLabelPrint.rackLocation}
                    </span>
                    {selectedItemForLabelPrint.storageAreaCode && (
                      <span className="bg-slate-800 text-white font-mono px-2 py-0.5 rounded">
                        المساحة: {selectedItemForLabelPrint.storageAreaCode}
                      </span>
                    )}
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      الوحدة: {selectedItemForLabelPrint.unitAr}
                    </span>
                  </div>
                  {selectedItemForLabelPrint.warehouseLocationDetails && (
                    <div className="text-[9px] text-slate-600 flex items-center gap-1 pt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      <span>الموقع: {selectedItemForLabelPrint.warehouseLocationDetails}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vector Barcode (Code 128) + Live Scannable QR Code */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 bg-slate-50/80 p-2.5 rounded-xl">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-bold text-slate-400 mb-0.5 uppercase">كود الباركود</span>
                  <BarcodeDisplay value={selectedItemForLabelPrint.barcode} height={32} width={1.4} />
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-bold text-slate-400 mb-0.5 uppercase">مسح للتحقق QR</span>
                  <QRCodeDisplay
                    value={`EC-SP:${selectedItemForLabelPrint.itemCode}|BARCODE:${selectedItemForLabelPrint.barcode}|SHELF:${selectedItemForLabelPrint.shelfNumber || selectedItemForLabelPrint.rackLocation}|BIN:${selectedItemForLabelPrint.storageAreaCode || ''}`}
                    size={58}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedItemForLabelPrint(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                طباعة لاصقة الصنف (Label Tag)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRINT STOCK VOUCHER (QR) ================= */}
      {selectedVoucherForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/Industrial_Crane_Emblem_and_Wordmark__1__8be0357c.png"
                  alt="Egypt Cranes"
                  className="w-11 h-11 object-contain"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900">شركة مصر للمقاولات المتخصصة (إيجيبت كرينز)</h3>
                  <span className="text-xs text-slate-500 font-medium">إدارة المستودعات وقطع الغيار المركزية</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVoucherForPrint(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Info */}
            <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-200">
              <h2 className="text-lg font-black text-slate-900">{selectedVoucherForPrint.type}</h2>
              <span className="font-mono text-xs font-bold text-amber-700">
                رقم الإذن: {selectedVoucherForPrint.voucherNo} | التاريخ: {selectedVoucherForPrint.date}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-bold block">المستودع:</span>
                <span className="font-bold text-slate-800">{selectedVoucherForPrint.warehouseNameAr}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">المورد / المستلم:</span>
                <span className="font-bold text-slate-800">{selectedVoucherForPrint.supplierOrReceiverAr}</span>
              </div>
              {selectedVoucherForPrint.allocatedEquipment && (
                <div className="col-span-2 bg-red-50 p-2 rounded-lg border border-red-200">
                  <span className="text-red-800 font-bold block">التحميل المالي المباشر على المعدة:</span>
                  <span className="text-red-950 font-black text-xs">
                    {selectedVoucherForPrint.allocatedEquipment} (المشروع: {selectedVoucherForPrint.allocatedProject || 'ميداني'})
                  </span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold">
                    <th className="py-2 px-3">كود الصنف</th>
                    <th className="py-2 px-3">اسم الصنف والمواصفات</th>
                    <th className="py-2 px-3">الكمية</th>
                    <th className="py-2 px-3">سعر الوحدة</th>
                    <th className="py-2 px-3">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedVoucherForPrint.items.map((line, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{line.itemCode}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{line.itemNameAr}</td>
                      <td className="py-2 px-3 font-mono font-bold">{line.qty}</td>
                      <td className="py-2 px-3 font-mono">{line.unitPrice.toLocaleString()} ج.م</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">
                        {line.totalAmount.toLocaleString()} ج.م
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-black text-slate-900">
                    <td colSpan={4} className="py-2 px-3 text-left">إجمالي الإذن:</td>
                    <td className="py-2 px-3 font-mono text-base text-red-700">
                      {selectedVoucherForPrint.totalAmount.toLocaleString()} ج.م
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* QR Verification Bar */}
            <div className="flex items-center justify-between bg-slate-900 text-white p-3.5 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-emerald-400 block mb-0.5">
                  رمز التحقق المخزني QR Code
                </span>
                <span className="text-[10px] text-slate-300 block max-w-sm">
                  كود فحص الإذن الرقمي لربط صرف القطع مع بطاقة صيانة الرافعة
                </span>
                <span className="font-mono text-[9px] text-slate-400 block mt-1 truncate max-w-xs">
                  {selectedVoucherForPrint.qrPayload}
                </span>
              </div>
              <div className="bg-white p-1 rounded-xl shrink-0">
                <QRCodeDisplay value={selectedVoucherForPrint.qrPayload} size={80} />
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200 text-center text-xs">
              <div>
                <span className="text-slate-400 block mb-4 font-bold">أمين المستودع</span>
                <span className="font-bold text-slate-800">{selectedVoucherForPrint.storeKeeperAr}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-4 font-bold">المستلم الفعلي</span>
                <span className="font-bold text-slate-800">{selectedVoucherForPrint.supplierOrReceiverAr}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-4 font-bold">اعتماد الصيانة والتشغيل</span>
                <span className="font-bold text-slate-800">م. طارق بدير</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedVoucherForPrint(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                طباعة إذن الصرف / الوارد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: NEW VOUCHER (INWARD / OUTWARD CHARGED TO CRANE) ================= */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                إنشاء {voucherModalType} مع التحميل
              </h3>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">المستودع المعني</label>
                  <select
                    value={formVoucher.warehouseId}
                    onChange={(e) => setFormVoucher({ ...formVoucher, warehouseId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">تاريخ الإذن</label>
                  <input
                    type="date"
                    value={formVoucher.date}
                    onChange={(e) => setFormVoucher({ ...formVoucher, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  {voucherModalType.includes('وارد')
                    ? 'المورد / جهة التوريد'
                    : voucherModalType.includes('مرتجع')
                    ? 'الفني / مشغل الرافعة / القائم بالارتجاع'
                    : 'المستلم / مشغل الرافعة / الفني'}
                </label>
                <input
                  type="text"
                  placeholder={
                    voucherModalType.includes('وارد')
                      ? 'مثال: شركة ليبهير الألمانية / وكيل الزيوت...'
                      : voucherModalType.includes('مرتجع')
                      ? 'مثال: فني الصيانة حسام الدين / مشغل الونش 500 طن...'
                      : 'مثال: كابتن عزت البرلسي (مشغل الونش 500 طن)...'
                  }
                  value={formVoucher.supplierOrReceiverAr}
                  onChange={(e) => setFormVoucher({ ...formVoucher, supplierOrReceiverAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  required
                />
              </div>

              {/* CRANE ALLOCATION SECTION (For Outward Issue or Return from Crane) */}
              {!voucherModalType.includes('وارد') && (
                <div className={`p-3.5 rounded-2xl border space-y-3 ${
                  voucherModalType.includes('مرتجع')
                    ? 'bg-blue-50/70 border-blue-200'
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className={`flex items-center gap-1.5 font-black ${
                    voucherModalType.includes('مرتجع') ? 'text-blue-900' : 'text-amber-900'
                  }`}>
                    {voucherModalType.includes('مرتجع') ? (
                      <RotateCcw className="w-4 h-4 text-blue-700" />
                    ) : (
                      <Truck className="w-4 h-4 text-amber-700" />
                    )}
                    {voucherModalType.includes('مرتجع')
                      ? 'المعدة أو المشروع المرتجع منه الصنف للمستودع:'
                      : 'التحميل المالي على المعدة أو السيارة أو الإدارة المنصرف لها:'}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block font-bold mb-1 ${
                        voucherModalType.includes('مرتجع') ? 'text-blue-800' : 'text-amber-800'
                      }`}>
                        {voucherModalType.includes('مرتجع')
                          ? 'الرافعة أو المعدة المرتجع منها (Fleet Crane)'
                          : 'الرافعة أو المعدة المنصرف لها (Fleet Crane)'}
                      </label>
                      <select
                        value={formVoucher.allocatedEquipment}
                        onChange={(e) => setFormVoucher({ ...formVoucher, allocatedEquipment: e.target.value })}
                        className={`w-full bg-white border rounded-xl px-3 py-2 font-bold text-slate-900 ${
                          voucherModalType.includes('مرتجع') ? 'border-blue-300' : 'border-amber-300'
                        }`}
                      >
                        <option value="">
                          {voucherModalType.includes('مرتجع') ? 'بدون رافعة محددة (مرتجع عام)' : 'بدون رافعة محددة (صرف عام)'}
                        </option>
                        {fleet.map((crane) => (
                          <option key={crane.id} value={`${crane.model} (${crane.capacityTon}T)`}>
                            {crane.model} ({crane.capacityTon} طن) - {crane.typeAr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block font-bold mb-1 ${
                        voucherModalType.includes('مرتجع') ? 'text-blue-800' : 'text-amber-800'
                      }`}>
                        سيارة الخدمة أو النقل (اختياري)
                      </label>
                      <input
                        type="text"
                        placeholder="شاحنة مرسيدس أكتروس / سيارة الصيانة..."
                        value={formVoucher.allocatedVehicle}
                        onChange={(e) => setFormVoucher({ ...formVoucher, allocatedVehicle: e.target.value })}
                        className={`w-full bg-white border rounded-xl px-3 py-2 ${
                          voucherModalType.includes('مرتجع') ? 'border-blue-300' : 'border-amber-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block font-bold mb-1 ${
                        voucherModalType.includes('مرتجع') ? 'text-blue-800' : 'text-amber-800'
                      }`}>
                        {voucherModalType.includes('مرتجع') ? 'الإدارة المرتجع منها' : 'الإدارة المنصرف لها'}
                      </label>
                      <select
                        value={formVoucher.allocatedDepartment}
                        onChange={(e) => setFormVoucher({ ...formVoucher, allocatedDepartment: e.target.value })}
                        className={`w-full bg-white border rounded-xl px-3 py-2 font-medium ${
                          voucherModalType.includes('مرتجع') ? 'border-blue-300' : 'border-amber-300'
                        }`}
                      >
                        <option value="إدارة التشغيل الميداني">إدارة التشغيل الميداني</option>
                        <option value="إدارة الصيانة والدعم الفني">إدارة الصيانة والدعم الفني</option>
                        <option value="إدارة الحركة والنقل الثقيل">إدارة الحركة والنقل الثقيل</option>
                        <option value="إدارة السلامة والصحة المهنية (HSE)">إدارة السلامة والصحة المهنية (HSE)</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block font-bold mb-1 ${
                        voucherModalType.includes('مرتجع') ? 'text-blue-800' : 'text-amber-800'
                      }`}>
                        {voucherModalType.includes('مرتجع') ? 'الموقع أو المشروع المرتجع منه' : 'المشروع الميداني المنصرف له'}
                      </label>
                      <input
                        type="text"
                        placeholder="مشروع حقل ظهر / مونوريل العاصمة..."
                        value={formVoucher.allocatedProject}
                        onChange={(e) => setFormVoucher({ ...formVoucher, allocatedProject: e.target.value })}
                        className={`w-full bg-white border rounded-xl px-3 py-2 ${
                          voucherModalType.includes('مرتجع') ? 'border-blue-300' : 'border-amber-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Items List Rows */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">الأصناف والكميات:</span>
                  <button
                    type="button"
                    onClick={handleAddVoucherItemRow}
                    className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + إضافة بند آخر
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                  {formVoucher.items.map((line, index) => {
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200"
                      >
                        <div className="col-span-6">
                          <select
                            value={line.itemId}
                            onChange={(e) => {
                              const itm = stockItems.find((s) => s.id === e.target.value);
                              const updated = [...formVoucher.items];
                              updated[index] = {
                                ...updated[index],
                                itemId: e.target.value,
                                unitPrice: itm?.costPrice || 0,
                              };
                              setFormVoucher({ ...formVoucher, items: updated });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                          >
                            {stockItems.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.nameAr} (متاح: {s.currentStock} {s.unitAr})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-2">
                          <input
                            type="number"
                            min="1"
                            value={line.qty}
                            onChange={(e) => {
                              const updated = [...formVoucher.items];
                              updated[index] = { ...updated[index], qty: Number(e.target.value) };
                              setFormVoucher({ ...formVoucher, items: updated });
                            }}
                            placeholder="الكمية"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-bold font-mono text-center"
                          />
                        </div>

                        <div className="col-span-3">
                          <input
                            type="number"
                            value={line.unitPrice}
                            onChange={(e) => {
                              const updated = [...formVoucher.items];
                              updated[index] = { ...updated[index], unitPrice: Number(e.target.value) };
                              setFormVoucher({ ...formVoucher, items: updated });
                            }}
                            placeholder="السعر"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-bold font-mono text-center"
                          />
                        </div>

                        <div className="col-span-1 text-center">
                          {formVoucher.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVoucherItemRow(index)}
                              className="text-red-500 hover:text-red-700 font-bold text-xs"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">الملاحظات وسبب الصرف / التوريد</label>
                <textarea
                  rows={2}
                  placeholder="بيان سبب الصرف أو التوريد..."
                  value={formVoucher.notes}
                  onChange={(e) => setFormVoucher({ ...formVoucher, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold shadow-md hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  حفظ وتوليد الإذن المخزني مع QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DEFINE NEW ITEM ================= */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                تعريف كارت صنف جديد (مع الباركود وQR)
              </h3>
              <button
                onClick={() => setIsNewItemModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">كود الصنف (Item Code)</label>
                  <input
                    type="text"
                    value={formItem.itemCode || ''}
                    onChange={(e) => setFormItem({ ...formItem, itemCode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">الباركود (Barcode)</label>
                  <input
                    type="text"
                    value={formItem.barcode || ''}
                    onChange={(e) => setFormItem({ ...formItem, barcode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">اسم الصنف باللغة العربية</label>
                <input
                  type="text"
                  placeholder="مثال: فلتر ديزل رئيسي لرافعة ليبهير 500 طن..."
                  value={formItem.nameAr || ''}
                  onChange={(e) => setFormItem({ ...formItem, nameAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">التصنيف الرئيسي</label>
                  <select
                    value={formItem.categoryAr}
                    onChange={(e) =>
                      setFormItem({ ...formItem, categoryAr: e.target.value as StockItem['categoryAr'] })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="فلاتر وزيوت هيدروليكية">فلاتر وزيوت هيدروليكية</option>
                    <option value="كابلات وبكرات وايرات">كابلات وبكرات وايرات</option>
                    <option value="حساسات وكروت إلكترونية">حساسات وكروت إلكترونية</option>
                    <option value="إطارات وجنازير نقل ثقيل">إطارات وجنازير نقل ثقيل</option>
                    <option value="مهمات سلامة وأحزمة رفع">مهمات سلامة وأحزمة رفع</option>
                    <option value="قطع غيار محركات ديزل">قطع غيار محركات ديزل</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">وحدة القياس</label>
                  <select
                    value={formItem.unitAr}
                    onChange={(e) =>
                      setFormItem({ ...formItem, unitAr: e.target.value as StockItem['unitAr'] })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="قطعة">قطعة</option>
                    <option value="طقم">طقم</option>
                    <option value="برميل 208 لتر">برميل 208 لتر</option>
                    <option value="متر طولي">متر طولي</option>
                    <option value="علبة">علبة</option>
                    <option value="بكرة">بكرة</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">رصيد أول المدة</label>
                  <input
                    type="number"
                    value={formItem.openingStock || ''}
                    onChange={(e) => setFormItem({ ...formItem, openingStock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">حد إعادة الطلب</label>
                  <input
                    type="number"
                    value={formItem.reorderLevel || ''}
                    onChange={(e) => setFormItem({ ...formItem, reorderLevel: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">سعر التكلفة (ج.م)</label>
                  <input
                    type="number"
                    value={formItem.costPrice || ''}
                    onChange={(e) => setFormItem({ ...formItem, costPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">المستودع الرئيسي</label>
                  <select
                    value={formItem.warehouseId}
                    onChange={(e) => setFormItem({ ...formItem, warehouseId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">رقم الرف (Shelf / Rack Number)</label>
                  <input
                    type="text"
                    placeholder="مثال: رف A-01 / خزانة B-03..."
                    value={formItem.shelfNumber || ''}
                    onChange={(e) =>
                      setFormItem({
                        ...formItem,
                        shelfNumber: e.target.value,
                        rackLocation: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    رمز المساحة التخزينية (Bin Code)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: BIN-HYD-102 / BIN-104..."
                    value={formItem.storageAreaCode || ''}
                    onChange={(e) => setFormItem({ ...formItem, storageAreaCode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    موقعها بالمخزن (Warehouse Physical Location)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: عنبر الهيدروليك - الممر 2 - المستوى 3..."
                    value={formItem.warehouseLocationDetails || ''}
                    onChange={(e) => setFormItem({ ...formItem, warehouseLocationDetails: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">رابط صورة الصنف (Image URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formItem.imageUrl || ''}
                  onChange={(e) => setFormItem({ ...formItem, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold shadow-md hover:bg-slate-800"
                >
                  حفظ وتوليد كارت الصنف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= SMART SCANNER MODAL (BARCODE & QR WITH RAPID COUNTING) ================= */}
      <StockBarcodeScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        stockItems={stockItems}
        warehouses={warehouses}
        fleet={fleet}
        onCommitOperation={({ type, item, qty, warehouseId, allocatedEquipment, notes }) => {
          const wh = warehouses.find((w) => w.id === warehouseId);
          saveStockVoucher({
            type,
            warehouseId,
            warehouseNameAr: wh ? wh.nameAr : 'المستودع الرئيسي',
            date: formatDateISO(new Date()),
            items: [
              {
                itemId: item.id,
                itemCode: item.itemCode,
                itemNameAr: item.nameAr,
                qty,
                unitPrice: item.costPrice,
                totalAmount: qty * item.costPrice,
              },
            ],
            totalAmount: qty * item.costPrice,
            supplierOrReceiverAr: allocatedEquipment || currentUser.nameAr,
            costAllocationType: type.includes('صرف') ? 'معدة أو رافعة' : undefined,
            allocatedEquipment: allocatedEquipment || undefined,
            notes: notes || `عملية سريعة عبر ماسح الباركود والـ QR (${type})`,
            storeKeeperAr: currentUser.nameAr,
            status: 'معتمد ومصروف',
          });
        }}
      />
    </div>
  );
};
