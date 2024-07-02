import { IsNotEmpty, IsString } from "class-validator";

export class CreateFuelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
  
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
