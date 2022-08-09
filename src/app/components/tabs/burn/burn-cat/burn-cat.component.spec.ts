import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnCatComponent } from './burn-cat.component';

describe('BurnCatComponent', () => {
  let component: BurnCatComponent;
  let fixture: ComponentFixture<BurnCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurnCatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
