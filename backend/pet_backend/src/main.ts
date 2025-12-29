import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. Import ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 2. เปิดใช้งาน Validation แบบ Global + Whitelist
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    transform: true 
  }));

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();