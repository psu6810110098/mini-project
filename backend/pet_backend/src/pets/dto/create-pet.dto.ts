import { PetStatus } from '../entities/pet.entity';

export class CreatePetDto {
  name: string;
  species: string;
  price: number;
  image?: string;
  status?: PetStatus;

  tagIds?: number[]; 
}