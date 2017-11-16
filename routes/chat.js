module.exports=function(app, socketIoServer) {
    app.get('/chat',function(req,res){
        res.render('chat');
    });
    //
    // app.get('/:path',function(req,res){
    //     var path = req.params.path;
    //     console.log(path);
    //     console.log("Requested room "+path);
    //     res.render('room', {"hostAddress":socketIoServer});
    // });

};
