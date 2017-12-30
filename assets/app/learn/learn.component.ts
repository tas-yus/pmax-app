import { Component, OnInit, ViewChild, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from './../courses/course.model';
import { DomSanitizer } from '@angular/platform-browser';
import { CourseService } from './../courses/course.service';

@Component({
  selector: 'learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css'],
  providers: [CourseService]
})

export class LearnComponent implements OnInit {
  user = null;
  course = null;
  count: number = 0;
  @ViewChild('numFinishedVideos') numFinishedVideos;
  @ViewChild('progress') progress;

  constructor(private route: ActivatedRoute, public sanitizer: DomSanitizer,
    private courseService: CourseService) { }

  ngOnInit() {
    const courseCode = this.route.snapshot.params['courseCode'];
    this.courseService.getLearnCourse(courseCode, (course) => {
      this.course = course;
    });
    this.courseService.getLearnUser(courseCode, (user) => {
      this.user = user;
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
    this.courseService.getLearnUser(courseCode, (user) => {
      this.user = user;
    });
  }

  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.course.video);
  }
}
