import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatButtonModule, MatCheckboxModule, MatMenuModule,
  MatSidenavModule, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS
} from '@angular/material';

import { AppComponent } from './app.component';
import { AngularCesiumModule, MapsManagerService } from 'angular-cesium';
import { CesiumMapComponent } from './cesium-map/cesium-map.component';
import { ProjectlogoComponent } from './projectlogo/projectlogo.component';
import { MapsLayerComponent } from './map-layer/maps-layer.component';
import { MenuComponent } from './menu/menu.component';
import { LayerSelectorComponent } from './layer-selector/layer-selector.component';
import { RegisLayoutComponent } from './regis-layout/regis-layout.component';
import { AddLayerModalComponent } from './add-layer-modal/add-layer-modal.component';
import { UploadModelModalComponent } from './upload-model-modal/upload-model-modal.component';
import { RunComputeModalComponent } from './run-compute-modal/run-compute-modal.component';
import { ModelSelectorComponent } from './model-selector/model-selector.component';
import { SimulationSelectorComponent } from './simulation-selector/simulation-selector.component';
import { LayerStylerComponent } from './layer-styler/layer-styler.component';
import { LayerService } from './services/layer-service';
import { WatershedsLayerComponent } from './watersheds-layer/watersheds-layer.component';
import { WatershedsLoadingService } from './watersheds-layer/watersheds-loading.service';

import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    CesiumMapComponent,
    ProjectlogoComponent,
    MapsLayerComponent,
    MenuComponent,
    LayerSelectorComponent,
    RegisLayoutComponent,
    AddLayerModalComponent,
    UploadModelModalComponent,
    RunComputeModalComponent,
    ModelSelectorComponent,
    SimulationSelectorComponent,
    LayerStylerComponent,
    WatershedsLayerComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSidenavModule,
    MatDialogModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    AngularCesiumModule.forRoot()
  ],
  providers: [LayerService,
    WatershedsLoadingService,
    MapsManagerService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
