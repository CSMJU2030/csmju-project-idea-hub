import Link from 'next/link';
import { getCurrentUser } from '../../../../modules/showcase/auth/core-auth.adapter';
import { showcaseRepository } from '../../../../modules/showcase/repositories/mock/showcase.mock-repository';
import { ApprovalActionBox } from '../../../../modules/showcase/components/approval-action-box';
import { cardClass } from '../../../../modules/showcase/components/ui';
import { ArrowBackIcon, CloseIcon, DescriptionIcon } from '../../../../modules/showcase/components/icons';

export default async function AdvisorPendingPage() {
  const user = await getCurrentUser();

  // ตรวจสอบสิทธิ์ระดับ Server: ต้องเป็นอาจารย์เท่านั้น
  if (!user || user.role !== 'TEACHER') {
    return (
      <div className="py-12 px-4 text-center text-on-surface fade-slide-up">
        <div className={`${cardClass} max-w-md mx-auto p-8 border-error/20 space-y-3`}>
          <div className="flex justify-center">
            <span className="p-3 rounded-full bg-error-container text-error">
              <CloseIcon className="h-8 w-8" />
            </span>
          </div>
          <h1 className="font-display text-headline-md font-bold text-error">ไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
          <p className="text-body-md text-on-surface-variant leading-[1.6]">
            หน้านี้สงวนไว้สำหรับอาจารย์ที่ปรึกษาเท่านั้น
          </p>
          <p className="text-caption text-secondary mt-1">
            (สำหรับทดสอบ: ให้สลับ role เป็น &apos;TEACHER&apos; และ id เป็น &apos;adv-001&apos; ใน core-auth.adapter.ts)
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

  // ดึงโครงงานที่สถานะ PENDING_APPROVAL และอาจารย์ท่านนี้มีชื่อเป็นที่ปรึกษา
  const pendingProjects = await showcaseRepository.findProjects({
    status: 'PENDING_APPROVAL',
  });

  const myAssignedProjects = pendingProjects.filter((project) =>
    project.advisors.some((adv) => adv.advisorId === user.id)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-slide-up">
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
              คิวโครงงานรอการตรวจสอบ
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
              อาจารย์ที่ปรึกษา: <strong>{user.name}</strong>
            </p>
          </div>
          <span className="self-start sm:self-center text-label-sm font-semibold px-3 py-1.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
            รอตรวจ {myAssignedProjects.length} รายการ
          </span>
        </div>
      </div>

      {myAssignedProjects.length === 0 ? (
        <section
          aria-label="ไม่มีงานค้าง"
          className={`${cardClass} border-dashed p-12 text-center`}
        >
          <div className="flex justify-center mb-3">
            <span className="p-3 rounded-full bg-surface-container text-outline">
              <DescriptionIcon className="h-8 w-8" />
            </span>
          </div>
          <h2 className="font-display text-headline-md font-bold text-on-surface">ไม่มีโครงงานค้างตรวจในขณะนี้</h2>
          <p className="text-body-md text-secondary mt-1">
            เมื่อนักศึกษาระบุชื่อท่านเป็นอาจารย์ที่ปรึกษาและส่งผลงานเข้ามา รายการจะปรากฏที่นี่ทันที
          </p>
        </section>
      ) : (
        <div className="space-y-6">
          {myAssignedProjects.map((project) => (
            <article
              key={project.id}
              className={`${cardClass} p-6 sm:p-8 space-y-4`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary-container/10 px-2.5 py-0.5 text-label-sm font-semibold text-primary-container">
                    {project.category}
                  </span>
                  <span className="text-label-sm text-secondary font-medium">
                    ปีการศึกษา {project.academicYear}
                  </span>
                </div>
                <span className="text-label-sm font-semibold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                  สถานะ: {project.status}
                </span>
              </div>

              <div>
                <h2 className="font-display text-headline-md font-bold text-on-surface">{project.titleTh}</h2>
                <p className="text-body-md text-secondary mt-0.5">{project.titleEn}</p>
              </div>

              <div>
                <p className="text-caption font-bold text-secondary uppercase tracking-wider mb-1">
                  บทคัดย่อ
                </p>
                <p className="text-body-md leading-[1.6] text-on-surface-variant whitespace-pre-line">
                  {project.abstract}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-label-sm px-2.5 py-0.5 bg-surface-container text-on-surface-variant rounded-md font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-outline-variant/30 text-label-sm text-secondary">
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
  );
}