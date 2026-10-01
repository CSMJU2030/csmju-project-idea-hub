import Link from 'next/link';
import { ProjectForm } from '../../../modules/showcase/components/project-form';

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-csmju-surface-muted py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link
            href="/showcase"
            className="text-sm font-semibold text-csmju-primary hover:underline focus:outline-none focus:ring-2 focus:ring-csmju-primary rounded-md px-1"
          >
            ← กลับไปหน้ารายการผลงาน
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-csmju-text-body mt-2">
            ส่งผลงานโครงงานและนวัตกรรม
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-[1.6]">
            กรอกข้อมูลรายละเอียดโครงงาน ผลงานจะเข้าสู่สถานะรอการตรวจสอบโดยอาจารย์ที่ปรึกษาก่อนเผยแพร่สู่สาธารณะ
          </p>
        </div>

        <ProjectForm />
      </div>
    </main>
  );
}