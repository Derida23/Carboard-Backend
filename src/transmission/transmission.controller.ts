import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TransmissionService } from './transmission.service';
import { CreateTransmissionDto } from './dto/create-transmission.dto';
import { UpdateTransmissionDto } from './dto/update-transmission.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { Roles } from '../../src/auth/roles/roles.decorator';
import { Role } from '../../src/auth/roles/roles.enum';
import { RolesGuard } from '../../src/auth/roles/roles.guard';

@Controller('transmissions')
export class TransmissionController {
  constructor(private readonly transmissionService: TransmissionService) {}
  
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() payload: CreateTransmissionDto) {
    return this.transmissionService.create(payload);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('name') name?: string,
    @Query('page') page = 1,
    @Query('per_page') per_page = 10,) {
    return this.transmissionService.findAll({ start_date, end_date, name }, { page, per_page });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transmissionService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateTransmissionDto) {
    return this.transmissionService.update(+id, payload);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transmissionService.remove(+id);
  }
}
