import { Project, UserContext } from '../types/domain';

export function canEditProject(user: UserContext | null, project: Project): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;

  return project.members.some(
    (member) => member.studentId === user.id && member.isOwner
  );
}

export function canReviewProject(user: UserContext | null, project: Project): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  if (user.role !== 'TEACHER') return false;

  return project.advisors.some((adv) => adv.advisorId === user.id);
}

export function canDeleteProject(user: UserContext | null, project: Project): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;

  return project.members.some(
    (member) => member.studentId === user.id && member.isOwner
  );
}