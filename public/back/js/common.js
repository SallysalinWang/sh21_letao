/**
 * Created by Administrator on 2018/6/25.
 */


//ajax全局事件

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