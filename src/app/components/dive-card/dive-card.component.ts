import { Component, OnInit, Input } from "@angular/core";
import { DiveService } from "../../_services/dive.service";
import { Dive } from "../../_models/dive.model";

@Component({
  selector: "app-dive-card",
  templateUrl: "./dive-card.component.html",
  styleUrls: ["./dive-card.component.css"],
})
export class DiveCardComponent implements OnInit {
  @Input() diveID: number;

  dive: Dive;
  constructor(private diveService: DiveService) {}

  getdive(): void {
    this.diveService.getDive(this.diveID).subscribe(
      (data: Dive) => {
        this.dive = data;
      },
      (error) => {
        // this.error = error.statusText;
      }
    );
  }

  ngOnInit(): void {
    this.getdive();
    //  console.log(this.dive)
  }
}
