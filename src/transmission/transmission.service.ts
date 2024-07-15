import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransmissionDto } from './dto/create-transmission.dto';
import { UpdateTransmissionDto } from './dto/update-transmission.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { buildResponse, buildResponseMeta } from '../../common/response-util';
import { TransmissionFilters, PageFilters, TransmissionWhere } from './interface';

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
    const response = await this.prisma.client.transmissions.create({
      data: payload
    })
    return buildResponse('Transmission created', response)
  }

  async findAll(filters: TransmissionFilters, pagination: PageFilters) {
    /**
     * Find all transmission
     */
    const { start_date, end_date, name } = filters;
    const { page = 1, per_page = 10 } = pagination;

    const where: TransmissionWhere = {};
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) {
        where.created_at.gte = new Date(start_date);
      }
      if (end_date) {
        where.created_at.lte = new Date(end_date);
      }
    }
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    const response = await this.prisma.client.transmissions.findMany({
      where,
      orderBy: {
        id: 'asc'
      },
      skip: Number((page - 1) * per_page),
      take: Number(per_page),
    })
    const total = await this.countAll()
    const meta = {
      total,
      page: Number(page),
      per_page: Number(per_page),
    }
    return buildResponseMeta('Fuel list', response, meta)
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

  async countAll() {
    const totalCount = await this.prisma.client.transmissions.count();
    return totalCount
  }
}
