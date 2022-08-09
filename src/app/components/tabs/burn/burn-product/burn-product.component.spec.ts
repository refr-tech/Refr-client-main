import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnProductComponent } from './burn-product.component';

describe('BurnProductComponent', () => {
  let component: BurnProductComponent;
  let fixture: ComponentFixture<BurnProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurnProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
