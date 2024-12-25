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
import { Pulse } from './pulse.model';

@Table({
  tableName: 'heartbeats',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Heartbeat extends Model<Heartbeat> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Pulse)
  @AllowNull(false)
  @Column({ field: 'pulses_id', type: DataType.INTEGER })
  pulseId!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  retries!: number;

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

  @AllowNull(true)
  @Column({
    type: DataType.JSON,
    get() {
      const rawValue = this.getDataValue('screenshots');
      if (typeof rawValue === 'object' && rawValue !== null) {
        return rawValue;
      }

      /**
       * Safely parse the metadata field.
       */
      try {
        return rawValue ? JSON.parse(rawValue) : null;
      } catch (error) {
        console.error('Error parsing metadata:', error, rawValue);
        return null;
      }
    },
  })
  screenshots?: any;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  mode!: number;

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

  @AllowNull(false)
  @Column(DataType.INTEGER)
  status!: number;

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
  @BelongsTo(() => Pulse)
  pulse!: Pulse;
}
