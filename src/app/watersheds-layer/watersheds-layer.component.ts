import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// import { from } from 'rxjs/observable/from';
// import { map } from 'rxjs/operators';

import 'rxjs/add/operator/map';
import { GeoJsonObject, FeatureCollection, GeometryObject, GeoJsonProperties, Feature, Polygon } from 'geojson';
import { MapEventsManagerService, EventRegistrationInput, AcLayerComponent, AcNotification, ActionType,
  CesiumEvent, CesiumEventModifier, AcEntity, PickOptions, MapsManagerService } from 'angular-cesium';

import { WatershedsLoadingService } from './watersheds-loading.service';

@Component({
  selector: 'app-watersheds-layer',
  templateUrl: './watersheds-layer.component.html',
  styleUrls: ['./watersheds-layer.component.css']
})
export class WatershedsLayerComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  polygons$: Observable<AcNotification>;
  show = true;
  updater = new Subject<AcNotification>();


  constructor(private eventManager: MapEventsManagerService,
              private mapsManagerService: MapsManagerService,
              private watershedsLoadingService: WatershedsLoadingService) {
    // Input about the wanted event
    const eventRegistration: EventRegistrationInput = {
      event: CesiumEvent.LEFT_CLICK, // event type enum. [required!]
      modifier: CesiumEventModifier.CTRL, // event modifier enum. [optional]
      entityType: AcEntity, // raise event only if AcEntity is clicked. [optional]
      priority: 0, // event priority, default 0 . [optional]
      pick: PickOptions.PICK_FIRST // entity pick option, default PickOptions.NO_PICK. [optional]
    };
    const clickEvent = this.eventManager.register(eventRegistration).subscribe((result) => {
      // The EventResult will contain:
      // movement(screen location of the event), entities(your entities) , primitives( cesium primitives, like label,billboard...)
      console.log('map click', result.movement, 'cesiumEntities:', result.cesiumEntities, 'entities', result.entities);
    });
  }

  ngOnInit() {
    const updater = new Subject<AcNotification>();
    // const service = new WatershedsLoadingService();
    // this.polygons$ = this.watershedsLoadingService.getWatersheds('./assets/test.json')
    this.polygons$ = this.watershedsLoadingService.getWatersheds('./assets/af_bas_30s_beta.json')
      .merge(this.watershedsLoadingService.getWatersheds('./assets/as_bas_30s_beta.json'))
      .merge(this.watershedsLoadingService.getWatersheds('./assets/au_bas_30s_beta.json'))
      .merge(this.watershedsLoadingService.getWatersheds('./assets/ca_bas_30s_beta.json'))
      .merge(this.watershedsLoadingService.getWatersheds('./assets/eu_bas_30s_beta.json'))
      .merge(this.watershedsLoadingService.getWatersheds('./assets/na_bas_30s_beta.json'))
      .merge(this.watershedsLoadingService.getWatersheds('./assets/sa_bas_30s_beta.json'))
      .merge(this.updater);

    // this.polygons$.subscribe((data) => {
    //   console.log(JSON.stringify(data, null, 4));
    // }, error => console.log(error));
  }

}
