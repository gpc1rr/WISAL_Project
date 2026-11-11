import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Service, ServiceCategory } from '@/types';
import { serviceRepository } from '@/data/repositories/serviceRepository';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/shared/EmptyState';
import { CATEGORIES, MAKKAH_MEETING_POINTS } from '@/utils/constants';
import { formatCurrency } from '@/utils/formatters';
import { useToast } from '@/hooks/useToast';
import { 
  Briefcase, PlusCircle, Edit3, Trash2, CheckCircle2, 
  MapPin, Clock, Star, ExternalLink, Image as ImageIcon
} from 'lucide-react';

export const ProviderServices: React.FC = () => {
  const { providerProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('escort_guidance');
  const [price, setPrice] = useState<number>(150);
  const [priceUnit, setPriceUnit] = useState('ريال / جولة');
  const [duration, setDuration] = useState('3 ساعات');
  const [location, setLocation] = useState('ساحات وصحن المطاف');
  const [meetingPointsText, setMeetingPointsText] = useState('ساحة باب الملك فهد، ساحة باب الملك عبدالعزيز');
  const [featuresText, setFeaturesText] = useState('استقبال عند البوابة، مرافقة الطواف والسعي');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = async () => {
    if (!providerProfile) return;
    const data = await serviceRepository.getByProviderId(providerProfile.id);
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, [providerProfile]);

  const handleOpenAdd = () => {
    setEditingService(null);
    setTitle('');
    setDescription('');
    setCategory('escort_guidance');
    setPrice(150);
    setPriceUnit('ريال / جولة');
    setDuration('3 ساعات');
    setLocation('ساحات وصحن المطاف والمسعى');
    setMeetingPointsText('ساحة باب الملك فهد (بوابة 79)، ساحة باب الملك عبدالعزيز (بوابة 1)');
    setFeaturesText('استقبال عند البوابة المتفق عليها\nتوجيه مسار الطواف في أوقات الهدوء\nمرافقة السعي بين الصفا والمروة');
    setImage('https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&auto=format&fit=crop&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setTitle(s.title);
    setDescription(s.description);
    setCategory(s.category);
    setPrice(s.price);
    setPriceUnit(s.priceUnit);
    setDuration(s.duration);
    setLocation(s.location);
    setMeetingPointsText(s.meetingPoints.join('، '));
    setFeaturesText(s.features.join('\n'));
    setImage(s.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (s: Service) => {
    if (window.confirm(`هل أنت متأكد من حذف خدمة "${s.title}" نهائياً؟`)) {
      await serviceRepository.delete(s.id);
      success('تم حذف الخدمة بنجاح');
      fetchServices();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerProfile) return;
    if (!title.trim() || !description.trim()) {
      toastError('يرجى كتابة عنوان ووصف الخدمة');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedMeetingPoints = meetingPointsText
        .split(/[،,\n]/)
        .map(p => p.trim())
        .filter(Boolean);

      const parsedFeatures = featuresText
        .split('\n')
        .map(f => f.trim())
        .filter(Boolean);

      if (editingService) {
        await serviceRepository.update(editingService.id, {
          title: title.trim(),
          description: description.trim(),
          category,
          price: Number(price) || 100,
          priceUnit,
          duration,
          location,
          meetingPoints: parsedMeetingPoints.length > 0 ? parsedMeetingPoints : MAKKAH_MEETING_POINTS.slice(0, 2),
          features: parsedFeatures,
          image,
        });
        success('تم تحديث بيانات الخدمة بنجاح');
      } else {
        await serviceRepository.create({
          providerId: providerProfile.id,
          providerName: providerProfile.fullName,
          providerRating: providerProfile.rating,
          providerAvatar: providerProfile.avatar,
          title: title.trim(),
          description: description.trim(),
          category,
          price: Number(price) || 100,
          priceUnit,
          duration,
          location,
          meetingPoints: parsedMeetingPoints.length > 0 ? parsedMeetingPoints : MAKKAH_MEETING_POINTS.slice(0, 2),
          features: parsedFeatures,
          image,
          isActive: true,
        });
        success('تمت إضافة الخدمة الجديدة بنجاح');
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      toastError(err.message || 'حدث خطأ أثناء حفظ الخدمة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      role="provider"
      title="خدماتي المنشورة"
      subtitle="إدارة الخدمات المساندة المتاحة للزوار بالحرم، وتعديل الأسعار والمواصفات."
      action={
        <Button
          variant="gold"
          size="sm"
          className="font-bold text-charcoal-900"
          onClick={handleOpenAdd}
          rightIcon={<PlusCircle className="w-4 h-4" />}
        >
          إضافة خدمة جديدة
        </Button>
      }
    >
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(s => {
            const cat = CATEGORIES[s.category];
            return (
              <Card key={s.id} className="border-[#E3E8E5] flex flex-col justify-between">
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant="emerald" size="sm">
                      {cat?.label || 'خدمة مساندة'}
                    </Badge>
                    <div className="flex items-center gap-1 text-gold-600 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-gold-500" />
                      <span>{s.rating.toFixed(1)}</span>
                      <span className="text-charcoal-400 font-normal">({s.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-24 h-24 rounded-xl object-cover shrink-0 border border-stone-200"
                    />
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-bold text-base text-charcoal-900 leading-snug line-clamp-2">
                        {s.title}
                      </h3>
                      <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-charcoal-600 bg-[#FAF8F4] p-3 rounded-xl border border-[#EFECE3]">
                    <div>
                      <span className="text-charcoal-400 block">السعر:</span>
                      <strong className="text-emerald-800 text-sm">{formatCurrency(s.price)}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal-400 block">المدة:</span>
                      <strong>{s.duration}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF8F4]/50 border-t border-[#F0F3F2] flex items-center justify-between">
                  <a
                    href={`/services/${s.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-charcoal-500 hover:text-emerald-800 flex items-center gap-1 font-medium"
                  >
                    <span>معاينة العرض</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(s)}
                      rightIcon={<Edit3 className="w-3.5 h-3.5" />}
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(s)}
                      className="text-rose-600 hover:bg-rose-50"
                      aria-label="حذف الخدمة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="لم تقم بنشر أي خدمات بعد"
          description="أضف خدمتك الأولى الآن وحدد مواصفاتها وأسعارها لبدء استقبال طلبات المعتمرين."
          actionText="إضافة خدمة جديدة الآن"
          onAction={handleOpenAdd}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'تعديل الخدمة' : 'إضافة خدمة مساندة جديدة'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="عنوان الخدمة"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="مثال: مرافقة وإرشاد معتمر خلال مناسك العمرة كاملة"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="تصنيف الخدمة"
              value={category}
              onChange={e => setCategory(e.target.value as ServiceCategory)}
            >
              {Object.entries(CATEGORIES).map(([catKey, catVal]) => (
                <option key={catKey} value={catKey}>
                  {catVal.label}
                </option>
              ))}
            </Select>

            <Input
              label="السعر (ريال سعودي)"
              type="number"
              min="10"
              required
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="وحدة السعر"
              value={priceUnit}
              onChange={e => setPriceUnit(e.target.value)}
              placeholder="مثال: ريال / جولة، ريال / ساعة"
            />

            <Input
              label="المدة التقديرية"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="مثال: 3 ساعات"
            />
          </div>

          <Input
            label="نطاق وتواجد الخدمة بالمسجد الحرام"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="مثال: ساحات وصحن المطاف وأدوار العربات"
          />

          <Input
            label="نقاط الالتقاء المقترحة (افصل بينها بفواصل)"
            value={meetingPointsText}
            onChange={e => setMeetingPointsText(e.target.value)}
            helperText="مثال: ساحة باب الملك فهد، مركز استلام العربات بالساحة الغربية"
          />

          <div className="text-right">
            <label className="block text-sm font-medium text-charcoal-800 mb-1.5">
              وصف الخدمة التفصيلي <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              className="w-full rounded-xl border border-[#D0DBD5] bg-white p-3 text-sm text-charcoal-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="اشرح بدقة ما تقدمه للزائر، وكيف ترعى راحته وسلامته..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="text-right">
            <label className="block text-sm font-medium text-charcoal-800 mb-1.5">
              مميزات الخدمة (سطر لكل ميزة)
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-[#D0DBD5] bg-white p-3 text-sm text-charcoal-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="استقبال عند البوابة&#10;توجيه مسارات الطواف الهادئة&#10;مساعدة كبار السن بالعربة"
              value={featuresText}
              onChange={e => setFeaturesText(e.target.value)}
            />
          </div>

          <Input
            label="رابط صورة الخدمة"
            value={image}
            onChange={e => setImage(e.target.value)}
            rightIcon={<ImageIcon className="w-4 h-4 text-emerald-700" />}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0F3F2]">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="gold"
              isLoading={isSubmitting}
              className="font-bold text-charcoal-900"
            >
              {editingService ? 'تحديث الخدمة' : 'نشر الخدمة الآن'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
