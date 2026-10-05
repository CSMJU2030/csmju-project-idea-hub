'use client';

import { useState, useTransition } from 'react';
import { reviewProjectAction } from '../actions/approval.actions';
import { cardClass, dangerButtonClass, inputClass, primaryButtonClass, secondaryButtonClass } from './ui';
import { CheckIcon, CloseIcon } from './icons';

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
      className={`${cardClass} p-6 border-primary-container/20`}
    >
      <div className="flex flex-col gap-2">
        <h3 id="approval-heading" className="font-display text-headline-md font-bold text-on-surface">
          การตรวจสอบและรับรองผลงาน (สำหรับอาจารย์ที่ปรึกษา)
        </h3>
        <p className="text-body-md text-on-surface-variant leading-[1.6]">
          โปรดตรวจสอบรายละเอียดเอกสารและลิงก์ผลงาน เมื่ออนุมัติแล้ว โครงงานจะถูกนำไปแสดงในคลังผลงานสาธารณะทันที
        </p>
      </div>

      {feedbackMessage && (
        <div
          role="alert"
          className={`mt-4 p-4 rounded-lg text-body-md font-medium border flex items-center gap-2 ${
            feedbackMessage.isError
              ? 'bg-error-container text-on-error-container border-error/20'
              : 'bg-success/10 text-emerald-700 border-success/20'
          }`}
        >
          {feedbackMessage.isError ? (
            <CloseIcon className="h-5 w-5 text-error shrink-0" />
          ) : (
            <CheckIcon className="h-5 w-5 text-success shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {!showRejectForm ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={handleApprove}
            className={primaryButtonClass}
          >
            <CheckIcon className="h-4 w-4" />
            <span>{isPending ? 'กำลังบันทึก...' : 'อนุมัติผลงาน (Approve)'}</span>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => setShowRejectForm(true)}
            className={secondaryButtonClass}
          >
            <CloseIcon className="h-4 w-4" />
            <span>ส่งกลับแก้ไข / ปฏิเสธ (Reject)</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleReject} className="mt-5 space-y-4">
          <div>
            <label htmlFor="rejectionReason" className="block text-label-md font-semibold mb-1 text-on-surface">
              ระบุข้อเสนอแนะในการปรับปรุงแก้ไข <span className="text-error">*</span>
            </label>
            <textarea
              id="rejectionReason"
              name="rejectionReason"
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="ระบุจุดที่ต้องปรับปรุง เช่น แก้ไขบทคัดย่อ หรือตรวจเช็กลิงก์ GitHub ที่เข้าถึงไม่ได้..."
              className={inputClass}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending || rejectionReason.trim().length < 5}
              className={dangerButtonClass}
            >
              {isPending ? 'กำลังส่งข้อมูล...' : 'ยืนยันการส่งกลับแก้ไข'}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowRejectForm(false)}
              className={secondaryButtonClass}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      )}
    </section>
  );
}