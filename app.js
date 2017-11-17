// Libraries
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    https = require('https');
var http = require('http');
var hat = require('hat');
var ws = require('ws');
// Load models
var User = require('./models/user');
var Like = require('./models/like');
var Comment = require('./models/comment');
var Post    = require('./models/post');
var Image   = require('./models/image');
//configurations
var options = {
  key: fs.readFileSync('./file.pem'),
  cert: fs.readFileSync('./file.crt')
};
var app = express(),
    mdbUrl = require('./config/database.js'),
    server = https.createServer(options, app);
    // server = http.createServer(app);
    io = require('socket.io').listen(server);

const restify = require('express-restify-mongoose');
const router = express.Router();
// view engine setup

// var index = require('./routes/index');
var auth = require('./routes/auth');
var dashboard = require('./routes/index');
// var wsServer = new ws.Server({ server: server });
var peers = {};
var waitingId = null;
var count = 0;
var nicknames =[];
var users = {};
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongoose.connect(mdbUrl.url, { useMongoClient: true },function(err) {

    if (err) {
        console.log('Unable to connect to mongoose');
        process.exit(1);
    }else {
        console.log("Connected to DB!");
    }

});
mongoose.Promise = global.Promise;
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

// Express Restify Mongoose
restify.serve(router, Post);
restify.serve(router, User);
restify.serve(router, Like);
restify.serve(router, Comment);
restify.serve(router, Image);

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());


// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/auth', auth);
app.use(function(req, res, next){
  if(req.isAuthenticated()){
    next();
    return;
  }
  res.redirect('/auth/login');
});
app.use('/', dashboard);
require('./routes/video')(app);
// require('./routes/chat')(app);

// io.sockets.on('connection', function (socket){
//     socket.on('send message',function(data){
//        io.sockets.emit('new message', data);
//     });
//
//
// });

io.sockets.on('connection', function (socket){
    socket.on('new user', function(data, callback){
        if(data in users){
           res.redirect('/auth/logout');
        } else{
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNicknames();
        }

    });

    function updateNicknames(){
        io.sockets.emit('usernames', Object.keys(users));
    }

    socket.on('send video',function(data,callback){
        callback(true);
        var roomUrl = data.roomUrl;
        var username = data.username.trim();
        for (var i = 0; i <= nicknames.length; i++) {
            if(username in users){
                users[username].emit('video-call',{room: roomUrl, nick: socket.nickname});
            }
        }
    });

    socket.on('disconnect',function(data){
        if(!socket.nickname) return;
        // console.log(socket.nickname);
        io.sockets.emit('usernames', Object.keys(users));
        delete users[socket.nickname];
        updateNicknames();
    });
	function log(){
        var array = [">>> Message from server: "];
        for (var i = 0; i < arguments.length; i++) {
	  	    array.push(arguments[i]);
        }
	    socket.emit('log', array);
	}

	socket.on('message', function (message) {
		log('Got message: ', message);
        socket.broadcast.to(socket.room).emit('message', message);
	});

	socket.on('create or join', function (message) {
        var room = message.room;
        socket.room = room;
        var participantID = message.from;
        configNameSpaceChannel(participantID);

		var numClients = io.sockets.clients(room).length;

		log('Room ' + room + ' has ' + numClients + ' client(s)');
		log('Request to create or join room', room);

		if (numClients == 0){
			socket.join(room);
			socket.emit('created', room);
		} else {
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		}
	});

    // Setup a communication channel (namespace) to communicate with a given participant (participantID)
    function configNameSpaceChannel(participantID) {
        var socketNamespace = io.of('/'+participantID);

        socketNamespace.on('connection', function (socket){
            socket.on('message', function (message) {
                // Send message to everyone BUT sender
                socket.broadcast.emit('message', message);
            });
        });
    }

});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
