import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChipsBuddiesComponent } from "./chips-buddies.component";

describe("ChipsBuddiesComponent", () => {
  let component: ChipsBuddiesComponent;
  let fixture: ComponentFixture<ChipsBuddiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChipsBuddiesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsBuddiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
