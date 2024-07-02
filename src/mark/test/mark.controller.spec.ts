import { Test, TestingModule } from '@nestjs/testing';
import { MarkController } from '../mark.controller';
import { MarkService } from '../mark.service';
import { CreateMarkDto } from '../dto/create-mark.dto';
import { UpdateMarkDto } from '../dto/update-mark.dto';
import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '../../../src/auth/auth.guard';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

describe('MarkController', () => {
  let controller: MarkController;
  let service: MarkService;

  const mockMarkService = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: Date.now(), ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Honda' }, { id: 2, name: 'Suzuki' }]),
    findOne: jest.fn().mockImplementation((id) => Promise.resolve({ id, name: 'Honda' })),
    update: jest.fn().mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
    remove: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarkController],
      providers: [
        MarkService,
        { provide: MarkService, useValue: mockMarkService },
        AuthGuard,
        RolesGuard,
        Reflector,
        JwtService
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({
      canActivate: jest.fn((context: ExecutionContext) => true),
    })
    .overrideGuard(RolesGuard)
    .useValue({
      canActivate: jest.fn((context: ExecutionContext) => true),
    })
    .compile();

    controller = module.get<MarkController>(MarkController);
    service = module.get<MarkService>(MarkService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new mark', async () => {
      const dto: CreateMarkDto = { name: 'Honda', description: 'Honda car', created_at: new Date() };
      expect(await controller.create(dto)).toEqual({
        id: expect.any(Number),
        ...dto,
      });
      expect(service.create).toHaveBeenCalledWith(dto);  
    });
  });

  describe('findAll', () => {
    it('should return a list of marks', async () => {
      expect(await controller.findAll()).toEqual([{ id: 1, name: 'Honda' }, { id: 2, name: 'Suzuki' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single mark by id', async () => {
      expect(await controller.findOne('1')).toEqual({ id: 1, name: 'Honda' });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a mark by id', async () => {
      const dto: UpdateMarkDto = { name: 'Honda' };
      expect(await controller.update('1', dto)).toEqual({ id: 1, ...dto });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a mark by id', async () => {
      expect(await controller.remove('1')).toEqual({});
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
