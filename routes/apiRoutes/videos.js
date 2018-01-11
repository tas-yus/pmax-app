var express = require("express");
var router = express.Router({mergeParams: true});
var Part = require("./../../models/part");
var Course = require("./../../models/course");
var Video = require("./../../models/video");
var User = require("./../../models/user");
var Answer = require("./../../models/answer");
var Question = require("./../../models/question");
var getVideoInfo = require('get-video-info');
var middleware = require("./../../middleware");
var method = require("./../../method");
var config = require("./../../config");
var fs = require("fs");
var async = require("async");
var ffmpeg = require("fluent-ffmpeg");
var path = require("path");

// LEARN VID
router.get("/:vidCode", async (req, res) => {
    // var courseCode = req.params.courseCode;
    // var partCode = req.params.partCode;
    // var checkPartOwnership = method.checkPartOwnership;
    // var isFinished = method.isFinished;
    // var getVideoInArrayById = method.getVideoInArrayById;
    // var course = await Course.findOne({code: courseCode}).populate("parts").exec();
    // var parts = await Video.populate(course.parts, {path: "videos"});
    try {
      var video = await Video.findOne({code: req.params.vidCode})
        .populate({
          path: "questions",
          populate: [
            {path: "author", select: "username image", model:"User"},
            {path: "answers", select: "createdAt author body", model:"Answer",
              populate: {path: "author", select: "username image", model: "User"}
            }
          ]
        }).populate("resources").populate("part").exec();
      if (!video) return res.status(400).send({message: "No video"});
      res.status(200).send(video);
    } catch(err) {
      return res.status(400).send({err, message: "Something went wrong"});
    }
    // var questions = await Question.find({video: video._id}).sort({createdAt:-1}).populate("author")
    //   .populate({
    //     path: "answers",
    //     model: "Answer",
    //     populate: {
    //       path: "author",
    //       model: "User"
    //     }
    //   }).exec();
    // var questions = await User.populate(video.questions, {path: "author", select: "username"});
    // questions = await Answer.populate(questions, {path: "answers", select: "author body"});
    // questions = await User.populate(questions, {path: "answers.author", select: "username", model: User});
    // if (!user.isAdmin) {
    //   method.getCourseInArrayById(user.courses, course._id).mostRecentVideo = {video};
    // }
    // user.save((err) => {
    //   if (err) return console.log(err);
    //   res.render("videos/index", {vid: video, course, courseCode, partCode, questions, checkPartOwnership, isFinished, getVideoInArrayById});
    // })
});

