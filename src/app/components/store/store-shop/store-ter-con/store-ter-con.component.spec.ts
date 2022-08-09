import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreTerConComponent } from './store-ter-con.component';

describe('StoreTerConComponent', () => {
  let component: StoreTerConComponent;
  let fixture: ComponentFixture<StoreTerConComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreTerConComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreTerConComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
