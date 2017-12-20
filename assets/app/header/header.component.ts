import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AuthService]
})

export class HeaderComponent implements OnInit {

  currentUser;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (sessionStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    }
  }

  ngAfterViewChecked() {
    if (sessionStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    }
  }

  onLogoutUser() {
    this.authService.logoutUser();
  }

}
