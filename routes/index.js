let express = require('express'),
    router = express.Router(),
    Post = require('../models/post');
var User = require('../models/user');
var Image = require('../models/image');
var Video = require('../models/video');
let Like = require('../models/like');
var moment = require('moment');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectId;
let multer = require('multer');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/images/post-images/');
    },
    filename: function (req, file, callback) {
        callback(null,Date.now() + "-" + file.originalname);
    }
});
let uploads = multer({ storage : storage});
router.get('/', function(req, res, next) {
    var count = Post.count();
        if (count === 0) {
            console.log("Post is empty.");
        } else {
            Post.find()
                .populate({
                    path: 'image',
                    model: Image,
                    select: 'name'
                })
                .populate({
                    path: 'video',
                    model: Video,
                    select: 'name'
                })
                .populate({
                    path: 'user_id',
                    model: User,
                    select: 'username upload'
                }).sort({created_at:-1}).exec()
                .then(data=>{
                    console.log("Posts entries loaded.", data);
                    res.render('dashboard', { user_id: req.user.id, posts:data, format_moment:moment });
                }).catch(err=>{
                throw err;
            })
        }
});

router.post('/createpost', uploads.single('postimage'), function(req, res, next) {
    let user_post = req.body.post;
    let user_id    = req.body.hidden_id;
    let savepost = new Post({
        status: user_post,
        user_id: user_id
    });
    if(req.file !== undefined) {
        let image    = req.file.filename;
        var ext = image.substr(image.lastIndexOf('.') + 1);
        if(ext === 'jpg' || ext === 'png' || ext === 'jpeg') {
            let savemedia = new Image({
                name: image
            });
            savemedia.save(function(err){
                if (err) {
                    console.log(err);
                    fs.unlinkSync('public/images/post-images/' + image);
                }else{
                    Image.findOne().sort({_id:-1}).limit(1).exec()
                        .then(data=>{
                            let savepost = new Post({
                                status: user_post,
                                user_id: user_id,
                                image: data._id
                            });
                            savepost.save();
                            req.flash('success_msg', 'Successfully posted.');
                            res.redirect('/dashboard');
                        }).catch(err=>{
                        throw err;
                    });
                }
            });
        } else if(ext === 'mp4'){
            let savevideo = new Video({
                name: image
            });
            savevideo.save(function(err){
                if (err) {
                    console.log(err);
                    fs.unlinkSync('public/images/post-images/' + image);
                }else{
                    Video.findOne().sort({_id:-1}).limit(1).exec()
                        .then(data=>{
                            let savepost = new Post({
                                status: user_post,
                                user_id: user_id,
                                video: data._id
                            });
                            savepost.save();
                            req.flash('success_msg', 'Successfully posted.');
                            res.redirect('/dashboard');
                        }).catch(err=>{
                        throw err;
                    });
                }
            });
        } else {
            req.flash('error_msg', 'Invalid media.');
            res.redirect('/dashboard');
        }

    }else{
        savepost.save();
        req.flash('success_msg', 'Successfully posted.');
        res.redirect('/dashboard');
    }
    savepost.save();
});

router.post('/like', function(req, res, next) {
    let post_id = req.body.post_id;
    let user_id = req.body.user_id;
    let auth_id = req.user.id;
    Like.find({post_id:ObjectId(post_id), user_id:ObjectId(user_id)},function(err, data){
        if(data.length >0) {
            var respondLike = data[0].is_like ? false : true;
            Like.update({ 'post_id': ObjectId(post_id), 'user_id': ObjectId(user_id)}, {$set: {is_like:respondLike}}, function(err, entry) {
                if(err) {
                    console.log(err);
                } else{
                    console.log(entry);
                    res.send({respondLike:respondLike});
                }
            });
        } else{
            let saveLike = new Like({
                is_like: 1,
                user_id: user_id,
                post_id: post_id
            });

            saveLike.save(function(err){
                if(err){
                    console.log(err);
                } else{
                    res.send({respondLike: 1});
                }
            });
       }    
    });
    // console.log(Like.count());
    // like.count({post_id:post_id},function(count){
        
       // if(count != null) {
       //      Like.findOne({post_id: post_id, user_id: user_id},function(err, entry){
       //          console.log(entry);
       //           res.send({success: 'false'});
       //      });
       // } else{
       //      let saveLike = new Like({
       //          is_like: 1,
       //          user_id: user_id,
       //          post_id: post_id
       //      });

       //      saveLike.save(function(err){
       //          if(err){
       //              console.log(err);
       //          } else{
       //              res.send({respondLike: 1});
       //          }
       //      });
       // }    
    // });
    // Like.findOne({_id: post_id, user_id: user_id},function(err, data){
    //     if(data != null){
    //         console.log(1);
    //     }else{
    //         console.log(2);
    //     }
    // });
    
    // console.log("ASDASD",req.body);
   
});
module.exports = router;
