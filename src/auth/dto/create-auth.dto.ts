import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
export class CreateAuthDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;
  
    @IsOptional()
    @IsString()
    address?: string;
  
    @IsOptional()
    @IsString()
    phone_number?: string;
  
    @IsOptional()
    @IsString()
    avatar?: string;
  
    @IsNotEmpty()
    @IsString()
    role: string;
  
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
  }
