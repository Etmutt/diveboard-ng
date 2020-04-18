import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChipsDiveTagComponent } from "./chips-dive-tag.component";

describe("ChipsDiveTagComponent", () => {
  let component: ChipsDiveTagComponent;
  let fixture: ComponentFixture<ChipsDiveTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChipsDiveTagComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsDiveTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
