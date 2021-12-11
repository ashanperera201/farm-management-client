import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PondUpdateComponent } from './pond-update.component';

describe('PondUpdateComponent', () => {
  let component: PondUpdateComponent;
  let fixture: ComponentFixture<PondUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PondUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PondUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
