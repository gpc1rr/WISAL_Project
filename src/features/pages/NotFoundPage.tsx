import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F6F0] px-4 py-16">
      <div className="max-w-md w-full text-center space-y-5 bg-white p-8 rounded-3xl border border-[#E3E8E5] shadow-soft">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-black text-emerald-800 font-cairo">404</span>
          <h1 className="text-xl font-bold text-charcoal-900">الصفحة المطلوبة غير موجودة</h1>
          <p className="text-xs text-charcoal-500 leading-relaxed">
            يبدو أن الرابط الذي حاولت الوصول إليه قد تم نقله أو تغييره. تفضل بالعودة للصفحة الرئيسية.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="md" rightIcon={<Home className="w-4 h-4" />}>
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
