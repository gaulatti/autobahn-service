import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async allProjects() {
    return this.projectsService.allProjects();
  }

  @Get(':uuid')
  async getProject(@Param('uuid') uuid: string) {
    return this.projectsService.getProject(uuid);
  }

  @Post()
  async createProject(@Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(dto);
  }

  @Delete(':uuid')
  async deleteProject(@Param('uuid') uuid: string) {
    return this.projectsService.deleteProject(uuid);
  }
}
