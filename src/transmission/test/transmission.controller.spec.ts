import { Test, TestingModule } from '@nestjs/testing';
import { TransmissionController } from '../transmission.controller';
import { TransmissionService } from '../transmission.service';
import { CreateTransmissionDto } from '../dto/create-transmission.dto';
import { UpdateTransmissionDto } from '../dto/update-transmission.dto';

describe('TransmissionController', () => {
  let controller: TransmissionController;
  let service: TransmissionService;

  const mockTransmissionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransmissionController],
      providers: [
        {
          provide: TransmissionService,
          useValue: mockTransmissionService,
        },
      ],
    }).compile();

    controller = module.get<TransmissionController>(TransmissionController);
    service = module.get<TransmissionService>(TransmissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transmission', async () => {
      const dto: CreateTransmissionDto = { name: 'Automatic', description: 'Automatic transmission', created_at: new Date() };
      const expectedResponse = { id: 1, name: 'automatic' };

      mockTransmissionService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAll', () => {
    it('should return all transmissions', async () => {
      const expectedResponse = [{ id: 1, name: 'automatic' }];

      mockTransmissionService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a transmission by ID', async () => {
      const expectedResponse = { id: 1, name: 'automatic' };

      mockTransmissionService.findOne.mockResolvedValue(expectedResponse);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('update', () => {
    it('should update a transmission', async () => {
      const updateTransmissionDto: UpdateTransmissionDto = { name: 'Manual' };
      const expectedResponse = { id: 1, name: 'manual' };

      mockTransmissionService.update.mockResolvedValue(expectedResponse);

      const result = await controller.update('1', updateTransmissionDto);

      expect(service.update).toHaveBeenCalledWith(1, updateTransmissionDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('remove', () => {
    it('should remove a transmission', async () => {
      const expectedResponse = { id: 1, name: 'automatic' };

      mockTransmissionService.remove.mockResolvedValue(expectedResponse);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResponse);
    });
  });
});
