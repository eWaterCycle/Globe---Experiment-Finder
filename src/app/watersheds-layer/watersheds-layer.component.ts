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

  // public getJSON(): Observable<FeatureCollection<Polygon, MyProperties>> {
  //   return this.http.get<FeatureCollection<Polygon, MyProperties>>('./assets/af_bas_30s_beta.json');
  //   // return this.http.get<FeatureCollection<Polygon, MyProperties>>('./assets/test.json');
  // }

  // public loadGeoJSON(data: FeatureCollection<Polygon, MyProperties>): Observable<AcNotification> {
  //   const polygons: AcNotification[] = [];

  //   data.features.map((feature: Feature<Polygon, MyProperties>) => {
  //     if (feature && feature.geometry && feature.geometry.coordinates) {
  //       const coords = [];
  //       if (feature.geometry.type === 'Polygon') {
  //         feature.geometry.coordinates.map((outer, i) => {
  //           // The last index is a duplicate of the first in these polygons, so discard it.
  //           if (i < outer.length - 1) {
  //             outer.map(inner => {
  //               coords.push(inner[0]);
  //               coords.push(inner[1]);
  //             });
  //           }
  //         });
  //       } else if (feature.geometry.type === 'MultiPolygon') {
  //         const positions = [];
  //         // The last index is a duplicate of the first in these polygons, so discard it.
  //         feature.geometry.coordinates.map(outer => {
  //           // Multipolygons are one level deeper
  //           outer.map((middle, i) => {
  //             if (i < middle.length - 1) {
  //               middle.map(inner => {
  //                 coords.push(inner[0]);
  //                 coords.push(inner[1]);
  //               });
  //             }
  //           });
  //         });
  //       }
  //       const hierarchy = { positions: Cesium.Cartesian3.fromDegreesArray(coords) };

  //       const polygon: AcNotification = {
  //         id: feature.properties.BASIN_ID.toString(),
  //         entity: new AcEntity({
  //             hierarchy: hierarchy,
  //             material : Cesium.Color.BLUE.withAlpha(0.0),
  //             height : 0,
  //             // extrudedHeight: 100000,
  //             outlineColor : Cesium.Color.WHITE,
  //             outline : true
  //           }),
  //         actionType: ActionType.ADD_UPDATE
  //       };

  //       polygons.push(polygon);
  //     }
  //   });

  //   return <Observable<AcNotification>>Observable.from(polygons);
  // }

  ngOnInit() {
    const updater = new Subject<AcNotification>();
    // const service = new WatershedsLoadingService();
    this.polygons$ = this.watershedsLoadingService.getWatersheds('./assets/ca_bas_30s_beta.json')
      // .merge(this.watershedsLoadingService.getWatersheds('./assets/as_bas_30s_beta.json'))
      .merge(this.updater);
    // const observable: Observable<FeatureCollection<Polygon, MyProperties>> = this.getJSON();
    // this.polygons$ = observable.flatMap(
    //   data => this.loadGeoJSON(data)
    // ).merge(this.updater);

    // this.polygons$.subscribe((data) => {
    //   console.log(JSON.stringify(data, null, 4));
    // }, error => console.log(error));
  }

}
