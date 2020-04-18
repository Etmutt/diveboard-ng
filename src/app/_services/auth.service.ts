import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../_models/user.model";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public getcurrentUser(): Observable<User> {
    const id: number = JSON.parse(localStorage.getItem("UserID"));
    return this.getUser(id);
  }

  public getUser(id: number): Observable<User> {
    //change the flavour to private if ID = user loggedd in
    const flavour = (id = JSON.parse(localStorage.getItem("UserID")))
      ? "private"
      : "public";
    const params = new HttpParams().set("flavour", flavour);

    return this.http
      .get<any>(`${environment.apiUrl}/V2/user/${id}`, { params })
      .pipe(
        map((user) => {
          return user.result;
        })
      );
  }

  //login & store token
  public loginEmail(email: string, password: string): Observable<User> {
    const apikey = environment.apiKey;
    return this.http
      .post<any>(`${environment.apiUrl}/login_email`, {
        email,
        password,
        apikey,
      })
      .pipe(
        map((user) => {
          localStorage.setItem("JWTtoken", JSON.stringify(user.token));
          localStorage.setItem(
            "JWTexp",
            JSON.stringify(Date.parse(user.expiration))
          );
          localStorage.setItem("UserID", JSON.stringify(user.user.id));
          return user;
        })
      );
  }

  //logout
  public logout() {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("JWTexp");
    localStorage.removeItem("UserID");
    this.router.navigate([""]);
  }

  public isLoggedIn() {
    if (this.getExpiration() > Date.now()) {
      return JSON.parse(localStorage.getItem("UserID"));
    } else {
      this.logout();
      return false;
    }
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("JWTexp");
    return JSON.parse(expiration);
  }

  public getToken() {
    const token = localStorage.getItem("JWTtoken");
    return JSON.parse(token);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(["/login"]);
    }
  }
}
