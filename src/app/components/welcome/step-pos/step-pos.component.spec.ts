import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPosComponent } from './step-pos.component';

describe('StepPosComponent', () => {
  let component: StepPosComponent;
  let fixture: ComponentFixture<StepPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepPosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
