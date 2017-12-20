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

module.exports = router;
