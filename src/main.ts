import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // Configure WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
