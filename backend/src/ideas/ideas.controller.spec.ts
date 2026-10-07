import { Test, TestingModule } from '@nestjs/testing';
import { IdeaStatus } from '../../generated/prisma/client';
import { CoreHubIdentity, SubsystemRole } from '../auth/core-hub-identity';
import { CollectionResult } from '../common/api-response';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { IdeaQueryDto } from './dto/idea-query.dto';
import { IdeasController } from './ideas.controller';
import { IdeasService } from './ideas.service';

describe('IdeasController', () => {
  let controller: IdeasController;
  let service: jest.Mocked<IdeasService>;

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
    const mockService = {
      findAll: jest.fn().mockResolvedValue({
        items: [mockIdea],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      }),
      findById: jest.fn().mockResolvedValue(mockIdea),
      create: jest.fn().mockResolvedValue(mockIdea),
      vote: jest.fn().mockResolvedValue({ ...mockIdea, votesCount: 6 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdeasController],
      providers: [
        {
          provide: IdeasService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<IdeasController>(IdeasController);
    service = module.get(IdeasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('returns a CollectionResult with data and meta', async () => {
      const query = new IdeaQueryDto();
      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toBeInstanceOf(CollectionResult);
      expect(result.data).toEqual([mockIdea]);
      expect(result.meta).toEqual({ total: 1, page: 1, limit: 20, totalPages: 1 });
    });
  });

  describe('findOne', () => {
    it('returns a single idea by id', async () => {
      const result = await controller.findOne(mockIdea.id);

      expect(service.findById).toHaveBeenCalledWith(mockIdea.id);
      expect(result).toEqual(mockIdea);
    });
  });

  describe('create', () => {
    it('creates an idea with current user', async () => {
      const dto: CreateIdeaDto = {
        title: 'ไอเดียใหม่',
        description: 'รายละเอียด',
      };

      const result = await controller.create(dto, mockUser);

      expect(service.create).toHaveBeenCalledWith(dto, mockUser);
      expect(result).toEqual(mockIdea);
    });
  });

  describe('vote', () => {
    it('increments vote count for idea', async () => {
      const result = await controller.vote(mockIdea.id);

      expect(service.vote).toHaveBeenCalledWith(mockIdea.id);
      expect(result.votesCount).toBe(6);
    });
  });
});
