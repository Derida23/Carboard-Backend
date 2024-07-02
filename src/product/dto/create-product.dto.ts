import { Type } from "class-transformer";
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
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id_type: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id_mark: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  seat: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id_transmission: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id_fuel: number;

  image: string;

  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}