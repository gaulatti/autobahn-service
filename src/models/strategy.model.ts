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
import { Project } from './project.model';
import { Slot } from './slot.model';
import { Trigger } from './trigger.model';

@Table({
  tableName: 'strategies',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Strategy extends Model<Strategy> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  projectsId!: number;

  @AllowNull(false)
  @Column(DataType.STRING(45))
  name!: string;

  @HasMany(() => Trigger)
  triggers!: Trigger[];

  @HasMany(() => Slot)
  slots!: Slot[];

  @AllowNull(false)
  @Column(DataType.TEXT)
  slug!: string;

  @AllowNull(false)
  @Column(DataType.ENUM('PR', 'CERT', 'QA', 'CMS', 'STAGE', 'PROD'))
  stage!: 'PR' | 'CERT' | 'QA' | 'CMS' | 'STAGE' | 'PROD';

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
