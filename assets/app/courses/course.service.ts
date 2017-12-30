import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from './course.model';
import { Router } from '@angular/router';

@Injectable()
export class CourseService {

  constructor(private http: HttpClient, private router: Router) {}

  getCourses(limit: number, skip: number, callback) {
    this.http.get<Course[]>(`/api/courses?limit=${limit}&skip=${skip}`).subscribe(courses => {
      callback(courses);
    }, (err) => {
      console.log(err);
    });
  }

  getCourse(courseCode: String, callback) {
    this.http.get<{course: Course, owned: {type: String}}>(`/api/courses/${courseCode}`).subscribe(course => {
      callback(course)
    }, (err) => {
      if (err.status === 401) {
        this.router.navigate([`/courses/${courseCode}/learn`]);
      }
    });
  }

  getLearnCourse(courseCode: String, callback) {
    this.http.get<Course>(`/api/courses/${courseCode}/learn`).subscribe(course => {
      callback(course);
    }, (err) => {
      if (err.status == 401) {
        this.router.navigate([`/dashboard`]);
      }
    });
  }

  getLearnUser(courseCode: String, callback) {
    this.http.get<{course, videos}>(`/api/users/${courseCode}/learn`).subscribe(user => {
      callback(user);
    }, (err) => {
      if (err.status == 401) {
        this.router.navigate([`/dashboard`]);
      }
    });
  }
}
