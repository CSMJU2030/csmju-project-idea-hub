'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProjectAction, checkTitleDuplicateAction } from '../actions/project.actions';
import { DuplicateCheckResult } from '../utils/anti-duplicate';

interface FormState {
  titleTh: string;
  titleEn: string;
  abstract: string;
  category: string;
  academicYear: number;
  techStackText: string;
  githubUrl: string;
  demoUrl: string;
  reportPdfUrl: string;
  memberId: string;
  memberName: string;
  advisorId: string;
  advisorName: string;
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

export function ProjectForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<FormState>({
    titleTh: '',
    titleEn: '',
    abstract: '',
    category: CATEGORIES[0],
    academicYear: 2568,
    techStackText: '',
    githubUrl: '',
    demoUrl: '',
    reportPdfUrl: '',
    memberId: 'user-std-001',
    memberName: 'สมชาย นักศึกษา',
    advisorId: 'adv-001',
    advisorName: 'ผศ.ดร. ที่ปรึกษา ใจดี',
  });

  const [duplicateWarning, setDuplicateWarning] = useState<DuplicateCheckResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ตรวจจับชื่อซ้ำเมื่อเลิกโฟกัสช่องกรอกชื่อ
  const handleCheckDuplicate = async (title: string) => {
    if (!title || title.trim().length < 4) {
      setDuplicateWarning(null);
      return;
    }
    const res = await checkTitleDuplicateAction(title);
    if (res.success && res.data && res.data.isDuplicate) {
      setDuplicateWarning(res.data);
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const techStack = form.techStackText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    startTransition(async () => {
      const res = await createProjectAction({
        titleTh: form.titleTh,
        titleEn: form.titleEn,
        abstract: form.abstract,
        category: form.category,
        academicYear: Number(form.academicYear),
        tags: [],
        techStack,
        githubUrl: form.githubUrl.trim() || undefined,
        demoUrl: form.demoUrl.trim() || undefined,
        reportPdfUrl: form.reportPdfUrl.trim() || undefined,
        members: [{ studentId: form.memberId, name: form.memberName }],
        advisors: [{ advisorId: form.advisorId, name: form.advisorName }],
      });

      if (!res.success) {
        if (res.errors) {
          setFieldErrors(res.errors);
        }
        setGeneralError(res.message);
      } else {
        setSuccessMessage('ส่งผลงานสำเร็จ! โครงงานเข้าสู่สถานะรอการตรวจสอบโดยอาจารย์ที่ปรึกษา');
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

      {duplicateWarning && (
        <div
          role="region"
          aria-live="polite"
          className="p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 text-sm space-y-1"
        >
          <p className="font-bold flex items-center gap-1.5">
            <span>⚠️</span> ระบบตรวจพบหัวข้อที่มีความคล้ายคลึงกัน ({duplicateWarning.score}%)
          </p>
          <p className="text-xs text-amber-700">
            ผลงานใกล้เคียง: <strong>{duplicateWarning.matchedTitle}</strong>
          </p>
          <p className="text-xs text-amber-600">
            กรุณาตรวจสอบว่าผลงานของคุณไม่มีขอบเขตและเนื้อหาซ้ำซ้อนกับงานเดิม
          </p>
        </div>
      )}

      {/* กลุ่มข้อมูลทั่วไป */}
      <fieldset className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <legend className="text-base font-bold text-csmju-primary px-2">ข้อมูลผลงานทั่วไป</legend>

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
            onBlur={(e) => handleCheckDuplicate(e.target.value)}
            placeholder="เช่น ระบบตรวจจับความผิดปกติของข้อมูลด้วย AI"
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
            onBlur={(e) => handleCheckDuplicate(e.target.value)}
            placeholder="e.g. AI-Based Anomaly Detection System"
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
            placeholder="พิมพ์คั่นด้วยจุลภาค เช่น Next.js, PostgreSQL, TailwindCSS, Docker"
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
          />
        </div>

        <div>
          <label htmlFor="abstract" className="block text-sm font-semibold mb-1">
            บทคัดย่อ / สรุปย่อของผลงาน <span className="text-red-500">*</span>
          </label>
          <textarea
            id="abstract"
            rows={4}
            required
            minLength={20}
            value={form.abstract}
            onChange={(e) => setForm({ ...form, abstract: e.target.value })}
            placeholder="อธิบายวัตถุประสงค์ ขอบเขต และผลลัพธ์ของโครงงาน (อย่างน้อย 20 ตัวอักษร)"
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary leading-[1.6]"
          />
          {fieldErrors.abstract && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.abstract[0]}</p>
          )}
        </div>
      </fieldset>

      {/* ลิงก์ผลงานภายนอก */}
      <fieldset className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <legend className="text-base font-bold text-csmju-primary px-2">ลิงก์ภายนอกและเอกสาร</legend>

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
              placeholder="https://github.com/csmju/my-project"
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
            {fieldErrors.githubUrl && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.githubUrl[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="demoUrl" className="block text-sm font-semibold mb-1">
              Live Demo หรือ Video Link
            </label>
            <input
              id="demoUrl"
              type="url"
              value={form.demoUrl}
              onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
              placeholder="https://my-demo-app.com"
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
            {fieldErrors.demoUrl && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.demoUrl[0]}</p>
            )}
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
            {fieldErrors.reportPdfUrl && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.reportPdfUrl[0]}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ข้อมูลสมาชิกและอาจารย์ที่ปรึกษา */}
      <fieldset className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <legend className="text-base font-bold text-csmju-primary px-2">ผู้จัดทำและอาจารย์ที่ปรึกษา</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="memberName" className="block text-sm font-semibold mb-1">
              ผู้ส่งผลงาน (เจ้าของผลงาน)
            </label>
            <input
              id="memberName"
              type="text"
              readOnly
              value={form.memberName}
              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 text-slate-500 rounded-lg cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="advisorName" className="block text-sm font-semibold mb-1">
              อาจารย์ที่ปรึกษา <span className="text-red-500">*</span>
            </label>
            <input
              id="advisorName"
              type="text"
              required
              value={form.advisorName}
              onChange={(e) => setForm({ ...form, advisorName: e.target.value })}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
            {fieldErrors.advisors && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.advisors[0]}</p>
            )}
          </div>
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-3 pt-2">
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
          {isPending ? 'กำลังบันทึกข้อมูล...' : 'ส่งผลงานเพื่อรอการอนุมัติ'}
        </button>
      </div>
    </form>
  );
}