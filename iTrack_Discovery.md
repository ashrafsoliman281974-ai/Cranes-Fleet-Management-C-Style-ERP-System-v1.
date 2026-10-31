# تقرير استكشاف ومواصفات تكامل i-Track GPS مع منظومة أسطول الأوناش
## (i-Track GPS Discovery & Implementation Specification)

**النظام المستهدف:** i-Track Telematics & Fleet Tracking API v2  
**الجهة:** شركة مصر للمقاولات المتخصصة (Egypt Cranes)  
**تاريخ الإعداد:** 31 أكتوبر 2026

---

## 1. أهداف التكامل المؤسسي

1. **الربط المباشر بين منظومة التتبع ومراكز التكلفة المحاسبية:**
   - ربط كل معرف جهاز تتبع (IMEI / Unit ID) بالرافعة المقابلة لها في جدول الأسطول (`flt-1` وحتى `flt-7`)، وتوجيه بيانات الاستهلاك تلقائياً إلى مركز التكلفة المرتبط بالرافعة والمشروع القائم.
2. **الرقابة الميدانية على استهلاك الوقود وساعات عمل المحرك (Engine Hours):**
   - استخراج قراءات حساس تشغيل المحرك (Ignition On/Off) وقراءات ناقل بيانات الرافعة (CAN-Bus Engine RPM / J1939).
   - احتساب إجمالي ساعات دوران المحرك خلال وردية العمل لمطابقتها مع دفاتر يوميات التشغيل الموقعة من مهندسي الموقع.
3. **كشف الهدر والانحرافات التشغيلية:**
   - الكشف الفوري عن فترات الدوران بدون عمل (Excessive Idling).
   - الكشف عن التناقضات بين ساعات الفاتورة المصدرة للعميل وساعات التشغيل الحقيقية المسجلة بالأقمار الصناعية لمنع النزاعات التعاقدية.

---

## 2. بروتوكول ونقاط نهاية واجهة برمجة التطبيقات (API Endpoints)

### أ. المصادقة والتوثيق (Authentication)
- يتم الحصول على رمز وصول حامل (Bearer JWT Token) باستخدام مفتاح العميل السري `client_id` و `client_secret`.
- صلاحية الرمز 24 ساعة مع إمكانية التجديد التلقائي (Auto Refresh).

```http
POST https://api.itrack-telematics.eg/v2/auth/token
Content-Type: application/json

{
  "client_id": "egypt_cranes_telematics_prod",
  "client_secret": "SEC_EC_ITRACK_9981240182",
  "grant_type": "client_credentials"
}
```

### ب. جلب الحالات اللحظية للمعدات (Fleet Live Telemetry)
```http
GET https://api.itrack-telematics.eg/v2/units/live-status
Authorization: Bearer {token}
```
**استجابة الحزمة (Payload Sample):**
```json
[
  {
    "unit_id": "TRK-LBH-1200",
    "imei": "864192048102911",
    "crane_code": "EC-1200-01",
    "latitude": 31.0428,
    "longitude": 28.4312,
    "speed_kmh": 0,
    "ignition_state": "ON",
    "pto_state": "ENGAGED",
    "engine_hours_total": 3854.2,
    "fuel_level_percent": 84,
    "battery_voltage": 26.8,
    "last_ping_utc": "2026-10-31T14:22:10Z"
  }
]
```

### ج. جلب سجل ساعات المحرك التاريخي لفترة محددة (Engine Hours History)
```http
GET https://api.itrack-telematics.eg/v2/reports/engine-hours?unit_id=TRK-LBH-1200&from_date=2026-10-24&to_date=2026-10-24
Authorization: Bearer {token}
```

---

## 3. قواعد احتساب ومطابقة الساعات (Reconciliation Engine Logic)

1. **احتساب ساعات الـ GPS:**
   $$\text{GPS Engine Hours} = \sum (\text{Ignition ON Duration}) \quad \text{حيث RPM} > 500$$
2. **ساعات يومية التشغيل (Usage Log Hours):**
   - تُستخرج من توقيع مشغل الونش المعتمد من مهندس موقع العميل عبر تطبيق التشغيل أو البوابة.
3. **حساب الانحراف (Variance):**
   $$\text{Variance} = \text{Usage Log Hours} - \text{GPS Engine Hours}$$
4. **تصنيف الفروقات:**
   - **فارق مقبول ($\pm 0.5$ ساعة):** يُعتمد تلقائياً (يعود لفترات الإحماء والاصطفاف).
   - **فارق متوسط ($0.6 - 1.5$ ساعة):** يُدرج في تقرير التدقيق للمراجعة مع مشرف الوردية.
   - **فارق حرج ($> 1.5$ ساعة):** يُعلق اعتماد ساعات تشغيل المشغل، ويُخطر مدير العمليات للتحقق من بيانات الـ GPS وتوقيعات الموقع.

---

## 4. خطة التحول والجاهزية الإنتاجية

- [x] تم بناء شاشة الفحص والمطابقة في واجهة التطبيق `/src/components/gps/ITrackGpsView.tsx`.
- [x] توفير جدول مقارنة فوري مع حساب الفروقات وحالة الفحص (متطابق / انحراف مقبول / انحراف عالي).
- [x] ربط كل جهاز بالرمز المحاسبي لمركز التكلفة وقسم التشغيل.
- [x] تكامل حالة الاتصال ومؤشر استجابة الخدمة (Latency ~ 48ms) مع لوحة الفحص الشاملة (`IntegrationStatusView`).
