import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import this
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { Adoption } from './entities/adoption.entity'; // Import your entity
import { Pet } from '../pets/entities/pet.entity'; // Import Pet entity

@Module({
  imports: [TypeOrmModule.forFeature([Adoption, Pet])], // Add Pet here
  controllers: [AdoptionsController],
  providers: [AdoptionsService],
})
export class AdoptionsModule {}