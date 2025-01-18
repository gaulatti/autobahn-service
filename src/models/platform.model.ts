import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Heartbeat } from './heartbeat.model';

@Table({
  tableName: 'platforms',
  timestamps: true,
  underscored: true,
})
export class Platform extends Model<Platform> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.ENUM('desktop', 'mobile'))
  type!: 'desktop' | 'mobile';

  @AllowNull(false)
  @Column(DataType.STRING)
  userAgent!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  slug?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  // Associations
  @HasMany(() => Heartbeat)
  heartbeats!: Heartbeat[];
}
