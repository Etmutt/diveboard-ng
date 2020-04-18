import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserDiveComponent } from "./user-dives.component";

describe("MyDivesComponent", () => {
  let component: UserDivesComponent;
  let fixture: ComponentFixture<UserDivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [USerDivesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
