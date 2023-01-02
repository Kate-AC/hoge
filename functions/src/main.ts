import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import * as session from 'express-session';
import { sessionConfig, SessionParams } from 'infrastructure/session'

declare module 'express-session' {
  interface SessionData extends SessionParams {}
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session(sessionConfig));

  await app.listen(3000);
}
bootstrap();
