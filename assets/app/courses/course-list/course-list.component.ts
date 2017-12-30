import { Component, OnInit } from '@angular/core';
import { Course } from './../course.model';
import { HttpClient } from '@angular/common/http';
import { CourseService } from './../course.service';

declare var $:any;

@Component({
  selector: 'course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
  providers: [CourseService]
})

export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  default_skip: number = 6;
  current_skip: number = 0;
  stop: Boolean = false;

  constructor(private http: HttpClient, private courseService: CourseService) {
  }

  ngOnInit() {
    this.courseService.getCourses(this.default_skip, 0, (courses) => {
      this.courses = courses;
    });
  }

  ngAfterContentInit() {
    $(window).scroll(() => {
      var scrollTop = $(document).scrollTop();
      var windowHeight = $(window).height();
      var bodyHeight = $(document).height() - windowHeight;
      var scrollPercentage = (scrollTop / bodyHeight);
      if(!this.stop && scrollPercentage > 0.9) {
        this.current_skip = this.current_skip + this.default_skip;
        this.stop = true;
        this.courseService.getCourses(this.default_skip, this.current_skip, (courses) => {
          if (courses.length !== 0) {
            courses.forEach((course) => {
              this.courses.push(course);
            });
            this.stop = false;
          }
        });
      }
    });
  }
}
