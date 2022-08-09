import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRedeemComponent } from './store-redeem.component';

describe('StoreRedeemComponent', () => {
  let component: StoreRedeemComponent;
  let fixture: ComponentFixture<StoreRedeemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreRedeemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreRedeemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
