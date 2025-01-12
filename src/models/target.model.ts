import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Baseline } from './baseline.model';
import { TargetUrl } from './target.url.model';
import { Url } from './url.model';

@Table({
  tableName: 'targets',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Target extends Model<Target> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string;

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
  @BelongsToMany(() => Url, () => TargetUrl)
  urls!: Url[];

  @HasMany(() => Baseline)
  baselines!: Baseline[];
}
