import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 1. Create User (Standard)
  async create(createUserDto: CreateUserDto) {
    // Note: ปกติเราจะ Register ผ่าน AuthService แต่ถ้า Admin สร้าง User เองก็ใช้ path นี้ได้
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  // 2. Find All Users
  async findAll() {
    return this.userRepository.find();
  }

  // 3. Find One (พระเอกของเรา: ดึงประวัติการรับเลี้ยงมาด้วย)
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      // ✅ Join ตาราง: เอาประวัติ Adoption และข้อมูล Pet ในใบเสร็จนั้นมาด้วย
      relations: ['adoptions', 'adoptions.pet'], 
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  // 4. Update User
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id); // เช็คก่อนว่ามีไหม
    // รวมข้อมูลใหม่เข้าไป
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updatedUser);
  }

  // 5. Remove User
  async remove(id: number) {
    const user = await this.findOne(id); // เช็คก่อนว่ามีไหม
    return this.userRepository.remove(user);
  }
}