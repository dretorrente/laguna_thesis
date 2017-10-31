'use strict';
 
module.exports=function(app, socketIoServer) {
    app.get('/',function(req,res){
        res.render('home');
    });
    
    app.get('/:path',function(req,res){
        var path = req.params.path;
        console.log(path);
		console.log("Requested room "+path);
        res.render('room', {"hostAddress":socketIoServer});  
    });
    
}