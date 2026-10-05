import { IShowcaseRepository } from '../showcase.repository.interface';
import { Project, ProjectFeedback, ProjectIdea, ProjectStatus } from '../../types/domain';
import { ShowcaseMockRepository } from '../mock/showcase.mock-repository';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4201';

interface BackendProject {
  id: string;
  titleTh: string;
  titleEn?: string | null;
  abstract?: string | null;
  category?: string | null;
  status: string;
  ownerCoreUserId: string;
  advisorCoreUserId?: string | null;
  academicYear: number;
  semester: number;
  githubUrl?: string | null;
  demoUrl?: string | null;
  proposalUrl?: string | null;
  progressReportUrl?: string | null;
  fullThesisPdfUrl?: string | null;
  posterImageUrl?: string | null;
  demoVideoUrl?: string | null;
  chapter1Summary?: string | null;
  chapter2Summary?: string | null;
  chapter3Summary?: string | null;
  chapter4Summary?: string | null;
  chapter5Summary?: string | null;
  createdAt: string;
  updatedAt: string;
  members?: Array<{ id: string; coreUserId: string; roleInProject: string }>;
  tags?: Array<{ id: string; tagName: string }>;
}

function mapStatusToDomain(status: string): ProjectStatus {
  switch (status) {
    case 'PROPOSED':
      return 'PENDING_APPROVAL';
    case 'APPROVED':
      return 'APPROVED';
    case 'REQUESTED_CHANGES':
      return 'REJECTED';
    case 'COMPLETED':
      return 'APPROVED';
    default:
      return 'PENDING_APPROVAL';
  }
}

function mapDomainToBackendStatus(status: ProjectStatus): string {
  switch (status) {
    case 'PENDING_APPROVAL':
      return 'PROPOSED';
    case 'APPROVED':
      return 'APPROVED';
    case 'REJECTED':
      return 'REQUESTED_CHANGES';
    default:
      return 'PROPOSED';
  }
}

function mapBackendToProject(p: BackendProject): Project {
  const tags = (p.tags ?? []).map((t) => t.tagName);
  return {
    id: p.id,
    titleTh: p.titleTh,
    titleEn: p.titleEn || p.titleTh,
    abstract: p.abstract || '',
    academicYear: p.academicYear,
    category: p.category || 'Web Application',
    tags,
    techStack: tags.length > 0 ? tags : ['TypeScript', 'Next.js'],
    members: (p.members ?? []).map((m) => ({
      studentId: m.coreUserId,
      name: m.coreUserId,
      isOwner: m.roleInProject === 'OWNER',
    })),
    advisors: p.advisorCoreUserId
      ? [{ advisorId: p.advisorCoreUserId, name: 'อาจารย์ที่ปรึกษา' }]
      : [],
    githubUrl: p.githubUrl || undefined,
    demoUrl: p.demoUrl || undefined,
    proposalUrl: p.proposalUrl || undefined,
    progressReportUrl: p.progressReportUrl || undefined,
    fullThesisPdfUrl: p.fullThesisPdfUrl || undefined,
    reportPdfUrl: p.fullThesisPdfUrl || p.progressReportUrl || p.proposalUrl || undefined,
    posterImageUrl: p.posterImageUrl || undefined,
    demoVideoUrl: p.demoVideoUrl || undefined,
    chaptersSummary: {
      chapter1: p.chapter1Summary || undefined,
      chapter2: p.chapter2Summary || undefined,
      chapter3: p.chapter3Summary || undefined,
      chapter4: p.chapter4Summary || undefined,
      chapter5: p.chapter5Summary || undefined,
    },
    status: mapStatusToDomain(p.status),
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  };
}

export class ShowcaseHttpRepository implements IShowcaseRepository {
  private readonly fallback = new ShowcaseMockRepository();

  async findProjects(filter?: { status?: ProjectStatus; keyword?: string; year?: number }): Promise<Project[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.status) {
        params.set('status', mapDomainToBackendStatus(filter.status));
      }
      if (filter?.keyword) {
        params.set('search', filter.keyword);
      }
      if (filter?.year) {
        params.set('academicYear', String(filter.year));
      }
      params.set('limit', '50');

