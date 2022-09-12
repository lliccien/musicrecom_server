import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsArray()
  @IsOptional()
  genres: string[] = [];

  @IsString()
  @IsOptional()
  @IsIn(['user', 'admin'])
  role: string;
}
