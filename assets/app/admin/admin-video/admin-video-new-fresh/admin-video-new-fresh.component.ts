import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from './../../admin.service';

declare var $:any;

@Component({
  selector: 'admin-video-new-fresh',
  templateUrl: './admin-video-new-fresh.component.html',
  styleUrls: ['./admin-video-new-fresh.component.css'],
  providers: [AdminService]
})

export class AdminVideoNewFreshComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload;
  @ViewChild('courseSelect') courseSelect;
  @ViewChild('partSelect') partSelect;
  video = null;
  videos = [];
  courses = [];
  parts = [];
  selectedVideo = null;
  file: File = null;
  selectVideos = [];
  showVideos = [];
  errMessage = null;
  showParts = false;
  constructor(private route: ActivatedRoute, private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.adminService.getCourses("", (courses) => {
        this.courses = courses;
      });
      this.adminService.listVideos((videos) => {
        this.videos = videos;
      });
    });
  }

  selectVideo(event, video) {
    if (event.target.tagName === 'DIV') {
      this.selectedVideo = video;
      this.fileUpload.nativeElement.value = "";
    }
  }

  toggleSelect(event, i) {
    if (event.target.tagName === 'DIV') {
      this.file = null;
      var current = this.selectVideos[i];
      this.selectVideos = [];
      if (current) {
        this.selectedVideo = null;
      }
      this.selectVideos[i] = !current;
    }
  }

  toggleShow(event, i) {
    if (event.target.tagName !== 'DIV') {
      var current = this.showVideos[i];
      this.showVideos = [];
      this.showVideos[i] = !current;
    }
  }

  onChange(event, file) {
    this.errMessage = null;
    this.file = event.srcElement.files[0];
    this.selectVideos = [];
    this.selectedVideo = null;
    if (!this.isValid(this.file)) {
      this.fileUpload.nativeElement.value = "";
      this.errMessage = "Not Valid";
    }
  }

  onSelectCourse(value) {
    if (value !== '') {
      this.adminService.getPartsInCourse(value, (parts) => {
        this.parts = parts;
        this.showParts = true;
      });
    } else {
      this.showParts = false;
    }
  }

  isValid(file) {
    return true;
  }

  onAddVideo(form: NgForm) {
    const body: any = {
      title: form.value.title,
      course: this.courseSelect.value,
      part: this.partSelect.value,
    };
    if (this.file) {
      this.adminService.uploadVideo(this.file, (response) => {
        body.path = response.filename;
        this.adminService.addVideo(body, (videoId) => {
          this.router.navigate([`/admin/videos/${videoId}`]);
        });
      });
    } else {
      body.path = this.selectedVideo? this.selectedVideo: this.video.path;
      this.adminService.addVideo(body, (videoId) => {
        this.router.navigate([`/admin/videos/${videoId}`]);
      });
    }
  }

}
