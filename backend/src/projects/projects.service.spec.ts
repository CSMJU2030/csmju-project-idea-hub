import { Test, TestingModule } from '@nestjs/testing';
import { ProjectStatus } from '../../generated/prisma/client';
import { CoreHubIdentity, SubsystemRole } from '../auth/core-hub-identity';
import { AppException } from '../common/errors';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: {
    project: {
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockUser: CoreHubIdentity = {
    id: 'user-std-1234',
    email: 'test@mju.ac.th',
    coreRole: 'student',
    subsystemRole: SubsystemRole.STUDENT,
  };

  const otherUser: CoreHubIdentity = {
    id: 'user-std-9999',
    email: 'other@mju.ac.th',
    coreRole: 'student',
    subsystemRole: SubsystemRole.STUDENT,
  };

  const staffUser: CoreHubIdentity = {
    id: 'user-staff-5555',
    email: 'advisor@mju.ac.th',
    coreRole: 'lecturer',
    subsystemRole: SubsystemRole.STAFF,
  };

  const mockProject = {
    id: '99999999-9999-4999-8999-999999999999',
    titleTh: 'โครงงานทดสอบ',
    titleEn: 'Test Project',
    abstract: 'Abstract for test',
    category: 'Web Application',
    status: ProjectStatus.PROPOSED,
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
    prisma = {
      project: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns items and pagination meta', async () => {
      prisma.project.count.mockResolvedValue(1);
      prisma.project.findMany.mockResolvedValue([mockProject]);

      const query = new ProjectQueryDto();
      query.page = 1;
      query.limit = 10;

      const result = await service.findAll(query);

      expect(prisma.project.count).toHaveBeenCalled();
      expect(prisma.project.findMany).toHaveBeenCalled();
      expect(result.items).toEqual([mockProject]);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('applies search filters when search keyword is provided', async () => {
      prisma.project.count.mockResolvedValue(0);
      prisma.project.findMany.mockResolvedValue([]);

      const query = new ProjectQueryDto();
      query.search = 'AI';

      await service.findAll(query);

      expect(prisma.project.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { titleTh: { contains: 'AI', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('returns project when found', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);

      const result = await service.findById(mockProject.id);

      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: mockProject.id },
        include: {
          members: true,
          tags: true,
          feedbacks: true,
          approvals: true,
        },
      });
      expect(result).toEqual(mockProject);
    });

    it('throws not found exception when project does not exist', async () => {
      prisma.project.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(AppException);
    });
  });

  describe('create', () => {
    it('creates project with owner and default status', async () => {
      prisma.project.create.mockResolvedValue(mockProject);

      const dto: CreateProjectDto = {
        titleTh: 'โครงงานทดสอบ',
        tags: ['AI', 'Next.js'],
      };

      const result = await service.create(dto, mockUser);

      expect(prisma.project.create).toHaveBeenCalled();
      expect(result).toEqual(mockProject);
    });
  });

  describe('update', () => {
    it('allows owner to update their project', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);
      prisma.project.update.mockResolvedValue({
        ...mockProject,
        titleTh: 'โครงงานทดสอบที่แก้ไขแล้ว',
      });

      const dto: UpdateProjectDto = {
        titleTh: 'โครงงานทดสอบที่แก้ไขแล้ว',
      };

      const result = await service.update(mockProject.id, dto, mockUser);

      expect(prisma.project.update).toHaveBeenCalled();
      expect(result.titleTh).toBe('โครงงานทดสอบที่แก้ไขแล้ว');
    });

    it('allows staff to update any project', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);
      prisma.project.update.mockResolvedValue({
        ...mockProject,
        status: ProjectStatus.APPROVED,
      });

      const dto: UpdateProjectDto = {
        status: ProjectStatus.APPROVED,
      };

      const result = await service.update(mockProject.id, dto, staffUser);

      expect(prisma.project.update).toHaveBeenCalled();
      expect(result.status).toBe(ProjectStatus.APPROVED);
    });

    it('throws forbidden if another user attempts to update', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);

      const dto: UpdateProjectDto = {
        titleTh: 'โครงงานโดนแก้ไข',
      };

      await expect(service.update(mockProject.id, dto, otherUser)).rejects.toThrow(
        AppException,
      );
    });
  });

  describe('remove', () => {
    it('allows owner to remove project', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);
      prisma.project.delete.mockResolvedValue(mockProject);

      const result = await service.remove(mockProject.id, mockUser);

      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: mockProject.id },
      });
      expect(result).toEqual({ id: mockProject.id, deleted: true });
    });

    it('throws forbidden if non-owner tries to delete', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);

      await expect(service.remove(mockProject.id, otherUser)).rejects.toThrow(AppException);
    });
  });
});
