import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Menu, X, User as UserIcon, LayoutDashboard, 
  LogOut, RefreshCw, ChevronDown, Sparkles
} from 'lucide-react';

// أزرار الحساب التجريبي تظهر فقط في الوضع التجريبي (demo)
const isDemo = import.meta.env.VITE_AUTH_MODE === 'demo';

export const Navbar: React.FC = () => {
  const { user, isProvider, isAuthenticated, logout, switchDemoRole, resetAllDemoData } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'استعراض الخدمات', path: '/services' },
    { name: 'كيف تعمل المنصة', path: '/how-it-works' },
    { name: 'عن وصال', path: '/about' },
    { name: 'تواصل معنا', path: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3E8E5] shadow-xs">
      {/* Top Demo Bar (demo mode only) */}
      {isDemo && (
      <div className="bg-[#073D2D] text-white text-xs py-1.5 px-4 text-center flex items-center justify-between border-b border-gold-500/30">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-block w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="font-medium text-stone-200">
            نسخة تجريبية تفاعلية — مشروع تخرج جامعي منصة وصال (Makkah Holy Mosque Services)
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="text-stone-300">تبديل الحساب التجريبي السريع:</span>
          <button
            onClick={() => switchDemoRole('beneficiary')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              user?.role === 'beneficiary' ? 'bg-gold-500 text-charcoal-900 font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            مستفيد (زائر)
          </button>
          <span className="text-stone-500">|</span>
          <button
            onClick={() => switchDemoRole('provider')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              user?.role === 'provider' ? 'bg-gold-500 text-charcoal-900 font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            مقدم خدمة
          </button>
          <span className="text-stone-500">|</span>
          <button
            onClick={resetAllDemoData}
            title="إعادة تعيين البيانات الافتراضية"
            className="flex items-center gap-1 text-gold-300 hover:text-gold-200 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>إعادة ضبط البيانات</span>
          </button>
        </div>
      </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official WISAL Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2 group focus:outline-none" aria-label="وصال - الرئيسية">
            <img
              src="/wisal-logo.png"
              alt="شعار وصال"
              className="w-[108px] h-[70px] object-contain rounded-lg shrink-0"
              loading="eager"
            />
            <div className="hidden sm:block text-right">
              <span className="block text-xs font-semibold text-emerald-800">WISAL</span>
              <p className="text-[11px] text-charcoal-500 font-medium">ربطك بخدمات الحرم المكي الشريف</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-charcoal-700 hover:text-emerald-800 hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Controls / Auth CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-[#D0DBD5] hover:border-emerald-600/40 bg-white transition-all shadow-xs focus:outline-none"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-lg object-cover border border-emerald-100"
                  />
                  <div className="text-right">
                    <span className="block text-xs font-bold text-charcoal-900 leading-tight">
                      {user.fullName.split(' ')[0]}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-medium">
                      {isProvider ? 'مقدم خدمة' : 'مستفيد'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-charcoal-400 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-elevated border border-[#E3E8E5] animate-slide-up z-50 text-right"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#F0F3F2] mb-1">
                      <p className="text-xs font-bold text-charcoal-900">{user.fullName}</p>
                      <p className="text-[11px] text-charcoal-500 font-mono">{user.phone}</p>
                    </div>

                    <Link
                      to={isProvider ? '/provider/dashboard' : '/beneficiary/dashboard'}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                      <span>لوحة التحكم ({isProvider ? 'مقدم الخدمة' : 'المستفيد'})</span>
                    </Link>

                    <Link
                      to={isProvider ? '/provider/profile' : '/beneficiary/profile'}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-700" />
                      <span>الملف الشخصي</span>
                    </Link>

                    <div className="border-t border-[#F0F3F2] my-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors text-right"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" rightIcon={<Sparkles className="w-3.5 h-3.5" />}>
                    انضم إلينا
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-stone-200 text-charcoal-700 hover:bg-stone-50"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E3E8E5] px-4 pt-3 pb-6 space-y-3 animate-slide-up">
          <div className="space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-charcoal-800 hover:bg-emerald-50"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F0F3F2]">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-emerald-50/70 rounded-xl">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={user.fullName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-charcoal-900">{user.fullName}</p>
                    <p className="text-[11px] text-emerald-700">{isProvider ? 'مقدم خدمة' : 'مستفيد'}</p>
                  </div>
                </div>

                <Link
                  to={isProvider ? '/provider/dashboard' : '/beneficiary/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  الدخول إلى لوحة التحكم
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center py-2 text-rose-700 bg-rose-50 rounded-xl text-xs font-bold"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    حساب جديد
                  </Button>
                </Link>
              </div>
            )}

            {/* Quick Demo Switchers on Mobile (demo mode only) */}
            {isDemo && (
            <div className="mt-4 pt-3 border-t border-stone-200 text-xs">
              <p className="text-charcoal-500 mb-2 font-medium">التبديل السريع للحساب التجريبي:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    switchDemoRole('beneficiary');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-1.5 px-2 bg-stone-100 rounded-lg text-charcoal-800 text-center font-medium"
                >
                  مستفيد
                </button>
                <button
                  onClick={() => {
                    switchDemoRole('provider');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-1.5 px-2 bg-stone-100 rounded-lg text-charcoal-800 text-center font-medium"
                >
                  مقدم خدمة
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
