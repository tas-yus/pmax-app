import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'credit-info',
  templateUrl: './credit-card-info.component.html',
  styleUrls: ['./credit-card-info.component.css']
})

export class CreditCardInfoComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.http.get<Order[]>(`/api/users/orders`).subscribe((data) => {
    //   this.orders = data;
    // }, (err) => {
    //   console.log(err);
    // })
  }
}
