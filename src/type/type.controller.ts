import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('types')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() payload: CreateTypeDto) {
    return this.typeService.create(payload);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.typeService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateTypeDto) {
    return this.typeService.update(+id, payload);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeService.remove(+id);
  }
}
