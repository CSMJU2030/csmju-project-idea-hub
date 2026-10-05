import { Test, TestingModule } from '@nestjs/testing';
import { CoreHubIdentity, SubsystemRole } from '../auth/core-hub-identity';
import { CollectionResult } from '../common/api-response';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: jest.Mocked<ProjectsService>;

  const mockUser: CoreHubIdentity = {
    id: 'user-std-1234',
    email: 'test@mju.ac.th',
    coreRole: 'student',
    subsystemRole: SubsystemRole.STUDENT,
  };

  const mockProject = {
    id: '99999999-9999-4999-8999-999999999999',
    titleTh: 'โครงงานทดสอบ',
    titleEn: 'Test Project',
    abstract: 'Abstract for test',
    category: 'Web Application',
    status: 'PROPOSED' as const,
    ownerCoreUserId: 'user-std-1234',
    advisorCoreUserId: null,
    academicYear: 2568,
    semester: 1,
    githubUrl: null,
    demoUrl: null,
    proposalUrl: null,
    progressReportUrl: null,
    fullThesisPdfUrl: null,
    posterImageUrl: null,
    demoVideoUrl: null,
    chapter1Summary: null,
    chapter2Summary: null,
    chapter3Summary: null,
    chapter4Summary: null,
    chapter5Summary: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [],
    tags: [],
    feedbacks: [],
    approvals: [],
  };

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn().mockResolvedValue({
        items: [mockProject],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      }),
      findById: jest.fn().mockResolvedValue(mockProject),
      create: jest.fn().mockResolvedValue(mockProject),
      update: jest.fn().mockResolvedValue(mockProject),
      remove: jest.fn().mockResolvedValue({ id: mockProject.id, deleted: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('returns a CollectionResult with data and meta', async () => {
      const query = new ProjectQueryDto();
      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toBeInstanceOf(CollectionResult);
      expect(result.data).toEqual([mockProject]);
      expect(result.meta).toEqual({ total: 1, page: 1, limit: 20, totalPages: 1 });
    });
  });

  describe('findOne', () => {
    it('returns a single project by id', async () => {
      const result = await controller.findOne(mockProject.id);

      expect(service.findById).toHaveBeenCalledWith(mockProject.id);
      expect(result).toEqual(mockProject);
    });
  });

  describe('create', () => {
    it('creates a project with current user', async () => {
      const dto: CreateProjectDto = {
        titleTh: 'โครงงานใหม่',
      };

      const result = await controller.create(dto, mockUser);

      expect(service.create).toHaveBeenCalledWith(dto, mockUser);
      expect(result).toEqual(mockProject);
    });
  });

  describe('update', () => {
    it('updates a project by id', async () => {
      const dto: UpdateProjectDto = {
        titleTh: 'โครงงานปรับปรุง',
      };

      const result = await controller.update(mockProject.id, dto, mockUser);

      expect(service.update).toHaveBeenCalledWith(mockProject.id, dto, mockUser);
      expect(result).toEqual(mockProject);
    });
  });

  describe('remove', () => {
    it('removes a project by id', async () => {
      const result = await controller.remove(mockProject.id, mockUser);

      expect(service.remove).toHaveBeenCalledWith(mockProject.id, mockUser);
      expect(result).toEqual({ id: mockProject.id, deleted: true });
    });
  });
});
