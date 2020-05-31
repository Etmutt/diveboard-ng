import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { map, delay } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class APIErrorInterceptor implements HttpInterceptor {
  //intercept all request with answer sucess = flase and create an error with error message
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // filter only response from api (not for search) without success and  create error
      map((event: HttpEvent<any>) => {
        if (
          event instanceof HttpResponse &&
          event.url.includes(environment.apiUrl) &&
          !event.url.includes(`${environment.apiUrl}/search`) &&
          event.body &&
          !event.body.success
        ) {
          throw new HttpErrorResponse({
            error: event.body.error_code || event.body.error_tag,
            headers: event.headers,
            status: 500,
            statusText: "API error" || event.body.error || event.body.message,
            url: event.url,
          });
        }
        return event;
      })
    );
  }
}
