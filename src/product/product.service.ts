import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse } from 'common/response-util';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService
  ) { }
  
  async create(payload: CreateProductDto) {
    const response = await this.prisma.client.products.create({
      data: payload
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

  async update(id: number, payload: UpdateProductDto) {
    await this.CheckData(id)
    const response = await this.prisma.client.products.update({
      where: {
        id
      },
      data: payload
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
