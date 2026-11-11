import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ProviderProfile, UserRole } from '@/types';
import { authRepository } from '@/data/repositories/authRepository';
import { storage } from '@/data/mocks/storage';
import { realAuthRepository } from '@/data/repositories/realAuthRepository';

const realMode = import.meta.env.VITE_AUTH_MODE !== 'demo';

interface AuthContextType {
  user: User | null;
  providerProfile: ProviderProfile | null;
  isAuthenticated: boolean;
  isProvider: boolean;
  isBeneficiary: boolean;
  isLoading: boolean;
  login: (phone: string, pass: string) => Promise<User>;
  registerBeneficiary: (data: {
    fullName: string;
    phone: string;
    age?: number;
    nationality?: string;
    preferredLanguage?: string;
    password: string;
  }) => Promise<User>;
  registerProvider: (data: {
    fullName: string;
    phone: string;
    age: number;
    serviceType: string;
    experienceYears: number;
    languages: string[];
    bio?: string;
    password: string;
  }) => Promise<{ user: User; provider: ProviderProfile }>;
  updateUserProfile: (data: Partial<User>) => Promise<User>;
  updateProviderProfile: (data: Partial<ProviderProfile>) => Promise<ProviderProfile>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  resetAllDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserData = () => {
    const current = authRepository.getCurrentUser();
    setUser(current);
    if (current && current.role === 'provider') {
      const profile = authRepository.getCurrentProviderProfile();
      setProviderProfile(profile);
    } else {
      setProviderProfile(null);
    }
  };

  useEffect(() => {
    if (realMode) {
      realAuthRepository.me()
        .then(session => {
          setUser({ ...session.user, id: String(session.user.id) });
          setProviderProfile(session.provider ? { ...session.provider, id: String(session.provider.id), userId: String(session.provider.userId), bio: '', rating: 0, reviewsCount: 0, isVerified: false, avatar: '' } : null);
        })
        .catch(() => { setUser(null); setProviderProfile(null); })
        .finally(() => setIsLoading(false));
    } else { refreshUserData(); setIsLoading(false); }
  }, []);

  const login = async (phone: string, pass: string): Promise<User> => {
    setIsLoading(true);
    try {
      if (realMode) {
        const session = await realAuthRepository.login(phone, pass);
        const loggedUser = { ...session.user, id: String(session.user.id) };
        setUser(loggedUser);
        setProviderProfile(session.provider ? { ...session.provider, id: String(session.provider.id), userId: String(session.provider.userId), bio: '', rating: 0, reviewsCount: 0, isVerified: false, avatar: '' } : null);
        return loggedUser;
      }
      const loggedUser = await authRepository.login(phone, pass);
      setUser(loggedUser);
      if (loggedUser.role === 'provider') {
        setProviderProfile(authRepository.getCurrentProviderProfile());
      } else {
        setProviderProfile(null);
      }
      return loggedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const registerBeneficiary = async (data: {
    fullName: string;
    phone: string;
    age?: number;
    nationality?: string;
    preferredLanguage?: string;
    password: string;
  }): Promise<User> => {
    setIsLoading(true);
    try {
      if (realMode) {
        const session = await realAuthRepository.registerBeneficiary(data);
        const newUser = { ...session.user, id: String(session.user.id) };
        setUser(newUser); setProviderProfile(null); return newUser;
      }
      const newUser = await authRepository.registerBeneficiary(data);
      setUser(newUser);
      setProviderProfile(null);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  };

  const registerProvider = async (data: {
    fullName: string;
    phone: string;
    age: number;
    serviceType: string;
    experienceYears: number;
    languages: string[];
    bio?: string;
    password: string;
  }): Promise<{ user: User; provider: ProviderProfile }> => {
    setIsLoading(true);
    try {
      if (realMode) {
        const session = await realAuthRepository.registerProvider(data);
        if (!session.provider) throw new Error('تعذر تحميل ملف مقدم الخدمة');
        const res = { user: { ...session.user, id: String(session.user.id) }, provider: { ...session.provider, id: String(session.provider.id), userId: String(session.provider.userId), bio: '', rating: 0, reviewsCount: 0, isVerified: false, avatar: '' } };
        setUser(res.user); setProviderProfile(res.provider); return res;
      }
      const res = await authRepository.registerProvider(data);
      setUser(res.user);
      setProviderProfile(res.provider);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>): Promise<User> => {
    if (realMode) throw new Error('تعديل الملف الشخصي عبر قاعدة البيانات غير متاح حتى المرحلة التالية');
    if (!user) throw new Error('يرجى تسجيل الدخول أولاً');
    const updated = await authRepository.updateUserProfile(user.id, data);
    setUser(updated);
    return updated;
  };

  const updateProviderProfile = async (data: Partial<ProviderProfile>): Promise<ProviderProfile> => {
    if (realMode) throw new Error('تعديل الملف المهني عبر قاعدة البيانات غير متاح حتى المرحلة التالية');
    if (!providerProfile) throw new Error('الملف المهني غير موجود');
    const updated = await authRepository.updateProviderProfile(providerProfile.id, data);
    setProviderProfile(updated);
    return updated;
  };

  const logout = async (): Promise<void> => {
    if (realMode) await realAuthRepository.logout();
    else await authRepository.logout();
    setUser(null);
    setProviderProfile(null);
  };

  const switchDemoRole = (role: UserRole) => {
    if (realMode) throw new Error('تبديل الحساب التجريبي غير متاح مع المصادقة الحقيقية');
    const target = authRepository.switchDemoUser(role);
    setUser(target);
    if (target.role === 'provider') {
      setProviderProfile(authRepository.getCurrentProviderProfile());
    } else {
      setProviderProfile(null);
    }
  };

  const resetAllDemoData = () => {
    if (realMode) throw new Error('إعادة ضبط البيانات التجريبية غير متاحة مع المصادقة الحقيقية');
    storage.resetToSeeds();
    refreshUserData();
  };

  const value = {
    user,
    providerProfile,
    isAuthenticated: !!user,
    isProvider: user?.role === 'provider',
    isBeneficiary: user?.role === 'beneficiary',
    isLoading,
    login,
    registerBeneficiary,
    registerProvider,
    updateUserProfile,
    updateProviderProfile,
    logout,
    switchDemoRole,
    resetAllDemoData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
