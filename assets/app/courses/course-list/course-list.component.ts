import { Component, OnInit } from '@angular/core';
import { Course } from './../course.model';
import { HttpClient } from '@angular/common/http';

declare var $:any;

@Component({
  selector: 'course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})

export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  default_skip: number = 6;
  current_skip: number = 0;
  stop: Boolean = false;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get<Course[]>(`/api/courses?limit=${this.default_skip}`).subscribe(data => {
      for(let course of data){
        this.courses.push(new Course(course.title, course.description, course.image, course.price, course.code));
      }
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
          var url = `/api/courses?skip=${this.current_skip}&limit=${this.default_skip}`;
          this.http.get<Course[]>(url).subscribe(data => {
            if (data.length !== 0) {
              for(let course of data){
                this.courses.push(new Course(course.title, course.description, course.image, course.price, course.code));
              }
              this.stop = false;
            }
          });
        }
      });
  }
}
