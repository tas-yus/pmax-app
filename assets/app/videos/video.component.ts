import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
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
  @ViewChild('videoPlayer') videoPlayer;
  @ViewChild('btnPlay') btnPlay;
  @ViewChild('btnMute') btnMute;
  @ViewChild('progressBar') progressBar;
  @ViewChild('volumeBar') volumeBar;

  video: Video = null;
  course: Course = null;
  user = null;
  defaultVolume: number = 1;
  overview: boolean = false;
  qa: boolean = false;
  drag: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.registerFullsceenEvent();
    const courseCode = this.route.snapshot.params['courseCode'];
    // this.loadScript();
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
    const partCode = this.route.snapshot.params['partCode'];
    this.route.params.subscribe(params => {
    var videoCode = this.route.snapshot.params['videoCode'];
    this.http.get<Video>(`/api/courses/${courseCode}/parts/${partCode}/videos/${videoCode}`)
      .subscribe((video) => {
      this.video = video;
      if(this.videoPlayer) {
        this.resetVideo();
      }
    }, (err) => {
      this.router.navigate(["/dashboard"]);
      });
    });
  }

  togglePlay() {
    if (this.videoPlayer.nativeElement.paused) {
      this.videoPlayer.nativeElement.play();
      this.btnPlay.nativeElement.classList.remove('fa-play');
      this.btnPlay.nativeElement.classList.add('fa-pause');
    } else {
      this.videoPlayer.nativeElement.pause();
      this.btnPlay.nativeElement.classList.add('fa-play');
      this.btnPlay.nativeElement.classList.remove('fa-pause');
    }
  }

  pause(e) {
    this.videoPlayer.nativeElement.pause();
    this.btnPlay.nativeElement.classList.add('fa-play');
    this.btnPlay.nativeElement.classList.remove('fa-pause');
  }

  // updateProgress(event) {
  //   this.seek(event);
  //   this.togglePlay();
  // }

  updateVideo() {
    this.updateProgressBar();
    this.updateVideoTime();
  }

  toggleMute() {
    if (!this.videoPlayer.nativeElement.muted) {
      this.videoPlayer.nativeElement.muted = true;
      this.defaultVolume = this.volumeBar.nativeElement.value;
      this.volumeBar.nativeElement.value = 0;
      this.btnMute.nativeElement.classList.remove('fa-volume-up');
      this.btnMute.nativeElement.classList.add('fa-volume-off');
    } else {
      this.videoPlayer.nativeElement.muted = false;
      this.volumeBar.nativeElement.value = this.defaultVolume;
      this.btnMute.nativeElement.classList.add('fa-volume-up');
      this.btnMute.nativeElement.classList.remove('fa-volume-off');
    }
  }

  updateVolume(event) {
    var volume = event.offsetX / this.volumeBar.nativeElement.clientWidth;
    this.volumeBar.nativeElement.value =  volume;
    this.defaultVolume = volume;
    this.videoPlayer.nativeElement.volume = volume;
  }

  moveForward() {
    var time = this.videoPlayer.nativeElement.currentTime + 15;
    if (time > this.videoPlayer.nativeElement.duration) {
      time = this.videoPlayer.nativeElement.duration;
    }
    this.videoPlayer.nativeElement.currentTime = time;
  }

  moveBackward() {
    var time = this.videoPlayer.nativeElement.currentTime - 15;
    if (time < 0) {
      time = 0
    }
    this.videoPlayer.nativeElement.currentTime = time;
  }

  setDuration() {
    var duration = <HTMLElement>document.querySelector(".duration");
    duration.innerText = this.toClockTime(Math.round(this.videoPlayer.nativeElement.duration));
    this.togglePlay();
    $('.video-content').on("keypress", (e) => {
      this.playpause(e);
    });

    $("#progress-bar").mousedown(()=> {
      if (!this.videoPlayer.nativeElement.paused) {
        this.togglePlay();
      }
      $("#progress-bar").mousemove((e)=> {
        this.seek(e);
      });
    }).mouseup((e)=> {
        $("#progress-bar").unbind('mousemove');
        this.seek(e);
        this.togglePlay();
    });
  }

  // addResizeEvent() {
  //   $(window).resize(()=>{
  //     $('.scrubber').css("transform", `translateX(${Math.floor(this.progressBar.nativeElement.value/100*this.progressBar.nativeElement.clientWidth)}px)`);
  //   }).resize();
  // }

  toggleOverview() {
    if (!this.overview) {
      this.overview = true;
      if (this.qa) {
        this.qa = false;
        document.querySelector(".questions-and-answers").classList.remove("opened");
        document.querySelector(".inner-right").classList.remove("wrapper-right-opened");
        document.querySelector(".video-content").classList.remove("content-small");
      }
      document.querySelector(".course-overview").classList.add("opened");
      document.querySelector(".inner-left").classList.add("wrapper-left-opened");
      document.querySelector(".video-content").classList.add("content-small");
    } else {
      this.overview = false;
      document.querySelector(".course-overview").classList.remove("opened");
      document.querySelector(".inner-left").classList.remove("wrapper-left-opened");
      document.querySelector(".video-content").classList.remove("content-small");
    }
  }

  toggleQuestion() {
    if (!this.qa) {
      this.qa = true;
      if (this.overview) {
        this.overview = false;
        document.querySelector(".course-overview").classList.remove("opened");
        document.querySelector(".inner-left").classList.remove("wrapper-left-opened");
        document.querySelector(".video-content").classList.remove("content-small");
      }
      document.querySelector(".questions-and-answers").classList.add("opened");
      document.querySelector(".inner-right").classList.add("wrapper-right-opened");
      document.querySelector(".video-content").classList.add("content-small");
    } else {
      this.qa = false;
      document.querySelector(".questions-and-answers").classList.remove("opened");
      document.querySelector(".inner-right").classList.remove("wrapper-right-opened");
      document.querySelector(".video-content").classList.remove("content-small");
    }
  }

  toggleFullscreen() {
    if( window.innerHeight == screen.height) {
      this.enterFullscreen();
    } else {
      if ($(".course-overview").hasClass("opened") || $(".questions-and-answers").hasClass("opened")) {
        if ($(".course-overview").hasClass("opened")) {
          this.toggleOverview();
        }
        if ($(".questions-and-answers").hasClass("opened")) {
          this.toggleQuestion();
        }
        setTimeout(() => {
          this.exitFullscreen();
        }, 400);
      } else {
        this.exitFullscreen();
      }
    }
    return false;
  }

  enterFullscreen() {
    this.videoPlayer.nativeElement.webkitExitFullscreen();
    // this.videoPlayer.nativeElement.mozExitFullscreen();
  }

  exitFullscreen() {
    if (this.videoPlayer.nativeElement.requestFullscreen) {
      this.videoPlayer.nativeElement.requestFullscreen();
    } else if (this.videoPlayer.nativeElement.msRequestFullscreen) {
      this.videoPlayer.nativeElement.msRequestFullscreen();
    } else if (this.videoPlayer.nativeElement.mozRequestFullScreen) {
      this.videoPlayer.nativeElement.mozRequestFullScreen();
    } else if (this.videoPlayer.nativeElement.webkitRequestFullscreen) {
      this.videoPlayer.nativeElement.webkitRequestFullscreen();
    }
  }

  // HELPER FUNCTIONS
  seek(event) {
    var percent = event.offsetX / this.progressBar.nativeElement.clientWidth;
    this.progressBar.nativeElement.value = percent*100;
    this.videoPlayer.nativeElement.currentTime = percent * this.videoPlayer.nativeElement.duration;
    // $('.scrubber').css("transform", `translateX(${Math.floor(this.progressBar.nativeElement.clientWidth*percent)}px)`);
  }

  updateProgressBar() {
    var percentage = (100 / this.videoPlayer.nativeElement.duration)
    * this.videoPlayer.nativeElement.currentTime;
    if (percentage) {
      this.progressBar.nativeElement.value = percentage;
    }
    this.videoPlayer.nativeElement.innerHTML = `${percentage}% played`;
  }

  updateVideoTime() {
    var current = <HTMLElement>document.querySelector(".current");
    current.innerText = this.toClockTime(Math.round(this.videoPlayer.nativeElement.currentTime));
  }

  toClockTime(timeInSec) {
    var min = Math.floor(timeInSec/60);
    var sec:any = Math.floor(timeInSec % 60);
    if (sec < 10) {
      sec = "0" + sec;
    }
    var time = "";
    time = time + min + ":" + sec;
    return time;
  }

  registerFullsceenEvent() {
    document.addEventListener('webkitfullscreenchange', this.exitHandler, false);
    document.addEventListener('mozfullscreenchange', this.exitHandler, false);
    document.addEventListener('fullscreenchange', this.exitHandler, false);
    document.addEventListener('MSFullscreenChange', this.exitHandler, false);
  }

  exitHandler() {
    if(!document.webkitIsFullScreen) {
      $('#overview-btn').removeClass("hidden");
      $('#QA-btn').removeClass("hidden");
    } else {
      $('#overview-btn').addClass("hidden");
      $('#QA-btn').addClass("hidden");
    }
  }

  resetVideo() {
    this.togglePlay();
    this.videoPlayer.nativeElement.src = "";
    this.videoPlayer.nativeElement.load();
    this.videoPlayer.nativeElement.src = `/assets/videos/${this.video.path}`;
    this.videoPlayer.nativeElement.load();
    this.progressBar.nativeElement.value = 0;
  }

  playpause(e) {
    if (e.target.id === "videoPlayer" || e.keyCode == 32 || e.keyCode == 13) {
      this.togglePlay();
    }
  }
}
