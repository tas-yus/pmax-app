import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from './../../admin.service';

@Component({
  selector: 'admin-course-new',
  templateUrl: './admin-course-new.component.html',
  styleUrls: ['./admin-course-new.component.css'],
  providers: [AdminService]
})

export class AdminCourseNewComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload;
  images = [];
  selectedImage = null;
  file: File = null;
  selectImages = [];
  errMessage = null;
  constructor(private route: ActivatedRoute, private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getImages((images) => {
      this.images = images;
    });
  }

  selectImage(image) {
    this.selectedImage = image;
    this.fileUpload.nativeElement.value = "";
  }

  toggleSelect(i) {
    this.file = null;
    var current = this.selectImages[i];
    if (current) {
      this.selectedImage = null;
    }
    this.selectImages = [];
    this.selectImages[i] = !current;
  }

  onChange(event, file) {
    this.errMessage = null;
    this.file = event.srcElement.files[0];
    this.selectedImage = null;
    this.selectImages = [];
    if (!this.isValid(this.file)) {
      this.fileUpload.nativeElement.value = "";
      this.errMessage = "Not Valid";
    }
  }

  isValid(file) {
    return true;
  }

  onAddCourse(form: NgForm) {
    const id = this.route.snapshot.params['id'];
    const body: any = {
      title: form.value.title,
      price: form.value.price,
      video: form.value.video,
      description: form.value.description
    };
    if (this.file) {
      this.adminService.uploadImage(this.file, (response) => {
        body.image = response.filename;
        this.adminService.addCourse(body, (courseId) => {
          this.router.navigate([`/admin/courses/${courseId}`]);
        });
      });
    } else {
      body.image = this.selectedImage;
      this.adminService.addCourse(body, (courseId) => {
        this.router.navigate([`/admin/courses/${courseId}`]);
      });
    }
  }

}
