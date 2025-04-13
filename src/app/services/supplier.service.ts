import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Supplier } from '../models/supplier.model';
import { InventoryService } from './inventory.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private suppliers: Supplier[] = [];
  private suppliersSubject = new BehaviorSubject<Supplier[]>([]);
  private nextId = 1;

  constructor(private inventoryService: InventoryService) {
    // Initialize with some sample data
    this.addSupplier({
      name: 'Tech Supplies Inc.',
      contactName: 'John Doe',
      email: 'john@techsupplies.com',
      phone: '555-123-4567',
      address: '123 Tech St, Silicon Valley, CA',
      suppliedItems: ['Electronics', 'Computers']
    });
    this.addSupplier({
      name: 'Office Essentials',
      contactName: 'Jane Smith',
      email: 'jane@officeessentials.com',
      phone: '555-987-6543',
      address: '456 Office Blvd, Business Park, NY',
      suppliedItems: ['Office Supplies', 'Furniture']
    });
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.suppliersSubject.asObservable();
  }

  getSupplier(id: number): Observable<Supplier | undefined> {
    // First check if the ID is valid
    if (!id || isNaN(id)) {
      console.error('Invalid supplier ID:', id);
      return of(undefined);
    }
    
    const supplier = this.suppliers.find(supplier => supplier.id === id);
    
    // Log when supplier is not found to help with debugging
    if (!supplier) {
      console.warn(`Supplier with ID ${id} not found`);
      // You could also emit an event or use a notification service here
      // to provide more context about the error
    }
    
    return of(supplier || undefined);
  }

  addSupplier(supplier: Supplier): Observable<Supplier> {
    const newSupplier: Supplier = {
      ...supplier,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.suppliers.push(newSupplier);
    this.suppliersSubject.next([...this.suppliers]);
    return of(newSupplier);
  }

  updateSupplier(updatedSupplier: Supplier): Observable<Supplier> {
    // Validate supplier ID
    if (!updatedSupplier.id || isNaN(updatedSupplier.id)) {
      console.error('Invalid supplier ID for update:', updatedSupplier.id);
      // Return the supplier but log the error
      return of(updatedSupplier);
    }
    
    const index = this.suppliers.findIndex(supplier => supplier.id === updatedSupplier.id);
    if (index !== -1) {
      this.suppliers[index] = {
        ...updatedSupplier,
        updatedAt: new Date()
      };
      this.suppliersSubject.next([...this.suppliers]);
      
      // Update supplier name in inventory items
      if (updatedSupplier.id) {
        this.inventoryService.updateSupplierName(updatedSupplier.id, updatedSupplier.name);
      }
      
      return of(this.suppliers[index]);
    }
    
    // Log when trying to update a non-existent supplier
    console.warn(`Attempted to update non-existent supplier with ID ${updatedSupplier.id}`);
    return of(updatedSupplier); // Return the supplier even if not found
  }

  deleteSupplier(id: number): Observable<boolean> {
    const initialLength = this.suppliers.length;
    this.suppliers = this.suppliers.filter(supplier => supplier.id !== id);
    this.suppliersSubject.next([...this.suppliers]);
    
    // Handle related inventory items
    this.inventoryService.removeSupplierReferences(id);
    
    return of(initialLength > this.suppliers.length);
  }
}
