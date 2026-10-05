import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoreHubIdentity } from '../auth/core-hub-identity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Permission } from '../auth/permissions';
import { CollectionResult } from '../common/api-response';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { ReviewProjectDto } from './dto/review-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

/**
 * Projects resource controller (contract probes L2-01..L2-15).
 */
@Controller('v1/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @RequirePermissions(Permission.PROJECT_READ)
  async findAll(@Query() query: ProjectQueryDto) {
    const { items, meta } = await this.projectsService.findAll(query);
    return new CollectionResult(items, meta);
  }

  @Get(':id')
  @RequirePermissions(Permission.PROJECT_READ)
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.projectsService.findById(id);
  }

  @Post()
  @RequirePermissions(Permission.PROJECT_CREATE)
  async create(@Body() dto: CreateProjectDto, @CurrentUser() user: CoreHubIdentity) {
    return this.projectsService.create(dto, user);
  }

  @Patch(':id')
  @RequirePermissions(Permission.PROJECT_UPDATE_OWN, Permission.PROJECT_UPDATE_ANY)
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: CoreHubIdentity,
  ) {
    return this.projectsService.update(id, dto, user);
  }

  @Delete(':id')
  @RequirePermissions(Permission.PROJECT_DELETE_OWN, Permission.PROJECT_DELETE_ANY)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: CoreHubIdentity,
  ) {
    return this.projectsService.remove(id, user);
  }

  @Post(':id/feedbacks')
  @RequirePermissions(Permission.FEEDBACK_CREATE)
  async addFeedback(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CreateFeedbackDto,
    @CurrentUser() user: CoreHubIdentity,
  ) {
    return this.projectsService.addFeedback(id, dto, user);
  }

  @Get(':id/feedbacks')
  @RequirePermissions(Permission.FEEDBACK_READ)
  async getFeedbacks(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.projectsService.getFeedbacks(id);
  }

  @Post(':id/reviews')
  @RequirePermissions(Permission.PROJECT_REVIEW)
  async reviewProject(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: ReviewProjectDto,
    @CurrentUser() user: CoreHubIdentity,
  ) {
    return this.projectsService.reviewProject(id, dto, user);
  }
}
