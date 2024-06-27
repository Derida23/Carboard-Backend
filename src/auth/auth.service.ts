import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'utils/hash-password.util';
import { ApiResponse } from 'interface/response.type';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }
  
  async create(payload: CreateAuthDto) {
    const { email, password, ...rest } = payload;

    // Checking existing email
    const existingUser = await this.prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    // Encrypted password
    const hashedPassword = await hashPassword(password);
    await this.prisma.users.create({
      data: { ...rest, email, password: hashedPassword },
    });

    return this.buildResponse("Successfully registered");
  }

  private buildResponse(message: string, access_token = null): ApiResponse<string> {
    return {
      message: message,
      data: access_token,
      statusCode: 200,
    };
  }
}
