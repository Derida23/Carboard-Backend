import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MarkService } from './mark.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('marks')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() payload: CreateMarkDto) {
    return this.markService.create(payload);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.markService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.markService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateMarkDto) {
    return this.markService.update(+id, payload);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.markService.remove(+id);
  }
}
