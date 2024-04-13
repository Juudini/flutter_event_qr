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
import { CreateQrDto, VerifyQrDto } from './dto';
import {
  PaginationDto,
  PaginationResultsProps,
  executePagination,
} from 'src/common';

@Injectable()
export class QrsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('QrsService');

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('📚 Database connected');
  }

  verifyQr = async (ids: VerifyQrDto) => {
    const { id, userId, eventId } = ids;
    try {
      const qrCode = (await this.findOne(id)).payload[0];

      if (qrCode.userId !== userId) {
        throw new RpcException({
          status: 'error',
          message: `QR is not valid`,
          payload: [{ id, userId, eventId }],
        });
      }

      const isEvent: any = await this.client.send('find.event.by.id', eventId);

      if (isEvent?.eventId !== eventId) {
        throw new RpcException({
          status: 'error',
          message: `QR is not valid`,
          payload: [{ id, userId, eventId }],
        });
      }

      return {
        status: 'success',
        payload: [{ id, userId, eventId }],
      };
    } catch (err) {
      if (err instanceof RpcException) throw err;

      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Something went wrong.',
      });
    }
  };

  create = async (createQrDto: CreateQrDto) => {
    const { userId, eventId } = createQrDto;

    try {
      const existQr = await this.qrCode.findFirst({
        where: { userId: userId, eventId: eventId, isActive: true },
      });

      if (existQr) {
        throw new RpcException({
          status: 'error',
          message: `QR for event already exists`,
          payload: [{ userId, eventId }],
        });
      }

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

      return { status: 'success', payload: [payload] };
    } catch (err) {
      if (err instanceof RpcException) throw err;

      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Something went wrong.',
      });
    }
  };

  findOne = async (id: string) => {
    try {
      const isEventQr = await this.qrCode.findUnique({
        where: { id: id, isActive: true },
      });

      if (!isEventQr) {
        throw new RpcException({
          status: 'error',
          message: `QR not found or has been deleted.`,
          payload: [{ id }],
        });
      }

      return { status: 'success', payload: [isEventQr] };
    } catch (err) {
      if (err instanceof RpcException) throw err;

      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Something went wrong.',
      });
    }
  };

  findAllById = async (paginationDto: PaginationDto) => {
    const { id: userId, page, limit, sort } = paginationDto;

    try {
      const docs: number = await this.qrCode.count();

      const skipValue = (page - 1) * limit;

      const qrs = await this.qrCode.findMany({
        take: limit,
        skip: skipValue,
        orderBy: { createdAt: sort },
        where: { userId: userId },
      });

      const paginationResults: PaginationResultsProps = executePagination({
        page,
        limit,
        sort,
        endpointName: 'qr',
        docs,
        items: qrs,
      });

      return paginationResults;
    } catch (err) {
      if (err instanceof RpcException) throw err;

      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Something went wrong.',
      });
    }
  };

  remove = async (id: string) => {
    try {
      await this.findOne(id);

      const payload = await this.qrCode.update({
        where: { id: id },
        data: { isActive: false },
      });

      return { status: 'success', payload: [payload] };
    } catch (err) {
      if (err instanceof RpcException) throw err;

      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Something went wrong.',
      });
    }
  };
}
