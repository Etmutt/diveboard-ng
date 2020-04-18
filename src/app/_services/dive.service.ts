import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Dive, DiveAdapter } from "../_models/dive.model";
import { ProfileData } from "../_models/profiledata.model";

@Injectable({
  providedIn: "root",
})
export class DiveService {
  constructor(private http: HttpClient) {}

  // get dive
  public getDive(id: number): Observable<Dive> {
    const params = new HttpParams().set("flavour", "mobile");

    return this.http
      .get(`${environment.apiUrl}/V2/dive/${id}`, { params })
      .pipe(map((req) => DiveAdapter.adapt(req)));
  }

  // get dive profile
  public getDiveProfile(id: number): Observable<[ProfileData]> {
    const params = new HttpParams().set("flavour", "dive_profile");

    return this.http
      .get<any>(`${environment.apiUrl}/V2/dive/${id}`, { params })
      .pipe(
        map((req) => {
          return req.result.raw_profile;
        })
      );
  }

  // put dive
  public putDive(dive: Dive): Observable<any> {
    console.log("testserv");
    const params = new HttpParams().set(
      "arg",
      JSON.stringify(DiveAdapter.trunc_write(dive))
    );

    return this.http
      .put<any>(`${environment.apiUrl}/V2/dive`, "", { params })
      .pipe(
        map((result) => {
          console.log(result);
          return result;
        })
      );
  }
}
