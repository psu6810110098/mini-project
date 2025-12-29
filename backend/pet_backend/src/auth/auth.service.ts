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
import { User, UserRole } from '../users/entities/user.entity'; // Fixed import path to relative

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 1. Register: Receive data -> Hash Password -> Save
  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, full_name, gender } = registerDto;

    // Check if Email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ LOGIC ADDED: If email is 'admin@test.com', assign ADMIN role. Otherwise, USER.
    const role = email === 'admin@test.com' ? UserRole.ADMIN : UserRole.USER;

    // Create User Object
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      full_name,
      gender,
      role: role, // Use the variable we determined above
    });

    return this.userRepository.save(user);
  }

  // 2. Validate User & Login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    // Check if user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create JWT Payload
      const payload = { email: user.email, sub: user.id, role: user.role };

      return {
        access_token: this.jwtService.sign(payload), // Generate Token
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