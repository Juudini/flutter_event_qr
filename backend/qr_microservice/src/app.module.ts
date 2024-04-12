import { Module } from '@nestjs/common';
import { QrModule } from './qr/qr.module';

@Module({
  imports: [QrModule],
})
export class AppModule {}
