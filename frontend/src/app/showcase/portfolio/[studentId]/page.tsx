// src/app/showcase/portfolio/[studentId]/page.tsx

import Link from 'next/link';
import { getCurrentUser } from '../../../../modules/showcase/auth/core-auth.adapter';
import { showcaseRepository } from '../../../../modules/showcase/repositories/mock/showcase.mock-repository';
import { ProjectCard } from '../../../../modules/showcase/components/project-card';

interface PageProps {
  params: Promise<{ studentId: string }>;
}

export default async function StudentPortfolioPage({ params }: PageProps) {
  const { studentId } = await params;
  const currentUser = await getCurrentUser();

  // 1. ดึงผลงานทั้งหมดในระบบ
  const allProjects = await showcaseRepository.findProjects();

  // 2. กรองผลงานที่ตรงกับ studentId
  const studentProjects = allProjects.filter((project) =>
    project.members.some((member) => member.studentId === studentId)
  );

  const studentInfo = studentProjects[0]?.members.find((m) => m.studentId === studentId);
  const isOwnerViewing = currentUser?.id === studentId;

  const visibleProjects = isOwnerViewing
    ? studentProjects
    : studentProjects.filter((p) => p.status === 'APPROVED');

  const allTechStacks = Array.from(
    new Set(visibleProjects.flatMap((p) => p.techStack))
  );

  return (
    <main className="min-h-screen bg-csmju-surface-muted py-10 px-4 sm:px-6 lg:px-8 text-csmju-text-body">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/showcase"
          className="text-sm font-semibold text-csmju-primary hover:underline focus:outline-none focus:ring-2 focus:ring-csmju-primary rounded-md px-1"
        >
          ← กลับไปหน้ารายการผลงาน
        </Link>

        {/* ข้อมูลหัวโปรไฟล์ */}
        <header className="bg-white p-8 rounded-2xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-1 bg-csmju-primary-soft text-csmju-primary rounded-md">
                Student Portfolio
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-csmju-primary mt-2">
                {studentInfo?.name || `แฟ้มสะสมผลงาน: ${studentId}`}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                รหัสนักศึกษา: <span className="font-mono">{studentId}</span>
              </p>
            </div>

            {isOwnerViewing && (
              <span className="self-start sm:self-center text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                มุมมองเจ้าของโปรไฟล์
              </span>
            )}
          </div>

          {allTechStacks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tech Stack & Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {allTechStacks.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* รายการผลงานหรือ Empty State */}
        <section aria-labelledby="portfolio-projects-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="portfolio-projects-heading" className="text-lg font-bold text-csmju-primary">
              ผลงานและโครงงาน ({visibleProjects.length})
            </h2>
          </div>

          {visibleProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-base font-bold text-slate-700">ยังไม่พบข้อมูลผลงานของรหัสนักศึกษานี้</p>
              <p className="text-sm text-slate-400 mt-1">ผลงานอาจยังไม่ได้รับการอนุมัติ หรือยังไม่มีการส่งโครงงานในระบบ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map((project) => (
                <div key={project.id} className="relative flex flex-col">
                  {isOwnerViewing && project.status !== 'APPROVED' && (
                    <span
                      className={`absolute top-3 right-3 z-10 text-xs font-bold px-2 py-0.5 rounded-md ${
                        project.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {project.status}
                    </span>
                  )}
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}