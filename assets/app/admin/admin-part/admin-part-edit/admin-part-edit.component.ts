import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from './../../admin.service';

@Component({
  selector: 'admin-part-edit',
  templateUrl: './admin-part-edit.component.html',
  styleUrls: ['./admin-part-edit.component.css'],
  providers: [AdminService]
})

export class AdminPartEditComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload;
  part = null;
  images = [];
  selectedImage = null;
  file: File = null;
  selectImages = [];
  errMessage = null;
  constructor(private route: ActivatedRoute, private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.params['id'];
      this.adminService.getPart(id, (part) => {
        this.part = part;
      });
      this.adminService.getImages((images) => {
        this.images = images;
      });
    });
  }

  selectImage(image) {
    this.selectedImage = image;
    this.fileUpload.nativeElement.value = "";
  }

  toggleSelect(i) {
    var current = this.selectImages[i];
    this.selectImages = [];
    this.selectImages[i] = !current;
  }

  onChange(event, file) {
    this.errMessage = null;
    this.file = event.srcElement.files[0];
    this.selectImages = [];
    if (!this.isValid(this.file)) {
      this.fileUpload.nativeElement.value = "";
      this.errMessage = "Not Valid";
    }
  }

  isValid(file) {
    return true;
  }

  onEditPart(form: NgForm) {
    const id = this.route.snapshot.params['id'];
    const body: any = {
      title: form.value.title,
      description: form.value.description
    };
    if (this.file) {
      this.adminService.uploadImage(this.file, (response) => {
        body.image = response.filename;
        this.adminService.updatePart(id, body, () => {
          this.router.navigate([`/admin/parts/${id}`]);
        });
      });
    } else {
      body.image = this.selectedImage? this.selectedImage: this.part.image;
      this.adminService.updatePart(id, body, () => {
        this.router.navigate([`/admin/parts/${id}`]);
      });
    }
  }

}
