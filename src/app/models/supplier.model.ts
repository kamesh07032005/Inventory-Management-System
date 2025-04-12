export interface Supplier {
  id?: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  suppliedItems?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}