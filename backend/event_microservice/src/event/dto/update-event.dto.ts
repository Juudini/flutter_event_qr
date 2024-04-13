import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @Exclude()
  userId?: string;

  @IsUUID()
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  code: string;
}
