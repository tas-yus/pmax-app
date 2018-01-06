var express = require("express");
var router = express.Router();
var Course = require("./../../models/course");
var Part = require("./../../models/part");
var Video = require("./../../models/video");
var User = require("./../../models/user");
var Order = require("./../../models/order");
var Question = require("./../../models/question");
var middleware = require("./../../middleware");
var method = require("./../../method");
var checkExpiry = require("./../../method/checkExpiry");
var config = require("./../../config");
var mongoose = require("mongoose");
var forEach = require('async-foreach').forEach;
var async = require('async');
var fs = require("fs");
var path = require("path");
var multer = require("multer");
var processFormBody = multer({storage: multer.memoryStorage()}).single('file');


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
router.get("/courses", (req, res) => {
  var sort = req.query.sort;
  var order = req.query.order;
  var limit = req.query.limit? Number(req.query.limit) : 100;
  var skip = req.query.skip? Number(req.query.skip) : 0;
  var query = req.query.name? {
    title: new RegExp(req.query.name, 'i')
  } : {};
  var sortObject = sort? new Object: null;
  if (order === 1 || order === -1) {
    sortObject[sort] = order? order : 1;
  }
  Course.find(query).sort(sortObject).skip(skip).limit(limit)
    .populate({path:"parts", model: "Part", populate: {path: "videos", model: "Video"}}).exec((err, courses) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    } else {
      res.status(200).send(courses);
    }
  });
});

router.get("/courses/:id", (req, res) => {
  Course.findById(req.params.id).populate({path:"parts", model: "Part", populate: {path: "videos", model: "Video"}}).exec((err, course) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    } else {
      res.status(200).send(course);
    }
  });
});

router.put("/courses/:id", (req, res) => {
  Course.findById(req.params.id).then((course) => {
    course.title = req.body.title;
    course.code = method.createCode(req.body.title);
    course.price = req.body.price;
    course.description = req.body.description;
    course.video = req.body.video;
    course.image = req.body.image;
    return course.save()
  }).then((course) => {
    res.status(200).send({message: "Course edited"});
  }).catch((err) => {
    console.log(err);
    res.status(400).send({err, message: "Something went wrong"});
  });
});

// ALL PARTS
router.get("/parts", (req, res) => {
  var sort = req.query.sort;
  var order = req.query.order;
  var limit = req.query.limit? Number(req.query.limit) : 100;
  var skip = req.query.skip? Number(req.query.skip) : 0;
  var query = req.query.name? {
    title: new RegExp(req.query.name, 'i')
  } : {};
  var sortObject = sort? new Object: null;
  if (order === 1 || order === -1) {
    sortObject[sort] = order? order : 1;
  }
  Part.find(query).sort(sortObject).skip(skip).limit(limit)
    .populate("videos").populate("course").exec((err, parts) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    } else {
      res.status(200).send(parts);
    }
  });
});

router.get("/parts/:id", (req, res) => {
  Part.findById(req.params.id).populate("videos").populate("course").exec((err, part) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    } else {
      res.status(200).send(part);
    }
  });
});

router.put("/parts/:id", (req, res) => {
  Part.findById(req.params.id).then((part) => {
    part.title = req.body.title;
    part.code = method.createCode(req.body.title);
    part.description = req.body.description;
    part.image = req.body.image;
    return part.save()
  }).then((part) => {
    res.status(200).send({message: "Part edited"});
  }).catch((err) => {
    console.log(err);
    res.status(400).send({err, message: "Something went wrong"});
  });
});

// ALL VIDEOS
router.get("/videos", (req, res) => {
  var sort = req.query.sort;
  var order = req.query.order;
  var limit = req.query.limit? Number(req.query.limit) : 100;
  var skip = req.query.skip? Number(req.query.skip) : 0;
  var query = req.query.name? {
    title: new RegExp(req.query.name, 'i')
  } : {};
  var sortObject = sort? new Object: null;
  if (order === 1 || order === -1) {
    sortObject[sort] = order? order : 1;
  }
  Video.find(query).populate([{path: "course", select: "title", model: "Course"},
  {path: "part", select: "title", model: "Part"}]).exec((err, videos) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    } else {
      res.status(200).send(videos);
    }
  });
});

