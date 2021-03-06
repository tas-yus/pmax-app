var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var expressSession = require("express-session");
var connectMongo = require("connect-mongo");
var MongoStore = connectMongo(expressSession);
var localStrategy = require("passport-local");
var app = express();
var multer = require("multer");
var Course = require("./models/course");
var User = require("./models/user");
var Part = require("./models/part");
var Video = require("./models/video");
var middleware = require("./middleware");
var seedDB = require("./seed");
var methodOverride = require("method-override");
var schedule = require('node-schedule');
var checkExpiry = require("./method/checkExpiry");
var path = require("path");
var config = require("./config");

// ======== ROUTES ========
// var indexRoutes = require("./routes/index");
// var courseRoutes = require("./routes/courses");
// var userRoutes = require("./routes/users");
// var partRoutes = require("./routes/parts");
// var videoRoutes = require("./routes/videos");
// var resourceRoutes = require("./routes/resources");
// var questionRoutes = require("./routes/questions");
// var answerRoutes = require("./routes/answers");
var adminApiRoutes = require("./routes/apiRoutes/admin");
var indexApiRoutes = require("./routes/apiRoutes/index");
var courseApiRoutes = require("./routes/apiRoutes/courses");
var partApiRoutes = require("./routes/apiRoutes/parts");
var questionApiRoutes = require("./routes/apiRoutes/questions");
var answerApiRoutes = require("./routes/apiRoutes/answers");
var userApiRoutes = require("./routes/apiRoutes/users");
var imageApiRoutes = require("./routes/apiRoutes/images");
var videoApiRoutes = require("./routes/apiRoutes/videos");
// ========================

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/pmaxapp", {useMongoClient: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
seedDB();

app.use(expressSession(
  {
    secret: "Hello World Hope You're Listening",
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: { maxAge: 30*3600*1000 },
    store  : new MongoStore({
        mongooseConnection : mongoose.connection
    })
  }
));
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());
// make your own
var passportOneSessionPerUser = require('passport-one-session-per-user');
passport.use(new passportOneSessionPerUser());
app.use(passport.authenticate('passport-one-session-per-user'));
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use(async function(req, res, next) {
  var user = req.user;
  user = await Video.populate(user, {
    path: "courses.mostRecentVideo.video",
    select: "code part title",
    populate: {
      path: "part",
      model: "Part"
    }
  });
  res.locals.user = user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// ======== ROUTES ========
// app.use("/", indexRoutes);
// app.use("/users", userRoutes);
// app.use("/courses", courseRoutes);
// app.use("/courses/:courseCode/parts", partRoutes);
// app.use("/courses/:courseCode/parts/:partCode/videos", videoRoutes);
// app.use("/courses/:courseCode/parts/:partCode/videos/:vidCode/resources", resourceRoutes);
// app.use("/courses/:courseCode", questionRoutes);
// app.use("/courses/:courseCode/parts/:partCode/videos/:vidCode/questions/:questionCode/answers", answerRoutes);
app.use("/api", indexApiRoutes);
app.use("/api/admin", adminApiRoutes);
app.use("/api/courses", courseApiRoutes);
app.use("/api/courses/:courseCode/parts", partApiRoutes);
app.use("/api", questionApiRoutes);
app.use("/api/questions/:questionCode/answers", answerApiRoutes);
app.use("/api/users", userApiRoutes);
app.use("/api/images", imageApiRoutes);
app.use("/api/courses/:courseCode/parts/:partCode/videos", videoApiRoutes);
// ========================

// AGENDA

// when delete course all resources should be deleted and all parts and all vids associated with it should be dispatched!
// Invoice model (confirmation)
// Notifications
// logging
// Sign Up - includes other info + in the database
// Add video model to course
// Credit card validation
// Fix chem 4,5,6 it stinks!!!!
// publish or no!
// find ways to sort query
// fix vid done();
// mostRecentVideo should be moved into course;
// fix all param routes so they dont crash
// Handle Await Errors!
// Check VIDEOS UPDATE AND CREATE
// REST APIS
// Continue with APIs & Now change everything to reflect the change in model
// FIX bug after check out , checkExpiry Fail!
// Reset "start" value to 0 when user finish vid.
// Choose ID or Code?
// Handle Manual done of admin or those who dont have access
// frontend validation for form

schedule.scheduleJob('0,30 5 5 * * *', function(){
    checkExpiry();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.render('index', {user: req.user});
});
//
// app.listen(3000, () => {
//    console.log("Server started");
// });

module.exports = app;
