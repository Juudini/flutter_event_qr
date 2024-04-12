import { Module } from '@nestjs/common';
import { NatsModule } from './transports/nats.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { QrModule } from './qr/qr.module';

@Module({
  imports: [NatsModule, AuthModule, EventModule, QrModule],
})
export class AppModule {}
