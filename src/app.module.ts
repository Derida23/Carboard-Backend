import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransmissionModule } from './transmission/transmission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule globally available
    }),
    AuthModule,
    PrismaModule,
    TransmissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
