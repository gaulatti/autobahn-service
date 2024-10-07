import {
  AllowNull,
  AutoIncrement,
  BeforeFind,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Sequelize,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Engagement } from './engagement.model';
import { Pulse } from './pulse.model';
import { Target } from './target.model';

@Table({
  tableName: 'urls',
  timestamps: true,
  underscored: true,
})
export class Url extends Model<Url> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  url!: string;

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
  uuid?: Buffer;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  // Associations
  @HasMany(() => Target)
  targets!: Target[];

  @HasMany(() => Engagement)
  engagements!: Engagement[];

  @HasMany(() => Pulse)
  pulses!: Pulse[];

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
