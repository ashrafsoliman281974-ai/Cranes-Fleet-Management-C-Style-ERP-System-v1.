# C-Style ERPNext Frappe v16 (العربية أولاً) Implementation Plan

Building a pixel-accurate, high-fidelity Arabic-first (RTL) ERP system modeled directly after the Frappe/ERPNext v16 C-Style theme (by Eng. Amir Mansi). The application features an authentic dual sidebar navigation, full Arabic RTL UI, customizable corporate branding & themes, in-context live translation, a dual Hijri-Gregorian calendar system, bilingual Tafqeet (amount in words), comprehensive Sales Invoice forms, a General Ledger financial report, and a Role Permission Manager.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Data Persistence & Database Architecture**:
> - The user specified **Supabase** in response to the initial setup questionnaire.
> - In this environment, PostgreSQL relational databases are powered via the built-in Cloud SQL / PostgreSQL integration (using Drizzle ORM) with a robust client-side relational storage fallback so the application runs immediately without blocking.
> - **Default Visual Preset**: Classic Blue (`#1B365D`) with luxury gold metallic accent (`#D4AF37`) and deep navy rail (`#0D1B2A`), fully switchable in real-time to Luxury Olive, Royal Red, or Modern Purple via the theme picker.
> - **Initial Data**: Preloaded with realistic Arabic commercial data (Egyptian Pounds `ج.م` / SAR `ر.س`), customers, chart of accounts, sales invoices, and items.

---

## 1. Overview & Core Concept

- **What It Does**: A complete, modern Arabic-first ERP web application replicating the distinctive C-Style theme for ERPNext v16. It enables business teams to manage accounting, sales, inventory, and permissions in a native right-to-left interface with localized Islamic calendar dates, automated bilingual amount spell-outs, and real-time custom branding.
- **Target Audience / Persona**: Arabic-speaking business owners, accountants, enterprise administrators, and Frappe/ERPNext users seeking an elegant, tailored RTL experience with zero friction in date handling and localization.
- **Key Value**: Delivers the specific features showcased in the video analysis:
  1. **Dual Sidebar Navigation**: Narrow dark module rail + light expandable workspace menu.
  2. **Instant In-Context Translation**: "ترجمة فورية" dialog to adjust system terminology on the fly.
  3. **Dual Hijri & Gregorian Calendar**: Automatic conversion, dual badges, and custom calendar dropdown.
  4. **Bilingual Tafqeet**: Simultaneous Arabic and English spell-out for currencies and decimals.
  5. **Customizable Login Page**: Live configuration for company logo, description, background, and alignment.
  6. **Enterprise Core Screens**: Sales Invoice with multi-tabs, General Ledger reporting, and Permission Matrix.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Workspace Navigation**:
   - The user opens the app and sees the dual sidebar on the right (RTL): the narrow dark icon rail lists modules (Accounts, Sales, Stock, Purchasing, Manufacturing, Assets, Settings).
   - Clicking a module updates the adjacent light workspace sidebar with nested shortcuts, collapsible master lists, and quick `(+)` action buttons.
   - The main stage presents localized Arabic KPI cards (e.g. `164.85 ألف ج.م`), recent transaction tables, and workspace action shortcuts.

2. **Creating & Viewing a Sales Invoice (فاتورة مبيعات)**:
   - Clicking `(+)` on Sales Invoice opens the tabbed document view (Details, Payments, Address & Contact, Terms, Additional Info).
   - Date inputs feature an active **Hijri Badge** (e.g., `12 صفر 1448 هـ` alongside `2026-07-26`).
   - Clicking the date opens the custom **Hijri-Gregorian Datepicker** showing dual month headers, days starting on Sunday, and synchronized dual selection.
   - Adding line items recalculates subtotals, VAT (14% / 15%), and immediately renders **Bilingual Tafqeet** (e.g., *"أربعمائة وخمسة وخمسون جنيهاً مصرياً فقط لا غير"* and *"Four Hundred Fifty Five Egyptian Pounds Only"*).

3. **Customizing Visual Identity & Theme (تخصيص الألوان)**:
   - Clicking the **C-Style** icon at the bottom of the sidebar opens the Color Theme Customizer modal.
   - The user can select from presets (*Classic Blue*, *Luxury Olive*, *Royal Red*, *Modern Purple*) or freely tune the **Primary Color**, **Metallic Accent (Gold/Bronze)**, and **Sidebar Background** via live RGB pickers.
   - Changes instantly apply globally across all buttons, highlights, badges, and sidebar rails.

4. **In-Context Live Translation (ترجمة فورية)**:
   - Clicking the "ترجمة" button opens the **Add / Update Translation** modal.
   - Users view the source phrase (e.g., `Asset Maintenance Team`), current translation (`فريق صيانة الأصول`), and optional context, and save overrides that update the interface immediately.

5. **Login Page Customization (إعدادات صفحة الدخول)**:
   - Users can switch to the Login Page view or open Login Page Settings.
   - Configure company Arabic/English name, logo upload/URL, tagline, background image, panel layout (Right, Center, Left), and contact info with instant live preview.

