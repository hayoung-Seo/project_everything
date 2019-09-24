import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterdataComponent } from './twitterdata.component';

describe('TwitterdataComponent', () => {
  let component: TwitterdataComponent;
  let fixture: ComponentFixture<TwitterdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
