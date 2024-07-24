import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MarkService } from './mark.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { Role } from '../../src/auth/roles/roles.enum';
import { Roles } from '../../src/auth/roles/roles.decorator';
import { RolesGuard } from '../../src/auth/roles/roles.guard';

@Controller('marks')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() payload: CreateMarkDto) {
    return this.markService.create(payload);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('name') name?: string,
    @Query('page') page = 1,
    @Query('per_page') per_page = 10,) {
    return this.markService.findAll({ start_date, end_date, name }, { page, per_page });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.markService.findOne(+id);
  }


  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateMarkDto) {
    return this.markService.update(+id, payload);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.markService.remove(+id);
  }
}
