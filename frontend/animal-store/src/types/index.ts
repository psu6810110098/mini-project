import type { ReactNode } from "react";

export interface Tag {
  id: number;
  name: string;
}

export interface Pet {
  id: string | number;
  name: string;
  species: string;
  age: number;
  price: number;
  description: string;
  image_url: string;
  status: 'AVAILABLE' | 'SOLD';
  is_available: boolean;
  tags?: Tag[];
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface CreatePetDto {
  name: string;
  species: string;
  age: number;
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
  tagIds?: number[];
}

export interface UpdatePetDto extends Partial<CreatePetDto> {}

export interface Adoption {
  id: number;
  pet: Pet;
  adoptionDate: string;
}

export interface UserWithAdoptions extends User {
  full_name?: string;
  adoptions?: Adoption[];
}
