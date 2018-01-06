var express = require("express");
var router = express.Router();
var config = require("./../../config");
var middleware = require("./../../middleware");
var fs = require("fs");
var path = require("path");
var multer = require("multer");
var method = require("./../../method");
var processFormBody = multer({storage: multer.memoryStorage()}).single('file');

// var storage = multer.diskStorage({
//   destination: __dirname + config.imageApiPath,
//   filename: function (req, file, cb) {
//     var filename = req.body.fileName;
//     filename += path.extname(file.originalname);
//     cb(null, filename);
//   }
// });

// var upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 2 * 1024 * 1024 // 2mb, in bytes
//   },
//   onFileSizeLimit: function (file) {
//     file.error = {
//         message: "Upload failed",
//         status: MARankings.Enums.Status.FILE_TOO_LARGE
//     };
//   },
//   onFileUploadComplete: function (file, req, res) {
//     if (file.error){
//         res.status(400).send(file.error);
//     }
//   }
// });

// CREATE COURSE
router.post("/upload", middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
  processFormBody(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({err, message: "Something went wrong"});
    }
    if (!req.file) {
      return res.status(400).send({message: "No file received"});
    }
    // request.file has the following properties of interest
    //      fieldname      - Should be 'uploadedphoto' since that is what we sent
    //      originalname:  - The name of the file the user uploaded
    //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
    //      buffer:        - A node Buffer containing the contents of the file
    //      size:          - The size of the file in bytes
    if (req.file.size >= 3*1024*1024) {
      return res.status(400).send("File too large");
    }
    // We need to create the file in the directory "images" under an unique name. We make
    // the original file name unique by adding a unique prefix with a timestamp.
    var timestamp = new Date().valueOf();
    var filename = 'U' +  String(timestamp) + req.file.originalname;
    fs.writeFile(__dirname + config.imageApiPath + filename, req.file.buffer, function (err) {
      if (err) {
        console.log(err);
        return res.status(400).send({err, message: "Something went wrong"});
      }
      res.status(200).send({message: "File Uploaded!", filename});
    });
  });
});

router.get("/", (req, res) => {
  fs.readdir(__dirname + config.imageApiPath, (err, imgPaths) => {
    if (err) {
      return res.status(400).send({err, message: "Something went wrong"});
    }
    res.status(200).send(imgPaths);
  });
});

module.exports = router;
