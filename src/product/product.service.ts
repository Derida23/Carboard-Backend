import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { buildResponse, buildResponseMeta } from '../../common/response-util';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService
  ) { }
  
  async create(payload: CreateProductDto, image: string) {
    if (!image) {
      throw new BadRequestException('image product cannot be empty');
    }
    const data = {
      ...payload,
      price: Number(payload.price),
      id_type: Number(payload.id_type),
      id_mark: Number(payload.id_mark),
      id_transmission: Number(payload.id_transmission),
      id_fuel: Number(payload.id_fuel),
      seat: Number(payload.seat),
      image,
    }
    const response = await this.prisma.client.products.create({
      data
    })

    return buildResponse("Product created", response)
  }

  async findAll(filters: any, pagination: any) {
    const { start_date, end_date, name, id_type, id_mark, id_transmission, id_fuel } = filters;
    const { page = 1, per_page = 10 } = pagination;

    const where: any = {};
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

    if (id_fuel && id_fuel.length > 0) {
      where.id_fuel = {
        in: JSON.parse(id_fuel).map(Number),
      };
    }

    if (id_mark && id_mark.length > 0) {
      where.id_mark = {
        in: JSON.parse(id_mark).map(Number),
      };
    }

    if (id_transmission && id_transmission.length > 0) {
      where.id_transmission = {
        in: JSON.parse(id_transmission).map(Number),
      };
    }

    if (id_type && id_type.length > 0) {
      where.id_type = {
        in: JSON.parse(id_type).map(Number),
      };
    }

    const total = await this.countAll()
    const response = await this.prisma.client.products.findMany({
      where,
      orderBy: {
        id: 'asc'
      },
      skip: Number((page - 1) * per_page),
      take: Number(per_page),
      include: {
        type: true,
        mark: true,
        transmission: true,
        fuel: true,
      },
    })
    const meta = {
      total,
      page: Number(page),
      per_page: Number(per_page),
    }
    return buildResponseMeta('Product list', response, meta)
  }

  async findOne(id: number) {
    const response = await this.prisma.client.products.findUnique({
      where: {
        id
      },
    })

    return buildResponse('Product found', response)
  }

  async update(id: number, payload: UpdateProductDto, image: string) {
    await this.CheckData(id)
    const data: any = {
      ...payload,
      image,
    };

    if (payload.price) {
      data.price = Number(payload.price);
    }
    if (payload.id_type) {
      data.id_type = Number(payload.id_type);
    }
    if (payload.id_mark) {
      data.id_mark = Number(payload.id_mark);
    }
    if (payload.id_transmission) {
      data.id_transmission = Number(payload.id_transmission);
    }
    if (payload.id_fuel) {
      data.id_fuel = Number(payload.id_fuel);
    }
    if (payload.seat) {
      data.seat = Number(payload.seat);
    }

    const response = await this.prisma.client.products.update({
      where: {
        id
      },
      data
    })

    return buildResponse('Product updated', response)
  }

  async remove(id: number) {
    await this.CheckData(id)
    const response = await this.prisma.client.products.delete({id})
    return buildResponse('Product deleted', response)
  }

  async CheckData(id: number) {
    const dataExisting = await this.prisma.client.products.findUnique({
      where: {
        id
      }
    })
    if (!dataExisting) {
      throw new NotFoundException('Product not found')
    }
  }

  async countAll() {
    const totalCount = await this.prisma.client.marks.count();
    return totalCount
  }
}
