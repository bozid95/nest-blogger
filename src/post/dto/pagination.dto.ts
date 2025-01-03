import { IsOptional, IsInt, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  page: number = 1; // Default page adalah 1

  @IsOptional()
  @IsInt()
  @IsPositive()
  limit: number = 10; // Default limit adalah 10
}
