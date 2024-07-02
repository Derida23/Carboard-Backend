import { Test, TestingModule } from '@nestjs/testing';
import { FuelController } from '../fuel.controller';
import { FuelService } from '../fuel.service';
import { AuthGuard } from '../../../src/auth/auth.guard';
import { RolesGuard } from '../../../src/auth/roles/roles.guard';
import { CreateFuelDto } from '../dto/create-fuel.dto';
import { UpdateFuelDto } from '../dto/update-fuel.dto';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('FuelController', () => {
  let controller: FuelController;
  let service: FuelService;

  const mockFuelService = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: Date.now(), ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Petrol' }, { id: 2, name: 'Diesel' }]),
    findOne: jest.fn().mockImplementation((id) => Promise.resolve({ id, name: 'Petrol' })),
    update: jest.fn().mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
    remove: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelController],
      providers: [
        FuelService,
        { provide: FuelService, useValue: mockFuelService },
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

    controller = module.get<FuelController>(FuelController);
    service = module.get<FuelService>(FuelService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new fuel', async () => {
      const dto: CreateFuelDto = { name: 'Electric', description: 'Electric fuel', created_at: new Date("2024-07-02T07:29:31.276Z") };
      expect(await controller.create(dto)).toEqual({
        id: expect.any(Number),
        ...dto,
      });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of fuels', async () => {
      expect(await controller.findAll()).toEqual([{ id: 1, name: 'Petrol' }, { id: 2, name: 'Diesel' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single fuel', async () => {
      expect(await controller.findOne('1')).toEqual({ id: 1, name: 'Petrol' });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a fuel', async () => {
      const dto: UpdateFuelDto = { name: 'Hybrid' };
      expect(await controller.update('1', dto)).toEqual({ id: 1, ...dto });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a fuel', async () => {
      expect(await controller.remove('1')).toEqual({});
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
