import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Course } from '../../courses/course.model'

@Component({
  selector: 'cart-checkout',
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.css']
})

export class CartCheckoutComponent implements OnInit {
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
    if (!courseCode) {
      this.http.get<Course[]>(`/api/cart`).subscribe(data => {
        if (data.length !== 0 && data[0]) {
          this.courses = data;
        } else {
          this.router.navigate([`/cart`]);
        }
      });
    } else {
      this.http.get<Course[]>(`/api/cart/${courseCode}`).subscribe(data => {
        if (data.length !== 0 && data[0]) {
          this.courses = data;
        } else {
          this.router.navigate([`/dashboard`]);
        }
      }, (err) => {
        this.router.navigate([`/dashboard`]);
      });
    }
  }

  onCheckout() {
    this.http.post(`/api/checkout`, null).subscribe(data => {
      this.router.navigate([`/dashboard`]);
    }, (err) => {
      this.router.navigate([`/dashboard`]);
    });
  }
}
