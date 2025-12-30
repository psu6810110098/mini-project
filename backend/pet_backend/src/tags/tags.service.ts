import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  // สร้าง Tag ใหม่
  create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  // ดูทั้งหมด
  findAll() {
    return this.tagRepository.find();
  }

  // ดูอันเดียว
  async findOne(id: number) {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag #${id} not found`);
    return tag;
  }

  // แก้ไข
  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id); // เช็คก่อนว่ามีไหม
    Object.assign(tag, updateTagDto);   // อัปเดตค่า
    return this.tagRepository.save(tag);
  }

  // ลบ
  async remove(id: number) {
    const tag = await this.findOne(id);
    return this.tagRepository.remove(tag);
  }
}