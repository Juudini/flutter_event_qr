import { IsString, IsUUID } from 'class-validator';

export class CreateQrDto {
  @IsString()
  @IsUUID(4)
  public userId: string;

  @IsString()
  @IsUUID(4)
  public eventId: string;
}
