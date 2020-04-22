const express = require('express');
var multer = require('multer');
var path = require('path');
var router = express.Router();
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
var uploadModel = require('../models/upload');

var imageData =uploadModel.find({});

var imageData =uploadModel.find({});
if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
  
   var Storage= multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
     }
  });
  
  var upload = multer({
    storage:Storage
  }).single('file');
  
  router.post('/upload', upload,function(req, res, next) {
    var imageFile=req.file.filename;
   var success =req.file.filename+ " uploaded successfully";
  
   var imageDetails= new uploadModel({
    imagename:imageFile
   });
   imageDetails.save(function(err,doc){
  if(err) throw err;
  
  imageData.exec(function(err,data){
  if(err) throw err;
  res.render('upload-file', { title: 'Upload File', records:data,   success:success });
  });
  
   });
  
    });
  

router.get('/', (req, res) => {
    res.render("movie/addOrEdit", {
        viewTitle: "Insert Movies"
    });
});

router.post('/',upload,(req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);

});


function insertRecord(req, res) {
    var movie = new Movie();
    movie.fullName = req.body.fullName;
    movie.image=req.file.filename;
    movie.summary = req.body.summary;
    movie.save((err, doc) => {
        if (!err)
            res.redirect('movie/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("movie/addOrEdit", {
                    viewTitle: "Insert movie",
                    movie: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Movie.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('movie/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("movie/addOrEdit", {
                    viewTitle: 'Update movie',
                    movie: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Movie.find((err, docs) => {
        if (!err) {
            res.render("movie/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving movie list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
                case 'image':
                body['fileError'] = err.errors[field].message;
                break;
                default:
                break;
            case 'summary':
                body['summaryError'] = err.errors[field].message;
                break;
            
        }
    }
}

router.get('/:id', (req, res) => {
    Movie.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("movie/addOrEdit", {
                viewTitle: "Update Movie",
                movie: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Movie.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/movie/list');
        }
        else { console.log('Error in movie delete :' + err); }
    });
});

module.exports = router;