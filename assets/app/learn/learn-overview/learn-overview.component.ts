import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from './../../courses/course.model';

declare var $:any;

@Component({
  selector: 'learn-overview',
  templateUrl: './learn-overview.component.html',
  styleUrls: ['./learn-overview.component.css']
})

export class LearnOverviewComponent implements OnInit {
  @Input() course = null;
  @Input() user = null;
  @Input() numFinishedVideos = null;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  getVideoInArrayById: Function = function (arr, id) {
      var result  = arr.filter(function(o){
          if (o.video._id) {
              return o.video._id.toString() === id.toString();
          } else {
              return o.video.toString() === id.toString();
          }
      });
      return result? result[0] : null; // or undefined
  };

  getNumFinishedVideos: Function = function(videoArray, partId) {
    var count = 0;
    for (var i = 0; i < videoArray.length; i++) {
      var vid = videoArray[i];
      if (vid.video.part.toString() === partId.toString() && vid.finished) {
        count++;
      }
    }
    return count;
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {}

  onUpdateVidStatus(event, videoCode: String) {
    event.preventDefault();
    event.stopPropagation();
    this.http.put<{done: Boolean, numFinishedVideos: Number, message: String}>(`/api/users/videos/${videoCode}`, null).subscribe((data) => {
      if (data.done) {
        event.target.classList.remove('fa-circle-o');
        event.target.classList.add('fa-check-circle');
      } else {
        event.target.classList.remove('fa-check-circle');
        event.target.classList.add('fa-circle-o');
      }
      if (this.numFinishedVideos) {
        this.numFinishedVideos.innerText = String(data.numFinishedVideos);
        this.notifyParent.emit();
      }
      $('.progress-bar').css({
        width: `${this._getProgress(data.numFinishedVideos)}%`,
        transition: 'all 0.2s'
      });
    }, (err) => {
      console.log(err);
    });
  }

  private _getProgress(numFinishedVideos):number {
    return numFinishedVideos*100/this.course.numVideos;
  }
}
