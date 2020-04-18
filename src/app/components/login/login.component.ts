import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../_services/auth.service";
import { User } from "../../_models/user.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup;
  returnUrl: string;
  error: string;

  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.signinForm = this.fb.group({
      email: ["", Validators.email],
      password: ["", Validators.required],
    });
  }

  login() {
    const val = this.signinForm.value;

    this.loading = true;
    this.error = "";

    this.authService.loginEmail(val.email, val.password).subscribe(
      (data: User) => {
        this.router.navigate([this.returnUrl]);
        this.loading = false;
        this.router.navigate(["/"]);
      },
      (error) => {
        this.error = error.statusText;
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
}
