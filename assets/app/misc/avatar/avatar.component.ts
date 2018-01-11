import { Component, OnInit, SecurityContext, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})

export class AvatarComponent implements OnInit {
  @Input() user = null;
  @Input() course = null;
  @Input() part = null;
  @Input() author = null;
  getInitials: Function = function(firstname: String, lastname: String) {
    return (firstname.substring(0,1) + lastname.substring(0,1)).toUpperCase();
  }

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() { }

  getUrl(type: string, image): any {
    if(type === 'style') {
      return this.sanitizer.sanitize(SecurityContext.STYLE,this._getUrl(image));
    }
    return this._getUrl(image);
  }

  private _getUrl(image):String {
    return `url('/assets/images/${image}')`;
  }
}
