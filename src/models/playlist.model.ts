import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Membership } from './membership.model';
import { Slot } from './slot.model';
import { Strategy } from './strategy.model';
import { Trigger } from './trigger.model';

export type Manifest = {
  context: Record<string, any>;
  sequence: Slot[];
  executed_slots: Slot[];
};

@Table({
  tableName: 'playlists',
  timestamps: false,
  underscored: true,
})
export class Playlist extends Model<Playlist> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Membership)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  membershipsId!: number | null;

  @ForeignKey(() => Trigger)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  triggersId!: number | null;

  @ForeignKey(() => Strategy)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  strategiesId!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  slug!: string;

  @AllowNull(false)
  @Column({
    type: DataType.JSON,
    get() {
      const rawValue = this.getDataValue('manifest');
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
  manifest!: Manifest;

  @AllowNull(false)
  @Column(DataType.ENUM('CREATED', 'IN_PROCESS', 'FAILED', 'COMPLETE'))
  status!: 'CREATED' | 'IN_PROCESS' | 'FAILED' | 'COMPLETE';

  @AllowNull(true)
  @Column(DataType.STRING)
  nextStep!: string | null;
}
