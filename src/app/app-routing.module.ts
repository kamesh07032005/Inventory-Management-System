import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InventoryListComponent } from './components/inventory/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './components/inventory/inventory-form/inventory-form.component';
import { SupplierListComponent } from './components/supplier/supplier-list/supplier-list.component';
import { SupplierFormComponent } from './components/supplier/supplier-form/supplier-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inventory', component: InventoryListComponent },
  { path: 'inventory/new', component: InventoryFormComponent },
  { path: 'inventory/edit/:id', component: InventoryFormComponent },
  { path: 'suppliers', component: SupplierListComponent },
  { path: 'suppliers/new', component: SupplierFormComponent },
  { path: 'suppliers/edit/:id', component: SupplierFormComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
