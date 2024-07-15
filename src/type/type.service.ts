import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { buildResponse, buildResponseMeta } from '../../common/response-util';
import { TypeFilters, PageFilters, TypeWhere } from './interface';

@Injectable()
export class TypeService {
  constructor(private prisma: PrismaService) { }

  async create(payload: CreateTypeDto) {
    const response = await this.prisma.client.types.create({
      data: payload
    })
    return buildResponse('Type created', response)
  }

  async findAll(filters: TypeFilters, pagination: PageFilters) {
    const { start_date, end_date, name } = filters;
    const { page = 1, per_page = 10 } = pagination;

    const where: TypeWhere = {};
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
    const response = await this.prisma.client.types.findMany({
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
    const response = await this.prisma.client.types.findUnique({
      where: {
        id
      }
    })
    return buildResponse('Type found', response)
  }

  async update(id: number, payload: UpdateTypeDto) {
    await this.checkData(id)
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
  async countAll() {
    const totalCount = await this.prisma.client.fuels.count();
    return totalCount
  }
}
