import { Component, OnInit, Input } from "@angular/core";
import { DiveService } from "../../_services/dive.service";
import { Dive } from "../../_models/dive.model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { UploadComponent } from "../upload/upload.component";
import { AmazingTimePickerService } from "amazing-time-picker";

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

    //assign the value of the form to our dive
    this.dive_init = Object.assign(this.dive_init, this.diveForm.value);

    //merge time & date
    this.dive_init.time_in = new Date(this.dive_init.date);
    const pieces = this.dive_init.time.split(":");
    this.dive_init.time_in.setHours(Number(pieces[0]));
    this.dive_init.time_in.setMinutes(Number(pieces[1]));
    console.log(this.diveForm.value.spot);
    console.log(this.dive_init);
    //feedback to service
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

  openUpload(): void {
    let dialogRef = this.dialog.open(UploadComponent, {
      width: "50%",
      height: "50%",
    });
  }

  opentime(): void {
    const amazingTimePicker = this.atp.open();

    amazingTimePicker.afterClose().subscribe((time) => {
      console.log(time);
    });
  }

  constructor(
    public dialog: MatDialog, //for upload
    private atp: AmazingTimePickerService, //for time picker
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
      dive_reviews_overall: "",
      dive_reviews_difficulty: "",
      dive_reviews_marine: "",
      dive_reviews_wreck: "",
      dive_reviews_bigfish: "",
      spot :"",
    });

    //load the observable .
    //  - patch the value of the form
    //  - log the dive
    //  - the the object for resend when saving
    //  - init the gallery component
    this.dive$ = this.diveService.getDive(this.diveID).pipe(
      tap((req) => this.diveForm.patchValue(req)),
      tap((req) => console.log(req)),
      tap((req) => (this.dive_init = req))
    );
  }
}
