'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { proposeIdeaAction } from '../../../modules/showcase/actions/idea.actions';
import { cardClass, inputClass, primaryButtonClass, secondaryButtonClass } from '../../../modules/showcase/components/ui';
import { ArrowBackIcon, CheckIcon, CloseIcon, DashboardIcon } from '../../../modules/showcase/components/icons';

export default function AlumniHubPage() {
  const [isPending, startTransition] = useTransition();
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean);

    startTransition(async () => {
      const res = await proposeIdeaAction({
        title: ideaTitle,
        description: ideaDescription,
        tags,
      });

      if (!res.success) {
        setMessage({ type: 'error', text: res.message });
      } else {
        setMessage({ type: 'success', text: 'เสนอไอเดียโครงงานสำเร็จ! ข้อเสนอจะปรากฏใน Idea Bank ให้นักศึกษาเลือกทำ' });
        setIdeaTitle('');
        setIdeaDescription('');
        setTagsText('');
      }
    });
  };

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 text-label-md font-semibold text-primary-container hover:underline"
        >
          <ArrowBackIcon className="h-4 w-4" />
          <span>กลับไปหน้ารายการผลงาน</span>
        </Link>
        <h1 className="font-display text-headline-lg font-bold text-on-surface mt-2">
          Alumni Collaboration Hub (พื้นที่ความร่วมมือศิษย์เก่า)
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
          ร่วมสนับสนุนรุ่นน้องสาขาวิทยาการคอมพิวเตอร์ผ่านการเสนอโจทย์ปัญหาจริงจากภาคอุตสาหกรรม หรือร่วมประเมินผลงานวิทยานิพนธ์
        </p>
      </div>

      {/* กล่องเมนูกิจกรรม 2 ฝั่ง */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* การ์ดที่ 1: เสนอไอเดีย / โจทย์ภาคธุรกิจ */}
        <section className={`${cardClass} p-6 flex flex-col justify-between hover:shadow-md transition-shadow`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-lg bg-primary-container/10 text-primary-container">
                <DashboardIcon className="h-5 w-5" />
              </span>
              <h2 className="font-display text-headline-md font-bold text-on-surface">
                เสนอโจทย์โครงงาน (Idea Bank)
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
              มีโจทย์ปัญหาจากองค์กรหรือภาคธุรกิจที่ต้องการให้นักศึกษาทำเป็นวิทยานิพนธ์หรือไม่? ส่งหัวข้อเข้ามาเพื่อให้รุ่นน้องนำไปต่อยอดได้
            </p>
          </div>
          <a
            href="#propose-form"
            className={`${secondaryButtonClass} mt-6 text-center`}
          >
            กรอกแบบฟอร์มเสนอไอเดีย ↓
          </a>
        </section>

        {/* การ์ดที่ 2: ให้คะแนนและข้อเสนอแนะโครงงาน */}
        <section className={`${cardClass} p-6 flex flex-col justify-between hover:shadow-md transition-shadow`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-lg bg-primary-container/10 text-primary-container">
                <CheckIcon className="h-5 w-5" />
              </span>
              <h2 className="font-display text-headline-md font-bold text-on-surface">
                ประเมินผลงานรุ่นน้อง (Feedback)
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
              ร่วมเป็นหนึ่งในผู้ทรงคุณวุฒิภาคอุตสาหกรรม ให้คะแนนความพึงพอใจ พร้อมข้อคิดเห็นทางเทคนิคในหน้ารายละเอียดของแต่ละโครงงาน
            </p>
          </div>
          <Link
            href="/showcase"
            className={`${primaryButtonClass} mt-6 text-center`}
          >
            ไปเลือกดูโครงงานเพื่อประเมิน →
          </Link>
        </section>
      </div>

      {/* แบบฟอร์มเสนอหัวข้อโครงงาน */}
      <section id="propose-form" className={`${cardClass} p-8 space-y-4`}>
        <h2 className="font-display text-headline-md font-bold text-on-surface">
          แบบฟอร์มเสนอหัวข้อโครงงานจากภาคอุตสาหกรรม
        </h2>

        {message && (
          <div
            className={`p-4 rounded-xl text-body-md font-medium border flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-success/10 text-emerald-700 border-success/20'
                : 'bg-error-container text-on-error-container border-error/20'
            }`}
          >
            {message.type === 'success' ? (
              <CheckIcon className="h-5 w-5 text-success shrink-0" />
            ) : (
              <CloseIcon className="h-5 w-5 text-error shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmitIdea} className="space-y-4">
          <div>
            <label htmlFor="idea-title" className="block text-label-md font-semibold text-on-surface mb-1">
              หัวข้อโจทย์ / ปัญหาที่ต้องการให้ศึกษา *
            </label>
            <input
              id="idea-title"
              type="text"
              required
              value={ideaTitle}
              onChange={(e) => setIdeaTitle(e.target.value)}
              placeholder="เช่น การประยุกต์ใช้ LLM ตรวจสอบเอกสารสัญญาทางธุรกิจ"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="idea-tags" className="block text-label-md font-semibold text-on-surface mb-1">
              ทักษะหรือเทคโนโลยีที่แนะนำ (คั่นด้วยจุลภาค ,)
            </label>
            <input
              id="idea-tags"
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="Python, LangChain, React"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="idea-desc" className="block text-label-md font-semibold text-on-surface mb-1">
              รายละเอียดโจทย์ ความคาดหวัง และผลลัพธ์ที่ต้องการ *
            </label>
            <textarea
              id="idea-desc"
              rows={4}
              required
              value={ideaDescription}
              onChange={(e) => setIdeaDescription(e.target.value)}
              placeholder="อธิบายบริบทของปัญหา กลุ่มผู้ใช้เป้าหมาย และแนวทางที่ต้องการให้นักศึกษาพัฒนา..."
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={primaryButtonClass}
          >
            {isPending ? 'กำลังส่งข้อมูล...' : 'ส่งโจทย์เข้าสู่ Idea Bank'}
          </button>
        </form>
      </section>
    </div>
  );
}