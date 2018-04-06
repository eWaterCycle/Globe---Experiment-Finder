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

    private makeAcNotification(id, hierarchy, outlineColor, fillColor): AcNotification {
        const notification: AcNotification = {
            id: id,
            entity: new AcEntity({
                name: 'BASIN ID: ' + id,
                hierarchy: hierarchy,
                material: fillColor,
                height: 0,
                // extrudedHeight: 100000,
                outlineColor: outlineColor,
                outline: true
            }),
            actionType: ActionType.ADD_UPDATE
        };
        return notification;
    }

    public loadGeoJSON(data: FeatureCollection<Polygon, MyProperties>): Observable<AcNotification> {
        const polygons: AcNotification[] = [];

        data.features.map((feature: Feature<Polygon, MyProperties>) => {
            let hierarchy = {positions: {}, holes: []};
            const fillColor = Cesium.Color.BLUE.withAlpha(0.01);

            if (feature && feature.geometry && feature.geometry.coordinates && Number.parseFloat(feature.properties.AREA_SQKM) > 200.0) {
                if (feature.geometry.type === 'Polygon') {
                    const coords = [];
                    feature.geometry.coordinates.map((outer, i) => {
                        // The last index is a duplicate of the first in these polygons, so discard it.
                        if (i < outer.length - 1) {
                            outer.map(inner => {
                                coords.push(inner[0]);
                                coords.push(inner[1]);
                            });
                        }
                    });
                    hierarchy = { positions: Cesium.Cartesian3.fromDegreesArray(coords), holes: [] };
                } else if (feature.geometry.type === 'MultiPolygon') {
                    // fillColor = Cesium.Color.RED.withAlpha(0.5);
                    feature.geometry.coordinates.map((outer, j) => {
                        const coords = [];
                        // Multipolygons are one level deeper
                        outer.map((middle, i) => {
                            middle.map(inner => {
                                coords.push(inner[0]);
                                coords.push(inner[1]);
                            });
                            if (i === 0) {
                                hierarchy.positions = Cesium.Cartesian3.fromDegreesArray(coords);
                            } else {
                                // hierarchy.holes.push({positions: Cesium.Cartesian3.fromDegreesArray(coords)});
                            }
                        });
                    });
                }

                polygons.push(this.makeAcNotification(
                    feature.properties.BASIN_ID.toString(),
                    hierarchy,
                    Cesium.Color.WHITE,
                    fillColor
                ));
            }
        });

        return <Observable<AcNotification>>Observable.from(polygons);
    }
}
