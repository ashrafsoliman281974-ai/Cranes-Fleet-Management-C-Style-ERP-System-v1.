export const HIJRI_MONTHS_AR = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

export const HIJRI_MONTHS_EN = [
  'Muharram',
  'Safar',
  'Rabi I',
  'Rabi II',
  'Jumada I',
  'Jumada II',
  'Rajab',
  'Shaaban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qadah',
  'Dhu al-Hijjah',
];

export const GREGORIAN_MONTHS_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export const DAYS_AR = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

export interface HijriDate {
  year: number;
  month: number; // 1-12
  monthNameAr: string;
  monthNameEn: string;
  day: number;
  formattedAr: string;
}

/**
 * High-accuracy astronomical Gregorian to Hijri conversion
 */
export function gregorianToHijri(date: Date | string): HijriDate {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return {
      year: 1448,
      month: 2,
      monthNameAr: 'صفر',
      monthNameEn: 'Safar',
      day: 12,
      formattedAr: '12 صفر 1448 هـ',
    };
  }

  // Use Intl.DateTimeFormat with islamic-umalqura calendar if available in runtime
  try {
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(d);
    let hDay = 1;
    let hMonth = 1;
    let hYear = 1448;

    for (const part of parts) {
      if (part.type === 'day') hDay = parseInt(part.value, 10) || 1;
      if (part.type === 'month') hMonth = parseInt(part.value, 10) || 1;
      if (part.type === 'year') hYear = parseInt(part.value, 10) || 1448;
    }

    const monthIndex = Math.max(0, Math.min(11, hMonth - 1));
    const monthNameAr = HIJRI_MONTHS_AR[monthIndex] || 'محرم';
    const monthNameEn = HIJRI_MONTHS_EN[monthIndex] || 'Muharram';

    return {
      year: hYear,
      month: hMonth,
      monthNameAr,
      monthNameEn,
      day: hDay,
      formattedAr: `${hDay} ${monthNameAr} ${hYear} هـ`,
    };
  } catch {
    // Algorithmic fallback
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();

    let m = month + 1;
    let y = year;
    if (m < 3) {
      y -= 1;
      m += 12;
    }

    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

    const z = jd - 1948439.5;
    const cyc = Math.floor(z / 10631);
    const rem = z - 10631 * cyc;
    const j = Math.floor((rem - 0.1335) / 354.36667);
    const hYear = 30 * cyc + j + 1;
    const rem2 = rem - Math.floor(j * 354.36667 + 0.1335);
    const hMonth = Math.min(12, Math.floor((rem2 + 28.5001) / 29.5));
    const hDay = Math.floor(rem2 - Math.floor(29.5 * (hMonth - 1) - 0.0001)) + 1;

    const monthIndex = Math.max(0, Math.min(11, hMonth - 1));
    const monthNameAr = HIJRI_MONTHS_AR[monthIndex] || 'محرم';
    const monthNameEn = HIJRI_MONTHS_EN[monthIndex] || 'Muharram';

    return {
      year: hYear,
      month: hMonth,
      monthNameAr,
      monthNameEn,
      day: hDay,
      formattedAr: `${hDay} ${monthNameAr} ${hYear} هـ`,
    };
  }
}

/**
 * Format standard ISO date YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateISO(str: string): Date {
  const parts = str.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  return new Date();
}

/**
 * Calculates Calendar days for dual Hijri/Gregorian month view
 */
export interface CalendarCell {
  date: Date;
  isoString: string;
  gregorianDay: number;
  hijriDay: number;
  hijriMonthName: string;
  hijriYear: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export function getDualCalendarDays(year: number, month: number, selectedDate?: Date): {
  days: CalendarCell[];
  hijriMonthHeader: string;
} {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Sunday = 0
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const days: CalendarCell[] = [];
  const todayISO = formatDateISO(new Date());
  const selectedISO = selectedDate ? formatDateISO(selectedDate) : '';

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i);
    const iso = formatDateISO(d);
    const hijri = gregorianToHijri(d);
    days.push({
      date: d,
      isoString: iso,
      gregorianDay: d.getDate(),
      hijriDay: hijri.day,
      hijriMonthName: hijri.monthNameAr,
      hijriYear: hijri.year,
      isCurrentMonth: false,
      isToday: iso === todayISO,
      isSelected: iso === selectedISO,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const iso = formatDateISO(d);
    const hijri = gregorianToHijri(d);
    days.push({
      date: d,
      isoString: iso,
      gregorianDay: i,
      hijriDay: hijri.day,
      hijriMonthName: hijri.monthNameAr,
      hijriYear: hijri.year,
      isCurrentMonth: true,
      isToday: iso === todayISO,
      isSelected: iso === selectedISO,
    });
  }

  // Next month padding to fill complete grid of 35 or 42 cells
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    const iso = formatDateISO(d);
    const hijri = gregorianToHijri(d);
    days.push({
      date: d,
      isoString: iso,
      gregorianDay: i,
      hijriDay: hijri.day,
      hijriMonthName: hijri.monthNameAr,
      hijriYear: hijri.year,
      isCurrentMonth: false,
      isToday: iso === todayISO,
      isSelected: iso === selectedISO,
    });
  }

  // Month header: e.g. "محرم – صفر 1448 هـ"
  const startHijri = gregorianToHijri(firstDayOfMonth);
  const endHijri = gregorianToHijri(lastDayOfMonth);
  let hijriMonthHeader = `${startHijri.monthNameAr} ${startHijri.year} هـ`;
  if (startHijri.monthNameAr !== endHijri.monthNameAr) {
    hijriMonthHeader = `${startHijri.monthNameAr} – ${endHijri.monthNameAr} ${endHijri.year} هـ`;
  }

  return { days, hijriMonthHeader };
}
