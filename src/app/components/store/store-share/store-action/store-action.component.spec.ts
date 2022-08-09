import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreActionComponent } from './store-action.component';

describe('StoreActionComponent', () => {
  let component: StoreActionComponent;
  let fixture: ComponentFixture<StoreActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
