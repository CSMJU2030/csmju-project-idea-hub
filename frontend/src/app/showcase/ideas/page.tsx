import Link from 'next/link';
import { showcaseRepository } from '../../../modules/showcase/repositories/mock/showcase.mock-repository';

export default async function IdeaBankPage() {
  const ideas = await showcaseRepository.findIdeas();

  return (
    <main className="min-h-screen bg-csmju-surface-muted py-10 px-4 sm:px-6 lg:px-8 text-csmju-text-body">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/showcase" className="text-sm font-semibold text-csmju-primary hover:underline">
              ← กลับหน้ารายการผลงาน
            </Link>
            <h1 className="text-3xl font-extrabold text-csmju-primary mt-2">Idea Bank (คลังไอเดีย)</h1>
            <p className="text-sm text-slate-500 mt-1">พื้นที่ระดมไอเดียหัวข้อโปรเจกต์ที่น่าสนใจสำหรับนักศึกษา</p>
          </div>
        </div>

        {ideas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-500 text-sm">ยังไม่มีไอเดียในคลังขณะนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map((idea) => (
              <article key={idea.id} className="bg-white p-6 rounded-2xl border border-slate-200">
                <h2 className="text-lg font-bold text-csmju-primary">{idea.title}</h2>
                <p className="text-sm text-slate-600 mt-2 line-clamp-3">{idea.description}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                  <span>เสนอโดย: {idea.proposedBy.name}</span>
                  <span className="font-semibold text-emerald-600">{idea.status}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}