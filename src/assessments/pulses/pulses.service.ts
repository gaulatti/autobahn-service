import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Heartbeat } from 'src/models/heartbeat.model';
import { Membership } from 'src/models/membership.model';
import { Pulse } from 'src/models/pulse.model';
import { Target } from 'src/models/target.model';
import { User } from 'src/models/user.model';
import { Url } from 'src/models/url.model';
import { Schedule } from 'src/models/schedule.model';
import { Project } from 'src/models/project.model';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { streamToString } from 'src/utils/s3';
import { Readable } from 'stream';

const client = new S3Client();

@Injectable()
export class PulsesService {
  constructor(
    @InjectModel(Pulse)
    private readonly pulse: typeof Pulse,
  ) {}

  /**
   * Retrieves all pulses along with their associated Heartbeat, Url, Target,
   * and Membership models. The Membership model includes associated User models.
   * The results are distinct and include a count of the total number of pulses.
   *
   * @returns {Promise<{ rows: Pulse[], count: number }>} A promise that resolves
   * to an object containing an array of pulses and the total count.
   */
  async allPulses(): Promise<{ rows: Pulse[]; count: number }> {
    return this.pulse.findAndCountAll({
      include: [
        { model: Heartbeat },
        { model: Url },
        { model: Target },
        {
          model: Membership,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
      distinct: true,
    });
  }

  getPulse(uuid: string): Promise<Pulse> {
    return this.pulse.findOne({
      where: { uuid },
      include: [
        { model: Heartbeat },
        { model: Url },
        { model: Target },
        { model: Schedule, include: [{ model: Project }] },
        {
          model: Membership,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });
  }

  async getHeartbeat(uuid: string, isMobile = false): Promise<string> {
    const bucketName = process.env.BUCKET_NAME;
    const key = `${uuid}.${isMobile ? 'mobile' : 'desktop'}.json`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await client.send(command);
    return streamToString(response.Body as Readable);
  }
}
