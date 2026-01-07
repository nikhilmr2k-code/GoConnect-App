import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenSpotsComponent } from './hidden-spots.component';

describe('HiddenSpotsComponent', () => {
  let component: HiddenSpotsComponent;
  let fixture: ComponentFixture<HiddenSpotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiddenSpotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HiddenSpotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
