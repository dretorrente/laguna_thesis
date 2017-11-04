var express = require('express');
var router = express.Router();
var Post = require('../models/post');

/* GET home page. */
// router.get('/home', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', function(req, res, next) {
  res.render('dashboard', { user_id: req.user.id });
});

router.get('/dummy', function(req, res, next) {
    res.render('dummy', { title: 'Express' });
});
router.post('/createpost', function(req, res, next) {
    var user_post = req.body.post;
    var user_id    = req.body.user_id;

    var savepost = new Post({
        name: user_post,
        user_id: user_id
    });

    savepost.save(function(err){
        if (err) {
            console.log(err);
            res.send({success: false})
        }else{
            res.send({success: true})
        }
    });
});

module.exports = router;
