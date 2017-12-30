import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})

export class RegisterComponent implements OnInit {
  errMessage: String;
  analyze: Function = function(value: string) {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    if(strongRegex.test(value)) {
      return 'strong';
    } else if(mediumRegex.test(value)) {
      return 'medium';
    } else {
      return 'weak';
    }
  }

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
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

  onRegisterUser(form: NgForm) {
    const username = form.value.username;
    const password = form.value.password;
    const user = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      school: form.value.school,
      grade: form.value.grade
    }
    this.authService.registerUser(user, username, password);
  }
}
