import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFuelDto } from './dto/create-fuel.dto';
import { UpdateFuelDto } from './dto/update-fuel.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { buildResponse, buildResponseMeta } from '../../common/response-util';
import { FuelFilters, FuelWhere, PageFilters } from './interface';

@Injectable()
export class FuelService {
  constructor(
    private prisma: PrismaService
  ) { }
  async create(payload: CreateFuelDto) {
    /**
    * Create name is lowercase
    * Create fuel payload
    */
    const response = await this.prisma.client.fuels.create({
      data: payload
    })
    return buildResponse('Fuel created', response)
  }

  async findAll(filters: FuelFilters, pagination: PageFilters) {
    const { start_date, end_date, name } = filters;
    const { page = 1, per_page = 10 } = pagination;

    const where: FuelWhere = {};
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

    const response = await this.prisma.client.fuels.findMany({
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
    const response = await this.prisma.client.fuels.delete({ id })
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

  async countAll() {
    const totalCount = await this.prisma.client.fuels.count();
    return totalCount
  }
}
