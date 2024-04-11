import { Role } from '@prisma/client';

export interface JwtPayload {
  email: string;
  id: string;
  name: string;
  lastName: string;
  role: Role;
}
