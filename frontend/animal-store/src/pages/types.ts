export interface FieldType {
  email?: string;
  password?: string;
  full_name?: string;
  gender?: string;
}

export interface RegisterFieldType extends FieldType {
  email: string;
  password: string;
  full_name: string;
  gender: string;
}
