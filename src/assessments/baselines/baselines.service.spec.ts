import { Test, TestingModule } from '@nestjs/testing';
import { BaselinesService } from './baselines.service';

describe('BaselinesService', () => {
  let service: BaselinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaselinesService],
    }).compile();

    service = module.get<BaselinesService>(BaselinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
