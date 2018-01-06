import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from './../../admin.service';

@Component({
  selector: 'admin-course-detail',
  templateUrl: './admin-course-detail.component.html',
  styleUrls: ['./admin-course-detail.component.css'],
  providers: [AdminService]
})

export class AdminCourseDetailComponent implements OnInit {
  course = null;
  showParts = null;
  constructor(private route: ActivatedRoute, private adminService: AdminService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.params['id'];
      this.adminService.getCourse(id, (course) => {
        this.course = course;
        this.showParts = {show: true, parts: []};
      });
    });
  }
}
