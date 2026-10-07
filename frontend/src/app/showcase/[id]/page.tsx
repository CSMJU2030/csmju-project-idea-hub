'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Project, ProjectFeedback } from '../../../modules/showcase/types/domain';
import { ApprovalActionBox } from '../../../modules/showcase/components/approval-action-box';
import { FeedbackModal } from '../../../modules/showcase/components/feedback-modal';
import {
  cardClass,
  primaryButtonClass,
  secondaryButtonClass,
  inputClass,
} from '../../../modules/showcase/components/ui';
import {
  ArrowBackIcon,
  CheckIcon,
  DescriptionIcon,
  EditIcon,
  OpenInNewIcon,
} from '../../../modules/showcase/components/icons';

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
      <div className={`${cardClass} p-12 text-center text-on-surface-variant`}>
        กำลังโหลดข้อมูลผลงาน...
      </div>
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
    <div className="space-y-6 fade-slide-up">
      <Link
        href="/showcase"
        className="inline-flex items-center gap-1.5 text-label-md font-semibold text-primary-container hover:underline"
      >
        <ArrowBackIcon className="h-4 w-4" />
        <span>กลับไปหน้ารายการผลงาน</span>
      </Link>

      {/* ส่วนหัวแสดงชื่อและปุ่ม Action */}
      <header className={`${cardClass} p-8`}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary-container/10 px-3 py-1 text-label-sm font-semibold text-primary-container">
              {project.category}
            </span>
            <span className="text-label-sm text-secondary font-medium">
              ปีการศึกษา {project.academicYear}
            </span>
            <span
              className={`text-label-sm font-semibold px-2.5 py-0.5 rounded-full ${
                project.status === 'APPROVED'
                  ? 'bg-success/10 text-emerald-700'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {project.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/showcase/${project.id}/edit`}
              className={secondaryButtonClass}
            >
              <EditIcon className="h-4 w-4" />
              <span>แก้ไขผลงาน</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className={primaryButtonClass}
            >
              <span>ให้ข้อเสนอแนะ / ประเมินผลงาน</span>
            </button>
          </div>
        </div>

        <h1 className="font-display text-headline-lg font-bold text-on-surface">
          {project.titleTh}
        </h1>
        <p className="text-body-lg text-secondary font-medium mt-1">
          {project.titleEn}
        </p>

        {/* เมนูแท็บเพื่อสลับดูข้อมูล */}
        <nav className="flex border-b border-outline-variant/40 mt-6 gap-2" aria-label="Project tabs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 text-label-md font-semibold transition border-b-2 ${
              activeTab === 'overview'
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            ภาพรวมโครงงาน
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chapters')}
            className={`pb-3 px-4 text-label-md font-semibold transition border-b-2 ${
              activeTab === 'chapters'
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            เอกสาร 5 บท (Senior Thesis)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deliverables')}
            className={`pb-3 px-4 text-label-md font-semibold transition border-b-2 ${
              activeTab === 'deliverables'
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            ชิ้นงานและสื่อส่งมอบ (Deliverables)
          </button>
        </nav>
      </header>

      {/* แท็บที่ 1: ภาพรวมผลงาน */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <section className={`${cardClass} p-8 space-y-6`}>
            <div>
              <h2 className="font-display text-headline-md font-bold text-on-surface mb-2">บทคัดย่อ</h2>
              <p className="text-body-md leading-[1.6] text-on-surface-variant whitespace-pre-line">
                {project.abstract}
              </p>
            </div>

            <div className="pt-4 border-t border-outline-variant/30">
              <h3 className="text-label-md font-semibold text-on-surface mb-2">Tech Stack ที่ใช้งาน</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-label-sm px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-md font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-md">
              <div>
                <p className="font-semibold text-on-surface">คณะผู้จัดทำ:</p>
                <ul className="list-disc list-inside mt-1 text-on-surface-variant leading-[1.6]">
                  {project.members.map((m) => (
                    <li key={m.studentId}>
                      {m.name} {m.isOwner ? '(หัวหน้า)' : ''}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-on-surface">อาจารย์ที่ปรึกษา:</p>
                <ul className="list-disc list-inside mt-1 text-on-surface-variant leading-[1.6]">
                  {project.advisors.map((a) => (
                    <li key={a.advisorId}>{a.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* วิดีโอเดโมในหน้าภาพรวม */}
          {youtubeEmbedUrl ? (
            <section className={`${cardClass} p-6 space-y-4`}>
              <h2 className="font-display text-headline-md font-bold text-on-surface">
                วิดีโอสาธิตระบบ (Demo Video)
              </h2>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-brand-navy border border-outline-variant/30">
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
            <section className={`${cardClass} p-6 flex items-center justify-between`}>
              <div>
                <h2 className="font-display text-headline-md font-bold text-on-surface">
                  วิดีโอสาธิตระบบ
                </h2>
                <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
                  รับชมวิดีโอนำเสนอและสาธิตการทำงานของผลงาน
                </p>
              </div>
              <a
                href={project.demoVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={primaryButtonClass}
              >
                <span>เปิดดูวิดีโอ</span>
                <OpenInNewIcon className="h-4 w-4" />
              </a>
            </section>
          ) : null}
        </div>
      )}

      {/* แท็บที่ 2: เอกสาร 5 บทมาตรฐานของสาขาวิทยาการคอมพิวเตอร์ */}
      {activeTab === 'chapters' && (
        <div className="space-y-6">
          {/* กล่องดาวน์โหลดเอกสาร */}
          <section className={`${cardClass} p-6`}>
            <h2 className="font-display text-headline-md font-bold text-on-surface mb-4">
              ดาวน์โหลดเอกสารวิชาการโครงงาน (PDF Documents)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 flex flex-col justify-between space-y-3">
                <div>
                  <DescriptionIcon className="h-6 w-6 text-primary-container" />
                  <h3 className="text-label-md font-bold text-on-surface mt-2">ข้อเสนอโครงงาน</h3>
                  <p className="text-caption text-secondary">Project Proposal</p>
                </div>
                {project.proposalUrl ? (
                  <a
                    href={project.proposalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${primaryButtonClass} text-center`}
                  >
                    ดาวน์โหลด PDF
                  </a>
                ) : (
                  <span className="text-caption text-secondary italic">ยังไม่มีไฟล์</span>
                )}
              </div>

              <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 flex flex-col justify-between space-y-3">
                <div>
                  <DescriptionIcon className="h-6 w-6 text-primary-container" />
                  <h3 className="text-label-md font-bold text-on-surface mt-2">รายงานก้าวหน้า 3 บท</h3>
                  <p className="text-caption text-secondary">Progress Report (Ch 1-3)</p>
                </div>
                {project.progressReportUrl ? (
                  <a
                    href={project.progressReportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${primaryButtonClass} text-center`}
                  >
                    ดาวน์โหลด PDF
                  </a>
                ) : (
                  <span className="text-caption text-secondary italic">ยังไม่มีไฟล์</span>
                )}
              </div>

              <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 flex flex-col justify-between space-y-3">
                <div>
                  <DescriptionIcon className="h-6 w-6 text-emerald-600" />
                  <h3 className="text-label-md font-bold text-on-surface mt-2">เล่มรายงานฉบับสมบูรณ์</h3>
                  <p className="text-caption text-secondary">Full Thesis (Ch 1-5)</p>
                </div>
                {project.fullThesisPdfUrl || project.reportPdfUrl ? (
                  <a
                    href={project.fullThesisPdfUrl || project.reportPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-label-md text-white shadow-md hover:bg-emerald-800 transition"
                  >
                    ดาวน์โหลดเล่มเต็ม
                  </a>
                ) : (
                  <span className="text-caption text-secondary italic">ยังไม่มีไฟล์</span>
                )}
              </div>
            </div>
          </section>

          {/* แสดงสาระสำคัญของแต่ละบททั้ง 5 บท */}
          <section className={`${cardClass} p-6 space-y-4`}>
            <h2 className="font-display text-headline-md font-bold text-on-surface">
              สรุปเนื้อหาสำคัญรายบท (Chapter Summaries)
            </h2>

            <div className="space-y-4">
              <article className="p-4 rounded-xl bg-surface border border-outline-variant/30">
                <h3 className="text-label-md font-bold text-on-surface flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-primary-container/10 text-primary-container text-label-sm rounded-md font-semibold">
                    บทที่ 1
                  </span>
                  บทนำ (Introduction)
                </h3>
                <p className="text-body-md leading-[1.6] text-on-surface-variant mt-2">
                  {project.chaptersSummary?.chapter1 || 'ยังไม่มีการระบุสรุปย่อบทที่ 1'}
                </p>
              </article>

              <article className="p-4 rounded-xl bg-surface border border-outline-variant/30">
                <h3 className="text-label-md font-bold text-on-surface flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-primary-container/10 text-primary-container text-label-sm rounded-md font-semibold">
                    บทที่ 2
                  </span>
                  ทฤษฎีและงานวิจัยที่เกี่ยวข้อง (Literature Review)
                </h3>
                <p className="text-body-md leading-[1.6] text-on-surface-variant mt-2">
                  {project.chaptersSummary?.chapter2 || 'ยังไม่มีการระบุสรุปย่อบทที่ 2'}
                </p>
              </article>

              <article className="p-4 rounded-xl bg-surface border border-outline-variant/30">
                <h3 className="text-label-md font-bold text-on-surface flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-primary-container/10 text-primary-container text-label-sm rounded-md font-semibold">
                    บทที่ 3
                  </span>
                  วิธีการดำเนินงานและการออกแบบระบบ (System Design & Methodology)
                </h3>
                <p className="text-body-md leading-[1.6] text-on-surface-variant mt-2">
                  {project.chaptersSummary?.chapter3 || 'ยังไม่มีการระบุสรุปย่อบทที่ 3'}
                </p>
              </article>

              <article className="p-4 rounded-xl bg-surface border border-outline-variant/30">
                <h3 className="text-label-md font-bold text-on-surface flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-primary-container/10 text-primary-container text-label-sm rounded-md font-semibold">
                    บทที่ 4
                  </span>
                  ผลการดำเนินงานและการทดสอบระบบ (Implementation & Testing)
                </h3>
                <p className="text-body-md leading-[1.6] text-on-surface-variant mt-2">
                  {project.chaptersSummary?.chapter4 || 'ยังไม่มีการระบุสรุปย่อบทที่ 4'}
                </p>
              </article>

              <article className="p-4 rounded-xl bg-surface border border-outline-variant/30">
                <h3 className="text-label-md font-bold text-on-surface flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-primary-container/10 text-primary-container text-label-sm rounded-md font-semibold">
                    บทที่ 5
                  </span>
                  สรุปผลการดำเนินงาน อภิปรายผล และข้อเสนอแนะ (Conclusion & Discussion)
                </h3>
                <p className="text-body-md leading-[1.6] text-on-surface-variant mt-2">
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
          <section className={`${cardClass} p-6 space-y-4`}>
            <h2 className="font-display text-headline-md font-bold text-on-surface">
              โปสเตอร์ผลงานโครงงาน (Project Poster)
            </h2>
            {project.posterImageUrl ? (
              <div className="space-y-4">
                <div className="max-h-96 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface flex items-center justify-center">
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
                    className={secondaryButtonClass}
                  >
                    <span>ดูโปสเตอร์ความละเอียดสูง</span>
                    <OpenInNewIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-secondary bg-surface rounded-xl border border-dashed border-outline-variant/40 text-body-md">
                ยังไม่ได้แนบลิงก์รูปภาพโปสเตอร์ผลงาน
              </div>
            )}
          </section>

          <section className={`${cardClass} p-6 space-y-4`}>
            <h2 className="font-display text-headline-md font-bold text-on-surface">
              ลิงก์ระบบจริงและซอร์สโค้ด
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-label-md font-bold text-on-surface">GitHub Repository</h3>
                  <p className="text-caption text-secondary mt-1">ซอร์สโค้ดและคู่มือการพัฒนาทางเทคนิค</p>
                </div>
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${secondaryButtonClass} text-center`}
                  >
                    <span>เปิด GitHub Repo</span>
                    <OpenInNewIcon className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="text-caption text-secondary italic">ไม่ระบุ</span>
                )}
              </div>

              <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-label-md font-bold text-on-surface">Production Live Demo</h3>
                  <p className="text-caption text-secondary mt-1">ระบบงานจริงสำหรับทดลองใช้งานบนคลาวด์</p>
                </div>
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${primaryButtonClass} text-center`}
                  >
                    <span>เข้าสู่ระบบจริง</span>
                    <OpenInNewIcon className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="text-caption text-secondary italic">ไม่ระบุ</span>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ส่วนแสดงความคิดเห็น/Feedback ที่ผ่านมา */}
      <section className={`${cardClass} p-8 space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-headline-md font-bold text-on-surface">
            ข้อเสนอแนะจากอาจารย์และศิษย์เก่า ({feedbacks.length})
          </h2>
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className="text-label-md text-primary-container font-semibold hover:underline"
          >
            + เขียนความคิดเห็น
          </button>
        </div>

        {feedbacks.length === 0 ? (
          <p className="text-body-md text-secondary py-4 text-center">
            ยังไม่มีข้อเสนอแนะสำหรับโครงงานนี้ อาจารย์และศิษย์เก่าสามารถร่วมประเมินได้
          </p>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-4 bg-surface rounded-xl border border-outline-variant/30 text-body-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-on-surface text-label-md">
                    {fb.authorName} ({fb.authorRole})
                  </span>
                  <span className="text-amber-500 font-semibold">
                    {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                  </span>
                </div>
                <p className="text-on-surface-variant leading-[1.6]">{fb.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* แบบฟอร์มแสดงความสนใจ/ติดต่อร่วมงาน (Recruitment Contact) */}
      <section className={`${cardClass} p-8 space-y-4`}>
        <div>
          <h2 className="font-display text-headline-md font-bold text-on-surface">
            แสดงความสนใจผลงาน / ติดต่อนักศึกษาผู้พัฒนา
          </h2>
          <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
            สำหรับสถานประกอบการหรือศิษย์เก่าที่สนใจผลงาน ทาบทามฝึกงาน หรือเสนอโอกาสร่วมงาน
          </p>
        </div>

        {contactSuccess && (
          <div className="p-4 bg-success/10 text-emerald-700 border border-success/20 rounded-lg text-body-md font-medium flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-success shrink-0" />
            <span>ส่งข้อความแสดงความสนใจถึงนักศึกษาเรียบร้อยแล้ว</span>
          </div>
        )}

        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="block text-label-md font-semibold text-on-surface mb-1">
                ชื่อผู้ติดต่อ / หน่วยงาน *
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="เช่น บริษัท เทคโนโลยี จำกัด หรือ ชื่อศิษย์เก่า"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-label-md font-semibold text-on-surface mb-1">
                อีเมลติดต่อกลับ *
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="contact@company.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-msg" className="block text-label-md font-semibold text-on-surface mb-1">
              ข้อความรายละเอียด *
            </label>
            <textarea
              id="contact-msg"
              rows={3}
              required
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              placeholder="ระบุข้อความ เช่น สนใจนำผลงานไปต่อยอด หรือสนใจนัดสัมภาษณ์เพื่อรับเข้าฝึกงาน..."
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={primaryButtonClass}
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
        }}
      />
    </div>
  );
}