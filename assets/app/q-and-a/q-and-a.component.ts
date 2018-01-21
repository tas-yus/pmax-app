import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { QuestionService } from '../dashboard/question.service';

@Component({
  selector: 'q-and-a',
  templateUrl: './q-and-a.component.html',
  styleUrls: ['./q-and-a.component.css'],
  providers: [QuestionService]
})

export class QAndAComponent implements OnInit {
  @Input() questions = [];
  showReply: Boolean[] = [];
  showAskQuestion: Boolean = false;
  getDate: Function = function(date: string) {
    var time = new Date().getTime() - new Date(date).getTime();
    var weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday'];
    if (time < 60000)  {
      return 'Just now'
    } else if (time >= 60000*60*24*7*4 ) {
      return new Date(date).toDateString();
    } else if (time >= 60000*60*24*7*2) {
      return `${Math.floor(time/60000/60/24/7)} weeks ago`
    } else if (time >= 60000*60*24*7) {
      return `1 week ago`;
    } else if (time >= 60000*60*24*2) {
      return weekDay[new Date(date).getDay()];
    } else if (time >= 60000*60*24) {
      return `Yesterday`;
    } else if (time >= 60000*60*2) {
      return `${Math.floor(time/60000/60)} hours ago`;
    } else if (time >= 60000*60) {
      return `1 hour ago`;
    } else if (time >= 60000*2) {
      return `${Math.floor(time/60000)} minutes ago`;
    } else if (time >= 60000) {
      return '1 min ago';
    }
  }

  constructor(private route: ActivatedRoute, private questionService: QuestionService) {}

  ngOnInit() {}

  onAskQuestion(form: NgForm) {
    const courseCode = this.route.snapshot.params['courseCode'];
    const videoCode = this.route.snapshot.params['videoCode'];
    const question = {
      title: form.value.title,
      body: form.value.body
    };
    this.questionService.createQuestion(courseCode, videoCode, question, (question) => {
      this.questions.push(question);
      this.showAskQuestion = false;
    })
  }

  onReply(form: NgForm, questionCode, index: number) {
    const answer = {
      body: form.value.answerBody
    };
    this.questionService.createAnswer(questionCode, answer, (answer) => {
      this.questions.map((question) => {
        if (question.code === questionCode) {
          question.answers.push(answer);
        }
      });
      this.showReply[index] = false;
    });
  }
}
