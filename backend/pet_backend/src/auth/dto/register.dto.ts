import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserGender } from 'src/users/entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEnum(UserGender)
  gender: UserGender;
  
  // ลบ field role ออก เพื่อความปลอดภัย (บังคับ USER ที่ Service)
}
