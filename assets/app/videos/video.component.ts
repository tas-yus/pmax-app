import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})

export class VideoComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {

  }
}
