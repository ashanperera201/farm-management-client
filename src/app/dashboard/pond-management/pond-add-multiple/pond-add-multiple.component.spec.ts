import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PondAddMultipleComponent } from './pond-add-multiple.component';

describe('PondAddMultipleComponent', () => {
  let component: PondAddMultipleComponent;
  let fixture: ComponentFixture<PondAddMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PondAddMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PondAddMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
