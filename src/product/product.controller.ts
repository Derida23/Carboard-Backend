import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { Role } from '../../src/auth/roles/roles.enum';
import { Roles } from '../../src/auth/roles/roles.decorator';
import { RolesGuard } from '../../src/auth/roles/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../src/cloudinary/cloudinary.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() payload: CreateProductDto,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    let upload = null;
    if (image) {
      upload = await this.cloudinaryService.uploadFile(image);
    }
    return this.productService.create(payload, upload?.url ?? null);
  }

  // @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('name') name?: string,
    @Query('id_fuel') id_fuel?: string,
    @Query('id_mark') id_mark?: string,
    @Query('id_transmission') id_transmission?: string,
    @Query('id_type') id_type?: string,
    @Query('page') page = 1,
    @Query('per_page') per_page = 10,
  ) {
    return this.productService.findAll(
      {
        start_date,
        end_date,
        name,
        id_fuel,
        id_mark,
        id_transmission,
        id_type,
      },
      { page, per_page },
    );
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    let upload = null;
    if (image) {
      upload = await this.cloudinaryService.uploadFile(image);
    }
    return this.productService.update(+id, payload, upload?.url);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
