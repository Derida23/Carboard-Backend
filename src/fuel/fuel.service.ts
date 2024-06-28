import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFuelDto } from './dto/create-fuel.dto';
import { UpdateFuelDto } from './dto/update-fuel.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { buildResponse } from 'common/response-util';

@Injectable()
export class FuelService {
  constructor(
    private prisma: PrismaService
  ) {}
  async create(payload: CreateFuelDto) {
     /**
     * Create name is lowercase
     * Create fuel payload
     */
    payload.name = payload.name.toLowerCase()
    const response = await this.prisma.client.fuels.create({
      data: payload
    })
    return buildResponse('Fuel created', response)
  }

  async findAll() {
    const response = await this.prisma.client.fuels.findMany({
      orderBy: {
        id: 'asc'
      }
    })
    return buildResponse('Fuel list', response)
  }

  async findOne(id: number) {
    const response = await this.prisma.client.fuels.findUnique({
      where: {
        id
      },
    })
    return buildResponse('Fuel found', response)
  }

  async update(id: number, payload: UpdateFuelDto) {
    await this.checkData(id)
    const response = await this.prisma.client.fuels.update({
      where: {
        id
      },
      data: payload
    })
    return buildResponse('Fuel updated', response)
  }

  async remove(id: number) {
    await this.checkData(id)
    const response = await this.prisma.client.fuels.delete({id})
    return buildResponse('Fuel deleted', response)
  }

  async checkData(id: number) {
    /**
     * Checking existing fuel
     * Throw error when not found
     */
    const dataExisting = await this.prisma.client.fuels.findUnique({
      where: {
        id
      }
    })
    if (!dataExisting) {
      throw new NotFoundException('Fuel not found')
    }
  }
}
