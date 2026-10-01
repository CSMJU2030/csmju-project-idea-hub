import Link from 'next/link';
import { getCurrentUser } from '../../../modules/showcase/auth/core-auth.adapter';
import { showcaseRepository } from '../../../modules/showcase/repositories/mock/showcase.mock-repository';
import { ApprovalActionBox } from '../../../modules/showcase/components/approval-action-box';

export default async function AdvisorPortalPage() {
  const user = await getCurrentUser();

  // ตรวจสอบสิทธิ์ระดับ Server: ต้องเป็นอาจารย์เท่านั้น
  if (!user || user.role !== 'TEACHER') {
    return (
      <main className="min-h-screen bg-csmju-surface-muted py-12 px-4 text-center text-csmju-text-body">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-red-200">
          <div className="text-3xl mb-2">🚫</div>
          <h1 className="text-lg font-bold text-red-700">ไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
          <p className="text-sm text-slate-500 mt-2">
            หน้านี้สงวนไว้สำหรับอาจารย์ที่ปรึกษาเท่านั้น (กรุณาสลับ Role ใน core-auth.adapter.ts)
          </p>
          <Link href="/showcase" className="inline-block mt-4 text-sm text-csmju-primary font-semibold hover:underline">
            ← กลับไปหน้ารายการผลงาน
          </Link>
        </div>
      </main>
    );
  }

  // ดึงผลงานทั้งหมดที่อาจารย์ท่านนี้เป็นที่ปรึกษา
  const allProjects = await showcaseRepository.findProjects();
  const myProjects = allProjects.filter((p) =>
    p.advisors.some((adv) => adv.advisorId === user.id)
  );

  const pendingList = myProjects.filter((p) => p.status === 'PENDING_APPROVAL');
  const approvedList = myProjects.filter((p) => p.status === 'APPROVED');

  return (
    <main className="min-h-screen bg-csmju-surface-muted py-10 px-4 sm:px-6 lg:px-8 text-csmju-text-body">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <Link href="/showcase" className="text-sm font-semibold text-csmju-primary hover:underline">
            ← กลับไปหน้ารายการผลงาน
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-csmju-primary">
                ระบบจัดการโครงงานสำหรับอาจารย์ที่ปรึกษา
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                อาจารย์ผู้ใช้งาน: <strong>{user.name}</strong> ({user.email})
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-bold px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
                รอตรวจ {pendingList.length} รายการ
              </span>
              <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                อนุมัติแล้ว {approvedList.length} รายการ
              </span>
            </div>
          </div>
        </div>

        {/* ส่วนที่ 1: คิวงานรอตรวจ (Pending Approvals) */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>⏳</span> รายการรอการตรวจสอบและอนุมัติ ({pendingList.length})
          </h2>

          {pendingList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-sm">
              ไม่มีโครงงานค้างตรวจในขณะนี้
            </div>
          ) : (
            <div className="space-y-4">
              {pendingList.map((project) => (
                <article key={project.id} className="bg-white p-6 rounded-2xl border border-amber-200 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-csmju-primary-soft text-csmju-primary rounded-md">
                        {project.category}
                      </span>
                      <h3 className="text-lg font-bold text-csmju-primary mt-2">{project.titleTh}</h3>
                      <p className="text-xs text-slate-500">{project.titleEn}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded-md">
                      PENDING
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2">{project.abstract}</p>

                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                    ผู้จัดทำ: {project.members.map((m) => m.name).join(', ')} | ปีการศึกษา {project.academicYear}
                  </div>

                  <ApprovalActionBox projectId={project.id} />
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ส่วนที่ 2: โครงงานที่ได้รับการอนุมัติแล้ว */}
        <section className="space-y-4 pt-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>✅</span> โครงงานในความดูแลที่เผยแพร่แล้ว ({approvedList.length})
          </h2>

          {approvedList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-sm">
              ยังไม่มีโครงงานที่ได้รับการอนุมัติ
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedList.map((project) => (
                <div key={project.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">ปีการศึกษา {project.academicYear}</span>
                    <h3 className="text-base font-bold text-csmju-primary mt-1 line-clamp-1">{project.titleTh}</h3>
                    <p className="text-xs text-slate-500 mb-2 line-clamp-1">{project.titleEn}</p>
                    <p className="text-xs text-slate-600 line-clamp-2">{project.abstract}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-500">{project.members[0]?.name}</span>
                    <Link href={`/showcase/${project.id}`} className="font-semibold text-csmju-primary hover:underline">
                      เปิดดูผลงาน →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}