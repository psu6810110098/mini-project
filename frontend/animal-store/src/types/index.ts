import type { ReactNode } from "react";

export interface Pet {
  status: ReactNode;
  id: string;
  name: string;
  species: string;
  age: number;
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
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
}

export interface UpdatePetDto extends Partial<CreatePetDto> {}
