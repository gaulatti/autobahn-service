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
import { Assignment } from './assignment.model';
import { Schedule } from './schedule.model';
import { Team } from './team.model';

@Table({
  tableName: 'projects',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Project extends Model<Project> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Team)
  @AllowNull(false)
  @Column({ field: 'teams_id', type: DataType.INTEGER })
  teamId!: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string;

  @AllowNull(false)
  @Unique('uuid_unique_idx_projects')
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
  @BelongsTo(() => Team)
  team!: Team;

  @HasMany(() => Assignment)
  assignments!: Assignment[];

  @HasMany(() => Schedule)
  schedules!: Schedule[];

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
