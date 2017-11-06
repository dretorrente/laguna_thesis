$(document).ready(function(){
    var sectionUserAlert=  $('.sectionUser').find('.alertMessage');
    var user_id = $('input[name=hidden_id]');

    // $('#createPost').on('click','#btnAdd',function(e){
    //     e.preventDefault();
    //     var addPost = $('textarea[name=post]');
    //     var data = $('#createPost').serialize();
    //     var filelist = document.getElementById("select_image").files || [];
    //     console.log(filelist[0].name);
    //     var result = '';
    //     if(addPost.val()===''){
    //         addPost.parent().addClass('has-error');
    //         sectionUserAlert.removeClass('alert-success');
    //         sectionUserAlert.addClass('alert-danger');
    //         sectionUserAlert.html('Post cannot be empty').fadeIn().delay(1500).fadeOut('slow');
    //     }
    //     else if(addPost.val().length > 140){
    //         addPost.parent().addClass('has-error');
    //         sectionUserAlert.removeClass('alert-success');
    //         sectionUserAlert.addClass('alert-danger');
    //         sectionUserAlert.html('Post cannot be more than 140 characters').fadeIn().delay(1500).fadeOut('slow');
    //     }
    //     else{
    //         addPost.parent().removeClass('has-error');
    //         sectionUserAlert.removeClass('alert-success');
    //         sectionUserAlert.removeClass('alert-danger');
    //         result +='1';
    //     }
    //     if(result==='1'){
    //         $.ajax({
    //             method: 'post',
    //             url: '/dashboard/createpost',
    //             data: {post: addPost.val(), user_id: user_id.val()},
    //             dataType: 'json'
    //         }).done(function(response){
    //             addPost.val('');
    //             var html = '';
    //             if(response.success){
    //                 sectionUserAlert.removeClass('alert-danger');
    //                 sectionUserAlert.addClass('alert-success');
    //                 sectionUserAlert.html('Post successfully created').fadeIn().delay(1500).fadeOut('slow');
    //                 html += '<div class="showdata-index col-md-6 col-md-offset-3">'+
    //                         '<article class="post">'+
    //                             '<div class="info postByUser">'+
    //                                 '<div class="row">'+
    //                                     '<div class="pic-user">'+
    //                                         '<a href="/profile/'+response.data.user_id.username+'"><img class="postImage img-circle" src="/images/'+response.data.user_id.upload+'"></a>'+
    //                                     '</div>'+
    //                                     '<div class="col-md-6 userName">'+
    //                                         '<h4 class="header-post-user">'+response.data.user_id.username+'</h4>'+
    //                                         '<p>'+"Posted on "+moment(response.data.created_at).format("MMM DD, YYYY HH:mmA")+'</p>'+
    //                                     '</div>'+
    //                                 '</div>'+
    //                             '</div>'+
    //                             '<p class="contentPost">'+response.data.status+'</p>'+
    //                             '<div class="interaction post-interact" user_id="'+response.data.user_id+'" post_id="'+response.data.id+'">'+
    //                                 '<a href="javascript:;" class="like">Like | </a>'+
    //                                 '<a href="javascript:;" class="comment">Comment | </a>'+
    //                                 '<a href="javascript:;" class="share">Share </a>'+
    //                             '</div>'+
    //                             '<div class="appendLike">Camsasota and 5 others like this</div>'+
    //                         '</article>'+
    //                         '</div>';
    //             }
    //             $('#section_posts').prepend(html);
    //         });
    // //     }
    // });
});
