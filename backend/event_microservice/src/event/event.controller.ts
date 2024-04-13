import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEventDto, UpdateEventDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern('create.event')
  create(@Payload() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @MessagePattern('find.events.by.id')
  findAllById(@Payload() paginationDto: PaginationDto) {
    return this.eventService.findAllById(paginationDto);
  }

  @MessagePattern('find.event')
  findById(@Payload() id: string) {
    return this.eventService.findOne(id);
  }

  @MessagePattern('update.event')
  update(@Payload() updateEventDto: UpdateEventDto) {
    return this.eventService.update(updateEventDto);
  }

  @MessagePattern('remove.event')
  remove(@Payload() id: string) {
    return this.eventService.remove(id);
  }
}
