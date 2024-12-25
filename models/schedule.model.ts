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
import { Project } from './project.model';
import { Target } from './target.model';

@Table({
  tableName: 'schedules',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Schedule extends Model<Schedule> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Target)
  @AllowNull(false)
  @Column({ field: 'targets_id', type: DataType.INTEGER })
  targetId!: number;

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column({ field: 'projects_id', type: DataType.INTEGER })
  projectId!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  provider!: number;

  @AllowNull(false)
  @Column(DataType.STRING(45))
  cron!: string;

  @AllowNull(false)
  @Column({ field: 'next_execution', type: DataType.DATE })
  nextExecution!: Date;

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
  @BelongsTo(() => Target)
  target!: Target;

  @BelongsTo(() => Project)
  project!: Project;
}
