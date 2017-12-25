import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from '../../courses/course.model'

@Component({
  selector: 'cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})

export class CartDetailComponent implements OnInit {
  courses: Course[] = [];
  findTotal: Function = function(courses) {
    var count = 0;
    for (var i = 0; i < courses.length; i++) {
      count += courses[i].price;
    }
    return count;
  };

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const courseCode = this.route.snapshot.params['courseCode'];
    this.http.get<Course[]>(`/api/cart`).subscribe(data => {
      this.courses = data;
    });
  }
}
