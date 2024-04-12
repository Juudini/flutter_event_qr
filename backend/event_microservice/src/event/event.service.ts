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
    this.logger.log('PostgreSQL Connected');
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
      return newEvent;
    } catch (err) {
      throw new RpcException({
        message: 'Failed to create event. Please try again.',
        status: HttpStatus.BAD_REQUEST,
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
          message: `Event with id #${id} not found`,
          status: HttpStatus.NOT_FOUND,
        });
      }

      return isEvent;
    } catch (err) {
      throw new RpcException({
        message: 'Failed to find event. Please try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  };

  findAllById = async (paginationDto: PaginationDto) => {
    const { id, page, limit, sort } = paginationDto;

    try {
      const docs: number = await this.event.count();

      const skipValue = (page - 1) * limit;

      const events = await this.event.findMany({
        take: limit,
        skip: skipValue,
        orderBy: { createdAt: sort },
        where: { userId: id },
      });

      const paginationResults: PaginationResultsProps = executePagination({
        page,
        limit,
        sort,
        endpointName: 'events',
        docs,
        items: events,
      });

      return paginationResults;
    } catch (err) {
      throw new RpcException({
        message: 'Failed to find events. Please try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  };

  update = async (id: string, updateEventDto: UpdateEventDto) => {
    try {
      await this.findOne(id);

      const payload = await this.event.update({
        where: { id: id },
        data: updateEventDto,
      });

      return payload;
    } catch (err) {
      throw new RpcException({
        message: 'Failed to update event. Please try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  };

  remove = async (id: string) => {
    try {
      await this.event.findUnique({
        where: { id: id },
      });

      const payload = await this.event.update({
        where: { id: id },
        data: { isDeleted: true },
      });

      return payload;
    } catch (err) {
      throw new RpcException({
        message: 'Failed to remove event. Please try again.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  };
}
