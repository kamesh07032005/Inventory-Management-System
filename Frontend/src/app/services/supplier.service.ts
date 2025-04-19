import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Supplier } from '../models/supplier.model';
import { InventoryService } from './inventory.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private suppliers: Supplier[] = [];
  private suppliersSubject = new BehaviorSubject<Supplier[]>([]);
  private apiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient, private inventoryService: InventoryService) {
    // Load suppliers data when service is initialized
    this.loadSuppliers();
  }
  
  private loadSuppliers(): void {
    this.http.get<Supplier[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error loading suppliers:', error);
          return of([]);
        })
      )
      .subscribe(suppliers => {
        this.suppliers = suppliers;
        this.suppliersSubject.next([...this.suppliers]);
      });
  }

  getSuppliers(): Observable<Supplier[]> {
    // Refresh data from API and return the observable
    return this.http.get<Supplier[]>(this.apiUrl)
      .pipe(
        tap(suppliers => {
          this.suppliers = suppliers;
          this.suppliersSubject.next([...this.suppliers]);
        }),
        catchError(error => {
          console.error('Error fetching suppliers:', error);
          // Return current cached data if API call fails
          return this.suppliersSubject.asObservable();
        })
      );
  }

  getSupplier(id: number): Observable<Supplier | undefined> {
    // First check if the ID is valid
    if (!id || isNaN(id)) {
      console.error('Invalid supplier ID:', id);
      return of(undefined);
    }
    
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching supplier ${id}:`, error);
          return of(undefined);
        })
      );
  }

  addSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier)
      .pipe(
        tap(newSupplier => {
          this.suppliers.push(newSupplier);
          this.suppliersSubject.next([...this.suppliers]);
        }),
        catchError(error => {
          console.error('Error adding supplier:', error);
          throw error;
        })
      );
  }

  updateSupplier(id: number, updates: Partial<Supplier>): Observable<Supplier | undefined> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        tap(updatedSupplier => {
          const index = this.suppliers.findIndex(supplier => supplier.id === id);
          if (index !== -1) {
            this.suppliers[index] = updatedSupplier;
            this.suppliersSubject.next([...this.suppliers]);
          }
        }),
        catchError(error => {
          console.error(`Error updating supplier ${id}:`, error);
          return of(undefined);
        })
      );
  }
  

  deleteSupplier(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.suppliers = this.suppliers.filter(supplier => supplier.id !== id);
          this.suppliersSubject.next([...this.suppliers]);
        }),
        catchError(error => {
          console.error(`Error deleting supplier ${id}:`, error);
          return of(false);
        }),
        // Map the response to a boolean indicating success
        map(() => true)
      );
  }
}
