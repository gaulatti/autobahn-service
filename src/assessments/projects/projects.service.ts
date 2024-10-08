import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { Schedule } from 'src/models/schedule.model';
import { CreateProjectDto } from './dto/create.dto';

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
      include: [{ model: Schedule }],
    });
  }

  async createProject(project: CreateProjectDto): Promise<Project> {
    return this.project.create(project);
  }

  async updateProject(uuid: string, project: Project): Promise<Project> {
    await this.project.update(project, {
      where: { uuid },
    });

    return this.getProject(uuid);
  }

  async deleteProject(uuid: string): Promise<void> {
    await this.project.update(
      { deletedAt: new Date() },
      {
        where: { uuid },
      },
    );
  }
}
