import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css']
})
export class InventoryFormComponent implements OnInit {
  inventoryForm: FormGroup;
  isEditMode = false;
  categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Other'];
  suppliers = [
    { id: 1, name: 'Supplier 1' },
    { id: 2, name: 'Supplier 2' },
    { id: 3, name: 'Supplier 3' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.inventoryForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      supplierId: ['', Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      // TODO: Load item data if in edit mode
    }
  }

  onSubmit() {
    if (this.inventoryForm.valid) {
      const formData = this.inventoryForm.value;
      if (this.isEditMode) {
        // TODO: Update existing item
      } else {
        // TODO: Create new item
      }
      this.router.navigate(['/inventory']);
    }
  }

  onCancel() {
    this.router.navigate(['/inventory']);
  }
}
