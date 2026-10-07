import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CoreHubIdentity } from '../auth/core-hub-identity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Permission } from '../auth/permissions';
import { CollectionResult } from '../common/api-response';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { IdeaQueryDto } from './dto/idea-query.dto';
import { IdeasService } from './ideas.service';

/**
 * Ideas resource controller for the Project Idea Hub.
 */
@Controller('v1/ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Get()
  @RequirePermissions(Permission.IDEA_READ)
  async findAll(@Query() query: IdeaQueryDto) {
    const { items, meta } = await this.ideasService.findAll(query);
    return new CollectionResult(items, meta);
  }

  @Get(':id')
  @RequirePermissions(Permission.IDEA_READ)
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ideasService.findById(id);
  }

  @Post()
  @RequirePermissions(Permission.IDEA_CREATE)
  async create(@Body() dto: CreateIdeaDto, @CurrentUser() user: CoreHubIdentity) {
    return this.ideasService.create(dto, user);
  }

  @Post(':id/vote')
  @RequirePermissions(Permission.IDEA_READ)
  async vote(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ideasService.vote(id);
  }
}
