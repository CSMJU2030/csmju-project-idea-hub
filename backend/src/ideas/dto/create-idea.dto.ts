import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateIdeaDto {
  @IsString()
  @IsNotEmpty({ message: 'title must not be empty' })
  @MinLength(1, { message: 'title must not be empty' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'description must not be empty' })
  description: string;
}
