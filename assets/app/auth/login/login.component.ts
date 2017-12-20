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

  constructor(private authService: AuthService) {}

  ngOnInit() {
  }

  onLoginUser(form: NgForm) {
    const username = form.value.username;
    const password = form.value.password;
    const rememberMe = form.value.rememberMe === true? true: false;
    this.authService.loginUser(username, password, rememberMe);
  }
}
