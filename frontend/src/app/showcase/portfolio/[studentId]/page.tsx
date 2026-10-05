// src/app/showcase/portfolio/[studentId]/page.tsx

import Link from 'next/link';
import { getCurrentUser } from '../../../../modules/showcase/auth/core-auth.adapter';
import { showcaseRepository } from '../../../../modules/showcase/repositories/mock/showcase.mock-repository';
import { ProjectCard } from '../../../../modules/showcase/components/project-card';
import { cardClass } from '../../../../modules/showcase/components/ui';
import { ArrowBackIcon, DescriptionIcon } from '../../../../modules/showcase/components/icons';

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
    <div className="space-y-6 fade-slide-up">
      <Link
        href="/showcase"
        className="inline-flex items-center gap-1.5 text-label-md font-semibold text-primary-container hover:underline"
      >
        <ArrowBackIcon className="h-4 w-4" />
        <span>กลับไปหน้ารายการผลงาน</span>
      </Link>

      {/* ข้อมูลหัวโปรไฟล์ */}
      <header className={`${cardClass} p-8`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary-container/10 px-3 py-1 text-label-sm font-semibold text-primary-container tracking-wide uppercase">
              Student Portfolio
            </span>
            <h1 className="font-display text-headline-lg font-bold text-on-surface mt-2">
              {studentInfo?.name || `แฟ้มสะสมผลงาน: ${studentId}`}
            </h1>
            <p className="text-body-md text-secondary mt-1">
              รหัสนักศึกษา: <span className="font-mono">{studentId}</span>
            </p>
          </div>

          {isOwnerViewing && (
            <span className="self-start sm:self-center text-label-sm font-semibold px-3 py-1.5 bg-success/10 text-emerald-700 border border-success/20 rounded-full">
              มุมมองเจ้าของโปรไฟล์
            </span>
          )}
        </div>

        {allTechStacks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-outline-variant/30">
            <h2 className="text-caption font-bold text-secondary uppercase tracking-wider mb-2">
              Tech Stack & Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {allTechStacks.map((tech) => (
                <span
                  key={tech}
                  className="text-label-sm px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-md font-mono"
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
          <h2 id="portfolio-projects-heading" className="font-display text-headline-md font-bold text-on-surface">
            ผลงานและโครงงาน ({visibleProjects.length})
          </h2>
        </div>

        {visibleProjects.length === 0 ? (
          <div className={`${cardClass} border-dashed p-12 text-center`}>
            <div className="flex justify-center mb-3">
              <span className="p-3 rounded-full bg-surface-container text-outline">
                <DescriptionIcon className="h-8 w-8" />
              </span>
            </div>
            <p className="font-display text-headline-md font-bold text-on-surface">ยังไม่พบข้อมูลผลงานของรหัสนักศึกษานี้</p>
            <p className="text-body-md text-secondary mt-1">ผลงานอาจยังไม่ได้รับการอนุมัติ หรือยังไม่มีการส่งโครงงานในระบบ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project) => (
              <div key={project.id} className="relative flex flex-col">
                {isOwnerViewing && project.status !== 'APPROVED' && (
                  <span
                    className={`absolute top-3 right-3 z-10 text-label-sm font-semibold px-2.5 py-0.5 rounded-full ${
                      project.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-error-container text-on-error-container'
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
  );
}