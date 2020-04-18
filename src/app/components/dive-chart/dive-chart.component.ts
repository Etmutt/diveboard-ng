import { Component, OnInit, Input } from "@angular/core";
import { DiveService } from "../../_services/dive.service";
import { ProfileData } from "../../_models/profiledata.model";
import { ChartDataSets, ChartOptions } from "chart.js";
import * as moment from "moment";

@Component({
  selector: "app-dive-chart",
  templateUrl: "./dive-chart.component.html",
  styleUrls: ["./dive-chart.component.css"],
})
export class DiveChartComponent implements OnInit {
  @Input() diveID: number;
  profile: [ProfileData];
  loading: boolean = true;

  /* ----- chart fixed set up -----*/
  public ChartType = "line";
  public ChartLegend = false;
  public ChartData: ChartDataSets[];
  public ChartLabels: any;
  public ChartOptions: ChartOptions = {
    responsive: true,
    spanGaps: false,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0, // disables bezier curves
      },
      point: {
        hitRadius: 5,
      },
    },

    tooltips: {
      mode: "index",
      displayColors: false,
    },

    scales: {
      yAxes: [
        {
          id: "Depth",
          type: "linear",
          position: "left",
          ticks: {
            beginAtZero: true,
            reverse: true,
          },
          scaleLabel: {
            display: true,
            labelString: "Depth",
          },
        },
        {
          id: "Temp",
          type: "linear",
          position: "right",
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: false,
          },
        },
      ],

      xAxes: [
        {
          type: "time",
          gridLines: {
            display: false,
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 20,
            display: false,
          },
          time: {
            tooltipFormat: "HH:mm:ss",
          },
        },
      ],
    },
  };
  public ChartColor = [
    {
      // depth (green)
      backgroundColor: "rgba(132, 204, 245, 0.2)",
      borderColor: "rgba(117, 196, 104, 1)",
      pointBackgroundColor: "rgba(0,0,0,0)",
      pointBorderColor: "rgba(0,0,0,0)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    {
      // ascent violation (red)
      backgroundColor: "rgba(132, 204, 245, 0.2)",
      borderColor: "rgba(196, 104, 104, 1)",
      pointBackgroundColor: "rgba(0,0,0,0)",
      pointBorderColor: "rgba(0,0,0,0)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    {
      // temperature
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "red",
      pointBackgroundColor: "rgba(0,0,0,0)",
      pointBorderColor: "rgba(0,0,0,0)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];

  constructor(private diveService: DiveService) {}

  //get profile object and call chart init if successful
  getProfile(): void {
    this.diveService.getDiveProfile(this.diveID).subscribe((data) => {
      this.profile = data;
      this.initChart();
    });
  }

  //map the profile and init the chart
  initChart(): void {
    //depth is divided to display in green or red if ascent violation
    const depth_ok: number[] = this.profile.map((x) =>
      !x.ascent_violation ? x.depth : null
    );
    const depth_violation: number[] = this.profile.map((x) =>
      x.ascent_violation ? x.depth : null
    );
    const temp: number[] = this.profile.map((x) => x.current_water_temperature);

    // not shown; to check if it can be made optional in UI
    const pressure: number[] = this.profile.map(
      (x) => x.main_cylinder_pressure
    );
    const heart_beats: number[] = this.profile.map((x) => x.heart_beats);

    // event that will be shown on the depth curve
    const deco_start: number[] = this.profile.map((x) =>
      x.deco_start ? x.depth : null
    );
    const surface_event: number[] = this.profile.map((x) =>
      x.surface_event ? x.depth : null
    );
    const test: number[] = this.profile.map((x) =>
      x.seconds == 400 ? x.depth : null
    );
    const bookmark: number[] = this.profile.map((x) =>
      x.bookmark ? x.depth : null
    );
    const deco_violation: number[] = this.profile.map((x) =>
      x.deco_violation ? x.depth : null
    );
    const Ltime = this.profile.map((x) =>
      moment().startOf("day").seconds(x.seconds)
    );

    this.ChartData = [
      //graph
      { data: depth_ok, label: "Depth", borderWidth: 1, yAxisID: "Depth" },
      {
        data: depth_violation,
        label: "Depth",
        borderWidth: 1,
        yAxisID: "Depth",
      },
      { data: temp, label: "Temperature", borderWidth: 1, yAxisID: "Temp" },

      //event
      {
        data: deco_start,
        label: "Deco start",
        yAxisID: "Depth",
        pointStyle: "cross",
        pointBackgroundColor: "rgba(250, 250, 250, 1)",
        pointRadius: 10,
        pointBorderWidth: 2,
      },
      {
        data: deco_violation,
        label: "Deco violation",
        yAxisID: "Depth",
        pointStyle: "triangle",
        pointBackgroundColor: "rgba(250, 250, 250, 1)",
        pointRadius: 10,
        pointBorderWidth: 2,
      },
      {
        data: bookmark,
        label: "Bookmark",
        yAxisID: "Depth",
        pointStyle: "star",
        pointBackgroundColor: "rgba(250, 250, 250, 1)",
        pointRadius: 10,
        pointBorderWidth: 2,
      },
      {
        data: surface_event,
        label: "Surface",
        yAxisID: "Depth",
        pointStyle: "circle",
        pointBackgroundColor: "rgba(250, 250, 250, 1)",
        pointRadius: 10,
        pointBorderWidth: 2,
      },
    ];
    this.ChartLabels = Ltime;
    this.loading = false;
  }

  ngOnInit(): void {
    this.getProfile();
  }
}
