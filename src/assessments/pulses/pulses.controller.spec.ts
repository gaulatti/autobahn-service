import { Test, TestingModule } from '@nestjs/testing';
import { PulsesController } from './pulses.controller';

describe('ExecutionsController', () => {
  let controller: PulsesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PulsesController],
    }).compile();

    controller = module.get<PulsesController>(PulsesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
