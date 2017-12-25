var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("./../../models/user");
var Course = require("./../../models/course");
var Part = require("./../../models/part");
var Video = require("./../../models/video");
var mongoose = require("mongoose");
var middleware = require("./../../middleware");
var method = require("./../../method");
var passport = require("passport");
var Order = require("./../../models/order");
var async = require("async");

// LOGIN

// middleware.noDuplicateLogin, middleware.checkRememberMe
router.post("/login", middleware.checkRememberMe, passport.authenticate("local"), (req, res) => {
  res.status(200).send(req.user);
});

// LOGOUT
router.post("/logout", function(req, res){
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    }
    res.status(200).send({message: "Logged Out"});
  });
});

// SESSION
router.get("/session", function(req, res){
  if (req.user) {
    return res.status(200).send(req.user);
  }
  res.status(400).send({message: "Not logged in"});
});

router.post("/cart", middleware.isLoggedIn, middleware.canAddToCart, (req,res) => {
  var id = req.body.courseId;
  var user = req.user;
  user.cartCourses.push(id);
  user.save().then((user) => {
    res.status(200).send(user);
  }).catch((err) => {
    res.status(400).send({err, message: "Something went wrong"});
  });
});

router.get("/cart", async (req,res) => {
  var user = req.user;
  user = await Course.populate(user, {path: "cartCourses"});
  res.status(200).send(user.cartCourses);
});

router.get("/cart/:courseCode", async (req,res) => {
  var user = req.user;
  user = await Course.populate(user, {path: "cartCourses"});
  Course.findOne({code:req.params.courseCode}).then((course) => {
    var user = req.user;
    var courses = [];
    courses.push(method.getCourseInArrayById(user.cartCourses, course._id));
    res.status(200).send(courses);
  }).catch((err)=> {
    res.status(400).send({err, message: "Something went wrong"});
  });
});

router.post("/checkout", (req,res) => {
  var user = req.user;
  var checkedCourses = req.user.cartCourses;
  async.eachSeries(checkedCourses, (checkedCourse, cb1) => {
    if (!method.checkCourseOwnership(user.courses, checkedCourse)) {
      user.courses.push({course: mongoose.Types.ObjectId(checkedCourse)});
      async.waterfall([
        function(callback) {
          Course.findById(checkedCourse).exec((err, course) => {
            if (err) {
              return res.status(400).send({err, message: "Something went wrong"});
            }
            course.users.push(user);
            callback(null, course);
          });
        },
        function(course, callback) {
          course.save((err) => {
            if (err) {
              return res.status(400).send({err, message: "Something went wrong"});
            }
            callback(null, course);
          });
        },
        function(course, callback) {
          var newOrder = {
            course, user
          }
          Order.create(newOrder, (err, order) => {
            if (err) {
              return res.status(400).send({err, message: "Something went wrong"});
            }
            user.orders.push(order);
            callback(null, course);
          });
        },
        function(course, callback) {
          Video.find({course: course._id}, (err, videos) => {
            if (err) {
              return res.status(400).send({err, message: "Something went wrong"});
            }
            callback(null, videos);
          });
        },
        function(videos, callback) {
          async.forEach(videos, (video, cb2) => {
            user.videos.push({
              video: video._id
            });
            cb2();
          }, (err) => {
            if (err) {
              return res.status(400).send({err, message: "Something went wrong"});
            }
            callback();
          });
        }
      ], (err) => {
        if (err) {
          return res.status(400).send({err, message: "Something went wrong"});
        }
        cb1();
      });
    }
  }, (err) => {
    user.cartCourses = [];
    user.save((err) => {
      if (err) {
        return res.status(400).send({err, message: "Something went wrong"});
      }
      res.status(200).send({message: "Checked Out"})
    });
  });
});

module.exports = router;
