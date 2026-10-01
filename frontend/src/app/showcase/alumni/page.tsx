'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { proposeIdeaAction } from '../../../modules/showcase/actions/idea.actions';

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
    <main className="min-h-screen bg-csmju-surface-muted py-10 px-4 sm:px-6 lg:px-8 text-csmju-text-body">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/showcase" className="text-sm font-semibold text-csmju-primary hover:underline">
            ← กลับไปหน้ารายการผลงาน
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-csmju-primary mt-2">
            Alumni Collaboration Hub (พื้นที่ความร่วมมือศิษย์เก่า)
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-[1.6]">
            ร่วมสนับสนุนรุ่นน้องสาขาวิทยาการคอมพิวเตอร์ผ่านการเสนอโจทย์ปัญหาจริงจากภาคอุตสาหกรรม หรือร่วมประเมินผลงานวิทยานิพนธ์
          </p>
        </div>

        {/* กล่องเมนูกิจกรรม 2 ฝั่ง */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* การ์ดที่ 1: เสนอไอเดีย / โจทย์ภาคธุรกิจ */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">💡</div>
              <h2 className="text-lg font-bold text-csmju-primary">เสนอโจทย์โครงงาน (Idea Bank)</h2>
              <p className="text-xs text-slate-500 mt-1 leading-[1.6]">
                มี Use Case หรือโจทย์ปัญหาจากองค์กรที่ต้องการให้นักศึกษาทำเป็นวิทยานิพนธ์หรือไม่? ส่งหัวข้อเข้ามาเพื่อให้รุ่นน้องนำไปต่อยอดได้
              </p>
            </div>
            <a
              href="#propose-form"
              className="mt-4 inline-block text-center py-2 px-4 bg-csmju-primary-soft text-csmju-primary text-xs font-bold rounded-xl hover:bg-csmju-primary-soft-hover transition"
            >
              กรอกแบบฟอร์มเสนอไอเดีย ↓
            </a>
          </section>

          {/* การ์ดที่ 2: ให้คะแนนและข้อเสนอแนะโครงงาน */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">⭐</div>
              <h2 className="text-lg font-bold text-csmju-primary">ประเมินผลงานรุ่นน้อง (Feedback)</h2>
              <p className="text-xs text-slate-500 mt-1 leading-[1.6]">
                ร่วมเป็นหนึ่งในผู้ทรงคุณวุฒิภาคอุตสาหกรรม ให้คะแนน 1-5 ดาว พร้อมข้อคิดเห็นทางเทคนิคในหน้ารายละเอียดของแต่ละโครงงาน
              </p>
            </div>
            <Link
              href="/showcase"
              className="mt-4 inline-block text-center py-2 px-4 bg-csmju-primary text-white text-xs font-bold rounded-xl hover:bg-csmju-primary-hover transition"
            >
              ไปเลือกดูโครงงานเพื่อประเมิน →
            </Link>
          </section>
        </div>

        {/* แบบฟอร์มเสนอหัวข้อโครงงาน */}
        <section id="propose-form" className="bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
          <h2 className="text-lg font-bold text-csmju-primary">แบบฟอร์มเสนอหัวข้อโครงงานจากภาคอุตสาหกรรม</h2>

          {message && (
            <div
              className={`p-4 rounded-xl text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmitIdea} className="space-y-4">
            <div>
              <label htmlFor="idea-title" className="block text-sm font-semibold mb-1">
                หัวข้อโจทย์ / ปัญหาที่ต้องการให้ศึกษา *
              </label>
              <input
                id="idea-title"
                type="text"
                required
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="เช่น การประยุกต์ใช้ LLM ตรวจสอบเอกสารสัญญาทางธุรกิจ"
                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-csmju-primary outline-none"
              />
            </div>

            <div>
              <label htmlFor="idea-tags" className="block text-sm font-semibold mb-1">
                ทักษะหรือเทคโนโลยีที่แนะนำ (คั่นด้วยจุลภาค ,)
              </label>
              <input
                id="idea-tags"
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Python, LangChain, React"
                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-csmju-primary outline-none"
              />
            </div>

            <div>
              <label htmlFor="idea-desc" className="block text-sm font-semibold mb-1">
                รายละเอียดโจทย์ ความคาดหวัง และผลลัพธ์ที่ต้องการ *
              </label>
              <textarea
                id="idea-desc"
                rows={4}
                required
                value={ideaDescription}
                onChange={(e) => setIdeaDescription(e.target.value)}
                placeholder="อธิบายบริบทของปัญหา กลุ่มผู้ใช้เป้าหมาย และแนวทางที่ต้องการให้นักศึกษาพัฒนา..."
                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-csmju-primary outline-none leading-[1.6]"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-csmju-primary text-white text-sm font-semibold rounded-xl hover:bg-csmju-primary-hover transition disabled:opacity-50"
            >
              {isPending ? 'กำลังส่งข้อมูล...' : 'ส่งโจทย์เข้าสู่ Idea Bank'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}