      const url = `${BACKEND_URL}/api/v1/projects${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 0 },
      });

      if (!res.ok) {
        return this.fallback.findProjects(filter);
      }

      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) {
        return this.fallback.findProjects(filter);
      }

      if (json.data.length === 0) {
        return this.fallback.findProjects(filter);
      }

      return json.data.map(mapBackendToProject);
    } catch {
      return this.fallback.findProjects(filter);
    }
  }

  async findProjectById(id: string): Promise<Project | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/projects/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 0 },
      });

      if (!res.ok) {
        return this.fallback.findProjectById(id);
      }

      const json = await res.json();
      if (!json.success || !json.data) {
        return this.fallback.findProjectById(id);
      }

      return mapBackendToProject(json.data);
    } catch {
      return this.fallback.findProjectById(id);
    }
  }

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    try {
      const body = {
        titleTh: data.titleTh,
        titleEn: data.titleEn,
        abstract: data.abstract,
        category: data.category,
        academicYear: data.academicYear,
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
        proposalUrl: data.proposalUrl,
        progressReportUrl: data.progressReportUrl,
        fullThesisPdfUrl: data.fullThesisPdfUrl || data.reportPdfUrl,
        posterImageUrl: data.posterImageUrl,
        demoVideoUrl: data.demoVideoUrl,
        chapter1Summary: data.chaptersSummary?.chapter1,
        chapter2Summary: data.chaptersSummary?.chapter2,
        chapter3Summary: data.chaptersSummary?.chapter3,
        chapter4Summary: data.chaptersSummary?.chapter4,
        chapter5Summary: data.chaptersSummary?.chapter5,
        tags: data.tags,
      };

      const res = await fetch(`${BACKEND_URL}/api/v1/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        return this.fallback.createProject(data);
      }

      const json = await res.json();
      if (!json.success || !json.data) {
        return this.fallback.createProject(data);
      }

      return mapBackendToProject(json.data);
    } catch {
      return this.fallback.createProject(data);
    }
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    try {
      const body: Record<string, unknown> = {};
      if (data.titleTh !== undefined) body.titleTh = data.titleTh;
      if (data.titleEn !== undefined) body.titleEn = data.titleEn;
      if (data.abstract !== undefined) body.abstract = data.abstract;
      if (data.category !== undefined) body.category = data.category;
      if (data.academicYear !== undefined) body.academicYear = data.academicYear;
      if (data.status !== undefined) body.status = mapDomainToBackendStatus(data.status);
      if (data.githubUrl !== undefined) body.githubUrl = data.githubUrl;
      if (data.demoUrl !== undefined) body.demoUrl = data.demoUrl;
      if (data.proposalUrl !== undefined) body.proposalUrl = data.proposalUrl;
      if (data.progressReportUrl !== undefined) body.progressReportUrl = data.progressReportUrl;
      if (data.fullThesisPdfUrl !== undefined || data.reportPdfUrl !== undefined) {
        body.fullThesisPdfUrl = data.fullThesisPdfUrl || data.reportPdfUrl;
      }
      if (data.posterImageUrl !== undefined) body.posterImageUrl = data.posterImageUrl;
      if (data.demoVideoUrl !== undefined) body.demoVideoUrl = data.demoVideoUrl;
      if (data.chaptersSummary?.chapter1 !== undefined) body.chapter1Summary = data.chaptersSummary.chapter1;
      if (data.chaptersSummary?.chapter2 !== undefined) body.chapter2Summary = data.chaptersSummary.chapter2;
      if (data.chaptersSummary?.chapter3 !== undefined) body.chapter3Summary = data.chaptersSummary.chapter3;
      if (data.chaptersSummary?.chapter4 !== undefined) body.chapter4Summary = data.chaptersSummary.chapter4;
      if (data.chaptersSummary?.chapter5 !== undefined) body.chapter5Summary = data.chaptersSummary.chapter5;
      if (data.tags !== undefined) body.tags = data.tags;

      const res = await fetch(`${BACKEND_URL}/api/v1/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        return this.fallback.updateProject(id, data);
      }

      const json = await res.json();
      if (!json.success || !json.data) {
        return this.fallback.updateProject(id, data);
      }

      return mapBackendToProject(json.data);
    } catch {
      return this.fallback.updateProject(id, data);
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) {
        return this.fallback.deleteProject(id);
      }

      return true;
    } catch {
      return this.fallback.deleteProject(id);
    }
  }

  async addFeedback(feedback: Omit<ProjectFeedback, 'id' | 'createdAt'>): Promise<ProjectFeedback> {
    return this.fallback.addFeedback(feedback);
  }

  async findFeedbackByProject(projectId: string): Promise<ProjectFeedback[]> {
    return this.fallback.findFeedbackByProject(projectId);
  }

  async hasUserFeedback(projectId: string, authorId: string): Promise<boolean> {
    return this.fallback.hasUserFeedback(projectId, authorId);
  }

  async findIdeas(): Promise<ProjectIdea[]> {
    return this.fallback.findIdeas();
  }

  async createIdea(idea: Omit<ProjectIdea, 'id' | 'createdAt'>): Promise<ProjectIdea> {
    return this.fallback.createIdea(idea);
  }
}

export const showcaseRepository: IShowcaseRepository = new ShowcaseHttpRepository();
