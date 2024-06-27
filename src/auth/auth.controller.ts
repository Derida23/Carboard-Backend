import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

  @Post('register')
  async create(@Body() data: CreateAuthDto) {
    return await this.authService.create(data);
  }

  // @Post('login')
  // async login(@Body() data: LoginUserDto) {
  //   return await this.authService.login(data.email, data.password);
  // }
}
