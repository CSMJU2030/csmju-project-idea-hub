'use client';

import { DashboardStats } from '../types/domain';
import { cardClass, thClass, tdClass } from './ui';

interface StatChartCardProps {
  stats: DashboardStats;
}

export function StatChartCard({ stats }: StatChartCardProps) {
  return (
    <div className="space-y-6 text-on-surface">
      {/* การ์ดตัวเลขสรุป 4 ช่อง */}
      <section aria-label="สรุปจำนวนโครงงาน" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${cardClass} p-6 hover:shadow-md transition-shadow`}>
          <p className="text-label-md font-semibold text-secondary">ผลงานทั้งหมด</p>
          <p className="font-display text-display-lg font-bold text-primary-container mt-2 tabular-nums">{stats.totalProjects}</p>
          <p className="text-caption text-secondary mt-1">โครงงานทุกสถานะในระบบ</p>
        </div>

        <div className={`${cardClass} p-6 hover:shadow-md transition-shadow`}>
          <p className="text-label-md font-semibold text-secondary">อนุมัติแล้ว (Approved)</p>
          <p className="font-display text-display-lg font-bold text-emerald-700 mt-2 tabular-nums">{stats.approvedCount}</p>
          <p className="text-caption text-secondary mt-1">เผยแพร่สู่สาธารณะ</p>
        </div>

        <div className={`${cardClass} p-6 hover:shadow-md transition-shadow`}>
          <p className="text-label-md font-semibold text-secondary">รอการตรวจสอบ (Pending)</p>
          <p className="font-display text-display-lg font-bold text-amber-800 mt-2 tabular-nums">{stats.pendingCount}</p>
          <p className="text-caption text-secondary mt-1">รออาจารย์ที่ปรึกษารับรอง</p>
        </div>

        <div className={`${cardClass} p-6 hover:shadow-md transition-shadow`}>
          <p className="text-label-md font-semibold text-secondary">ส่งกลับแก้ไข (Rejected)</p>
          <p className="font-display text-display-lg font-bold text-on-error-container mt-2 tabular-nums">{stats.rejectedCount}</p>
          <p className="text-caption text-secondary mt-1">รอนักศึกษาปรับปรุงข้อมูล</p>
        </div>
      </section>

      {/* แดชบอร์ดแนวโน้มเทคโนโลยี และหมวดหมู่ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* กราฟแท่งเทรนด์ Tech Stack */}
        <section aria-labelledby="tech-trend-heading" className={`${cardClass} p-6`}>
          <h3 id="tech-trend-heading" className="font-display text-headline-md font-bold text-on-surface mb-4">
            เทคโนโลยียอดนิยม 5 อันดับแรก (Tech Trends)
          </h3>

          {stats.topTechStacks.length === 0 ? (
            <p className="text-body-md text-secondary py-6 text-center">ยังไม่มีข้อมูลเทคโนโลยีในระบบ</p>
          ) : (
            <div className="space-y-4">
              {stats.topTechStacks.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-body-md">
                    <span className="font-semibold text-on-surface">{item.name}</span>
                    <span className="text-secondary font-medium tabular-nums">
                      {item.count} โครงงาน ({item.percentage}%)
                    </span>
                  </div>
                  {/* Progress Bar ตามมาตรฐาน Accessibility */}
                  <div 
                    role="progressbar" 
                    aria-valuenow={item.percentage} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                    aria-label={`${item.name} มีการใช้งาน ${item.percentage} เปอร์เซ็นต์`}
                    className="w-full bg-surface-container h-3 rounded-full overflow-hidden"
                  >
                    <div
                      className="bg-btn-gradient h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ตารางสัดส่วนหมวดหมู่โครงงาน */}
        <section aria-labelledby="category-dist-heading" className={`${cardClass} p-6`}>
          <h3 id="category-dist-heading" className="font-display text-headline-md font-bold text-on-surface mb-4">
            การกระจายตัวตามหมวดหมู่
          </h3>

          {stats.categoryDistribution.length === 0 ? (
            <p className="text-body-md text-secondary py-6 text-center">ยังไม่มีข้อมูลหมวดหมู่</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/40 bg-surface">
                    <th scope="col" className={thClass}>หมวดหมู่</th>
                    <th scope="col" className={`${thClass} text-right`}>จำนวนผลงาน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {stats.categoryDistribution.map((cat) => (
                    <tr key={cat.category} className="hover:bg-surface/50 transition-colors">
                      <td className={tdClass}>{cat.category}</td>
                      <td className={`${tdClass} text-right tabular-nums text-secondary`}>{cat.count} โครงงาน</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}