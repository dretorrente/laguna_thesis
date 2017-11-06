var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var User = require('../models/user');
var Image = require('../models/image');
var Video = require('../models/video');
var moment = require('moment');
var fs = require('fs');
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
    // let image    = req.file.filename;
    //
    // let savemedia = new Media({
    //     name: image,
    //     user_id: user_id,
    //     post_id: user_post
    // });
    //
    // savepost.save(function(err){
    //     if (err) {
    //         console.log(err);
    //         res.send({success: false})
    //     }else{
    //         Post.findOne()
    //             .populate({
    //                 path: 'user_id',
    //                 model: User,
    //                 select: 'username upload'
    //             }).sort({_id:-1}).limit(1).exec()
    //             .then(data=>{
    //                 res.send({success: true, data:data, format_moment: moment()});
    //         }).catch(err=>{
    //             throw err;
    //         })
    //     }
    // });

});

module.exports = router;
