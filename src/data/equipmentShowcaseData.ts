import craneFleetBg from '../assets/images/crane_fleet_bg_1792888391547.jpg';
import heavyCrawlerCrane from '../assets/images/heavy_crawler_crane_1792888404432.jpg';

export interface EquipmentShowcaseItem {
  id: string;
  nameAr: string;
  nameEn: string;
  model: string;
  category: 'رافعة هيدروليكية' | 'رافعة مجنزرة' | 'رافعة وعرة' | 'نقل ثقيل';
  capacityTon: number;
  boomLength: string;
  imageUrl: string;
  projectAr: string;
  siteLocation: string;
  statusAr: 'تشغيل نشط بموقع العاصمة' | 'جاهزية بمحطة الضبعة' | 'بمصفاة السويس' | 'تشغيل بحقل ظهر' | 'متاح بالورش المركزية';
  badgeColor: string;
}

export const EQUIPMENT_SHOWCASE_LIST: EquipmentShowcaseItem[] = [
  {
    id: 'eq-1',
    nameAr: 'رافعة هيدروليكية عملاقة Liebherr LTM 11200',
    nameEn: 'Liebherr LTM 11200-9.1 (1200 Ton)',
    model: 'Liebherr LTM 11200-9.1',
    category: 'رافعة هيدروليكية',
    capacityTon: 1200,
    boomLength: '100 متر تلسكوبي + 188 م بوم شبكي',
    imageUrl: craneFleetBg,
    projectAr: 'محطة الضبعة النووية ومزارع طاقة الرياح',
    siteLocation: 'الساحل الشمالي / السويس',
    statusAr: 'جاهزية بمحطة الضبعة',
    badgeColor: 'bg-red-600',
  },
  {
    id: 'eq-2',
    nameAr: 'رافعة مجنزرة بوم شبكي Liebherr LR 1600/2',
    nameEn: 'Liebherr LR 1600/2 Lattice Crawler (600 Ton)',
    model: 'Liebherr LR 1600/2 Crawler',
    category: 'رافعة مجنزرة',
    capacityTon: 600,
    boomLength: '144 متر شبكي + 187 م أقصى ارتفاع',
    imageUrl: heavyCrawlerCrane,
    projectAr: 'محطة كهرباء شمال الجيزة ومجمع موبكو دمياط',
    siteLocation: 'الجيزة / دمياط',
    statusAr: 'تشغيل نشط بموقع العاصمة',
    badgeColor: 'bg-amber-600',
  },
  {
    id: 'eq-3',
    nameAr: 'رافعة ديمج التلسكوبية Demag AC 700',
    nameEn: 'Demag AC 700 All-Terrain (700 Ton)',
    model: 'Demag AC 700 SSL',
    category: 'رافعة هيدروليكية',
    capacityTon: 700,
    boomLength: '60 متر + 149 م ذراع إضافي',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
    projectAr: 'مونوريل العاصمة الإدارية ومجمع السويس للصلب',
    siteLocation: 'العاصمة الإدارية / السخنة',
    statusAr: 'تشغيل نشط بموقع العاصمة',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 'eq-4',
    nameAr: 'رافعة ليبهير الميدانية Liebherr LTM 1500',
    nameEn: 'Liebherr LTM 1500-8.1 (500 Ton)',
    model: 'Liebherr LTM 1500-8.1',
    category: 'رافعة هيدروليكية',
    capacityTon: 500,
    boomLength: '84 متر بوم تلسكوبي سريع',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    projectAr: 'توسعات مصفاة بتروبل وحقل ظهر للغاز',
    siteLocation: 'بورسعيد / خليج السويس',
    statusAr: 'تشغيل بحقل ظهر',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 'eq-5',
    nameAr: 'رافعة الطرق الوعرة Grove RT890E',
    nameEn: 'Grove RT890E Rough Terrain (90 Ton)',
    model: 'Grove RT890E 4x4',
    category: 'رافعة وعرة',
    capacityTon: 90,
    boomLength: '43 متر هيدروليكي مصفح',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    projectAr: 'حقول البترول بالصحراء الغربية والعلمين',
    siteLocation: 'الصحراء الغربية',
    statusAr: 'متاح بالورش المركزية',
    badgeColor: 'bg-amber-500',
  },
  {
    id: 'eq-6',
    nameAr: 'قاطرات هيدروليكية متعددة المحاور للنقل الثقيل',
    nameEn: 'Goldhofer Multi-Axle Heavy Transporter (850T)',
    model: 'Goldhofer THP/SL Heavy Hauler',
    category: 'نقل ثقيل',
    capacityTon: 850,
    boomLength: 'مقطورات معيارية 16 إلى 32 محور هيدروليكي',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    projectAr: 'نقل توربينات طاقة الرياح والمحولات العملاقة',
    siteLocation: 'طريق العين السخنة - الزعفرانة',
    statusAr: 'بمصفاة السويس',
    badgeColor: 'bg-purple-600',
  },
];
