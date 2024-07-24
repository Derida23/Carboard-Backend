import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildResponse } from 'common/response-util';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  create(payload: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findMe(id: number) {
    const response = await this.prisma.client.users.findUnique({
      where: {
        id
      }
    })

    if (!response) {
      throw new NotFoundException('User not found')
    }

    delete response.password

    return buildResponse('User found', response)
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async checkData(id: number) {
    /**
     * Checking existing fuel
     * Throw error when not found
     */
    const dataExisting = await this.prisma.client.users.findUnique({
      where: {
        id
      }
    })
    if (!dataExisting) {
      throw new NotFoundException('User not found')
    }
  }
}
