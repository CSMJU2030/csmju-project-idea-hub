'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProjectAction, checkTitleDuplicateAction } from '../actions/project.actions';
import { DuplicateCheckResult } from '../utils/anti-duplicate';

import { cardClass, primaryButtonClass, secondaryButtonClass, inputClass } from './ui';
import { CheckIcon, CloseIcon } from './icons';

import { UserContext } from '../types/domain';

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
  proposalUrl: string;
  progressReportUrl: string;
  fullThesisPdfUrl: string;
  posterImageUrl: string;
  demoVideoUrl: string;
  chapter1: string;
  chapter2: string;
  chapter3: string;
  chapter4: string;
  chapter5: string;
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

const ADVISOR_PRESETS = [
  { id: '6184827b-0b67-4454-9984-e33a202f57cc', name: 'csmju.lecturer (อาจารย์ผู้ทดสอบระบบ - Core Hub)' },
  { id: 'adv-001', name: 'ผศ.ดร. ที่ปรึกษา ใจดี' },
  { id: 'adv-002', name: 'รศ.ดร. นวัตกรรม ก้าวหน้า' },
  { id: 'adv-003', name: 'อ.ดร. เทคโนโลยี อัจฉริยะ' },
];

interface ProjectFormProps {
  user?: UserContext | null;
}

