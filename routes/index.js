let express = require('express'),
    router = express.Router(),
    Post = require('../models/post');
let User = require('../models/user'),
    Image = require('../models/image'),
    Video = require('../models/video'),
    Like = require('../models/like'),
    Comment = require('../models/comment');
    Thread = require('../models/thread');
    Message = require('../models/message');
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
    if(req.isAuthenticated()){
        res.redirect('/dashboard');
    } else{
        res.redirect('/auth/login');
    }
});
router.get('/dashboard', function(req, res, next) {
    var count = Post.count();
        if (count === 0) {
            console.log("Post is empty.");
        } else {

            Post.aggregate([
                { "$sort": { "created_at": 1 } },
                { "$lookup": {
                    "localField": "user_id",
                    "from": 'users',
                    "foreignField": "_id",
                    "as": "userinfo"
                } },
                {
                    $unwind: {
                        path: "$userinfo",
                        preserveNullAndEmptyArrays: true
                    }
                },
                { "$lookup": {
                    "localField": "video",
                    "from": 'videos',
                    "foreignField": "_id",
                    "as": "videoinfo"
                } },
                { "$lookup": {
                    "localField": "image",
                    "from": 'images',
                    "foreignField": "_id",
                    "as": "imageinfo"
                } },
                { "$lookup": {
                    "localField": "_id",
                    "from": 'likes',
                    "foreignField": "post_id",
                    "as": "likeinfo"
                } },
                { "$lookup": {
                    "localField": "user_shareid",
                    "from": 'users',
                    "foreignField": "_id",
                    "as": "usershareinfo"
                } },
                { "$lookup": {
                    "localField": "_id",
                    "from": 'comments',
                    "foreignField": "post_id",
                    "as": "commentinfo"
                } },
                {
                    $unwind: {
                        path: "$commentinfo",
                        preserveNullAndEmptyArrays: true
                    }
                },
                { "$project": {
                    "status": 1,
                    "created_at": 1,
                    "is_share": 1,
                    "userinfo.username": 1,
                    "userinfo.email": 1,
                    "userinfo._id" : 1,
                    "userinfo.upload": 1,
                    "videoinfo.name": 1,
                    "imageinfo.name": 1,
                    "likeinfo._id": 1,
                    "likeinfo.user_id":1,
                    "likeinfo.is_like": 1,
                    "likeinfo.post_id": 1,
                    "commentinfo.user_id" :1,
                    "commentinfo.comment":1,
                    "commentinfo.created_at": 1,
                    "usershareinfo.username": 1
                }},


                { "$group": {
                    _id: "$_id",
                    created_at: {$first: "$created_at"},
                    status: {$first:"$status"},
                    is_share: {$first:"$is_share"},
                    username: {$first: "$userinfo.username"},
                    email: {$first: "$userinfo.email"},
                    user_id: {$first: "$userinfo._id"},
                    upload: {$first: "$userinfo.upload"},
                    video: {$first: "$videoinfo.name"},
                    image: {$first: "$imageinfo.name"},
                    like: {
                        $first: "$likeinfo"
                    },
                    comment: {
                        $push: "$commentinfo"
                    },
                    user_share:  {$first: "$usershareinfo.username"},
                } },
                {
                    $unwind: {
                        path: "$likeinfo",
                        preserveNullAndEmptyArrays: true
                    }
                },
            ],function(err, results){
                var str = JSON.stringify(results, null, 4);
                var sample = [];
                // sample.push(results);
                console.log(str);
                User.find().exec(function(err, users){

                    res.render('dashboard', { auth: req.user,posts: results, format_moment: moment,users: users});
                });

            });
            // Post.find()
            //     .populate({
            //         path: 'image',
            //         model: Image,
            //         select: 'name'
            //     })
            //     .populate({
            //         path: 'video',
            //         model: Video,
            //         select: 'name'
            //     })
            //     .populate({
            //         path: 'user_id',
            //         model: User,
            //         select: 'username upload'
            //     }).aggregate([{
            //         $lookup:{
            //             from:
            //         }
            //     }]).sort({created_at:-1}).exec()
            //     .then(data=>{
            //         console.log("Posts entries loaded.", data);
            //
            //     }).catch(err=>{
            //     throw err;
            // })
        }

});

router.post('/dashboard/createpost', uploads.single('postimage'), function(req, res, next) {
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
});

