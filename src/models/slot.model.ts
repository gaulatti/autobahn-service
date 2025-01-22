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
import { Plugin } from './plugin.model';
import { Strategy } from './strategy.model';

@Table({
  tableName: 'slots',
  timestamps: false,
  underscored: true,
})
export class Slot extends Model<Slot> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Strategy)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  strategiesId!: number;

  @ForeignKey(() => Plugin)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  pluginsId!: number;

  @BelongsTo(() => Plugin)
  plugin!: Plugin;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  order!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'max_retries', defaultValue: 0 })
  maxRetries!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'min_outputs' })
  minOutputs!: number;

  @AllowNull(false)
  @Column({
    type: DataType.JSON,
    get() {
      const rawValue = this.getDataValue('metadata');
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
  metadata!: object;
}
