import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, UploadedFile } from '@nestjs/common';
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
    private readonly cloudinaryService: CloudinaryService
  ) { }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() payload: CreateProductDto,
    @UploadedFile()
    image: Express.Multer.File
  ) {
    let upload = null
    if (image) {
      upload = await this.cloudinaryService.uploadFile(image);
    }
    return this.productService.create(payload, upload.url);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @UseGuards(AuthGuard)
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
    @UploadedFile() image: Express.Multer.File
  ) {
    let upload = null
    if(image) {
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
