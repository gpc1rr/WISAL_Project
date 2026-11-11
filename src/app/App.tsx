import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/useToast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AppRoutes } from './routes';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith('/beneficiary') ||
    location.pathname.startsWith('/provider');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {/* Show Public Navbar on non-dashboard routes */}
      {!isDashboardRoute && <Navbar />}
      
      <main className="flex-1">
        <AppRoutes />
      </main>

      {/* Show Public Footer on non-dashboard routes */}
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <MainLayout />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
