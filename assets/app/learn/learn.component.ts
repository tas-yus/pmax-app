import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from './../courses/course.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})

export class LearnComponent implements OnInit {
  course: Course = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, public sanitizer: DomSanitizer) {}

  ngOnInit() {
    const courseCode = this.route.snapshot.params['courseCode'];
    this.http.get<Course>(`/api/courses/${courseCode}`).subscribe(data => {
      this.course = data;
    });
  }
}
