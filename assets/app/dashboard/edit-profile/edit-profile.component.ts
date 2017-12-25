import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})

export class EditProfileComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.http.get<Order[]>(`/api/users/orders`).subscribe((data) => {
    //   this.orders = data;
    // }, (err) => {
    //   console.log(err);
    // })
  }
}
