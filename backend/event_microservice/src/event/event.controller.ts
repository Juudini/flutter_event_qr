import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEventDto, UpdateEventDto } from './dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern('create.event')
  create(@Payload() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @MessagePattern('find.all.events')
  findAllById(@Payload() id: string) {
    return this.eventService.findAllById(id);
  }

  @MessagePattern('update.event')
  update(@Payload() updateEventDto: UpdateEventDto, id: string) {
    return this.eventService.update(id, updateEventDto);
  }

  @MessagePattern('remove.event')
  remove(@Payload() id: string) {
    return this.eventService.remove(id);
  }
}
