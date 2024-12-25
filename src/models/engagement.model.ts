import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Url } from './url.model';

@Table({
  tableName: 'engagement',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Engagement extends Model<Engagement> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Url)
  @AllowNull(false)
  @Column({ field: 'url_id', type: DataType.INTEGER })
  urlId!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  bounceRate!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  mode!: number;

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
  @BelongsTo(() => Url)
  url!: Url;
}
