/**
 * Created by Administrator on 2018/7/2.
 */
$(function(){
  $.ajax({
    type:'get',
    url:'/user/queryUserMessage',
    dataType:'json',
    success:function(info){
      console.log(info);
      if(info.error===400){
        //用户没有登录，直接跳转到登录页
        location.href = "login.html";
        return;
      }
      var htmlStr = template('tmp',info);
      $('#userInfo').html(htmlStr);
    }
  })
//  点击退出按钮，退出会员中心页，跳转到登录页
  $('#loginOut').click(function(){
    $.ajax({
      type:'get',
      url:'/user/logout',
      dataType:"json",
      success:function(info){
        console.log(info);
        if(info.success){
          //退出成功
          location.href = "login.html";
        }
      }
    })
  })
})