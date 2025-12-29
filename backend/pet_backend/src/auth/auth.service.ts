import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 1. Register: รับค่า -> Hash Password -> Save
  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, full_name, gender } = registerDto;

    // เช็คว่า Email ซ้ำไหม
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User Object
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      full_name,
      gender,
      role: UserRole.USER, // 👈 บังคับใส่ USER เท่านั้น
    });

    return this.userRepository.save(user);
  }

  // 2. Validate User & Login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    // เช็คว่ามี User ไหม และ Password ตรงไหม
    if (user && (await bcrypt.compare(password, user.password))) {
      // สร้าง JWT Payload
      const payload = { email: user.email, sub: user.id, role: user.role };

      return {
        access_token: this.jwtService.sign(payload), // สร้าง Token
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
        },
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
