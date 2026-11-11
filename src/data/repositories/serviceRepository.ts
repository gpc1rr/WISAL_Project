
import type { Service, FilterOptions } from '@/types';
import { storage } from '../mocks/storage';

import {
  mapApiService,
  mapApiServices,
  mapServiceToApi,
  type ApiService,
} from './serviceMapper';

/**
 * WISAL Service Repository
 *
 * Real mode: PHP REST API + MariaDB
 * Demo mode: Browser localStorage
 *
 * Favorites remain local because the current
 * database schema does not include a favorites table.
 */

const isRealMode = import.meta.env.VITE_AUTH_MODE !== 'demo';

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/$/, '');

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
}

/**
 * Make an authenticated API request.
 *
 * Session cookies are sent automatically.
 * State-changing requests include a CSRF token.
 */
async function apiRequest<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {};

  if (method !== 'GET') {
    const csrfResponse = await fetch(
      `${API_URL}/api/auth/csrf`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!csrfResponse.ok) {
      throw new Error('تعذر تهيئة جلسة الحماية');
    }

    const csrfPayload =
      (await csrfResponse.json()) as ApiResponse<{
        csrfToken: string;
      }>;

    if (
      !csrfPayload.success ||
      !csrfPayload.data?.csrfToken
    ) {
      throw new Error('تعذر الحصول على رمز الحماية');
    }

    headers['X-CSRF-Token'] =
      csrfPayload.data.csrfToken;
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers,
      ...(body === undefined
        ? {}
        : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new Error(
      'تعذر الاتصال بخادم وصال. تأكد من تشغيل PHP Backend.'
    );
  }

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(
      'تعذر قراءة استجابة خادم وصال'
    );
  }

  if (
    !response.ok ||
    !payload.success ||
    payload.data === undefined
  ) {
    throw new Error(
      payload.error?.message ||
      'تعذر تنفيذ الطلب. يرجى المحاولة مجدداً.'
    );
  }

  return payload.data;
}

/**
 * Apply frontend marketplace filters.
 */
function applyFilters(
  input: Service[],
  filters?: FilterOptions
): Service[] {
  let services = [...input];

  if (!filters) {
    return services;
  }

  if (
    filters.category &&
    filters.category !== 'all'
  ) {
    services = services.filter(
      service =>
        service.category === filters.category
    );
  }

  if (filters.search?.trim()) {
    const query = filters.search
      .trim()
      .toLowerCase();

    services = services.filter(service =>
      [
        service.title,
        service.description,
        service.providerName,
        service.location,
      ].some(value =>
        value.toLowerCase().includes(query)
      )
    );
  }

  if (filters.minPrice !== undefined) {
    services = services.filter(
      service =>
        service.price >= filters.minPrice!
    );
  }

  if (filters.maxPrice !== undefined) {
    services = services.filter(
      service =>
        service.price <= filters.maxPrice!
    );
  }

  switch (filters.sortBy) {
    case 'price_asc':
      services.sort(
        (a, b) => a.price - b.price
      );
      break;

    case 'price_desc':
      services.sort(
        (a, b) => b.price - a.price
      );
      break;

    case 'rating_desc':
      services.sort(
        (a, b) => b.rating - a.rating
      );
      break;

    case 'recommended':
      services.sort(
        (a, b) =>
          b.reviewsCount * b.rating -
          a.reviewsCount * a.rating
      );
      break;

    default:
      break;
  }

  return services;
}

/**
 * Service repository.
 */
