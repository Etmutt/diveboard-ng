import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay, filter } from "rxjs/operators";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { AuthService } from "../_services/auth.service";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.css"],
})
export class MainNavComponent implements OnInit {
  show_menu: boolean = true;
  user_menu: boolean = true;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService //private titleService: Title
  ) {}

  //handle side navigation display an content based on menu data passed as arg for each route
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        var rt = this.getChild(this.activatedRoute);

        rt.data.subscribe((data) => {
          switch (data.menu) {
            case "hidden":
              this.show_menu = false;
              this.user_menu = false;

              break;
            case "user":
              this.show_menu = true;
              this.user_menu = true;

              break;
            default:
              this.show_menu = true;
              this.user_menu = true;
          }
        });
      });
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
