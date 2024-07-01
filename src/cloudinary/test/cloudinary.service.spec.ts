import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from '../cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

jest.mock('streamifier', () => ({
  createReadStream: jest.fn(),
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        { provide: 'CLOUDINARY', useValue: cloudinary },
      ],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a file successfully', async () => {
    const mockFile = { buffer: Buffer.from('mock file buffer') } as Express.Multer.File;
    const mockResult = { url: 'http://example.com/image.jpg' };

    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
      callback(null, mockResult);
      return { end: jest.fn() };
    });

    (streamifier.createReadStream as jest.Mock).mockReturnValue({
      pipe: jest.fn(),
    });

    const result = await service.uploadFile(mockFile);

    expect(result).toEqual(mockResult);
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
    expect(streamifier.createReadStream).toHaveBeenCalledWith(mockFile.buffer);
  });

  it('should handle file upload failure', async () => {
    const mockFile = { buffer: Buffer.from('mock file buffer') } as Express.Multer.File;
    const mockError = new Error('Upload error');

    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
      callback(mockError, null);
      return { end: jest.fn() };
    });

    (streamifier.createReadStream as jest.Mock).mockReturnValue({
      pipe: jest.fn(),
    });

    await expect(service.uploadFile(mockFile)).rejects.toThrow('Failed to upload image to Cloudinary: Upload error');
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
    expect(streamifier.createReadStream).toHaveBeenCalledWith(mockFile.buffer);
  });
});
