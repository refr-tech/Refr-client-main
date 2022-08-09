import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreEthicComponent } from './store-ethic.component';

describe('StoreEthicComponent', () => {
  let component: StoreEthicComponent;
  let fixture: ComponentFixture<StoreEthicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreEthicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreEthicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
