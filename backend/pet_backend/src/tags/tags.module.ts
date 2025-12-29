import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Import นี้
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Tag } from './entities/tag.entity'; // 2. Import Entity

@Module({
  imports: [TypeOrmModule.forFeature([Tag])], // 3. ใส่บรรทัดนี้สำคัญมาก!
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}