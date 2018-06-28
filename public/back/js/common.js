/**
 * Created by Administrator on 2018/6/25.
 */

//5、判断用户有没有登录
if(location.href.indexOf('login.html') === -1){
  //如果索引为-1，说明用户还未登录，需拦截，跳转到登录页面
  $.ajax({
    type:'get',
    url:'/employee/checkRootLogin',
    dataType:'json',
    success:function(info){
      console.log(info);
      if(info.error=== 400){
        location.href = "login.html";
      }
      if(info.success ){
        console.log("用户登录成功");
      }
    }
  })
}

//1、ajax全局事件

//ajaxStart在ajax请求时触发
$(document).ajaxStart(function(){
  //开启进度条
  NProgress.start();
});

//ajaxStop 在ajax请求结束时触发
$(document).ajaxStop(function(){
  //关闭进度条
  setTimeout(function(){
    NProgress.done();
  },500)

});

//公共功能
$(function(){
  $('.nav .category').on('click',function(){
      $('.child').stop().slideToggle();
  });

// 2、 点击头部左侧菜单按钮，侧边栏显示隐藏
  $('.topbar .menuBtn').on('click',function(){
      $('.lt_aside').toggleClass('current');
    $('.lt_main').toggleClass('hidemenu');
    $('.topbar').toggleClass('hidemenu');
  })
});

//3、模态框的显示与隐藏
$('.icon_logout').on('click',function(){
  $('#myModal').modal('show');
});
//4、点击退出按钮，退出页面，到login页面
$('.logoutBtn').on('click',function(){
  $.ajax({
    type:'get',
    url:'/employee/employeeLogout',
    dataType:'json',
    success:function(info){
      console.log(info);
      if(info.success){
        location.href = "login.html";
      }
    }
  })
})

