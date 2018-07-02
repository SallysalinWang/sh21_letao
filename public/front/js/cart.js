/**
 * Created by Administrator on 2018/7/2.
 */
$(function(){
  //一进入购物车，获取购物车数据，进行模板渲染

  function render(){
    setTimeout(function(){
      $.ajax({
        type:'get',
        url:'/cart/queryCart',
        dataType:'json',
        success:function(info){
          console.log(info);
          var htmlStr = template('tmp',{arr:info});
          $('.lt_main .mui-table-view').html(htmlStr);
        //  页面渲染完成，结束下拉刷新
          mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
        }
      });
    },500);

  }
//  页面下拉刷新
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback :function(){//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          render();
        }
      }
    }
  });
//删除购物车商品功能
  $('.lt_main').on('tap','.btn_delete',function(){
    var id = $(this).data('id');
    $.ajax({
      type:'get',
      url:'/cart/deleteCart',
      data:{
        id:[id]
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.success){
        //  重新刷新一次，调用一次下拉刷新
          mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
        }

      }
    })
  })

//  编辑购物车商品功能
  $('.lt_main').on('tap','.btn_edit',function() {
    //   获取自定义属性
    var obj = this.dataset;
    var id = obj.id;
    console.log(obj);
    var htmlStr = template('editTmp', obj);
    //mui会默认将模板中的\n 替换成br标签
    htmlStr = htmlStr.replace(/\n/g, "");
    mui.confirm(htmlStr, '编辑商品', ["确认", '取消'], function (e) {
      if (e.index === 0) {
        var size = $('.lt_pro_size span.current').text();
        var num = $('.mui-numbox-input').val();
        $.ajax({
          type: 'post',
          url: '/cart/updateCart',
          data: {
            id: id,
            num: num,
            size: size
          },
          dataType: 'json',
          success: function (info) {
            //console.log(info);
            if (info.success) {
              mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
            }
          }
        })
      }
    });
    //  初始化数字框
    mui(".mui-numbox").numbox();

  });
  //  添加尺码选择功能
  $('body').on('click','.lt_pro_size span',function(){
    $(this).addClass('current').siblings().removeClass('current');
  })
    //  计价功能
    $('.lt_main').on('click','.ck',function(){
      var $all = $('.lt_main .ck:checked');
      var total = 0;
      $all.each(function(index,element){
        var num = $(this).data('num');
        var price = $(this).data('price');
        //console.log(num,price);
        total += num*price;

      });
      console.log(total);
      total = total.toFixed(2);
      $('.totalPrice').text(total);
    })
})