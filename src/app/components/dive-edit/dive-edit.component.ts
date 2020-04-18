import { Component, OnInit, Input } from "@angular/core";
import { DiveService } from "../../_services/dive.service";
import { Dive } from "../../_models/dive.model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-dive-edit",
  templateUrl: "./dive-edit.component.html",
  styleUrls: ["./dive-edit.component.css"],
})
export class DiveEditComponent implements OnInit {
  diveID: number;
  dive$: Observable<Dive>;
  dive_init: Dive;
  diveForm: FormGroup;
  loading_save: boolean = false;
  hasChanges: boolean = false;

  send(): void {
    this.loading_save = true;
    this.hasChanges = false;

    //assign the value of the form to our dive & give it back to service
    this.dive_init = Object.assign(this.dive_init, this.diveForm.value);

    this.diveService.putDive(this.dive_init).subscribe(
      (data) => {
        this.loading_save = false;
      },
      (error) => {
        //////////////////////////////////////////////////TODO////////////////////////////////
        this.loading_save = false;
      }
    );
  }

  constructor(
    private diveService: DiveService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading_save = false;
    this.hasChanges = false;

    this.diveID = this.route.snapshot.params.id;

    this.diveForm = this.fb.group({
      duration: "",
      maxdepth: "",
      altitude: "",
      surface_interval: "",
      weights: "",
      water: "",
      privacy: "",
      favorite: "",
      trip_name: "",
      current: "",
      visibility: "",
      notes: "",
      public_notes: "",
      guide: "",
      temp_bottom: "",
      temp_surface: "",
      divetype: "",
      buddies: "",
      date: "",
      time: "",
    });

    //load the observable and patch the value of the form
    this.dive$ = this.diveService.getDive(this.diveID).pipe(
      tap((req) => this.diveForm.patchValue(req)),
      tap((req) => (this.dive_init = req))
    );
  }
}
