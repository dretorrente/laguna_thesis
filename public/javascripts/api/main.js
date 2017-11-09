$(document).ready(function(){
    var sectionUserAlert=  $('.sectionUser').find('.alertMessage');
    var user_id = $('input[name=hidden_id]');

    
    $( document).on("click",".like",function(event){
        event.preventDefault();
        $(this).parent().find('.post-interact');
        var userId = $(this).parent().attr("user_id");
        var postId =  $(this).parent().attr("post_id");
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
        });
    });
    $( document).on("click",".commentTag",function(event){
        event.preventDefault();
        $(this).parent().find(".form-comment").toggle().find('.commentBox').focus();

    });


    $( document).on("click",".commentSubmit",function(event){
        event.preventDefault();
        var $this = $(this);
        var addComment = $this.parent().find('.comment-group').find('.commentBox');
        var user_id = $this.parent().parent().parent().attr("user_id");
        var post_id = $this.parent().parent().parent().attr("post_id");
        var result = '';
        if(addComment.val()===''){
            addComment.parent().addClass('has-error');
        }else{
            addComment.parent().removeClass('has-error');
            result +='1';
        }
        var commentPostID = $this.parent().find('.hiddenPost').val();
        var comment = $this.parent().find('.commentBox').val();

        if(result==='1'){
            $.ajax({
                method: 'POST',
                url: "/dashboard/createComment",
                data: {user_id: user_id, post_id:post_id, comment:comment }
            }).done(function(res){
                if(res.success) {
                    console.log(res);

                    var html = '';
                    html += '<div class="row imageCol">'+
                                '<div class="col-md-1 ">'+
                                    '<img src="/images/'+res.user.upload+'" alt="sample profile pic" class="imageComment">'+
                                "</div>"+
                            '<div class="col-md-10">'+
                                res.user.username+
                                '<p>Commented on '+res.data.created_at+'</p>'+
                                ' <div class="jumbotron" id="commentArea">'+
                                    '<p class="contentComment">'+res.data.comment+'</p>'+
                                '</div>'+
                             '</div>'+
                        '</div>';
                    addComment.val('');
                    $this.parent().parent().find('.commentSection').append(html);
                    // var commentSpan = $this.parent().parent().parent().find('.commentBadge').html();
                    // var parseComment = parseInt(commentSpan);
                    // $this.parent().parent().parent().find('.commentBadge').html(parseComment+1);
                }

            });
        }
    });

});
