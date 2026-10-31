/**
 * Tafqeet Utility: Converts financial figures into words in Arabic and English
 */

const AR_ONES = [
  '',
  'واحد',
  'اثنان',
  'ثلاثة',
  'أربعة',
  'خمسة',
  'ستة',
  'سبعة',
  'ثمانية',
  'تسعة',
  'عشرة',
  'أحد عشر',
  'اثنا عشر',
  'ثلاثة عشر',
  'أربعة عشر',
  'خمسة عشر',
  'ستة عشر',
  'سبعة عشر',
  'ثمانية عشر',
  'تسعة عشر',
];

const AR_TENS = [
  '',
  '',
  'عشرون',
  'ثلاثون',
  'أربعون',
  'خمسون',
  'ستون',
  'سبعون',
  'ثمانون',
  'تسعون',
];

const AR_HUNDREDS = [
  '',
  'مائة',
  'مائتان',
  'ثلاثمائة',
  'أربعمائة',
  'خمسمائة',
  'ستمائة',
  'سبعمائة',
  'ثمانمائة',
  'تسعمائة',
];

function convertGroupUnderThousandAr(n: number): string {
  if (n === 0) return '';
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  const parts: string[] = [];

  if (hundreds > 0) {
    parts.push(AR_HUNDREDS[hundreds]);
  }

  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(AR_ONES[remainder]);
    } else {
      const ones = remainder % 10;
      const tens = Math.floor(remainder / 10);
      if (ones > 0) {
        parts.push(`${AR_ONES[ones]} و${AR_TENS[tens]}`);
      } else {
        parts.push(AR_TENS[tens]);
      }
    }
  }

  return parts.join(' و');
}

export function tafqeetArabic(amount: number, currency: 'EGP' | 'SAR' | 'USD' = 'EGP'): string {
  if (amount === 0) {
    return 'صفر';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const integerPart = Math.floor(absAmount);
  const decimalPart = Math.round((absAmount - integerPart) * 100);

  let currencyName = 'جنيهاً مصرياً';
  let subunitName = 'قرش';
  if (currency === 'SAR') {
    currencyName = 'ريالاً سعودياً';
    subunitName = 'هللة';
  } else if (currency === 'USD') {
    currencyName = 'دولاراً أمريكياً';
    subunitName = 'سنت';
  }

  if (integerPart === 0 && decimalPart === 0) {
    return `صفر ${currencyName} فقط لا غير`;
  }

  const billions = Math.floor(integerPart / 1_000_000_000);
  const millions = Math.floor((integerPart % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((integerPart % 1_000_000) / 1_000);
  const ones = integerPart % 1_000;

  const parts: string[] = [];

  if (billions > 0) {
    if (billions === 1) parts.push('مليار');
    else if (billions === 2) parts.push('ملياران');
    else if (billions >= 3 && billions <= 10) parts.push(`${convertGroupUnderThousandAr(billions)} مليارات`);
    else parts.push(`${convertGroupUnderThousandAr(billions)} مليار`);
  }

  if (millions > 0) {
    if (millions === 1) parts.push('مليون');
    else if (millions === 2) parts.push('مليونان');
    else if (millions >= 3 && millions <= 10) parts.push(`${convertGroupUnderThousandAr(millions)} ملايين`);
    else parts.push(`${convertGroupUnderThousandAr(millions)} مليون`);
  }

  if (thousands > 0) {
    if (thousands === 1) parts.push('ألف');
    else if (thousands === 2) parts.push('ألفان');
    else if (thousands >= 3 && thousands <= 10) parts.push(`${convertGroupUnderThousandAr(thousands)} آلاف`);
    else parts.push(`${convertGroupUnderThousandAr(thousands)} ألف`);
  }

  if (ones > 0) {
    parts.push(convertGroupUnderThousandAr(ones));
  }

  let text = parts.join(' و');

  let fullText = (isNegative ? 'سالب ' : '') + text + ` ${currencyName}`;

  if (decimalPart > 0) {
    const decimalText = convertGroupUnderThousandAr(decimalPart);
    fullText += ` و${decimalText} ${subunitName}`;
  }

  return `${fullText} فقط لا غير`;
}

// English Tafqeet implementation
const EN_ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const EN_TENS = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function convertGroupUnderThousandEn(n: number): string {
  if (n === 0) return '';
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  const parts: string[] = [];

  if (hundreds > 0) {
    parts.push(`${EN_ONES[hundreds]} Hundred`);
  }

  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(EN_ONES[remainder]);
    } else {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;
      if (ones > 0) {
        parts.push(`${EN_TENS[tens]}-${EN_ONES[ones]}`);
      } else {
        parts.push(EN_TENS[tens]);
      }
    }
  }

  return parts.join(' ');
}

export function tafqeetEnglish(amount: number, currency: 'EGP' | 'SAR' | 'USD' = 'EGP'): string {
  if (amount === 0) {
    return 'Zero';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const integerPart = Math.floor(absAmount);
  const decimalPart = Math.round((absAmount - integerPart) * 100);

  let currencyName = 'Egyptian Pounds';
  let subunitName = 'Piastres';
  if (currency === 'SAR') {
    currencyName = 'Saudi Riyals';
    subunitName = 'Halalas';
  } else if (currency === 'USD') {
    currencyName = 'US Dollars';
    subunitName = 'Cents';
  }

  const billions = Math.floor(integerPart / 1_000_000_000);
  const millions = Math.floor((integerPart % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((integerPart % 1_000_000) / 1_000);
  const ones = integerPart % 1_000;

  const parts: string[] = [];
  if (billions > 0) parts.push(`${convertGroupUnderThousandEn(billions)} Billion`);
  if (millions > 0) parts.push(`${convertGroupUnderThousandEn(millions)} Million`);
  if (thousands > 0) parts.push(`${convertGroupUnderThousandEn(thousands)} Thousand`);
  if (ones > 0) parts.push(convertGroupUnderThousandEn(ones));

  let text = parts.join(' ');
  if (!text) text = 'Zero';

  let result = (isNegative ? 'Minus ' : '') + `${text} ${currencyName}`;
  if (decimalPart > 0) {
    result += ` and ${convertGroupUnderThousandEn(decimalPart)} ${subunitName}`;
  }

  return `${result} Only`;
}
