/**
 * Created by Administrator on 2018/7/2.
 */
$(function(){
  $('#loginBtn').click(function(){
    var username = $('[name = "username"]').val();
    var password = $('[name = "password"]').val();
    //console.log(username,password);
    if(!username){
      mui.toast('请输入用户名！');
    }
    if(!password){
      mui.toast('请输入密码！');
    }
    $.ajax({
      type:'post',
      url:'/user/login',
      data:{
        username:username,
        password:password
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.error){
          mui.toast('用户名或者密码错误！');
        }
        if(info.success){
        //  看地址栏有没有传地址，
        //  1、传地址，跳转到地址页面
        //  2、没传地址，跳转到用户页面
        //  console.log(location.search);
          if(location.search.indexOf('retUrl')>-1){
            var retUrl = location.search.replace('?retUrl=',"");
              location.href = retUrl;
          }else{
            //没传地址，跳到会员中心
            location.href = "user.html";
          }
        }
      }
    })
  })

})