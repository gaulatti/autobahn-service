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

  @Get(':uuid')
  async getProject(@Param('uuid') uuid: string) {
    return this.projectsService.getProject(uuid);
  }

  @Post()
  async createProject(@Body() dto: ProjectDto) {
    return this.projectsService.createProject(dto);
  }

  @Patch(':uuid')
  async updateProject(@Param('uuid') uuid: string, @Body() dto: ProjectDto) {
    return this.projectsService.updateProject(uuid, dto);
  }

  @Delete(':uuid')
  async deleteProject(@Param('uuid') uuid: string) {
    return this.projectsService.deleteProject(uuid);
  }

  @Get(':uuid/stats')
  async stats(@Param('uuid') uuid: string) {
    return this.projectsService.projectStats(uuid);
  }
}
