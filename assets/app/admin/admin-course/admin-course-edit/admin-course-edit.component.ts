import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from './../../admin.service';

@Component({
  selector: 'admin-course-edit',
  templateUrl: './admin-course-edit.component.html',
  styleUrls: ['./admin-course-edit.component.css'],
  providers: [AdminService]
})

export class AdminCourseEditComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload;
  course = null;
  images = [];
  selectedImage = null;
  file: File = null;
  selectImages = [];
  errMessage = null;
  constructor(private route: ActivatedRoute, private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.params['id'];
      this.adminService.getCourse(id, (course) => {
        this.course = course;
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

  onEditCourse(form: NgForm) {
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
        this.adminService.updateCourse(id, body, () => {
          this.router.navigate([`/admin/courses/${id}`]);
        });
      });
    } else {
      body.image = this.selectedImage? this.selectedImage: this.course.image;
      this.adminService.updateCourse(id, body, () => {
        this.router.navigate([`/admin/courses/${id}`]);
      });
    }
  }

}
