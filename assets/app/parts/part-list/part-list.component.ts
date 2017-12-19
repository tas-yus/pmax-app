import { Component, OnInit, Input } from '@angular/core';
import { Part } from './../part.model';
import { HttpClient } from '@angular/common/http';

declare var $:any;

@Component({
  selector: 'part-list',
  templateUrl: './part-list.component.html',
  styleUrls: ['./part-list.component.css']
})

export class PartListComponent implements OnInit {
  @Input() parts: Part[] = [];

  constructor() {}
  ngOnInit() {}
}
