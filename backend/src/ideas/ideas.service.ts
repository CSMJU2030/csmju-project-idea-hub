import { Injectable, Logger } from '@nestjs/common';
import { IdeaStatus, Prisma } from '../../generated/prisma/client';
import { CoreHubIdentity } from '../auth/core-hub-identity';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { AppException } from '../common/errors';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { IdeaQueryDto } from './dto/idea-query.dto';

@Injectable()
export class IdeasService {
  private readonly logger = new Logger(IdeasService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: IdeaQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = query.skip;
    const take = query.take;

    const where: Prisma.IdeaWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.idea.count({ where }),
      this.prisma.idea.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string) {
    const idea = await this.prisma.idea.findUnique({
      where: { id },
    });

    if (!idea) {
      throw AppException.notFound(`Idea with id "${id}" not found`);
    }

    return idea;
  }

  async create(dto: CreateIdeaDto, user: CoreHubIdentity) {
    this.logger.log(`Creating idea "${dto.title}" by user ${user.id}`);

    const idea = await this.prisma.idea.create({
      data: {
        title: dto.title,
        description: dto.description,
        ownerCoreUserId: user.id,
        status: IdeaStatus.OPEN,
      },
    });

    return idea;
  }

  async vote(id: string) {
    await this.findById(id);

    const updated = await this.prisma.idea.update({
      where: { id },
      data: {
        votesCount: {
          increment: 1,
        },
      },
    });

    return updated;
  }
}