6. **General Ledger & Permissions**:
   - Access the wide **General Ledger** report with date range filters, voucher numbers, debit/credit totals, and running balance.
   - Access the **Role Permission Manager** matrix to inspect and toggle permissions (Read, Write, Create, Delete, Submit, Cancel) across roles.

### Visual Identity & Theme System
- **Direction**: Right-to-Left (RTL) first, with font family `Cairo` / `Tajawal` / `Plus Jakarta Sans` for clean typography.
- **Color Variables (CSS Tokenized)**:
  - `--primary`: `#1B365D` (Default Classic Navy/Blue)
  - `--accent-gold`: `#D4AF37` / `#C5A059` (Metallic touch)
  - `--sidebar-dark`: `#0D1B2A` (Narrow module rail)
  - `--sidebar-light`: `#F8FAFC` (Workspace panel)
  - `--surface`: `#FFFFFF`
  - `--border-hairline`: `rgba(0, 0, 0, 0.08)`
- **Typography & Numbers**: Monospace tabular numerals (`tabular-nums`) for currency, balance, and dates. Clear typographic hierarchy with zero visual clutter.

---

## 3. Key Product Decisions & Trade-Offs

- **Arabic Hijri Calculation**:
  - *Decision*: Embedded Umm al-Qura algorithm for exact Islamic lunar calendar date calculations without requiring external network API latency.
  - *Why*: Ensures instant date conversion in form badges and interactive calendar dropdowns offline and without API limits.
- **Dual Tafqeet Engine**:
  - *Decision*: Native client-side currency-to-words generator supporting Egyptian Pounds (`جنيه مصري / قرش`), Saudi Riyals (`ريال سعودي / هللة`), and USD with bilingual Arabic/English outputs.
  - *Why*: Instant, zero-latency invoice updates as rows and amounts are typed.
- **Theme Storage**:
  - *Decision*: Real-time CSS custom property injection backed by localStorage persistence and state sync.
  - *Why*: Theme changes occur instantly on the screen without full page reloads, identical to the YouTube demonstration.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        C-Style ERP Application                         │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation Bar (Search, Company Title, Hijri/Gregorian Toggle)    │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ Narrow Dark Rail   │ Light Workspace    │ Main Content Canvas          │
│ • Module Icons     │ • Shortcuts (+)    │ • ERPNext Workspace Cards    │
│ • Accounts/Sales/  │ • Reports Folders  │ • Sales Invoice Form         │
│   Inventory/Assets │ • Masters Folders  │ • General Ledger Report      │
│ • C-Style Theme    │ • User Card        │ • Permission Manager         │
│ • Instant Trans.   │                    │ • Login Screen Preview       │
│ • Language (AR/EN) │                    │                              │
├────────────────────┴────────────────────┴──────────────────────────────┤
│ State Layer: ThemeContext, TranslationStore, ERPDataStore, AuthStore   │
│ Persistence: LocalStorage + PostgreSQL Schema / Drizzle Ready API      │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Structure
- `src/components/layout/DualSidebar.tsx`: The dual navigation rail (dark icon bar + light workspace).
- `src/components/layout/TopHeader.tsx`: Breadcrumbs, quick global search, active date display, notification & user menu.
- `src/components/theme/ThemeModal.tsx`: Preset switcher and 3-color custom color picker with metallic gold accent.
- `src/components/translation/TranslationModal.tsx`: Add/Update live translation dialog with context.
- `src/components/datepicker/HijriDatePicker.tsx`: Dual Gregorian + Hijri dropdown with badge indicators.
- `src/components/sales/SalesInvoiceForm.tsx`: Tabbed sales document with line items, tax calculations, and Tafqeet.
- `src/components/reports/GeneralLedger.tsx`: High-density financial ledger report with filters and running balance.
- `src/components/permissions/PermissionManager.tsx`: Interactive role-based access matrix.
- `src/components/login/LoginPage.tsx` & `LoginPageSettings.tsx`: Configurable branded enterprise login portal.
- `src/utils/hijri.ts`: Umm al-Qura calendar conversion utilities.
- `src/utils/tafqeet.ts`: Bilingual Arabic & English amount-in-words engine.
- `src/data/initialData.ts`: Realistic Arabic chart of accounts, items, customers, invoices, and translations.

---

## Verification & Quality Checklist
1. Dual sidebar behaves smoothly with collapsible categories and active module indicators.
2. Color theme selector updates primary, metallic accent, and sidebar dark colors immediately.
3. Hijri badge reflects accurate Islamic date for every selected Gregorian date.
4. Tafqeet updates automatically when invoice item prices or quantities change.
5. In-context translation allows editing UI labels and updates the screen live.
6. Login Page Settings allow modifying company name, logo, background, and alignment with instant preview.
7. Clean build with `compile_applet` and zero TypeScript or lint errors.
