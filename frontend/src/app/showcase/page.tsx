// src/app/showcase/page.tsx

import Link from 'next/link';
import { showcaseRepository } from '../../modules/showcase/repositories/mock/showcase.mock-repository';
import { ProjectFilter } from '../../modules/showcase/components/project-filter';
import { ProjectCard } from '../../modules/showcase/components/project-card';
import { getCurrentUser } from '../../modules/showcase/auth/core-auth.adapter';
import { logoutAction } from '../../modules/showcase/actions/auth.actions';

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

  // 1. ดึงข้อมูลผู้ใช้ปัจจุบันจาก Core Hub SSO Session Cookie
  const user = await getCurrentUser();

  // 2. ดึงเฉพาะโครงงานที่ APPROVED สู่สาธารณะ
  const rawProjects = await showcaseRepository.findProjects({
    status: 'APPROVED',
    keyword,
    year,
  });

  // กรอง Category เพิ่มเติมฝั่ง Repository/Memory
  const projects = category
    ? rawProjects.filter((p) => p.category === category)
    : rawProjects;

  // 3. ดึงตัวเลือก Categories และ Years สำหรับนำไปใส่ใน Filter Bar
  const allProjects = await showcaseRepository.findProjects({ status: 'APPROVED' });
  const categories = Array.from(new Set(allProjects.map((p) => p.category)));
  const academicYears = Array.from(new Set(allProjects.map((p) => p.academicYear))).sort((a, b) => b - a);

  const ssoAuthorizeUrl =
    'http://localhost:3000/api/v1/auth/sso/authorize?subsystem=csmju-project-idea-hub&callback_url=http://localhost:3002/auth/callback';

  return (
    <main className="min-h-screen bg-csmju-surface-muted py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ส่วนหัวข้อและสถานะ Authentication */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-bold tracking-wide uppercase text-csmju-primary">
              Computer Science Showcase
            </p>
            <h1 className="text-3xl font-extrabold text-csmju-text-body mt-1">
              คลังโครงงานและไอเดียเทคโนโลยี
            </h1>
            <p className="text-sm text-slate-500 mt-1 leading-[1.6]">
              แหล่งรวบรวมผลงานวิทยานิพนธ์ นวัตกรรม และไอเดียสร้างสรรค์ของสาขาวิทยาการคอมพิวเตอร์
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="text-xs">
                  <span className="font-bold text-slate-700">{user.name}</span>
                  <span className="ml-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-semibold text-[10px]">
                    {user.role}
                  </span>
                </div>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800 font-semibold hover:underline"
                  >
                    ออกจากระบบ
                  </button>
                </form>
              </div>
            ) : (
              <a
                href={ssoAuthorizeUrl}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-700 rounded-xl hover:bg-blue-800 transition"
              >
                เข้าสู่ระบบ Core Hub (SSO)
              </a>
            )}

            <Link
              href="/showcase/ideas"
              className="px-4 py-2.5 text-sm font-semibold text-csmju-primary bg-csmju-primary-soft rounded-xl hover:bg-csmju-primary-soft-hover transition focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            >
              Idea Bank
            </Link>
            <Link
              href="/showcase/new"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-csmju-primary rounded-xl hover:bg-csmju-primary-hover transition shadow-xs focus:outline-none focus:ring-2 focus:ring-csmju-primary focus:ring-offset-2"
            >
              + ส่งผลงานใหม่
            </Link>
          </div>
        </header>

        {/* แถบค้นหาและคัดกรอง */}
        <ProjectFilter categories={categories} academicYears={academicYears} />

        {/* แสดงผลรายการหรือ Empty State */}
        {projects.length === 0 ? (
          <section
            aria-label="ไม่พบข้อมูล"
            className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center"
          >
            <h2 className="text-lg font-bold text-slate-700">ไม่พบโครงงานที่ค้นหา</h2>
            <p className="text-sm text-slate-500 mt-1">
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
    </main>
  );
}