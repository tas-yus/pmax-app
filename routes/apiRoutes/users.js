var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("./../../models/user");
var Course = require("./../../models/course");
var Part = require("./../../models/part");
var Order = require("./../../models/order");
var Video = require("./../../models/video");
var mongoose = require("mongoose");
var middleware = require("./../../middleware");
var method = require("./../../method");

router.post("/videos/:videoCode", (req, res) => {
  var start = req.body.start;
  var user = req.user;
  Video.populate(user, {path: "videos.video"}).then((user) => {
    return Video.findOne({code: req.params.videoCode});
  }).then((video) => {
    var videoBundle = method.getVideoInArrayById(user.videos, video._id);
    var courseBundle = method.getCourseInArrayById(user.courses, video.course);
    videoBundle.start = start;
    // courseBundle.mostRecentVideo.start = start;
    return user.save();
  }).then(() => {
    res.status(200).send({});
  }).catch((err) => {
    res.status(400).send("Something went wrong");
  });
});

router.put("/videos/:videoCode", async (req, res) => {
  var done = req.body.done;
  var video = await Video.findOne({code: req.params.videoCode});
  var user = req.user;
  var videoBundle = method.getVideoInArrayById(user.videos, video._id);
  var courseBundle = method.getCourseInArrayById(user.courses, video.course);
  if (videoBundle.finished) {
    videoBundle.finished = false;
    courseBundle.numFinishedVideos--;
  } else {
    videoBundle.finished = true;
    courseBundle.numFinishedVideos++;
  }
  user.save((err) => {
    if (err) return res.status(400).send("Something went wrong");
    res.status(200).send({courseBundle, videoBundle});
  })
});

router.get("/courses", async (req,res) => {
  var user = req.user;
  user = await Course.populate(user, {path: "courses.course"});
  res.status(200).send(user.courses);
});

router.get("/orders", (req,res) => {
  var user = req.user;
  Order.populate(user, {path: "orders", populate: {path:"course", select:"title _id"}}).then((user) => {
    res.status(200).send(user.orders);
  }).catch((err) => {
    res.status(400).send({err, message: "Something went wrong"})
  })
});

module.exports = router;
