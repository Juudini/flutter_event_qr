import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [QrController],
  imports: [NatsModule],
})
export class QrModule {}
