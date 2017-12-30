import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from './../course.model';
import { CourseService } from './../course.service';

@Component({
  selector: 'course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
  providers: [CourseService]
})

export class CourseDetailComponent implements OnInit {
  course: {course: Course, owned: {type: String}} = null;

  constructor(private route: ActivatedRoute, private courseService: CourseService, private router: Router) {}

  ngOnInit() {
    const courseCode = this.route.snapshot.params['courseCode'];
    this.courseService.getCourse(courseCode, (course) => {
      this.course = course;
    });
  }
}
