import { QrsService } from './qr.service';
import { QrController } from './qr.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [QrController],
  providers: [QrsService],
})
export class QrModule {}
