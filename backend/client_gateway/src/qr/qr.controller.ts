import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateQrDto, VerifyQrDto } from './dto';

@Controller('qr')
export class QrController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('verify')
  verifyQr(@Body() ids: VerifyQrDto) {
    return this.client.send('verify.qr', ids).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }

  @Post()
  create(@Body() createQrDto: CreateQrDto) {
    return this.client.send('create.qr', createQrDto).pipe(
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
    return this.client.send('find.qrs.by.id', { id, ...paginationDto }).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('id/:id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('find.qr', id).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('remove.qr', id).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }
}
