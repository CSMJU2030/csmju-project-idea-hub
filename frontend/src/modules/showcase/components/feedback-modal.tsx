'use client';

import { useState, useTransition } from 'react';
import { submitFeedbackAction } from '../actions/feedback.actions';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <h2 id="feedback-title" className="text-lg font-bold text-csmju-primary">
          ให้ข้อเสนอแนะและประเมินผลงาน
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          (สำหรับอาจารย์และศิษย์เก่า) สามารถให้คะแนนและคำแนะนำเพื่อการต่อยอดเชิงวิชาการหรืออุตสาหกรรม
        </p>

        {message && (
          <div
            role="alert"
            className={`mt-4 p-3 rounded-lg text-sm font-medium border flex items-center gap-2 ${
              message.isError
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-green-50 text-green-700 border-green-200'
            }`}
          >
            <span>{message.isError ? '⚠️' : '✅'}</span>
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="rating-select" className="block text-sm font-semibold text-slate-700 mb-1">
              คะแนนความพึงพอใจ
            </label>
            <select
              id="rating-select"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary bg-white"
            >
              <option value={5}>⭐⭐⭐⭐⭐ 5 - ยอดเยี่ยมมาก</option>
              <option value={4}>⭐⭐⭐⭐ 4 - ดีมาก</option>
              <option value={3}>⭐⭐⭐ 3 - ปานกลาง</option>
              <option value={2}>⭐⭐ 2 - พอใช้</option>
              <option value={1}>⭐ 1 - ควรปรับปรุง</option>
            </select>
          </div>

          <div>
            <label htmlFor="feedback-comment" className="block text-sm font-semibold text-slate-700 mb-1">
              ข้อเสนอแนะ / ความเห็นทางเทคนิค <span className="text-red-500">*</span>
            </label>
            <textarea
              id="feedback-comment"
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="พิมพ์คำแนะนำ เช่น ข้อเสนอแนะเรื่อง Architecture, ความน่าสนใจของเทคโนโลยี หรือข้อต่อยอด..."
              className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              ปิดหน้าต่าง
            </button>
            <button
              type="submit"
              disabled={isPending || comment.trim().length < 5}
              className="px-5 py-2 text-sm font-semibold bg-csmju-primary text-white rounded-lg hover:bg-csmju-primary-hover focus:outline-none focus:ring-2 focus:ring-csmju-primary focus:ring-offset-2 disabled:opacity-50 transition"
            >
              {isPending ? 'กำลังส่ง...' : 'ส่งข้อเสนอแนะ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}