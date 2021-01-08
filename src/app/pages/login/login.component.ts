// Sweet alert 2 was causing some nasty errors
declare var swal: any;

import { Component, OnInit } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { UserModel } from "../../models/user.model";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  user: UserModel;
  rememberMe = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = new UserModel();
    if (localStorage.getItem("email")) {
      this.user.email = localStorage.getItem("email");
      this.rememberMe = true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }
    swal.fire("Loading!", "please wait...", "info");
    swal.showLoading();

    this.auth.login(this.user).subscribe(
      (res) => {
        console.log(res);
        swal.close();

        if (this.rememberMe) {
          localStorage.setItem("email", this.user.email);
        }

        this.router.navigateByUrl("/home");
      },
      (err) => {
        console.log(err.error.error.message);
        swal.fire("Something went wrong :(", err.error.error.message, "error");
      }
    );
  }
}
