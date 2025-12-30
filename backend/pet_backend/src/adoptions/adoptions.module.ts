import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import this
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { Adoption } from './entities/adoption.entity'; // Import your entity

@Module({
  imports: [TypeOrmModule.forFeature([Adoption])], // ✅ Add this line!
  controllers: [AdoptionsController],
  providers: [AdoptionsService],
})
export class AdoptionsModule {}