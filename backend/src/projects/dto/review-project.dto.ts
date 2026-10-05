import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReviewProjectDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['APPROVED', 'REQUESTED_CHANGES'])
  action: 'APPROVED' | 'REQUESTED_CHANGES';

  @IsOptional()
  @IsString()
  comment?: string;
}
