import { IsString, IsUUID } from 'class-validator';

export class CreateQrDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  @IsUUID()
  eventId: string;
}
