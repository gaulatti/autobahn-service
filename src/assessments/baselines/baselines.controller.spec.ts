import { Test, TestingModule } from '@nestjs/testing';
import { BaselinesController } from './baselines.controller';

describe('BaselinesController', () => {
  let controller: BaselinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaselinesController],
    }).compile();

    controller = module.get<BaselinesController>(BaselinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
