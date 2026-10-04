'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Project, ProjectFeedback } from '../../../modules/showcase/types/domain';
import { ApprovalActionBox } from '../../../modules/showcase/components/approval-action-box';
import { FeedbackModal } from '../../../modules/showcase/components/feedback-modal';

const initialMockProject: Project = {
  id: 'proj-001',
  titleTh: 'ระบบคลังโปรเจกต์และไอเดีย CSMJU',
  titleEn: 'CSMJU Project Showcase Hub',
  abstract: 'ระบบจัดการและจัดแสดงผลงานวิทยานิพนธ์และไอเดียเทคโนโลยีสำหรับนักศึกษา พร้อมระบบเชื่อมต่อสถาปัตยกรรมกลาง CSMJU2030 และประเมินผลงานจากอาจารย์และศิษย์เก่า',
  academicYear: 2568,
  category: 'Web Application',
  tags: ['Next.js', 'TypeScript', 'TailwindCSS', 'Central SSO'],
  techStack: ['Next.js', 'NestJS', 'PostgreSQL', 'TailwindCSS v4', 'Prisma'],
  members: [{ studentId: 'user-std-001', name: 'สมชาย นักศึกษา', isOwner: true }],
  advisors: [{ advisorId: 'adv-001', name: 'ผศ.ดร. ที่ปรึกษา ใจดี' }],
  githubUrl: 'https://github.com/CSMJU2030/csmju-project-idea-hub',
  demoUrl: 'https://showcase.csmju2030.local',
  reportPdfUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-001/full-thesis.pdf',
  proposalUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-001/proposal.pdf',
  progressReportUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-001/progress-3chapters.pdf',
  fullThesisPdfUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-001/full-thesis.pdf',
  posterImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
  demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  chaptersSummary: {
    chapter1: 'บทที่ 1 บทนำ: ศึกษาปัญหาการจัดเก็บผลงานโครงงานพิเศษของสาขาวิทยาการคอมพิวเตอร์ที่ยังกระจัดกระจาย ขาดระบบสืบค้นผลงานของรุ่นพี่ กำหนดวัตถุประสงค์เพื่อพัฒนาระบบคลังผลงานกลางที่เชื่อมโยงกับแพลตฟอร์ม CSMJU2030',
    chapter2: 'บทที่ 2 ทฤษฎีและงานวิจัยที่เกี่ยวข้อง: ศึกษาทฤษฎี Microservices, Single Sign-On (RS256 JWKS), RBAC, Design System Tokens, และการเปรียบเทียบระบบคลังผลงานวิทยานิพนธ์ของสถาบันอื่น',
    chapter3: 'บทที่ 3 วิธีการดำเนินงานและการออกแบบระบบ: ออกแบบ System Architecture แบบ 1 Subsystem = 1 DB = 1 Repo, ออกแบบ DFD Level 0-2, Database ERD (Prisma snake_case), และ Wireframes ตาม CSMJU UI Tokens',
    chapter4: 'บทที่ 4 ผลการดำเนินงานและการทดสอบระบบ: พัฒนาเว็บแอปพลิเคชัน Next.js App Router และ NestJS API, ทดสอบ SSO Integration T1-T9, Unit Test 61 ข้อผ่าน 100%, และการทดสอบ UAT จากกลุ่มตัวอย่างอาจารย์และนักศึกษา',
    chapter5: 'บทที่ 5 สรุปผล อภิปรายผล และข้อเสนอแนะ: ระบบสามารถทำงานได้ตามวัตถุประสงค์ รองรับการสืบค้นโครงงานและให้ Feedback จากศิษย์เก่า ข้อเสนอแนะในอนาคตคือการเชื่อมต่อ AI Semantic Search และการส่งออกเล่มรายงานอัตโนมัติ',
  },
  status: 'APPROVED',
  createdAt: new Date(),
  updatedAt: new Date(),
};

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      return v ? `https://www.youtube.com/embed/${v}` : null;
    }
    if (parsed.hostname.includes('youtu.be')) {
      const v = parsed.pathname.slice(1);
      return v ? `https://www.youtube.com/embed/${v}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = (params?.id as string) || 'proj-001';

  const [project] = useState<Project>(() => ({
    ...initialMockProject,
    id: projectId,
  }));
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'deliverables'>('overview');
  const [feedbacks, setFeedbacks] = useState<ProjectFeedback[]>([]);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isPending, startTransition] = useTransition();

  if (!project) {
    return (
      <main className="min-h-screen bg-csmju-surface-muted py-12 text-center text-slate-500">
        กำลังโหลดข้อมูลผลงาน...
      </main>
    );
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      setContactSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactSuccess(false), 4000);
    });
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(project.demoVideoUrl);

  return (
    <main className="min-h-screen bg-csmju-surface-muted py-10 px-4 sm:px-6 lg:px-8 text-csmju-text-body">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/showcase"
          className="text-sm font-semibold text-csmju-primary hover:underline focus:outline-none focus:ring-2 focus:ring-csmju-primary rounded-md px-1"
        >
          ← กลับไปหน้ารายการผลงาน
        </Link>

        {/* ส่วนหัวแสดงชื่อและปุ่ม Action */}
        <header className="bg-white p-8 rounded-2xl border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-csmju-primary-soft text-csmju-primary rounded-md">
                {project.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ปีการศึกษา {project.academicYear}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                  project.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/showcase/${project.id}/edit`}
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                ✏️ แก้ไขผลงาน
              </Link>
              <button
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                className="px-4 py-2 bg-csmju-primary-soft text-csmju-primary text-sm font-bold rounded-xl hover:bg-csmju-primary-soft-hover focus:outline-none focus:ring-2 focus:ring-csmju-primary transition"
              >
                ⭐ ให้ข้อเสนอแนะ / ประเมินผลงาน
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-csmju-primary">{project.titleTh}</h1>
          <p className="text-base text-slate-600 font-medium mt-1">{project.titleEn}</p>

          {/* เมนูแท็บเพื่อสลับดูข้อมูล */}
          <nav className="flex border-b border-slate-200 mt-6 gap-2" aria-label="Project tabs">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-4 text-sm font-bold transition border-b-2 ${
                activeTab === 'overview'
                  ? 'border-csmju-primary text-csmju-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📋 ภาพรวมโครงงาน
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('chapters')}
              className={`pb-3 px-4 text-sm font-bold transition border-b-2 ${
                activeTab === 'chapters'
                  ? 'border-csmju-primary text-csmju-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📚 เอกสาร 5 บท (Senior Thesis)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('deliverables')}
              className={`pb-3 px-4 text-sm font-bold transition border-b-2 ${
                activeTab === 'deliverables'
                  ? 'border-csmju-primary text-csmju-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              🚀 ชิ้นงานและสื่อส่งมอบ (Deliverables)
            </button>
          </nav>
        </header>

        {/* แท็บที่ 1: ภาพรวมผลงาน */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <section className="bg-white p-8 rounded-2xl border border-slate-200 space-y-5">
              <div>
                <h2 className="text-base font-bold text-csmju-primary mb-2">บทคัดย่อ</h2>
                <p className="text-sm leading-[1.6] text-slate-700 whitespace-pre-line">
                  {project.abstract}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 mb-2">Tech Stack ที่ใช้งาน</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-slate-500">คณะผู้จัดทำ:</p>
                  <ul className="list-disc list-inside mt-1 text-slate-700">
                    {project.members.map((m) => (
                      <li key={m.studentId}>
                        {m.name} {m.isOwner ? '(หัวหน้า)' : ''}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-500">อาจารย์ที่ปรึกษา:</p>
                  <ul className="list-disc list-inside mt-1 text-slate-700">
                    {project.advisors.map((a) => (
                      <li key={a.advisorId}>{a.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* วิดีโอเดโมในหน้าภาพรวม */}
            {youtubeEmbedUrl ? (
              <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <h2 className="text-sm font-bold text-csmju-primary">🎬 วิดีโอสาธิตระบบ (Demo Video)</h2>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                  <iframe
                    src={youtubeEmbedUrl}
                    title="Project Demo Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            ) : project.demoVideoUrl ? (
              <section className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-csmju-primary">🎬 วิดีโอสาธิตระบบ</h2>
                  <p className="text-xs text-slate-500 mt-1">รับชมวิดีโอนำเสนอและสาธิตการทำงานของผลงาน</p>
                </div>
                <a
                  href={project.demoVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition"
                >
                  เปิดดูวิดีโอ ↗
                </a>
              </section>
            ) : null}
          </div>
        )}

        {/* แท็บที่ 2: เอกสาร 5 บทมาตรฐานของสาขาวิทยาการคอมพิวเตอร์ */}
        {activeTab === 'chapters' && (
          <div className="space-y-6">
            {/* กล่องดาวน์โหลดเอกสาร */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200">
              <h2 className="text-base font-bold text-csmju-primary mb-3">
                📥 ดาวน์โหลดเอกสารวิชาการโครงงาน (PDF Documents)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-lg">📄</span>
                    <h3 className="text-xs font-bold text-slate-800 mt-1">ข้อเสนอโครงงาน</h3>
                    <p className="text-[11px] text-slate-500">Project Proposal</p>
                  </div>
                  {project.proposalUrl ? (
                    <a
                      href={project.proposalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-center px-3 py-1.5 bg-csmju-primary text-white text-xs font-semibold rounded-lg hover:bg-csmju-primary-hover transition"
                    >
                      ดาวน์โหลด PDF ↗
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">ยังไม่มีไฟล์</span>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-lg">📑</span>
                    <h3 className="text-xs font-bold text-slate-800 mt-1">รายงานก้าวหน้า 3 บท</h3>
                    <p className="text-[11px] text-slate-500">Progress Report (Ch 1-3)</p>
                  </div>
                  {project.progressReportUrl ? (
                    <a
                      href={project.progressReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-center px-3 py-1.5 bg-csmju-primary text-white text-xs font-semibold rounded-lg hover:bg-csmju-primary-hover transition"
                    >
                      ดาวน์โหลด PDF ↗
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">ยังไม่มีไฟล์</span>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-lg">📘</span>
                    <h3 className="text-xs font-bold text-slate-800 mt-1">เล่มรายงานฉบับสมบูรณ์</h3>
                    <p className="text-[11px] text-slate-500">Full Thesis (Ch 1-5)</p>
                  </div>
                  {project.fullThesisPdfUrl || project.reportPdfUrl ? (
                    <a
                      href={project.fullThesisPdfUrl || project.reportPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-center px-3 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition"
                    >
                      ดาวน์โหลดเล่มเต็ม ↗
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">ยังไม่มีไฟล์</span>
                  )}
                </div>
              </div>
            </section>

            {/* แสดงสาระสำคัญของแต่ละบททั้ง 5 บท */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-csmju-primary">
                📖 สรุปเนื้อหาสำคัญรายบท (Chapter Summaries)
              </h2>

              <div className="space-y-4">
                <article className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-csmju-primary-soft text-csmju-primary text-xs rounded-md">
                      บทที่ 1
                    </span>
                    บทนำ (Introduction)
                  </h3>
                  <p className="text-xs leading-[1.6] text-slate-600 mt-2">
                    {project.chaptersSummary?.chapter1 || 'ยังไม่มีการระบุสรุปย่อบทที่ 1'}
                  </p>
                </article>

                <article className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-csmju-primary-soft text-csmju-primary text-xs rounded-md">
                      บทที่ 2
                    </span>
                    ทฤษฎีและงานวิจัยที่เกี่ยวข้อง (Literature Review)
                  </h3>
                  <p className="text-xs leading-[1.6] text-slate-600 mt-2">
                    {project.chaptersSummary?.chapter2 || 'ยังไม่มีการระบุสรุปย่อบทที่ 2'}
                  </p>
                </article>

                <article className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-csmju-primary-soft text-csmju-primary text-xs rounded-md">
                      บทที่ 3
                    </span>
                    วิธีการดำเนินงานและการออกแบบระบบ (System Design & Methodology)
                  </h3>
                  <p className="text-xs leading-[1.6] text-slate-600 mt-2">
                    {project.chaptersSummary?.chapter3 || 'ยังไม่มีการระบุสรุปย่อบทที่ 3'}
                  </p>
                </article>

                <article className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-csmju-primary-soft text-csmju-primary text-xs rounded-md">
                      บทที่ 4
                    </span>
                    ผลการดำเนินงานและการทดสอบระบบ (Implementation & Testing)
                  </h3>
                  <p className="text-xs leading-[1.6] text-slate-600 mt-2">
                    {project.chaptersSummary?.chapter4 || 'ยังไม่มีการระบุสรุปย่อบทที่ 4'}
                  </p>
                </article>

                <article className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-csmju-primary-soft text-csmju-primary text-xs rounded-md">
                      บทที่ 5
                    </span>
                    สรุปผลการดำเนินงาน อภิปรายผล และข้อเสนอแนะ (Conclusion & Discussion)
                  </h3>
                  <p className="text-xs leading-[1.6] text-slate-600 mt-2">
                    {project.chaptersSummary?.chapter5 || 'ยังไม่มีการระบุสรุปย่อบทที่ 5'}
                  </p>
                </article>
              </div>
            </section>
          </div>
        )}

        {/* แท็บที่ 3: ชิ้นงานและสื่อส่งมอบ (Deliverables) */}
        {activeTab === 'deliverables' && (
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-csmju-primary">
                🖼️ โปสเตอร์ผลงานโครงงาน (Project Poster)
              </h2>
              {project.posterImageUrl ? (
                <div className="space-y-3">
                  <div className="max-h-96 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center">
                    <img
                      src={project.posterImageUrl}
                      alt={`โปสเตอร์โครงงาน ${project.titleTh}`}
                      className="w-full object-cover max-h-96"
                    />
                  </div>
                  <div className="flex justify-end">
                    <a
                      href={project.posterImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition"
                    >
                      ดูโปสเตอร์ความละเอียดสูง ↗
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
                  ยังไม่ได้แนบลิงก์รูปภาพโปสเตอร์ผลงาน
                </div>
              )}
            </section>

            <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-csmju-primary">
                🔗 ลิงก์ระบบจริงและซอร์สโค้ด
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">📂 GitHub Repository</h3>
                    <p className="text-[11px] text-slate-500 mt-1">ซอร์สโค้ดและคู่มือการพัฒนาทางเทคนิค</p>
                  </div>
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-center px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
                    >
                      เปิด GitHub Repo ↗
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">ไม่ระบุ</span>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">🚀 Production Live Demo</h3>
                    <p className="text-[11px] text-slate-500 mt-1">ระบบงานจริงสำหรับทดลองใช้งานบนคลาวด์</p>
                  </div>
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                    >
                      เข้าสู่ระบบจริง ↗
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">ไม่ระบุ</span>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ส่วนแสดงความคิดเห็น/Feedback ที่ผ่านมา */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-csmju-primary">
              ข้อเสนอแนะจากอาจารย์และศิษย์เก่า ({feedbacks.length})
            </h2>
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="text-sm text-csmju-primary font-semibold hover:underline"
            >
              + เขียนความคิดเห็น
            </button>
          </div>

          {feedbacks.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">
              ยังไม่มีข้อเสนอแนะสำหรับโครงงานนี้ อาจารย์และศิษย์เก่าสามารถร่วมประเมินได้
            </p>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-700">
                      {fb.authorName} ({fb.authorRole})
                    </span>
                    <span className="text-amber-500 font-semibold">
                      {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-[1.6]">{fb.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* แบบฟอร์มแสดงความสนใจ/ติดต่อร่วมงาน (Recruitment Contact) */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
          <div>
            <h2 className="text-base font-bold text-csmju-primary">
              แสดงความสนใจผลงาน / ติดต่อนักศึกษาผู้พัฒนา
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              สำหรับสถานประกอบการหรือศิษย์เก่าที่สนใจผลงาน ทาบทามฝึกงาน หรือเสนอโอกาสร่วมงาน
            </p>
          </div>

          {contactSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium">
              ✅ ส่งข้อความแสดงความสนใจถึงนักศึกษาเรียบร้อยแล้ว
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold mb-1">ชื่อผู้ติดต่อ / หน่วยงาน *</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="เช่น บริษัท เทคโนโลยี จำกัด หรือ ชื่อศิษย์เก่า"
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-csmju-primary outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-semibold mb-1">อีเมลติดต่อกลับ *</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="contact@company.com"
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-csmju-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-msg" className="block text-sm font-semibold mb-1">ข้อความรายละเอียด *</label>
              <textarea
                id="contact-msg"
                rows={3}
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="ระบุข้อความ เช่น สนใจนำผลงานไปต่อยอด หรือสนใจนัดสัมภาษณ์เพื่อรับเข้าฝึกงาน..."
                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-csmju-primary outline-none leading-[1.6]"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 bg-csmju-primary text-white text-sm font-semibold rounded-lg hover:bg-csmju-primary-hover transition disabled:opacity-50"
            >
              ส่งข้อความติดต่อ
            </button>
          </form>
        </section>

        {/* กล่องตรวจสอบและอนุมัติ (สำหรับอาจารย์ที่ปรึกษา) */}
        <ApprovalActionBox projectId={project.id} />

        {/* Modal Popup ให้คะแนนและข้อเสนอแนะ */}
        <FeedbackModal
          projectId={project.id}
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          onSuccess={() => {
            setFeedbacks((prev) => [
              ...prev,
              {
                id: `fb-${Date.now()}`,
                projectId: project.id,
                authorId: 'alumni-001',
                authorName: 'ศิษย์เก่า / ผู้ประเมิน',
                authorRole: 'ALUMNI',
                rating: 5,
                comment: 'ผลงานมีความน่าสนใจและเป็นประโยชน์อย่างยิ่ง',
                createdAt: new Date(),
              },
            ]);
            alert('บันทึกข้อเสนอแนะสำเร็จ');
          }}
        />
      </div>
    </main>
  );
}