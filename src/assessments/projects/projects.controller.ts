import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectDto } from './project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async allProjects() {
    return this.projectsService.allProjects();
  }

  @Get(':slug')
  async getProject(@Param('slug') slug: string) {
    return this.projectsService.getProject(slug);
  }

  @Post()
  async createProject(@Body() dto: ProjectDto) {
    return this.projectsService.createProject(dto);
  }

  @Patch(':slug')
  async updateProject(@Param('slug') slug: string, @Body() dto: ProjectDto) {
    return this.projectsService.updateProject(slug, dto);
  }

  @Delete(':slug')
  async deleteProject(@Param('slug') slug: string) {
    return this.projectsService.deleteProject(slug);
  }

  @Get(':slug/stats')
  async stats(@Param('slug') slug: string) {
    return this.projectsService.projectStats(slug);
  }
}
