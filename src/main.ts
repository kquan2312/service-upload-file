import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://cosplay-shop-mauve.vercel.app',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin not allowed by CORS'), false);
  },
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

  const dataSource = app.get(DataSource);

  if (dataSource.isInitialized) {
    const options = dataSource.options as any;

    console.log('======================================');
    console.log('PostgreSQL Connected Successfully');
    console.log(`Database: ${options.database}`);
    console.log(`Host: ${options.host}`);
    console.log(`Port: ${options.port}`);
    console.log('======================================');
  } else {
    console.log('PostgreSQL connection failed!');
  }

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`Server running on port ${port}`);
}

bootstrap();