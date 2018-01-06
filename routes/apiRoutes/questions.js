var express = require("express");
var router = express.Router({mergeParams: true});
var Course = require("./../../models/course");
var Part = require("./../../models/part");
var Video = require("./../../models/video");
var User = require("./../../models/user");
var Order = require("./../../models/order");
var Answer = require("./../../models/answer");
var Question = require("./../../models/question");
var middleware = require("./../../middleware");
var method = require("./../../method");
var checkExpiry = require("./../../method/checkExpiry");
var config = require("./../../config");
var mongoose = require("mongoose");
var async = require('async');

// QUESTIONS
router.get("/questions", async (req, res) => {
  var course = await Course.findOne({code: req.params.courseCode}).populate("questions").exec();
  var questions = await User.populate(course.questions, {path: "author", select: "username"});
  questions = await Answer.populate(questions, {path: "answers", select: "author body createdAt"});
  questions = await User.populate(questions, {path: "answers.author", select: "username", model: User});
  res.status(400).send(questions);
});

// CREATE QUESTIONS
router.post("/parts/:partCode/videos/:vidCode/questions", (req, res) => {
  var newQuestion = req.body;
  newQuestion.author = req.user._id;
  async.waterfall([
    function(cb) {
      Video.findOne({code: req.params.vidCode}, (err, video) => {
        if (err) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        cb(null, video);
      });
    },
    function(video, cb) {
      newQuestion.video = video._id;
      Question.create(newQuestion, (err, question) => {
        if (err) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        cb(null, question, video);
      });
    },
    function(question, video, cb) {
      video.questions.push(question);
      video.save((err) => {
        if (err) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        cb(null, question);
      });
    },
    function(question, cb) {
      Course.findOne({code: req.params.courseCode}, (err, course) => {
        if (err) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        cb(null, question, course);
      });
    },
    function(question, course, cb) {
      course.questions.push(question);
      course.save((err) => {
        if (err) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        cb(null, question);
      });
    },
    function(question, cb) {
      req.user.questions.push(question);
      req.user.save((err) => {
        if (err) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        cb(null, question);
      });
    }
  ], (err, question) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    }
    res.status(201).send(question);
  })
  // Video.findOne({code: req.params.vidCode}).then((foundVideo) => {
  //   newQuestion.video = video;
  //   video = foundVideo;
  //   return Question.create(newQuestion);
  // }).then((createdQuestion) => {
  //   question = createdQuestion;
  //   delete createdQuestion;
  //   video.questions.push(question);
  //   return video.save();
  // }).then((video) => {
  //   return Course.findOne({code: req.params.courseCode});
  // }).then((course) => {
  //   course.questions.push(question);
  //   return course.save();
  // }).then(() => {
  //   req.user.questions.push(question);
  //   return req.user.save();
  // }).then(() => {
  //   res.status(201).send(question);
  // }).catch((err) => {
  //   console.log(err);
  //   res.status(400).send({err, message: "Something went wrong"});
  // });
});

module.exports = router;
