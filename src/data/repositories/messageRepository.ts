import { ChatMessage } from '@/types';
import { apiRequest } from '../api/client';

/**
 * المحادثة بين المستفيد ومقدم الخدمة داخل الحجز.
 * الرسائل محفوظة في قاعدة البيانات (جدول booking_messages)،
 * فتظهر نفس المحادثة في الموقع والتطبيق.
 */

export interface ChatThread {
  messages: ChatMessage[];
  canSend: boolean;
}

export const messageRepository = {
  /**
   * جلب رسائل الحجز.
   * afterId: لو أرسلناه، يرجّع الخادم الرسائل الأحدث منه فقط.
   */
  list: (bookingId: string, afterId?: string): Promise<ChatThread> => {
    const query = afterId ? `?after=${encodeURIComponent(afterId)}` : '';
    return apiRequest<ChatThread>(`/api/bookings/${bookingId}/messages${query}`);
  },

  send: (bookingId: string, body: string): Promise<ChatMessage> => {
    return apiRequest<ChatMessage>(
      `/api/bookings/${bookingId}/messages`,
      'POST',
      { body }
    );
  },
};
