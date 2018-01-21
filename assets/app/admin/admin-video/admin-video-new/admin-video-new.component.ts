import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from './../../admin.service';

@Component({
  selector: 'admin-video-new',
  templateUrl: './admin-video-new.component.html',
  styleUrls: ['./admin-video-new.component.css'],
  providers: [AdminService]
})

export class AdminVideoNewComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload;
  courseTitle = null;
  partTitle = null;
  video = null;
  videos = [];
  selectedVideo = null;
  file: File = null;
  selectVideos = [];
  showVideos = [];
  errMessage = null;
  constructor(private route: ActivatedRoute, private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.params['id'];
      const partId = this.route.snapshot.params['partId'];
      this.adminService.getCourse(id, (course) => {
        this.courseTitle = course.title;
      });
      this.adminService.getPart(partId, (part) => {
        this.partTitle = part.title;
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

  isValid(file) {
    return true;
  }

  onAddVideo(form: NgForm) {
    const id = this.route.snapshot.params['id'];
    const partId = this.route.snapshot.params['partId'];
    const body: any = {
      title: form.value.title,
      course: id,
      part: partId,
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
