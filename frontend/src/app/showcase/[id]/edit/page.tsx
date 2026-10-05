import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '../../../../modules/showcase/auth/core-auth.adapter';
import { showcaseRepository } from '../../../../modules/showcase/repositories/mock/showcase.mock-repository';
import { canEditProject } from '../../../../modules/showcase/auth/permissions';
import { ProjectEditForm } from '../../../../modules/showcase/components/project-edit-form';
import { cardClass } from '../../../../modules/showcase/components/ui';
import { ArrowBackIcon, CloseIcon } from '../../../../modules/showcase/components/icons';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const project = await showcaseRepository.findProjectById(id);

  if (!project) {
    notFound();
  }

  // ตรวจสอบสิทธิ์การแก้ไขระดับ Server
  const hasPermission = canEditProject(currentUser, project);

  if (!hasPermission) {
    return (
      <div className="py-12 px-4 text-center text-on-surface fade-slide-up">
        <div className={`${cardClass} max-w-md mx-auto p-8 border-error/20 space-y-3`}>
          <div className="flex justify-center">
            <span className="p-3 rounded-full bg-error-container text-error">
              <CloseIcon className="h-8 w-8" />
            </span>
          </div>
          <h1 className="font-display text-headline-md font-bold text-error">ไม่มีสิทธิ์แก้ไขผลงานนี้</h1>
          <p className="text-body-md text-on-surface-variant leading-[1.6]">
            สงวนสิทธิ์การแก้ไขเฉพาะสมาชิกที่เป็นหัวหน้ากลุ่มหรือเจ้าของโครงงานเท่านั้น
          </p>
          <Link
            href={`/showcase/${project.id}`}
            className="inline-block mt-4 text-label-md text-primary-container font-semibold hover:underline"
          >
            ← กลับไปหน้ารายละเอียดผลงาน
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-slide-up">
      <div>
        <Link
          href={`/showcase/${project.id}`}
          className="inline-flex items-center gap-1.5 text-label-md font-semibold text-primary-container hover:underline"
        >
          <ArrowBackIcon className="h-4 w-4" />
          <span>กลับไปหน้ารายละเอียดผลงาน</span>
        </Link>
        <h1 className="font-display text-headline-lg font-bold text-on-surface mt-2">
          แก้ไขข้อมูลโครงงาน
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
          ปรับปรุงรายละเอียดผลงาน ลิงก์ภายนอก หรือแก้ไขเนื้อหาตามคำแนะนำของอาจารย์
        </p>
      </div>

      <ProjectEditForm project={project} />
    </div>
  );
}