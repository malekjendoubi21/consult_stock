import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietesComponent } from './societes.component';

describe('SocietesComponent', () => {
  let component: SocietesComponent;
  let fixture: ComponentFixture<SocietesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocietesComponent]
    });
    fixture = TestBed.createComponent(SocietesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
