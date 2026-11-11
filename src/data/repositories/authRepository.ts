import { User, ProviderProfile, UserRole } from '@/types';
import { storage } from '../mocks/storage';

export const authRepository = {
  getCurrentUser: (): User | null => {
    return storage.getCurrentUser();
  },

  getCurrentProviderProfile: (): ProviderProfile | null => {
    const user = storage.getCurrentUser();
    if (!user || user.role !== 'provider') return null;
    const providers = storage.getProviders();
    return providers.find(p => p.userId === user.id) || null;
  },

  login: async (phone: string, _password: string): Promise<User> => {
    // Artificial latency for realistic async feel
    await new Promise(r => setTimeout(r, 400));
    const users = storage.getUsers();
    const user = users.find(u => u.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
    if (!user) {
      throw new Error('رقم الجوال غير مسجل مسبقاً، يرجى إنشاء حساب جديد');
    }
    storage.setCurrentUser(user);
    return user;
  },

  registerBeneficiary: async (data: {
    fullName: string;
    phone: string;
    age?: number;
    nationality?: string;
    preferredLanguage?: string;
  }): Promise<User> => {
    await new Promise(r => setTimeout(r, 500));
    const users = storage.getUsers();
    const existing = users.find(u => u.phone === data.phone);
    if (existing) {
      throw new Error('رقم الجوال مسجل مسبقاً، تفضل بتسجيل الدخول');
    }

    const newUser: User = {
      id: `usr-ben-${Date.now()}`,
      fullName: data.fullName,
      phone: data.phone,
      role: 'beneficiary',
      age: data.age,
      nationality: data.nationality || 'سعودي',
      preferredLanguage: data.preferredLanguage || 'العربية',
      createdAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    users.push(newUser);
    storage.saveUsers(users);
    storage.setCurrentUser(newUser);
    return newUser;
  },

  registerProvider: async (data: {
    fullName: string;
    phone: string;
    age: number;
    serviceType: string;
    experienceYears: number;
    languages: string[];
    bio?: string;
  }): Promise<{ user: User; provider: ProviderProfile }> => {
    await new Promise(r => setTimeout(r, 500));
    const users = storage.getUsers();
    const existing = users.find(u => u.phone === data.phone);
    if (existing) {
      throw new Error('رقم الجوال مسجل مسبقاً لمستخدم آخر');
    }

    const newUserId = `usr-prov-${Date.now()}`;
    const newProvId = `prov-${Date.now()}`;

    const newUser: User = {
      id: newUserId,
      fullName: data.fullName,
      phone: data.phone,
      role: 'provider',
      age: data.age,
      nationality: 'سعودي',
      preferredLanguage: 'العربية',
      createdAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    };

    const newProvider: ProviderProfile = {
      id: newProvId,
      userId: newUserId,
      fullName: data.fullName,
      phone: data.phone,
      age: data.age,
      serviceType: data.serviceType,
      experienceYears: data.experienceYears,
      languages: data.languages,
      bio: data.bio || 'مقدم خدمة معتمد لدى منصة وصال لخدمة قاصدي الحرم المكي الشريف.',
      rating: 5.0,
      reviewsCount: 0,
      isVerified: true,
      avatar: newUser.avatar!,
    };

    const providers = storage.getProviders();
    users.push(newUser);
    providers.push(newProvider);

    storage.saveUsers(users);
    storage.saveProviders(providers);
    storage.setCurrentUser(newUser);

    return { user: newUser, provider: newProvider };
  },

  updateUserProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await new Promise(r => setTimeout(r, 300));
    const users = storage.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('المستخدم غير موجود');

    users[idx] = { ...users[idx], ...data };
    storage.saveUsers(users);

    const current = storage.getCurrentUser();
    if (current?.id === userId) {
      storage.setCurrentUser(users[idx]);
    }
    return users[idx];
  },

  updateProviderProfile: async (providerId: string, data: Partial<ProviderProfile>): Promise<ProviderProfile> => {
    await new Promise(r => setTimeout(r, 300));
    const providers = storage.getProviders();
    const idx = providers.findIndex(p => p.id === providerId);
    if (idx === -1) throw new Error('الملف المهني غير موجود');

    providers[idx] = { ...providers[idx], ...data };
    storage.saveProviders(providers);
    return providers[idx];
  },

  logout: async (): Promise<void> => {
    storage.setCurrentUser(null);
  },

  switchDemoUser: (role: UserRole): User => {
    const users = storage.getUsers();
    const target = users.find(u => u.role === role) || users[0];
    storage.setCurrentUser(target);
    return target;
  },
};
