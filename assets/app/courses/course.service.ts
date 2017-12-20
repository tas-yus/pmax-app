import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Course } from './course.model';

@Injectable()
export class CourseService {

  constructor(private http: HttpClient, private router:Router) {}

  getCourses(limit: number) {
    this.http.get<Course[]>(`/api/courses?limit=${limit}`).subscribe(courses => {
      return courses;
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
