import { Test, TestingModule } from '@nestjs/testing';
import { MarkController } from '../mark.controller';
import { MarkService } from '../mark.service';

describe('MarkController', () => {
  let controller: MarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarkController],
      providers: [MarkService],
    }).compile();

    controller = module.get<MarkController>(MarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
