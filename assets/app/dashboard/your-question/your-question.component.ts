import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AuthService } from './../../auth/auth.service';
import { QuestionService } from './../question.service';

declare var $:any;

@Component({
  selector: 'your-question',
  templateUrl: './your-question.component.html',
  styleUrls: ['./your-question.component.css'],
  providers: [AuthService, QuestionService]
})

export class YourQuestionComponent implements OnInit {
  @ViewChild('filter') filter;
  questions = [];
  showReply = [];
  userFilterArray: any = { };
  questionCode = null;
  preventCategoryChange = false;
  queryNewQuestion = false;

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private authService: AuthService, private router: Router,
    private questionService: QuestionService) {}

  ngOnInit() {
    this.queryQuestions();
  }

  onReply(form: NgForm, questionCode, index: number) {
    const answer = {
      body: form.value.answerBody
    };
    this.questionService.createAnswer(questionCode, answer, (answer) => {
      this.handleCreatedAnswer(questionCode, answer);
      this.showReply[index] = false;
    });
  }

  onChangeFilter(filter) {
    if (this.queryNewQuestion) {
      this.queryQuestions();
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

  onDeleteQuestion(courseCode, videoCode, questionCode) {
    this.questionService.deleteQuestion(courseCode, videoCode, questionCode, () => {
      this.questions = this.questions.filter(question => question.code !== questionCode);
    })
  }

  private queryQuestions() {
    if (this.authService.isInstructor()) {
      this.questionService.getInstructorQuestions((questions) => {
        this.questions = questions;
      });
    } else {
      this.questionService.getYourQuestions((questions) => {
        this.questions = questions;
      });
    }
  }

  private handleCreatedAnswer(questionCode, answer) {
    this.questions.map((question) => {
      if (question.code === questionCode) {
        question.answers.push(answer);
        if (answer.author.isInstructor) {
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
  }
}
