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
  Model,
  PrimaryKey,
  Sequelize,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Heartbeat } from './heartbeat.model';
import { Membership } from './membership.model';
import { Schedule } from './schedule.model';
import { Target } from './target.model';
import { Url } from './url.model';

@Table({
  tableName: 'pulses',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Pulse extends Model<Pulse> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Target)
  @AllowNull(true)
  @Column({ field: 'targets_id', type: DataType.INTEGER })
  targetId?: number;

  @ForeignKey(() => Url)
  @AllowNull(true)
  @Column({ field: 'url_id', type: DataType.INTEGER })
  urlId?: number;

  @ForeignKey(() => Membership)
  @AllowNull(true)
  @Column({ field: 'triggered_by', type: DataType.INTEGER })
  triggeredBy?: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  stage!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  provider!: number;

  @ForeignKey(() => Schedule)
  @AllowNull(true)
  @Column({ field: 'schedules_id', type: DataType.INTEGER })
  scheduleId?: number;

  @AllowNull(false)
  @Unique('uuid_unique_idx_pulses')
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
  @BelongsTo(() => Target)
  target?: Target;

  @BelongsTo(() => Url)
  url?: Url;

  @BelongsTo(() => Membership, { foreignKey: 'triggeredBy' })
  triggeredByMembership?: Membership;

  @BelongsTo(() => Schedule)
  schedule?: Schedule;

  @HasMany(() => Heartbeat)
  heartbeats!: Heartbeat[];

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
