import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from './../../admin.service';

@Component({
  selector: 'admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
  styleUrls: ['./admin-user-detail.component.css'],
  providers: [AdminService]
})

export class AdminUserDetailComponent implements OnInit {
  user = null;
  showCourses = true;
  constructor(private route: ActivatedRoute, private adminService: AdminService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.params['id'];
      this.adminService.getUser(id, (user) => {
        this.user = user;
      });
    });
  }
}
