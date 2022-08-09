import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreThankComponent } from './store-thank.component';

describe('StoreThankComponent', () => {
  let component: StoreThankComponent;
  let fixture: ComponentFixture<StoreThankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreThankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreThankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
