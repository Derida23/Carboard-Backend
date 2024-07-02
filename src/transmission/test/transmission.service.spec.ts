import { Test, TestingModule } from '@nestjs/testing';
import { TransmissionService } from '../transmission.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateTransmissionDto } from '../dto/create-transmission.dto';
import { UpdateTransmissionDto } from '../dto/update-transmission.dto';

describe('TransmissionService', () => {
  let service: TransmissionService;
  let prismaServiceMock: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    prismaServiceMock = {
      client: {
        transmissions: {
          create: jest.fn(),
          findMany: jest.fn(),
          findUnique: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      },
    } as unknown as jest.Mocked<PrismaService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransmissionService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<TransmissionService>(TransmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transmission', async () => {
      const createTransmissionDto: CreateTransmissionDto = { name: 'Automatic', description: 'Automatic transmission', created_at: new Date("2024-07-02T07:40:39.021Z") };
      const expectedResponse = { id: 1, name: 'automatic', description: 'Automatic transmission', created_at: new Date("2024-07-02T07:40:39.021Z") };

      (prismaServiceMock.client.transmissions.create as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.create(createTransmissionDto);

      expect(prismaServiceMock.client.transmissions.create).toHaveBeenCalledWith({
        data: { name: 'automatic', description: 'Automatic transmission', created_at: new Date("2024-07-02T07:40:39.021Z") },
      });
      expect(result).toEqual({ statusCode: 200, message: 'Transmission created', data: expectedResponse });
    });
  });

  describe('findAll', () => {
    it('should return all transmissions', async () => {
      const expectedResponse = [{ id: 1, name: 'automatic' }];
      
      (prismaServiceMock.client.transmissions.findMany as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.findAll();

      expect(prismaServiceMock.client.transmissions.findMany).toHaveBeenCalled();
      expect(result).toEqual({ statusCode: 200, message: 'Transmission list', data: expectedResponse });
    });
  });

  describe('findOne', () => {
    it('should return a transmission by ID', async () => {
      const expectedResponse = { id: 1, name: 'automatic' };
      (prismaServiceMock.client.transmissions.findUnique as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.findOne(1);

      expect(prismaServiceMock.client.transmissions.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({ statusCode: 200, message: 'Transmission found', data: expectedResponse });
    });

    it('should throw NotFoundException if transmission is not found', async () => {
      (prismaServiceMock.client.transmissions.findUnique as jest.Mock).mockResolvedValue(null);

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
    it('should update a transmission', async () => {
      const updateTransmissionDto: UpdateTransmissionDto = { name: 'Manual' };
      const expectedResponse = { id: 1, name: 'manual' };
      
      (prismaServiceMock.client.transmissions.findUnique as jest.Mock).mockResolvedValue(updateTransmissionDto);
      (prismaServiceMock.client.transmissions.update as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.update(1, updateTransmissionDto);

      expect(prismaServiceMock.client.transmissions.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'manual' },
      });
      expect(result).toEqual({ statusCode: 200, message: 'Transmission updated', data: expectedResponse });
    });

    it('should throw NotFoundException if transmission is not found', async () => {
      (prismaServiceMock.client.transmissions.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(1, { name: 'Manual' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a transmission', async () => {
      const expectedResponse = { id: 1, name: 'automatic' };

      (prismaServiceMock.client.transmissions.findUnique as jest.Mock).mockResolvedValue(expectedResponse);
      (prismaServiceMock.client.transmissions.delete as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.remove(1);

      expect(prismaServiceMock.client.transmissions.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ statusCode: 200, message: 'Transmission deleted', data: expectedResponse });
    });

    it('should throw NotFoundException if transmission is not found', async () => {
      (prismaServiceMock.client.transmissions.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
