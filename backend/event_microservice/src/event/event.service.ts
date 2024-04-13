import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateEventDto, PaginationResultsProps, UpdateEventDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto, executePagination } from 'src/common';

@Injectable()
export class EventService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('EventService');

  onModuleInit() {
    this.$connect();
    this.logger.log('📚 Database Connected');
  }

  create = async (createEventDto: CreateEventDto) => {
    const { name, description, location, date, userId } = createEventDto;

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const dateInstance = new Date(date);

    try {
      const newEvent = await this.event.create({
        data: {
          code: code,
          date: dateInstance,
          description: description,
          location: location,
          name: name,
          userId: userId,
        },
      });

      return { status: 'success', payload: [newEvent] };
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
      const isEvent = await this.event.findUnique({
        where: { id: id, isDeleted: false },
      });

      if (!isEvent) {
        throw new RpcException({
          status: 'error',
          message: `Event not found or has been deleted.`,
          payload: [{ id }],
        });
      }

      return { status: 'success', payload: [isEvent] };
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
      const docs: number = await this.event.count({
        where: { isDeleted: false },
      });

      const skipValue = (page - 1) * limit;

      const events = await this.event.findMany({
        take: limit,
        skip: skipValue,
        orderBy: { createdAt: sort },
        where: { userId: userId, isDeleted: false },
      });

      const paginationResults: PaginationResultsProps = executePagination({
        page,
        limit,
        sort,
        endpointName: 'event',
        docs,
        items: events,
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

  update = async (updateEventDto: UpdateEventDto) => {
    const { id, ...updateData } = updateEventDto;
    try {
      await this.findOne(id);

      const payload = await this.event.update({
        where: { id: id, isDeleted: false },
        data: updateData,
      });

      if (!payload) {
        throw new RpcException({
          status: 'error',
          message: `Event not active`,
          payload: [{ id }],
        });
      }

      return { status: 'success', payload: [payload] };
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

      const payload = await this.event.update({
        where: { id: id },
        data: { isDeleted: true, isActive: false },
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
