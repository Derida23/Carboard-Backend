import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse } from 'common/response-util';

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

  async findAll() {
    const response = await this.prisma.client.products.findMany({
      orderBy: {
        id: 'asc'
      }
    })
    return buildResponse('Product list', response)
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
}
