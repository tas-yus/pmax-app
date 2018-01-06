import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from './../../admin.service';

@Component({
  selector: 'admin-video-edit',
  templateUrl: './admin-video-edit.component.html',
  styleUrls: ['./admin-video-edit.component.css'],
  providers: [AdminService]
})

export class AdminVideoEditComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload;
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
      this.adminService.getVideo(id, (video) => {
        this.video = video;
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
      var current = this.selectVideos[i];
      this.selectVideos = [];
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
    if (!this.isValid(this.file)) {
      this.fileUpload.nativeElement.value = "";
      this.errMessage = "Not Valid";
    }
  }

  isValid(file) {
    return true;
  }

  onEditVideo(form: NgForm) {
    const id = this.route.snapshot.params['id'];
    const body: any = {
      title: form.value.title,
    };
    if (this.file) {
      this.adminService.uploadImage(this.file, (response) => {
        body.path = response.filename;
        this.adminService.updateVideo(id, body, () => {
          this.router.navigate([`/admin/videos/${id}`]);
        });
      });
    } else {
      body.path = this.selectedVideo? this.selectedVideo: this.video.path;
      this.adminService.updateVideo(id, body, () => {
        this.router.navigate([`/admin/videos/${id}`]);
      });
    }
  }

}
