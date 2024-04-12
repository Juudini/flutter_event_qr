import { IsDateString, IsString, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  date: Date;

  @IsString()
  location: string;

  @IsUUID()
  userId: string;
}
