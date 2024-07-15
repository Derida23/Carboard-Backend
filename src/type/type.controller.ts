import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { Roles } from '../../src/auth/roles/roles.decorator';
import { Role } from '../../src/auth/roles/roles.enum';
import { RolesGuard } from '../../src/auth/roles/roles.guard';

@Controller('types')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() payload: CreateTypeDto) {
    return this.typeService.create(payload);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('name') name?: string,
    @Query('page') page = 1,
    @Query('per_page') per_page = 10,) {
    return this.typeService.findAll({ start_date, end_date, name }, { page, per_page });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateTypeDto) {
    return this.typeService.update(+id, payload);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeService.remove(+id);
  }
}
