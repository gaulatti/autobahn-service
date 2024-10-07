import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Assignment } from './assignment.model';
import { Pulse } from './pulse.model';
import { Team } from './team.model';
import { User } from './user.model';

@Table({
  tableName: 'memberships',
  timestamps: false,
  underscored: true,
})
export class Membership extends Model<Membership> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ field: 'users_id', type: DataType.INTEGER })
  userId!: number;

  @ForeignKey(() => Team)
  @AllowNull(false)
  @Column({ field: 'teams_id', type: DataType.INTEGER })
  teamId!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  role!: number;

  // Associations
  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Team)
  team!: Team;

  @HasMany(() => Assignment)
  assignments!: Assignment[];

  @HasMany(() => Pulse, 'triggeredBy')
  pulsesTriggered!: Pulse[];
}
