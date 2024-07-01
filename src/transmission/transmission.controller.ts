import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransmissionService } from './transmission.service';
import { CreateTransmissionDto } from './dto/create-transmission.dto';
import { UpdateTransmissionDto } from './dto/update-transmission.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';

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
  findAll() {
    return this.transmissionService.findAll();
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
