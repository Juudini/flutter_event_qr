import { MessagePattern, Payload } from '@nestjs/microservices';
import { QrsService } from './qr.service';
import { CreateQrDto, VerifyQrDto } from './dto';
import { Controller } from '@nestjs/common';
import { PaginationDto } from 'src/common';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrsService) {}

  @MessagePattern('create.qr')
  create(@Payload() createQrDto: CreateQrDto) {
    return this.qrService.create(createQrDto);
  }

  @MessagePattern('find.qrs.by.id')
  findAllById(@Payload() paginationDto: PaginationDto) {
    return this.qrService.findAllById(paginationDto);
  }

  @MessagePattern('find.qr')
  findById(@Payload() id: string) {
    return this.qrService.findOne(id);
  }

  @MessagePattern('remove.qr')
  remove(@Payload() id: string) {
    return this.qrService.remove(id);
  }

  @MessagePattern('verify.qr')
  verifyQr(@Payload() ids: VerifyQrDto) {
    return this.qrService.verifyQr(ids);
  }
}
