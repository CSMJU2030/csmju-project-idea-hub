// src/app/showcase/page.tsx

import Link from 'next/link';
import { showcaseRepository } from '../../modules/showcase/repositories/mock/showcase.mock-repository';
import { ProjectFilter } from '../../modules/showcase/components/project-filter';
import { ProjectCard } from '../../modules/showcase/components/project-card';
import { cardClass, primaryButtonClass, secondaryButtonClass } from '../../modules/showcase/components/ui';
import { AddIcon, DashboardIcon } from '../../modules/showcase/components/icons';

interface PageProps {
  searchParams: Promise<{
    keyword?: string;
    category?: string;
    year?: string;
  }>;
}

export default async function ShowcasePage(props: PageProps) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword;
  const category = searchParams.category;
  const year = searchParams.year ? parseInt(searchParams.year, 10) : undefined;

  // 1. ดึงเฉพาะโครงงานที่ APPROVED สู่สาธารณะ
  const rawProjects = await showcaseRepository.findProjects({
    status: 'APPROVED',
    keyword,
    year,
  });

  // กรอง Category เพิ่มเติมฝั่ง Repository/Memory
  const projects = category
    ? rawProjects.filter((p) => p.category === category)
    : rawProjects;

  // 2. ดึงตัวเลือก Categories และ Years สำหรับนำไปใส่ใน Filter Bar
  const allProjects = await showcaseRepository.findProjects({ status: 'APPROVED' });
  const categories = Array.from(new Set(allProjects.map((p) => p.category)));
  const academicYears = Array.from(new Set(allProjects.map((p) => p.academicYear))).sort((a, b) => b - a);

  return (
    <div className="space-y-8 fade-slide-up">
      {/* ส่วนหัวข้อ PageHeader */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-block text-label-sm font-bold text-primary-container tracking-wide uppercase">
            CSMJU Innovation Showcase
          </span>
          <h1 className="font-display text-headline-lg font-bold text-on-surface mt-1">
            คลังโครงงานและไอเดียเทคโนโลยี
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
            แหล่งรวบรวมผลงานวิทยานิพนธ์ นวัตกรรม และไอเดียสร้างสรรค์ของสาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/showcase/ideas"
            className={secondaryButtonClass}
          >
            <DashboardIcon className="h-4 w-4" />
            <span>คลังไอเดีย (Idea Bank)</span>
          </Link>
          <Link
            href="/showcase/new"
            className={primaryButtonClass}
          >
            <AddIcon className="h-4 w-4" />
            <span>+ ส่งผลงานใหม่</span>
          </Link>
        </div>
      </div>

      {/* แถบค้นหาและคัดกรอง */}
      <ProjectFilter categories={categories} academicYears={academicYears} />

      {/* แสดงผลรายการหรือ Empty State */}
      {projects.length === 0 ? (
        <section
          aria-label="ไม่พบข้อมูล"
          className={`${cardClass} border-dashed p-12 text-center`}
        >
          <h2 className="text-headline-md font-bold text-on-surface">ไม่พบโครงงานที่ค้นหา</h2>
          <p className="text-body-md text-on-surface-variant mt-2 leading-[1.6]">
            ลองเปลี่ยนคำค้นหา ปรับเปลี่ยนหมวดหมู่ หรือล้างตัวกรองทั้งหมด
          </p>
        </section>
      ) : (
        <section
          aria-label="รายการโครงงานทั้งหมด"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      )}
    </div>
  );
}