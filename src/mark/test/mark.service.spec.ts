import { Test, TestingModule } from '@nestjs/testing';
import { MarkService } from '../mark.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateMarkDto } from '../dto/create-mark.dto';
import { UpdateMarkDto } from '../dto/update-mark.dto';
import { buildResponse } from '../../../common/response-util';

describe('MarkService', () => {
  let service: MarkService;
  let prismaServiceMock: {
    client: {
      marks: {
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
        marks: {
          create: jest.fn(),
          findMany: jest.fn(),
          findUnique: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarkService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<MarkService>(MarkService);
  });

  describe('create', () => {
    it('should create a new mark', async () => {
      const dto: CreateMarkDto = { name: 'Test Mark', description: 'Test Description', created_at: new Date("2024-07-02T05:44:49.962Z") };
      const mockResponse = { id: 1, name: 'Test Mark', description: 'Test Description', created_at: new Date("2024-07-02T05:44:49.962Z") };
      (prismaServiceMock.client.marks.create as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.create(dto);

      expect(result).toEqual(buildResponse('Mark created', mockResponse));
      expect(prismaServiceMock.client.marks.create).toHaveBeenCalledWith({
        data: { name: 'test mark', description: 'Test Description', created_at: new Date("2024-07-02T05:44:49.962Z") },
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of marks', async () => {
      const mockMarks = [{ id: 1, name: 'test mark 1' }, { id: 2, name: 'test mark 2' }];
      (prismaServiceMock.client.marks.findMany as jest.Mock).mockResolvedValue(mockMarks);

      const result = await service.findAll();

      expect(prismaServiceMock.client.marks.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
      expect(result).toEqual({ message: 'Mark list', data: mockMarks, statusCode: 200 });
    });
  });

  describe('findOne', () => {
    it('should return a single mark by id', async () => {
      const mockMark = { id: 1, name: 'test mark' };
      (prismaServiceMock.client.marks.findUnique as jest.Mock).mockResolvedValue(mockMark);

      const result = await service.findOne(1);

      expect(prismaServiceMock.client.marks.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Mark found', data: mockMark, statusCode: 200 });
    });

    it('should throw NotFoundException when mark is not found', async () => {
      (prismaServiceMock.client.marks.findUnique as jest.Mock).mockResolvedValue(null);

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
    it('should update a mark by id', async () => {
      const mockPayload: UpdateMarkDto = { name: 'Updated Mark' };
      const mockResponse = { id: 1, name: 'updated mark' };
      (prismaServiceMock.client.marks.findUnique as jest.Mock).mockResolvedValue(mockResponse);
      (prismaServiceMock.client.marks.update as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.update(1, mockPayload);

      expect(prismaServiceMock.client.marks.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'updated mark' },
      });
      expect(result).toEqual({ message: 'Mark updated', data: mockResponse, statusCode: 200 });
    });

    it('should throw NotFoundException when mark to update is not found', async () => {
      (prismaServiceMock.client.marks.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(999, { name: 'Nonexistent Mark' })).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a mark by id', async () => {
      const mockResponse = { id: 1, name: 'test mark' };
      const expectedResponse = {};

      (prismaServiceMock.client.marks.findUnique as jest.Mock).mockResolvedValue(mockResponse);
      (prismaServiceMock.client.marks.delete as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await service.remove(1);

      expect(result).toEqual(buildResponse('Mark deleted', expectedResponse));
      expect(prismaServiceMock.client.marks.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when mark to delete is not found', async () => {
      (prismaServiceMock.client.marks.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
