import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreShopComponent } from './store-shop.component';

describe('StoreShopComponent', () => {
  let component: StoreShopComponent;
  let fixture: ComponentFixture<StoreShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
