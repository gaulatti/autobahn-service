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
import { Membership } from './membership.model';
import { Project } from './project.model';

@Table({
  tableName: 'assignments',
  timestamps: false,
  underscored: true,
})
export class Assignment extends Model<Assignment> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column({ field: 'projects_id', type: DataType.INTEGER })
  projectId!: number;

  @ForeignKey(() => Membership)
  @AllowNull(false)
  @Column({ field: 'memberships_id', type: DataType.INTEGER })
  membershipId!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  role!: number;

  // Associations
  @BelongsTo(() => Project)
  project!: Project;

  @BelongsTo(() => Membership)
  membership!: Membership;
}
