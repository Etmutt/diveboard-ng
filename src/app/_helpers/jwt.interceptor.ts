import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

import { AuthService } from "../_services/auth.service";

//add jwt token to all outgoing api call ; if logged in

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let token = this.authenticationService.getToken();
    if (
      this.authenticationService.isLoggedIn() &&
      request.url.includes(environment.apiUrl) &&
      !request.url.includes("login")
    ) {
      request = request.clone({
        setParams: {
          auth_token: `${token}`,
          apikey: `${environment.apiKey}`,
        },
      });
    }

    return next.handle(request);
  }
}
