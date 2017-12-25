import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from './../course.model';

@Component({
  selector: 'course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})

export class CourseDetailComponent implements OnInit {
  course: {course: Course, owned: {type: String}} = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const courseCode = this.route.snapshot.params['courseCode'];
    this.http.get<{course: Course, owned: {type: String}}>(`/api/courses/${courseCode}`).subscribe(data => {
      this.course = data;
    }, (err) => {
      if (err.status === 401) {
        this.router.navigate([`/courses/${courseCode}/learn`]);
      }
    });
  }
}
