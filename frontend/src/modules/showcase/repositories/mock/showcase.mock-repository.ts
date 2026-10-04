import { IShowcaseRepository } from '../showcase.repository.interface';
import { Project, ProjectFeedback, ProjectIdea, ProjectStatus } from '../../types/domain';

const mockProjects: Project[] = [
  {
    id: 'proj-001',
    titleTh: 'ระบบคลังโปรเจกต์และไอเดีย CSMJU',
    titleEn: 'CSMJU Project Showcase Hub',
    abstract: 'ระบบจัดการและจัดแสดงผลงานวิทยานิพนธ์และไอเดียเทคโนโลยีสำหรับนักศึกษา พร้อมระบบเชื่อมต่อสถาปัตยกรรมกลาง CSMJU2030 และประเมินผลงานจากอาจารย์และศิษย์เก่า',
    academicYear: 2568,
    category: 'Web Application',
    tags: ['Next.js', 'TypeScript', 'TailwindCSS', 'Central SSO'],
    techStack: ['Next.js', 'NestJS', 'PostgreSQL', 'TailwindCSS v4', 'Prisma'],
    members: [{ studentId: 'user-std-001', name: 'สมชาย นักศึกษา', isOwner: true }],
    advisors: [{ advisorId: 'adv-001', name: 'ผศ.ดร. ที่ปรึกษา ใจดี' }],
    githubUrl: 'https://github.com/CSMJU2030/csmju-project-idea-hub',
    demoUrl: 'https://showcase.csmju2030.local',
    reportPdfUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-001/full-thesis.pdf',
    proposalUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-001/proposal.pdf',
    progressReportUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-001/progress-3chapters.pdf',
    fullThesisPdfUrl: 'https://storage.googleapis.com/csmju-theses/2568/proj-001/full-thesis.pdf',
    posterImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
    demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    chaptersSummary: {
      chapter1: 'บทที่ 1 บทนำ: ศึกษาปัญหาการจัดเก็บผลงานโครงงานพิเศษของสาขาวิทยาการคอมพิวเตอร์ที่ยังกระจัดกระจาย ขาดระบบสืบค้นผลงานของรุ่นพี่ กำหนดวัตถุประสงค์เพื่อพัฒนาระบบคลังผลงานกลางที่เชื่อมโยงกับแพลตฟอร์ม CSMJU2030',
      chapter2: 'บทที่ 2 ทฤษฎีและงานวิจัยที่เกี่ยวข้อง: ศึกษาทฤษฎี Microservices, Single Sign-On (RS256 JWKS), RBAC, Design System Tokens, และการเปรียบเทียบระบบคลังผลงานวิทยานิพนธ์ของสถาบันอื่น',
      chapter3: 'บทที่ 3 วิธีการดำเนินงานและการออกแบบระบบ: ออกแบบ System Architecture แบบ 1 Subsystem = 1 DB = 1 Repo, ออกแบบ DFD Level 0-2, Database ERD (Prisma snake_case), และ Wireframes ตาม CSMJU UI Tokens',
      chapter4: 'บทที่ 4 ผลการดำเนินงานและการทดสอบระบบ: พัฒนาเว็บแอปพลิเคชัน Next.js App Router และ NestJS API, ทดสอบ SSO Integration T1-T9, Unit Test 61 ข้อผ่าน 100%, และการทดสอบ UAT จากกลุ่มตัวอย่างอาจารย์และนักศึกษา',
      chapter5: 'บทที่ 5 สรุปผล อภิปรายผล และข้อเสนอแนะ: ระบบสามารถทำงานได้ตามวัตถุประสงค์ รองรับการสืบค้นโครงงานและให้ Feedback จากศิษย์เก่า ข้อเสนอแนะในอนาคตคือการเชื่อมต่อ AI Semantic Search และการส่งออกเล่มรายงานอัตโนมัติ',
    },
    status: 'APPROVED',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockFeedbacks: ProjectFeedback[] = [];
const mockIdeas: ProjectIdea[] = [];

export class ShowcaseMockRepository implements IShowcaseRepository {
  async findProjects(filter?: { status?: ProjectStatus; keyword?: string; year?: number }): Promise<Project[]> {
    return mockProjects.filter((p) => {
      if (filter?.status && p.status !== filter.status) return false;
      if (filter?.year && p.academicYear !== filter.year) return false;
      if (filter?.keyword) {
        const q = filter.keyword.toLowerCase();
        const matchTitle = p.titleTh.toLowerCase().includes(q) || p.titleEn.toLowerCase().includes(q);
        const matchTech = p.techStack.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchTech) return false;
      }
      return true;
    });
  }

  async findProjectById(id: string): Promise<Project | null> {
    return mockProjects.find((p) => p.id === id) || null;
  }

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const newProject: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockProjects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('ไม่พบข้อมูลโปรเจกต์');
    mockProjects[index] = {
      ...mockProjects[index],
      ...data,
      updatedAt: new Date(),
    };
    return mockProjects[index];
  }

  async deleteProject(id: string): Promise<boolean> {
    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    mockProjects.splice(index, 1);
    return true;
  }

  async addFeedback(feedback: Omit<ProjectFeedback, 'id' | 'createdAt'>): Promise<ProjectFeedback> {
    const item: ProjectFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      createdAt: new Date(),
    };
    mockFeedbacks.push(item);
    return item;
  }

  async findFeedbackByProject(projectId: string): Promise<ProjectFeedback[]> {
    return mockFeedbacks.filter((f) => f.projectId === projectId);
  }

  async hasUserFeedback(projectId: string, authorId: string): Promise<boolean> {
    return mockFeedbacks.some((f) => f.projectId === projectId && f.authorId === authorId);
  }

  async findIdeas(): Promise<ProjectIdea[]> {
    return [...mockIdeas];
  }

  async createIdea(idea: Omit<ProjectIdea, 'id' | 'createdAt'>): Promise<ProjectIdea> {
    const newItem: ProjectIdea = {
      ...idea,
      id: `idea-${Date.now()}`,
      createdAt: new Date(),
    };
    mockIdeas.push(newItem);
    return newItem;
  }
}

export const showcaseRepository: IShowcaseRepository = new ShowcaseMockRepository();