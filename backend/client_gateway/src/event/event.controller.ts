import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateEventDto, UpdateEventDto } from './dto';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('event')
export class EventController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createEvent: CreateEventDto) {
    return this.client.send('create.event', createEvent).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }

  @Get(':id')
  findAllById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.client.send('find.events.by.id', { id, ...paginationDto }).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('id/:id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('find.event', id).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.client.send('update.event', { id, ...updateEventDto }).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('remove.event', id).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }
}
