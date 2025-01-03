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
  tableName: 'cwv_metrics',
  timestamps: true,
  underscored: true,
})
export class CwvMetric extends Model<CwvMetric> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Heartbeat)
  @AllowNull(false)
  @Column({ field: 'heartbeats_id', type: DataType.INTEGER })
  heartbeatId!: number;

  @AllowNull(false)
  @Default('0.00')
  @Column(DataType.DECIMAL(10, 2))
  ttfb!: number;

  @AllowNull(false)
  @Default('0.00')
  @Column(DataType.DECIMAL(10, 2))
  fcp!: number;

  @AllowNull(false)
  @Default('0.00')
  @Column(DataType.DECIMAL(10, 2))
  dcl!: number;

  @AllowNull(false)
  @Default('0.00')
  @Column(DataType.DECIMAL(10, 2))
  lcp!: number;

  @AllowNull(false)
  @Default('0.00')
  @Column(DataType.DECIMAL(10, 2))
  tti!: number;

  @AllowNull(false)
  @Default('0.00')
  @Column(DataType.DECIMAL(10, 2))
  si!: number;

  @AllowNull(false)
  @Default('0.00')
  @Column(DataType.DECIMAL(10, 2))
  cls!: number;

  @AllowNull(false)
  @Default('0.00')
  @Column(DataType.DECIMAL(10, 2))
  tbt!: number;

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
