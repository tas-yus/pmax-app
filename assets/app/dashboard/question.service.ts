import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class QuestionService {

  constructor(private http: HttpClient, private router: Router) {}

  getInstructorQuestions(callback) {
    this.http.get<any[]>(`/api/questions`).subscribe((questions) => {
      callback(questions);
    }, (err) => {
      console.log(err);
    });
  }

  getYourQuestions(callback) {
    this.http.get<any[]>(`/api/users/questions`).subscribe((questions) => {
      callback(questions);
    }, (err) => {
      console.log(err);
    });
  }

  createQuestion(courseCode, videoCode, question, callback) {
    this.http.post(`/api/courses/${courseCode}/videos/${videoCode}/questions`, question)
    .subscribe((question) => {
      callback(question);
    }, (err) => {
      console.log(err);
    })
  }

  createAnswer(questionCode, answer, callback) {
    this.http.post<any>(`/api/questions/${questionCode}/answers`, answer)
    .subscribe((answer) => {
      callback(answer);
    }, (err) => {
      console.log(err);
    })
  }

  deleteQuestion(courseCode, videoCode, questionCode, callback) {
    this.http.delete(`/api/courses/${courseCode}/videos/${videoCode}/questions/${questionCode}`)
    .subscribe(() => {
      callback();
    }, (err) => {
      console.log(err);
    })
  }

  // getLearnCourse(courseCode: String, callback) {
  //   this.http.get<Course>(`/api/courses/${courseCode}/learn`).subscribe(course => {
  //     callback(course);
  //   }, (err) => {
  //     if (err.status == 401) {
  //       this.router.navigate([`/dashboard`]);
  //     }
  //   });
  // }
  //
  // getLearnUser(courseCode: String, callback) {
  //   this.http.get<{course, videos}>(`/api/users/${courseCode}/learn`).subscribe(user => {
  //     callback(user);
  //   }, (err) => {
  //     if (err.status == 401) {
  //       this.router.navigate([`/dashboard`]);
  //     }
  //   });
  // }
}
