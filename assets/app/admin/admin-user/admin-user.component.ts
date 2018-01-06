import { Component, OnInit } from '@angular/core';
import { AdminService } from './../admin.service';

@Component({
  selector: 'admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css'],
  providers: [AdminService]
})

export class AdminUserComponent implements OnInit {
  users = [];
  showCourses = [];
  showQuestions = [];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getUsers((users) => {
      this.users = users;
    });
  }
}
