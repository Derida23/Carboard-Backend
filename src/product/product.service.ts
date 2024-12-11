import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { buildResponse, buildResponseMeta } from '../../common/response-util';
import { ProductFilters } from './interface';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(payload: CreateProductDto, image?: string) {
    if (!image) {
      throw new BadRequestException('Image product cannot be empty');
    }

    const { id_type, id_mark, id_transmission, id_fuel } = payload;

    // Validate related IDs
    const [type, mark, transmission, fuel] = await Promise.all([
      this.prisma.client.types.findUnique({ where: { id: Number(id_type) } }),
      this.prisma.client.marks.findUnique({ where: { id: Number(id_mark) } }),
      this.prisma.client.transmissions.findUnique({
        where: { id: Number(id_transmission) },
      }),
      this.prisma.client.fuels.findUnique({ where: { id: Number(id_fuel) } }),
    ]);

    if (!type) {
      throw new NotFoundException(`Type not found.`);
    }
    if (!mark) {
      throw new NotFoundException(`Mark not found.`);
    }
    if (!transmission) {
      throw new NotFoundException(`Transmission not found.`);
    }
    if (!fuel) {
      throw new NotFoundException(`Fuel not found.`);
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
    };
    const response = await this.prisma.client.products.create({
      data,
    });

    return buildResponse('Product created', response);
  }

  async findAll(
    filters: ProductFilters,
    pagination: { page: number; per_page: number },
  ) {
    const {
      start_date,
      end_date,
      name,
      id_type,
      id_mark,
      id_transmission,
      id_fuel,
    } = filters;
    const { page = 1, per_page = 10 } = pagination;

    const where: Record<string, any> = {};
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

    const total = await this.countAll();
    const response = await this.prisma.client.products.findMany({
      where,
      orderBy: {
        id: 'asc',
      },
      skip: Number((page - 1) * per_page),
      take: Number(per_page),
      include: {
        type: true,
        mark: true,
        transmission: true,
        fuel: true,
      },
    });
    const meta = {
      total,
      page: Number(page),
      per_page: Number(per_page),
    };
    return buildResponseMeta('Product list', response, meta);
  }

  async findOne(id: number) {
    const response = await this.prisma.client.products.findUnique({
      where: {
        id,
      },
      include: {
        type: true,
        mark: true,
        transmission: true,
        fuel: true,
      },
    });

    return buildResponse('Product found', response);
  }

  async update(id: number, payload: UpdateProductDto, image: string) {
    await this.CheckData(id);

    const { id_type, id_mark, id_transmission, id_fuel } = payload;

    // Validate related IDs
    const [type, mark, transmission, fuel] = await Promise.all([
      this.prisma.client.types.findUnique({ where: { id: Number(id_type) } }),
      this.prisma.client.marks.findUnique({ where: { id: Number(id_mark) } }),
      this.prisma.client.transmissions.findUnique({
        where: { id: Number(id_transmission) },
      }),
      this.prisma.client.fuels.findUnique({ where: { id: Number(id_fuel) } }),
    ]);

    if (!type) {
      throw new NotFoundException(`Type not found.`);
    }
    if (!mark) {
      throw new NotFoundException(`Mark not found.`);
    }
    if (!transmission) {
      throw new NotFoundException(`Transmission not found.`);
    }
    if (!fuel) {
      throw new NotFoundException(`Fuel not found.`);
    }

    const data = {
      ...payload,
      image,
      ...[
        'price',
        'id_type',
        'id_mark',
        'id_transmission',
        'id_fuel',
        'seat',
      ].reduce(
        (acc, key) => {
          if (payload[key]) {
            acc[key] = Number(payload[key]);
          }
          return acc;
        },
        {} as Record<string, number>,
      ),
    };

    const response = await this.prisma.client.products.update({
      where: {
        id,
      },
      data,
    });

    return buildResponse('Product updated', response);
  }

  async remove(id: number) {
    await this.CheckData(id);
    const response = await this.prisma.client.products.delete({ id });
    return buildResponse('Product deleted', response);
  }

  async CheckData(id: number) {
    const dataExisting = await this.prisma.client.products.findUnique({
      where: {
        id,
      },
    });
    if (!dataExisting) {
      throw new NotFoundException('Product not found');
    }
  }

  async countAll() {
    const totalCount = await this.prisma.client.marks.count();
    return totalCount;
  }
}
