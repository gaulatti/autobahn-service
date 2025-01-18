import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Pulse } from './pulse.model';
import { CwvMetric } from './cwv.metric.model';
import { LighthouseScore } from './lighthouse.score.model';
import { Platform } from './platform.model';

@Table({
  tableName: 'heartbeats',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Heartbeat extends Model<Heartbeat> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Pulse)
  @AllowNull(false)
  @Column({ field: 'pulses_id', type: DataType.INTEGER })
  pulseId!: number;

  @ForeignKey(() => Platform)
  @AllowNull(false)
  @Column({ field: 'platforms_id', type: DataType.INTEGER })
  platformId!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  retries!: number;

  @AllowNull(true)
  @Column({
    type: DataType.JSON,
    get() {
      const rawValue = this.getDataValue('screenshots');
      if (typeof rawValue === 'object' && rawValue !== null) {
        return rawValue;
      }
      try {
        return rawValue ? JSON.parse(rawValue) : null;
      } catch (error) {
        console.error('Error parsing screenshots:', error, rawValue);
        return null;
      }
    },
  })
  screenshots?: any;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  status!: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt?: Date;

  // Associations
  @BelongsTo(() => Pulse)
  pulse!: Pulse;

  @BelongsTo(() => Platform)
  platform!: Platform;

  @HasMany(() => CwvMetric)
  cwvMetrics!: CwvMetric[];

  @HasMany(() => LighthouseScore)
  lighthouseScores!: LighthouseScore[];
}
