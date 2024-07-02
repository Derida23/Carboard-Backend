import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';

export class LoginAuthDto extends PartialType(CreateAuthDto) { }
