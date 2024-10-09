import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Url } from 'src/models/url.model';
import { PulsesService } from '../pulses/pulses.service';
import { calculateCWVStats, calculateScores } from 'src/utils/stats';

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel(Url) private readonly url: typeof Url,
    private readonly pulsesService: PulsesService,
  ) {}

  async allUrls() {
    return this.url.findAndCountAll();
  }

  async urlByUUID(uuid: string) {
    return this.url.findOne({ where: { uuid } });
  }

  urlsByTarget(uuid: string) {
    throw new Error('Method not implemented.');
  }

  async urlStats(uuid: string, from: Date, to: Date) {
    /**
     * Fetch the URL record by UUID
     */
    const url = await this.urlByUUID(uuid);

    /**
     * Fetch the pulses for the provided URL
     */
    const pulses = await this.pulsesService.pulsesByUrl(url.id, from, to);

    /**
     * Filter out pulses that don't have any completed heartbeats
     */
    const statPulses = pulses.filter(
      (pulse: { heartbeats: { status: number }[] }) =>
        pulse.heartbeats.every((heartbeat) => heartbeat.status === 4),
    );

    /**
     * Calculate the scores and CWV stats for the provided pulses
     */
    const scores = calculateScores(statPulses);
    const cwvStats = calculateCWVStats(statPulses);

    return { url, cwvStats, scores };
  }
}
