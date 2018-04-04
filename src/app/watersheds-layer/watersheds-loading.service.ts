import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

import { FeatureCollection, GeoJsonProperties, Feature, Polygon } from 'geojson';
import { AcNotification, ActionType, AcEntity } from 'angular-cesium';
import { Injectable } from '@angular/core';

interface MyProperties extends GeoJsonProperties {
    BASIN_ID: string;
    AREA_SQKM: string;
}

@Injectable()
export class WatershedsLoadingService {
    updater = new Subject<AcNotification>();

    constructor(private http: HttpClient) {
    }

    public getWatersheds(path: string): Observable<AcNotification> {
        const observable: Observable<FeatureCollection<Polygon, MyProperties>> = this.getJSON(path);
        return observable.flatMap(
          data => this.loadGeoJSON(data)
        );
    }

    public getJSON(path: string): Observable<FeatureCollection<Polygon, MyProperties>> {
        return this.http.get<FeatureCollection<Polygon, MyProperties>>(path);
        // return this.http.get<FeatureCollection<Polygon, MyProperties>>('./assets/af_bas_30s_beta.json');
        // return this.http.get<FeatureCollection<Polygon, MyProperties>>('./assets/test.json');
    }

    public loadGeoJSON(data: FeatureCollection<Polygon, MyProperties>): Observable<AcNotification> {
        const polygons: AcNotification[] = [];

        data.features.map((feature: Feature<Polygon, MyProperties>) => {
            if (feature && feature.geometry && feature.geometry.coordinates) {
                const coords = [];
                if (feature.geometry.type === 'Polygon') {
                    feature.geometry.coordinates.map((outer, i) => {
                        // The last index is a duplicate of the first in these polygons, so discard it.
                        if (i < outer.length - 1) {
                            outer.map(inner => {
                                coords.push(inner[0]);
                                coords.push(inner[1]);
                            });
                        }
                    });
                } else if (feature.geometry.type === 'MultiPolygon') {
                    const positions = [];
                    // The last index is a duplicate of the first in these polygons, so discard it.
                    feature.geometry.coordinates.map(outer => {
                        // Multipolygons are one level deeper
                        outer.map((middle, i) => {
                            if (i < middle.length - 1) {
                                middle.map(inner => {
                                    coords.push(inner[0]);
                                    coords.push(inner[1]);
                                });
                            }
                        });
                    });
                }
                const hierarchy = { positions: Cesium.Cartesian3.fromDegreesArray(coords) };

                const polygon: AcNotification = {
                    id: feature.properties.BASIN_ID.toString(),
                    entity: new AcEntity({
                        hierarchy: hierarchy,
                        material: Cesium.Color.BLUE.withAlpha(0.0),
                        height: 0,
                        // extrudedHeight: 100000,
                        outlineColor: Cesium.Color.WHITE,
                        outline: true
                    }),
                    actionType: ActionType.ADD_UPDATE
                };

                polygons.push(polygon);
            }
        });

        return <Observable<AcNotification>>Observable.from(polygons);
    }
}
