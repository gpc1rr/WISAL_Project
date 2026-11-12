import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import { apiRequest } from '@/data/api/client';
import { MapPin, Mail, Phone, Send, CheckCircle2 } from 'lucide-react';

// الإيميل الرسمي لفريق وصال (تصله رسائل هذا النموذج)
const SUPPORT_EMAIL = 'wesal.support.team@gmail.com';

export const ContactPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // خانة مخفية لصيد البرامج الآلية (الإنسان ما يشوفها)
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await apiRequest('/api/contact', 'POST', {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        message: message.trim(),
        website,
      });

      setIsSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      success('تم استلام رسالتكم بنجاح!', 'شكراً لتواصلكم مع فريق عمل منصة وصال');
    } catch (err: any) {
      toastError(err.message || 'تعذر إرسال الرسالة، حاول مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8F6F0] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <Badge variant="emerald" size="md">
            تواصل معنا
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-charcoal-900 font-cairo">
            نسعد بتواصلكم وملاحظاتكم الكريمة
          </h1>
          <p className="text-sm text-charcoal-600">
            فريق عمل مشروع وصال يرحب بأي استفسارات أو مقترحات لتطوير المنصة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="md:col-span-5 space-y-6">
            <Card className="p-6 border-[#E3E8E5] space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-charcoal-900">الموقع</h3>
                  <p className="text-xs text-charcoal-600 mt-1">مكة المكرمة، المملكة العربية السعودية</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-charcoal-900">البريد الإلكتروني</h3>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-xs text-emerald-800 hover:text-emerald-900 hover:underline mt-1 font-mono block break-all"
                    dir="ltr"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-charcoal-900">رقم الهاتف</h3>
                  <p className="text-xs text-charcoal-600 mt-1 font-mono">+966 12 500 0000</p>
                </div>
              </div>
            </Card>

            <div className="p-5 rounded-2xl bg-[#073D2D] text-white space-y-2 border border-gold-500/30">
              <h4 className="font-bold text-sm text-gold-300">ساعات الدعم:</h4>
              <p className="text-xs text-stone-200 leading-relaxed">
                طوال أيام الأسبوع على مدار 24 ساعة تزامناً مع أوقات الطواف والصلوات في المسجد الحرام.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            <Card className="p-6 sm:p-8 border-[#E3E8E5]">
              {isSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal-900">تم إرسال رسالتكم بنجاح</h3>
                  <p className="text-xs text-charcoal-600 max-w-sm mx-auto">
                    شكراً لاهتمامكم وتواصلكم معنا. وصلت رسالتكم لفريق وصال، وسنتواصل معكم في أقرب وقت.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
                    إرسال رسالة أخرى
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="الاسم الكريم"
                    required
                    placeholder="مثال: محمد بن علي"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />

                  <Input
                    label="رقم الجوال"
                    required
                    placeholder="05XXXXXXXX"
                    inputMode="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />

                  <Input
                    label="البريد الإلكتروني (اختياري)"
                    type="email"
                    placeholder="name@example.com"
                    dir="ltr"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    helperText="إذا كتبته نقدر نرد عليك بالإيميل مباشرة"
                  />

                  {/* خانة مخفية ضد البرامج الآلية — لا تحذفها */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-charcoal-800 mb-1.5">
                      نص الرسالة أو الاستفسار <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full rounded-xl border border-[#D0DBD5] bg-white p-3 text-sm text-charcoal-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                      placeholder="اكتب استفسارك أو اقتراحك هنا..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      type="submit"
                      isLoading={isSubmitting}
                      leftIcon={<Send className="w-4 h-4" />}
                    >
                      إرسال الرسالة
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
