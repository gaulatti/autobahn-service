import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Engagement } from './engagement.model';
import { Pulse } from './pulse.model';
import { Target } from './target.model';

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
  @HasMany(() => Target)
  targets!: Target[];

  @HasMany(() => Engagement)
  engagements!: Engagement[];

  @HasMany(() => Pulse)
  pulses!: Pulse[];
}
