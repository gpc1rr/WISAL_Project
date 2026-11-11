import React from 'react';
import { Link } from 'react-router-dom';
import { IslamicPattern } from '@/components/shared/IslamicPattern';
import { Heart, Compass, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#073D2D] text-white border-t-2 border-gold-500/40 relative overflow-hidden">
      <IslamicPattern variant="subtle" className="opacity-10 text-gold-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-800/80">
          {/* Brand & Vision */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center text-gold-400 border border-gold-500/40">
                <svg className="w-6 h-6" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 15 L80 45 L50 75 L20 45 Z" fill="none" stroke="#C9A45C" strokeWidth="7" />
                  <circle cx="50" cy="45" r="10" fill="#C9A45C" />
                  <path d="M30 80 Q50 70 70 80" stroke="#C9A45C" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-2xl font-black text-gold-400 font-cairo">وِصَــال</span>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed max-w-sm">
              منصة رقمية رائدة لتيسير خدمة ضيوف الرحمن في المسجد الحرام بمكة المكرمة، عبر ربط المستفيدين من معتمرين وزوار بنخبة من مقدمي الخدمات المساندة المؤهلين.
            </p>

            <div className="pt-2 text-xs text-gold-300/90 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>مشروع تخرج جامعي مكرس لخدمة قاصدي بيت الله الحرام</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">صفحات المنصة</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <Link to="/" className="hover:text-gold-300 transition-colors">الرئيسية</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-gold-300 transition-colors">استعراض الخدمات</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-gold-300 transition-colors">كيف تعمل المنصة</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-300 transition-colors">عن وصال</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-300 transition-colors">تواصل معنا</Link>
              </li>
            </ul>
          </div>

          {/* Service Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">مجالات الخدمة</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <Link to="/services?category=escort_guidance" className="hover:text-gold-300 transition-colors">مرافقة وإرشاد</Link>
              </li>
              <li>
                <Link to="/services?category=elderly_assistance" className="hover:text-gold-300 transition-colors">مساعدة كبار السن</Link>
              </li>
              <li>
                <Link to="/services?category=translation" className="hover:text-gold-300 transition-colors">الترجمة واللغات</Link>
              </li>
              <li>
                <Link to="/services?category=mobility_support" className="hover:text-gold-300 transition-colors">التنقل والعربات</Link>
              </li>
              <li>
                <Link to="/services?category=support_care" className="hover:text-gold-300 transition-colors">دعم ومساندة العائلات</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Safety */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">الميثاق والخصوصية</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <Link to="/terms" className="hover:text-gold-300 transition-colors">الشروط والأحكام</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gold-300 transition-colors">سياسة الخصوصية</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold-300 transition-colors">الأسئلة الشائعة</Link>
              </li>
              <li>
                <span className="text-stone-400 text-xs block pt-2">
                  مكة المكرمة، المملكة العربية السعودية
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} منصة وصال (WISAL). جميع الحقوق محفوظة لفرق عمل مشروع التخرج الجامعي.</p>
          <div className="flex items-center gap-1 text-stone-300">
            <span>صُنعت بكل محبة وإخلاص في</span>
            <span className="text-gold-400 font-bold">مكة المكرمة</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
