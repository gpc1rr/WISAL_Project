import { Booking, BookingStatus, RatingReview } from '@/types';
import { storage } from '../mocks/storage';
import { apiRequest } from '../api/client';

/**
 * WISAL Booking Repository
 *
 * الوضع الحقيقي (real): الحجوزات تُحفظ وتُقرأ من قاعدة البيانات عبر الـ API،
 *   فيظهر نفس الحجز في الموقع والتطبيق.
 * الوضع التجريبي (demo): الحجوزات في ذاكرة المتصفح فقط (localStorage).
 */

const isRealMode = import.meta.env.VITE_AUTH_MODE !== 'demo';

type CreateBookingInput = {
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
};

/* ------------------------------------------------------------------ */
/* أدوات مساعدة للوضع الحقيقي                                          */
/* ------------------------------------------------------------------ */

const RATED_KEY = 'wisal_rated_bookings_v1';

function getRatedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RATED_KEY) || '[]') as string[];
  } catch {
    return [];
  }
}

function withRated(booking: Booking): Booking {
  return {
    ...booking,
    createdAt: booking.createdAt || booking.date,
    rated: booking.rated || getRatedIds().includes(booking.id),
  };
}

/**
 * يحوّل الفترة (مثل "الضحى (07:30 ص - 10:30 ص)") إلى ساعة بصيغة 24
 * عشان نرسل للخادم موعد كامل: "2026-11-20 07:30:00".
 */
function toBookingDateTime(date: string, timeSlot: string): string {
  const match = timeSlot.match(/(\d{1,2}):(\d{2})\s*([صم])?/);

  let hours = 9;
  let minutes = 0;

  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);

    const period = match[3];
    if (period === 'م' && hours < 12) hours += 12;
    if (period === 'ص' && hours === 12) hours = 0;
  }

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');

  return `${date} ${hh}:${mm}:00`;
}

/* ------------------------------------------------------------------ */
/* الوضع الحقيقي: قاعدة البيانات عبر الـ API                            */
/* ------------------------------------------------------------------ */

const realBookingRepository = {
  // الخادم يعرف المستخدم من الجلسة، ويرجّع حجوزاته هو فقط.
  // ونجيب تقييماته من القاعدة عشان نعرف أي حجز قيّمه من قبل.
  getByBeneficiaryId: async (_beneficiaryId: string): Promise<Booking[]> => {
    const [data, myRatings] = await Promise.all([
      apiRequest<Booking[]>('/api/bookings'),
      apiRequest<RatingReview[]>('/api/ratings').catch(() => [] as RatingReview[]),
    ]);

    const ratedIds = new Set(myRatings.map(r => String(r.bookingId)));

    return data.map(b => {
      const booking = withRated(b);
      return ratedIds.has(String(b.id)) ? { ...booking, rated: true } : booking;
    });
  },

  getByProviderId: async (_providerId: string): Promise<Booking[]> => {
    const data = await apiRequest<Booking[]>('/api/bookings');
    return data.map(withRated);
  },

  getById: async (id: string): Promise<Booking | null> => {
    try {
      const data = await apiRequest<Booking>(`/api/bookings/${id}`);
      return withRated(data);
    } catch {
      return null;
    }
  },

  create: async (data: CreateBookingInput): Promise<Booking> => {
    const created = await apiRequest<Booking>('/api/bookings', 'POST', {
      serviceId: Number(data.serviceId),
      bookingDate: toBookingDateTime(data.date, data.timeSlot),
      meetingLocation: data.meetingPoint,
    });

    return withRated(created);
  },

  updateStatus: async (bookingId: string, newStatus: BookingStatus): Promise<Booking> => {
    const updated = await apiRequest<Booking>(
      `/api/bookings/${bookingId}/status`,
      'PATCH',
      { status: newStatus }
    );

    return withRated(updated);
  },

  cancel: async (bookingId: string): Promise<Booking> => {
    return realBookingRepository.updateStatus(bookingId, 'cancelled');
  },

  markAsRated: (bookingId: string): void => {
    const ids = getRatedIds();
    if (!ids.includes(bookingId)) {
      ids.push(bookingId);
      localStorage.setItem(RATED_KEY, JSON.stringify(ids));
    }
  },
};

/* ------------------------------------------------------------------ */
/* الوضع التجريبي: ذاكرة المتصفح                                        */
/* ------------------------------------------------------------------ */

const demoBookingRepository = {
  getByBeneficiaryId: async (beneficiaryId: string): Promise<Booking[]> => {
    await new Promise(r => setTimeout(r, 200));
    const bookings = storage.getBookings();
    return bookings
      .filter(b => b.beneficiaryId === beneficiaryId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getByProviderId: async (providerId: string): Promise<Booking[]> => {
    await new Promise(r => setTimeout(r, 200));
    const bookings = storage.getBookings();
    return bookings
      .filter(b => b.providerId === providerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getById: async (id: string): Promise<Booking | null> => {
    await new Promise(r => setTimeout(r, 150));
    const bookings = storage.getBookings();
    return bookings.find(b => b.id === id) || null;
  },

  create: async (data: CreateBookingInput): Promise<Booking> => {
    await new Promise(r => setTimeout(r, 500));
    const bookings = storage.getBookings();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...data,
      id: `bok-${Date.now()}`,
      bookingNumber: `WSL-2026-${randomSuffix}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      rated: false,
    };

    bookings.unshift(newBooking);
    storage.saveBookings(bookings);
    return newBooking;
  },

  updateStatus: async (bookingId: string, newStatus: BookingStatus): Promise<Booking> => {
    await new Promise(r => setTimeout(r, 300));
    const bookings = storage.getBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) throw new Error('الحجز غير موجود');

    bookings[idx] = {
      ...bookings[idx],
      status: newStatus,
    };

    storage.saveBookings(bookings);
    return bookings[idx];
  },

  cancel: async (bookingId: string): Promise<Booking> => {
    return demoBookingRepository.updateStatus(bookingId, 'cancelled');
  },

  markAsRated: (bookingId: string): void => {
    const bookings = storage.getBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      bookings[idx].rated = true;
      storage.saveBookings(bookings);
    }
  },
};

export const bookingRepository = isRealMode
  ? realBookingRepository
  : demoBookingRepository;
