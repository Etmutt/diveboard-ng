import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserDivesComponent } from "./components/user-dives/user-dives.component";
import { DiveEditComponent } from "./components/dive-edit/dive-edit.component";
import { LoginComponent } from "./components/login/login.component";
import { ManageLocationComponent } from "./components/manage-location/manage-location.component";

import { AuthService } from "./_services/auth.service";

const routes: Routes = [
  //user url : home brings logbook for now
  {
    path: "user_dive",
    canActivate: [AuthService],
    component: UserDivesComponent,
    data: { menu: "user" },
  },

  //dive url : bring to the dive edit component
  {
    path: "dive/:id",
    canActivate: [AuthService],
    component: DiveEditComponent,
    data: { menu: "user" },
  },

  //login : bring to the dive edit component
  {
    path: "login",
    component: LoginComponent,
    data: { menu: "hidden" },
  },

  //map shearch : temp for dev
  {
    path: "location",
    component: ManageLocationComponent,
    data: { menu: "hidden" },
  },

  //default : bring to home
  {
    path: "**",
    canActivate: [AuthService],
    component: UserDivesComponent,
    data: { menu: "user" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
