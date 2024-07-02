import { Module } from '@nestjs/common';
import { MarkService } from './mark.service';
import { MarkController } from './mark.controller';
import { PrismaModule } from '../../src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MarkController],
  providers: [MarkService],
})
export class MarkModule {}
