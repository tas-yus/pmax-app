import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from './../../course.model';

@Component({
  selector: 'course-aside',
  templateUrl: './course-aside.component.html',
  styleUrls: ['./course-aside.component.css']
})

export class CourseAsideComponent implements OnInit {
  @Input() course: Course = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {

  }
}
