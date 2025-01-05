import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/models/project.model';
import { ProjectDto } from './project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private readonly project: typeof Project,
  ) {}

  async allProjects(): Promise<{ rows: Project[]; count: number }> {
    return this.project.findAndCountAll();
  }

  async getProject(slug: string): Promise<Project> {
    return this.project.findOne({
      where: { slug },
    });
  }

  async createProject(dto: ProjectDto): Promise<Project> {
    return this.project.create(dto);
  }

  async updateProject(slug: string, dto: ProjectDto): Promise<Project> {
    await this.project.update(dto, {
      where: { slug },
    });

    return this.getProject(slug);
  }

  async deleteProject(slug: string): Promise<void> {
    /**
     * TODO: Implement Soft Delete
     */
    const item = await this.getProject(slug);
    await item.destroy();
  }

  async projectStats(slug: string) {
    throw new Error(`Method not implemented. (projectStats for ${slug})`);
  }
}
