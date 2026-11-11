import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public pages
import { HomePage } from '@/features/home/HomePage';
import { ServicesPage } from '@/features/services/ServicesPage';
import { ServiceDetailPage } from '@/features/services/ServiceDetailPage';
import { AboutPage } from '@/features/pages/AboutPage';
import { HowItWorksPage } from '@/features/pages/HowItWorksPage';
import { ContactPage } from '@/features/pages/ContactPage';
import { FaqPage } from '@/features/pages/FaqPage';
import { TermsPage } from '@/features/pages/TermsPage';
import { PrivacyPage } from '@/features/pages/PrivacyPage';
import { NotFoundPage } from '@/features/pages/NotFoundPage';

// Auth pages
import { LoginPage } from '@/features/authentication/LoginPage';
import { RegisterTypePage } from '@/features/authentication/RegisterTypePage';
import { BeneficiaryRegisterPage } from '@/features/authentication/BeneficiaryRegisterPage';
import { ProviderRegisterPage } from '@/features/authentication/ProviderRegisterPage';

// Beneficiary pages
import { BeneficiaryDashboard } from '@/features/beneficiary/BeneficiaryDashboard';
import { BeneficiaryBookings } from '@/features/beneficiary/BeneficiaryBookings';
import { BeneficiaryFavorites } from '@/features/beneficiary/BeneficiaryFavorites';
import { BeneficiaryRatings } from '@/features/beneficiary/BeneficiaryRatings';
import { BeneficiaryProfile } from '@/features/beneficiary/BeneficiaryProfile';

// Provider pages
import { ProviderDashboard } from '@/features/provider/ProviderDashboard';
import { ProviderServices } from '@/features/provider/ProviderServices';
import { ProviderBookings } from '@/features/provider/ProviderBookings';
import { ProviderProfilePage } from '@/features/provider/ProviderProfile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterTypePage />} />
      <Route path="/register/beneficiary" element={<BeneficiaryRegisterPage />} />
      <Route path="/register/provider" element={<ProviderRegisterPage />} />

      {/* Beneficiary Portal */}
      <Route path="/beneficiary/dashboard" element={<BeneficiaryDashboard />} />
      <Route path="/beneficiary/bookings" element={<BeneficiaryBookings />} />
      <Route path="/beneficiary/favorites" element={<BeneficiaryFavorites />} />
      <Route path="/beneficiary/ratings" element={<BeneficiaryRatings />} />
      <Route path="/beneficiary/profile" element={<BeneficiaryProfile />} />

      {/* Provider Portal */}
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      <Route path="/provider/services" element={<ProviderServices />} />
      <Route path="/provider/bookings" element={<ProviderBookings />} />
      <Route path="/provider/profile" element={<ProviderProfilePage />} />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
