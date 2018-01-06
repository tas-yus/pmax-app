import { Component, OnInit } from '@angular/core';
import { Course } from './../../courses/course.model';
import { AdminService } from './../admin.service';

@Component({
  selector: 'admin-part',
  templateUrl: './admin-part.component.html',
  styleUrls: ['./admin-part.component.css'],
  providers: [AdminService]
})

export class AdminPartComponent implements OnInit {
  parts = [];
  showVideos = [];
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getParts((parts) => {
      this.parts = parts;
    });
  }
}