export const serviceRepository = {
  /**
   * Get all services.
   */
  getAll: async (
    filters?: FilterOptions
  ): Promise<Service[]> => {
    if (isRealMode) {
      const data = await apiRequest<ApiService[]>(
        '/api/services'
      );

      return applyFilters(
        mapApiServices(data),
        filters
      );
    }

    return applyFilters(
      storage.getServices(),
      filters
    );
  },

  /**
   * Get a single service.
   */
  getById: async (
    id: string
  ): Promise<Service | null> => {
    if (isRealMode) {
      if (!/^[1-9]\d*$/.test(id)) {
        return null;
      }

      try {
        const data = await apiRequest<ApiService>(
          `/api/services/${encodeURIComponent(id)}`
        );

        return mapApiService(data);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'الخدمة غير موجودة'
        ) {
          return null;
        }

        throw error;
      }
    }

    return (
      storage.getServices().find(
        service => service.id === id
      ) ?? null
    );
  },

  /**
   * Get services owned by a provider.
   */
  getByProviderId: async (
    providerId: string
  ): Promise<Service[]> => {
    const services =
      await serviceRepository.getAll();

    return services.filter(
      service =>
        service.providerId === providerId
    );
  },

  /**
   * Create a new service.
   */
  create: async (
    serviceData: Omit<
      Service,
      'id' | 'createdAt' | 'rating' | 'reviewsCount'
    >
  ): Promise<Service> => {
    if (isRealMode) {
      const data = await apiRequest<ApiService>(
        '/api/services',
        'POST',
        mapServiceToApi(serviceData)
      );

      return mapApiService(data);
    }

    const services = storage.getServices();

    const created: Service = {
      ...serviceData,
      id: `srv-${Date.now()}`,
      rating: 5,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };

    services.unshift(created);
    storage.saveServices(services);

    return created;
  },

  /**
   * Update an existing service.
   *
   * The backend verifies service ownership.
   */
  update: async (
    id: string,
    data: Partial<Service>
  ): Promise<Service> => {
    if (isRealMode) {
      if (!/^[1-9]\d*$/.test(id)) {
        throw new Error('معرّف الخدمة غير صالح');
      }

      const existing =
        await serviceRepository.getById(id);

      if (!existing) {
        throw new Error('الخدمة غير موجودة');
      }

      const updated = {
        ...existing,
        ...data,
      };

      const response = await apiRequest<ApiService>(
        `/api/services/${encodeURIComponent(id)}`,
        'PUT',
        mapServiceToApi(updated)
      );

      return mapApiService(response);
    }

    const services = storage.getServices();

    const index = services.findIndex(
      service => service.id === id
    );

    if (index < 0) {
      throw new Error('الخدمة غير موجودة');
    }

    services[index] = {
      ...services[index],
      ...data,
    };

    storage.saveServices(services);

    return services[index];
  },

  /**
   * Delete a service.
   *
   * The PHP backend is responsible for:
   * - Authentication
   * - CSRF validation
   * - Provider ownership validation
   * - Preventing deletion when bookings
   *   or ratings exist
   */
  delete: async (
    id: string
  ): Promise<void> => {
    if (isRealMode) {
      if (!/^[1-9]\d*$/.test(id)) {
        throw new Error('معرّف الخدمة غير صالح');
      }

      const result = await apiRequest<{
        deleted: boolean;
        id: number;
      }>(
        `/api/services/${encodeURIComponent(id)}`,
        'DELETE'
      );

      if (!result.deleted) {
        throw new Error('لم يتم حذف الخدمة');
      }

      // Remove deleted service from local favorites.
      const favorites = storage.getFavorites();

      if (favorites.includes(id)) {
        storage.saveFavorites(
          favorites.filter(
            favoriteId => favoriteId !== id
          )
        );
      }

      return;
    }

    storage.saveServices(
      storage.getServices().filter(
        service => service.id !== id
      )
    );

    storage.saveFavorites(
      storage.getFavorites().filter(
        favoriteId => favoriteId !== id
      )
    );
  },

  /**
   * Return favorite service IDs.
   *
   * Favorites are stored locally.
   */
  getFavorites: (): string[] => {
    return storage.getFavorites();
  },

  /**
   * Check whether a service is a favorite.
   */
  isFavorite: (
    serviceId: string
  ): boolean => {
    return storage
      .getFavorites()
      .includes(serviceId);
  },

  /**
   * Add or remove a favorite.
   */
  toggleFavorite: (
    serviceId: string
  ): boolean => {
    const favorites =
      storage.getFavorites();

    const exists =
      favorites.includes(serviceId);

    const updated = exists
      ? favorites.filter(
          id => id !== serviceId
        )
      : [...favorites, serviceId];

    storage.saveFavorites(updated);

    return !exists;
  },

  /**
   * Get the complete service records
   * corresponding to locally saved favorites.
   */
  getFavoriteServices: async (): Promise<Service[]> => {
    const favoriteIds =
      storage.getFavorites();

    const services =
      await serviceRepository.getAll();

    return services.filter(
      service =>
        favoriteIds.includes(service.id)
    );
  },
};
