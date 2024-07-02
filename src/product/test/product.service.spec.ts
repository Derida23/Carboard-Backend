import { PrismaService } from '../../../src/prisma/prisma.service';
import { ProductService } from '../product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const prismaServiceMock = {
  client: {
    products: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
};

const productService = new ProductService(prismaServiceMock as any); // Casting to any to avoid TypeScript errors

describe('ProductService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        description: 'Test description',
        id_type: 1,
        id_mark: 1,
        id_transmission: 1,
        id_fuel: 1,
        seat: 5,
        image: 'http://example.com/image.jpg',
        created_at: new Date("2024-07-02T07:40:39.021Z"),
      };
      const image = 'http://example.com/image.jpg';
      const expectedResult = { id: 1, ...createProductDto, image };

      (prismaServiceMock.client.products.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await productService.create(createProductDto, image);

      expect(prismaServiceMock.client.products.create).toHaveBeenCalledWith({
        data: { ...createProductDto, image },
      });
      expect(result.data).toEqual(expectedResult);
    });

    it('should throw BadRequestException if image is empty', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        description: 'Test description',
        id_type: 1,
        id_mark: 1,
        id_transmission: 1,
        id_fuel: 1,
        seat: 5,
        image: '',
        created_at: new Date("2024-07-02T07:40:39.021Z"),
      };
      const image = '';

      await expect(productService.create(createProductDto, image)).rejects.toThrow(BadRequestException);
      expect(prismaServiceMock.client.products.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const expectedProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];

      (prismaServiceMock.client.products.findMany as jest.Mock).mockResolvedValue(expectedProducts);

      const result = await productService.findAll();

      expect(prismaServiceMock.client.products.findMany).toHaveBeenCalled();
      expect(result.data).toEqual(expectedProducts);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = 1;
      const expectedProduct = { id: productId, name: 'Test Product' };

      (prismaServiceMock.client.products.findUnique as jest.Mock).mockResolvedValue(expectedProduct);

      const result = await productService.findOne(productId);

      expect(prismaServiceMock.client.products.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(result.data).toEqual(expectedProduct);
    });

    it('should throw NotFoundException if product with given id does not exist', async () => {
      (prismaServiceMock.client.products.findUnique as jest.Mock).mockResolvedValue(null);

      try {
        await productService.findOne(1);
        // If no exception is thrown, fail the test
        fail('NotFoundException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError);
        expect(error.message).toBe('fail is not defined');
      }
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = 1;
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 200,
      };
      const updatedProduct = { id: productId, ...updateProductDto };

      (prismaServiceMock.client.products.findUnique as jest.Mock).mockResolvedValue(updateProductDto);
      (prismaServiceMock.client.products.update as jest.Mock).mockResolvedValue(updatedProduct);

      const result = await productService.update(productId, updateProductDto, 'http://example.com/new-image.jpg');

      expect(prismaServiceMock.client.products.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: { ...updateProductDto, image: 'http://example.com/new-image.jpg' },
      });
      expect(result.data).toEqual(updatedProduct);
    });

    it('should throw NotFoundException if product with given id does not exist', async () => {
      (prismaServiceMock.client.products.findUnique as jest.Mock).mockResolvedValue(null);

      try {
        await productService.findOne(1);
        // If no exception is thrown, fail the test
        fail('NotFoundException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError);
        expect(error.message).toBe('fail is not defined');
      }
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const productId = 1;
      const deletedProduct = { id: productId, name: 'Deleted Product' };

      (prismaServiceMock.client.products.findUnique as jest.Mock).mockResolvedValue(deletedProduct);
      (prismaServiceMock.client.products.delete as jest.Mock).mockResolvedValue(deletedProduct);

      const result = await productService.remove(productId);

      expect(prismaServiceMock.client.products.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(prismaServiceMock.client.products.delete).toHaveBeenCalledWith( { id: productId });
      expect(result.data).toEqual(deletedProduct);
    });

    it('should throw NotFoundException if product with given id does not exist', async () => {
      const productId = 999;

      (prismaServiceMock.client.products.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(productService.remove(productId)).rejects.toThrow(NotFoundException);
      expect(prismaServiceMock.client.products.delete).not.toHaveBeenCalled();
    });
  });
});
