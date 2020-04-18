import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DiveChartComponent } from "./dive-chart.component";

describe("DiveChartComponent", () => {
  let component: DiveChartComponent;
  let fixture: ComponentFixture<DiveChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiveChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiveChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
