
import type { Service, ServiceCategory } from '@/types';

/**
 * Data returned by GET /api/services.
 * Based on the current PHP Services API.
 */
export interface ApiService {
  id: number;
  providerId: number;
  serviceName: string;
  description: string;
  price: number;
  providerName: string;
  serviceType: string;
  experienceYears: number;
  languages: string[];
  averageRating: number;
  ratingsCount: number;

  // حقول إضافية يرجعها الخادم الحالي (اختيارية لو ما كانت موجودة)
  priceUnit?: string;
  duration?: string;
  location?: string;
  imageUrl?: string;
  categoryKey?: string;
  categoryName?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  features?: string[];
  meetingPoints?: string[];
  createdAt?: string;
  providerAvatar?: string;
  providerBio?: string;
  providerVerified?: boolean;
  providerRating?: number;
  providerRatingsCount?: number;
}

const VALID_CATEGORIES: ServiceCategory[] = [
  'escort_guidance',
  'translation',
  'elderly_assistance',
  'mobility_support',
  'support_care',
];

/**
 * Infer an interface category from the provider's service type.
 * This is a display-only approximation until the database
 * supports service-level categories.
 */
export function mapServiceCategory(
  serviceType: string
): ServiceCategory {
  const value = serviceType.trim().toLowerCase();

  if (
    VALID_CATEGORIES.includes(value as ServiceCategory)
  ) {
    return value as ServiceCategory;
  }

  if (
    value.includes('ترجم') ||
    value.includes('لغوي') ||
    value.includes('translation')
  ) {
    return 'translation';
  }

  if (
    value.includes('كبار السن') ||
    value.includes('elderly')
  ) {
    return 'elderly_assistance';
  }

  if (
    value.includes('تنقل') ||
    value.includes('حرك') ||
    value.includes('mobility')
  ) {
    return 'mobility_support';
  }

  if (
    value.includes('إرشاد') ||
    value.includes('مرافق') ||
    value.includes('guidance') ||
    value.includes('escort')
  ) {
    return 'escort_guidance';
  }

  return 'support_care';
}

/**
 * Generic illustration for services without a database image.
 * This does not represent an actual service photograph.
 */
const DEFAULT_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg"
         width="900" height="600"
         viewBox="0 0 900 600">
      <rect width="900" height="600" fill="#F8F6F0"/>
      <rect x="20" y="20" width="860" height="560"
            rx="28" fill="#E8EFEA"/>
      <circle cx="450" cy="270" r="110"
              fill="#0E4D3A" opacity="0.08"/>
      <path d="M390 270 L430 310 L515 220"
            fill="none" stroke="#0E4D3A"
            stroke-width="17"
            stroke-linecap="round"
            stroke-linejoin="round"/>
      <text x="450" y="440"
            text-anchor="middle"
            font-family="Arial, sans-serif"
            font-size="48"
            font-weight="bold"
            fill="#0E4D3A">WISAL</text>
    </svg>
  `);

/**
 * Convert a database-backed service into the existing
 * frontend Service model.
 */
export function mapApiService(api: ApiService): Service {
  const text = (value: unknown): string =>
    typeof value === 'string' ? value.trim() : '';

  const list = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.map(v => String(v).trim()).filter(Boolean)
      : [];

  return {
    id: String(api.id),

    providerId: String(api.providerId),
    providerName: api.providerName,

    providerRating: Number(api.providerRating ?? 0),
    providerAvatar: text(api.providerAvatar) || undefined,
    providerBio: text(api.providerBio) || undefined,
    providerVerified: Boolean(api.providerVerified),
    providerExperienceYears:
      api.experienceYears === undefined ? undefined : Number(api.experienceYears),
    providerLanguages: list(api.languages),
    providerServiceType: text(api.serviceType) || undefined,

    title: api.serviceName,
    description: api.description ?? '',

    // نستخدم تصنيف الخدمة من القاعدة إذا موجود، وإلا نستنتجه من نوع الخدمة
    category: mapServiceCategory(
      text(api.categoryKey) || (api.serviceType ?? '')
    ),

    price: Number(api.price),
    priceUnit: text(api.priceUnit) || 'ريال',

    duration: text(api.duration) || 'غير محددة',
    location: text(api.location) || 'تُحدد عند الحجز',
    meetingPoints: list(api.meetingPoints),

    rating: Number(api.averageRating ?? 0),
    reviewsCount: Number(api.ratingsCount ?? 0),

    image: text(api.imageUrl) || DEFAULT_IMAGE,
    features: list(api.features),

    isActive: api.isActive === undefined ? true : Boolean(api.isActive),

    createdAt: text(api.createdAt),
  };
}

/**
 * Convert an API collection to frontend service objects.
 */
export function mapApiServices(
  services: ApiService[]
): Service[] {
  return services.map(mapApiService);
}

/**
 * Convert the existing frontend form data into the
 * fields supported by the PHP Services API.
 */
export function mapServiceToApi(
  service: Pick<
    Service,
    'title' | 'description' | 'price'
  >
): {
  serviceName: string;
  description: string;
  price: number;
} {
  return {
    serviceName: service.title.trim(),
    description: service.description.trim(),
    price: Number(service.price),
  };
}
