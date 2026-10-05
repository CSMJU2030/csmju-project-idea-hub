import { Injectable, Logger } from '@nestjs/common';
import { Prisma, ProjectStatus } from '../../generated/prisma/client';
import { CoreHubIdentity, SubsystemRole } from '../auth/core-hub-identity';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { AppException } from '../common/errors';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { ReviewProjectDto } from './dto/review-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProjectQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = query.skip;
    const take = query.take;

    const where: Prisma.ProjectWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.academicYear) {
      where.academicYear = query.academicYear;
    }

    if (query.search) {
      where.OR = [
        { titleTh: { contains: query.search, mode: 'insensitive' } },
        { titleEn: { contains: query.search, mode: 'insensitive' } },
        { abstract: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          members: true,
          tags: true,
        },
      }),
    ]);

    return {
      items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        members: true,
        tags: true,
        feedbacks: true,
        approvals: true,
      },
    });

    if (!project) {
      throw AppException.notFound(`Project with id "${id}" not found`);
    }

    return project;
  }

  async create(dto: CreateProjectDto, user: CoreHubIdentity) {
    this.logger.log(`Creating project "${dto.titleTh}" by user ${user.id}`);

    const project = await this.prisma.project.create({
      data: {
        titleTh: dto.titleTh,
        titleEn: dto.titleEn ?? dto.titleTh,
        abstract: dto.abstract ?? '',
        category: dto.category ?? 'Web Application',
        academicYear: dto.academicYear ?? new Date().getFullYear() + 543,
        semester: dto.semester ?? 1,
        ownerCoreUserId: user.id,
        githubUrl: dto.githubUrl,
        demoUrl: dto.demoUrl,
        proposalUrl: dto.proposalUrl,
        progressReportUrl: dto.progressReportUrl,
        fullThesisPdfUrl: dto.fullThesisPdfUrl,
        posterImageUrl: dto.posterImageUrl,
        demoVideoUrl: dto.demoVideoUrl,
        chapter1Summary: dto.chapter1Summary,
        chapter2Summary: dto.chapter2Summary,
        chapter3Summary: dto.chapter3Summary,
        chapter4Summary: dto.chapter4Summary,
        chapter5Summary: dto.chapter5Summary,
        status: ProjectStatus.PROPOSED,
        members: {
          create: [
            {
              coreUserId: user.id,
              roleInProject: 'OWNER',
            },
          ],
        },
        tags:
          dto.tags && dto.tags.length > 0
            ? {
                create: dto.tags.map((t) => ({ tagName: t })),
              }
            : undefined,
      },
      include: {
        members: true,
        tags: true,
      },
    });

    return project;
  }

  async update(id: string, dto: UpdateProjectDto, user: CoreHubIdentity) {
    const existing = await this.findById(id);

    const isPrivileged =
      user.subsystemRole === SubsystemRole.ADMIN || user.subsystemRole === SubsystemRole.STAFF;
    if (!isPrivileged && existing.ownerCoreUserId !== user.id) {
      throw AppException.forbidden('You do not have permission to modify this project');
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        titleTh: dto.titleTh,
        titleEn: dto.titleEn,
        abstract: dto.abstract,
        category: dto.category,
        status: dto.status,
        academicYear: dto.academicYear,
        semester: dto.semester,
        githubUrl: dto.githubUrl,
        demoUrl: dto.demoUrl,
        proposalUrl: dto.proposalUrl,
        progressReportUrl: dto.progressReportUrl,
        fullThesisPdfUrl: dto.fullThesisPdfUrl,
        posterImageUrl: dto.posterImageUrl,
        demoVideoUrl: dto.demoVideoUrl,
        chapter1Summary: dto.chapter1Summary,
        chapter2Summary: dto.chapter2Summary,
        chapter3Summary: dto.chapter3Summary,
        chapter4Summary: dto.chapter4Summary,
        chapter5Summary: dto.chapter5Summary,
      },
      include: {
        members: true,
        tags: true,
      },
    });

    return updated;
  }

  async remove(id: string, user: CoreHubIdentity) {
    const existing = await this.findById(id);

    const isPrivileged =
      user.subsystemRole === SubsystemRole.ADMIN || user.subsystemRole === SubsystemRole.STAFF;
    if (!isPrivileged && existing.ownerCoreUserId !== user.id) {
      throw AppException.forbidden('You do not have permission to delete this project');
    }

    await this.prisma.project.delete({
      where: { id },
    });

    return { id, deleted: true };
  }

  async addFeedback(projectId: string, dto: CreateFeedbackDto, user: CoreHubIdentity) {
    await this.findById(projectId);

    const feedback = await this.prisma.projectFeedback.create({
      data: {
        projectId,
        authorCoreUserId: user.id,
        authorRole: user.subsystemRole,
        comment: dto.comment,
        rating: dto.rating,
      },
    });

    return feedback;
  }

  async getFeedbacks(projectId: string) {
    await this.findById(projectId);

    return this.prisma.projectFeedback.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reviewProject(projectId: string, dto: ReviewProjectDto, user: CoreHubIdentity) {
    await this.findById(projectId);

    await this.prisma.projectApproval.create({
      data: {
        projectId,
        reviewerCoreUserId: user.id,
        action: dto.action,
        comment: dto.comment,
      },
    });

    const newStatus =
      dto.action === 'APPROVED' ? ProjectStatus.APPROVED : ProjectStatus.REQUESTED_CHANGES;

    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        status: newStatus,
      },
      include: {
        members: true,
        tags: true,
        approvals: true,
      },
    });

    return updated;
  }
}
