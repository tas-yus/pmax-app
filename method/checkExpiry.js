var User = require("./../models/user");
var Course = require("./../models/course");
var method = require("./../method");
var Part = require("./../models/part");
var Order = require("./../models/order");
var async = require('async');

var checkExpiry = async function() {
  var users = await User.find({}).populate("courses.course").populate("parts.part").exec();
  async.forEach(users, (user, callback) => {
    console.log(`==== ${user.username} ====`);
    async.forEach(user.courses, (courseBundle, callback2) => {
      console.log(`${user.username}\'s `, courseBundle.course.title);
      if (method.checkCourseExpiry(courseBundle)) {
        async.waterfall([
          function (callback) {
            courseBundle.expired = true;
            var newOrder = new Order ({
              course: courseBundle.course, user, type: "expired"
            });
            Order.create(newOrder, (err, order) => {
              if (err) {
                return console.log(err);
              }
              callback(null, courseBundle, order);
            });
          },
          function(courseBundle, order, cb) {
            user.orders.push(order);
            user.save((err) => {
              if (err) {
                return console.log(err);
              }
              cb(null, courseBundle);
            })
          },
          function(courseBundle, cb) {
            Course.findById(courseBundle.course._id, (err, course) => {
              if (err) {
                return console.log(err);
              }
              course.users.filter(function(courseUser) { return !courseUser.equals(user._id) });
              if (!method.checkIfCourseContainsUserOfId(course.expiredUsers, user._id)) {
                course.expiredUsers.push(user);
              }
              cb(null, course);
            });
          },
          function(course, cb) {
            course.save((err) => {
              if (err) {
                return console.log(err);
              }
              cb();
            });
          }
        ], (err) => {
          if (err) {
            return console.log(err);
          }
          callback2();
        });
      } else {
        callback2();
      }
    }, (err) => {
      if (err) {
        return console.log(err);
      }
      callback();
    });
  });
};

module.exports = checkExpiry;
