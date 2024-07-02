import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { CloudinaryService } from '../../../src/cloudinary/cloudinary.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { AuthGuard } from '../../../src/auth/auth.guard';
import { RolesGuard } from '../../../src/auth/roles/roles.guard';
import { Reflector } from '@nestjs/core';

describe('ProductController', () => {
  let controller: ProductController;
  let productServiceMock: jest.Mocked<ProductService>;
  let cloudinaryServiceMock: jest.Mocked<CloudinaryService>;

  const dataProduct: CreateProductDto = {
    name: 'Test Product',
    price: 100,
    image: 'http://example.com/image.jpg',
    description: 'Test Description',
    id_type: 1,
    id_mark: 1,
    id_transmission: 1,
    id_fuel: 1,
    seat: 4,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: new Date(),
  };

  beforeEach(async () => {
    productServiceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    cloudinaryServiceMock = {
      uploadFile: jest.fn(),
    } as unknown as jest.Mocked<CloudinaryService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: CloudinaryService, useValue: cloudinaryServiceMock },
        AuthGuard,
        RolesGuard,
        Reflector,
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  const dataExpectedResult = {
    statusCode: 201,
    message: 'Product created',
    data: {
      id: 1,
      ...dataProduct,
      image: 'http://example.com/image.jpg',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
    },
  };

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = dataProduct;
      const image = { buffer: Buffer.from('test') } as Express.Multer.File;
      const uploadResult = { url: 'http://example.com/image.jpg' };
      
      cloudinaryServiceMock.uploadFile.mockResolvedValue(uploadResult);
      productServiceMock.create.mockResolvedValue(dataExpectedResult);

      const result = await controller.create(createProductDto, image);

      expect(cloudinaryServiceMock.uploadFile).toHaveBeenCalledWith(image);
      expect(productServiceMock.create).toHaveBeenCalledWith(createProductDto, uploadResult.url);
      expect(result).toEqual(dataExpectedResult);
    });
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const expectedResult = {
        statusCode: 201,
        message: 'Product created',
        data: [{ ...dataExpectedResult.data, id: 1 }, { ...dataExpectedResult.data, id: 2 }]
      };
      productServiceMock.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(productServiceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {

      productServiceMock.findOne.mockResolvedValue(dataExpectedResult);

      const result = await controller.findOne('1');

      expect(productServiceMock.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(dataExpectedResult);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product', price: 150 };
      const image = { buffer: Buffer.from('test') } as Express.Multer.File;
      const uploadResult = { url: 'http://example.com/image.jpg' };

      cloudinaryServiceMock.uploadFile.mockResolvedValue(uploadResult);
      productServiceMock.update.mockResolvedValue(dataExpectedResult);

      const result = await controller.update('1', updateProductDto, image);

      expect(cloudinaryServiceMock.uploadFile).toHaveBeenCalledWith(image);
      expect(productServiceMock.update).toHaveBeenCalledWith(1, updateProductDto, uploadResult.url);
      expect(result).toEqual(dataExpectedResult);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {

      productServiceMock.remove.mockResolvedValue(dataExpectedResult);

      const result = await controller.remove('1');

      expect(productServiceMock.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(dataExpectedResult);
    });
  });
});
