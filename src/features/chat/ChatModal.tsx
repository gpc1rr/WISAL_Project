import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Booking, ChatMessage } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { messageRepository } from '@/data/repositories/messageRepository';
import { useToast } from '@/hooks/useToast';
import { MessageCircle, Send, Lock } from 'lucide-react';

export interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  viewMode: 'beneficiary' | 'provider';
}

// كل كم ثانية نشيّك على رسائل جديدة والنافذة مفتوحة
const POLL_INTERVAL_MS = 4000;
const MAX_LENGTH = 1000;

function formatTime(createdAt: string): string {
  // الخادم يرجّع "2026-11-12 19:22:39" → نعرض "19:22"
  const time = createdAt.split(' ')[1] || createdAt.split('T')[1] || '';
  return time.slice(0, 5);
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  booking,
  viewMode,
}) => {
  const { error: toastError } = useToast();

  // نحفظ دالة التنبيه في ref عشان ما تعيد تشغيل التحميل كل مرة
  const toastErrorRef = useRef(toastError);
  toastErrorRef.current = toastError;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [canSend, setCanSend] = useState(true);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef<string | undefined>(undefined);

  const bookingId = booking?.id;

  const counterpartName =
    viewMode === 'beneficiary'
      ? booking?.providerName
      : booking?.beneficiaryName;

  // إضافة رسائل جديدة بدون تكرار
  const appendMessages = useCallback((incoming: ChatMessage[]) => {
    if (incoming.length === 0) return;

    setMessages(prev => {
      const known = new Set(prev.map(m => m.id));
      const fresh = incoming.filter(m => !known.has(m.id));
      if (fresh.length === 0) return prev;

      const next = [...prev, ...fresh];
      lastIdRef.current = next[next.length - 1].id;
      return next;
    });
  }, []);

  // التحميل الأول عند فتح المحادثة
  useEffect(() => {
    if (!isOpen || !bookingId) return;

    let cancelled = false;

    setMessages([]);
    setDraft('');
    lastIdRef.current = undefined;
    setIsLoading(true);

    messageRepository
      .list(bookingId)
      .then(thread => {
        if (cancelled) return;
        setCanSend(thread.canSend);
        appendMessages(thread.messages);
      })
      .catch((err: Error) => {
        if (!cancelled) toastErrorRef.current(err.message || 'تعذر تحميل المحادثة');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, bookingId, appendMessages]);

  // التحديث التلقائي: نجيب الرسائل الجديدة كل كم ثانية
  useEffect(() => {
    if (!isOpen || !bookingId) return;

    const timer = window.setInterval(() => {
      messageRepository
        .list(bookingId, lastIdRef.current)
        .then(thread => {
          setCanSend(thread.canSend);
          appendMessages(thread.messages);
        })
        .catch(() => {
          // نتجاهل أخطاء التحديث التلقائي بصمت ونحاول بالمرة الجاية
        });
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isOpen, bookingId, appendMessages]);

  // النزول لآخر رسالة
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    const body = draft.trim();
    if (!bookingId || !body || isSending) return;

    setIsSending(true);
    try {
      const sent = await messageRepository.send(bookingId, body);
      appendMessages([sent]);
      setDraft('');
    } catch (err: any) {
      toastError(err.message || 'تعذر إرسال الرسالة');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter يرسل، و Shift+Enter ينزل سطر جديد
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!booking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-700" />
          <span>المحادثة مع {counterpartName}</span>
        </div>
      }
      description={`${booking.serviceTitle} — ${booking.bookingNumber}`}
    >
      {/* الرسائل */}
      <div className="h-80 overflow-y-auto rounded-xl bg-[#FAF8F4] border border-[#EFECE3] p-3 space-y-2.5">
        {isLoading && (
          <p className="text-center text-xs text-charcoal-400 py-10">
            جاري تحميل المحادثة...
          </p>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="text-center py-10">
            <MessageCircle className="w-8 h-8 mx-auto text-emerald-200 mb-2" />
            <p className="text-sm text-charcoal-500">لا توجد رسائل بعد</p>
            <p className="text-xs text-charcoal-400 mt-1">
              ابدأ المحادثة لتنسيق موعد ومكان الالتقاء.
            </p>
          </div>
        )}

        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.isMine ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-xs ${
                m.isMine
                  ? 'bg-emerald-700 text-white rounded-br-md'
                  : 'bg-white text-charcoal-900 border border-[#E3E8E5] rounded-bl-md'
              }`}
            >
              {!m.isMine && (
                <span className="block text-[11px] font-semibold text-gold-700 mb-0.5">
                  {m.senderName}
                </span>
              )}
              <p className="whitespace-pre-wrap break-words leading-relaxed">
                {m.body}
              </p>
              <span
                className={`block text-[10px] mt-1 ${
                  m.isMine ? 'text-emerald-100' : 'text-charcoal-400'
                }`}
              >
                {formatTime(m.createdAt)}
              </span>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* خانة الكتابة */}
      {canSend ? (
        <div className="mt-3 flex items-end gap-2">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value.slice(0, MAX_LENGTH))}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="اكتب رسالتك..."
            className="flex-1 resize-none rounded-xl border border-[#E3E8E5] bg-white px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleSend}
            isLoading={isSending}
            disabled={!draft.trim()}
            rightIcon={<Send className="w-4 h-4" />}
          >
            إرسال
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-stone-50 border border-stone-200 p-3 text-xs text-charcoal-500">
          <Lock className="w-4 h-4" />
          تم إغلاق المحادثة لأن الحجز ملغي
        </div>
      )}
    </Modal>
  );
};
