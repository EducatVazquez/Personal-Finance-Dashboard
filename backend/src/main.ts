import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // This is the key line
    transformOptions: {
      enableImplicitConversion: true, // Allows conversion based on TypeScript types
    },
    forbidNonWhitelisted: true,
    whitelist: true
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
