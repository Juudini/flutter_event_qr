import { Module } from '@nestjs/common';
import { QrsService } from './qr.service';
import { QrController } from './qr.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [QrController],
  providers: [QrsService],
  imports: [NatsModule],
})
export class QrModule {}
