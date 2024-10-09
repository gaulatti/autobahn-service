import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { Schedule } from 'src/models/schedule.model';
import { ProjectDto } from './project.dto';

@Injectable()
export class ProjectsService {
  projectStats(uuid: string) {
    throw new Error('Method not implemented.');
  }
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
      include: [{ model: Schedule }],
    });
  }

  async createProject(project: ProjectDto): Promise<Project> {
    return this.project.create(project);
  }

  async updateProject(uuid: string, project: ProjectDto): Promise<Project> {
    await this.project.update(project, {
      where: { uuid },
    });

    return this.getProject(uuid);
  }

  async deleteProject(uuid: string): Promise<void> {
    /**
     * TODO: Implement Soft Delete
     */
    const project = await this.getProject(uuid);
    await project.destroy();
  }
}
