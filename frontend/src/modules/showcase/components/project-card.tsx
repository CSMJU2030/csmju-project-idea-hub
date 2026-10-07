import Link from 'next/link';
import { Project } from '../types/domain';
import { cardClass } from './ui';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={`${cardClass} p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200 group`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-primary-container/10 px-3 py-1 text-label-sm font-semibold text-primary-container">
            {project.category}
          </span>
          <span className="text-label-sm text-secondary font-medium">
            ปีการศึกษา {project.academicYear}
          </span>
        </div>

        <h3 className="font-display text-lg font-bold text-on-surface group-hover:text-primary-container transition-colors line-clamp-1">
          {project.titleTh}
        </h3>
        <p className="text-body-md font-medium text-secondary mb-3 line-clamp-1">
          {project.titleEn}
        </p>

        <p className="text-body-md text-on-surface-variant line-clamp-3 leading-[1.6] mb-4">
          {project.abstract}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-label-sm px-2.5 py-0.5 bg-surface-container text-on-surface-variant rounded-md font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between mt-auto">
        <div className="text-label-sm text-secondary">
          ผู้พัฒนา: {project.members[0]?.name || 'ไม่ระบุ'}
        </div>
        <Link
          href={`/showcase/${project.id}`}
          className="text-label-md font-semibold text-primary-container hover:underline focus:outline-none focus:ring-1 focus:ring-primary-container rounded-md px-1"
        >
          ดูรายละเอียด →
        </Link>
      </div>
    </article>
  );
}