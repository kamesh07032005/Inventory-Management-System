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
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9\s\-_]+$/),
        ],
      ],
      category: ['', Validators.required],
      quantity: [
        0,
        [Validators.required, Validators.min(0), Validators.max(999999)],
      ],
      supplierId: [null, Validators.required],
      description: [
        '',
        [
          Validators.maxLength(200),
          Validators.pattern(/^[a-zA-Z0-9\s\-_.,!?()]+$/),
        ],
      ],
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

  onSubmit() {
    if (this.inventoryForm.invalid) {
      this.markFormGroupTouched(this.inventoryForm);
      this.snackBar.open(
        'Please fix the validation errors before submitting',
        'Close',
        {
          duration: 5000,
          panelClass: 'error-snackbar',
        }
      );
      return;
    }

    if (
      !confirm(
        this.isEditMode
          ? 'Are you sure you want to update this item?'
          : 'Are you sure you want to add this item?'
      )
    ) {
      return;
    }

    this.saveItem();
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

  private showErrorAndRedirect(message: string) {
    this.isLoading = false;
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: 'error-snackbar',
    });
    this.router.navigate(['/inventory']);
  }

  loadItemData(id: number) {
    if (!id || isNaN(id)) {
      this.showErrorAndRedirect('Invalid item ID');
      return;
    }

    this.isLoading = true;
    this.inventoryService.getInventoryItem(id).subscribe({
      next: (item) => {
        if (item) {
          this.isLoading = false;
          this.inventoryForm.patchValue({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            supplierId: item.supplierId,
            description: item.description || '',
          });
        } else {
          this.showErrorAndRedirect('Item not found');
        }
      },
      error: (error) => {
        this.showErrorAndRedirect('Error loading item data');
        console.error('Error loading item:', error);
      },
    });
  }

  saveItem(): void {
    this.isSubmitting = true;
    const formValue = this.inventoryForm.value;

    // Create inventory item object
    const item: Partial<InventoryItem> = {
      name: formValue.name,
      category: formValue.category,
      quantity: formValue.quantity,
      description: formValue.description || '',
      supplierId: formValue.supplierId,
    };

    // Add or update based on mode
    if (this.isEditMode && this.itemId) {
      this.inventoryService.updateItem(this.itemId, item).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open('Inventory item updated successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/inventory']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Error updating inventory item', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
          console.error('Error updating inventory item:', error);
        },
      });
    } else {
      this.inventoryService.addItem(item).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open('Inventory item added successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/inventory']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Error adding inventory item', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
          console.error('Error adding inventory item:', error);
        },
      });
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
    if (control?.hasError('max')) {
      return 'Value exceeds maximum allowed quantity';
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    if (control?.hasError('pattern')) {
      switch (controlName) {
        case 'name':
          return 'Only letters, numbers, spaces, hyphens and underscores are allowed';
        case 'description':
          return 'Only letters, numbers, spaces and basic punctuation are allowed';
        default:
          return 'Invalid characters in field';
      }
    }
    return '';
  }
}
