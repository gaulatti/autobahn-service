import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Platform } from 'src/models/platform.model';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectModel(Platform) private readonly platform: typeof Platform,
  ) {}

  /**
   * Finds an existing platform by user agent and type, or creates a new one if it doesn't exist.
   *
   * @param userAgent - The user agent string to search for.
   * @param type - The type of platform, either 'desktop' or 'mobile'.
   * @returns A promise that resolves to the found or newly created Platform.
   */
  async findOrCreate(
    userAgent: string,
    type: 'desktop' | 'mobile',
  ): Promise<Platform> {
    const [platform] = await this.platform.findOrCreate({
      where: { userAgent, type },
    });
    return platform;
  }
}
