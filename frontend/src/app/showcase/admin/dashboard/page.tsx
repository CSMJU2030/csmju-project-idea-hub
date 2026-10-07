import Link from 'next/link';
import { getDashboardStatsAction } from '../../../../modules/showcase/actions/project.actions';
import { StatChartCard } from '../../../../modules/showcase/components/stat-chart-card';
import { cardClass } from '../../../../modules/showcase/components/ui';
import { ArrowBackIcon, CloseIcon } from '../../../../modules/showcase/components/icons';

export default async function AdminDashboardPage() {
  const res = await getDashboardStatsAction();

  // กรณีไม่มีสิทธิ์เข้าถึง (ไม่ได้เป็น ADMIN)
  if (!res.success || !res.data) {
    return (
      <div className="py-12 px-4 text-center text-on-surface fade-slide-up">
        <div className={`${cardClass} max-w-md mx-auto p-8 border-error/20 space-y-3`}>
          <div className="flex justify-center">
            <span className="p-3 rounded-full bg-error-container text-error">
              <CloseIcon className="h-8 w-8" />
            </span>
          </div>
          <h1 className="font-display text-headline-md font-bold text-error">ไม่มีสิทธิ์เข้าถึงแดชบอร์ด</h1>
          <p className="text-body-md text-on-surface-variant leading-[1.6]">
            {res.message || 'หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (ADMIN) เท่านั้น'}
          </p>
          <Link
            href="/showcase"
            className="inline-block mt-4 text-label-md text-primary-container font-semibold hover:underline"
          >
            ← กลับไปหน้ารายการผลงาน
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 text-label-md font-semibold text-primary-container hover:underline"
        >
          <ArrowBackIcon className="h-4 w-4" />
          <span>กลับไปหน้ารายการผลงาน</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="font-display text-headline-lg font-bold text-on-surface">
              แดชบอร์ดสถิติและเทรนด์เทคโนโลยี
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
              สรุปภาพรวมโครงงาน การอนุมัติผลงาน และแนวโน้มทักษะเทคโนโลยีของภาควิชา
            </p>
          </div>
          <span className="self-start sm:self-center text-label-sm font-semibold px-3 py-1.5 bg-primary-container/10 text-primary-container border border-primary-container/20 rounded-full">
            สิทธิ์ผู้ดูแลระบบ (Admin)
          </span>
        </div>
      </div>

      {/* นำคอมโพเนนต์สถิติและกราฟมาแสดงผล */}
      <StatChartCard stats={res.data} />
    </div>
  );
}