// NEW VIDS
// router.get("/new", middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
//     var courseCode = req.params.courseCode;
//     var partCode = req.params.partCode;
//     var removeExtension = method.removeExtension;
//     fs.readdir(__dirname + config.videoPath, (err, vidPaths) => {
//       if (err) return console.log(err);
//       fs.readdir(__dirname + config.thumbnailPath, (err, thumbPaths) => {
//         if (err) return console.log(err);
//         res.render("videos/new", {courseCode, partCode, vidPaths, thumbPaths, removeExtension});
//       });
//     });
// });
//
// // CREATE VIDS
// router.post("/", middleware.isLoggedIn, middleware.isAdmin, upload.fields([{
//            name: 'videoFile', maxCount: 1
//          }, {
//            name: 'thumbnailFile', maxCount: 1
//          }]), async (req, res) => {
//   var path;
//   if (!req.files.videoFile && !req.body.chosenVideo) {
//     req.flash("error", "โปรด upload video หรือเลือกจากที่มีอยู่แล้ว");
//     return res.redirect(`/courses/${req.params.courseCode}/parts/${req.params.partCode}/videos/new`);
//   } else if (req.files.videoFile) {
//     path = req.files.videoFile[0].filename;
//   } else {
//     path = req.body.chosenVideo;
//   }
//   var course = await Course.findOne({code: req.params.courseCode});
//   course.numVideos++;
//   course.save((err) => {
//     if (err) return console.log(err);
//   });
//   async.waterfall([
//     function(callback) {
//       if (!req.files.videoFile || req.files.thumbnailFile) return callback();
//       ffmpeg(__dirname + config.videoPath + path)
//         .on('end', function() {
//           callback();
//           console.log('Screenshots taken');
//         })
//         .on('error', function(err) {
//           callback(null, part);
//           console.error(err);
//         })
//         .screenshots({
//           count: 1,
//           filename: method.removeExtension(path) + ".jpg",
//           folder: __dirname + config.thumbnailPath,
//         });
//     },
//     function(callback) {
//       getVideoInfo(__dirname + config.videoPath + path).then((info) => {
//         callback(null, info);
//       }).catch((err) => {
//         console.log(err);
//       });
//     },
//     function(info, callback) {
//       Part.findOne({code: req.params.partCode}, (err, part) => {
//         if (err) return console.log(err);
//         callback(null, part, info);
//       });
//     },
//     function(part, info, callback) {
//       var newVid = {
//           title: req.body.title,
//           path,
//           course: part.course,
//           part: part._id,
//           thumbnail: method.removeExtension(path) + ".jpg",
//           duration: method.toClockTime(info.format.duration)
//       };
//       Video.create(newVid, (err, vid) => {
//          if (err) return console.log(err);
//          callback(null, part, vid, info);
//       });
//     },
//     function(part, vid, info, callback) {
//       part.videos.push(vid);
//       part.duration = method.toClockTime(method.toTime(part.duration) + Number(info.format.duration));
//       part.save((err) => {
//         if (err) return console.log(err);
//         callback(null, part, vid);
//       });
//     },
//     function(part, vid, callback) {
//       async.eachSeries(part.users, (user, cb) => {
//         user.videos.push({video: vid});
//         user.save((err) => {
//           if (err) return console.log(err);
//           cb();
//         });
//       }, (err) => {
//         callback(null, part, vid);
//       });
//     },
//     function(part, vid, callback) {
//       async.eachSeries(part.expiredUsers, (user, cb) => {
//         user.videos.push({video: vid});
//         user.save((err) => {
//           if (err) return console.log(err);
//           cb();
//         });
//       }, (err) => {
//         callback(null, vid);
//       });
//     }
//   ], (err) => {
//     console.log(err);
//     res.redirect(`/courses/${req.params.courseCode}/learn`);
//   });
// });
//
// // EDIT VIDEO
// router.get("/:vidCode/edit", middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
//   var courseCode = req.params.courseCode;
//   var partCode = req.params.partCode;
//   var vidCode = req.params.vidCode
//   var removeExtension = method.removeExtension;
//   Video.findOne({code: req.params.vidCode}, (err, video) => {
//     if (err) return console.log(err);
//     if (!video) return res.redirect(`/courses/${req.params.courseCode}/learn`);
//     fs.readdir(__dirname + config.videoPath, (err, vidPaths) => {
//       if (err) return console.log(err);
//       fs.readdir(__dirname + config.thumbnailPath, (err, thumbPaths) => {
//         if (err) return console.log(err);
//         res.render("videos/edit", {courseCode, partCode, vidCode, video, vidPaths, thumbPaths, removeExtension});
//       });
//     });
//   });
// });
//
// // UPDATE VIDEO
// router.put("/:vidCode", middleware.isLoggedIn, middleware.isAdmin, upload.fields([{
//            name: 'videoFile', maxCount: 1
//          }, {
//            name: 'thumbnailFile', maxCount: 1
//          }]), async (req, res) => {
//   try {
//     var video = await Video.findOne({code: req.params.vidCode});
//     if (!video) return res.redirect(`/courses/${req.params.courseCode}/learn`);
//   } catch(err) {
//     return res.redirect(`/courses/${req.params.courseCode}/learn`);
//   }
//   var path;
//   var noFileUpload = false;
//   if (req.files.videoFile) {
//     path = req.files.videoFile[0].filename;
//   } else if(req.body.chosenVideo) {
//     path = req.body.chosenVideo;
//   } else {
//     path = video.path;
//     noFileUpload = true;
//   }
//   video.path = path;
//   video.title = req.body.title;
//   video.thumbnail = method.removeExtension(path) + ".jpg";
//   video.save((err) => {
//     if (err) return console.log(err);
//   });
//   async.waterfall([
//     function(callback) {
//       if (!req.files.videoFile || req.files.thumbnailFile) return callback();
//       ffmpeg(__dirname + config.videoPath + path)
//         .on('end', function() {
//           callback();
//           console.log('Screenshots taken');
//         })
//         .on('error', function(err) {
//           callback();
//           console.error(err);
//         })
//         .screenshots({
//           count: 1,
//           filename: method.removeExtension(path) + ".jpg",
//           folder: __dirname + config.thumbnailPath,
//         });
//     },
//     function(callback) {
//       if (noFileUpload) return callback(null, null);
//       getVideoInfo(__dirname + config.videoPath + path).then((info) => {
//         callback(null, info);
//       }).catch((err) => {
//         console.log(err);
//       });
//     },
//     function(info, callback) {
//       if (noFileUpload) return callback();
//       Part.findOne({code: req.params.partCode}, (err, part) => {
//         if (err) return console.log(err);
//         part.duration = method.toClockTime(method.toTime(part.duration) + Number(info.format.duration));
//         part.save((err) => {
//           if (err) return console.log(err);
//           callback();
//         });
//       });
//     }
//   ], (err) => {
//     res.redirect("/dashboard");
//   });
// });
//
// // DELETE VID
// router.delete("/:vidCode", middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
//   Part.findOne({code: req.params.partCode}).populate("videos").exec((err, part) => {
//     if (err) return console.log(err);
//     part.videos.filter(function(vid) { return vid.code !== req.params.videoCode });
//     part.save((err) => {
//       if (err) return console.log(err);
//       Video.findOneAndRemove({code: req.params.vidCode}, (err) => {
//         if (err) return console.log(err);
//         res.redirect(`/courses/${req.params.courseCode}/parts/${req.params.partCode}/learn`);
//       });
//     });
//   });
// });

