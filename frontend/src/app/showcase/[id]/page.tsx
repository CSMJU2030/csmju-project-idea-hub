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
  abstract: 'ระบบจัดการและจัดแสดงผลงานวิทยานิพนธ์และไอเดียเทคโนโลยีสำหรับนักศึกษา พร้อมระบบประเมินผลงานจากศิษย์เก่าและคณาจารย์',
  academicYear: 2568,
  category: 'Web Application',
  tags: ['Next.js', 'TypeScript', 'TailwindCSS'],
  techStack: ['Next.js', 'PostgreSQL', 'TailwindCSS v4'],
  members: [{ studentId: 'user-std-001', name: 'สมชาย นักศึกษา', isOwner: true }],
  advisors: [{ advisorId: 'adv-001', name: 'ผศ.ดร. ที่ปรึกษา ใจดี' }],
  status: 'APPROVED',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = (params?.id as string) || 'proj-001';

  const [project] = useState<Project>(() => ({
    ...initialMockProject,
    id: projectId,
  }));
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
        </header>

        {/* รายละเอียดผลงาน */}
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

        {/* ลิงก์และเอกสารเผยแพร่ */}
        {(project.githubUrl || project.demoUrl || project.reportPdfUrl) && (
          <section className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="text-sm font-bold text-csmju-primary mb-3">ลิงก์และเอกสารเผยแพร่</h2>
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
                >
                  <span>📂</span> GitHub Repository
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl transition"
                >
                  <span>🚀</span> Live Demo
                </a>
              )}
              {project.reportPdfUrl && (
                <a
                  href={project.reportPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold rounded-xl transition"
                >
                  <span>📄</span> เล่มรายงานฉบับสมบูรณ์ (PDF)
                </a>
              )}
            </div>
          </section>
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