import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Buddy } from "../_models/buddy.model";
import { Spot, SpotAdapter } from "../_models/spot.model";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(private http: HttpClient) {}

  // return buddy obs base on name
  public searchBuddy(search: string): Observable<[Buddy]> {
    const params = new HttpParams().set("q", search);

    return this.http
      .get<any>(`${environment.apiUrl}/search/user.json`, { params })
      .pipe(
        map((req) => {
          return req;
        })
      );
  }

  // return spot array obs base on geoloc
  public searchSpot(
    name?: string,
    lat?: number,
    lng?: number
  ): Observable<[Spot]> {
    let params = new HttpParams();
    if (name) {
      params = params.append("q", name);
    }
    if (lat) {
      params = params.append("lat", lat.toString());
    }
    if (lng) {
      params = params.append("lng", lng.toString());
    }

    return this.http
      .get<any>(`${environment.apiUrl}/search/spot`, { params })
      .pipe(
        map((req) => {
          return req.data.map((x) => SpotAdapter.adapt(x.data));
        })
      );
  }
}
