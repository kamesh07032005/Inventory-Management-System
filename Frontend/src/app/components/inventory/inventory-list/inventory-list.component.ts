import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  InventoryItem,
  InventoryFilter,
  StockLevel,
} from '../../../models/inventory.model';
import { InventoryService } from '../../../services/inventory.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(10px)' })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class InventoryListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'category',
    'quantity',
    'stockLevel',
    'supplierName',
    'actions',
  ];
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
      this.inventoryService.filterInventory(this.currentFilters).subscribe(
        (items) => {
          this.dataSource.data = items;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading inventory:', error);
          this.isLoading = false;
          this.showErrorMessage('Error loading inventory data');
        }
      );
    } else {
      this.inventoryService.getInventory().subscribe(
        (items) => {
          this.dataSource.data = items;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading inventory:', error);
          this.isLoading = false;
          this.showErrorMessage('Error loading inventory data');
        }
      );
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
      this.isLoading = true;
      this.inventoryService.deleteItem(id).subscribe(
        (success) => {
          this.isLoading = false;
          if (success) {
            this.snackBar.open('Item deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top',
            });
            this.loadInventory();
          } else {
            this.showErrorMessage('Failed to delete item');
          }
        },
        (error) => {
          this.isLoading = false;
          this.showErrorMessage('Error deleting item: ' + error.message);
        }
      );
    }
  }

  addNewItem(): void {
    this.router.navigate(['/inventory/new']);
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
    });
  }
}
