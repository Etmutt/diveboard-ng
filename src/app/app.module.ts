import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MaterialModule } from "./material.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { LayoutModule } from "@angular/cdk/layout";

/** NPM install */

import { AmazingTimePickerModule } from "amazing-time-picker";
import { NgChartjsModule } from "ng-chartjs";

/* internal component */
import { APIErrorInterceptor } from "./_helpers/apierror.interceptor";
import { HTTPErrorInterceptor } from "./_helpers/error.interceptor";
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { DiveCardComponent } from "./components/dive-card/dive-card.component";
import { DiveChartComponent } from "./components/dive-chart/dive-chart.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { LoginComponent } from "./components/login/login.component";
import { UserDivesComponent } from "./components/user-dives/user-dives.component";
import { DiveEditComponent } from "./components/dive-edit/dive-edit.component";
import { ChipsBuddiesComponent } from "./components/chips-buddies/chips-buddies.component";
import { ChipsDiveTagComponent } from "./components/chips-dive-tag/chips-dive-tag.component";
import { UploadComponent } from "./components/upload/upload.component";
import { ManageLocationComponent } from "./components/manage-location/manage-location.component";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DiveCardComponent,
    DiveChartComponent,
    MainNavComponent,
    UserDivesComponent,
    DiveEditComponent,
    ChipsBuddiesComponent,
    ChipsDiveTagComponent,
    UploadComponent,
    ManageLocationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    NgChartjsModule,
    AmazingTimePickerModule,
    LeafletModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: APIErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HTTPErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor() {}

  ngOnInit() {}
}
