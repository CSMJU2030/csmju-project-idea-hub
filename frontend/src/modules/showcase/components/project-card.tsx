import Link from 'next/link';
import { Project } from '../types/domain';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-csmju-primary-soft text-csmju-primary rounded-md">
            {project.category}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            ปีการศึกษา {project.academicYear}
          </span>
        </div>

        <h3 className="text-lg font-bold text-csmju-primary line-clamp-1">
          {project.titleTh}
        </h3>
        <p className="text-sm font-medium text-slate-600 mb-3 line-clamp-1">
          {project.titleEn}
        </p>

        <p className="text-sm text-csmju-text-body line-clamp-3 leading-[1.6] mb-4">
          {project.abstract}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="text-xs text-slate-500">
          ผู้พัฒนา: {project.members[0]?.name || 'ไม่ระบุ'}
        </div>
        <Link
          href={`/showcase/${project.id}`}
          className="text-sm font-semibold text-csmju-primary hover:underline focus:outline-none focus:ring-2 focus:ring-csmju-primary rounded-md px-1"
        >
          ดูรายละเอียด →
        </Link>
      </div>
    </article>
  );
}