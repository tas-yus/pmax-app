var express = require("express");
var router = express.Router();
var Course = require("./../../models/course");
var Part = require("./../../models/part");
var Video = require("./../../models/video");
var User = require("./../../models/user");
var Order = require("./../../models/order");
var middleware = require("./../../middleware");
var method = require("./../../method");
var checkExpiry = require("./../../method/checkExpiry");
var config = require("./../../config");
var mongoose = require("mongoose");
var forEach = require('async-foreach').forEach;
var async = require('async');

function fetchCourse(courseCode) {
  return new Promise((resolve, reject) => {
    Course.findOne({code: courseCode}).populate({
      path: "parts",
      model: "Part",
      populate: {
        path: "videos",
        model: "Video"
      }
    }).exec().then((course) => {
      resolve(course);
    }).catch((err) => {
      reject(err);
    });
  });
};

// ALL COURSES
router.get("/", (req, res) => {
  var sort = req.query.sort;
  var order = req.query.order;
  var limit = req.query.limit? Number(req.query.limit) : 100;
  var skip = req.query.skip? Number(req.query.skip) : 0;
  var sortObject = sort? new Object: null;
  if (order === 1 || order === -1) {
    sortObject[sort] = order? order : 1;
  }
  Course.find({}).sort(sortObject).skip(skip).limit(limit).exec((err, courses) => {
    if (err) {
      return res.status(400).send("There's an error with the database");
    } else {
      res.status(200).send(courses);
    }
  });
});

router.get("/:courseCode/learn", middleware.isLoggedIn, (req, res) => {
  fetchCourse(req.params.courseCode).then((course) => {
    if (!course) {
      return res.status(400).send("Cannot find a course with particular id");
    }
    if (!method.checkCourseOwnership(req.user.courses, course._id)) {
      return res.status(401).send({message: "Cannot Access"});
    }
    res.status(200).send(course);
  }).catch((err) => {
    res.status(400).send("Something is wrong with the database");
  });
});

router.get("/:courseCode", (req, res) => {
  fetchCourse(req.params.courseCode).then((course) => {
    if (!course) {
      return res.status(400).send("Cannot find a course with particular id");
    }
    if (req.user && method.checkCourseOwnership(req.user.courses, course._id)) {
      return res.status(401).send({message: "Cannot Access"});
    }
    var owned = req.user? method.checkCourseOwnership(req.user.courses, course._id) ||
    method.checkCartCourseOwnership(req.user.cartCourses, course._id) : false;
    res.status(200).send({course, owned});
  }).catch((err) => {
    res.status(400).send("Something is wrong with the database");
  });
});

// CREATE COURSE
router.post("/", (req, res) => {
  if (!req.body.title) {
    return res.status(400).send("โปรดใส่ชื่อคอร์ส");
  }
  if (!req.body.image) {
    return res.status(400).send("โปรดเลือกภาพ");
  }
  var course = new Course({
      title: req.body.title,
      code: method.createCode(req.body.title),
      description: req.body.description,
      video: req.body.video,
      price: req.body.price,
      image: req.body.image + '.jpg'
  });
  course.save().then((course) => {
    res.status(201).send(course);
  }).catch((err) => {
    res.status(400).send("Something went wrong");
  });
});

// UPDATE COURSE

// UP DATE PART AND ORDER AND VIDEO IF NAME HAS CHANGEd.
// router.put("/:courseCode", (req, res) => {
//   fetchCourse(req.params.courseCode).then((course) => {
//     course.title = req.body.title;
//     course.code = method.createCode(req.body.title);
//     course.price = req.body.price;
//     course.description = req.body.description;
//     course.video = req.body.video;
//     if (req.body.image) {
//       course.image = req.body.image + '.jpg';
//     }
//     return course.save()
//   }).then((course) => {
//     res.status(200).send(course);
//   }).catch((err) => {
//     res.status(400).send("Something is wrong with the database");
//   });
// });

// DELETE
router.delete("/:id", (req, res) => {
  Course.findByIdAndRemove(req.params.id).then((course) => {
    res.status(200).send(course);
  }).catch((err) => {
    res.status(400).send("Something is wrong with the database");
  });
});



module.exports = router;
