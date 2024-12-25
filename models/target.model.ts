import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Baseline } from './baseline.model';
import { Pulse } from './pulse.model';
import { Schedule } from './schedule.model';
import { Statistic } from './statistic.model';
import { Url } from './url.model';

@Table({
  tableName: 'targets',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Target extends Model<Target> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  stage!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  provider!: number;

  @ForeignKey(() => Url)
  @AllowNull(true)
  @Column({ field: 'url_id', type: DataType.INTEGER })
  urlId?: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string;

  @AllowNull(true)
  @Column(DataType.STRING(110))
  lambdaArn?: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  slug!: string;

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
  @BelongsTo(() => Url)
  url?: Url;

  @HasMany(() => Baseline)
  baselines!: Baseline[];

  @HasMany(() => Schedule)
  schedules!: Schedule[];

  @HasMany(() => Pulse)
  pulses!: Pulse[];

  @HasMany(() => Statistic)
  statistics!: Statistic[];
}
