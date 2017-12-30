import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from '../courses/course.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  user = null;
  getInitials: Function = function(firstname: String, lastname: String) {
    return (firstname.substring(0,1) + lastname.substring(0,1)).toUpperCase();
  }

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.http.get('/api/users').subscribe((data) => {
      this.user = data;
    }, (err) => {
      console.log(err);
    });
  }

  getUrl(type: string): any {
    if(type === 'style') {
      return this.sanitizer.sanitize(SecurityContext.STYLE,this._getUrl());
    }
    return this._getUrl();
  }

  private _getUrl():String {
    return `url('/assets/images/${this.user.image}')`;
  }
}