// DONE VID
// router.post("/:vidCode/done", async (req, res) => {
//   var course = await Course.findOne({code: req.params.courseCode});
//   Video.findOne({code: req.params.vidCode}, (err, video) => {
//     if (err) return console.log(err);
//     if (!video) return res.redirect(`/courses/${req.params.courseCode}/learn`);
//     var user = req.user;
//     var targetedVideo = method.getVideoInArrayById(user.videos, video._id.toString());
//     var nextVidCode = req.body.next;
//     var userCourseBundle = method.getCourseInArrayById(user.courses, course._id.toString());
//     if (!user.isAdmin && !targetedVideo.finished) {
//       targetedVideo.finished = true;
//       userCourseBundle.numFinishedVideos++;
//       user.save((err) => {
//         if (err) return console.log(err);
//         if (nextVidCode) {
//           res.redirect(`/courses/${req.params.courseCode}/parts/${req.params.partCode}/videos/${nextVidCode}/learn`);
//         } else {
//           req.flash("success", `จบ ${req.params.partCode}`);
//           res.redirect(`/courses/${req.params.courseCode}/learn`);
//         }
//       });
//     } else {
//       if (nextVidCode) {
//         res.redirect(`/courses/${req.params.courseCode}/parts/${req.params.partCode}/videos/${nextVidCode}/learn`);
//       } else {
//         req.flash("success", `จบ ${req.params.partCode}`);
//         res.redirect(`/courses/${req.params.courseCode}/learn`);
//       }
//     }
//   });
// });

module.exports = router;
