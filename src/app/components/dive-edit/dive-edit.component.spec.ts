import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DiveEditComponent } from "./dive-edit.component";

describe("DiveEditComponent", () => {
  let component: DiveEditComponent;
  let fixture: ComponentFixture<DiveEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiveEditComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
