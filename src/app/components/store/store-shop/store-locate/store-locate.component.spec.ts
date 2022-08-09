import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreLocateComponent } from './store-locate.component';

describe('StoreLocateComponent', () => {
  let component: StoreLocateComponent;
  let fixture: ComponentFixture<StoreLocateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreLocateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreLocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
