import { Booking, BookingStatus } from '@/types';
import { storage } from '../mocks/storage';

export const bookingRepository = {
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

  create: async (data: {
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
  }): Promise<Booking> => {
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
    return bookingRepository.updateStatus(bookingId, 'cancelled');
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
