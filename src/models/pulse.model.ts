import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
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
import { Heartbeat } from './heartbeat.model';
import { Playlist } from './playlist.model';
import { Url } from './url.model';

@Table({
  tableName: 'pulses',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Pulse extends Model<Pulse> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Url)
  @AllowNull(true)
  @Column({ field: 'url_id', type: DataType.INTEGER })
  urlId?: number;

  @ForeignKey(() => Playlist)
  @AllowNull(true)
  @Column({ field: 'playlists_id', type: DataType.INTEGER })
  playlistId!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  slug!: string;

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
  @BelongsTo(() => Url)
  url?: Url;

  @BelongsTo(() => Playlist, { foreignKey: 'playlistId' })
  playlist?: Playlist;

  @HasMany(() => Heartbeat)
  heartbeats!: Heartbeat[];
}
