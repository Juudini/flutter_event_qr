import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { toString as generateQr } from 'qrcode';
import { CreateQrDto } from './dto/create-qr.dto';
import { RpcException } from '@nestjs/microservices';
import { UpdateQrDto } from './dto/update-qr.dto';
import { VerifyQrDto } from './dto/verify-qr.dto';

@Injectable()
export class QrsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('QrsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async verifyQr(ids: VerifyQrDto) {
    const { userId, eventId } = ids;
    await this.findOne(userId);
    //Todo: implementar EventService
    //await this.event(eventId);

    return { payload: { userId, eventId } };
  }

  async create(createQrDto: CreateQrDto) {
    const { userId, eventId } = createQrDto;

    const qrSvg = await generateQr(JSON.stringify(createQrDto), {
      type: 'svg',
      width: 300,
      height: 300,
      color: { dark: '#000000FF', light: '#FFFFFFFF' },
    });

    const payload = await this.qrCode.create({
      data: {
        userId,
        eventId,
        code: qrSvg.toString(),
      },
    });

    return payload;
  }

  async findOne(id: string) {
    const eventQr = await this.qrCode.findUnique({
      where: { id: id, isActive: true },
    });

    if (!eventQr) {
      throw new RpcException({
        message: `Event QR with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return eventQr;
  }

  findAllById(id: string) {
    return this.qrCode.findMany({
      where: { userId: id, isActive: true },
    });
  }

  async update(id: string, updateQrDto: UpdateQrDto) {
    await this.findOne(id);

    const payload = await this.qrCode.update({
      where: { id: id },
      data: updateQrDto,
    });

    return payload;
  }

  async remove(id: string) {
    await this.findOne(id);

    const payload = await this.qrCode.update({
      where: { id: id },
      data: { isActive: false },
    });

    return payload;
  }
}
