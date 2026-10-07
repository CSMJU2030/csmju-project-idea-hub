import Link from 'next/link';
import { showcaseRepository } from '../../../modules/showcase/repositories/mock/showcase.mock-repository';
import { cardClass } from '../../../modules/showcase/components/ui';
import { ArrowBackIcon } from '../../../modules/showcase/components/icons';

export default async function IdeaBankPage() {
  const ideas = await showcaseRepository.findIdeas();

  return (
    <div className="space-y-6 fade-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/showcase"
            className="inline-flex items-center gap-1.5 text-label-md font-semibold text-primary-container hover:underline"
          >
            <ArrowBackIcon className="h-4 w-4" />
            <span>กลับหน้ารายการผลงาน</span>
          </Link>
          <h1 className="font-display text-headline-lg font-bold text-on-surface mt-2">
            Idea Bank (คลังไอเดีย)
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1 leading-[1.6]">
            พื้นที่ระดมไอเดียหัวข้อโครงงานวิจัยและนวัตกรรมที่น่าสนใจสำหรับนักศึกษา
          </p>
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className={`${cardClass} border-dashed p-12 text-center`}>
          <p className="text-body-md text-on-surface-variant">ยังไม่มีไอเดียในคลังขณะนี้</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea) => (
            <article key={idea.id} className={`${cardClass} p-6 flex flex-col justify-between hover:shadow-md transition-shadow`}>
              <div>
                <h2 className="font-display text-headline-md font-bold text-on-surface">
                  {idea.title}
                </h2>
                <p className="text-body-md text-on-surface-variant mt-2 line-clamp-3 leading-[1.6]">
                  {idea.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/30 flex justify-between items-center text-label-sm text-secondary">
                <span>เสนอโดย: {idea.proposedBy.name}</span>
                <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-label-sm font-semibold text-emerald-700">
                  {idea.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}