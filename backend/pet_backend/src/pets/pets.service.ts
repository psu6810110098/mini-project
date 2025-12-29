import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  // --- CREATE ---
  async create(createPetDto: CreatePetDto) {
    const { tagIds, ...petData } = createPetDto;

    // 1. Create the Pet instance
    const pet = this.petRepository.create(petData);

    // 2. If tagIds are sent, find them in DB and link them
    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagRepository.findBy({ id: In(tagIds) });
      pet.tags = tags; // NestJS handles the join table automatically
    }

    return this.petRepository.save(pet);
  }

  // --- FIND ALL ---
  findAll() {
    // relations: ['tags'] ensures we get the tags in the response
    return this.petRepository.find({ relations: ['tags'] });
  }

  // --- FIND ONE ---
  async findOne(id: number) {
    const pet = await this.petRepository.findOne({ 
      where: { id },
      relations: ['tags'] 
    });
    if (!pet) throw new NotFoundException(`Pet #${id} not found`);
    return pet;
  }

  // --- UPDATE ---
  async update(id: number, updatePetDto: UpdatePetDto) {
    const { tagIds, ...petData } = updatePetDto;
    
    // 1. Check if pet exists
    const pet = await this.findOne(id);

    // 2. Update basic fields
    Object.assign(pet, petData);

    // 3. Update tags if provided (replaces old tags)
    if (tagIds) {
      const tags = await this.tagRepository.findBy({ id: In(tagIds) });
      pet.tags = tags;
    }

    return this.petRepository.save(pet);
  }

  // --- REMOVE ---
  async remove(id: number) {
    const pet = await this.findOne(id);
    return this.petRepository.remove(pet);
  }
}