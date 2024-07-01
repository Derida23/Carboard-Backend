import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hashPassword, comparePasswords } from '../../../utils/hash-password.util';

jest.mock('../../../utils/hash-password.util', () => ({
  hashPassword: jest.fn(),
  comparePasswords: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaServiceMock: PrismaService;
  let jwtServiceMock: JwtService;
  let configServiceMock: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        JwtService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaServiceMock = module.get<PrismaService>(PrismaService);
    jwtServiceMock = module.get<JwtService>(JwtService);
    configServiceMock = module.get<ConfigService>(ConfigService);
  });

  let mockPayload = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role: 'admin',
    address: '',
    avatar: '',
    phone_number: '',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: new Date(),
  };

  describe('create', () => {
    it('should create a new user', async () => {
      const hashedPassword = await hashPassword(mockPayload.password);

      jest.spyOn(prismaServiceMock.users, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaServiceMock.users, 'create').mockResolvedValue({ id: 1, ...mockPayload, password: hashedPassword });

      const result = await service.create(mockPayload);

      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual('Successfully registered');
      expect(result.data?.['access_token']).toBeNull();
    });

    it('should throw ConflictException if email is already in use', async () => {
      jest.spyOn(prismaServiceMock.users, 'findUnique').mockResolvedValue({...mockPayload, id: 1});

      await expect(service.create(mockPayload)).rejects.toThrowError(ConflictException);
    });
  });

  describe('login', () => {
    it('should log in with valid credentials', async () => {
      const mockEmail = 'test@example.com';
      const mockPassword = 'password123';
      const mockHashedPassword = 'hashedPassword123';
      const mockUser = { id: 1, email: mockEmail, password: mockHashedPassword, name: 'Test User', role: 'user' };

      (comparePasswords as jest.Mock).mockResolvedValue(true);

      jest.spyOn(prismaServiceMock.users, 'findUnique').mockResolvedValue(mockUser as any);
      jest.spyOn(jwtServiceMock, 'sign').mockReturnValue('mockAccessToken');

      const result = await service.login(mockEmail, mockPassword);

      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual('Successfully logged in');
      expect(result.data?.['access_token']).toEqual('mockAccessToken');
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const mockEmail = 'test@example.com';
      const mockPassword = 'invalidPassword';

      jest.spyOn(prismaServiceMock.users, 'findUnique').mockResolvedValue(null);

      await expect(service.login(mockEmail, mockPassword)).rejects.toThrowError(UnauthorizedException);
    });
  });
});
