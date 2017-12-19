import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Part } from './../../parts/part.model';

@Component({
  selector: 'course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.css']
})

export class CourseOverviewComponent implements OnInit {
  @Input() parts: Part[] = [];

  constructor() {}

  ngOnInit() {

  }
}
