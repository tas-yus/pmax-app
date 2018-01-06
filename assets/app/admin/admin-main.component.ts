import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';

declare var $:any;

@Component({
  selector: 'admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css'],
})

export class AdminMainComponent implements OnInit {
  user = null;
  results = null;
  @ViewChild('search') search;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private router: Router) {
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        this.results = {};
      }
    });
  }

  ngOnInit() {
    this.http.get('/api/users').subscribe((data) => {
      this.user = data;
    }, (err) => {
      console.log(err);
    });
  }

  getUrl(type: string): any {
    if(type === 'style') {
      return this.sanitizer.sanitize(SecurityContext.STYLE,this._getUrl());
    }
    return this._getUrl();
  }

  private _getUrl():String {
    return `url('/assets/images/${this.user.image}')`;
  }

  searchFor(value) {
    var query = value === ''? '' : `?name=${value}`;
    if (value) {
      this.http.get<any[]>('/api/admin/search' + query).subscribe((data) => {
        this.results = data;
      }, (err) => {

      });
    } else {
      this.results = {};
    }
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  isActive() {
    return this.search.nativeElement === document.activeElement;
  }
}
