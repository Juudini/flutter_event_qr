import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Sort } from '../execute-pagination';

enum SortType {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationDto {
  @IsUUID()
  @IsOptional()
  @IsString()
  id: string;

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
