import { MessagePattern, Payload } from '@nestjs/microservices';
import { QrsService } from './qr.service';
import { CreateQrDto, UpdateQrDto, VerifyQrDto } from './dto';
import { Controller } from '@nestjs/common';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrsService) {}

  @MessagePattern('create.qr')
  create(@Payload() createQrDto: CreateQrDto) {
    return this.qrService.create(createQrDto);
  }

  @MessagePattern('find.qrs.by.id')
  findAllById(@Payload() id: string) {
    return this.qrService.findAllById(id);
  }

  @MessagePattern('update.qr')
  update(@Payload() updateQrDto: UpdateQrDto, id: string) {
    return this.qrService.update(id, updateQrDto);
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
