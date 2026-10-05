'use client';

import { useState, useTransition } from 'react';
import { submitFeedbackAction } from '../actions/feedback.actions';
import { cardClass, inputClass, primaryButtonClass, secondaryButtonClass } from './ui';
import { CheckIcon, CloseIcon } from './icons';

interface FeedbackModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function FeedbackModal({ projectId, isOpen, onClose, onSuccess }: FeedbackModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const res = await submitFeedbackAction({ projectId, rating, comment });
      if (!res.success) {
        setMessage({ text: res.message, isError: true });
      } else {
        setMessage({ text: res.message, isError: false });
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1000);
      }
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
    >
      <div className={`${cardClass} max-w-md w-full p-6 shadow-xl`}>
        <div className="flex items-center justify-between">
          <h2 id="feedback-title" className="font-display text-headline-md font-bold text-on-surface">
            ให้ข้อเสนอแนะและประเมินผลงาน
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="rounded-lg p-1.5 text-outline hover:bg-surface-variant/50 hover:text-on-surface"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="text-body-md text-on-surface-variant mt-2 leading-[1.6]">
          สำหรับอาจารย์และศิษย์เก่า สามารถให้คะแนนและคำแนะนำเพื่อการต่อยอดเชิงวิชาการหรือนวัตกรรม
        </p>

        {message && (
          <div
            role="alert"
            className={`mt-4 p-4 rounded-lg text-body-md font-medium border flex items-center gap-2 ${
              message.isError
                ? 'bg-error-container text-on-error-container border-error/20'
                : 'bg-success/10 text-emerald-700 border-success/20'
            }`}
          >
            {message.isError ? (
              <CloseIcon className="h-5 w-5 text-error shrink-0" />
            ) : (
              <CheckIcon className="h-5 w-5 text-success shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="rating-select" className="block text-label-md font-semibold text-on-surface mb-1">
              คะแนนความพึงพอใจ
            </label>
            <select
              id="rating-select"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className={inputClass}
            >
              <option value={5}>5 / 5 คะแนน - ยอดเยี่ยมมาก</option>
              <option value={4}>4 / 5 คะแนน - ดีมาก</option>
              <option value={3}>3 / 5 คะแนน - ปานกลาง</option>
              <option value={2}>2 / 5 คะแนน - พอใช้</option>
              <option value={1}>1 / 5 คะแนน - ควรปรับปรุง</option>
            </select>
          </div>

          <div>
            <label htmlFor="feedback-comment" className="block text-label-md font-semibold text-on-surface mb-1">
              ข้อเสนอแนะ / ความเห็นทางเทคนิค <span className="text-error">*</span>
            </label>
            <textarea
              id="feedback-comment"
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="พิมพ์คำแนะนำ เช่น ข้อเสนอแนะเรื่อง Architecture, ความน่าสนใจของเทคโนโลยี หรือข้อต่อยอด..."
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className={secondaryButtonClass}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isPending || comment.trim().length < 5}
              className={primaryButtonClass}
            >
              {isPending ? 'กำลังส่ง...' : 'ส่งข้อเสนอแนะ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}