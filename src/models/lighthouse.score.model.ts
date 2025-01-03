import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Heartbeat } from './heartbeat.model';

@Table({
  tableName: 'lighthouse_scores',
  timestamps: true,
  underscored: true,
})
export class LighthouseScore extends Model<LighthouseScore> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Heartbeat)
  @AllowNull(false)
  @Column({ field: 'heartbeats_id', type: DataType.INTEGER })
  heartbeatId!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  performanceScore!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  accessibilityScore!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  seoScore!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  bestPracticesScore!: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  // Associations
  @BelongsTo(() => Heartbeat)
  heartbeat!: Heartbeat;
}
