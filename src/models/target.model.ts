import {
  AllowNull,
  AutoIncrement,
  BeforeFind,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Sequelize,
  Table,
  Unique,
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
  @Unique('uuid_unique_idx_targets')
  @Column({
    type: DataType.BLOB('tiny'),
    get() {
      const rawValue = this.getDataValue('uuid');
      return rawValue
        ? [
            rawValue.toString('hex').slice(0, 8),
            rawValue.toString('hex').slice(8, 12),
            rawValue.toString('hex').slice(12, 16),
            rawValue.toString('hex').slice(16, 20),
            rawValue.toString('hex').slice(20),
          ].join('-')
        : null;
    },
    set(value: string) {
      if (value) {
        this.setDataValue('uuid', Buffer.from(value.replace(/-/g, ''), 'hex'));
      }
    },
    defaultValue: Sequelize.fn('UUID_TO_BIN', Sequelize.fn('UUID')),
  })
  uuid!: Buffer;

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

  @HasOne(() => Baseline)
  baseline!: Baseline;

  @HasMany(() => Schedule)
  schedules!: Schedule[];

  @HasMany(() => Pulse)
  pulses!: Pulse[];

  @HasMany(() => Statistic)
  statistics!: Statistic[];

  @BeforeFind
  static convertUuidBeforeFind(options: any) {
    if (
      options.where &&
      typeof options.where === 'object' &&
      'uuid' in options.where
    ) {
      const where = options.where as Record<string, any>;
      if (typeof where.uuid === 'string') {
        where.uuid = Buffer.from(where.uuid.replace(/-/g, ''), 'hex');
      } else if (Array.isArray(where.uuid)) {
        // Handle arrays of UUIDs (e.g., using `Op.in`)
        where.uuid = where.uuid.map((uuid) =>
          Buffer.from(uuid.replace(/-/g, ''), 'hex'),
        );
      }
    }
  }
}
