import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, CalendarCheck, Heart, Star, 
  User as UserIcon, Briefcase, PlusCircle, LogOut,
  ChevronRight, RefreshCw, ShieldAlert, CheckCircle, Menu, X, ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'beneficiary' | 'provider';
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  title,
  subtitle,
  action,
}) => {
  const { user, providerProfile, logout, switchDemoRole, resetAllDemoData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const beneficiaryLinks = [
    { name: 'نظرة عامة', path: '/beneficiary/dashboard', icon: LayoutDashboard },
    { name: 'حجوزاتي', path: '/beneficiary/bookings', icon: CalendarCheck },
    { name: 'المفضلة', path: '/beneficiary/favorites', icon: Heart },
    { name: 'تقييماتي', path: '/beneficiary/ratings', icon: Star },
    { name: 'الملف الشخصي', path: '/beneficiary/profile', icon: UserIcon },
  ];

  const providerLinks = [
    { name: 'لوحة التحكم', path: '/provider/dashboard', icon: LayoutDashboard },
    { name: 'خدماتي المنشورة', path: '/provider/services', icon: Briefcase },
    { name: 'إدارة الحجوزات', path: '/provider/bookings', icon: CalendarCheck },
    { name: 'الملف المهني', path: '/provider/profile', icon: UserIcon },
  ];

  const links = role === 'provider' ? providerLinks : beneficiaryLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col">
      {/* Top Demo Bar */}
      <div className="bg-[#073D2D] text-white text-xs py-2 px-4 border-b border-gold-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm" className="bg-gold-500 text-charcoal-900 font-bold border-none">
            {role === 'provider' ? 'بوابة مقدم الخدمة (تجريبي)' : 'بوابة المستفيد (تجريبي)'}
          </Badge>
          <span className="hidden sm:inline text-stone-200 text-xs">
            أنت الآن تتصفح الحساب التجريبي لـ: <strong>{user?.fullName || 'ضيف'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => switchDemoRole(role === 'provider' ? 'beneficiary' : 'provider')}
            className="text-xs text-gold-300 hover:text-white underline font-medium transition-colors"
          >
            التبديل إلى حساب {role === 'provider' ? 'المستفيد' : 'مقدم الخدمة'}
          </button>
          <span className="text-stone-500">|</span>
          <button
            onClick={resetAllDemoData}
            title="إعادة ضبط البيانات الافتراضية"
            className="flex items-center gap-1 text-xs text-stone-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">إعادة ضبط البيانات</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-[#E3E8E5] shadow-soft p-5 sticky top-28">
            {/* User Info Card */}
            <div className="flex items-center gap-3 pb-5 border-b border-[#F0F3F2] mb-5">
              <img
                src={
                  role === 'provider' && providerProfile?.avatar
                    ? providerProfile.avatar
                    : user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                }
                alt={user?.fullName || 'User'}
                className="w-12 h-12 rounded-xl object-cover border border-emerald-200"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-charcoal-900 truncate">{user?.fullName}</h4>
                <p className="text-xs text-charcoal-500 font-mono truncate">{user?.phone}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {role === 'provider' ? 'مقدم خدمة معتمد' : 'مستفيد - زائر الحرم'}
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {links.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-700 text-white font-bold shadow-sm'
                        : 'text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-300' : 'text-charcoal-500'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Public Link */}
            <div className="pt-5 mt-5 border-t border-[#F0F3F2] space-y-2">
              <Link
                to="/services"
                className="flex items-center justify-between px-3 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                <span>استعراض جميع الخدمات</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-right"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-5 sm:p-6 rounded-2xl border border-[#E3E8E5] shadow-soft">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-stone-200 text-charcoal-700 hover:bg-stone-50"
                aria-label="فتح القائمة الجانبية"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">{title}</h1>
                {subtitle && <p className="text-xs sm:text-sm text-charcoal-500 mt-1">{subtitle}</p>}
              </div>
            </div>

            {action && <div className="shrink-0">{action}</div>}
          </div>

          {/* Children Content */}
          <div className="space-y-6">{children}</div>
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white p-6 shadow-2xl flex flex-col justify-between z-10 animate-slide-up">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#F0F3F2]">
                <span className="font-bold text-base text-charcoal-900">قائمة لوحة التحكم</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-charcoal-500 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4">
                <nav className="space-y-1">
                  {links.map(link => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'bg-emerald-700 text-white font-bold'
                            : 'text-charcoal-700 hover:bg-emerald-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="border-t border-[#F0F3F2] pt-4 space-y-2">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="block text-center py-2 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-xl"
              >
                العودة للصفحة الرئيسية
              </Link>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full text-center py-2 text-xs font-medium text-rose-600 bg-rose-50 rounded-xl"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
