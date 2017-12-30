import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})

export class LoginComponent implements OnInit {
  errMessage: String;

  constructor(private authService: AuthService) {
    this.authService.errDetected.subscribe((err) => {
      if (err.status === 400) {
        this.errMessage = err.error.message;
      } else if (err.status === 401) {
        this.errMessage = "Wrong username or password";
      }
      setTimeout(() => {
        this.errMessage = null;
      }, 3000);
    });
  }

  ngOnInit() {
  }

  onLoginUser(form: NgForm) {
    const username = form.value.username;
    const password = form.value.password;
    const rememberMe = form.value.rememberMe === true? true: false;
    this.authService.loginUser(username, password, rememberMe);
  }
}
