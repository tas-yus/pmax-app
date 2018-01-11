import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AuthService } from './../../auth/auth.service';

declare var $:any;

@Component({
  selector: 'your-question',
  templateUrl: './your-question.component.html',
  styleUrls: ['./your-question.component.css'],
  providers: [AuthService]
})

export class YourQuestionComponent implements OnInit {
  @ViewChild('filter') filter;
  questions = [];
  showReply = [];
  userFilterArray: any = { };
  questionCode = null;
  preventCategoryChange = false;
  queryNewQuestion = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isInstructor()) {
      this.http.get<any[]>(`/api/admin/questions`).subscribe((data) => {
        this.questions = data;
      }, (err) => {
        console.log(err);
      });
    } else {
      this.http.get<any[]>(`/api/users/questions`).subscribe((data) => {
        this.questions = data;
      }, (err) => {
        console.log(err);
      });
    }
  }

  onReply(form: NgForm, questionCode, index: number) {
    const courseCode = this.route.snapshot.params['courseCode'];
    const partCode = this.route.snapshot.params['partCode'];
    const videoCode = this.route.snapshot.params['videoCode'];
    const answer = {
      body: form.value.answerBody
    };
    this.http.post<any>(`/api/courses/${courseCode}/parts/${partCode}/videos/${videoCode}/questions/${questionCode}/answers`, answer)
    .subscribe((data) => {
      this.questions.map((question) => {
        if (question.code === questionCode) {
          question.answers.push(data);
          if (data.author.isInstructor) {
            if (!this.preventCategoryChange) {
              question.isClosed = true;
              this.filter.nativeElement.value = "2";
              this.userFilterArray = { isClosed: true };
              setTimeout(() => {
                document.querySelector('#q' + questionCode).scrollIntoView();
              });
            } else {
              $(`#q${questionCode}`).removeClass("bg-red-light");
              $(`#q${questionCode}`).addClass("bg-green-light")
            }
          } else {
            if (!this.preventCategoryChange) {
              question.isClosed = false;
              this.filter.nativeElement.value = "3";
              this.userFilterArray = { isClosed: false };
              setTimeout(() => {
                document.querySelector('#q' + questionCode).scrollIntoView();
              });
            } else {
              $(`#q${questionCode}`).removeClass("bg-green-light");
              $(`#q${questionCode}`).addClass("bg-red-light")
            }
          }
        }
      });

      this.questionCode = questionCode;
      setTimeout(() => {
        this.questionCode = null;
      }, 2000);

      this.showReply[index] = false;
    }, (err) => {
      console.log(err);
    })
  }

  onChangeFilter(filter) {
    if (this.queryNewQuestion) {
      if (this.authService.isInstructor()) {
        this.http.get<any[]>(`/api/admin/questions`).subscribe((data) => {
          this.questions = data;
        }, (err) => {
          console.log(err);
        });
      } else {
        this.http.get<any[]>(`/api/users/questions`).subscribe((data) => {
          this.questions = data;
        }, (err) => {
          console.log(err);
        });
      }
      this.queryNewQuestion = false;
    }
    $("#checkbox").prop("checked", false);
    if (filter == 1) {
      this.userFilterArray = {};
    } else if (filter == 2) {
      this.userFilterArray = { isClosed: true };
    } else if (filter == 3) {
      this.userFilterArray = { isClosed: false };
    } else if (filter == 4) {
      this.userFilterArray = {};
    }
  }
}
