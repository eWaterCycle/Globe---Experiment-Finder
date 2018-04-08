import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlDrawerRightComponent } from './mdl-drawer-right.component';

describe('MdlDrawerRightComponent', () => {
  let component: MdlDrawerRightComponent;
  let fixture: ComponentFixture<MdlDrawerRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdlDrawerRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdlDrawerRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
