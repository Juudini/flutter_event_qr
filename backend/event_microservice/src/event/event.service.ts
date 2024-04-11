import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateEventDto, UpdateEventDto } from './dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EventService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('EventService');

  onModuleInit() {
    this.$connect();
    this.logger.log('PostgreSQL Connected');
  }

  create = async (createEventDto: CreateEventDto) => {
    const { name, description, location, date, userId } = createEventDto;

    const newEvent = await this.event.create({
      data: {
        date: date,
        description: description,
        location: location,
        name: name,
        code: 'CODE20x', //Todo: generate code
        userId: userId,
      },
    });

    return newEvent;
  };

  findAllById = async (id: string) => {
    const events = await this.event.findMany({
      where: {
        userId: id,
        isDeleted: false,
      },
    });

    if (!events) return { status: false };

    return events;
  };

  update = async (id: string, updateEventDto: UpdateEventDto) => {
    const isEvent = await this.event.findUnique({
      where: { id: id },
    });

    if (!isEvent) {
      throw new RpcException({
        message: `Event with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const payload = await this.event.update({
      where: { id: id },
      data: updateEventDto,
    });

    return payload;
  };

  async remove(id: string) {
    await this.event.findUnique({
      where: { id: id },
    });

    const payload = await this.event.update({
      where: { id: id },
      data: { isDeleted: true },
    });

    return payload;
  }
}
