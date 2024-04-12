import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [EventController],
  imports: [NatsModule],
})
export class EventModule {}
