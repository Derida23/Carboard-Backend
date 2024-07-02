import { Test, TestingModule } from '@nestjs/testing';
import { FuelService } from '../fuel.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { CreateFuelDto } from '../dto/create-fuel.dto';
import { UpdateFuelDto } from '../dto/update-fuel.dto';
import { NotFoundException } from '@nestjs/common';
import { buildResponse } from '../../../common/response-util';

describe('FuelService', () => {
  let service: FuelService;
  let prismaServiceMock: {
    client: {
      fuels: {
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
        fuels: {
          create: jest.fn(),
          findMany: jest.fn(),
          findUnique: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        }
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuelService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<FuelService>(FuelService);
  });

  describe('create', () => {
    it('should create a new fuel', async () => {
      const dto: CreateFuelDto = { name: 'Petrol', description: 'Petrol fuel', created_at: new Date("2024-07-02T07:29:31.276Z") };
      const expectedResponse = { id: 1, name: 'petrol', description: 'Petrol fuel', created_at: new Date("2024-07-02T07:29:31.276Z") };

      (prismaServiceMock.client.fuels.create as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.create(dto);

      expect(result).toEqual(buildResponse('Fuel created', expectedResponse));
      expect(prismaServiceMock.client.fuels.create).toHaveBeenCalledWith({ data: { name: 'petrol', description: 'Petrol fuel', created_at: new Date("2024-07-02T07:29:31.276Z") } });
    });
  });

  describe('findAll', () => {
    it('should return a list of fuels', async () => {
      const expectedResponse = [{ id: 1, name: 'petrol' }, { id: 2, name: 'diesel' }];

      (prismaServiceMock.client.fuels.findMany as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.findAll();

      expect(result).toEqual(buildResponse('Fuel list', expectedResponse));
      expect(prismaServiceMock.client.fuels.findMany).toHaveBeenCalledWith({ orderBy: { id: 'asc' } });
    });
  });

  describe('findOne', () => {
    it('should return a single fuel', async () => {
      const expectedResponse = { id: 1, name: 'petrol' };

      (prismaServiceMock.client.fuels.findUnique as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.findOne(1);

      expect(result).toEqual(buildResponse('Fuel found', expectedResponse));
      expect(prismaServiceMock.client.fuels.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if fuel not found', async () => {
      (prismaServiceMock.client.fuels.findUnique as jest.Mock).mockResolvedValue(null);

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
    it('should update a fuel', async () => {
      const dto: UpdateFuelDto = { name: 'Electric' };
      const existingFuel = { id: 1, name: 'petrol' };
      const expectedResponse = { id: 1, name: 'electric' };

      (prismaServiceMock.client.fuels.findUnique as jest.Mock).mockResolvedValue(existingFuel);
      (prismaServiceMock.client.fuels.update as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.update(1, dto);

      expect(result).toEqual(buildResponse('Fuel updated', expectedResponse));
      expect(prismaServiceMock.client.fuels.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { name: 'electric' } });
    });

    it('should throw NotFoundException if fuel not found', async () => {
      (prismaServiceMock.client.fuels.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(1, { name: 'Electric' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a fuel', async () => {
      const existingFuel = { id: 1, name: 'petrol' };
      const expectedResponse = {};

      (prismaServiceMock.client.fuels.findUnique as jest.Mock).mockResolvedValue(existingFuel);
      (prismaServiceMock.client.fuels.delete as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.remove(1);

      expect(result).toEqual(buildResponse('Fuel deleted', expectedResponse));
      expect(prismaServiceMock.client.fuels.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if fuel not found', async () => {
      (prismaServiceMock.client.fuels.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkData', () => {
    it('should throw NotFoundException if fuel not found', async () => {
      (prismaServiceMock.client.fuels.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.checkData(1)).rejects.toThrow(NotFoundException);
    });

    it('should return void if fuel exists', async () => {
      const existingFuel = { id: 1, name: 'petrol' };

      (prismaServiceMock.client.fuels.findUnique as jest.Mock).mockResolvedValue(existingFuel);

      await expect(service.checkData(1)).resolves.toBeUndefined();
    });
  });
});
