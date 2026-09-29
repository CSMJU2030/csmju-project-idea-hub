'use client';

import { DashboardStats } from '../types/domain';

interface StatChartCardProps {
  stats: DashboardStats;
}

export function StatChartCard({ stats }: StatChartCardProps) {
  return (
    <div className="space-y-6 text-csmju-text-body">
      {/* การ์ดตัวเลขสรุป 4 ช่อง */}
      <section aria-label="สรุปจำนวนโครงงาน" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-sm font-medium text-slate-500">ผลงานทั้งหมด</p>
          <p className="text-3xl font-bold text-csmju-primary mt-2">{stats.totalProjects}</p>
          <p className="text-xs text-slate-400 mt-1">โครงงานทุกสถานะในระบบ</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-sm font-medium text-slate-500">อนุมัติแล้ว (Approved)</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.approvedCount}</p>
          <p className="text-xs text-slate-400 mt-1">เผยแพร่สู่สาธารณะ</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-sm font-medium text-slate-500">รอการตรวจสอบ (Pending)</p>
          <p className="text-3xl font-bold text-amber-500 mt-2">{stats.pendingCount}</p>
          <p className="text-xs text-slate-400 mt-1">รออาจารย์ที่ปรึกษารับรอง</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-sm font-medium text-slate-500">ส่งกลับแก้ไข (Rejected)</p>
          <p className="text-3xl font-bold text-rose-600 mt-2">{stats.rejectedCount}</p>
          <p className="text-xs text-slate-400 mt-1">รอนักศึกษาปรับปรุงข้อมูล</p>
        </div>
      </section>

      {/* แดชบอร์ดแนวโน้มเทคโนโลยี และหมวดหมู่ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* กราฟแท่งเทรนด์ Tech Stack */}
        <section aria-labelledby="tech-trend-heading" className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 id="tech-trend-heading" className="text-base font-bold text-csmju-primary mb-4">
            เทคโนโลยียอดนิยม 5 อันดับแรก (Tech Trends)
          </h3>

          {stats.topTechStacks.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">ยังไม่มีข้อมูลเทคโนโลยีในระบบ</p>
          ) : (
            <div className="space-y-4">
              {stats.topTechStacks.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">{item.name}</span>
                    <span className="text-slate-500 font-medium">
                      {item.count} โครงงาน ({item.percentage}%)
                    </span>
                  </div>
                  {/* Progress Bar รองรับการเข้าถึงและไม่พึ่งพา External CSS Chart */}
                  <div 
                    role="progressbar" 
                    aria-valuenow={item.percentage} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                    aria-label={`${item.name} มีการใช้งาน ${item.percentage} เปอร์เซ็นต์`}
                    className="w-full bg-csmju-primary-soft h-3 rounded-full overflow-hidden"
                  >
                    <div
                      className="bg-csmju-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ตารางสัดส่วนหมวดหมู่โครงงาน */}
        <section aria-labelledby="category-dist-heading" className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 id="category-dist-heading" className="text-base font-bold text-csmju-primary mb-4">
            การกระจายตัวตามหมวดหมู่
          </h3>

          {stats.categoryDistribution.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">ยังไม่มีข้อมูลหมวดหมู่</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-medium">
                    <th scope="col" className="pb-3">หมวดหมู่</th>
                    <th scope="col" className="pb-3 text-right">จำนวนผลงาน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.categoryDistribution.map((cat) => (
                    <tr key={cat.category}>
                      <td className="py-3 font-medium text-slate-700">{cat.category}</td>
                      <td className="py-3 text-right text-slate-600">{cat.count} โครงงาน</td>
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