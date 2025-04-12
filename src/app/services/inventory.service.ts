import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { InventoryItem, StockLevel, InventoryFilter } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
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
      supplierName: 'Tech Supplies Inc.'
    });
    this.addItem({
      name: 'Office Chair',
      category: 'Furniture',
      quantity: 5,
      supplierId: 2,
      supplierName: 'Office Essentials'
    });
    this.addItem({
      name: 'Notebooks',
      category: 'Office Supplies',
      quantity: 100,
      supplierId: 2,
      supplierName: 'Office Essentials'
    });
  }

  getInventory(): Observable<InventoryItem[]> {
    return this.inventorySubject.asObservable();
  }

  getInventoryItem(id: number): Observable<InventoryItem | undefined> {
    const item = this.inventoryItems.find(item => item.id === id);
    return of(item);
  }

  addItem(item: InventoryItem): Observable<InventoryItem> {
    const newItem: InventoryItem = {
      ...item,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.inventoryItems.push(newItem);
    this.inventorySubject.next([...this.inventoryItems]);
    return of(newItem);
  }

  updateItem(updatedItem: InventoryItem): Observable<InventoryItem> {
    const index = this.inventoryItems.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      this.inventoryItems[index] = {
        ...updatedItem,
        updatedAt: new Date()
      };
      this.inventorySubject.next([...this.inventoryItems]);
      return of(this.inventoryItems[index]);
    }
    return of(updatedItem); // Return the item even if not found
  }

  deleteItem(id: number): Observable<boolean> {
    const initialLength = this.inventoryItems.length;
    this.inventoryItems = this.inventoryItems.filter(item => item.id !== id);
    this.inventorySubject.next([...this.inventoryItems]);
    return of(initialLength > this.inventoryItems.length);
  }

  filterInventory(filter: InventoryFilter): Observable<InventoryItem[]> {
    let filteredItems = [...this.inventoryItems];
    
    if (filter.category) {
      filteredItems = filteredItems.filter(item => item.category === filter.category);
    }
    
    if (filter.stockLevel) {
      filteredItems = filteredItems.filter(item => this.getStockLevel(item.quantity) === filter.stockLevel);
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
    const categories = new Set(this.inventoryItems.map(item => item.category));
    return Array.from(categories);
  }

  updateSupplierName(supplierId: number, newName: string): void {
    this.inventoryItems.forEach(item => {
      if (item.supplierId === supplierId) {
        item.supplierName = newName;
      }
    });
    this.inventorySubject.next([...this.inventoryItems]);
  }

  removeSupplierReferences(supplierId: number): void {
    this.inventoryItems.forEach(item => {
      if (item.supplierId === supplierId) {
        item.supplierId = 0;
        item.supplierName = 'Unknown (Supplier Deleted)';
      }
    });
    this.inventorySubject.next([...this.inventoryItems]);
  }
}
