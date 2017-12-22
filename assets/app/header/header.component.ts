import { Component, OnInit } from '@angular/core';
import { AuthService} from '../auth/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AuthService]
})

export class HeaderComponent implements OnInit {

  currentUser;
  constructor(private authService: AuthService, private cdRef:ChangeDetectorRef) {}

  ngOnInit() {

  }

  ngAfterViewChecked() {
    if (sessionStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.cdRef.detectChanges();
    }

  }

  onLogoutUser() {
    this.authService.logoutUser();
  }

}
