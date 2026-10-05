import Link from 'next/link';
import { ProjectForm } from '../../../modules/showcase/components/project-form';
import { ArrowBackIcon } from '../../../modules/showcase/components/icons';

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-slide-up">
      <div>
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 text-label-md font-semibold text-primary-container hover:underline"
        >
          <ArrowBackIcon className="h-4 w-4" />
          <span>กลับไปหน้ารายการผลงาน</span>
        </Link>
        <h1 className="font-display text-headline-lg font-bold text-on-surface mt-2">
          ส่งผลงานโครงงานและนวัตกรรม
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
          กรอกข้อมูลรายละเอียดโครงงาน ผลงานจะเข้าสู่สถานะรอการตรวจสอบโดยอาจารย์ที่ปรึกษาก่อนเผยแพร่สู่สาธารณะ
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}