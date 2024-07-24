import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse } from 'common/response-util';

@Injectable()
export class FilterService {
  constructor(
    private prisma: PrismaService
  ) { }

  async findAll() {
    const types = await this.prisma.client.types.findMany();
    const marks = await this.prisma.client.marks.findMany();
    const transmissions = await this.prisma.client.transmissions.findMany();
    const fuels = await this.prisma.client.fuels.findMany();

    const all = {types, marks, transmissions, fuels}
    return buildResponse('Filters found', all)
  }

}
