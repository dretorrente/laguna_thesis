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
            // if(res.respondLike) {
            //     $this.html('Liked |');
            // } else {
            //     $this.html('Like |');
            // }
            location.reload();
        });
    });
    $(document).on("click",".commentTag",function(event){
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
                    var html = '';
                    html += '<div class="row imageCol">'+
                                '<div class="col-md-1 ">'+
                                    '<a href="/dashboard/profile/'+res.user.username+'">'+
                                        '<img src="/images/'+res.user.upload+'" alt="sample profile pic" class="imageComment">'+
                                    '</a>'+
                                "</div>"+
                                    '<div class="col-md-10">'+
                                        '<a href="/dashboard/profile/'+res.user.username+'">'+
                                        res.user.username+
                                        '</a>'+
                                        '<p>Commented on '+moment(res.data.created_at).format("MMM DD, YYYY HH:mmA")+'</p>'+
                                        ' <div class="jumbotron commentArea">'+
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

    //share
    $(document).on("click",".share",function(event){
        event.preventDefault();
        var $this = $(this);
        var parent =  $this.parent().parent();
        var shareElement = parent.find('.contentPost').html();
        var galleryVideo =parent.find('.gallery .post-video');
        var galleryImage =parent.find('.gallery .eachImage');
        var userId = $this.parent().attr("user_id");
        var postId =  $this.parent().attr("post_id");

        if(galleryVideo.length > 0) {
            var videoElement = galleryVideo.find('.video_here').attr('src');
            $('#shareModal').modal('show');
            $('#shareModal').find('.modal-body').text(' Are you sure you want to share this Post?');
            $('#btnShare').unbind().click(function() {
                $.ajax({
                    method: 'POST',
                    url: '/dashboard/share',
                    data:{
                        user_id: userId,
                        status: shareElement,
                        video: videoElement
                    },
                    dataType: 'json'
                }).done(function(response){
                    $('#shareModal').modal('hide');
                    location.href = location.href;
                });
            });
        } else if(galleryImage.length > 0){
            var imageElement = galleryImage.find('img').attr('src');
            $('#shareModal').modal('show');
            $('#shareModal').find('.modal-body').text(' Are you sure you want to share this Post?');
            $('#btnShare').unbind().click(function() {
                $.ajax({
                    method: 'POST',
                    url: '/dashboard/share',
                    data:{
                        user_id: userId,
                        status: shareElement,
                        image: imageElement
                    },
                    dataType: 'json'
                }).done(function(response){
                    if(response.success) {
                        $('#shareModal').modal('hide');
                        location.href = location.href;
                    }
                });
            });
        } else {
            $('#shareModal').modal('show');
            $('#shareModal').find('.modal-body').text(' Are you sure you want to share this Post?');
            $('#btnShare').unbind().click(function() {
                $.ajax({
                    method: 'POST',
                    url: '/dashboard/share',
                    data:{
                        user_id: userId,
                        status: shareElement,
                    },
                    dataType: 'json'
                }).done(function(response){
                    if(response.success) {
                        $('#shareModal').modal('hide');
                        location.href = location.href;
                    }
                });
            });
        }
    });

    //messenger


    // $('.search').on('keyup', function(e){
    //     e.preventDefault();
    //     var inputbox = $('.search').val();
    //         var menu =   $(".menuItem");
    //     // var selectfilter = document.getElementById("searchfilter").value;
    //     inputbox = $.trim(inputbox);
    //     if(inputbox != ""){
    //         fetch('api/v1/User?query={"username":"'+inputbox+'"}').then(function(res) {
    //             res.json().then(function (entries) {
    //                 var output = '<ul>';
    //                 if(entries.length > 0){
    //                     entries.forEach(function(entry){
    //                         output += '<li onclick="fill('+entry.username+')">'+
    //                             '<a href="/dashboard/profile/'+entry.username+'">'+entry.username+'</a>'+
    //                             '</li>';
    //                         menu.css("display","block");
    //
    //                     });
    //                 } else {
    //                     menu.html("");
    //                     output='';
    //                 }
    //                 menu.html(output);
    //             });
    //         });
    //     } else {
    //         menu.html("");
    //         menu.css("display","none");
    //     }
    // });

    $('#searchButton').on('click', function(e) {
        e.preventDefault();
        var inputbox = $('.search').val();
        var menu = $(".menuItem");
        // var selectfilter = document.getElementById("searchfilter").value;
        inputbox = $.trim(inputbox);
        if (inputbox != "") {
            $.ajax({
                //AJAX type is "Post".
                type: "POST",
                //Data will be sent to "ajax.php".
                url: "/dashboard/search",
                //Data, that will be sent to "ajax.php".
                data: {search: inputbox},
                dataType: 'json',
                //If result found, this funtion will be called.
                success: function(res) {
                    var output = '';
                    if(res.success) {
                        output += '<ul>'+
                            '<li onclick="fill('+res.username+')">'+
                                        '<a href="/dashboard/profile/'+res.username+'">'+res.username+'</a>'+
                                    '</li>'+
                            '</ul>';
                        menu.css("display","block");
                        menu.html(output);
                    } else {
                        menu.html("");
                        output='';
                    }
                }
            });
        }else {
            menu.html("");
            menu.css("display","none");
        }
    });

});