router.get("/videos/list", (req, res) => {
  fs.readdir(__dirname + config.videoApiPath, (err, videoPaths) => {
    if (err) {
      console.log(err);
      return res.status(400).send({err, message: "Something went wrong"});
    }
    res.status(200).send(videoPaths);
  });
});

router.get("/videos/:id", (req, res) => {
  Video.findById(req.params.id).populate([{path: "course", select: "title", model: "Course"},
  {path: "part", select: "title", model: "Part"}]).exec((err, video) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    } else {
      res.status(200).send(video);
    }
  });
});

router.put("/videos/:id", (req, res) => {
  Video.findById(req.params.id).then((video) => {
    video.title = req.body.title;
    video.path = req.body.path;
    return video.save()
  }).then((video) => {
    res.status(200).send({message: "Video edited"});
  }).catch((err) => {
    console.log(err);
    res.status(400).send({err, message: "Something went wrong"});
  });
});

// ALL USERS
router.get("/users", (req, res) => {
  var sort = req.query.sort;
  var order = req.query.order;
  var limit = req.query.limit? Number(req.query.limit) : 100;
  var skip = req.query.skip? Number(req.query.skip) : 0;
  var query = req.query.name? {
    title: new RegExp(req.query.name, 'i')
  } : {};
  var sortObject = sort? new Object: null;
  if (order === 1 || order === -1) {
    sortObject[sort] = order? order : 1;
  }
  User.find(query).populate([{path: "courses.course", select: "title", model: "Course"},
    {path: "questions", select: "title body", model: "Question"},
    {path: "answers", select: "body", model: "Answer"},
    {path: "orders", model: "Order"},
  ]).exec((err, users) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    } else {
      res.status(200).send(users);
    }
  });
});

router.get("/users/:id", (req, res) => {
  User.findById(req.params.id).populate([{path: "courses.course", select: "title", model: "Course"},
    {path: "questions", select: "title body", model: "Question"},
    {path: "answers", select: "body", model: "Answer"},
    {path: "orders", model: "Order"},
  ]).exec((err, user) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    } else {
      res.status(200).send(user);
    }
  });
});

// SEARCH
router.get("/search", (req, res) => {
  var sort = req.query.sort;
  var order = req.query.order;
  var limit = req.query.limit? Number(req.query.limit) : 3;
  var skip = req.query.skip? Number(req.query.skip) : 0;
  var query = req.query.name? {
    title: new RegExp(req.query.name, 'i')
  } : {};
  var sortObject = sort? new Object: null;
  if (order === 1 || order === -1) {
    sortObject[sort] = order? order : 1;
  }
  var search = {};
  Course.find(query).sort(sortObject).skip(skip).limit(limit).select("title").exec().then((courses) => {
    if (courses.length !== 0) {
      search.courses = courses;
    }
    return Part.find(query).sort(sortObject).skip(skip).limit(limit).select("title").exec();
  }).then((parts) => {
    if (parts.length !== 0) {
      search.parts = parts;
    }
    return Video.find(query).sort(sortObject).skip(skip).limit(limit).select("title").exec();
  }).then((videos) => {
    if (videos.length !== 0) {
      search.videos = videos;
    }
    return User.find({username: new RegExp(req.query.name, 'i')}).sort(sortObject).skip(skip).limit(limit).select("username").exec();
  }).then((users) => {
    if (users.length !== 0) {
      search.users = users;
    }
    res.status(200).send(search);
  }).catch((err) => {
    return res.status(400).send({err, message: "Something went wrong"});
  });
});



module.exports = router;
