import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from './../../courses/course.model';

@Component({
  selector: 'learn-overview',
  templateUrl: './learn-overview.component.html',
  styleUrls: ['./learn-overview.component.css']
})

export class LearnOverviewComponent implements OnInit {
  @Input() course: Course = null;

  constructor(http: HttpClient) {}

  ngOnInit() {

  }

  onUpdateVidStatus() {
    
  }
}
