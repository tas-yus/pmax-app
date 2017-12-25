import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Order } from '../order.model';

@Component({
  selector: 'purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})

export class PurchaseHistoryComponent implements OnInit {
  orders: Order[] = [];
  showCourse: Boolean = true;
  getDate: Function = function(date: string) {
    return new Date(date).toDateString();
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Order[]>(`/api/users/orders`).subscribe((data) => {
      this.orders = data;
    }, (err) => {
      console.log(err);
    })
  }
}
