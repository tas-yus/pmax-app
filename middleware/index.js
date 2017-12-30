var Course = require("./../models/course");
var Part = require("./../models/part");
var method = require("./../method");
var config = require("./../config");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send({message: "User not logged in"});
};

middlewareObj.canAccessLearn = function (req, res, next) {
    Course.findOne({code: req.params.courseCode}, (err, course) => {
        if (err) return console.log(err);
        if (!course) return res.redirect("*");
        if (req.user.isAdmin || method.checkCourseOwnership(req.user.courses, course._id.toString()) === true) {
            return next();
        } else if (method.checkCourseOwnership(req.user.courses, course._id.toString()) === "expired") {
            req.flash("error", "โปรดต่ออายุคอร์สต่อไปนี้เพื่อเข้าดู");
            res.redirect(`/courses/${req.params.courseCode}/extend`);
        } else {
            req.flash("error", "โปรดซื้อคอร์สต่อไปนี้เพื่อเข้าดู");
            res.redirect(`/courses/${req.params.courseCode}/buy`);
        }
    });
};

middlewareObj.canAddToCart = function(req, res, next) {
  if (req.user.isAdmin || method.checkCourseOwnership(req.user.courses, req.body.courseId)
  || method.checkCartCourseOwnership(req.user.cartCourses, req.body.courseId)) {
    return res.status(401).send({message: "Cannot Add Course"});
  }
  next();
};

middlewareObj.canExtend = function(req, res, next) {
    if (req.user.isAdmin) {
        req.flash("error", "สำหรับสมาชิกทั่วไปเท่านั้น");
        return res.redirect(`/${req.params.courseCode}/learn`);
    }
    Course.findOne({code: req.params.courseCode}).populate("parts").exec().then((course) => {
      if(!course) return res.redirect("*");
      var extendableParts = method.getExtendableParts(course.parts, req.user.parts);
      if (extendableParts.length === 0) {
          req.flash("error", "ไม่มีบทที่จำเป็นต้องต่ออายุ");
          res.redirect(`/courses/${req.params.courseCode}/learn`);
      } else {
          next();
      }
    });
};

middlewareObj.checkLoginValidity = function(req, res, next) {
  if (!req.body.username) {
    return res.status(400).send({message: "No username given"});
  }
  if (!req.body.password) {
    return res.status(400).send({message: "No password given"});
  }
  next();
};

middlewareObj.checkRegisterValidity = function(req, res, next) {
  if (!req.body.username || !req.body.password || !req.body.user.firstName
  || !req.body.user.lastName || !req.body.user.email) {
    return res.status(400).send({message: "One of the required fields is missing"});
  }
  next();
}

middlewareObj.isAdmin = function(req, res, next) {
    if (req.user.isAdmin === true) {
        return next();
    }
    res.status(401).send({message: "Unauthorized section"})
};

middlewareObj.noDuplicateLogin = function(req, res, next) {
    if (!req.user) {
        return next();
    }
    res.redirect("/dashboard");
};

middlewareObj.checkRememberMe = function(req, res, next) {
    if(req.body.rememberMe) {
      req.session.cookie.maxAge = config.cookieAge;
    }
    next();
};


module.exports = middlewareObj;
