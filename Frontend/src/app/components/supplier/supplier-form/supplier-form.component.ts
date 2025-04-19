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

  private showErrorAndRedirect(message: string) {
    this.isLoading = false;
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: 'error-snackbar',
    });
    this.router.navigate(['/suppliers']);
  }

  loadSupplierData(id: number): void {
    if (!id || isNaN(id)) {
      this.showErrorAndRedirect('Invalid supplier ID');
      return;
    }

    this.isLoading = true;
    this.supplierService.getSupplier(id).subscribe({
      next: (supplier) => {
        if (supplier) {
          this.isLoading = false;
          this.supplierForm.patchValue({
            name: supplier.name,
            contactName: supplier.contactName,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address || '',
            suppliedItems: supplier.suppliedItems || [],
          });
        } else {
          this.showErrorAndRedirect('Supplier not found');
        }
      },
      error: (error) => {
        this.showErrorAndRedirect('Error loading supplier data');
        console.error('Error loading supplier:', error);
      },
    });
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      // Add confirmation before submission
      if (
        !confirm(
          this.isEditMode
            ? 'Are you sure you want to update this supplier?'
            : 'Are you sure you want to add this supplier?'
        )
      ) {
        return;
      }
      
      this.saveSupplier();
    } else {
      this.markFormGroupTouched(this.supplierForm);
      this.snackBar.open(
        'Please fix the validation errors before submitting',
        'Close',
        {
          duration: 5000,
          panelClass: 'error-snackbar',
        }
      );
    }
  }

  saveSupplier(): void {
    if (this.supplierForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.supplierForm.controls).forEach(key => {
        const control = this.supplierForm.get(key);
        control?.markAsTouched();
      });
      this.snackBar.open('Please fix the form errors before submitting', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.supplierForm.value;

    // Create supplier object
    const supplier: Partial<Supplier> = {
      name: formValue.name.trim(),
      contactName: formValue.contactName.trim(),
      email: formValue.email.trim(),
      phone: formValue.phone.trim(),
      address: formValue.address ? formValue.address.trim() : '',
      suppliedItems: formValue.suppliedItems
    };

    // Add or update based on mode
    if (this.isEditMode && this.supplierId) {
      this.supplierService.updateSupplier(this.supplierId, supplier).subscribe(
        updatedSupplier => {
          this.isSubmitting = false;
          this.snackBar.open('Supplier updated successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/suppliers']);
        },
        error => {
          this.isSubmitting = false;
          this.snackBar.open('Error updating supplier', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Error updating supplier:', error);
        }
      );
    } else {
      this.supplierService.addSupplier(supplier).subscribe(
        newSupplier => {
          this.isSubmitting = false;
          this.snackBar.open('Supplier added successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/suppliers']);
        },
        error => {
          this.isSubmitting = false;
          this.snackBar.open('Error adding supplier', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Error adding supplier:', error);
        }
      );
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
