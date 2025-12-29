import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { Pet } from './entities/pet.entity';
import { Tag } from '../tags/entities/tag.entity';

@Module({
  // Register both entities so we can inject their repositories
  imports: [TypeOrmModule.forFeature([Pet, Tag])], 
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}