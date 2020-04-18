import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnInit,
  forwardRef,
  OnDestroy,
} from "@angular/core";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable, Subscription } from "rxjs";
import { Buddy } from "../../_models/buddy.model";
import { SearchService } from "../../_services/search.service";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  NG_VALIDATORS,
} from "@angular/forms";
import { map, startWith } from "rxjs/operators";

/*-----------------
buddies form field ;with auto complete takes input of buddy[] as form control
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
export class ChipsBuddiesComponent implements ControlValueAccessor, OnDestroy {
  form: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  buddyCtrl = new FormControl();
  filteredBuddies: Observable<Buddy[]>;
  subscriptions: Subscription[] = [];
  buddies: Buddy[];
  allBuddies: Buddy[] = [
    { name: "test-api connection to be done" },
    { name: "test2" },
  ];

  @ViewChild("buddyInput") buddyInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  get value(): Buddy[] {
    return this.buddies;
  }

  set value(value: Buddy[]) {
    this.buddies = value;
    this.onChange(value);
    this.onTouched();
  }

  constructor(private formBuilder: FormBuilder) {
    //instance the form
    this.form = this.formBuilder.group({ buddyCtrl: "" });

    //create an obs that filter the fixed autocomplet. to be replace by API
    this.filteredBuddies = this.buddyCtrl.valueChanges.pipe(
      startWith(null),
      map((buddy: string | null) =>
        buddy ? this._filter(buddy) : this.allBuddies
      )
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our buddy
    if ((value || "").trim()) {
      this.buddies.push({
        name: value.trim(),
        db_id: null,
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
    //to be added : selected should push the whole buddy object; not only name
    const test = new Buddy(event.option.viewValue);
    this.buddies.push(new Buddy(event.option.viewValue));
    this.buddyInput.nativeElement.value = "";
    this.buddyCtrl.setValue(null);
  }

  private _filter(value: string): Buddy[] {
    const filterValue = value.toLowerCase();
    return this.allBuddies;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onChange: any = () => {};
  onTouched: any = () => {};

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
