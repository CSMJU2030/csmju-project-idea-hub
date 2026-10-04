export type ProjectStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
export type IdeaStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';

export interface UserContext {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ALUMNI' | 'ADMIN';
}

export interface ProjectMember {
  studentId: string;
  name: string;
  isOwner: boolean;
}

export interface ProjectAdvisor {
  advisorId: string;
  name: string;
}

export interface ChapterSummaries {
  chapter1?: string; // บทที่ 1: บทนำ (Introduction, วัตถุประสงค์, ขอบเขต)
  chapter2?: string; // บทที่ 2: ทฤษฎีและงานวิจัยที่เกี่ยวข้อง (Literature Review)
  chapter3?: string; // บทที่ 3: วิธีการดำเนินงานและการออกแบบระบบ (System Design & Methodology)
  chapter4?: string; // บทที่ 4: ผลการดำเนินงานและการทดสอบระบบ (Implementation & Testing)
  chapter5?: string; // บทที่ 5: สรุปผล อภิปรายผล และข้อเสนอแนะ (Conclusion & Discussion)
}

export interface Project {
  id: string;
  titleTh: string;
  titleEn: string;
  abstract: string;
  academicYear: number; // ปี พ.ศ. เช่น 2568
  category: string;
  tags: string[];
  techStack: string[];
  members: ProjectMember[];
  advisors: ProjectAdvisor[];
  githubUrl?: string;
  demoUrl?: string;
  reportPdfUrl?: string;
  proposalUrl?: string;
  progressReportUrl?: string;
  fullThesisPdfUrl?: string;
  posterImageUrl?: string;
  demoVideoUrl?: string;
  chaptersSummary?: ChapterSummaries;
  status: ProjectStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  proposedBy: {
    coreUserId: string;
    name: string;
    role: UserContext['role'];
  };
  tags: string[];
  status: IdeaStatus;
  createdAt: Date;
}

export interface ProjectFeedback {
  id: string;
  projectId: string;
  authorId: string;
  authorName: string;
  authorRole: 'TEACHER' | 'ALUMNI';
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}
export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface CreateProjectInput {
  titleTh: string;
  titleEn: string;
  abstract: string;
  academicYear: number;
  category: string;
  tags: string[];
  techStack: string[];
  members: { studentId: string; name: string }[];
  advisors: { advisorId: string; name: string }[];
  githubUrl?: string;
  demoUrl?: string;
  reportPdfUrl?: string;
  proposalUrl?: string;
  progressReportUrl?: string;
  fullThesisPdfUrl?: string;
  posterImageUrl?: string;
  demoVideoUrl?: string;
  chaptersSummary?: ChapterSummaries;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string;
}

export interface DashboardStats {
  totalProjects: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  topTechStacks: { name: string; count: number; percentage: number }[];
  categoryDistribution: { category: string; count: number }[];
}