import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from '../../courses/course.model';

@Component({
  selector: 'your-course',
  templateUrl: './your-course.component.html',
  styleUrls: ['./your-course.component.css']
})

export class YourCourseComponent implements OnInit {
  courses: Course[] = [];
  showCourse: Boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Course[]>(`/api/users/courses`).subscribe((data) => {
      this.courses = data;
    }, (err) => {
      console.log(err);
    })
  }
}
