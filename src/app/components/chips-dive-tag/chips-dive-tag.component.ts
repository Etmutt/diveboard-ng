import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  forwardRef,
  OnDestroy,
} from "@angular/core";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  NG_VALIDATORS,
} from "@angular/forms";

/*------------------------------------------
this component is used as a tag field with chips for all. It implements an fixed autocomplete list.
> Mimics normal angular form component behavior and can be used as is in any other form
------------------------------------------*/

// describes what the return value of the form control will look like

@Component({
  selector: "app-chips-dive-tag",
  templateUrl: "./chips-dive-tag.component.html",
  styleUrls: ["./chips-dive-tag.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsDiveTagComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipsDiveTagComponent),
      multi: true,
    },
  ],
})
export class ChipsDiveTagComponent implements ControlValueAccessor, OnDestroy {
  form: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  public tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[];
  allTags: string[] = [
    "Leisure",
    "Drift",
    "Night",
    "Deep",
    "Wreck",
    "Cave",
    "Reef",
    "Photo",
    "Research",
  ];
  subscriptions: Subscription[] = [];

  @ViewChild("tagInput") tagInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  get value(): string[] {
    return this.tags;
  }

  set value(value: string[]) {
    this.tags = value;
    this.onChange(value);
    this.onTouched();
  }

  constructor(private formBuilder: FormBuilder) {
    //instance the form
    this.form = this.formBuilder.group({ tagCtrl: "" });

    //create on obs that filter the fixed autocomple
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add tag
    if ((value || "").trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.tagCtrl.setValue(null);

    //trigger the form control
    this.onChange({ tags: value });
    this.onTouched();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = "";
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(
      (tag) => tag.toLowerCase().indexOf(filterValue) === 0
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value: string[]) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.tags = [""];
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
