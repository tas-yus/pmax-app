import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AdminService {

  constructor(private http: HttpClient, private router:Router) {}

  // XXX COURSES XXX

  getCourses(query, callback) {
    this.http.get<any[]>('/api/admin/courses' + query).subscribe((courses) => {
      callback(courses);
    }, (err) => {
      console.log(err);
    });
  }

  createShowPartsArray(numCourse, callback) {
    const showParts = [];
    for (var i = 0; i < numCourse; i++) {
      const parts = [];
      const courseObject = {show: false, parts};
      showParts.push(courseObject);
    }
    callback(showParts);
  }

  getCourse(id, callback) {
    this.http.get<any>(`/api/admin/courses/${id}`).subscribe((course) => {
      callback(course);
    }, (err) => {
      console.log(err);
    });
  }

  updateCourse(id, body, callback) {
    this.http.put(`/api/admin/courses/${id}`, body).subscribe(() => {
      callback();
    }, (err) => {
      console.log(err);
    });
  }

  // XXX PARTS XXX

  getParts(callback) {
    this.http.get<any[]>('/api/admin/parts').subscribe((parts) => {
      callback(parts)
    }, (err) => {
      console.log(err);
    });
  }

  getPart(id, callback) {
    this.http.get<any>(`/api/admin/parts/${id}`).subscribe((part) => {
      callback(part)
    }, (err) => {
      console.log(err);
    });
  }

  updatePart(id, body, callback) {
    this.http.put(`/api/admin/parts/${id}`, body).subscribe(() => {
      callback();
    }, (err) => {
      console.log(err);
    });
  }

  // XXX VIDEOS XXX

  getVideos(callback) {
    this.http.get<any[]>('/api/admin/videos').subscribe((videos) => {
      callback(videos);
    }, (err) => {
      console.log(err);
    });
  }

  getVideo(id, callback) {
    this.http.get<any>(`/api/admin/videos/${id}`).subscribe((video) => {
      callback(video);
    }, (err) => {
      console.log(err);
    });
  }

  updateVideo(id, body, callback) {
    this.http.put(`/api/admin/videos/${id}`, body).subscribe(() => {
      callback();
    }, (err) => {
      console.log(err);
    });
  }

  listVideos(callback) {
    this.http.get<any[]>('/api/admin/videos/list').subscribe((videos) => {
      callback(videos);
    }, (err) => {
      console.log(err);
    })
  }

  // XXX USERS XXX

  getUsers(callback) {
    this.http.get<any[]>('/api/admin/users').subscribe((users) => {
      callback(users);
    }, (err) => {
      console.log(err);
    });
  }

  getUser(id, callback) {
    this.http.get<any>(`/api/admin/users/${id}`).subscribe((user) => {
      callback(user);
    }, (err) => {
      console.log(err);
    });
  }

  // XXX IMAGES XXX

  getImages(callback) {
    this.http.get<any[]>('/api/images').subscribe((images) => {
      callback(images)
    }, (err) => {
      console.log(err);
    });
  }

  uploadImage(file: File, callback) {
    const formData: any = new FormData();
    formData.append("file", file);
    this.http.post<any>('/api/images/upload', formData).subscribe((data) =>{
      callback(data);
    }, (err) => {
      console.log(err);
    });
  }

}
