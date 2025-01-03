import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Target } from './target.model';
import { Url } from './url.model';

@Table({
  tableName: 'target_urls',
  timestamps: true,
  underscored: true,
})
export class TargetUrl extends Model<TargetUrl> {
  @ForeignKey(() => Target)
  @Column(DataType.INTEGER)
  targetsId!: number;

  @ForeignKey(() => Url)
  @Column(DataType.INTEGER)
  urlsId!: number;

  @Column({
    field: 'created_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;
}
