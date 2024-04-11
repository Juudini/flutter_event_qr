import { IsString, IsUUID } from 'class-validator';

export class VerifyQrDto {
  @IsString()
  @IsUUID()
  eventId: string;

  @IsString()
  @IsUUID()
  userId: string;
}
