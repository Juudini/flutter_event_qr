/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { SigninUserDto, SignupUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('📚 Database Connected');
  }

  signJWT = async (payload: JwtPayload) => {
    return this.jwtService.sign(payload);
  };

  verifyToken = async (token: string) => {
    try {
      const { sub, iat, exp, ...user } = await this.jwtService.verify(token, {
        secret: envs.jwtSecret,
      });

      return {
        status: 'success',
        payload: [
          {
            user: user,
            token: await this.signJWT(user),
          },
        ],
      };
    } catch (err) {
      if (err instanceof RpcException) throw err;
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Something went wrong.',
      });
    }
  };

  signupUser = async (signupUserDto: SignupUserDto) => {
    const { email, name, lastName, password, role } = signupUserDto;

    try {
      const user = await this.user.findUnique({ where: { email: email } });

      if (user) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: 'User already exists',
          payload: [{ email }],
        });
      }
      const newUser = await this.user.create({
        data: {
          email: email,
          password: bcrypt.hashSync(password, 10),
          lastName: lastName,
          name: name,
          role: role,
        },
      });

      const { password: __, ...rest } = newUser;

      return {
        status: 'success',
        payload: [
          {
            user: rest,
            token: await this.signJWT(rest),
          },
        ],
      };
    } catch (err) {
      if (err instanceof RpcException) throw err;
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Something went wrong.',
      });
    }
  };

  signinUser = async (signinUserDto: SigninUserDto) => {
    const { email, password } = signinUserDto;

    try {
      const user = await this.user.findUnique({
        where: { email: email },
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
          role: true,
          password: true,
        },
      });

      if (!user) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'User/Password not valid',
        });
      }
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'User/Password not valid',
        });
      }

      const { password: __, ...rest } = user;

      return {
        status: 'success',
        payload: [
          {
            user: rest,
            token: await this.signJWT(rest),
          },
        ],
      };
    } catch (err) {
      if (err instanceof RpcException) throw err;
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Something went wrong.',
      });
    }
  };
}
