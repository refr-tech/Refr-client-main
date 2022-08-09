import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDoComponent } from './store-do.component';

describe('StoreDoComponent', () => {
  let component: StoreDoComponent;
  let fixture: ComponentFixture<StoreDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreDoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
