import { UserGender, UserRole } from 'src/users/entities/user.entity';

export class RegisterDto {
  email: string;
  password: string;
  full_name: string;
  gender: UserGender;
  role?: UserRole;
}
