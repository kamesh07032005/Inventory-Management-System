import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { SupplierService } from '../../services/supplier.service';
import { InventoryItem, StockLevel } from '../../models/inventory.model';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  inventoryCount: number = 0;
  supplierCount: number = 0;
  lowStockCount: number = 0;
  outOfStockCount: number = 0;
  
  private inventorySubscription: Subscription | null = null;
  private supplierSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private inventoryService: InventoryService,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    if (this.inventorySubscription) {
      this.inventorySubscription.unsubscribe();
    }
    if (this.supplierSubscription) {
      this.supplierSubscription.unsubscribe();
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  private loadStatistics(): void {
    this.inventorySubscription = this.inventoryService.getInventory().subscribe(items => {
      this.inventoryCount = items.length;
      this.lowStockCount = items.filter(item => 
        this.inventoryService.getStockLevel(item.quantity) === StockLevel.LOW
      ).length;
      this.outOfStockCount = items.filter(item => 
        this.inventoryService.getStockLevel(item.quantity) === StockLevel.OUT_OF_STOCK
      ).length;
    });

    this.supplierSubscription = this.supplierService.getSuppliers().subscribe(suppliers => {
      this.supplierCount = suppliers.length;
    });
  }
}