export function ProjectForm({ user }: ProjectFormProps = {}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isTeacher = user?.role === 'TEACHER';
  const defaultAdvisorId = isTeacher
    ? user.id
    : '6184827b-0b67-4454-9984-e33a202f57cc';
  const defaultAdvisorName = isTeacher
    ? (user.name ? `${user.name} (ฉันเอง)` : 'csmju.lecturer (ฉันเอง)')
    : 'csmju.lecturer (อาจารย์ผู้ทดสอบระบบ - Core Hub)';

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
    proposalUrl: '',
    progressReportUrl: '',
    fullThesisPdfUrl: '',
    posterImageUrl: '',
    demoVideoUrl: '',
    chapter1: '',
    chapter2: '',
    chapter3: '',
    chapter4: '',
    chapter5: '',
    memberId: user?.id || 'user-std-001',
    memberName: user?.name || 'สมชาย นักศึกษา',
    advisorId: defaultAdvisorId,
    advisorName: defaultAdvisorName,
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

    const chaptersSummary = {
      chapter1: form.chapter1.trim() || undefined,
      chapter2: form.chapter2.trim() || undefined,
      chapter3: form.chapter3.trim() || undefined,
      chapter4: form.chapter4.trim() || undefined,
      chapter5: form.chapter5.trim() || undefined,
    };

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
        reportPdfUrl: form.fullThesisPdfUrl.trim() || form.reportPdfUrl.trim() || undefined,
        proposalUrl: form.proposalUrl.trim() || undefined,
        progressReportUrl: form.progressReportUrl.trim() || undefined,
        fullThesisPdfUrl: form.fullThesisPdfUrl.trim() || form.reportPdfUrl.trim() || undefined,
        posterImageUrl: form.posterImageUrl.trim() || undefined,
        demoVideoUrl: form.demoVideoUrl.trim() || undefined,
        chaptersSummary,
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

      {duplicateWarning && (
        <div
          role="region"
          aria-live="polite"
          className="p-4 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 text-body-md space-y-1"
        >
          <p className="font-bold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> ระบบตรวจพบหัวข้อที่มีความคล้ายคลึงกัน ({duplicateWarning.score}%)
          </p>
          <p className="text-label-sm text-amber-700">
            ผลงานใกล้เคียง: <strong>{duplicateWarning.matchedTitle}</strong>
          </p>
          <p className="text-label-sm text-amber-600">
            กรุณาตรวจสอบว่าผลงานของคุณไม่มีขอบเขตและเนื้อหาซ้ำซ้อนกับงานเดิม
          </p>
        </div>
      )}

      {/* กลุ่มข้อมูลทั่วไป */}
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

      {/* กลุ่มโครงสร้างเอกสาร 5 บทมาตรฐานตามเกณฑ์สาขาวิทยาการคอมพิวเตอร์ */}
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
            placeholder="สรุปความเป็นมา วัตถุประสงค์ ขอบเขตของโครงงาน และแผนการดำเนินงาน..."
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
            placeholder="สรุปทฤษฎี เทคโนโลยีที่ใช้ และงานวิจัยที่นำมาอ้างอิงและเปรียบเทียบ..."
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
            placeholder="สรุปสถาปัตยกรรมระบบ แผนภาพ DFD, ER-Diagram, หรือขั้นตอนการออกแบบ..."
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
            placeholder="สรุปผลการพัฒนาระบบ ผลการทดสอบ Unit/Integration Test หรือการทดสอบกับผู้ใช้ (UAT)..."
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
            placeholder="สรุปผลตามวัตถุประสงค์ ปัญหาที่พบในการพัฒนา และข้อเสนอแนะสำหรับการต่อยอด..."
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary leading-[1.6]"
          />
        </div>
      </fieldset>

      {/* กลุ่มไฟล์และชิ้นงานส่งมอบ (Deliverables & Cloud Links) */}
      <fieldset className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <legend className="text-base font-bold text-csmju-primary px-2">
          3. ไฟล์และชิ้นงานส่งมอบ (Deliverables & Cloud Storage Links)
        </legend>
        <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            <strong>ข้อกำหนด PM:</strong> จัดเก็บไฟล์แบบ Cloud URLs ลิงก์ตรง (เช่น Google Drive, OneDrive, GitHub, YouTube) เพื่อประสิทธิภาพและความรวดเร็ว
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
              placeholder="https://github.com/CSMJU2030/my-project"
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
            {fieldErrors.githubUrl && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.githubUrl[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="demoUrl" className="block text-sm font-semibold mb-1">
              ระบบจริงที่ออนไลน์ (Live Demo URL)
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
        </div>
      </fieldset>

      {/* ข้อมูลสมาชิกและอาจารย์ที่ปรึกษา */}
      <fieldset className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <legend className="text-base font-bold text-csmju-primary px-2">4. ผู้จัดทำและอาจารย์ที่ปรึกษา</legend>

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
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="advisorName" className="block text-sm font-semibold">
                อาจารย์ที่ปรึกษา <span className="text-red-500">*</span>
              </label>
              {user?.role === 'TEACHER' && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      ...form,
                      advisorId: user.id,
                      advisorName: `${user.name || 'csmju.lecturer'} (ฉันเอง)`,
                    });
                  }}
                  className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-container/10 text-primary-container hover:bg-primary-container/20 transition-colors"
                >
                  + ระบุฉันเป็นอาจารย์ที่ปรึกษา
                </button>
              )}
            </div>
            <input
              id="advisorName"
              type="text"
              list="advisor-list"
              required
              value={form.advisorName}
              onChange={(e) => {
                const val = e.target.value;
                const match = ADVISOR_PRESETS.find((a) => a.name === val);
                setForm({
                  ...form,
                  advisorName: val,
                  advisorId: match ? match.id : form.advisorId || '6184827b-0b67-4454-9984-e33a202f57cc',
                });
              }}
              placeholder="เลือกหรือพิมพ์ชื่ออาจารย์ที่ปรึกษา..."
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-csmju-primary"
            />
            <datalist id="advisor-list">
              {ADVISOR_PRESETS.map((adv) => (
                <option key={adv.id} value={adv.name} />
              ))}
            </datalist>
            <p className="text-[11px] text-slate-500 mt-1">
              รหัสที่ปรึกษา (Core User ID): <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">{form.advisorId}</code>
            </p>
            {fieldErrors.advisors && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.advisors[0]}</p>
            )}
          </div>
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-3 pt-4">
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
          {isPending ? 'กำลังบันทึกข้อมูล...' : 'ส่งผลงานเพื่อรอการอนุมัติ'}
        </button>
      </div>
    </form>
  );
}