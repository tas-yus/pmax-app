import { Component, OnInit, ViewChild, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from './../courses/course.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})

export class LearnComponent implements OnInit {
  user = null;
  course = null;
  count: number = 0;
  @ViewChild('numFinishedVideos') numFinishedVideos;
  @ViewChild('progress') progress;

  constructor(private route: ActivatedRoute, private http: HttpClient,
    public sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
    const courseCode = this.route.snapshot.params['courseCode'];
    this.http.get<Course>(`/api/courses/${courseCode}/learn`).subscribe(data => {
      this.course = data;
      this.http.get<{course, videos}>(`/api/users/${courseCode}/learn`).subscribe(data => {
        this.user = data;
      }, (err) => {
        if (err.status === 401) {
          this.router.navigate([`/dashboard`]);
        }
      });
    }, (err) => {
      if (err.status === 401) {
        this.router.navigate([`/dashboard`]);
      }
    });
  }

  getProgress(type: string): any {
    if(type === 'style') {
      return this.sanitizer.sanitize(SecurityContext.STYLE,this._getProgress()+'%');
    }
    return this._getProgress();
  }

  private _getProgress():number {
    if(this.course && this.user) {
      return this.user.courseBundle.numFinishedVideos*100/this.course.numVideos;
    }
    return 0;
  }

  updateView() {
    const courseCode = this.route.snapshot.params['courseCode'];
    this.http.get<{course, videos}>(`/api/users/${courseCode}/learn`).subscribe(data => {
      this.user = data;
    }, (err) => {
      if (err.status === 401) {
        this.router.navigate([`/dashboard`]);
      }
    });
  }
}
