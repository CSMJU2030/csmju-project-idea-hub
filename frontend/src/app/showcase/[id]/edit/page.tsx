import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '../../../../modules/showcase/auth/core-auth.adapter';
import { showcaseRepository } from '../../../../modules/showcase/repositories/mock/showcase.mock-repository';
import { canEditProject } from '../../../../modules/showcase/auth/permissions';
import { ProjectEditForm } from '../../../../modules/showcase/components/project-edit-form';

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
      <main className="min-h-screen bg-csmju-surface-muted py-12 px-4 text-center text-csmju-text-body">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-red-200">
          <div className="text-3xl mb-2">🚫</div>
          <h1 className="text-lg font-bold text-red-700">ไม่มีสิทธิ์แก้ไขผลงานนี้</h1>
          <p className="text-sm text-slate-500 mt-2">
            สงวนสิทธิ์การแก้ไขเฉพาะสมาชิกที่เป็นหัวหน้ากลุ่มหรือเจ้าของโครงงานเท่านั้น
          </p>
          <Link
            href={`/showcase/${project.id}`}
            className="inline-block mt-4 text-sm text-csmju-primary font-semibold hover:underline"
          >
            ← กลับไปหน้ารายละเอียดผลงาน
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-csmju-surface-muted py-10 px-4 sm:px-6 lg:px-8 text-csmju-text-body">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link
            href={`/showcase/${project.id}`}
            className="text-sm font-semibold text-csmju-primary hover:underline focus:outline-none focus:ring-2 focus:ring-csmju-primary rounded-md px-1"
          >
            ← กลับไปหน้ารายละเอียดผลงาน
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-csmju-text-body mt-2">
            แก้ไขข้อมูลโครงงาน
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ปรับปรุงรายละเอียดผลงาน ลิงก์ภายนอก หรือแก้ไขเนื้อหาตามคำแนะนำของอาจารย์
          </p>
        </div>

        <ProjectEditForm project={project} />
      </div>
    </main>
  );
}