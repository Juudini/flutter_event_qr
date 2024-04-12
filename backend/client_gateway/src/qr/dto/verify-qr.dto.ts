import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUUID } from 'class-validator';
import { CreateQrDto } from './create-qr.dto';

export class VerifyQrDto extends PartialType(CreateQrDto) {
  @IsString()
  @IsUUID()
  id: string;
}
