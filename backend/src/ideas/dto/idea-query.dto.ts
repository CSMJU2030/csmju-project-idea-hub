import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { IdeaStatus } from '../../../generated/prisma/client';

export class IdeaQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(IdeaStatus)
  status?: IdeaStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
