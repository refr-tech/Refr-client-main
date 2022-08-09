import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreHowWorkComponent } from './store-how-work.component';

describe('StoreHowWorkComponent', () => {
  let component: StoreHowWorkComponent;
  let fixture: ComponentFixture<StoreHowWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreHowWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreHowWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
