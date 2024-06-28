import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransmissionDto } from './dto/create-transmission.dto';
import { UpdateTransmissionDto } from './dto/update-transmission.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse } from '../../common/response-util';

@Injectable()
export class TransmissionService {
  constructor(
    private prisma: PrismaService
  ) { }
  
  async create(payload: CreateTransmissionDto) {

    /**
     * Create name is lowercase
     * Create transmission payload
     */
    payload.name = payload.name.toLowerCase()
    const response = await this.prisma.transmissions.create({
      data: payload
    })
    return buildResponse('Transmission created', response)
  }

  async findAll() {
    /**
     * Find all transmission
     */
    const response = await this.prisma.client.transmissions.findMany({
      orderBy: {
        id: 'asc'
      }
    })
    return buildResponse('Transmission list', response)
  }

  async findOne(id: number) {
    const response = await this.prisma.client.transmissions.findUnique({
      where: {
        id
      },
    })
    return buildResponse('Transmission found', response)
  }

  async update(id: number, payload: UpdateTransmissionDto) {
    await this.checkData(id)
    const response = await this.prisma.client.transmissions.update({
      where: {
        id
      },
      data: payload
    })
    return buildResponse('Transmission updated', response)
  }

  async remove(id: number) {
    await this.checkData(id)
    const response = await this.prisma.client.transmissions.delete({id})
    return buildResponse('Transmission deleted', response)
  }

  async checkData(id: number) {
    /**
     * Checking existing transmission
     * Throw error when not found
     */
    const dataExisting = await this.prisma.client.transmissions.findUnique({
      where: {
        id
      }
    })

    if(!dataExisting) {
      throw new NotFoundException('Transmission not found')
    }

    return
  }
}
