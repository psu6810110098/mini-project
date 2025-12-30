import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateAdoptionDto {
  @IsNumber()
  @IsNotEmpty()
  petId: number;
}
