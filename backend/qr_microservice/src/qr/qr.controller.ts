import { Controller, Delete, Patch, Post } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { QrsService } from './qr.service';
import { CreateQrDto, UpdateQrDto, VerifyQrDto } from './dto';

@Controller('qrs')
export class QrController {
  constructor(private readonly qrService: QrsService) {}

  @Post('create')
  //  @MessagePattern('create.qr')
  create(@Payload() createQrDto: CreateQrDto) {
    return this.qrService.create(createQrDto);
  }

  @Post('find')
  //@MessagePattern('find.all.qrs.by.id')
  findAllById(@Payload() id: string) {
    return this.qrService.findAllById(id);
  }

  @Patch('update')
  // @MessagePattern('update.qr')
  update(@Payload() updateQrDto: UpdateQrDto, id: string) {
    return this.qrService.update(id, updateQrDto);
  }

  // @MessagePattern('remove.qr')
  @Delete('remove')
  remove(@Payload() id: string) {
    return this.qrService.remove(id);
  }

  @Post('verifyQr')
  //@MessagePattern('verify.qr')
  verifyQr(@Payload() ids: VerifyQrDto) {
    return this.qrService.verifyQr(ids);
  }
}
