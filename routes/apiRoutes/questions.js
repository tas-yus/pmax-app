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
// router.get("/courses/:courseCode/questions", middleware.isLoggedIn, async (req, res) => {
//   var course = await Course.findOne({code: req.params.courseCode}).populate("questions").exec();
//   var questions = await User.populate(course.questions, {path: "author", select: "username"});
//   questions = await Answer.populate(questions, {path: "answers", select: "author body createdAt"});
//   questions = await User.populate(questions, {path: "answers.author", select: "username image", model: User});
//   res.status(400).send(questions);
// });

router.get("/questions", middleware.isLoggedIn, async (req, res) => {
  var populateArray = [
    {
      path: "author",
      select: "username image"
    },
    {
      path: "answers",
      select: "author body createdAt",
      populate: {
        path: "author",
        select: "username image isInstructor"
      }
    },
    {
      path: "video",
      select: "code part course",
      populate: [
        {
          path: "part",
          select: "code"
        },
        {
          path: "course",
          select: "code"
        }
      ]
    }
  ];
  Question.find({}).populate(populateArray).then((questions) => {
    res.status(200).send(questions);
  }).catch((err) => {
    res.status(400).send({err, message: "Something went wrong"});
  });
});

// CREATE QUESTIONS
router.post("/courses/:courseCode/videos/:vidCode/questions", middleware.isLoggedIn, (req, res) => {
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
    User.populate(question, {path: "author", select: "username image"}, (err, question) => {
      if (err) {
        return res.status(400).send({err, message: "Something went wrong"});
      }
      res.status(201).send(question);
    });
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

router.delete("/courses/:courseCode/videos/:videoCode/questions/:questionCode", (req, res) => {
  async.waterfall([
    function(callback) {
      Question.findOneAndRemove({code: req.params.questionCode}, (err, question) => {
        if (err || !question) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        callback(null, question._id, question.author);
      });
    },
    function(questionId, authorId, callback) {
      Course.findOne({code: req.params.courseCode}, (err, course) => {
        if (err || !course) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        course.questions = course.questions.filter((question) => !question.equals(questionId));
        course.save(() => {
          if (err) {
            return res.status(400).send({err, message: "Something went wrong"});
          }
          callback(null, questionId, authorId);
        })
      });
    },
    function(questionId, authorId, callback) {
      Video.findOne({code: req.params.videoCode}, (err, video) => {
        if (err || !video) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        video.questions = video.questions.filter((question) => !question.equals(questionId));
        video.save(() => {
          if (err) {
            return res.status(400).send({err, message: "Something went wrong"});
          }
          callback(null, questionId, authorId);
        });
      })
    },
    function(questionId, authorId, callback) {
      User.findById(authorId).populate({path: "answers", select: "question"}).exec((err, user) => {
        if (err || !user) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        user.questions = user.questions.filter((question) => !question.equals(questionId));
        user.answers = user.answers.filter((answer) => !answer.question.equals(questionId));
        user.save((err) => {
          if (err) {
            return res.status(400).send({err, message: "Something went wrong"});
          }
          callback(null, questionId);
        })
      });
    },
    function(questionId, callback) {
      Answer.remove({question: questionId}, (err) => {
        if (err) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        callback();
      });
    },
  ], (err) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    }
    return res.status(201).send({message: "Question Deleted!"});
  });
});



module.exports = router;
