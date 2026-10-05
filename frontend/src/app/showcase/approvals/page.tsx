import { ApprovalActionBox } from '@/src/modules/showcase/components/approval-action-box';

export default function ApprovalsPage() {
  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <span className="text-label-sm font-bold text-primary-container uppercase tracking-wide">
          Advisor Workspace
        </span>
        <h1 className="font-display text-headline-lg font-bold text-on-surface mt-1">
          ตรวจสอบและอนุมัติผลงาน
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
          รายการผลงานที่รอการพิจารณารับรองความถูกต้องของเอกสารและการส่งมอบ
        </p>
      </div>
      <ApprovalActionBox projectId="demo-1" />
    </div>
  );
}