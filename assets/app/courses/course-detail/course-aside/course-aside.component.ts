import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from './../../course.model';
import { AuthService } from './../../../auth/auth.service';

@Component({
  selector: 'course-aside',
  templateUrl: './course-aside.component.html',
  styleUrls: ['./course-aside.component.css'],
  providers: [AuthService]
})

export class CourseAsideComponent implements OnInit {
  @Input() course: Course = null;
  @Input() alreadyAdded: Boolean = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit() { }

  onAddToCart(id, code, redirect) {
    this.http.post(`/api/cart`, {courseId: id}).subscribe(data => {
      if (redirect) {
        this.router.navigate([`/cart/checkout/${code}`]);
      } else {
        this.alreadyAdded = true;
      }
    }, (err) => {
      if (err.status === 401) {
        this.router.navigate([`/login`]);
      }
    });
  }
}
