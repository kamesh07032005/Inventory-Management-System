import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Supplier } from '../../../models/supplier.model';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'contactName', 'email', 'phone', 'address', 'actions'];
  dataSource = new MatTableDataSource<Supplier>();
  isLoading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private supplierService: SupplierService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadSuppliers();
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  
  loadSuppliers() {
    this.isLoading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.dataSource.data = suppliers;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load suppliers', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
        this.isLoading = false;
        console.error('Error loading suppliers:', error);
      }
    });
  }

  addNewSupplier() {
    this.router.navigate(['/suppliers/new']);
  }

  editSupplier(id: number) {
    this.router.navigate(['/suppliers/edit', id]);
  }

  deleteSupplier(id: number) {
    if (confirm('Are you sure you want to delete this supplier? This may affect related inventory items.')) {
      this.supplierService.deleteSupplier(id).subscribe({
        next: (success) => {
          if (success) {
            this.snackBar.open('Supplier deleted successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.loadSuppliers();
          } else {
            this.snackBar.open('Failed to delete supplier', 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Error deleting supplier', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
          console.error('Error deleting supplier:', error);
        }
      });
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
