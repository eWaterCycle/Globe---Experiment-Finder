import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MapLayerProviderOptions } from '../models/map-layer-provider-options.enum';
import { AppSettingsService } from '../services/app-settings-service';
import { AcMapLayerProviderComponent, MapsManagerService, SceneMode } from 'angular-cesium';

@Component({
    selector: 'app-maps-layer',
    templateUrl: 'maps-layer.component.html',
    providers: [AppSettingsService, MapsManagerService]
})

export class MapsLayerComponent implements AfterViewInit {
    @ViewChild(AcMapLayerProviderComponent) blackMarbleMap: AcMapLayerProviderComponent;

    MapLayerProviderOptions = MapLayerProviderOptions;
    Cesium = Cesium;
    sceneMode = SceneMode.SCENE3D;

    constructor(public appSettingsService: AppSettingsService, private mapsManagerService: MapsManagerService) {
    }

    ngAfterViewInit(): void {
        // const mainMap = this.mapsManagerService.getMap('main-map');
        // const viewer = mainMap.getCesiumViewer();

        const parameters = {
            url :  'http://forecast.ewatercycle.org/ncWMS-2.0-rc1/wms?',
            service: 'WMS',
            version: '1.3.0',
            request: 'GetMap',
            CRS: 'CRS%3A84',
            styles: 'default-scalar%2Fdefault',
            format: 'image%2Fpng',
            LOGSCALE: true,
            time: '2017-11-30T00:00:00.000Z',
            colorscalerange: '1,92546.97',
            abovemaxcolor: 'extend',
            belowmincolor: 'extend',
            layers: '1/discharge'
        };

        this.blackMarbleMap.imageryLayersCollection.remove(this.blackMarbleMap, true);
        this.blackMarbleMap.imageryLayersCollection.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
                url: 'http://forecast.ewatercycle.org/ncWMS-2.0-rc1/wms?',
                layers: '1/discharge',
                parameters: parameters,
                enablePickFeatures: true
            }));
        this.blackMarbleMap.show = true;

        // this.blackMarbleMap.ngOnInit();

        // if (blackMarbleMap && blackMarbleMap.imageryLayer) {
        //     // another way to set alpha (or any imageLayers settings)
        //     blackMarbleMap.imageryLayer.alpha = 0.5;
        // }
    }
}
