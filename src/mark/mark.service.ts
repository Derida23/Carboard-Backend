import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse } from 'common/response-util';

@Injectable()
export class MarkService {
  constructor(
    private prisma: PrismaService
  ) { }
  async create(payload: CreateMarkDto) {
    payload.name = payload.name.toLowerCase()
    const response = await this.prisma.client.marks.create({
      data: payload
    })
    return buildResponse('Mark created', response)
  }

  async findAll() {
    const response = await this.prisma.client.marks.findMany({
      orderBy: {
        id: 'asc'
      }
    })
    return buildResponse('Mark list', response)
  }

  async findOne(id: number) {
    const response = await this.prisma.client.marks.findUnique({
      where: {
        id
      },
    })
    return  buildResponse('Mark found', response)
  }

  async update(id: number, payload: UpdateMarkDto) {
    await this.checkData(id)
    if(payload.name) {
      payload.name = payload.name.toLowerCase()
    }
    const response = await this.prisma.client.marks.update({
      where: {
        id
      },
      data: payload
    })
    return buildResponse('Mark updated', response)
  }

  async remove(id: number) {
    await this.checkData(id)
    const response = await this.prisma.client.marks.delete({id})
    return buildResponse('Mark deleted', response)
  }

  async checkData(id: number) {
    /**
     * Checking existing fuel
     * Throw error when not found
     */
    const dataExisting = await this.prisma.client.marks.findUnique({
      where: {
        id
      }
    })
    if (!dataExisting) {
      throw new NotFoundException('Mark not found')
    }
  }
}
