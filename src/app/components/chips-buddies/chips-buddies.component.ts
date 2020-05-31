import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  forwardRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from "@angular/core";

import { COMMA, ENTER} from "@angular/cdk/keycodes";

import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Subscription } from "rxjs";
import { Buddy } from "../../_models/buddy.model";
import { SearchService } from "../../_services/search.service";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  FormGroup,
  FormControl,
  NG_VALIDATORS,
} from "@angular/forms";
import {
  map,
  startWith,
  filter,
  tap,
  switchMap,
  debounceTime,
  finalize,
} from "rxjs/operators";

import { Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortalDirective } from "@angular/cdk/portal";
import { isUndefined } from "util";

/*-----------------
buddies form field ; with :
- auto complete
- mail addition for extranl user
- facebook search (to be done)

> Takes input of buddy[] as form control
> Mimics normal angular form component behavior and can be used as is in any other form
*/

@Component({
  selector: "app-chips-buddies",
  templateUrl: "./chips-buddies.component.html",
  styleUrls: ["./chips-buddies.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsBuddiesComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipsBuddiesComponent),
      multi: true,
    },
  ],
})
export class ChipsBuddiesComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  /*  BUDDY CHIP CONF */
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  form: FormGroup;
  buddyCtrl = new FormControl();

  /*  AUTO COMPLETE CONF */
  searchedBuddies: any;
  subscriptions: Subscription[] = [];
  buddies: Buddy[];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild("buddyInput") buddyInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  /* Facebook and mail overlay */
  overlayRef: OverlayRef;
  @ViewChild("FbOverlay") FbOverlay: TemplatePortalDirective;
  @ViewChild("MailOverlay") MailOverlay: TemplatePortalDirective;
  nameEmailOverlay: string = "";
  mailEmailOverlay: string = "";


  constructor(
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private overlay: Overlay
  ) {
    //instance the form
    this.form = this.formBuilder.group({ buddyCtrl: "" });
  }

  /* subscribe to change of value in input and subscribe for auto complete*/
  ngOnInit() {
    this.buddyCtrl.valueChanges
      .pipe(
        debounceTime(200),
        tap((value) => {
          if (!(!isUndefined(value) && value !== null && value.length > 0)) {
            this.searchedBuddies = [];
          }
        }),
        filter((value) => value && value !== null && value.length > 0),
        switchMap((value) =>
          this.searchService.searchBuddy(value).pipe(finalize(() => {}))
        )
      )
      .subscribe((data) => {
        this.searchedBuddies = data.slice(1, 6);
      });
  }

  /*add buddy NOT from autocomplete*/
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our buddy
    if ((value || "").trim()) {
      this.buddies.push({
        name: value.trim(),
        id: null,
        fb_id: null,
        email: "",
        picturl: "",
      });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(buddy: Buddy): void {
    const index = this.buddies.indexOf(buddy);

    if (index >= 0) {
      this.buddies.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    //filter out facebook and email option
    switch (event.option.value) {

      case "FB_overlay":
        this.openFbOverlay();
        break;

      case "MAIL_overlay":
        this.openMailOverlay();
        break;

      default:
        this.buddies.push(event.option.value);
        this.buddyInput.nativeElement.value = "";
        this.buddyCtrl.setValue(null);
        break;
    }
  }

  openFbOverlay() {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .height("300px")
      .width("300px")
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      positionStrategy,
    });

    overlayConfig.hasBackdrop = true;

    this.overlayRef = this.overlay.create(overlayConfig);

    this.overlayRef.backdropClick().subscribe(() => {
      this.closeOverlay();
    });

    this.overlayRef.attach(this.FbOverlay);
  }

  openMailOverlay() {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

      const overlayConfig = new OverlayConfig({
        positionStrategy,
        maxWidth : '100%',
        maxHeight : '100%',
        width :'40em',
  
      });
    overlayConfig.hasBackdrop = true;

    this.overlayRef = this.overlay.create(overlayConfig);

    this.overlayRef.backdropClick().subscribe(() => {
      this.closeOverlay();
    });

    this.overlayRef.attach(this.MailOverlay);

    //inject name based on input
    this.mailEmailOverlay = "";
    this.nameEmailOverlay = this.buddyInput.nativeElement.value;
  }

  validateMail() {
    this.buddies.push({
      name: this.nameEmailOverlay,
      id: null,
      fb_id: null,
      email: this.mailEmailOverlay,
      picturl: "",
    });
    this.buddyInput.nativeElement.value = "";
    this.buddyCtrl.setValue(null);

    this.overlayRef.dispose();
    this.buddyInput.nativeElement.focus();
  }

  closeOverlay() {
    this.overlayRef.dispose();
    this.buddyInput.nativeElement.focus();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  get value(): Buddy[] {
    return this.buddies;
  }

  set value(value: Buddy[]) {

    this.buddies = value;
    this.onChange(value);
    this.onTouched();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value: Buddy[]) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.buddies = [];
      this.form.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.form.valid ? null : { profile: { valid: false } };
  }
}
