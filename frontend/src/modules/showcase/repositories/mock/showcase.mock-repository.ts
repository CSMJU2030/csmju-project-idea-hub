import { IShowcaseRepository } from '../showcase.repository.interface';
import { Project, ProjectFeedback, ProjectIdea, ProjectStatus } from '../../types/domain';

const mockProjects: Project[] = [
  {
    id: 'proj-001',
    titleTh: 'ระบบคลังโปรเจกต์และไอเดีย CSMJU',
    titleEn: 'CSMJU Project Showcase Hub',
    abstract: 'ระบบจัดการและจัดแสดงผลงานวิทยานิพนธ์และไอเดียเทคโนโลยีสำหรับนักศึกษา',
    academicYear: 2568,
    category: 'Web Application',
    tags: ['Next.js', 'TypeScript', 'TailwindCSS'],
    techStack: ['Next.js', 'PostgreSQL', 'TailwindCSS v4'],
    members: [{ studentId: 'user-std-001', name: 'สมชาย นักศึกษา', isOwner: true }],
    advisors: [{ advisorId: 'adv-001', name: 'ผศ.ดร. ที่ปรึกษา ใจดี' }],
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