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
import { Assignment } from './assignment.model';
import { Schedule } from './schedule.model';
import { Team } from './team.model';

@Table({
  tableName: 'projects',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Project extends Model<Project> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Team)
  @AllowNull(false)
  @Column({ field: 'teams_id', type: DataType.INTEGER })
  teamId!: number;

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
  @BelongsTo(() => Team)
  team!: Team;

  @HasMany(() => Assignment)
  assignments!: Assignment[];

  @HasMany(() => Schedule)
  schedules!: Schedule[];
}
