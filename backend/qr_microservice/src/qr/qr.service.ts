import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { toString as generateQr } from 'qrcode';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { NATS_SERVICE } from 'src/config';
import { CreateQrDto, UpdateQrDto, VerifyQrDto } from './dto';

@Injectable()
export class QrsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('QrsService');

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async verifyQr(ids: VerifyQrDto) {
    const { id, userId, eventId } = ids;
    const qrCode = await this.findOne(id);

    //Todo: Add validation for qrCode.userId and qrCode.eventId
    if (qrCode.userId !== userId) {
      throw new RpcException({
        message: `Event QR with id #${id} not valid`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const eventData: any = await this.client.send('find.event.by.id', eventId);

    if (eventData?.eventId !== eventId) {
      throw new RpcException({
        message: `Event QR with id #${id} not valid`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return { payload: { userId, eventId, eventData } };
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
