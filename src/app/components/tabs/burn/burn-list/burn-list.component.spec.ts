import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnListComponent } from './burn-list.component';

describe('BurnListComponent', () => {
  let component: BurnListComponent;
  let fixture: ComponentFixture<BurnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurnListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
