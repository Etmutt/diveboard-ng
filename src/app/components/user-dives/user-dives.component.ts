import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../_services/auth.service";
import { User } from "../../_models/user.model";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "app-user-dives",
  templateUrl: "./user-dives.component.html",
  styleUrls: ["./user-dives.component.css"],
})
export class UserDivesComponent implements OnInit {
  user: User;
  error: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getcurrentUser().subscribe(
      (data: User) => {
        console.log(data);
        this.user = data;
      },
      (error) => {
        this.error = error.statusText;
      }
    );
  }
}
