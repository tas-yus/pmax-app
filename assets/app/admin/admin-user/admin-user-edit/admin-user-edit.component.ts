import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from './../../admin.service';

@Component({
  selector: 'admin-user-edit',
  templateUrl: './admin-user-edit.component.html',
  styleUrls: ['./admin-user-edit.component.css'],
  providers: [AdminService]
})

export class AdminUserEditComponent implements OnInit {
  user = null;
  errMessage = null;
  constructor(private route: ActivatedRoute, private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.params['id'];
      this.adminService.getUser(id, (user) => {
        this.user = user;
      });
    });
  }

  onEditUser(form: NgForm) {
    const id = this.route.snapshot.params['id'];
  }

}
