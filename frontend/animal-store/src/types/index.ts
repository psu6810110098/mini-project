export enum PetStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface Tag {
  id: number;
  name: string;
}

export interface Pet {
  id: number;
  name: string;
  species: string;
  price: number; // decimal in backend
  age: number;
  image_url: string;
  status: PetStatus;
  tag: Tag[]; // Note: backend uses 'tag' not 'tags'
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  gender: UserGender;
  role: UserRole;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface CreatePetDto {
  name: string;
  species: string;
  price: number;
  age: number;
  image_url?: string;
  description: string; // Required in backend
  status?: PetStatus;
  tagIds?: number[];
}

export interface UpdatePetDto extends Partial<CreatePetDto> {}

export interface Adoption {
  id: number;
  adoptionDate: string;
  pet: Pet;
}

export interface UserWithAdoptions extends User {
  adoptions?: Adoption[];
}

export interface CreateAdoptionDto {
  petId: number;
}
