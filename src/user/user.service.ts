import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse, buildResponseMeta } from 'common/response-util';
import { PageFilters, TypeFilters, TypeWhere } from 'src/type/interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // create(payload: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findOne(id: number) {
    const response = await this.prisma.client.users.findUnique({
      where: {
        id,
      },
    });

    if (!response) {
      throw new NotFoundException('User not found');
    }
    delete response.password;

    return buildResponse('User found', response);
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

    const response = await this.prisma.client.users.findMany({
      where,
      orderBy: {
        id: 'asc',
      },
      skip: Number((page - 1) * per_page),
      take: Number(per_page),
    });

    if (response.length > 0) {
      response.forEach((user) => {
        delete user.password;
      });
    }

    const total = await this.countAll();
    const meta = {
      total,
      page: Number(page),
      per_page: Number(per_page),
    };

    return buildResponseMeta('Users list', response, meta);
  }

  async findMe(id: number) {
    const response = await this.prisma.client.users.findUnique({
      where: {
        id,
      },
    });

    if (!response) {
      throw new NotFoundException('User not found');
    }

    delete response.password;

    return buildResponse('User found', response);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    await this.checkData(id);
    const response = await this.prisma.client.users.delete({ id });
    return buildResponse('User deleted', response);
  }

  async countAll() {
    const totalCount = await this.prisma.client.users.count();
    return totalCount;
  }

  async checkData(id: number) {
    const dataExisting = await this.prisma.client.users.findUnique({
      where: {
        id,
      },
    });

    if (!dataExisting) {
      throw new NotFoundException('User not found');
    }
  }
}
