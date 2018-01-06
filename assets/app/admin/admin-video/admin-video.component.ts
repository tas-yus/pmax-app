import { Component, OnInit } from '@angular/core';
import { AdminService } from './../admin.service';

@Component({
  selector: 'admin-video',
  templateUrl: './admin-video.component.html',
  styleUrls: ['./admin-video.component.css'],
  providers: [AdminService]
})

export class AdminVideoComponent implements OnInit {
  videos = []
  showVideos = [];
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getVideos((videos) => {
      this.videos = videos;
    });
  }
}
