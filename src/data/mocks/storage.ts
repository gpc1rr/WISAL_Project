import { User, ProviderProfile, Service, Booking, RatingReview } from '@/types';
import { SEED_USERS, SEED_PROVIDERS, SEED_SERVICES, SEED_BOOKINGS, SEED_RATINGS } from './seedData';

const STORAGE_KEYS = {
  USERS: 'wisal_users_v1',
  CURRENT_USER: 'wisal_current_user_v1',
  PROVIDERS: 'wisal_providers_v1',
  SERVICES: 'wisal_services_v1',
  BOOKINGS: 'wisal_bookings_v1',
  RATINGS: 'wisal_ratings_v1',
  FAVORITES: 'wisal_favorites_v1',
};

class StorageService {
  private get<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultVal;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Error reading ${key} from localStorage`, e);
      return defaultVal;
    }
  }

  private set<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn(`Error writing ${key} to localStorage`, e);
    }
  }

  public init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.set(STORAGE_KEYS.USERS, SEED_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROVIDERS)) {
      this.set(STORAGE_KEYS.PROVIDERS, SEED_PROVIDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      this.set(STORAGE_KEYS.SERVICES, SEED_SERVICES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      this.set(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RATINGS)) {
      this.set(STORAGE_KEYS.RATINGS, SEED_RATINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      this.set(STORAGE_KEYS.FAVORITES, ['srv-1', 'srv-2']);
    }
    // Default current user to beneficiary for seamless demo experience
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      this.set(STORAGE_KEYS.CURRENT_USER, SEED_USERS[0]); // Default to Abdullah Al-Ghamdi
    }
  }

  public resetToSeeds(): void {
    this.set(STORAGE_KEYS.USERS, SEED_USERS);
    this.set(STORAGE_KEYS.PROVIDERS, SEED_PROVIDERS);
    this.set(STORAGE_KEYS.SERVICES, SEED_SERVICES);
    this.set(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
    this.set(STORAGE_KEYS.RATINGS, SEED_RATINGS);
    this.set(STORAGE_KEYS.FAVORITES, ['srv-1', 'srv-2']);
    this.set(STORAGE_KEYS.CURRENT_USER, SEED_USERS[0]);
  }

  // Users & Auth
  public getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }
  public saveUsers(users: User[]): void {
    this.set(STORAGE_KEYS.USERS, users);
  }
  public getCurrentUser(): User | null {
    return this.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }
  public setCurrentUser(user: User | null): void {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Providers
  public getProviders(): ProviderProfile[] {
    return this.get<ProviderProfile[]>(STORAGE_KEYS.PROVIDERS, SEED_PROVIDERS);
  }
  public saveProviders(providers: ProviderProfile[]): void {
    this.set(STORAGE_KEYS.PROVIDERS, providers);
  }

  // Services
  public getServices(): Service[] {
    return this.get<Service[]>(STORAGE_KEYS.SERVICES, SEED_SERVICES);
  }
  public saveServices(services: Service[]): void {
    this.set(STORAGE_KEYS.SERVICES, services);
  }

  // Bookings
  public getBookings(): Booking[] {
    return this.get<Booking[]>(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
  }
  public saveBookings(bookings: Booking[]): void {
    this.set(STORAGE_KEYS.BOOKINGS, bookings);
  }

  // Ratings
  public getRatings(): RatingReview[] {
    return this.get<RatingReview[]>(STORAGE_KEYS.RATINGS, SEED_RATINGS);
  }
  public saveRatings(ratings: RatingReview[]): void {
    this.set(STORAGE_KEYS.RATINGS, ratings);
  }

  // Favorites
  public getFavorites(): string[] {
    return this.get<string[]>(STORAGE_KEYS.FAVORITES, ['srv-1', 'srv-2']);
  }
  public saveFavorites(favorites: string[]): void {
    this.set(STORAGE_KEYS.FAVORITES, favorites);
  }
}

export const storage = new StorageService();
// Initialize storage
storage.init();
