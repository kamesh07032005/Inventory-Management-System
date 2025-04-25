export interface InventoryItem {
  id?: number;
  name: string;
  category: string;
  quantity: number;
  description?: string;
  supplierId: number;
  supplierName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum StockLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  OUT_OF_STOCK = 'Out of Stock',
}

export interface InventoryFilter {
  category?: string;
  stockLevel?: StockLevel;
}

export const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Office Supplies',
  'Clothing',
  'Food',
  'Beverages',
  'Other',
];
