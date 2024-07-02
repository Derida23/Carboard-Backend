import { Test, TestingModule } from '@nestjs/testing';
import { TypeController } from '../type.controller';
import { TypeService } from '../type.service';
import { CreateTypeDto } from '../dto/create-type.dto';
import { UpdateTypeDto } from '../dto/update-type.dto';
import { RolesGuard } from '../../../src/auth/roles/roles.guard';
import { AuthGuard } from '../../../src/auth/auth.guard';
import { Reflector } from '@nestjs/core';

describe('TypeController', () => {
  let controller: TypeController;
  let service: TypeService;

  const mockTypeService = {
    create: jest.fn((dto) => {
      return { id: Date.now(), ...dto };
    }),
    findAll: jest.fn(() => {
      return [{ id: 1, name: 'Test Type' }];
    }),
    findOne: jest.fn((id) => {
      return { id, name: 'Test Type' };
    }),
    update: jest.fn((id, dto) => {
      return { id, ...dto };
    }),
    remove: jest.fn((id) => {
      return { id, name: 'Deleted Type' };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeController],
      providers: [
        TypeService,
        {
          provide: TypeService,
          useValue: mockTypeService,
        },
        AuthGuard,
        RolesGuard,
        Reflector,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TypeController>(TypeController);
    service = module.get<TypeService>(TypeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a type', async () => {
      const dto: CreateTypeDto = { name: 'Test Type', description: 'Test Description', created_at: new Date() };
      const result = await controller.create(dto);
      expect(result).toEqual({
        id: expect.any(Number),
        name: 'Test Type',
        description: 'Test Description',
        created_at: expect.any(Date),
      });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of types', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 1, name: 'Test Type' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single type', async () => {
      const id = '1';
      const result = await controller.findOne(id);
      expect(result).toEqual({ id: 1, name: 'Test Type' });
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should update a type', async () => {
      const id = '1';
      const dto: UpdateTypeDto = { name: 'Updated Type' };
      const result = await controller.update(id, dto);
      expect(result).toEqual({ id: 1, name: 'Updated Type' });
      expect(service.update).toHaveBeenCalledWith(+id, dto);
    });
  });

  describe('remove', () => {
    it('should remove a type', async () => {
      const id = '1';
      const result = await controller.remove(id);
      expect(result).toEqual({ id: 1, name: 'Deleted Type' });
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
