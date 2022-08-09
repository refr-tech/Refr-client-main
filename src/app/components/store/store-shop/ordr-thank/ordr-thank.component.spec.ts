import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdrThankComponent } from './ordr-thank.component';

describe('OrdrThankComponent', () => {
  let component: OrdrThankComponent;
  let fixture: ComponentFixture<OrdrThankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdrThankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdrThankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
