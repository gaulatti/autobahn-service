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
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Target } from './target.model';

@Table({
  tableName: 'statistics',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Statistic extends Model<Statistic> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Target)
  @AllowNull(false)
  @Column({ field: 'targets_id', type: DataType.INTEGER })
  targetId!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  provider!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  period!: number;

  @AllowNull(false)
  @Default('0.00')
  @Column(DataType.DECIMAL(10, 2))
  ttfb!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  fcp!: number;

  @AllowNull(false)
  @Default('0.00')
  @Column(DataType.DECIMAL(10, 2))
  dcl!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  lcp!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  tti!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  si!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  cls!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  mode!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  count!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  performanceScore!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  accessibilityScore!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  bestPracticesScore!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  seoScore!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  pleasantnessScore!: number;

  @AllowNull(false)
  @Column({ field: 'date_from', type: DataType.DATE })
  dateFrom!: Date;

  @AllowNull(false)
  @Column({ field: 'date_to', type: DataType.DATE })
  dateTo!: Date;

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
  target!: Target;
}
