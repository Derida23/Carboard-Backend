import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { buildResponse, buildResponseMeta } from '../../common/response-util';
import { MarkFilters, MarkWhere, PageFilters } from './interface';

@Injectable()
export class MarkService {
  constructor(
    private prisma: PrismaService
  ) { }
  async create(payload: CreateMarkDto) {
    const response = await this.prisma.client.marks.create({
      data: payload
    })
    return buildResponse('Mark created', response)
  }

  async findAll(filters: MarkFilters, pagination: PageFilters) {
    const { start_date, end_date, name } = filters;
    const { page = 1, per_page = 10 } = pagination;

    const where: MarkWhere = {};
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
    const total = await this.countAll()
    const response = await this.prisma.client.marks.findMany({
      where,
      orderBy: {
        id: 'asc'
      },
      skip: Number((page - 1) * per_page),
      take: Number(per_page),
    })

    const meta = {
      total,
      page: Number(page),
      per_page: Number(per_page),
    }
    return buildResponseMeta('Fuel list', response, meta)
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
  async countAll() {
    const totalCount = await this.prisma.client.marks.count();
    return totalCount
  }
}
