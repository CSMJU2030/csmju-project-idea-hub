import { Test, TestingModule } from '@nestjs/testing';
import { IdeaStatus } from '../../generated/prisma/client';
import { CoreHubIdentity, SubsystemRole } from '../auth/core-hub-identity';
import { AppException } from '../common/errors';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { IdeaQueryDto } from './dto/idea-query.dto';
import { IdeasService } from './ideas.service';

describe('IdeasService', () => {
  let service: IdeasService;
  let prisma: {
    idea: {
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  const mockUser: CoreHubIdentity = {
    id: 'user-002',
    email: 'student@mju.ac.th',
    coreRole: 'student',
    subsystemRole: SubsystemRole.STUDENT,
  };

  const mockIdea = {
    id: 'idea-1111-2222-3333-4444',
    title: 'ทดสอบไอเดีย AI Matching',
    description: 'รายละเอียดไอเดียสำหรับทดสอบ',
    ownerCoreUserId: 'user-002',
    votesCount: 5,
    status: IdeaStatus.OPEN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      idea: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdeasService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<IdeasService>(IdeasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns items and pagination meta', async () => {
      prisma.idea.count.mockResolvedValue(1);
      prisma.idea.findMany.mockResolvedValue([mockIdea]);

      const query = new IdeaQueryDto();
      query.page = 1;
      query.limit = 10;

      const result = await service.findAll(query);

      expect(prisma.idea.count).toHaveBeenCalled();
      expect(prisma.idea.findMany).toHaveBeenCalled();
      expect(result.items).toEqual([mockIdea]);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findById', () => {
    it('returns idea when found', async () => {
      prisma.idea.findUnique.mockResolvedValue(mockIdea);

      const result = await service.findById(mockIdea.id);

      expect(prisma.idea.findUnique).toHaveBeenCalledWith({
        where: { id: mockIdea.id },
      });
      expect(result).toEqual(mockIdea);
    });

    it('throws not found exception when idea does not exist', async () => {
      prisma.idea.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(AppException);
    });
  });

  describe('create', () => {
    it('creates an idea with owner', async () => {
      prisma.idea.create.mockResolvedValue(mockIdea);

      const dto: CreateIdeaDto = {
        title: 'ไอเดียใหม่',
        description: 'รายละเอียดไอเดีย',
      };

      const result = await service.create(dto, mockUser);

      expect(prisma.idea.create).toHaveBeenCalled();
      expect(result).toEqual(mockIdea);
    });
  });

  describe('vote', () => {
    it('increments vote count', async () => {
      prisma.idea.findUnique.mockResolvedValue(mockIdea);
      prisma.idea.update.mockResolvedValue({
        ...mockIdea,
        votesCount: 6,
      });

      const result = await service.vote(mockIdea.id);

      expect(prisma.idea.update).toHaveBeenCalledWith({
        where: { id: mockIdea.id },
        data: {
          votesCount: {
            increment: 1,
          },
        },
      });
      expect(result.votesCount).toBe(6);
    });
  });
});
