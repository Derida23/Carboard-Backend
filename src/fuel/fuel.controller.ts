import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { CreateFuelDto } from './dto/create-fuel.dto';
import { UpdateFuelDto } from './dto/update-fuel.dto';
import { AuthGuard } from '../../src/auth/auth.guard';

@Controller('fuels')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateFuelDto) {
    return this.fuelService.update(+id, payload);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fuelService.remove(+id);
  }
}
