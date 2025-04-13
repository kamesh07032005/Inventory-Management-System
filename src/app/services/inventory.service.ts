import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  InventoryItem,
  StockLevel,
  InventoryFilter,
} from '../models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private inventoryItems: InventoryItem[] = [];
  private inventorySubject = new BehaviorSubject<InventoryItem[]>([]);
  private nextId = 1;

  constructor() {
    // Initialize with some sample data
    this.addItem({
      name: 'Laptop',
      category: 'Electronics',
      quantity: 10,
      supplierId: 1,
      supplierName: 'Tech Supplies Inc.',
    });
    this.addItem({
      name: 'Office Chair',
      category: 'Furniture',
      quantity: 5,
      supplierId: 2,
      supplierName: 'Office Essentials',
    });
    this.addItem({
      name: 'Notebooks',
      category: 'Office Supplies',
      quantity: 100,
      supplierId: 2,
      supplierName: 'Office Essentials',
    });
  }

  getInventory(): Observable<InventoryItem[]> {
    return this.inventorySubject.asObservable();
  }

  getInventoryItem(id: number): Observable<InventoryItem | undefined> {
    // First check if the ID is valid
    if (!id || isNaN(id)) {
      console.error('Invalid inventory item ID:', id);
      return of(undefined);
    }

    const item = this.inventoryItems.find((item) => item.id === id);

    // Log when item is not found to help with debugging
    if (!item) {
      console.warn(`Inventory item with ID ${id} not found`);
      // You could also emit an event or use a notification service here
      // to provide more context about the error
    }

    return of(item || undefined);
  }

  addItem(item: InventoryItem): Observable<InventoryItem> {
    const newItem: InventoryItem = {
      ...item,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inventoryItems.push(newItem);
    this.inventorySubject.next([...this.inventoryItems]);
    return of(newItem);
  }

  updateItem(updatedItem: InventoryItem): Observable<InventoryItem> {
    // Validate item ID
    if (!updatedItem.id || isNaN(updatedItem.id)) {
      console.error('Invalid item ID for update:', updatedItem.id);
      // Return the item but log the error
      return of(updatedItem);
    }

    const index = this.inventoryItems.findIndex(
      (item) => item.id === updatedItem.id
    );
    if (index !== -1) {
      this.inventoryItems[index] = {
        ...updatedItem,
        updatedAt: new Date(),
      };
      this.inventorySubject.next([...this.inventoryItems]);
      return of(this.inventoryItems[index]);
    }

    // Log when trying to update a non-existent item
    console.warn(
      `Attempted to update non-existent item with ID ${updatedItem.id}`
    );
    return of(updatedItem); // Return the item even if not found
  }

  deleteItem(id: number): Observable<boolean> {
    const initialLength = this.inventoryItems.length;
    this.inventoryItems = this.inventoryItems.filter((item) => item.id !== id);
    this.inventorySubject.next([...this.inventoryItems]);
    return of(initialLength > this.inventoryItems.length);
  }

  filterInventory(filter: InventoryFilter): Observable<InventoryItem[]> {
    let filteredItems = [...this.inventoryItems];

    if (filter.category) {
      filteredItems = filteredItems.filter(
        (item) => item.category === filter.category
      );
    }

    if (filter.stockLevel) {
      filteredItems = filteredItems.filter(
        (item) => this.getStockLevel(item.quantity) === filter.stockLevel
      );
    }

    return of(filteredItems);
  }

  getStockLevel(quantity: number): StockLevel {
    if (quantity <= 0) {
      return StockLevel.OUT_OF_STOCK;
    } else if (quantity < 5) {
      return StockLevel.LOW;
    } else if (quantity < 20) {
      return StockLevel.MEDIUM;
    } else {
      return StockLevel.HIGH;
    }
  }

  getCategories(): string[] {
    const categories = new Set(
      this.inventoryItems.map((item) => item.category)
    );
    return Array.from(categories);
  }

  updateSupplierName(supplierId: number, newName: string): void {
    this.inventoryItems.forEach((item) => {
      if (item.supplierId === supplierId) {
        item.supplierName = newName;
      }
    });
    this.inventorySubject.next([...this.inventoryItems]);
  }

  removeSupplierReferences(supplierId: number): void {
    this.inventoryItems.forEach((item) => {
      if (item.supplierId === supplierId) {
        item.supplierId = 0;
        item.supplierName = 'Unknown (Supplier Deleted)';
      }
    });
    this.inventorySubject.next([...this.inventoryItems]);
  }
}
