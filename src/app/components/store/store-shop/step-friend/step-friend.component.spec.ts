import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFriendComponent } from './step-friend.component';

describe('StepFriendComponent', () => {
  let component: StepFriendComponent;
  let fixture: ComponentFixture<StepFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepFriendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
