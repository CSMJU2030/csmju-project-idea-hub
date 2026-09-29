import Link from 'next/link';
import { getDashboardStatsAction } from '../../../../modules/showcase/actions/project.actions';
import { StatChartCard } from '../../../../modules/showcase/components/stat-chart-card';

export default async function AdminDashboardPage() {
  const res = await getDashboardStatsAction();

  // กรณีไม่มีสิทธิ์เข้าถึง (ไม่ได้เป็น ADMIN)
  if (!res.success || !res.data) {
    return (
      <main className="min-h-screen bg-csmju-surface-muted py-12 px-4 text-center text-csmju-text-body">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-red-200">
          <div className="text-3xl mb-2">🚫</div>
          <h1 className="text-lg font-bold text-red-700">ไม่มีสิทธิ์เข้าถึงแดชบอร์ด</h1>
          <p className="text-sm text-slate-500 mt-2">
            {res.message || 'หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (ADMIN) เท่านั้น'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            (สำหรับทดสอบ: ให้สลับ role เป็น &apos;ADMIN&apos; ใน core-auth.adapter.ts)
          </p>
          <Link
            href="/showcase"
            className="inline-block mt-4 text-sm text-csmju-primary font-semibold hover:underline"
          >
            ← กลับไปหน้ารายการผลงาน
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-csmju-surface-muted py-10 px-4 sm:px-6 lg:px-8 text-csmju-text-body">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <Link
            href="/showcase"
            className="text-sm font-semibold text-csmju-primary hover:underline focus:outline-none focus:ring-2 focus:ring-csmju-primary rounded-md px-1"
          >
            ← กลับไปหน้ารายการผลงาน
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-csmju-primary">
                แดชบอร์ดสถิติและเทรนด์เทคโนโลยี
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                สรุปภาพรวมโครงงาน การอนุมัติผลงาน และแนวโน้มทักษะเทคโนโลยีของภาควิชา
              </p>
            </div>
            <span className="self-start sm:self-center text-xs font-bold px-3 py-1.5 bg-csmju-primary-soft text-csmju-primary border border-csmju-primary/20 rounded-lg">
              สิทธิ์ผู้ดูแลระบบ (Admin)
            </span>
          </div>
        </div>

        {/* นำคอมโพเนนต์สถิติและกราฟมาแสดงผล */}
        <StatChartCard stats={res.data} />
      </div>
    </main>
  );
}