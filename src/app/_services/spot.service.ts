import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { Dive } from "../_models/dive.model";

@Injectable({
  providedIn: "root",
})
export class SpotService {
  constructor(private http: HttpClient) {}

  getSpot(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/V2/spot/${id}`).pipe(
      map((spot) => {
        return spot.result;
      })
    );
  }
}
