import Link from 'next/link';
import { getCurrentUser } from '../../../../modules/showcase/auth/core-auth.adapter';
import { showcaseRepository } from '../../../../modules/showcase/repositories/mock/showcase.mock-repository';
import { ApprovalActionBox } from '../../../../modules/showcase/components/approval-action-box';

export default async function AdvisorPendingPage() {
  const user = await getCurrentUser();

  // ตรวจสอบสิทธิ์ระดับ Server: ต้องเป็นอาจารย์เท่านั้น
  if (!user || user.role !== 'TEACHER') {
    return (
      <main className="min-h-screen bg-csmju-surface-muted py-12 px-4 text-center text-csmju-text-body">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-red-200">
          <div className="text-3xl mb-2">🚫</div>
          <h1 className="text-lg font-bold text-red-700">ไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
          <p className="text-sm text-slate-500 mt-2">
            หน้านี้สงวนไว้สำหรับอาจารย์ที่ปรึกษาเท่านั้น
          </p>
          <p className="text-xs text-slate-400 mt-1">
            (สำหรับทดสอบ: ให้สลับ role เป็น &apos;TEACHER&apos; และ id เป็น &apos;adv-001&apos; ใน core-auth.adapter.ts)
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

  // ดึงโครงงานที่สถานะ PENDING_APPROVAL และอาจารย์ท่านนี้มีชื่อเป็นที่ปรึกษา
  const pendingProjects = await showcaseRepository.findProjects({
    status: 'PENDING_APPROVAL',
  });

  const myAssignedProjects = pendingProjects.filter((project) =>
    project.advisors.some((adv) => adv.advisorId === user.id)
  );

  return (
    <main className="min-h-screen bg-csmju-surface-muted py-10 px-4 sm:px-6 lg:px-8 text-csmju-text-body">
      <div className="max-w-4xl mx-auto space-y-6">
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
                คิวโครงงานรอการตรวจสอบ
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                อาจารย์ที่ปรึกษา: <strong>{user.name}</strong>
              </p>
            </div>
            <span className="self-start sm:self-center text-xs font-bold px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
              รอตรวจ {myAssignedProjects.length} รายการ
            </span>
          </div>
        </div>

        {myAssignedProjects.length === 0 ? (
          <section
            aria-label="ไม่มีงานค้าง"
            className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center"
          >
            <div className="text-4xl mb-3">📋</div>
            <h2 className="text-lg font-bold text-slate-700">ไม่มีโครงงานค้างตรวจในขณะนี้</h2>
            <p className="text-sm text-slate-500 mt-1">
              เมื่อนักศึกษาระบุชื่อท่านเป็นอาจารย์ที่ปรึกษาและส่งผลงานเข้ามา รายการจะปรากฏที่นี่ทันที
            </p>
          </section>
        ) : (
          <div className="space-y-6">
            {myAssignedProjects.map((project) => (
              <article
                key={project.id}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-csmju-primary-soft text-csmju-primary rounded-md">
                      {project.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ปีการศึกษา {project.academicYear}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md">
                    สถานะ: {project.status}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-csmju-primary">{project.titleTh}</h2>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">{project.titleEn}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    บทคัดย่อ
                  </p>
                  <p className="text-sm leading-[1.6] text-slate-700 whitespace-pre-line">
                    {project.abstract}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <strong>ผู้จัดทำ:</strong>{' '}
                  {project.members.map((m) => `${m.name} ${m.isOwner ? '(หัวหน้ากลุ่ม)' : ''}`).join(', ')}
                </div>

                {/* กล่องการตัดสินใจของอาจารย์ที่ปรึกษา */}
                <div className="pt-2">
                  <ApprovalActionBox projectId={project.id} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}