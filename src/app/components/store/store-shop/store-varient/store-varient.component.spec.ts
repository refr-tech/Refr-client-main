import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreVarientComponent } from './store-varient.component';

describe('StoreVarientComponent', () => {
  let component: StoreVarientComponent;
  let fixture: ComponentFixture<StoreVarientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreVarientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreVarientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
