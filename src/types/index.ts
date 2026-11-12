export type UserRole = 'beneficiary' | 'provider';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type ServiceCategory = 
  | 'escort_guidance'      // مرافقة وإرشاد
  | 'translation'          // الترجمة والمساعدة اللغوية
  | 'elderly_assistance'    // مساعدة كبار السن
  | 'mobility_support'     // خدمات المساعدة والتنقل
  | 'support_care';        // خدمات الدعم والمساندة

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: UserRole;
  age?: number;
  nationality?: string;
  preferredLanguage?: string;
  createdAt: string;
  avatar?: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  age: number;
  serviceType: string;
  experienceYears: number;
  languages: string[];
  bio: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  avatar: string;
}

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  providerAvatar?: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  priceUnit: string; // e.g. "ريال / جولة", "ريال / ساعة"
  duration: string;
  location: string;
  meetingPoints: string[];
  rating: number;
  reviewsCount: number;
  image: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  serviceId: string;
  serviceTitle: string;
  providerId: string;
  providerName: string;
  providerPhone?: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryPhone: string;
  date: string;
  timeSlot: string;
  meetingPoint: string;
  notes?: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  rated?: boolean;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  isMine: boolean;
  body: string;
  createdAt: string;
}

export interface RatingReview {
  id: string;
  bookingId: string;
  serviceId: string;
  providerId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  score: number; // 1 - 5
  comment: string;
  createdAt: string;
}

export interface FilterOptions {
  category?: string;
  search?: string;
  sortBy?: 'recommended' | 'price_asc' | 'price_desc' | 'rating_desc';
  minPrice?: number;
  maxPrice?: number;
}
