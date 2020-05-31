import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { DiveService } from "../../_services/dive.service";
import { Dive } from "../../_models/dive.model";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { GalleryItem, ImageItem } from "@ngx-gallery/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-dive-card",
  templateUrl: "./dive-card.component.html",
  styleUrls: ["./dive-card.component.css"],
})
export class DiveCardComponent implements OnInit, OnDestroy {
  @Input() diveID: number;
  dive$: Observable<Dive>;
  images: GalleryItem[];

  constructor(private diveService: DiveService, private router: Router) {}

  getdive(): void {
    this.dive$ = this.diveService
      .getDive(this.diveID)
      .pipe(
        tap(
          (data) =>
            (this.images = data.pictures.map(
              (x) => new ImageItem({ src: x.medium, thumb: x.thumbnail })
            ))
        )
      );
  }

  ngOnInit(): void {
    this.getdive();
  }

  ngOnDestroy() {
    //this.dive$.unsubscribe();
  }
}
