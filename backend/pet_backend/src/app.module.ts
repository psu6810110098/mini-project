import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Pet } from './pets/entities/pet.entity';
import { Tag } from './tags/entities/tag.entity';
// 1. ✅ Import Adoption เข้ามา
import { Adoption } from './adoptions/entities/adoption.entity'; 

import { PetsModule } from './pets/pets.module';
import { TagsModule } from './tags/tags.module';
import { AdoptionsModule } from './adoptions/adoptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
      
        autoLoadEntities: true, 
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    PetsModule,
    TagsModule,
    AdoptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}