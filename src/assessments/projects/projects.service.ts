import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { Schedule } from 'src/models/schedule.model';
import { ProjectDto } from './project.dto';
import { Target } from 'src/models/target.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private readonly project: typeof Project,
  ) {}

  async allProjects(): Promise<{ rows: Project[]; count: number }> {
    return this.project.findAndCountAll();
  }

  async getProject(uuid: string): Promise<Project> {
    return this.project.findOne({
      where: { uuid },
      include: [{ model: Schedule, include: [{ model: Target }] }],
    });
  }

  async createProject(dto: ProjectDto): Promise<Project> {
    return this.project.create(dto);
  }

  async updateProject(uuid: string, dto: ProjectDto): Promise<Project> {
    await this.project.update(dto, {
      where: { uuid },
    });

    return this.getProject(uuid);
  }

  async deleteProject(uuid: string): Promise<void> {
    /**
     * TODO: Implement Soft Delete
     */
    const item = await this.getProject(uuid);
    await item.destroy();
  }

  async projectStats(uuid: string) {
    throw new Error(`Method not implemented. (projectStats for ${uuid})`);
  }
}
