import React, { useState, useEffect, useRef } from 'react';
import {
  Scan,
  Camera,
  Keyboard,
  X,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  Minus,
  RotateCcw,
  Package,
  Layers,
  MapPin,
  Tag,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { StockItem, Warehouse, EgyptCraneFleetItem } from '../../types/erp';
import { formatDateISO } from '../../utils/hijri';

interface StockBarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItems: StockItem[];
  warehouses: Warehouse[];
  fleet: EgyptCraneFleetItem[];
  onCommitOperation: (params: {
    type: 'إذن وارد مخزني (إضافة)' | 'إذن منصرف مخزني (صرف)' | 'إذن مرتجع مخزني (مرتجع)';
    item: StockItem;
    qty: number;
    warehouseId: string;
    allocatedEquipment?: string;
    notes?: string;
  }) => void;
}

export const StockBarcodeScannerModal: React.FC<StockBarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  stockItems,
  warehouses,
  fleet,
  onCommitOperation,
}) => {
  const [operationMode, setOperationMode] = useState<
    'إذن وارد مخزني (إضافة)' | 'إذن منصرف مخزني (صرف)' | 'إذن مرتجع مخزني (مرتجع)' | 'فحص وجرد'
  >('إذن منصرف مخزني (صرف)');

  const [inputCode, setInputCode] = useState('');
  const [scannedItem, setScannedItem] = useState<StockItem | null>(stockItems[0] || null);
  const [scanCount, setScanCount] = useState<number>(1);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedCrane, setSelectedCrane] = useState<string>(
    fleet[0] ? `${fleet[0].model} (${fleet[0].capacityTon}T)` : ''
  );
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(
    warehouses[0]?.id || ''
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recentScans, setRecentScans] = useState<
    { item: StockItem; timestamp: string; count: number; op: string }[]
  >([]);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const cameraContainerId = 'qr-reader-video-box';

  // Sound feedback synthesizer
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 tone
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {}
  };

  const handleProcessCode = (rawCode: string) => {
    const clean = rawCode.trim();
    if (!clean) return;

    // Look for item matching barcode, itemCode, or embedded QR code pattern
    const matched = stockItems.find(
      (item) =>
        item.barcode === clean ||
        item.itemCode === clean ||
        clean.includes(item.barcode) ||
        clean.includes(item.itemCode)
    );

    if (matched) {
      playBeep();
      setScannedItem(matched);
      // If already scanning this item, increment count; otherwise reset to 1
      if (scannedItem?.id === matched.id) {
        setScanCount((prev) => prev + 1);
      } else {
        setScanCount(1);
      }
    } else {
      // Try fuzzy match
      const fuzzy = stockItems.find(
        (item) =>
          item.nameAr.includes(clean) ||
          item.rackLocation.includes(clean) ||
          (item.shelfNumber && item.shelfNumber.includes(clean))
      );
      if (fuzzy) {
        playBeep();
        setScannedItem(fuzzy);
        setScanCount(1);
      }
    }
  };

  // Hardware barcode scanner gun listener (types characters rapidly and ends with Enter)
  useEffect(() => {
    if (!isOpen) return;

    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is actively typing in a standard input, don't hijack unless it's enter
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' && target.id !== 'scanner-manual-input') {
        return;
      }

      const now = Date.now();
      if (now - lastKeyTime > 300) {
        buffer = '';
      }
      lastKeyTime = now;

      if (e.key === 'Enter') {
        if (buffer.length >= 3) {
          handleProcessCode(buffer);
          buffer = '';
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, scannedItem, stockItems]);

  // Camera Scanner lifecycle
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(cameraContainerId);
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleProcessCode(decodedText);
        },
        () => {
          // ignore frame decode misses
        }
      );
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera start error:', err);
      setCameraError('تعذر تشغيل الكاميرا (يرجى التحقق من الأذونات أو استخدام الإدخال اليدوي / قارئ الباركود)');
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && isCameraActive) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch {}
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop().catch(() => {});
        } catch {}
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleExecute = () => {
    if (!scannedItem) return;
    if (operationMode === 'فحص وجرد') {
      onClose();
      return;
    }

    onCommitOperation({
      type: operationMode,
      item: scannedItem,
      qty: scanCount,
      warehouseId: selectedWarehouseId,
      allocatedEquipment:
        operationMode === 'إذن منصرف مخزني (صرف)' || operationMode === 'إذن مرتجع مخزني (مرتجع)'
          ? selectedCrane
          : undefined,
      notes: `تم التنفيذ عبر الماسح الضوئي الذكي (Barcode Scanner) بكمية ${scanCount} ${scannedItem.unitAr}`,
    });

    setRecentScans((prev) => [
      {
        item: scannedItem,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        count: scanCount,
        op: operationMode,
      },
      ...prev.slice(0, 4),
    ]);

    setScanCount(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                سكانر الباركود والـ QR الذكي للعد والحركات المخزنية
              </h3>
              <span className="text-xs text-slate-500 font-medium block">
                تسهيل وتسريع عمليات الصرف مع التحميل على الأوناش، الإضافة والتوريد، والمرتجعات
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'كتم صوت البيب' : 'تفعيل صوت البيب'}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Operation Mode Selector */}
        <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setOperationMode('إذن منصرف مخزني (صرف)')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              operationMode === 'إذن منصرف مخزني (صرف)'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Minus className="w-3.5 h-3.5" />
            صرف على رافعة / معدة
          </button>

          <button
            onClick={() => setOperationMode('إذن وارد مخزني (إضافة)')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              operationMode === 'إذن وارد مخزني (إضافة)'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة وتوريد وارد
          </button>

          <button
            onClick={() => setOperationMode('إذن مرتجع مخزني (مرتجع)')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              operationMode === 'إذن مرتجع مخزني (مرتجع)'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            مرتجع من موقع / ونش
          </button>

          <button
            onClick={() => setOperationMode('فحص وجرد')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              operationMode === 'فحص وجرد'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            فحص موقع الرف والبيانات
          </button>
        </div>

        {/* Input & Scanner Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column A: Barcode Gun / Manual Input & Camera Toggle */}
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Keyboard className="w-4 h-4 text-slate-500" />
                  مسح بقارئ الباركود (Barcode Gun) أو إدخال الكود
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  القارئ الليزري متصل تلقائياً
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  id="scanner-manual-input"
                  type="text"
                  placeholder="وجه مسدس الباركود هنا أو اكتب كود الصنف..."
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleProcessCode(inputCode);
                      setInputCode('');
                    }
                  }}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleProcessCode(inputCode);
                    setInputCode('');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  تأكيد
                </button>
              </div>

              {/* Fast Test Items Buttons */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-1.5">
                  أصناف سريعة للاختبار الفوري بنقرة واحدة:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stockItems.slice(0, 4).map((itm) => (
                    <button
                      key={itm.id}
                      type="button"
                      onClick={() => handleProcessCode(itm.barcode)}
                      className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 text-[10px] font-bold transition-colors"
                    >
                      {itm.nameAr.split(' ').slice(0, 3).join(' ')} ({itm.barcode.slice(-4)})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Camera Scanner Viewfinder */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-slate-500" />
                  المسح المباشر بكاميرا الهاتف أو الجهاز
                </span>

                {!isCameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    تشغيل الكاميرا
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                  >
                    إيقاف الكاميرا
                  </button>
                )}
              </div>

              <div
                id={cameraContainerId}
                className={`w-full overflow-hidden rounded-xl border border-slate-300 flex items-center justify-center transition-all ${
                  isCameraActive ? 'min-h-[180px] bg-black' : 'h-16 bg-slate-100 text-slate-400 text-xs'
                }`}
              >
                {!isCameraActive && <span>الكاميرا متوقفة (انقر تشغيل لتفعيل قارئ الكاميرا)</span>}
              </div>

              {cameraError && (
                <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                  {cameraError}
                </div>
              )}
            </div>
          </div>

          {/* Column B: Scanned Item Details with Shelf Number, Bin Code, and Location */}
          <div className="space-y-3">
            {scannedItem ? (
              <div className="bg-slate-50 rounded-2xl p-4.5 border-2 border-amber-300 space-y-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <img
                    src={scannedItem.imageUrl}
                    alt={scannedItem.nameAr}
                    className="w-18 h-18 rounded-2xl object-cover border border-slate-300 shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 mb-1">
                      {scannedItem.categoryAr}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {scannedItem.nameAr}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
                      كود: {scannedItem.itemCode} | باركود: {scannedItem.barcode}
                    </span>
                  </div>
                </div>

                {/* Storage Location & Shelf Details requested by User */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">رقم الرف (Shelf No):</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded inline-block">
                      {scannedItem.shelfNumber || scannedItem.rackLocation || 'رف A-01'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">رمز المساحة التخزينية (Bin):</span>
                    <span className="font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block">
                      {scannedItem.storageAreaCode || 'BIN-401'}
                    </span>
                  </div>

                  <div className="col-span-2 pt-1 border-t border-slate-100 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block">موقعها التفصيلي بالمخزن:</span>
                    <span className="font-medium text-slate-800 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      {scannedItem.warehouseLocationDetails || 'الممر الرئيسي - قطاع قطع الغيار الثقيلة'}
                    </span>
                  </div>
                </div>

                {/* Stock Level & Price */}
                <div className="flex items-center justify-between text-xs bg-slate-100 p-2.5 rounded-xl">
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px]">الرصيد المتاح بالمخزن</span>
                    <span className="text-base font-black text-slate-900">
                      {scannedItem.currentStock} {scannedItem.unitAr}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px]">سعر التكلفة</span>
                    <span className="text-sm font-bold text-slate-900">
                      {scannedItem.costPrice.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px]">حد الطلب</span>
                    <span className="text-xs font-bold text-red-600 font-mono">
                      {scannedItem.reorderLevel} {scannedItem.unitAr}
                    </span>
                  </div>
                </div>

                {/* Counter & Action Controls */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">كمية العملية (العد بالمسح):</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setScanCount((prev) => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={scanCount}
                        onChange={(e) => setScanCount(Math.max(1, Number(e.target.value)))}
                        className="w-14 text-center font-mono font-black text-base bg-white border border-slate-300 rounded-lg py-1"
                      />
                      <button
                        type="button"
                        onClick={() => setScanCount((prev) => prev + 1)}
                        className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-600 font-bold text-white flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Crane allocation selector if issuing or returning */}
                  {(operationMode === 'إذن منصرف مخزني (صرف)' || operationMode === 'إذن مرتجع مخزني (مرتجع)') && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                        {operationMode === 'إذن منصرف مخزني (صرف)' ? 'تحميل التكلفة على الرافعة:' : 'مرتجع من الرافعة:'}
                      </label>
                      <select
                        value={selectedCrane}
                        onChange={(e) => setSelectedCrane(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
                      >
                        {fleet.map((crane) => (
                          <option key={crane.id} value={`${crane.model} (${crane.capacityTon}T)`}>
                            {crane.model} ({crane.capacityTon} طن)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleExecute}
                    className={`w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 ${
                      operationMode === 'إذن منصرف مخزني (صرف)'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : operationMode === 'إذن وارد مخزني (إضافة)'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : operationMode === 'إذن مرتجع مخزني (مرتجع)'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      تأكيد وتنفيذ {operationMode} (كمية: {scanCount})
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center text-slate-400 space-y-2">
                <Scan className="w-10 h-10 mx-auto text-slate-300 animate-pulse" />
                <span className="text-xs font-bold block text-slate-600">بانتظار مسح الباركود أو الـ QR</span>
                <p className="text-[11px] text-slate-400">
                  وجه القارئ الليزري أو الكاميرا نحو كود الصنف ليظهر فوراً مع رقم الرف والمساحة التخزينية
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Recent Scanned History */}
        {recentScans.length > 0 && (
          <div className="pt-3 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
              آخر عمليات المسح المنفذة في هذه الجلسة:
            </span>
            <div className="flex flex-wrap gap-2">
              {recentScans.map((r, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-[10px] flex items-center gap-1.5"
                >
                  <span className="font-bold text-slate-800">{r.item.nameAr.slice(0, 25)}</span>
                  <span className="font-mono font-bold text-amber-700">({r.count} قطعة)</span>
                  <span className="text-slate-400">{r.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
