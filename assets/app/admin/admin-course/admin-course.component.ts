import { Component, OnInit } from '@angular/core';
import { Course } from './../../courses/course.model';
import { AdminService } from './../admin.service';

@Component({
  selector: 'admin-course',
  templateUrl: './admin-course.component.html',
  styleUrls: ['./admin-course.component.css'],
  providers: [AdminService]
})

export class AdminCourseComponent implements OnInit {
  courses = [];
  showParts = [];
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getCourses("", (courses) => {
      this.courses = courses;
      this.adminService.createShowPartsArray(courses.length, (showParts) => {
        this.showParts = showParts;
      })
    });
  }

  searchCourse(event, value) {
    if (event.keyCode == 13) {
      var query = value === ''? '' : `?name=${value}`
      this.adminService.getCourses(query, (courses) => {
        this.courses = courses;
      });
    }
  }
}
