import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private router:Router) {}

  loginUser(username: String, password: String, rememberMe: Boolean) {
    let url = "/api/login";
    this.http.post<{username: string}>(url, {username, password, rememberMe}).subscribe(data => {
      sessionStorage.setItem('currentUser', JSON.stringify(data));
      this.router.navigate(["/courses"])
    }, err => {
      console.log(err);
    });
  }

  logoutUser() {
    let url = "/api/logout";
    this.http.post(url, null).subscribe(data => {
      sessionStorage.clear();
      this.router.navigate(["/courses"])
    }, err => {
      console.log(err);
    });
  }

  isAuthenticated() {
    return sessionStorage.getItem('currentUser') !== null;
  }
}
