$(document).ready(function(){
    var sectionUserAlert=  $('.sectionUser').find('.alertMessage');
    var user_id = $('input[name=hidden_id]');

    
    $( document).on("click",".like",function(event){
        event.preventDefault();
        $(this).parent().find('.post-interact');
        userId = $(this).parent().attr("user_id");
        postId =  $(this).parent().attr("post_id");
        $this = $(this);
        // fetch('api/v1/postId?query={"_id":"'+postId+'","user_id":"'+userId+'"}').populate({
        //             path: 'like',
        //             model: 'Like',
        //             select: 'is_like'
        //         }).then(function(res) {
        //     res.json().then(function (entries) {
        //         console.log(entries);
        //     });
        // });
        $.ajax({    
            method: 'POST',
            url: '/dashboard/like',
            data:{
                user_id:userId, 
                post_id:postId
            }

        }).done(function(res){
            console.log(res);
            // if(res)
            // {
            //     $data = JSON.parse(res);
            //     var likeSpan = $('.likeBadge').html();
            //     var parseSpan = parseInt(likeSpan);
            //     if($data.respondLike)
            //     {
            //        $this.parent().find('.likeBadge').html($data.likeCount);
            //         $this.html('Liked |');
            //     }
            //    else{
            //         $this.parent().find('.likeBadge').html($data.likeCount);
            //         $this.html('Like |');
            //      }
            // }
        });
    });
});
