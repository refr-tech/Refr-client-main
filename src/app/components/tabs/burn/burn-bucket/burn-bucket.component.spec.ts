import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnBucketComponent } from './burn-bucket.component';

describe('BurnBucketComponent', () => {
  let component: BurnBucketComponent;
  let fixture: ComponentFixture<BurnBucketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurnBucketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
