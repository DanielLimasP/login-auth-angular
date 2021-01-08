declare var swal: any;

import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { UserModel } from "../../models/user.model";
import { FormsModule, NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
  user: UserModel;
  rememberMe = false;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = new UserModel();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    swal.fire("Loading!", "please wait...", "info");
    swal.showLoading();

    this.auth.signUp(this.user).subscribe(
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
