$(document).ready(function(){
    var sectionUserAlert=  $('.sectionUser').find('.alertMessage');
    var user_id = $('input[name=hidden_id]');

    $('#createPost').on('click','#btnAdd',function(e){
        e.preventDefault();
        var addPost = $('textarea[name=post]');
        var result = '';
        if(addPost.val()===''){
            addPost.parent().addClass('has-error');
            sectionUserAlert.removeClass('alert-success');
            sectionUserAlert.addClass('alert-danger');
            sectionUserAlert.html('Tweet cannot be empty').fadeIn().delay(1500).fadeOut('slow');
        }
        else if(addPost.val().length > 140){
            addPost.parent().addClass('has-error');
            sectionUserAlert.removeClass('alert-success');
            sectionUserAlert.addClass('alert-danger');
            sectionUserAlert.html('Tweet cannot be more than 140 characters').fadeIn().delay(1500).fadeOut('slow');
        }
        else{
            addPost.parent().removeClass('has-error');
            sectionUserAlert.removeClass('alert-success');
            sectionUserAlert.removeClass('alert-danger');
            result +='1';
        }
        if(result==='1'){
            $.ajax({
                method: 'post',
                url: '/dashboard/createpost',
                data: {post: addPost.val(), user_id: user_id.val()},
                dataType: 'json'
            }).done(function(response){
                addPost.val('');
                var html = '';
                console.log(response);
            });
        }
    });
});