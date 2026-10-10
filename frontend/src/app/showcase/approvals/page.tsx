import Link from 'next/link';
import { getCurrentUser } from '@/src/lib/auth';
import { showcaseRepository } from '@/src/modules/showcase/repositories/mock/showcase.mock-repository';
import { ApprovalActionBox } from '@/src/modules/showcase/components/approval-action-box';
import { cardClass } from '@/src/modules/showcase/components/ui';
import {
  ArrowBackIcon,
  CheckIcon,
  CloseIcon,
  OpenInNewIcon,
} from '@/src/modules/showcase/components/icons';

export default async function ApprovalsPage() {
  const user = await getCurrentUser();

  // ป้องกันการเข้าถึงระดับ Server: เฉพาะอาจารย์ที่ปรึกษา (TEACHER) และผู้ดูแลระบบ (ADMIN)
  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
    return (
      <div className="py-12 px-4 text-center text-on-surface fade-slide-up">
        <div className={`${cardClass} max-w-md mx-auto p-8 border-error/20 space-y-3`}>
          <div className="flex justify-center">
            <span className="p-3 rounded-full bg-error-container text-error">
              <CloseIcon className="h-8 w-8" />
            </span>
          </div>
          <h1 className="font-display text-headline-md font-bold text-error">
            ไม่มีสิทธิ์เข้าถึงหน้านี้
          </h1>
          <p className="text-body-md text-on-surface-variant leading-[1.6]">
            หน้านี้สงวนสิทธิ์เฉพาะอาจารย์ที่ปรึกษาและผู้ดูแลระบบเท่านั้น นักศึกษาไม่สามารถเข้าถึงหน้านี้ได้
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

  // ดึงรายการโครงงานที่รอการตรวจสอบและอนุมัติทั้งหมดในระบบ
  const pendingProjects = await showcaseRepository.findProjects({
    status: 'PENDING_APPROVAL',
  });

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 text-label-md font-semibold text-primary-container hover:underline mb-2"
        >
          <ArrowBackIcon className="h-4 w-4" />
          <span>กลับไปหน้ารายการผลงาน</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-label-sm font-bold text-primary-container uppercase tracking-wide">
              Advisor Workspace
            </span>
            <h1 className="font-display text-headline-lg font-bold text-on-surface mt-1">
              ตรวจสอบและอนุมัติผลงาน
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
              รายการผลงานโครงงานที่รอการพิจารณารับรองความถูกต้องและอนุมัติเผยแพร่สู่สาธารณะ
            </p>
          </div>
          <span className="self-start sm:self-center text-label-sm font-semibold px-3 py-1.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg">
            รอการตรวจสอบ {pendingProjects.length} รายการ
          </span>
        </div>
      </div>

      {pendingProjects.length === 0 ? (
        <div className={`${cardClass} border-dashed p-12 text-center text-on-surface-variant`}>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-variant">
            <CheckIcon className="h-6 w-6 text-primary-container" />
          </div>
          <h3 className="font-display text-headline-md font-bold text-on-surface">
            ไม่มีผลงานค้างตรวจในขณะนี้
          </h3>
          <p className="mt-1 text-body-md text-secondary">
            เมื่อนักศึกษาส่งผลงานโครงงานใหม่เข้ามา รายการจะปรากฏที่นี่เพื่อให้อาจารย์ตรวจสอบและอนุมัติ
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingProjects.map((project) => {
            const owner = project.members.find((m) => m.isOwner) || project.members[0];
            const advisor = project.advisors[0];

            return (
              <article
                key={project.id}
                className={`${cardClass} p-6 border-amber-300/80 shadow-sm space-y-4`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-surface-variant/60 pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-primary-container/10 px-2.5 py-0.5 text-label-sm font-semibold text-primary-container">
                        {project.category}
                      </span>
                      <span className="text-label-sm text-secondary">
                        ปีการศึกษา {project.academicYear}
                      </span>
                      <span className="text-label-sm font-semibold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                        รอการอนุมัติ (PENDING)
                      </span>
                    </div>
                    <h2 className="font-display text-headline-md font-bold text-on-surface mt-2">
                      {project.titleTh}
                    </h2>
                    {project.titleEn && (
                      <p className="text-body-md text-secondary">{project.titleEn}</p>
                    )}
                  </div>
                  <Link
                    href={`/showcase/${project.id}`}
                    className="inline-flex items-center gap-1 text-label-md font-semibold text-primary-container hover:underline"
                  >
                    <span>ดูรายละเอียดเต็ม</span>
                    <OpenInNewIcon className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-body-md">
                  <div>
                    <p className="text-caption text-secondary">ผู้จัดทำ (นักศึกษา):</p>
                    <p className="font-semibold text-on-surface">
                      {owner ? `${owner.name} (${owner.studentId})` : 'ไม่ระบุ'}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-secondary">อาจารย์ที่ปรึกษา:</p>
                    <p className="font-semibold text-on-surface">
                      {advisor ? `${advisor.name}` : 'ไม่ระบุ'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-caption text-secondary mb-1">บทคัดย่อ (Abstract):</p>
                  <p className="text-body-md text-on-surface-variant leading-[1.6]">
                    {project.abstract}
                  </p>
                </div>

                {/* รายการ Tech Stack */}
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-surface-variant/70 px-2 py-0.5 text-caption font-mono text-on-surface-variant"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* กล่องดำเนินการอนุมัติหรือส่งกลับแก้ไข */}
                <div className="pt-2 border-t border-surface-variant/40">
                  <ApprovalActionBox projectId={project.id} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}