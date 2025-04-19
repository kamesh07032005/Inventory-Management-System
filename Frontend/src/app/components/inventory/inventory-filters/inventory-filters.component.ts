import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InventoryFilter, StockLevel, CATEGORIES } from '../../../models/inventory.model';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-inventory-filters',
  templateUrl: './inventory-filters.component.html',
  styleUrls: ['./inventory-filters.component.css']
})
export class InventoryFiltersComponent implements OnInit {
  @Output() filterChange = new EventEmitter<InventoryFilter>();

  filters: InventoryFilter = {};
  categories: string[] = CATEGORIES;
  stockLevels: string[] = Object.values(StockLevel);

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    // Initialize with empty filters
    this.resetFilters();
  }

  applyFilters(): void {
    // Create a copy of the filters to emit
    const filtersCopy: InventoryFilter = {};
    
    // Only include non-empty filters
    if (this.filters.category) {
      filtersCopy.category = this.filters.category;
    }
    
    if (this.filters.stockLevel) {
      filtersCopy.stockLevel = this.filters.stockLevel as StockLevel;
    }
    
    // Emit the filter change event
    this.filterChange.emit(filtersCopy);
  }

  resetFilters(): void {
    this.filters = {};
    this.filterChange.emit({});
  }
}
