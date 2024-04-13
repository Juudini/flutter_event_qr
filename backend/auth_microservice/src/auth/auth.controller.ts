import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { SigninUserDto, SignupUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.signup.user')
  signupUser(@Payload() signupUserDto: SignupUserDto) {
    return this.authService.signupUser(signupUserDto);
  }

  @MessagePattern('auth.signin.user')
  signinUser(@Payload() signinUserDto: SigninUserDto) {
    return this.authService.signinUser(signinUserDto);
  }

  @MessagePattern('auth.verify.user')
  verifyUser(@Payload() token: string) {
    return this.authService.verifyToken(token);
  }
}
