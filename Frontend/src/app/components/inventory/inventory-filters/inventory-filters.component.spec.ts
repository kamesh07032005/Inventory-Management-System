import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryFiltersComponent } from './inventory-filters.component';

describe('InventoryFiltersComponent', () => {
  let component: InventoryFiltersComponent;
  let fixture: ComponentFixture<InventoryFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryFiltersComponent]
    });
    fixture = TestBed.createComponent(InventoryFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
