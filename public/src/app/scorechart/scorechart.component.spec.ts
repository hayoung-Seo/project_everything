import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorechartComponent } from './scorechart.component';

describe('ScorechartComponent', () => {
  let component: ScorechartComponent;
  let fixture: ComponentFixture<ScorechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
