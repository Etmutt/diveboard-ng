import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MaterialModule } from "./material.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./components/login/login.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { APIErrorInterceptor } from "./_helpers/apierror.interceptor";
import { HTTPErrorInterceptor } from "./_helpers/error.interceptor";
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { DiveCardComponent } from "./components/dive-card/dive-card.component";
import { DiveChartComponent } from "./components/dive-chart/dive-chart.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { LayoutModule } from "@angular/cdk/layout";
import { UserDivesComponent } from "./components/user-dives/user-dives.component";
import { NgChartjsModule } from "ng-chartjs";
import { DiveEditComponent } from "./components/dive-edit/dive-edit.component";
import { ChipsBuddiesComponent } from "./components/chips-buddies/chips-buddies.component";
import { ChipsDiveTagComponent } from "./components/chips-dive-tag/chips-dive-tag.component";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    NgChartjsModule,
    NgxMaterialTimepickerModule,
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
