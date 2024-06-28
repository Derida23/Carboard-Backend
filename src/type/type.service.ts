import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse } from 'common/response-util';

@Injectable()
export class TypeService {
  constructor(private prisma: PrismaService) { }

  async create(payload: CreateTypeDto) {
    payload.name = payload.name.toLowerCase()
    const response = await this.prisma.client.types.create({
      data: {
        name: payload.name
      }
    })
    return buildResponse('Type created', response)
  }

  async findAll() {
    const response = await this.prisma.client.types.findMany({
      orderBy: {
        id: 'asc'
      }
    })
    return buildResponse('Types found', response)
  }

  async findOne(id: number) {
    const response = await this.prisma.client.types.findUnique({
      where: {
        id
      }
    })
    return buildResponse('Type found', response)
  }

  async update(id: number, payload: UpdateTypeDto) {
    await this.checkData(id)
    if(payload.name) {
      payload.name = payload.name.toLowerCase()
    }
    const response = await this.prisma.client.types.update({
      where: {
        id
      },
      data: payload
    })
    return buildResponse('Type updated', response)
  }

  async remove(id: number) {
    await this.checkData(id)
    const response = await this.prisma.client.types.delete({id})
    return buildResponse('Type deleted', response)
  }

  async checkData(id: number) {
    /**
     * Checking existing fuel
     * Throw error when not found
     */
    const dataExisting = await this.prisma.client.types.findUnique({
      where: {
        id
      }
    })
    if (!dataExisting) {
      throw new NotFoundException('Type not found')
    }
  }
}
