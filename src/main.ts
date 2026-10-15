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
  origin: 'http://localhost:5173',
});
  const dataSource = app.get(DataSource);

  if (dataSource.isInitialized) {
    const options = dataSource.options as any;

    console.log('======================================');
    console.log('✅ PostgreSQL Connected Successfully');
    console.log(`🗄️ Database : ${options.database}`);
    console.log(`🌐 Host     : ${options.host}`);
    console.log(`🔌 Port     : ${options.port}`);
    console.log(`👤 User     : ${options.username}`);
    console.log('======================================');
  } else {
    console.log('❌ PostgreSQL connection failed!');
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on: http://localhost:${port}`);
}

bootstrap();