import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { comparePasswords, hashPassword } from '../../utils/hash-password.util';
import { ApiResponse } from '../../common/api-response';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }
  
  async create(payload: CreateAuthDto) {
    const { email, password, ...rest } = payload;

    /**
     * Checking existing email
     * Encrypted password
     */
    const existingUser = await this.prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await hashPassword(password);
    await this.prisma.users.create({
      data: { ...rest, email, password: hashedPassword },
    });

    return this.buildResponse("Successfully registered");
  }

  
  async login(email: string, password: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });

    /**
     * Checking user existing
     * Checking password is valid
     */
    if (!user) {
      throw new NotFoundException('Invalid credentials provided. Please check your email or password, and try again.');
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials provided. Please check your email or password, and try again.');
    }

    /**
     * Generate JWT
     */
    const payload = { email: user.email, sub: user.id, roles: user.role };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    return this.buildResponse("Successfully logged in", access_token);
  }

  private buildResponse(message: string, access_token: string | null = null): ApiResponse<{ access_token?: string | null }>
  {
    return {
      message: message,
      data: { access_token },
      statusCode: 200,
    };
  }
}
