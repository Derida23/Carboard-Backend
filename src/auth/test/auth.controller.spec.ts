import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { LoginAuthDto } from '../dto/login-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            create: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call authService.create with correct data', async () => {
      const createAuthDto: CreateAuthDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      };

      await controller.create(createAuthDto);

      expect(authService.create).toHaveBeenCalledWith(createAuthDto);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct credentials', async () => {
      const loginAuthDto: LoginAuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await controller.login(loginAuthDto);

      expect(authService.login).toHaveBeenCalledWith(loginAuthDto.email, loginAuthDto.password);
    });
  });
});
