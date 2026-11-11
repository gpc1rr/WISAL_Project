import { RatingReview } from '@/types';
import { storage } from '../mocks/storage';
import { bookingRepository } from './bookingRepository';

export const ratingRepository = {
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

  create: async (data: {
    bookingId: string;
    serviceId: string;
    providerId: string;
    beneficiaryId: string;
    beneficiaryName: string;
    score: number;
    comment: string;
  }): Promise<RatingReview> => {
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
