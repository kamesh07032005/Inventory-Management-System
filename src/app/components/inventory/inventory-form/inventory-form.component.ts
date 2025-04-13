import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryItem, CATEGORIES } from '../../../models/inventory.model';
import { InventoryService } from '../../../services/inventory.service';
import { SupplierService } from '../../../services/supplier.service';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css'],
})
export class InventoryFormComponent implements OnInit {
  inventoryForm: FormGroup;
  isEditMode = false;
  itemId?: number;
  categories = CATEGORIES;
  suppliers: Supplier[] = [];
  isLoading = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private supplierService: SupplierService,
    private snackBar: MatSnackBar
  ) {
    this.inventoryForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      supplierId: [null, Validators.required],
      description: ['', Validators.maxLength(200)],
    });
  }

  ngOnInit() {
    this.loadSuppliers();

    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId) {
      this.isEditMode = true;
      this.loadItemData(this.itemId);
    }
  }

  loadSuppliers() {
    this.isLoading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading suppliers', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
        this.isLoading = false;
        console.error('Error loading suppliers:', error);
      },
    });
  }

  loadItemData(id: number) {
    // Validate ID before making the request
    if (!id || isNaN(id)) {
      this.snackBar.open('Invalid item ID', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      this.router.navigate(['/inventory']);
      return;
    }

    this.isLoading = true;
    this.inventoryService.getInventoryItem(id).subscribe({
      next: (item) => {
        this.isLoading = false;
        if (item) {
          // Ensure all form fields are properly populated
          this.inventoryForm.patchValue({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            supplierId: item.supplierId,
            description: item.description || '',
          });
        } else {
          // Handle case when item is not found
          this.snackBar.open(
            'Item not found or has been deleted. Redirecting to inventory list.',
            'Close',
            {
              duration: 5000,
              panelClass: 'error-snackbar',
            }
          );
          // Navigate back to inventory list after a short delay to allow user to read the message
          setTimeout(() => {
            this.router.navigate(['/inventory']);
          }, 1000);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error loading item data', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
        console.error('Error loading item:', error);
        this.router.navigate(['/inventory']);
      },
    });
  }

  onSubmit() {
    if (this.inventoryForm.valid) {
      this.isSubmitting = true;
      const formData: InventoryItem = this.inventoryForm.value;

      // Find supplier name based on selected supplierId
      const selectedSupplier = this.suppliers.find(
        (s) => s.id === formData.supplierId
      );
      if (selectedSupplier) {
        formData.supplierName = selectedSupplier.name;
      }

      if (this.isEditMode && this.itemId) {
        formData.id = this.itemId;
        this.inventoryService.updateItem(formData).subscribe({
          next: (item) => {
            this.snackBar.open('Item updated successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar',
            });
            this.isSubmitting = false;
            this.router.navigate(['/inventory']);
          },
          error: (error) => {
            this.snackBar.open('Error updating item', 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar',
            });
            this.isSubmitting = false;
            console.error('Error updating item:', error);
          },
        });
      } else {
        this.inventoryService.addItem(formData).subscribe({
          next: (item) => {
            this.snackBar.open('Item added successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar',
            });
            this.isSubmitting = false;
            this.router.navigate(['/inventory']);
          },
          error: (error) => {
            this.snackBar.open('Error adding item', 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar',
            });
            this.isSubmitting = false;
            console.error('Error adding item:', error);
          },
        });
      }
    } else {
      this.markFormGroupTouched(this.inventoryForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/inventory']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.inventoryForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('min')) {
      return 'Value must be 0 or greater';
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    return '';
  }
}
