import { Module } from '@nestjs/common';
import { TransmissionService } from './transmission.service';
import { TransmissionController } from './transmission.controller';
import { PrismaModule } from '../../src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [TransmissionController],
  providers: [TransmissionService],
})
export class TransmissionModule {}
