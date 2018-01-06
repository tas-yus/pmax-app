import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from './../../admin.service';

@Component({
  selector: 'admin-part-detail',
  templateUrl: './admin-part-detail.component.html',
  styleUrls: ['./admin-part-detail.component.css'],
  providers: [AdminService]
})

export class AdminPartDetailComponent implements OnInit {
  part = null;
  showParts = true;
  constructor(private route: ActivatedRoute,private adminService: AdminService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.params['id'];
      this.adminService.getPart(id, (part) => {
        this.part = part;
      })
    });
  }
}
