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
  newQuestion.author = req.user;
  var question;
  var video;
  Video.findOne({code: req.params.vidCode}).then((foundVideo) => {
    newQuestion.video = video;
    video = foundVideo;
    return Question.create(newQuestion);
  }).then((createdQuestion) => {
    question = createdQuestion;
    video.questions.push(question);
    return video.save();
  }).then((video) => {
    return Course.findOne({code: req.params.courseCode});
  }).then((course) => {
    course.questions.push(question);
    return course.save();
  }).then(() => {
    res.status(201).send(question);
  }).catch((err) => {
    console.log(err);
    res.status(400).send({err, message: "Something went wrong"});
  });
});

module.exports = router;
