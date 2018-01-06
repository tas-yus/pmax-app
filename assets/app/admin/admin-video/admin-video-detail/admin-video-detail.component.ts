import { Component, OnInit } from '@angular/core';
import { Course } from './../../../courses/course.model';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from './../../admin.service';

@Component({
  selector: 'admin-video-detail',
  templateUrl: './admin-video-detail.component.html',
  styleUrls: ['./admin-video-detail.component.css'],
  providers: [AdminService]
})

export class AdminVideoDetailComponent implements OnInit {
  video = null;
  showParts = true;
  constructor(private route: ActivatedRoute, private adminService: AdminService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.params['id'];
      this.adminService.getVideo(id, (video) => {
        this.video = video;
      })
    });
  }
}
