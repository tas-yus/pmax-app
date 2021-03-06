var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    courses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        expired: {
            type: Boolean,
            default: false
        },
        numFinishedVideos: {
            type: Number,
            default: 0
        },
        expiredAt: {
            type: Date,
            default: Date.now() + 2*30*3600*24*1000
        },
        mostRecentVideo: {
            video: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            },
            start: {
              type: Number,
              default: 0
            }
        },
        _id: false
    }],
    // parts: [{
    //     part: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Part"
    //     },
    //     expiredAt: {
    //         type: Date,
    //     },
    //     expired: {
    //         type: Boolean,
    //         default: false
    //     },
    //     checked: {
    //         type: Boolean,
    //         default: false
    //     },
    //     _id: false
    // }],
    videos: [{
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
        finished: {
            type: Boolean,
            default: false
        },
        start: {
          type: Number,
          default: 0
        },
        _id: false
    }],
    cartCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            default: []
        }
    ],
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            default: []
        }
    ],
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer",
            default: []
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: []
        }
    ],
    image: String,
    isMaster: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isInstructor: {
        type: Boolean,
        default: false
    },
    phone: String,
    email: String,
    firstName: String,
    lastName: String,
    creditCard: Number,
    school: String,
    grade: Number
}, {
  timestamps: true
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.index({username: "text"});

module.exports = mongoose.model("User", UserSchema);
