import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { Role, RoleList } from '../enum/order.enum';

export class SignupUserDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsEnum(RoleList, {
    message: 'Invalid role.',
  })
  role: Role;
}
