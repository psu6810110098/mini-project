import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { PetStatus } from '../entities/pet.entity';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  species: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  age: number;

  @IsUrl()
  @IsOptional()
  image_url?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(PetStatus)
  @IsOptional()
  status?: PetStatus;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tagIds?: number[];
}
