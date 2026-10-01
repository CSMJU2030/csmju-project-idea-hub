'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '../types/domain';
import { updateProjectAction, deleteProjectAction } from '../actions/project.actions';

interface ProjectEditFormProps {
  project: Project;
}

const CATEGORIES = [
  'Web Application',
  'Mobile Application',
  'AI / Machine Learning',
  'Data Science & Analytics',
  'IoT & Embedded Systems',
  'Game & Multimedia',
  'Cybersecurity & Network',
];

export function ProjectEditForm({ project }: ProjectEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    titleTh: project.titleTh,
    titleEn: project.titleEn,
    abstract: project.abstract,
    category: project.category,
    academicYear: project.academicYear,
    techStackText: project.techStack.join(', '),
    githubUrl: project.githubUrl || '',
    demoUrl: project.demoUrl || '',
    reportPdfUrl: project.reportPdfUrl || '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const techStack = form.techStackText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    startTransition(async () => {
      const res = await updateProjectAction({
        id: project.id,
        titleTh: form.titleTh,
        titleEn: form.titleEn,
        abstract: form.abstract,
        category: form.category,
        academicYear: Number(form.academicYear),
        techStack,
        githubUrl: form.githubUrl.trim() || undefined,
        demoUrl: form.demoUrl.trim() || undefined,
        reportPdfUrl: form.reportPdfUrl.trim() || undefined,
      });

      if (!res.success) {
        if (res.errors) setFieldErrors(res.errors);
        setGeneralError(res.message);
      } else {
        setSuccessMessage('บันทึกการแก้ไขเรียบร้อยแล้ว');
        setTimeout(() => {
          router.push(`/showcase/${project.id}`);
        }, 1500);
      }
    });
  };

  const handleDelete = () => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโครงงานนี้? ข้อมูลทั้งหมดจะถูกลบและไม่สามารถกู้คืนได้')) {
      return;
    }

    startTransition(async () => {
      const res = await deleteProjectAction(project.id);
      if (!res.success) {
        setGeneralError(res.message);
      } else {
        setSuccessMessage('ลบโครงงานเรียบร้อยแล้ว กำลังนำท่านกลับสู่หน้ารายการผลงาน...');
        setTimeout(() => {
          router.push('/showcase');
        }, 1500);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-csmju-text-body" noValidate>
      {generalError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-medium flex items-center gap-2"
        >
          <span>⚠️</span>
          <span>{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium flex items-center gap-2"
        >
          <span>✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* แจ้งเตือนเหตุผลกรณีถูกส่งกลับแก้ไข */}
      {project.status === 'REJECTED' && project.rejectionReason && (
        <div className="p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 text-sm space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <span>📝</span> ข้อเสนอแนะที่ต้องปรับปรุงจากอาจารย์ที่ปรึกษา:
          </p>
          <p className="text-sm bg-white p-3 rounded-lg border border-amber-200 text-slate-700">
            {project.rejectionReason}
          </p>
        </div>
      )}

      <fieldset className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <legend className="text-base font-bold text-csmju-primary px-2">ข้อมูลโครงงาน</legend>

        <div>
          <label htmlFor="titleTh" className="block text-sm font-semibold mb-1">
            ชื่อโครงงาน (ภาษาไทย) <span className="text-red-500">*</span>
          </label>
          <input
            id="titleTh"
            type="text"
            required
            value={form.titleTh}
            onChange={(e) => setForm({ ...form, titleTh: e.target.value })}
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
          />
          {fieldErrors.titleTh && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.titleTh[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="titleEn" className="block text-sm font-semibold mb-1">
            ชื่อโครงงาน (ภาษาอังกฤษ) <span className="text-red-500">*</span>
          </label>
          <input
            id="titleEn"
            type="text"
            required
            value={form.titleEn}
            onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
          />
          {fieldErrors.titleEn && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.titleEn[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-semibold mb-1">
              หมวดหมู่ผลงาน <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="academicYear" className="block text-sm font-semibold mb-1">
              ปีการศึกษา (พ.ศ.) <span className="text-red-500">*</span>
            </label>
            <input
              id="academicYear"
              type="number"
              required
              value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: Number(e.target.value) })}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
            {fieldErrors.academicYear && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.academicYear[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="techStackText" className="block text-sm font-semibold mb-1">
            เทคโนโลยีที่ใช้งาน (Tech Stack)
          </label>
          <input
            id="techStackText"
            type="text"
            value={form.techStackText}
            onChange={(e) => setForm({ ...form, techStackText: e.target.value })}
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
          />
        </div>

        <div>
          <label htmlFor="abstract" className="block text-sm font-semibold mb-1">
            บทคัดย่อ <span className="text-red-500">*</span>
          </label>
          <textarea
            id="abstract"
            rows={5}
            required
            value={form.abstract}
            onChange={(e) => setForm({ ...form, abstract: e.target.value })}
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary leading-[1.6]"
          />
          {fieldErrors.abstract && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.abstract[0]}</p>
          )}
        </div>
      </fieldset>

      <fieldset className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <legend className="text-base font-bold text-csmju-primary px-2">ลิงก์ภายนอก</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-semibold mb-1">
              GitHub Repository URL
            </label>
            <input
              id="githubUrl"
              type="url"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
          </div>

          <div>
            <label htmlFor="demoUrl" className="block text-sm font-semibold mb-1">
              Live Demo URL
            </label>
            <input
              id="demoUrl"
              type="url"
              value={form.demoUrl}
              onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="reportPdfUrl" className="block text-sm font-semibold mb-1">
              ลิงก์ไฟล์เล่มรายงาน (PDF Document URL)
            </label>
            <input
              id="reportPdfUrl"
              type="url"
              value={form.reportPdfUrl}
              onChange={(e) => setForm({ ...form, reportPdfUrl: e.target.value })}
              placeholder="https://example.com/reports/final-project.pdf"
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          🗑️ ลบโครงงานนี้
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-csmju-primary text-white text-sm font-semibold rounded-xl hover:bg-csmju-primary-hover focus:outline-none focus:ring-2 focus:ring-csmju-primary focus:ring-offset-2 disabled:opacity-50 transition shadow-xs"
          >
            {isPending ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการเปลี่ยนแปลง'}
          </button>
        </div>
      </div>
    </form>
  );
}