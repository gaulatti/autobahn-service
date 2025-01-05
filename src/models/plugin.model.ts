import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Slot } from './slot.model';
import { Team } from './team.model';

@Table({
  tableName: 'plugins',
  timestamps: true,
  paranoid: true,
  underscored: true,
  defaultScope: {
    attributes: { exclude: ['pluginKey'] },
  },
})
export class Plugin extends Model<Plugin> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Team)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  teamsId!: number;

  @AllowNull(false)
  @Column(DataType.STRING(60))
  name!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(60), field: 'plugin_key' })
  pluginKey!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  slug!: string;

  @AllowNull(false)
  @Column(
    DataType.ENUM('TRIGGER', 'PROVIDER', 'SOURCE', 'PROCESSING', 'DELIVERY'),
  )
  pluginType!: 'TRIGGER' | 'PROVIDER' | 'SOURCE' | 'PROCESSING' | 'DELIVERY';

  @AllowNull(false)
  @Column(DataType.STRING(2048))
  arn!: string;

  @HasMany(() => Slot)
  slots!: Slot[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt?: Date;
}
