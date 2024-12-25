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
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Target } from './target.model';

@Table({
  tableName: 'baselines',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Baseline extends Model<Baseline> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Target)
  @AllowNull(false)
  @Unique('unique_baselines_targets_id')
  @Column({ field: 'targets_id', type: DataType.INTEGER })
  targetId!: number;

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
  @Column(DataType.INTEGER)
  mode!: number;

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
