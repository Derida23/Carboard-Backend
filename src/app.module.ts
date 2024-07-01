import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransmissionModule } from './transmission/transmission.module';
import { FuelModule } from './fuel/fuel.module';
import { MarkModule } from './mark/mark.module';
import { TypeModule } from './type/type.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule globally available
    }),
    AuthModule,
    PrismaModule,
    TransmissionModule,
    FuelModule,
    MarkModule,
    TypeModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
