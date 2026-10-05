import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'titleTh must not be empty' })
  @MinLength(1, { message: 'titleTh must not be empty' })
  titleTh: string;

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
