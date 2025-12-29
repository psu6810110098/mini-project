import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { PetStatus } from '../entities/pet.entity';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsString()
  species: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  age: number;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsEnum(PetStatus)
  @IsOptional()
  status?: PetStatus;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true }) // เช็คว่าใน Array เป็นตัวเลขทั้งหมด
  tagIds?: number[];
}