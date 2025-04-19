import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  InventoryItem,
  StockLevel,
  InventoryFilter,
} from '../models/inventory.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private inventoryItems: InventoryItem[] = [];
  private inventorySubject = new BehaviorSubject<InventoryItem[]>([]);
  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {
    // Load inventory data when service is initialized
    this.loadInventory();
  }
  
  private loadInventory(): void {
    this.http.get<InventoryItem[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error loading inventory:', error);
          return of([]);
        })
      )
      .subscribe(items => {
        this.inventoryItems = items;
        this.inventorySubject.next([...this.inventoryItems]);
      });
  }

  getInventory(): Observable<InventoryItem[]> {
    // Refresh data from API and return the observable
    return this.http.get<InventoryItem[]>(this.apiUrl)
      .pipe(
        tap(items => {
          this.inventoryItems = items;
          this.inventorySubject.next([...this.inventoryItems]);
        }),
        catchError(error => {
          console.error('Error fetching inventory:', error);
          // Return current cached data if API call fails
          return this.inventorySubject.asObservable();
        })
      );
  }

  getInventoryItem(id: number): Observable<InventoryItem | undefined> {
    // First check if the ID is valid
    if (!id || isNaN(id)) {
      console.error('Invalid inventory item ID:', id);
      return of(undefined);
    }

    return this.http.get<InventoryItem>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching inventory item ${id}:`, error);
          return of(undefined);
        })
      );
  }

  addItem(item: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, item)
      .pipe(
        tap(newItem => {
          this.inventoryItems.push(newItem);
          this.inventorySubject.next([...this.inventoryItems]);
        }),
        catchError(error => {
          console.error('Error adding inventory item:', error);
          throw error;
        })
      );
  }

  updateItem(id: number, updates: Partial<InventoryItem>): Observable<InventoryItem | undefined> {
    return this.http.put<InventoryItem>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        tap(updatedItem => {
          const index = this.inventoryItems.findIndex(item => item.id === id);
          if (index !== -1) {
            this.inventoryItems[index] = updatedItem;
            this.inventorySubject.next([...this.inventoryItems]);
          }
        }),
        catchError(error => {
          console.error(`Error updating inventory item ${id}:`, error);
          return of(undefined);
        })
      );
  }

  deleteItem(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.inventoryItems = this.inventoryItems.filter(item => item.id !== id);
          this.inventorySubject.next([...this.inventoryItems]);
        }),
        catchError(error => {
          console.error(`Error deleting inventory item ${id}:`, error);
          return of(false);
        }),
        // Map the response to a boolean indicating success
        tap(() => true)
      );
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
