import { RatingReview } from '@/types';
import { storage } from '../mocks/storage';
import { apiRequest } from '../api/client';
import { bookingRepository } from './bookingRepository';

/**
 * WISAL Rating Repository
 *
 * الوضع الحقيقي (real): التقييمات من قاعدة البيانات عبر /api/ratings
 *   - GET  /api/ratings?serviceId=..  تقييمات خدمة
 *   - GET  /api/ratings?all=1         كل التقييمات الظاهرة
 *   - GET  /api/ratings               تقييماتي (المستفيد: اللي كتبها، مقدم الخدمة: اللي وصلته)
 *   - POST /api/ratings               { bookingId, score, comment }
 *   والخادم يحدّث متوسط تقييم الخدمة ويرسل إشعار لمقدم الخدمة تلقائياً.
 *
 * الوضع التجريبي (demo): ذاكرة المتصفح.
 */

const isRealMode = import.meta.env.VITE_AUTH_MODE !== 'demo';

type CreateRatingInput = {
  bookingId: string;
  serviceId: string;
  providerId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  score: number;
  comment: string;
};

/* ------------------------------------------------------------------ */
/* الوضع الحقيقي                                                        */
/* ------------------------------------------------------------------ */

const realRatingRepository = {
  getByServiceId: (serviceId: string): Promise<RatingReview[]> =>
    apiRequest<RatingReview[]>(
      `/api/ratings?serviceId=${encodeURIComponent(serviceId)}`
    ),

  getByProviderId: async (providerId: string): Promise<RatingReview[]> => {
    const all = await apiRequest<RatingReview[]>('/api/ratings?all=1');
    return all.filter(r => String(r.providerId) === String(providerId));
  },

  // الخادم يعرف المستخدم من الجلسة
  getByBeneficiaryId: (_beneficiaryId: string): Promise<RatingReview[]> =>
    apiRequest<RatingReview[]>('/api/ratings'),

  /** تقييمات المستخدم الحالي (المستفيد أو مقدم الخدمة) */
  getMine: (): Promise<RatingReview[]> =>
    apiRequest<RatingReview[]>('/api/ratings'),

  create: async (data: CreateRatingInput): Promise<RatingReview> => {
    const created = await apiRequest<RatingReview>('/api/ratings', 'POST', {
      bookingId: Number(data.bookingId),
      score: data.score,
      comment: data.comment,
    });

    bookingRepository.markAsRated(data.bookingId);
    return created;
  },
};

/* ------------------------------------------------------------------ */
/* الوضع التجريبي                                                       */
/* ------------------------------------------------------------------ */

const demoRatingRepository = {
  getByServiceId: async (serviceId: string): Promise<RatingReview[]> => {
    await new Promise(r => setTimeout(r, 150));
    const ratings = storage.getRatings();
    return ratings
      .filter(r => r.serviceId === serviceId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getByProviderId: async (providerId: string): Promise<RatingReview[]> => {
    await new Promise(r => setTimeout(r, 150));
    const ratings = storage.getRatings();
    return ratings
      .filter(r => r.providerId === providerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getByBeneficiaryId: async (beneficiaryId: string): Promise<RatingReview[]> => {
    await new Promise(r => setTimeout(r, 150));
    const ratings = storage.getRatings();
    return ratings
      .filter(r => r.beneficiaryId === beneficiaryId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getMine: async (): Promise<RatingReview[]> => [],

  create: async (data: CreateRatingInput): Promise<RatingReview> => {
    await new Promise(r => setTimeout(r, 400));
    const ratings = storage.getRatings();

    const newRating: RatingReview = {
      ...data,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    ratings.unshift(newRating);
    storage.saveRatings(ratings);

    // Update booking
    bookingRepository.markAsRated(data.bookingId);

    // Recalculate service rating
    const services = storage.getServices();
    const serviceIdx = services.findIndex(s => s.id === data.serviceId);
    if (serviceIdx !== -1) {
      const sRatings = ratings.filter(r => r.serviceId === data.serviceId);
      const totalScore = sRatings.reduce((sum, r) => sum + r.score, 0);
      services[serviceIdx].reviewsCount = sRatings.length;
      services[serviceIdx].rating = Number((totalScore / sRatings.length).toFixed(2));
      storage.saveServices(services);
    }

    // Recalculate provider rating
    const providers = storage.getProviders();
    const provIdx = providers.findIndex(p => p.id === data.providerId);
    if (provIdx !== -1) {
      const pRatings = ratings.filter(r => r.providerId === data.providerId);
      const totalScore = pRatings.reduce((sum, r) => sum + r.score, 0);
      providers[provIdx].reviewsCount = pRatings.length;
      providers[provIdx].rating = Number((totalScore / pRatings.length).toFixed(2));
      storage.saveProviders(providers);
    }

    return newRating;
  },
};

export const ratingRepository = isRealMode
  ? realRatingRepository
  : demoRatingRepository;
