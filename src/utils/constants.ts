import { ServiceCategory, BookingStatus } from '@/types';

export const CATEGORIES: Record<ServiceCategory, { label: string; description: string; icon: string }> = {
  escort_guidance: {
    label: 'مرافقة وإرشاد',
    description: 'مرافقة معتمرين وزوار الحرم الشريف والإرشاد الدقيق للمناسك والأبواب',
    icon: 'Compass',
  },
  translation: {
    label: 'الترجمة والمساعدة اللغوية',
    description: 'ترجمة فورية وتسهيل التواصل بعدة لغات لضيوف الرحمن من مختلف البلدان',
    icon: 'Languages',
  },
  elderly_assistance: {
    label: 'مساعدة كبار السن',
    description: 'رعاية فائقة ومساندة متخصصة لكبار السن أثناء الطواف والسعي والصلوات',
    icon: 'HeartHandshake',
  },
  mobility_support: {
    label: 'خدمات المساعدة والتنقل',
    description: 'مساعدة في قيادة العربات اليدوية والكهربائية والتنقل السلس داخل أروقة الحرم',
    icon: 'Accessibility',
  },
  support_care: {
    label: 'خدمات الدعم والمساندة',
    description: 'تسهيل تلبية الاحتياجات الخاصة ومساعدة العائلات والأطفال أثناء التواجد بالحرم',
    icon: 'ShieldCheck',
  },
};

export const STATUS_LABELS: Record<BookingStatus, { label: string; color: string; bg: string; border: string }> = {
  pending: {
    label: 'قيد الانتظار',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  confirmed: {
    label: 'مؤكد',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  completed: {
    label: 'مكتمل',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  cancelled: {
    label: 'ملغي',
    color: 'text-rose-800',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
};

export const MAKKAH_MEETING_POINTS = [
  'ساحة باب الملك فهد (بوابة 79)',
  'ساحة باب الملك عبدالعزيز (بوابة 1)',
  'ساحة باب أجياد (بوابة 5)',
  'ساحة باب السلام (المسعى)',
  'ساحة باب الفتح (بوابة 45)',
  'مركز استلام العربات بالساحة الغربية',
  'محطة كدي للنقل الترددي',
  'منطقة الشبيكة - مدخل الحرم',
  'أمام فندق برج الساعة - الميزانين',
];

export const TIME_SLOTS = [
  'الفجر (04:30 ص - 06:30 ص)',
  'الضحى (07:30 ص - 10:30 ص)',
  'الظهر (11:30 ص - 02:00 م)',
  'العصر (03:30 م - 05:30 م)',
  'المغرب والعشاء (06:30 م - 09:30 م)',
  'ساعات الليل المتأخرة (10:30 م - 01:30 ص)',
];

export const SAUDI_REGIONS = [
  'مكة المكرمة',
  'المدينة المنورة',
  'الرياض',
  'جدة',
  'الشرقية',
  'عسير',
  'تبوك',
  'أخرى',
];

export const SPOKEN_LANGUAGES = [
  'العربية',
  'الإنجليزية',
  'الأردية',
  'الفرنسية',
  'التركية',
  'الإندونيسية',
  'الملايوية',
  'الفارسية',
  'البنغالية',
];