router.post('/dashboard/like', function(req, res, next) {
    let post_id = req.body.post_id;
    let user_id = req.body.user_id;
    let auth_id = req.user._id;

    Like.find({post_id:ObjectId(post_id), user_id:ObjectId(auth_id)},function(err, data){
        if(data.length >0) {
            var respondLike = data[0].is_like ? false : true;
            Like.update({ 'post_id': ObjectId(post_id), 'user_id': ObjectId(auth_id)}, {$set: {is_like:respondLike}}, function(err, entry) {
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
                user_id: auth_id,
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
   
});

router.post('/dashboard/createComment', function(req, res, next) {
    let auth_id = req.user._id,
        user_id = req.body.user_id,
        comment = req.body.comment,
        post_id = req.body.post_id;
    let savecomment = new Comment({
        comment: comment,
        user_id: auth_id,
        post_id: post_id
    });

    savecomment.save(function(err, data){
        if(err){
            res.send({success: false});
        } else{

            res.send({data: data,user:req.user, success: true});
        }
    });

});

router.post('/dashboard/share', function(req, res, next) {
    let user_id = req.body.user_id;
    let auth_id = req.user._id;
    let status = req.body.status;
    if(req.body.video) {
        var shareVideo = req.body.video;
        var del = '/',
            st = 3,
            token = shareVideo.split(del).slice(st),
            video = token.join(del);
        let savevideo = new Video({
            name: video
        });
        savevideo.save(function(err){
            if (!err) {
                Video.findOne().sort({_id:-1}).limit(1).exec()
                    .then(data=>{
                        let savepost = new Post({
                            status: status,
                            user_id: auth_id,
                            video: data._id,
                            user_shareid: user_id,
                            is_share: true
                        });
                        savepost.save();
                        req.flash('success_msg', 'Successfully posted.');
                        res.send({success:true});
                    }).catch(err=>{
                    throw err;
                });
            }
        });
    } else if(req.body.image) {
        var shareImage = req.body.image;
        var delimiter = '/',
            start = 3,
            tokens = shareImage.split(delimiter).slice(start),
            result = tokens.join(delimiter);
        let savemedia = new Image({
            name: result
        });
        savemedia.save(function(err){
            if (!err) {
                Image.findOne().sort({_id:-1}).limit(1).exec()
                    .then(data=>{
                        let savepost = new Post({
                            status: status,
                            user_id: auth_id,
                            image: data._id,
                            user_shareid: user_id,
                            is_share: true
                        });
                        savepost.save();
                        req.flash('success_msg', 'Successfully posted.');
                        res.send({success:true});
                    }).catch(err=>{
                    throw err;
                });
            }
        });
    } else {
        let savepost = new Post({
            status: status,
            user_shareid: user_id,
            user_id: auth_id,
            is_share: true
        });
        savepost.save();
        req.flash('success_msg', 'Successfully posted.');

    }

});

router.get('/dashboard/profile/:username', function(req, res, next){
    var username = req.params.username;
    var collection = User.find();
    collection.findOne({ username:username }, function(err, user) {
        res.render('profile',{auth:req.user,user:user,format_moment: moment});
    });

});
router.post('/dashboard/search',function(req,res,next){
    var username = req.body.search;
    var collection = User.find();
    collection.findOne({ username:username }, function(err, user) {
        if(!user) {
            res.send({success:false});
        } else{
            res.send({success:true, username: user.username});
        }
    });
});
router.get('/chatroom', function(req, res, next){
    User.find({ username: { $nin: req.user.username } },function(err, users){
        res.render('chatlist',{auth: req.user, users:users});
    });
});

router.get('/chatroom/:thread/:receiver', function(req, res, next){
    var receiver = req.params.receiver;
    var thread = req.params.thread;

    Message.find()
        .populate({
            path: thread,
            model: Thread,
            select: 'thread_id  sender_id receiver_id message status created_at'
        }).sort({created_at:1}).exec()
        .then(data=>{
            User.find({},function(err, users){
                res.render('chatroom',{auth: req.user, users:users,receiver:receiver,thread:thread, messages:data,format_moment: moment});
            });
        }).catch(err=>{
        throw err;
    });

    //
    //
    //


});

router.post('/dashboard/createThread', function(req, res, next){
    var receiver = req.body.receiver;
    var sender = req.user.id;
    User.findOne({username:receiver},function(err,user){
        if(user != null) {
            Message.findOne({$or: [{receiver_id: user._id,sender_id:sender}, {receiver_id: sender,sender_id:user._id}]}).limit(1).exec()
                .then(data=>{
                    if(data != null) {
                        res.send({success:false, id:data.thread_id});
                    } else{
                        let savethread = new Thread();

                        savethread.save(function(err, data){
                            if (!err) {
                                Thread.findOne().sort({_id:-1}).limit(1).exec()
                                    .then(data=>{
                                        res.send({success:true, id:data._id});
                                    }).catch(err=>{
                                    throw err;
                                });
                            }
                        });
                    }

                    // res.send({success:true});
                }).catch(err=>{
                throw err;
            });
        }
    });




});
router.post('/dashboard/getusers', function(req, res, next){
    let users = JSON.parse(req.body.users);
        let collection = User.find();
        collection.find({ username: { $in: users }}, function (err, entries) {
            if (err) return console.log(err);
            res.json({ users: entries });
        });
});
module.exports = router;
