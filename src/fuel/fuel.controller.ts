import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { CreateFuelDto } from './dto/create-fuel.dto';
import { UpdateFuelDto } from './dto/update-fuel.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { Roles } from '../../src/auth/roles/roles.decorator';
import { Role } from '../../src/auth/roles/roles.enum';
import { RolesGuard } from '../../src/auth/roles/roles.guard';

@Controller('fuels')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() payload: CreateFuelDto) {
    return this.fuelService.create(payload);
  }
  
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.fuelService.findAll();
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
