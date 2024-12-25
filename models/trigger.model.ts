import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Strategy } from './strategy.model';

export type ScheduleContext = { next_execution: string; cron: string };
export type OnDemandContext = { arn: string };

@Table({
  tableName: 'triggers',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Trigger extends Model<Trigger> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Strategy)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  strategiesId!: number;

  @BelongsTo(() => Strategy)
  strategy!: Strategy;

  @AllowNull(false)
  @Column({
    type: DataType.JSON,
    get() {
      const rawValue = this.getDataValue('context');
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
  context!: object;

  @AllowNull(false)
  @Column(DataType.ENUM('ON_DEMAND', 'SCHEDULE'))
  type!: 'ON_DEMAND' | 'SCHEDULE';
}
