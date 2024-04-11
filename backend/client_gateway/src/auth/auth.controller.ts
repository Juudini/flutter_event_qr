import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { SigninUserDto, SignupUserDto } from './dto';
import { catchError } from 'rxjs';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('signup')
  signupUser(@Body() signupUserDto: SignupUserDto) {
    return this.client.send('auth.signup.user', signupUserDto).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('signin')
  signinUser(@Body() signinUserDto: SigninUserDto) {
    return this.client.send('auth.signin.user', signinUserDto).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyUser(@User() user: CurrentUser, @Token() token: string) {
    return { user, token };
  }
}
