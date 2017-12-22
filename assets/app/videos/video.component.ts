import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Video } from './video.model';
import { Course } from '../courses/course.model';

declare var $:any;

@Component({
  selector: 'learn-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})

export class VideoComponent implements OnInit {
  video: Video = null;
  course: Course = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const courseCode = this.route.snapshot.params['courseCode'];
    this.loadScript();
    this.http.get<Course>(`/api/courses/${courseCode}`).subscribe(data => {
      this.course = data;
    });
    const partCode = this.route.snapshot.params['partCode'];
    this.route.params.subscribe(params => {
    var videoCode = this.route.snapshot.params['videoCode'];
    this.http.get<Video>(`/api/courses/${courseCode}/parts/${partCode}/videos/${videoCode}`)
      .subscribe((video) => {
      this.video = video;
      if($("#videoPlayer")[0]) {
        $("#videoPlayer")[0].load();
        $("#videoPlayer")[0].currentTime = 0;
        $('#progress-bar').val(0);
        $("#videoPlayer")[0].play();
        $(".fa-play").attr("class", "fa fa-pause");
      }
    }, (err) => {
      console.log(err);
      });
    });
  }

  // ngDestroy() {
  //   this.unloadScript();
  // }

  public loadScript() {
    var isFound = false;

    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("video-player")) {
          isFound = true;
      }
    }

    if (!isFound) {
      var scriptTag = "/assets/js/video-player.js";
      let node = document.createElement('script');
      node.src = scriptTag;
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
    }

  }

  // public unloadScript() {
  //   var scripts = document.getElementsByTagName("script")
  //   for (var i = 0; i < scripts.length; ++i) {
  //     if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("video-player")) {
  //         scripts[i].src = "";
  //     }
  //   }
  // }
}
