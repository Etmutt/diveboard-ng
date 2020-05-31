import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpRequest,
  HttpParams,
  HttpEventType,
  HttpResponse,
} from "@angular/common/http";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

/* FROM : https://malcoded.com/posts/angular-file-upload-component-with-express/#the-file-upload-service */

@Injectable({
  providedIn: "root",
})
export class UploadService {
  constructor(private http: HttpClient) {}

  // upload picture / video
  public upload(
    files: Set<File>
  ): { [key: string]: { progress: Observable<number> } } {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach((file) => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append("file", file);
      //add the name of the file as parameter
      const params = new HttpParams().set("qq", file.name);

      //authenticity_token=gzD6rbQcPwojg6xy%2BzDmMErK0%2Bm7qhI7ahRG4DeuZrc%3D&user_id=48711&qqfile=20191205060057-shutterstock-12248511731.jpeg
      //authenticity_token=gzD6rbQcPwojg6xy%2BzDmMErK0%2Bm7qhI7ahRG4DeuZrc%3D&user_id=48711&qqfile=15534lmanssens.jpg
      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest(
        "POST",
        `${environment.apiUrl}/picture/upload`,
        formData,
        {
          reportProgress: true,
          params,
        }
      );

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage
          const percentDone = Math.round((100 * event.loaded) / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable(),
      };
    });

    // return the map of progress.observables
    return status;
  }
}
