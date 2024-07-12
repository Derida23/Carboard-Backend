import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { CreateFuelDto } from './dto/create-fuel.dto';
import { UpdateFuelDto } from './dto/update-fuel.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { Roles } from '../../src/auth/roles/roles.decorator';
import { Role } from '../../src/auth/roles/roles.enum';
import { RolesGuard } from '../../src/auth/roles/roles.guard';

@Controller('fuels')
export class FuelController {
  constructor(private readonly fuelService: FuelService) { }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() payload: CreateFuelDto) {
    return this.fuelService.create(payload);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('name') name?: string,
    @Query('page') page = 1,
    @Query('per_page') per_page = 10,
  ) {
    return this.fuelService.findAll({ start_date, end_date, name }, { page, per_page });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fuelService.findOne(+id);
  }


  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateFuelDto) {
    return this.fuelService.update(+id, payload);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fuelService.remove(+id);
  }
}
