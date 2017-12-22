import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  displayHeader: Boolean = true;

  constructor(private http: HttpClient) {}
  
  getNotification(evt) {
    console.log("hey");
  }
  ngOnInit() {
    this.http.get("/api/session").subscribe(data => {
      if(!sessionStorage.getItem("currentUser")) {
        sessionStorage.setItem("currentUser", JSON.stringify(data));
      }
    }, err => {

    });
  }
}
