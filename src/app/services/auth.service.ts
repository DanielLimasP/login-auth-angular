import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserModel } from "../models/user.model";

import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "https://identitytoolkit.googleapis.com/v1/accounts:";
  API_KEY = "AIzaSyDinBOn2NvAcS7eJNyGt-Y2-Zh9VBqMLxE";
  userToken: string;

  headers: HttpHeaders = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Access-Control-Allow-Origin", "*")
    .set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    )
    .set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");

  // New users
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // Login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.getToken();
  }

  logout() {
    localStorage.removeItem("token");
  }

  login(user: UserModel) {
    const authData = {
      ...user,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.url}signInWithPassword?key=${this.API_KEY}`, authData, {
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          console.log("Rxjs map");
          this.storeToken(res["idToken"]);
          return res;
        })
      );
  }

  signUp(user: UserModel) {
    const authData = {
      ...user,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.url}signUp?key=${this.API_KEY}`, authData, {
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          console.log("Rxjs map");
          this.storeToken(res["idToken"]);
          return res;
        })
      );
  }

  private storeToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem("token", idToken);

    let today = new Date();
    today.setSeconds(3600);
    localStorage.setItem("expires", today.getTime().toString());
  }

  getToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }
    return this.userToken;
  }

  isAuthenticated(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }

    const expires = Number(localStorage.getItem("expires"));
    const expiresDate = new Date();
    expiresDate.setTime(3600);

    if (expiresDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
