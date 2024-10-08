import { Test, TestingModule } from '@nestjs/testing';
import { PulsesService } from './pulses.service';

describe('PulsesService', () => {
  let service: PulsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PulsesService],
    }).compile();

    service = module.get<PulsesService>(PulsesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
