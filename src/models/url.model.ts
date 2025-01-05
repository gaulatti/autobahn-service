import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Pulse } from './pulse.model';
import { Target } from './target.model';
import { TargetUrl } from './target.url.model';

@Table({
  tableName: 'urls',
  timestamps: true,
  underscored: true,
})
export class Url extends Model<Url> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  url!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  slug!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  // Associations
  @BelongsToMany(() => Target, () => TargetUrl)
  targets!: Target[];

  @HasMany(() => Pulse)
  pulses!: Pulse[];
}
