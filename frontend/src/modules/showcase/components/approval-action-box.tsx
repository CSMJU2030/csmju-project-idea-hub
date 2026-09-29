'use client';

import { useState, useTransition } from 'react';
import { reviewProjectAction } from '../actions/approval.actions';

interface ApprovalActionBoxProps {
  projectId: string;
  onSuccess?: () => void;
}

export function ApprovalActionBox({ projectId, onSuccess }: ApprovalActionBoxProps) {
  const [isPending, startTransition] = useTransition();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApprove = () => {
    setFeedbackMessage(null);
    startTransition(async () => {
      const res = await reviewProjectAction({ projectId, action: 'APPROVE' });
      if (!res.success) {
        setFeedbackMessage({ text: res.message, isError: true });
      } else {
        setFeedbackMessage({ text: res.message, isError: false });
        if (onSuccess) onSuccess();
      }
    });
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    startTransition(async () => {
      const res = await reviewProjectAction({
        projectId,
        action: 'REJECT',
        rejectionReason,
      });

      if (!res.success) {
        setFeedbackMessage({ text: res.message, isError: true });
      } else {
        setFeedbackMessage({ text: res.message, isError: false });
        setShowRejectForm(false);
        setRejectionReason('');
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <section 
      aria-labelledby="approval-heading" 
      className="bg-csmju-surface-muted border border-csmju-primary/20 rounded-xl p-6 text-csmju-text-body"
    >
      <div className="flex flex-col gap-2">
        <h3 id="approval-heading" className="text-lg font-bold text-csmju-primary">
          การตรวจสอบและรับรองผลงาน (สำหรับอาจารย์ที่ปรึกษา)
        </h3>
        <p className="text-sm leading-[1.6]">
          โปรดตรวจสอบรายละเอียดเอกสารและลิงก์ผลงาน เมื่ออนุมัติแล้ว โครงงานจะถูกนำไปแสดงในคลังผลงานสาธารณะทันที
        </p>
      </div>

      {feedbackMessage && (
        <div
          role="alert"
          className={`mt-4 p-3 rounded-lg text-sm font-medium border flex items-center gap-2 ${
            feedbackMessage.isError
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-green-50 text-green-700 border-green-200'
          }`}
        >
          <span>{feedbackMessage.isError ? '⚠️' : '✅'}</span>
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {!showRejectForm ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={handleApprove}
            className="px-5 py-2.5 bg-csmju-primary text-white text-sm font-semibold rounded-lg hover:bg-csmju-primary-hover focus:outline-none focus:ring-2 focus:ring-csmju-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending ? 'กำลังบันทึก...' : 'อนุมัติผลงาน (Approve)'}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => setShowRejectForm(true)}
            className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ส่งกลับแก้ไข / ปฏิเสธ (Reject)
          </button>
        </div>
      ) : (
        <form onSubmit={handleReject} className="mt-5 space-y-4">
          <div>
            <label htmlFor="rejectionReason" className="block text-sm font-semibold mb-1 text-slate-700">
              ระบุข้อเสนอแนะในการปรับปรุงแก้ไข <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejectionReason"
              name="rejectionReason"
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="ระบุจุดที่ต้องปรับปรุง เช่น แก้ไขบทคัดย่อ หรือตรวจเช็กลิงก์ GitHub ที่เข้าถึงไม่ได้..."
              className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary leading-[1.6]"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending || rejectionReason.trim().length < 5}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isPending ? 'กำลังส่งข้อมูล...' : 'ยืนยันการส่งกลับแก้ไข'}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowRejectForm(false)}
              className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      )}
    </section>
  );
}