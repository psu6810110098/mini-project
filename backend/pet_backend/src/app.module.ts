import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // เพิ่ม import นี้
import { TypeOrmModule } from '@nestjs/typeorm'; // เพิ่ม import นี้
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity'; // ตรวจสอบ path ให้ถูก

@Module({
  imports: [
    // 1. โหลด Config จาก .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. เชื่อมต่อ Database (Postgres)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User], // ใส่ Entity User เข้าไป
        synchronize: true, // Auto create table (Dev only)
      }),
    }),

    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
