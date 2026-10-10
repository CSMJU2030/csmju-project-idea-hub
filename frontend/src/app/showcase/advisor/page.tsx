import Link from 'next/link';
import { getCurrentUser } from '../../../lib/auth';
import { showcaseRepository } from '../../../modules/showcase/repositories/mock/showcase.mock-repository';
import { ApprovalActionBox } from '../../../modules/showcase/components/approval-action-box';
import { cardClass } from '../../../modules/showcase/components/ui';
import { ArrowBackIcon, CheckIcon, CloseIcon } from '../../../modules/showcase/components/icons';

export default async function AdvisorPortalPage() {
  const user = await getCurrentUser();

  // ตรวจสอบสิทธิ์ระดับ Server: ต้องเป็นอาจารย์หรือผู้ดูแลระบบเท่านั้น
  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
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
            หน้านี้สงวนไว้สำหรับอาจารย์ที่ปรึกษาและผู้ดูแลระบบเท่านั้น
          </p>
          <Link href="/showcase" className="inline-block mt-4 text-label-md text-primary-container font-semibold hover:underline">
            ← กลับไปหน้ารายการผลงาน
          </Link>
        </div>
      </div>
    );
  }

  // ดึงผลงานทั้งหมดที่อาจารย์ท่านนี้เป็นที่ปรึกษา
  const allProjects = await showcaseRepository.findProjects();
  const myProjects = allProjects.filter((p) =>
    p.advisors.some((adv) => adv.advisorId === user.id || adv.name === user.name)
  );

  const pendingList = myProjects.filter((p) => p.status === 'PENDING_APPROVAL');
  const approvedList = myProjects.filter((p) => p.status === 'APPROVED');

  // หากไม่มีโครงงานที่ระบุ ID เจาะจงตรงกับบัญชีอาจารย์ ให้ดึงโครงงานรอตรวจทั้งหมดในภาควิชามาแสดงเพื่อให้สามารถตรวจอนุมัติได้
  const allPending = allProjects.filter((p) => p.status === 'PENDING_APPROVAL');
  const displayPending = pendingList.length > 0 ? pendingList : allPending;

  return (
    <div className="space-y-8 fade-slide-up">
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
              ระบบจัดการโครงงานสำหรับอาจารย์ที่ปรึกษา
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
              อาจารย์ผู้ใช้งาน: <strong>{user.name}</strong> ({user.email})
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-label-sm font-semibold px-3 py-1.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg">
              รอตรวจ {displayPending.length} รายการ
            </span>
            <span className="text-label-sm font-semibold px-3 py-1.5 bg-success/10 text-emerald-700 border border-success/20 rounded-lg">
              อนุมัติแล้ว {approvedList.length} รายการ
            </span>
          </div>
        </div>
      </div>

      {/* ส่วนที่ 1: คิวงานรอตรวจ (Pending Approvals) */}
      <section className="space-y-4">
        <h2 className="font-display text-headline-md font-bold text-on-surface flex items-center gap-2">
          <span>รายการรอการตรวจสอบและอนุมัติ ({displayPending.length})</span>
        </h2>

        {displayPending.length === 0 ? (
          <div className={`${cardClass} border-dashed p-8 text-center text-on-surface-variant text-body-md`}>
            ไม่มีโครงงานค้างตรวจในขณะนี้
          </div>
        ) : (
          <div className="space-y-4">
            {displayPending.map((project) => (
              <article key={project.id} className={`${cardClass} p-6 border-amber-300 space-y-4`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-primary-container/10 px-2.5 py-0.5 text-label-sm font-semibold text-primary-container">
                      {project.category}
                    </span>
                    <h3 className="font-display text-headline-md font-bold text-on-surface mt-2">{project.titleTh}</h3>
                    <p className="text-body-md text-secondary">{project.titleEn}</p>
                  </div>
                  <span className="text-label-sm font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                    PENDING
                  </span>
                </div>

                <p className="text-body-md text-on-surface-variant line-clamp-2 leading-[1.6]">{project.abstract}</p>

                <div className="text-label-sm text-secondary pt-3 border-t border-outline-variant/30">
                  ผู้จัดทำ: {project.members.map((m) => m.name).join(', ')} | ปีการศึกษา {project.academicYear}
                </div>

                <ApprovalActionBox projectId={project.id} />
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ส่วนที่ 2: โครงงานที่ได้รับการอนุมัติแล้ว */}
      <section className="space-y-4 pt-4">
        <h2 className="font-display text-headline-md font-bold text-on-surface flex items-center gap-2">
          <CheckIcon className="h-5 w-5 text-success" />
          <span>โครงงานในความดูแลที่เผยแพร่แล้ว ({approvedList.length})</span>
        </h2>

        {approvedList.length === 0 ? (
          <div className={`${cardClass} border-dashed p-8 text-center text-on-surface-variant text-body-md`}>
            ยังไม่มีโครงงานที่ได้รับการอนุมัติ
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvedList.map((project) => (
              <div key={project.id} className={`${cardClass} p-6 flex flex-col justify-between hover:shadow-md transition-shadow`}>
                <div>
                  <span className="text-label-sm font-semibold text-secondary">ปีการศึกษา {project.academicYear}</span>
                  <h3 className="font-display text-headline-md font-bold text-on-surface mt-1 line-clamp-1">{project.titleTh}</h3>
                  <p className="text-body-md text-secondary mb-2 line-clamp-1">{project.titleEn}</p>
                  <p className="text-body-md text-on-surface-variant line-clamp-2 leading-[1.6]">{project.abstract}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/30 flex justify-between items-center text-label-sm">
                  <span className="text-secondary">{project.members[0]?.name}</span>
                  <Link href={`/showcase/${project.id}`} className="font-semibold text-primary-container hover:underline">
                    เปิดดูผลงาน →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}