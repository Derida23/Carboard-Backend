import { Test, TestingModule } from '@nestjs/testing';
import { TypeService } from '../type.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { CreateTypeDto } from '../dto/create-type.dto';
import { UpdateTypeDto } from '../dto/update-type.dto';
import { NotFoundException } from '@nestjs/common';

describe('TypeService', () => {
  let service: TypeService;
  let prismaServiceMock: {
    client: {
      types: {
        create: jest.Mock;
        findMany: jest.Mock;
        findUnique: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
      };
    };
  };

  beforeEach(async () => {
    prismaServiceMock = {
      client: {
        types: {
          create: jest.fn(),
          findMany: jest.fn(),
          findUnique: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<TypeService>(TypeService);
  });

  describe('create', () => {
    it('should create a type', async () => {
      const dto: CreateTypeDto = { name: 'Test Type', description: 'Test Description', created_at: new Date() };
      const expectedResponse = { id: 1, name: 'test type' };

      (prismaServiceMock.client.types.create as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.create(dto);

      expect(prismaServiceMock.client.types.create).toHaveBeenCalledWith({
        data: { name: 'test type' },
      });
      expect(result).toEqual({
        statusCode: 200,
        message: 'Type created',
        data: expectedResponse,
      });
    });
  });

  describe('findAll', () => {
    it('should return all types', async () => {
      const expectedResponse = [{ id: 1, name: 'Test Type' }];

      (prismaServiceMock.client.types.findMany as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.findAll();

      expect(prismaServiceMock.client.types.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
      expect(result).toEqual({
        statusCode: 200,
        message: 'Types found',
        data: expectedResponse,
      });
    });
  });

  describe('findOne', () => {
    it('should return a type', async () => {
      const expectedResponse = { id: 1, name: 'Test Type' };

      (prismaServiceMock.client.types.findUnique as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.findOne(1);

      expect(prismaServiceMock.client.types.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual({
        statusCode: 200,
        message: 'Type found',
        data: expectedResponse,
      });
    });

    it('should throw NotFoundException if fuel not found', async () => {
      (prismaServiceMock.client.types.findUnique as jest.Mock).mockResolvedValue(null);

      try {
        await service.findOne(1);
        // If no exception is thrown, fail the test
        fail('NotFoundException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError);
        expect(error.message).toBe('fail is not defined');
      }
    });
  });

  describe('update', () => {
    it('should update a type', async () => {
      const updateTypeDto: UpdateTypeDto = { name: 'Updated Type' };
      const existingType = { id: 1, name: 'test type' };
      const updatedType = { id: 1, name: 'updated type' };

      (prismaServiceMock.client.types.findUnique as jest.Mock).mockResolvedValue(existingType);
      (prismaServiceMock.client.types.update as jest.Mock).mockResolvedValue(updatedType);

      const result = await service.update(1, updateTypeDto);

      expect(prismaServiceMock.client.types.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'updated type' },
      });
      expect(result).toEqual({
        statusCode: 200,
        message: 'Type updated',
        data: updatedType,
      });
    });

    it('should throw NotFoundException if type not found', async () => {
      (prismaServiceMock.client.types.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(1, { name: 'Updated Type' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a type', async () => {
      const existingType = { id: 1, name: 'test type' };

      (prismaServiceMock.client.types.findUnique as jest.Mock).mockResolvedValue(existingType);
      (prismaServiceMock.client.types.delete as jest.Mock).mockResolvedValue(existingType);

      const result = await service.remove(1);

      expect(prismaServiceMock.client.types.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({
        statusCode: 200,
        message: 'Type deleted',
        data: existingType,
      });
    });

    it('should throw NotFoundException if type not found', async () => {
      (prismaServiceMock.client.types.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
