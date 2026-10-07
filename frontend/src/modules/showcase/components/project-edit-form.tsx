'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '../types/domain';
import { updateProjectAction, deleteProjectAction } from '../actions/project.actions';
import { cardClass, primaryButtonClass, secondaryButtonClass, dangerButtonClass } from './ui';
import { CheckIcon, CloseIcon, DeleteIcon } from './icons';

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
    proposalUrl: project.proposalUrl || '',
    progressReportUrl: project.progressReportUrl || '',
    fullThesisPdfUrl: project.fullThesisPdfUrl || project.reportPdfUrl || '',
    posterImageUrl: project.posterImageUrl || '',
    demoVideoUrl: project.demoVideoUrl || '',
    chapter1: project.chaptersSummary?.chapter1 || '',
    chapter2: project.chaptersSummary?.chapter2 || '',
    chapter3: project.chaptersSummary?.chapter3 || '',
    chapter4: project.chaptersSummary?.chapter4 || '',
    chapter5: project.chaptersSummary?.chapter5 || '',
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

    const chaptersSummary = {
      chapter1: form.chapter1.trim() || undefined,
      chapter2: form.chapter2.trim() || undefined,
      chapter3: form.chapter3.trim() || undefined,
      chapter4: form.chapter4.trim() || undefined,
      chapter5: form.chapter5.trim() || undefined,
    };

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
        reportPdfUrl: form.fullThesisPdfUrl.trim() || form.reportPdfUrl.trim() || undefined,
        proposalUrl: form.proposalUrl.trim() || undefined,
        progressReportUrl: form.progressReportUrl.trim() || undefined,
        fullThesisPdfUrl: form.fullThesisPdfUrl.trim() || form.reportPdfUrl.trim() || undefined,
        posterImageUrl: form.posterImageUrl.trim() || undefined,
        demoVideoUrl: form.demoVideoUrl.trim() || undefined,
        chaptersSummary,
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
    <form onSubmit={handleSubmit} className="space-y-6 text-on-surface" noValidate>
      {generalError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-error-container text-on-error-container border border-error/20 text-body-md font-medium flex items-center gap-2"
        >
          <CloseIcon className="h-5 w-5 text-error shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="p-4 rounded-xl bg-success/10 text-emerald-700 border border-success/20 text-body-md font-medium flex items-center gap-2"
        >
          <CheckIcon className="h-5 w-5 text-success shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. ข้อมูลทั่วไป */}
      <fieldset className={`${cardClass} p-6 space-y-4`}>
        <legend className="font-display text-headline-md font-bold text-on-surface px-2">1. ข้อมูลผลงานทั่วไป</legend>

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
              หมวดหมู่ <span className="text-red-500">*</span>
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
              min={2560}
              max={2580}
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

      {/* 2. โครงสร้างเอกสารปริญญานิพนธ์ 5 บท */}
      <fieldset className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <legend className="text-base font-bold text-csmju-primary px-2">
          2. โครงสร้างเอกสารปริญญานิพนธ์ 5 บท (Senior Project Chapters)
        </legend>
        <p className="text-xs text-slate-500 px-2">
          สรุปย่อของแต่ละบทช่วยให้ระบบสามารถค้นหา (Search) และให้ผู้สนใจหรือรุ่นน้องสืบค้นแนวทางได้อย่างรวดเร็ว
        </p>

        <div>
          <label htmlFor="chapter1" className="block text-sm font-semibold mb-1">
            บทที่ 1: บทนำ (Introduction)
          </label>
          <textarea
            id="chapter1"
            rows={2}
            value={form.chapter1}
            onChange={(e) => setForm({ ...form, chapter1: e.target.value })}
            placeholder="สรุปความเป็นมา วัตถุประสงค์ ขอบเขตของโครงงาน..."
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary leading-[1.6]"
          />
        </div>

        <div>
          <label htmlFor="chapter2" className="block text-sm font-semibold mb-1">
            บทที่ 2: ทฤษฎีและงานวิจัยที่เกี่ยวข้อง (Literature Review)
          </label>
          <textarea
            id="chapter2"
            rows={2}
            value={form.chapter2}
            onChange={(e) => setForm({ ...form, chapter2: e.target.value })}
            placeholder="สรุปทฤษฎี เทคโนโลยีที่ใช้ และงานวิจัยที่นำมาอ้างอิง..."
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary leading-[1.6]"
          />
        </div>

        <div>
          <label htmlFor="chapter3" className="block text-sm font-semibold mb-1">
            บทที่ 3: วิธีการดำเนินงานและการออกแบบระบบ (System Design & Methodology)
          </label>
          <textarea
            id="chapter3"
            rows={2}
            value={form.chapter3}
            onChange={(e) => setForm({ ...form, chapter3: e.target.value })}
            placeholder="สรุปสถาปัตยกรรมระบบ แผนภาพ DFD, ER-Diagram..."
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary leading-[1.6]"
          />
        </div>

        <div>
          <label htmlFor="chapter4" className="block text-sm font-semibold mb-1">
            บทที่ 4: ผลการดำเนินงานและการทดสอบระบบ (Implementation & Testing)
          </label>
          <textarea
            id="chapter4"
            rows={2}
            value={form.chapter4}
            onChange={(e) => setForm({ ...form, chapter4: e.target.value })}
            placeholder="สรุปผลการพัฒนาระบบ ผลการทดสอบ Unit/Integration Test หรือ UAT..."
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary leading-[1.6]"
          />
        </div>

        <div>
          <label htmlFor="chapter5" className="block text-sm font-semibold mb-1">
            บทที่ 5: สรุปผล อภิปรายผล และข้อเสนอแนะ (Conclusion & Discussion)
          </label>
          <textarea
            id="chapter5"
            rows={2}
            value={form.chapter5}
            onChange={(e) => setForm({ ...form, chapter5: e.target.value })}
            placeholder="สรุปผลตามวัตถุประสงค์ ปัญหาที่พบในการพัฒนา และข้อเสนอแนะ..."
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary leading-[1.6]"
          />
        </div>
      </fieldset>

      {/* 3. ไฟล์และชิ้นงานส่งมอบ (Deliverables) */}
      <fieldset className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <legend className="text-base font-bold text-csmju-primary px-2">
          3. ไฟล์และชิ้นงานส่งมอบ (Deliverables & Cloud Storage Links)
        </legend>
        <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            <strong>ข้อกำหนด PM:</strong> จัดเก็บไฟล์แบบ Cloud URLs ลิงก์ตรง (เช่น Google Drive, OneDrive, GitHub, YouTube)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="proposalUrl" className="block text-sm font-semibold mb-1">
              เอกสารข้อเสนอโครงงาน (Proposal PDF URL)
            </label>
            <input
              id="proposalUrl"
              type="url"
              value={form.proposalUrl}
              onChange={(e) => setForm({ ...form, proposalUrl: e.target.value })}
              placeholder="https://drive.google.com/.../proposal.pdf"
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
            {fieldErrors.proposalUrl && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.proposalUrl[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="progressReportUrl" className="block text-sm font-semibold mb-1">
              รายงานก้าวหน้า 3 บท (Progress Report PDF URL)
            </label>
            <input
              id="progressReportUrl"
              type="url"
              value={form.progressReportUrl}
              onChange={(e) => setForm({ ...form, progressReportUrl: e.target.value })}
              placeholder="https://drive.google.com/.../progress-3chapters.pdf"
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
            {fieldErrors.progressReportUrl && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.progressReportUrl[0]}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="fullThesisPdfUrl" className="block text-sm font-semibold mb-1">
              เล่มรายงานฉบับสมบูรณ์ 5 บท (Full Thesis PDF URL)
            </label>
            <input
              id="fullThesisPdfUrl"
              type="url"
              value={form.fullThesisPdfUrl}
              onChange={(e) => setForm({ ...form, fullThesisPdfUrl: e.target.value })}
              placeholder="https://drive.google.com/.../full-thesis.pdf"
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
            {fieldErrors.fullThesisPdfUrl && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.fullThesisPdfUrl[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="posterImageUrl" className="block text-sm font-semibold mb-1">
              ลิงก์รูปภาพโปสเตอร์ (Poster Image URL)
            </label>
            <input
              id="posterImageUrl"
              type="url"
              value={form.posterImageUrl}
              onChange={(e) => setForm({ ...form, posterImageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/... หรือ ลิงก์รูปภาพ"
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
            {fieldErrors.posterImageUrl && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.posterImageUrl[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="demoVideoUrl" className="block text-sm font-semibold mb-1">
              วิดีโอสาธิตระบบ (Demo Video URL - YouTube/Stream)
            </label>
            <input
              id="demoVideoUrl"
              type="url"
              value={form.demoVideoUrl}
              onChange={(e) => setForm({ ...form, demoVideoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
            {fieldErrors.demoVideoUrl && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.demoVideoUrl[0]}</p>
            )}
          </div>

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
        </div>
      </fieldset>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className={`${dangerButtonClass} flex items-center justify-center gap-2`}
        >
          <DeleteIcon className="h-4 w-4" />
          <span>ลบโครงงานนี้</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className={secondaryButtonClass}
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            disabled={isPending}
            className={primaryButtonClass}
          >
            {isPending ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการเปลี่ยนแปลง'}
          </button>
        </div>
      </div>
    </form>
  );
}