var express = require("express");
var router = express.Router({mergeParams: true});
var Question = require("./../../models/question");
var User = require("./../../models/user");
var Answer = require("./../../models/answer");
var middleware = require("./../../middleware");
var method = require("./../../method");

// CREATE ANSWER
router.post("/", middleware.isLoggedIn, (req, res) => {
  var newAnswer = req.body;
  newAnswer.author = req.user._id;
  Question.findOne({code: req.params.questionCode}, (err, question) => {
    if (err) return console.log(err);
    question.isClosed = req.user.isInstructor? true : false;
    newAnswer.question = question;
    Answer.create(newAnswer, async (err, answer) => {
      if (err) return res.status(400).send("Something went wrong");
      var answer = await User.populate(answer, {path: "author", select: "username image isInstructor"});
      question.answers.push(answer._id);
      question.save((err) => {
        if (err) return console.log(err);
        res.status(201).send(answer);
      });
    });
  });
});

module.exports = router;
