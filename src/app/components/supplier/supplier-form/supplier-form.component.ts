import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';
import { Supplier } from '../../../models/supplier.model';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css'],
})
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  isEditMode = false;
  supplierId?: number;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private snackBar: MatSnackBar
  ) {
    this.supplierForm = this.createForm();
  }

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.params['id'];
    if (this.supplierId) {
      this.isEditMode = true;
      this.loadSupplierData(this.supplierId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      contactName: ['', [Validators.required, Validators.maxLength(100)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9\\-\\+\\s\\(\\)]+$'),
          Validators.maxLength(20),
        ],
      ],
      address: ['', Validators.maxLength(200)],
      suppliedItems: [[]],
    });
  }

  loadSupplierData(id: number): void {
    // Validate ID before making the request
    if (!id || isNaN(id)) {
      this.snackBar.open('Invalid supplier ID', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      this.router.navigate(['/suppliers']);
      return;
    }

    this.isLoading = true;
    this.supplierService.getSupplier(id).subscribe({
      next: (supplier) => {
        this.isLoading = false;
        if (supplier) {
          this.supplierForm.patchValue({
            name: supplier.name,
            contactName: supplier.contactName,
            email: supplier.email,
          });
        } else {
          this.snackBar.open(
            'Supplier not found or has been deleted. Redirecting to supplier list.',
            'Close',
            {
              duration: 5000,
              panelClass: 'error-snackbar',
            }
          );
          setTimeout(() => {
            this.router.navigate(['/supplier']);
          }, 1000);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error loading supplier data', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
        console.error('Error loading supplier:', error);
        this.router.navigate(['/supplier']);
      },
    });
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      this.isSubmitting = true;
      const supplierData: Supplier = this.supplierForm.value;

      if (this.isEditMode && this.supplierId) {
        supplierData.id = this.supplierId;
        this.supplierService.updateSupplier(supplierData).subscribe({
          next: (supplier) => {
            this.snackBar.open('Supplier updated successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar',
            });
            this.isSubmitting = false;
            this.router.navigate(['/suppliers']);
          },
          error: (error) => {
            this.snackBar.open('Error updating supplier', 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar',
            });
            this.isSubmitting = false;
            console.error('Error updating supplier:', error);
          },
        });
      } else {
        this.supplierService.addSupplier(supplierData).subscribe({
          next: (supplier) => {
            this.snackBar.open('Supplier added successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar',
            });
            this.isSubmitting = false;
            this.router.navigate(['/suppliers']);
          },
          error: (error) => {
            this.snackBar.open('Error adding supplier', 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar',
            });
            this.isSubmitting = false;
            console.error('Error adding supplier:', error);
          },
        });
      }
    } else {
      this.markFormGroupTouched(this.supplierForm);
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

  onCancel(): void {
    this.router.navigate(['/suppliers']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.supplierForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    return '';
  }

  addSuppliedItem(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const currentItems = this.supplierForm.get('suppliedItems')?.value || [];
      this.supplierForm.patchValue({
        suppliedItems: [...currentItems, value],
      });
    }
    event.chipInput!.clear();
  }

  removeSuppliedItem(index: number): void {
    const currentItems = this.supplierForm.get('suppliedItems')?.value || [];
    const updatedItems = [...currentItems];
    updatedItems.splice(index, 1);
    this.supplierForm.patchValue({
      suppliedItems: updatedItems,
    });
  }
}
