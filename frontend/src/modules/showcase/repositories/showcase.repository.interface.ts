import { Project, ProjectFeedback, ProjectIdea, ProjectStatus } from '../types/domain';

export interface IShowcaseRepository {
  findProjects(filter?: { status?: ProjectStatus; keyword?: string; year?: number }): Promise<Project[]>;
  findProjectById(id: string): Promise<Project | null>;
  createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>;
  updateProject(id: string, data: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<boolean>;
  
  addFeedback(feedback: Omit<ProjectFeedback, 'id' | 'createdAt'>): Promise<ProjectFeedback>;
  findFeedbackByProject(projectId: string): Promise<ProjectFeedback[]>;
  hasUserFeedback(projectId: string, authorId: string): Promise<boolean>;

  findIdeas(): Promise<ProjectIdea[]>;
  createIdea(idea: Omit<ProjectIdea, 'id' | 'createdAt'>): Promise<ProjectIdea>;
}