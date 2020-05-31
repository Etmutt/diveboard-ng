import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../../_services/auth.service";
import { User } from "../../_models/user.model";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "app-user-dives",
  templateUrl: "./user-dives.component.html",
  styleUrls: ["./user-dives.component.css"],
})
export class UserDivesComponent implements OnInit {
  user: User;
  error: string;
  page: number;
  item_per_page: number;
  items_displayed;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    /*Get all dive Id*/
    this.authService.getcurrentUser().subscribe(
      (data: User) => {
        console.log(data);
        this.page = 0;
        this.item_per_page = 25;
        this.user = data;
        this.paginate();
      },
      (error) => {
        this.error = error.statusText;
      }
    );
  }

  paginate(event?) {
    if (event) {
      this.item_per_page = event.pageSize;
      this.page = event.pageIndex;
    }

    this.items_displayed = this.user.all_dive_ids.slice(
      this.item_per_page * this.page,
      this.item_per_page * this.page + this.item_per_page
    );

    console.log(this.items_displayed);
  }
}
