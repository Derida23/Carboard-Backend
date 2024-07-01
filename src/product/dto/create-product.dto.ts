import { IsNotEmpty, IsNumber, IsString, isNotEmpty } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Price must be a floating-point number' })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  id_type: number;

  @IsNotEmpty()
  @IsNumber()
  id_mark: number;

  @IsNotEmpty()
  @IsNumber()
  seat: number;

  @IsNotEmpty()
  @IsNumber()
  id_transmission: number;

  @IsNotEmpty()
  @IsNumber()
  id_fuel: number;

  @IsNotEmpty()
  @IsString()
  image: string;

  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}