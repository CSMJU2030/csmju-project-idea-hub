import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ProjectStatus } from '../../../generated/prisma/client';

export class ProjectQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  academicYear?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
