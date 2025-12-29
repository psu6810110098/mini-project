import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Import this
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Tag } from './entities/tag.entity'; // <--- Import the Entity

@Module({
  // Register the Tag Entity here so TagsService can use the Repository
  imports: [TypeOrmModule.forFeature([Tag])], 
  
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}