$(document).ready(function(){
    var sectionUserAlert=  $('.sectionUser').find('.alertMessage');
    var user_id = $('input[name=hidden_id]');

    
    $( document).on("click",".like",function(event){
        event.preventDefault();
        $(this).parent().find('.post-interact');
        userId = $(this).parent().attr("user_id");
        postId =  $(this).parent().attr("post_id");
        $this = $(this);
        $.ajax({    
            method: 'POST',
            url: '/dashboard/like',
            data:{
                user_id:userId, 
                post_id:postId
            }
        }).done(function(res){
            if(res.respondLike) {
                $this.html('Liked |');
            } else {
                $this.html('Like |');
            }
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
