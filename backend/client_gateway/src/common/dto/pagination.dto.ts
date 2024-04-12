import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';

type Sort = 'asc' | 'desc';

enum SortType {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(SortType)
  sort?: Sort = 'asc';
}
