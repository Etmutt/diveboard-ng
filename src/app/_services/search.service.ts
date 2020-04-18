import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Buddy } from "../_models/buddy.model";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(private http: HttpClient) {}

  // return buddy obs base on name
  public searchBuddy(search: string): Observable<[Buddy]> {
    const params = new HttpParams().set("q", search);

    return this.http
      .get<any>(`${environment.apiUrl}/search/user.json/`, { params })
      .pipe(
        map((req) => {
          return req;
        })
      );
  }
}
