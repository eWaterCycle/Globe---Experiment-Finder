import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatershedsLayerComponent } from './watersheds-layer.component';

describe('WatershedsLayerComponent', () => {
  let component: WatershedsLayerComponent;
  let fixture: ComponentFixture<WatershedsLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatershedsLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatershedsLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
