import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from '../../../generated/prisma/client';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  titleTh?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  abstract?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  academicYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  semester?: number;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  @IsOptional()
  @IsString()
  demoUrl?: string;

  @IsOptional()
  @IsString()
  proposalUrl?: string;

  @IsOptional()
  @IsString()
  progressReportUrl?: string;

  @IsOptional()
  @IsString()
  fullThesisPdfUrl?: string;

  @IsOptional()
  @IsString()
  posterImageUrl?: string;

  @IsOptional()
  @IsString()
  demoVideoUrl?: string;

  @IsOptional()
  @IsString()
  chapter1Summary?: string;

  @IsOptional()
  @IsString()
  chapter2Summary?: string;

  @IsOptional()
  @IsString()
  chapter3Summary?: string;

  @IsOptional()
  @IsString()
  chapter4Summary?: string;

  @IsOptional()
  @IsString()
  chapter5Summary?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
