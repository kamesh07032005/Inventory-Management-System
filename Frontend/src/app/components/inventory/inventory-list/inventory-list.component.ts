import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryItem, InventoryFilter, StockLevel } from '../../../models/inventory.model';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'category', 'quantity', 'stockLevel', 'supplierName', 'actions'];
  dataSource = new MatTableDataSource<InventoryItem>([]);
  currentFilters: InventoryFilter = {};
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInventory(): void {
    this.isLoading = true;
    if (Object.keys(this.currentFilters).length > 0) {
      this.inventoryService.filterInventory(this.currentFilters).subscribe(items => {
        this.dataSource.data = items;
        this.isLoading = false;
      }, error => {
        console.error('Error loading inventory:', error);
        this.isLoading = false;
      });
    } else {
      this.inventoryService.getInventory().subscribe(items => {
        this.dataSource.data = items;
        this.isLoading = false;
      }, error => {
        console.error('Error loading inventory:', error);
        this.isLoading = false;
      });
    }
  }

  applyFilters(filters: InventoryFilter): void {
    this.currentFilters = filters;
    this.loadInventory();
  }

  getStockLevelClass(quantity: number): string {
    const stockLevel = this.inventoryService.getStockLevel(quantity);
    switch (stockLevel) {
      case StockLevel.OUT_OF_STOCK:
        return 'stock-out';
      case StockLevel.LOW:
        return 'stock-low';
      case StockLevel.MEDIUM:
        return 'stock-medium';
      case StockLevel.HIGH:
        return 'stock-high';
      default:
        return '';
    }
  }

  getStockLevelText(quantity: number): string {
    return this.inventoryService.getStockLevel(quantity);
  }

  editItem(id: number): void {
    this.router.navigate(['/inventory/edit', id]);
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.deleteItem(id).subscribe(success => {
        if (success) {
          this.snackBar.open('Item deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadInventory();
        } else {
          this.snackBar.open('Failed to delete item', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  addNewItem(): void {
    this.router.navigate(['/inventory/new']);
  }
}
