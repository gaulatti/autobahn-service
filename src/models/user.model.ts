import {
  AllowNull,
  AutoIncrement,
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
import { Membership } from './membership.model';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(45))
  sub!: string;

  @AllowNull(false)
  @Column(DataType.STRING(45))
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(45))
  name!: string;

  @AllowNull(false)
  @Column({ field: 'last_name', type: DataType.STRING(45) })
  lastName!: string;

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
  @HasMany(() => Membership)
  memberships!: Membership[];
}
