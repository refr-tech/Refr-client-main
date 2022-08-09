import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockRewardComponent } from './unlock-reward.component';

describe('UnlockRewardComponent', () => {
  let component: UnlockRewardComponent;
  let fixture: ComponentFixture<UnlockRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnlockRewardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
